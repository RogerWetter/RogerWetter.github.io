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
    // Clicking always opens the full-quality original.
    link.href = image.url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';

    const img = document.createElement('img');
    img.classList.add('gallery__image');
    // Use the lightweight WebP preview for the grid when available; this
    // keeps the gallery snappy while the original (often several MB) is
    // only fetched on click.
    img.src = image.thumbUrl || image.url;
    img.alt = image.name;
    img.loading = 'lazy';
    img.decoding = 'async';
    // If the thumbnail fails to load (e.g. it has not been generated yet
    // for a brand-new public image) fall back to the original so the
    // gallery never shows a broken image.
    if (image.thumbUrl && image.thumbUrl !== image.url) {
      img.addEventListener('error', () => {
        if (img.src !== image.url) img.src = image.url;
      }, { once: true });
    }

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

const stripExtension = (filename) => filename.replace(/\.[^.]+$/, '');

const loadGallery = async () => {
  try {
    const response = await fetch(`https://api.github.com/repos/${githubOwner}/${githubRepo}/contents/Gallery/images`);
    if (!response.ok) {
      const httpError = new Error('Gallery HTTP error');
      httpError.status = response.status;
      throw httpError;
    }

    const files = await response.json();

    // Build a map of available thumbnails (by basename without extension)
    // so we can pair each original with its lightweight preview.
    const thumbsDir = files.find((file) => file.type === 'dir' && file.name === 'thumbs');
    const thumbsByBase = new Map();
    if (thumbsDir) {
      try {
        const thumbsResponse = await fetch(thumbsDir.url);
        if (thumbsResponse.ok) {
          const thumbFiles = await thumbsResponse.json();
          if (Array.isArray(thumbFiles)) {
            thumbFiles
              .filter((file) => file.type === 'file' && isSupportedImage(file.name))
              .forEach((file) => thumbsByBase.set(stripExtension(file.name), file.download_url));
          }
        }
      } catch (thumbsError) {
        // Not fatal — fall back to originals if thumbs cannot be listed.
      }
    }

    const publicImages = files
      .filter((file) => file.type === 'file' && isSupportedImage(file.name))
      .map((file) => ({
        name: file.name,
        url: file.download_url,
        thumbUrl: thumbsByBase.get(stripExtension(file.name)) || file.download_url,
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
// while scrolling, shrink and fade them as a whole toward a single common
// point just below the navbar. Because every target shares the same screen
// vanishing point, the entire grid visually collapses together instead of
// each image being clipped independently. Using a CSS transform keeps the
// border stroke and border-radius intact (they simply scale with the rest).
//
// Important: we read element geometry from the *layout* box (offsetTop /
// offsetHeight / offsetLeft / offsetWidth) instead of getBoundingClientRect.
// getBoundingClientRect() returns the already-transformed box, so once an
// element is scaled down its top/height feed back into the next frame's
// calculation, causing the well-known shrink/grow flicker. The layout box
// is unaffected by transforms and stays stable.
(() => {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  const FADE_ZONE = 140; // px transition zone above the navbar bottom (keep in sync with .gallery__page margin-top)
  const MIN_SCALE = 0.05; // how small elements get right before the navbar
  let ticking = false;
  let layoutCache = null; // { items: [{el, top, left, width, height}], gridCenterX }

  const collectTargets = () => {
    const list = [];
    const actions = document.querySelector('.gallery__actions');
    if (actions) list.push(actions);
    const status = document.getElementById('gallery-status');
    if (status) list.push(status);
    document.querySelectorAll('#gallery-grid > .gallery__item').forEach((el) => list.push(el));
    return list;
  };

  // Walk the offsetParent chain to compute an element's position relative
  // to the document. offset* values ignore CSS transforms, so we get a
  // stable geometry that does not shift while we are animating.
  const getDocumentTop = (el) => {
    let top = 0;
    let node = el;
    while (node) {
      top += node.offsetTop;
      node = node.offsetParent;
    }
    return top;
  };
  const getDocumentLeft = (el) => {
    let left = 0;
    let node = el;
    while (node) {
      left += node.offsetLeft;
      node = node.offsetParent;
    }
    return left;
  };

  const rebuildLayoutCache = () => {
    // Temporarily strip any active transforms before measuring. Even though
    // offset* is supposed to ignore transforms, browsers can still differ
    // around fractional pixel values; clearing first makes measurements
    // deterministic.
    const targets = collectTargets();
    targets.forEach((el) => {
      el.style.transform = '';
      el.style.transformOrigin = '';
      el.style.opacity = '';
    });

    const items = targets.map((el) => ({
      el,
      top: getDocumentTop(el),
      left: getDocumentLeft(el),
      width: el.offsetWidth,
      height: el.offsetHeight,
    }));

    const grid = document.getElementById('gallery-grid');
    let gridCenterX = window.innerWidth / 2;
    if (grid) {
      gridCenterX = getDocumentLeft(grid) + grid.offsetWidth / 2;
    }

    layoutCache = { items, gridCenterX };
  };

  const invalidateLayoutCache = () => {
    layoutCache = null;
    requestUpdate();
  };

  // Compute t for a given page-Y position (in viewport coordinates).
  // t = 0: position is well below the navbar (no effect).
  // t = 1: position has reached the navbar bottom or is above it.
  const tAt = (y, navbarBottom) => {
    const distance = y - navbarBottom;
    return 1 - Math.max(0, Math.min(1, distance / FADE_ZONE));
  };

  const applyFade = () => {
    ticking = false;

    if (!layoutCache) rebuildLayoutCache();

    const navbarBottom = navbar.getBoundingClientRect().bottom;
    const scrollY = window.scrollY || window.pageYOffset || 0;
    const scrollX = window.scrollX || window.pageXOffset || 0;
    const vanishX = layoutCache.gridCenterX - scrollX;
    const vanishY = navbarBottom;

    layoutCache.items.forEach((entry) => {
      const { el, top, left, width, height } = entry;
      el.classList.add('gallery__fade');
      // Convert the cached document-relative geometry into viewport
      // coordinates *only* using the current scroll position. No
      // transform-affected values are ever read back, so the calculation
      // is stable across frames.
      const viewportTop = top - scrollY;
      const centreY = viewportTop + height / 2;
      const t = tAt(centreY, navbarBottom);
      if (t <= 0) {
        el.style.transform = '';
        el.style.transformOrigin = '';
        el.style.opacity = '';
        return;
      }
      const scale = 1 - t * (1 - MIN_SCALE);
      // transform-origin is expressed relative to the element's own box, so
      // convert the shared screen-space vanishing point into local
      // coordinates. This makes every element shrink toward the same point
      // on screen regardless of where it sits in the grid.
      const viewportLeft = left - scrollX;
      const originX = width > 0 ? ((vanishX - viewportLeft) / width) * 100 : 50;
      const originY = height > 0 ? ((vanishY - viewportTop) / height) * 100 : 50;
      el.style.transformOrigin = `${originX.toFixed(3)}% ${originY.toFixed(3)}%`;
      el.style.transform = `scale(${scale.toFixed(4)})`;
      // Fade out non-linearly so elements stay legible until they are very
      // close to the navbar, then quickly disappear.
      el.style.opacity = Math.max(0, 1 - Math.pow(t, 1.6)).toFixed(4);
    });
  };

  function requestUpdate() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(applyFade);
  }

  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', invalidateLayoutCache);

  // Update after renders (gallery loads asynchronously and when language changes).
  const observer = new MutationObserver(invalidateLayoutCache);
  if (galleryGrid) observer.observe(galleryGrid, { childList: true });

  // Recompute the layout cache once images have loaded (their natural size
  // changes the row height) so the cache reflects the final layout.
  window.addEventListener('load', invalidateLayoutCache);

  requestUpdate();
})();
