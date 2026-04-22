const galleryGrid = document.getElementById('gallery-grid');
const galleryStatus = document.getElementById('gallery-status');

const supportedImageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif', '.heic', '.heif'];

const isSupportedImage = (name) =>
  supportedImageExtensions.some((extension) => name.toLowerCase().endsWith(extension));

const renderImages = (images) => {
  if (!images.length) {
    galleryStatus.textContent = 'Noch keine Bilder gefunden.';
    return;
  }

  galleryStatus.textContent = `${images.length} Bild${images.length === 1 ? '' : 'er'} gefunden.`;

  images.forEach((image) => {
    const item = document.createElement('li');
    item.classList.add('gallery__item');

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

    link.appendChild(img);
    item.appendChild(link);
    galleryGrid.appendChild(item);
  });
};

const loadGallery = async () => {
  try {
    const response = await fetch('https://api.github.com/repos/RogerWetter/RogerWetter.github.io/contents/Gallery/images');
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const files = await response.json();
    const images = files
      .filter((file) => file.type === 'file' && isSupportedImage(file.name))
      .map((file) => ({
        name: file.name,
        url: file.download_url
      }))
      .sort((a, b) => b.name.localeCompare(a.name));

    renderImages(images);
  } catch (error) {
    galleryStatus.textContent = 'Bilder konnten gerade nicht geladen werden.';
  }
};

loadGallery();
