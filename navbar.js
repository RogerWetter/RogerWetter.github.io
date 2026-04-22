// navbar.js

const navItems = [
  { key: 'nav.projects', fallback: 'Projects', link: '/Projects' },
  { key: 'nav.gallery', fallback: 'Gallery', link: '/Gallery' },
  // { key: 'nav.about', fallback: 'About', link: '/About' },
  // { key: 'nav.contact', fallback: 'Contact', link: '/Contact' }
];

const navbarContainer = document.querySelector('.navbar__menu');

if (navbarContainer) {
  const renderNavbar = () => {
    navbarContainer.innerHTML = '';
    navItems.forEach(item => {
      const listItem = document.createElement('li');
      listItem.classList.add('navbar__item');

      const link = document.createElement('a');
      link.classList.add('navbar__links');
      link.href = item.link;
      link.textContent = window.RW_I18N?.t(item.key) || item.fallback;

      listItem.appendChild(link);
      navbarContainer.appendChild(listItem);
    });
  };

  renderNavbar();
  document.addEventListener('rw:language-changed', renderNavbar);
}
