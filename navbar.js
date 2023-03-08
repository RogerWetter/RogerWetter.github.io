class CustomNavigationBar extends HTMLElement {
    constructor() {
        super();
        const shadowRoot = this.attachShadow({mode: 'open'});
        shadowRoot.innerHTML = `
        <style>   
          div.navibar {
            align-items: center;
            background-color: #ccc;
            margin: 0;
            width: 100%;
            height: 100%;
          }
          ::slotted(a) {
            display: block;
            text-align: center;
         }
        <nav class="navbar">
  <div class="navbar__container">
    <a href="/" id="navbar__logo">RW</a>
    <ul class="navbar__menu">
      <li class="navbar__item">
        <a href="/Projects" class="navbar__links">
          Projects
        </a>
      </li>
      <li class="navbar__item">
        <a href="/About" class="navbar__links">
          About
        </a>
      </li>
      <li class="navbar__item">
        <a href="/Contact" class="navbar__links">
          Contact
        </a>
      </li>
    </ul>
  </div>
</nav>`;
    }

}

customElements.define('navbar', CustomNavigationBar);