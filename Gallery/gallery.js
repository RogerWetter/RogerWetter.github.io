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
      throw new Error(`Fehler beim Laden der Bilder (HTTP ${response.status})`);
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
    if (error.message?.includes('HTTP')) {
      const status = error.message.match(/(\d+)/)?.[1] || '';
      galleryStatus.textContent = t('gallery.error', { status });
      return;
    }
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
  if (loadedImagesCache.length || galleryStatus.textContent) renderImages(loadedImagesCache);
};

document.addEventListener('rw:language-changed', translateGalleryControls);
translateGalleryControls();
loadGallery();
