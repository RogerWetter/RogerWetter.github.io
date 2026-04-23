const galleryGrid = document.getElementById('gallery-grid');
const galleryStatus = document.getElementById('gallery-status');
const galleryRandomBtn = document.getElementById('gallery-random-btn');
const githubOwner = 'RogerWetter';
const githubRepo = 'RogerWetter.github.io';
const galleryStorageKey = 'rw.gallery.customImages';
const i18n = () => window.RW_I18N;

const supportedImageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif', '.heic', '.heif'];

const isSupportedImage = (name) =>
  supportedImageExtensions.some((extension) => name.toLowerCase().endsWith(extension));

const isSafeDataImage = (url) => /^data:image\/(png|jpeg|jpg|webp|gif|avif);base64,/i.test(url);

let renderedItems = [];
let loadedImagesCache = [];
let galleryLoaded = false;
let lastGalleryErrorStatus = null;

const t = (key, values = {}) => i18n()?.t(key, values) ?? key;
const getImageWordForCount = (count) => count === 1 ? t('gallery.image.one') : t('gallery.image.many');
const getRandomItem = (items) => items[Math.floor(Math.random() * items.length)];
const isValidDrawboardImage = (image) =>
  image &&
  typeof image.name === 'string' &&
  typeof image.url === 'string' &&
  isSafeDataImage(image.url);

const renderImages = (images) => {
  galleryGrid.innerHTML = '';
  renderedItems = [];
  galleryLoaded = true;
  lastGalleryErrorStatus = null;

  loadedImagesCache = images;

  if (!images.length) {
    galleryStatus.textContent = t('gallery.empty');
    return;
  }

  let ownImages = 0;

  images.forEach((image) => {
    const item = document.createElement('li');
    item.classList.add('gallery__item');
    if (image.source === 'drawboard') {
      item.classList.add('gallery__item--local');
      ownImages += 1;
    }

    const link = document.createElement('a');
    link.classList.add('gallery__link');
    link.href = image.url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';

    const img = document.createElement('img');
    img.classList.add('gallery__image');
    img.src = image.url;
    img.alt = image.name;
    img.loading = 'lazy';
    img.decoding = 'async';

    const meta = document.createElement('div');
    meta.classList.add('gallery__meta');

    const name = document.createElement('span');
    name.classList.add('gallery__name');
    name.textContent = image.name;
    name.title = image.name;

    const badge = document.createElement('span');
    badge.classList.add('gallery__badge');
    if (image.source === 'drawboard') {
      badge.classList.add('gallery__badge--local');
      badge.textContent = t('gallery.badge.drawboard');
    } else {
      badge.textContent = t('gallery.badge.public');
    }

    link.appendChild(img);
    meta.appendChild(name);
    meta.appendChild(badge);
    item.appendChild(link);
    item.appendChild(meta);
    galleryGrid.appendChild(item);
    renderedItems.push(item);
  });

  const imageWord = getImageWordForCount(images.length);
  galleryStatus.textContent = ownImages
    ? t('gallery.loadedOwn', { count: images.length, word: imageWord, own: ownImages })
    : t('gallery.loaded', { count: images.length, word: imageWord });
};

const getStoredDrawboardImages = () => {
  const storedImages = localStorage.getItem(galleryStorageKey);
  if (!storedImages) return [];

  try {
    const parsed = JSON.parse(storedImages);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(isValidDrawboardImage)
      .map((image) => ({
        name: image.name,
        url: image.url,
        source: 'drawboard',
        createdAt: image.createdAt || ''
      }))
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  } catch (error) {
    return [];
  }
};

const loadGallery = async () => {
  try {
    const response = await fetch(`https://api.github.com/repos/${githubOwner}/${githubRepo}/contents/Gallery/images`);
    if (!response.ok) {
      const httpError = new Error('Gallery HTTP error');
      httpError.status = response.status;
      throw httpError;
    }

    const files = await response.json();
    const publicImages = files
      .filter((file) => file.type === 'file' && isSupportedImage(file.name))
      .map((file) => ({
        name: file.name,
        url: file.download_url,
        source: 'public'
      }))
      .sort((a, b) => a.name.localeCompare(b.name, i18n()?.getLanguage?.() || 'en'));

    const drawboardImages = getStoredDrawboardImages();
    const images = [...drawboardImages, ...publicImages];

    renderImages(images);
  } catch (error) {
    if (error.status) {
      const status = String(error.status);
      galleryLoaded = false;
      lastGalleryErrorStatus = status;
      galleryStatus.textContent = t('gallery.error', { status });
      return;
    }
    galleryLoaded = false;
    lastGalleryErrorStatus = null;
    galleryStatus.textContent = error.message;
  }
};

galleryRandomBtn.addEventListener('click', () => {
  if (!renderedItems.length) return;
  renderedItems.forEach((item) => item.classList.remove('gallery__item--spotlight'));
  const randomItem = getRandomItem(renderedItems);
  randomItem.classList.add('gallery__item--spotlight');
  randomItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
});

const translateGalleryControls = () => {
  const createButton = document.querySelector('.gallery__create-button');
  if (createButton) createButton.textContent = t('gallery.create');
  if (galleryRandomBtn) galleryRandomBtn.textContent = t('gallery.random');
  if (galleryLoaded) {
    renderImages(loadedImagesCache);
  } else if (lastGalleryErrorStatus) {
    galleryStatus.textContent = t('gallery.error', { status: lastGalleryErrorStatus });
  }
};

document.addEventListener('rw:language-changed', translateGalleryControls);
translateGalleryControls();
loadGallery();

// "Recede into the background" effect: as elements approach the sticky navbar
// while scrolling, shrink and fade them instead of letting them simply
// disappear under the navbar.
(() => {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  const FADE_ZONE = 140; // px transition zone above the navbar bottom
  let ticking = false;

  const collectTargets = () => {
    const list = [];
    const actions = document.querySelector('.gallery__actions');
    if (actions) list.push(actions);
    const status = document.getElementById('gallery-status');
    if (status) list.push(status);
    document.querySelectorAll('#gallery-grid > .gallery__item').forEach((el) => list.push(el));
    return list;
  };

  // Compute t for a given page-Y position (in viewport coordinates).
  // t = 0: position is well below the navbar (no effect).
  // t = 1: position has reached the navbar bottom or is above it.
  const tAt = (y, navbarBottom) => {
    const distance = y - navbarBottom;
    return 1 - Math.max(0, Math.min(1, distance / FADE_ZONE));
  };

  // Total horizontal width shrink (percent) applied at t = 1. The final
  // visible width at t = 1 is (100 - SHRINK_PERCENT)% of the original.
  const SHRINK_PERCENT = 18;

  const applyFade = () => {
    ticking = false;
    const navbarBottom = navbar.getBoundingClientRect().bottom;
    const targets = collectTargets();
    targets.forEach((el) => {
      el.classList.add('gallery__fade');
      const rect = el.getBoundingClientRect();
      // Compute t at the element's top and bottom edges independently so
      // the narrowing / fading is a function of screen-Y rather than a
      // uniform transform of the whole element. This way the top edge of
      // one element and the bottom edge of another at the same screen
      // height have the same width and opacity.
      const tTop = tAt(rect.top, navbarBottom);
      const tBot = tAt(rect.bottom, navbarBottom);
      if (tTop <= 0 && tBot <= 0) {
        el.style.clipPath = '';
        el.style.webkitClipPath = '';
        el.style.maskImage = '';
        el.style.webkitMaskImage = '';
        el.style.opacity = '';
        return;
      }
      // Trapezoidal clip: the top edge is inset by (SHRINK_PERCENT/2)*tTop
      // on each side, the bottom edge by (SHRINK_PERCENT/2)*tBot.
      const insetTop = ((SHRINK_PERCENT / 2) * tTop).toFixed(4);
      const insetBot = ((SHRINK_PERCENT / 2) * tBot).toFixed(4);
      const rightTop = (100 - (SHRINK_PERCENT / 2) * tTop).toFixed(4);
      const rightBot = (100 - (SHRINK_PERCENT / 2) * tBot).toFixed(4);
      const clip = `polygon(${insetTop}% 0%, ${rightTop}% 0%, ${rightBot}% 100%, ${insetBot}% 100%)`;
      el.style.clipPath = clip;
      el.style.webkitClipPath = clip;
      // Vertical opacity gradient: top alpha depends on tTop, bottom on tBot.
      const topAlpha = Math.max(0, 1 - tTop).toFixed(4);
      const botAlpha = Math.max(0, 1 - tBot).toFixed(4);
      const mask = `linear-gradient(to bottom, rgba(0,0,0,${topAlpha}) 0%, rgba(0,0,0,${botAlpha}) 100%)`;
      el.style.maskImage = mask;
      el.style.webkitMaskImage = mask;
      el.style.opacity = '';
    });
  };

  const requestUpdate = () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(applyFade);
  };

  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', requestUpdate);

  // Update after renders (gallery loads asynchronously and when language changes).
  const observer = new MutationObserver(requestUpdate);
  if (galleryGrid) observer.observe(galleryGrid, { childList: true });

  requestUpdate();
})();
