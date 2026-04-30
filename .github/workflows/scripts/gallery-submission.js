#!/usr/bin/env node
/**
 * Parses an issue body submitted from the drawboard, downloads the
 * attached image, places it under Gallery/images/ and writes
 * GitHub Actions outputs that the surrounding workflow uses to open a
 * pull request.
 *
 * Inputs (env):
 *   ISSUE_NUMBER, ISSUE_TITLE, ISSUE_BODY, ISSUE_AUTHOR
 *
 * Outputs (GITHUB_OUTPUT):
 *   status        = ready | needs-attachment | rejected
 *   reason        = human-readable reason when status != ready
 *   safe_name     = sanitised image name
 *   image_path    = path of the downloaded image, relative to repo root
 *   thumb_path    = path of the generated webp thumbnail
 *   branch        = git branch name to push to
 */
'use strict';

const fs = require('fs');
const path = require('path');
const https = require('https');
const { execFileSync } = require('child_process');

const SUBMISSION_MARKER = '<!-- gallery-submission -->';
const MAX_BYTES = 5 * 1024 * 1024; // 5 MB cap for downloaded attachments

// Only attachments hosted on GitHub-controlled domains are accepted.
// This prevents the workflow from being abused as an arbitrary URL
// downloader through crafted issue bodies.
const ALLOWED_HOSTS = new Set([
  'user-images.githubusercontent.com',
  'private-user-images.githubusercontent.com',
  'github.com', // user-attachments redirect through github.com/user-attachments/...
  'raw.githubusercontent.com',
  'objects.githubusercontent.com',
]);

// Allowed image content types and their canonical extensions.
const ALLOWED_TYPES = new Map([
  ['image/png', 'png'],
  ['image/jpeg', 'jpg'],
  ['image/webp', 'webp'],
]);

const setOutput = (key, value) => {
  const out = process.env.GITHUB_OUTPUT;
  if (!out) {
    console.log(`::set-output name=${key}::${value}`); // local dev fallback
    return;
  }
  // Use the multiline-safe heredoc form to avoid issues with newlines.
  fs.appendFileSync(out, `${key}<<__EOF__\n${value}\n__EOF__\n`);
};

const finish = (status, extras = {}) => {
  setOutput('status', status);
  for (const [k, v] of Object.entries(extras)) setOutput(k, v);
  if (status !== 'ready') console.log(`Submission status: ${status}`, extras);
  process.exit(0);
};

const sanitiseName = (name) => {
  // Mirror the drawboard's normaliseName so the generated filename matches
  // what the user typed.
  return String(name || '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-zA-Z0-9äöüÄÖÜß_-]/g, '')
    .slice(0, 60);
};

const extractImageUrl = (body) => {
  // First markdown image: ![alt](url)
  const mdImage = body.match(/!\[[^\]]*\]\((https?:\/\/[^\s)]+)\)/);
  if (mdImage) return mdImage[1];
  // Bare HTML <img src="...">
  const htmlImage = body.match(/<img[^>]+src=["'](https?:\/\/[^"']+)["']/i);
  if (htmlImage) return htmlImage[1];
  return null;
};

const httpsGet = (url, redirectsLeft = 5) => new Promise((resolve, reject) => {
  if (redirectsLeft < 0) return reject(new Error('Too many redirects'));
  const u = new URL(url);
  if (!ALLOWED_HOSTS.has(u.hostname)) {
    return reject(new Error(`Host not allowed: ${u.hostname}`));
  }
  https.get(url, { headers: { 'User-Agent': 'gallery-submission-bot' } }, (res) => {
    if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
      res.resume();
      const next = new URL(res.headers.location, url).toString();
      return resolve(httpsGet(next, redirectsLeft - 1));
    }
    if (res.statusCode !== 200) {
      res.resume();
      return reject(new Error(`HTTP ${res.statusCode} fetching ${url}`));
    }
    const chunks = [];
    let total = 0;
    res.on('data', (chunk) => {
      total += chunk.length;
      if (total > MAX_BYTES) {
        res.destroy(new Error(`Image exceeds ${MAX_BYTES} byte cap`));
        return;
      }
      chunks.push(chunk);
    });
    res.on('end', () => resolve({
      buffer: Buffer.concat(chunks),
      contentType: (res.headers['content-type'] || '').split(';')[0].trim().toLowerCase(),
    }));
    res.on('error', reject);
  }).on('error', reject);
});

async function main() {
  const issueNumber = process.env.ISSUE_NUMBER;
  const body = process.env.ISSUE_BODY || '';
  const title = process.env.ISSUE_TITLE || '';

  if (!body.includes(SUBMISSION_MARKER)) {
    return finish('rejected', { reason: 'Missing submission marker; this issue does not look like a drawboard submission.' });
  }

  // The drawboard places `**Image name:** <name>` (or its translated
  // equivalents) into the body. Try to recover the name from there;
  // otherwise fall back to the issue title.
  const nameMatch = body.match(/\*\*[^*]+\*\*\s*:\s*([^\n]+)/);
  const candidateName = nameMatch ? nameMatch[1] : title.replace(/^[^:]*:\s*/, '');
  const safeName = sanitiseName(candidateName);
  if (!safeName) {
    return finish('rejected', { reason: 'Could not derive a valid image name.' });
  }

  const imageUrl = extractImageUrl(body);
  if (!imageUrl) {
    return finish('needs-attachment');
  }

  let download;
  try {
    download = await httpsGet(imageUrl);
  } catch (err) {
    return finish('rejected', { reason: `Could not download attachment: ${err.message}` });
  }

  const ext = ALLOWED_TYPES.get(download.contentType);
  if (!ext) {
    return finish('rejected', { reason: `Unsupported image type "${download.contentType}". Please attach a PNG, JPG or WebP.` });
  }

  // Magic-byte sanity check — guard against a misleading content-type.
  const head = download.buffer.subarray(0, 12);
  const looksPng = head[0] === 0x89 && head[1] === 0x50 && head[2] === 0x4e && head[3] === 0x47;
  const looksJpg = head[0] === 0xff && head[1] === 0xd8 && head[2] === 0xff;
  const looksWebp = head.subarray(0, 4).toString('ascii') === 'RIFF' && head.subarray(8, 12).toString('ascii') === 'WEBP';
  if (!(looksPng || looksJpg || looksWebp)) {
    return finish('rejected', { reason: 'Attachment does not look like a valid image file.' });
  }

  const repoRoot = process.cwd();
  const imagesDir = path.join(repoRoot, 'Gallery', 'images');
  const thumbsDir = path.join(imagesDir, 'thumbs');
  fs.mkdirSync(thumbsDir, { recursive: true });

  // Avoid clobbering an existing image: append a numeric suffix if needed.
  let finalName = safeName;
  let suffix = 1;
  while (fs.existsSync(path.join(imagesDir, `${finalName}.${ext}`))) {
    suffix += 1;
    finalName = `${safeName}-${suffix}`;
  }
  const imagePath = path.join('Gallery', 'images', `${finalName}.${ext}`);
  const thumbPath = path.join('Gallery', 'images', 'thumbs', `${finalName}.webp`);
  fs.writeFileSync(path.join(repoRoot, imagePath), download.buffer);

  // Generate WebP thumbnail (max 800 px wide, q 78) — same parameters as
  // the bulk-thumbnail workflow.
  try {
    execFileSync('cwebp', ['-quiet', '-q', '78', '-resize', '800', '0',
      path.join(repoRoot, imagePath), '-o', path.join(repoRoot, thumbPath)],
      { stdio: 'inherit' });
  } catch (err) {
    return finish('rejected', { reason: `Thumbnail generation failed: ${err.message}` });
  }

  finish('ready', {
    safe_name: finalName,
    image_path: imagePath,
    thumb_path: thumbPath,
    branch: `gallery-submission/${issueNumber}-${finalName}`,
  });
};

// Expose pure helpers for unit testing. The async workflow above is only
// executed when this file is invoked as a script (i.e. by the workflow),
// so `require()`-ing it from a test file is side-effect free.
module.exports = {
  SUBMISSION_MARKER,
  MAX_BYTES,
  ALLOWED_HOSTS,
  ALLOWED_TYPES,
  sanitiseName,
  extractImageUrl,
  httpsGet,
};

if (require.main === module) {
  main().catch((err) => {
    finish('rejected', { reason: `Unexpected error: ${err.message}` });
  });
}
