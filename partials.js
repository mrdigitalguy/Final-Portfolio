/* ==========================================================
   SHARED HEADER, MENU & FOOTER — edit them here, once.
   Every page has two placeholders:
     <div data-include="header"></div>   (top of <body>)
     <div data-include="footer"></div>   (bottom of <body>)
   and loads this file right before script.js.
   Each page says which page it is with <body data-page="home|work|case">.
   ========================================================== */

/* ---------- QUICK SETTINGS ---------- */
const SITE = {
  logoPhoto: 'assets/Profile/logo-image.jpeg',   // photo on the back of the K logo (square works best)
  resume: 'assets/Resume/Kabi-Prasad-Product-Designer.pdf',   // your resume PDF (used by the menu)
  email: 'kabimallick1996@gmail.com',
  phone: '+918908259927',
  phoneLabel: '+91 8908 25 9927',
  whatsapp: 'https://wa.me/918908259927',
  linkedin: 'https://www.linkedin.com/in/kabiprasadmallick/',
  behance: 'https://www.behance.net/kabiprmallick',
};

(() => {
  const page = document.body.dataset.page || 'home';
  const onHome = page === 'home';
  const onWork = page === 'work' || page === 'case';     // case studies live under Work
  // Home link: the clean site root online (kabiprasad.in/), index.html when opened as a local file
  const online = location.protocol.startsWith('http');
  const homeHref = online ? '/' : 'index.html';

  // keep the address bar clean: kabiprasad.in/index.html#home → kabiprasad.in/
  if (online) {
    let path = location.pathname.replace(/index\.html$/, '');
    let hash = location.hash === '#home' ? '' : location.hash;
    if (path + hash !== location.pathname + location.hash) history.replaceState(null, '', path + location.search + hash);
  }
  const workCurrent = onWork ? ' class="is-current" aria-current="page"' : '';

  const header = `
  <header class="header">
    <div class="container header__inner">
      <!-- Hover the logo: the tile flips over and shows your photo (SITE.logoPhoto) -->
      <a href="${homeHref}" class="logo" aria-label="Kabi Prasad — home">
        <span class="logo__mark">
          <span class="logo__flip">
            <span class="logo__face logo__face--front"><span class="logo__k">K</span></span>
            <span class="logo__face logo__face--back"><img class="logo__img" src="${SITE.logoPhoto}" alt="" /></span>
          </span>
        </span>
        <span class="logo__name"><span>Kabi</span><span>Prasad</span></span>
      </a>
      <button class="menu-btn" id="menuBtn" aria-label="Open menu" aria-expanded="false">
        <span></span><span></span><span></span><span></span>
      </button>
    </div>
  </header>

  <!-- Dropdown menu: glass panel. Click outside or press Esc to close. -->
  <nav class="menu" id="menu" aria-hidden="true">
    <div class="container menu__wrap">
      <div class="menu__panel">
        <ul class="menu__list">
          <li><a href="${homeHref}">
            <span class="menu__icon"><svg viewBox="0 0 24 24"><path d="M3 11 12 4l9 7" /><path d="M5 10v10h14V10" /><path d="M10 20v-6h4v6" /></svg></span>
            <span class="menu__text">Home</span>
          </a></li>
          <li><a href="work.html"${workCurrent}>
            <span class="menu__icon"><svg viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M3 13h18" /></svg></span>
            <span class="menu__text">Work</span>
          </a></li>
          <li><a href="#contact">
            <span class="menu__icon"><svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg></span>
            <span class="menu__text">Contact</span>
          </a></li>
          <li><a href="${SITE.resume}" download>
            <span class="menu__icon"><svg viewBox="0 0 24 24"><path d="M12 4v11M7 10l5 5 5-5" /><path d="M5 20h14" /></svg></span>
            <span class="menu__text">Download Resume</span>
          </a></li>
        </ul>
      </div>
    </div>
  </nav>`;

  const footer = `
  <footer class="footer" id="contact" data-section="footer">
    <div class="footer__glow" aria-hidden="true"></div>
    <div class="container footer__inner">
      <h2 class="footer__title reveal">From idea to interface,<br />let’s make it happen</h2>
      <p class="footer__sub reveal">
        Curious to know more about my work and process?<br />
        Let’s connect and talk about what really matters.
      </p>

      <div class="contact reveal">
        <button class="contact__item" data-copy="${SITE.email}">
          <small>Email</small>${SITE.email}<em>Copy</em>
        </button>
        <button class="contact__item" data-copy="${SITE.phone}">
          <small>Call &amp; WhatsApp</small>${SITE.phoneLabel}<em>Copy</em>
        </button>
      </div>

      <div class="socials reveal">
        <a href="${SITE.linkedin}" aria-label="LinkedIn" target="_blank" rel="noopener"><svg viewBox="0 0 24 24"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9.75h4V21H3V9.75Zm6.5 0h3.8v1.6h.06c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.77 2.6 4.77 6V21h-4v-5.1c0-1.220-.02-2.8-1.7-2.8-1.71 0-1.970 1.33-1.970 2.7V21h-4V9.75Z"/></svg></a>
        <a href="${SITE.behance}" aria-label="Behance" target="_blank" rel="noopener"><svg viewBox="0 0 24 24"><path d="M8.2 11.3c.9-.4 1.4-1.2 1.4-2.2C9.6 7.1 8.1 6 6 6H1v12h5.2c2.2 0 4-1.1 4-3.4 0-1.5-.8-2.8-2-3.3ZM3.6 8.1h2.2c.9 0 1.5.4 1.5 1.2 0 .9-.6 1.3-1.5 1.3H3.6V8.1Zm2.4 7.8H3.6v-3h2.5c1.1 0 1.7.5 1.7 1.5s-.7 1.5-1.8 1.5ZM15 7h5v1.3h-5V7Zm2.6 2.5c-2.6 0-4.3 1.9-4.3 4.4 0 2.6 1.6 4.4 4.3 4.4 2 0 3.4-.9 4-2.9h-2.1c-.2.7-1 1.1-1.8 1.1-1.3 0-2-.8-2-2.1h6c.2-2.7-1.3-4.9-4.1-4.9Zm-1.9 3.4c.1-1.1.8-1.7 1.8-1.7 1.1 0 1.700.7 1.8 1.7h-3.6Z"/></svg></a>
        <a href="${SITE.whatsapp}" aria-label="WhatsApp" target="_blank" rel="noopener"><svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2c-1.5 0-3-.4-4.3-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.4.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2c0 1.3.9 2.5 1.1 2.7.1.2 1.8 2.8 4.4 3.9 1.7.7 2.300.8 3.1.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.100.2-1.2-.1-.1-.3-.2-.5-.3Z"/></svg></a>
        <a href="mailto:${SITE.email}" aria-label="Email"><svg viewBox="0 0 24 24"><path d="M3 5h18a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Zm9 7.4L4.3 7H4v.6l8 5.7 8-5.7V7h-.3L12 12.4Z"/></svg></a>
      </div>

      <div class="footer__bottom">
        <span class="footer__sign">Kabi Prasad</span>
        <p class="footer__copy">© <span id="year"></span> Kabi Prasad Mallick · India</p>
      </div>
    </div>
  </footer>

  <div class="toast" id="toast">Copied</div>`;

  const parts = { header, footer };
  document.querySelectorAll('[data-include]').forEach((slot) => {
    const html = parts[slot.dataset.include];
    if (html) slot.outerHTML = html;
  });

  // any other link written as index.html (e.g. "← Home" on the Work page) also goes to the clean root online
  if (online) {
    document.querySelectorAll('a[href="index.html"]').forEach((a) => a.setAttribute('href', '/'));
  }

  // on the home page, the logo / "Home" just scroll back to the top (no reload, no #home in the URL)
  if (onHome) {
    document.querySelectorAll(`a[href="${homeHref}"]`).forEach((a) => a.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }));
  }
})();
