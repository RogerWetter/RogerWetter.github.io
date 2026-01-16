// navbar.js

const navItems = [
  { name: 'Projects', link: '/Projects' },
  // { name: 'About', link: '/About' },
  // { name: 'Contact', link: '/Contact' }
];

const navbarContainer = document.querySelector('.navbar__menu');

navItems.forEach(item => {
  const listItem = document.createElement('li');
  listItem.classList.add('navbar__item');

  const link = document.createElement('a');
  link.classList.add('navbar__links');
  link.href = item.link;
  link.textContent = item.name;

  listItem.appendChild(link);
  navbarContainer.appendChild(listItem);
});
