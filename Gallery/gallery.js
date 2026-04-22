const galleryGrid = document.getElementById('gallery-grid');
const galleryStatus = document.getElementById('gallery-status');
const galleryRandomBtn = document.getElementById('gallery-random-btn');
const githubOwner = 'RogerWetter';
const githubRepo = 'RogerWetter.github.io';
const galleryStorageKey = 'rw.gallery.customImages';

const supportedImageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif', '.heic', '.heif'];

const isSupportedImage = (name) =>
  supportedImageExtensions.some((extension) => name.toLowerCase().endsWith(extension));

const isSafeDataImage = (url) => /^data:image\/(png|jpeg|jpg|webp|gif|avif);base64,/i.test(url);

let renderedItems = [];
const getImageWordForCount = (count) => count === 1 ? 'Bild' : 'Bilder';
const getRandomItem = (items) => items[Math.floor(Math.random() * items.length)];
const isValidDrawboardImage = (image) =>
  image &&
  typeof image.name === 'string' &&
  typeof image.url === 'string' &&
  isSafeDataImage(image.url);

const renderImages = (images) => {
  galleryGrid.innerHTML = '';
  renderedItems = [];

  if (!images.length) {
    galleryStatus.textContent = 'Keine Bilder vorhanden.';
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
      badge.textContent = 'Drawboard';
    } else {
      badge.textContent = 'Public';
    }

    link.appendChild(img);
    meta.appendChild(name);
    meta.appendChild(badge);
    item.appendChild(link);
    item.appendChild(meta);
    galleryGrid.appendChild(item);
    renderedItems.push(item);
  });

  galleryStatus.textContent = ownImages
    ? `Es wurden ${images.length} ${getImageWordForCount(images.length)} geladen (${ownImages} von dir erstellt).`
    : `${images.length} ${getImageWordForCount(images.length)} geladen.`;
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
      .sort((a, b) => a.name.localeCompare(b.name, 'de'));

    const drawboardImages = getStoredDrawboardImages();
    const images = [...drawboardImages, ...publicImages];

    renderImages(images);
  } catch (error) {
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

loadGallery();
