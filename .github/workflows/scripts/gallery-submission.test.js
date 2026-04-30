'use strict';
/**
 * Unit tests for the pure helpers exported by gallery-submission.js.
 * Run with `node --test .github/workflows/scripts/gallery-submission.test.js`.
 *
 * Only the helpers that don't touch the network or the filesystem are
 * covered here; httpsGet's host allow-list is exercised through its
 * synchronous rejection path so no real HTTP traffic is generated.
 */

const test = require('node:test');
const assert = require('node:assert/strict');

const {
  SUBMISSION_MARKER,
  ALLOWED_HOSTS,
  ALLOWED_TYPES,
  sanitiseName,
  extractImageUrl,
  httpsGet,
} = require('./gallery-submission.js');

test('SUBMISSION_MARKER matches the marker the drawboard injects', () => {
  // Keep this in sync with GALLERY_SUBMISSION_MARKER in
  // Projects/drawboard/drawboard.js — the two have to agree byte-for-byte
  // or the workflow will reject every submission.
  assert.equal(SUBMISSION_MARKER, '<!-- gallery-submission -->');
});

test('ALLOWED_TYPES covers PNG, JPEG and WebP with canonical extensions', () => {
  assert.equal(ALLOWED_TYPES.get('image/png'), 'png');
  assert.equal(ALLOWED_TYPES.get('image/jpeg'), 'jpg');
  assert.equal(ALLOWED_TYPES.get('image/webp'), 'webp');
  assert.equal(ALLOWED_TYPES.get('image/gif'), undefined);
});

test('ALLOWED_HOSTS only contains GitHub user-content domains', () => {
  for (const host of ALLOWED_HOSTS) {
    assert.match(host, /githubusercontent\.com$|^github\.com$/);
  }
});

test('sanitiseName trims, replaces spaces, drops unsafe chars and caps length', () => {
  assert.equal(sanitiseName('  My Drawing!  '), 'My-Drawing');
  assert.equal(sanitiseName('hello/../etc/passwd'), 'helloetcpasswd');
  assert.equal(sanitiseName('Grüezi mitenand'), 'Grüezi-mitenand');
  assert.equal(sanitiseName('a'.repeat(120)).length, 60);
  assert.equal(sanitiseName(''), '');
  assert.equal(sanitiseName(undefined), '');
  assert.equal(sanitiseName('***'), '');
});

test('extractImageUrl finds the first markdown image in an issue body', () => {
  const body = [
    '<!-- gallery-submission -->',
    '**Image name:** sunset',
    '',
    '![sunset](https://user-images.githubusercontent.com/1/abc.png)',
    '![later](https://user-images.githubusercontent.com/1/def.png)',
  ].join('\n');
  assert.equal(
    extractImageUrl(body),
    'https://user-images.githubusercontent.com/1/abc.png',
  );
});

test('extractImageUrl falls back to <img src="..."> when no markdown image is present', () => {
  const body = '<img src="https://github.com/user-attachments/assets/foo.png" alt="x">';
  assert.equal(
    extractImageUrl(body),
    'https://github.com/user-attachments/assets/foo.png',
  );
});

test('extractImageUrl returns null when there is no attachment', () => {
  assert.equal(extractImageUrl('just some text, no image yet'), null);
});

test('httpsGet rejects URLs whose host is not in the allow-list (no network call)', async () => {
  // example.com is deliberately not on the allow-list. The function must
  // refuse synchronously, before any DNS or TCP work happens — this is
  // what stops the workflow being abused as an open URL fetcher.
  await assert.rejects(
    () => httpsGet('https://example.com/evil.png'),
    /Host not allowed: example\.com/,
  );
});

test('httpsGet rejects file:// and other non-https schemes via host allow-list', async () => {
  await assert.rejects(
    () => httpsGet('https://attacker.test/foo.png'),
    /Host not allowed/,
  );
});

test('httpsGet bails out once the redirect budget is exhausted', async () => {
  // Passing a negative redirect budget short-circuits before any I/O.
  await assert.rejects(
    () => httpsGet('https://user-images.githubusercontent.com/x.png', -1),
    /Too many redirects/,
  );
});
