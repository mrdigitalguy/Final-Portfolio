/* ==========================================================
   QUICK SETTINGS
   Add a section's data-section name here to hide it, e.g.
   const HIDDEN_SECTIONS = ['feedback'];
   Names: hero, career, skills, process, casestudies, feedback, footer
   ========================================================== */
const HIDDEN_SECTIONS = [];

HIDDEN_SECTIONS.forEach((name) => {
  document.querySelectorAll(`[data-section="${name}"]`).forEach((el) => el.remove());
});

/* ---------- Intro animation (hero title + photo) ---------- */
requestAnimationFrame(() => document.body.classList.add('is-loaded'));

/* ---------- Header: blur on scroll, hide when scrolling down ---------- */
const header = document.querySelector('.header');
let lastY = window.scrollY;
const onScroll = () => {
  const y = window.scrollY;
  header.classList.toggle('is-scrolled', y > 20);
  const menuOpen = document.body.style.overflow === 'hidden';
  header.classList.toggle('is-hidden', !menuOpen && y > 300 && y > lastY);
  lastY = y;
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ---------- Menu ---------- */
const menuBtn = document.getElementById('menuBtn');
const menu = document.getElementById('menu');

// highlight the menu item for the section currently on screen
const menuLinks = [...menu.querySelectorAll('.menu__list a[href^="#"]')];
function markCurrent() {
  let current = menuLinks[0];
  const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
  menuLinks.forEach((a) => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target && target.getBoundingClientRect().top <= window.innerHeight * 0.4) current = a;
  });
  if (atBottom) current = menuLinks[menuLinks.length - 1];
  menuLinks.forEach((a) => a.classList.toggle('is-current', a === current));
}

function setMenu(open) {
  // pages like work.html mark their own item with aria-current; the home page works it out by scroll
  if (open && !menu.querySelector('[aria-current="page"]')) markCurrent();
  menu.classList.toggle('is-open', open);
  menuBtn.classList.toggle('is-open', open);
  menuBtn.setAttribute('aria-expanded', open);
  menu.setAttribute('aria-hidden', !open);
  document.body.style.overflow = open ? 'hidden' : '';
}
menuBtn.addEventListener('click', () => setMenu(!menu.classList.contains('is-open')));
menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
// click anywhere outside the glass panel closes the menu
menu.addEventListener('click', (e) => { if (!e.target.closest('.menu__panel')) setMenu(false); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });

/* ---------- Feedback: endless auto-scroll + drag/swipe ---------- */
const quotesTrack = document.getElementById('quotesTrack');
if (quotesTrack) {
  const originals = [...quotesTrack.children];
  const count = originals.length;
  const strip = document.getElementById('quotes');
  const addClone = (card) => {
    const clone = card.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    quotesTrack.appendChild(clone);
  };
  // 1) with only a few cards, repeat them until one full "set" is wider than the strip
  for (let guard = 0; quotesTrack.scrollWidth < strip.clientWidth && guard < 12; guard++) originals.forEach(addClone);
  // 2) then duplicate that whole set once, so the loop wraps with no visible gap
  [...quotesTrack.children].forEach(addClone);
  const cards = [...quotesTrack.children];

  const SPEED = 40;                       // auto-scroll speed in px per second
  const HOLD = 2500;                      // ms to hold a card in the centre after a swipe
  const autoplay = !matchMedia('(prefers-reduced-motion: reduce)').matches;

  // dots under the strip (shown on mobile) — one per real card
  const dots = document.createElement('div');
  dots.className = 'quotes-dots';
  dots.setAttribute('aria-hidden', 'true');
  dots.innerHTML = '<span></span>'.repeat(count);
  strip.after(dots);

  let x = 0;                              // current offset (px, negative = moved left)
  let loop = quotesTrack.scrollWidth / 2; // width of one full set of cards
  let dragging = false, inView = true;
  // pauses only while the mouse is actually over the cards (checked every frame, so it
  // stays correct even when you scroll the page without moving the mouse)
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
  let velocity = 0;                       // momentum after a drag/swipe (px per frame)
  let snapping = false;                   // easing the nearest card to the centre
  let holdUntil = 0;
  let active = -1;
  let last = performance.now();

  const wrap = () => { x = ((x % loop) - loop) % loop; };   // keep x within (-loop, 0]
  const norm = (d) => ((d % loop) + loop * 1.5) % loop - loop / 2;   // shortest way round

  // card whose centre is closest to the centre of the strip
  const nearest = () => {
    const mid = strip.clientWidth / 2;
    let best = 0, bestDist = Infinity;
    cards.forEach((c, i) => {
      const d = Math.abs(norm(c.offsetLeft + c.offsetWidth / 2 + x - mid));
      if (d < bestDist) { bestDist = d; best = i; }
    });
    return best;
  };
  const render = () => {
    quotesTrack.style.transform = `translate3d(${x}px, 0, 0)`;
    const i = nearest();
    if (i !== active) {
      cards[active]?.classList.remove('is-active');
      cards[i].classList.add('is-active');
      [...dots.children].forEach((d, n) => d.classList.toggle('is-active', n === i % count));
      active = i;
    }
  };

  const tick = (now) => {
    const dt = Math.min(now - last, 50) / 1000;
    last = now;
    if (!dragging && inView) {
      if (Math.abs(velocity) > 0.5) {      // glide after letting go
        x += velocity;
        velocity *= 0.92;
      } else if (snapping) {               // settle the nearest card in the centre
        velocity = 0;
        const c = cards[active];
        const delta = norm(strip.clientWidth / 2 - (c.offsetLeft + c.offsetWidth / 2) - x);
        x += delta * 0.14;
        if (Math.abs(delta) < 0.5) { snapping = false; holdUntil = now + HOLD; }
      } else if (autoplay && !(finePointer && strip.matches(':hover')) && now > holdUntil) {
        x -= SPEED * dt;
      }
      wrap();
      render();
    }
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);

  new IntersectionObserver(([e]) => { inView = e.isIntersecting; }).observe(strip);
  const measure = () => { loop = quotesTrack.scrollWidth / 2; wrap(); render(); };
  window.addEventListener('resize', measure);
  window.addEventListener('load', measure);            // fonts/images change card widths
  if (document.fonts) document.fonts.ready.then(measure);

  // drag with the mouse / swipe with a finger
  let startX = 0, startY = 0, startOffset = 0, lastX = 0, lastT = 0, decided = false;
  strip.addEventListener('pointerdown', (e) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    startX = lastX = e.clientX; startY = e.clientY; lastT = performance.now();
    startOffset = x; velocity = 0; decided = false; snapping = false;
    dragging = true;
  });
  window.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    const dx = e.clientX - startX, dy = e.clientY - startY;
    if (!decided) {
      if (Math.abs(dx) < 6 && Math.abs(dy) < 6) return;
      // mostly vertical on touch = the user is scrolling the page, let it go
      if (e.pointerType !== 'mouse' && Math.abs(dy) > Math.abs(dx)) { dragging = false; return; }
      decided = true;
      strip.classList.add('is-dragging');
    }
    const now = performance.now();
    velocity = (e.clientX - lastX) / Math.max(now - lastT, 1) * 16;   // px per ~frame
    lastX = e.clientX; lastT = now;
    x = startOffset + dx;
    wrap(); render();
  });
  const endDrag = () => {
    if (!dragging) return;
    dragging = false;
    strip.classList.remove('is-dragging');
    if (decided) snapping = true;          // after the glide, centre the nearest card
    else velocity = 0;
    last = performance.now();
  };
  window.addEventListener('pointerup', endDrag);
  window.addEventListener('pointercancel', endDrag);
  strip.addEventListener('dragstart', (e) => e.preventDefault());
}

/* ---------- Work page: tabs ---------- */
const tabs = document.querySelector('.tabs');
if (tabs) {
  const buttons = [...tabs.querySelectorAll('.tabs__btn')];
  const pill = tabs.querySelector('.tabs__pill');

  // slide the white pill under the active tab
  const movePill = (btn) => {
    pill.style.width = `${btn.offsetWidth}px`;
    pill.style.height = `${btn.offsetHeight}px`;
    pill.style.transform = `translate(${btn.offsetLeft}px, ${btn.offsetTop}px)`;   // works for one row or 2 × 2
  };

  const show = (btn, { focus = false, updateHash = true } = {}) => {
    buttons.forEach((b) => {
      const on = b === btn;
      b.classList.toggle('is-active', on);
      b.setAttribute('aria-selected', on);
      b.tabIndex = on ? 0 : -1;
      const panel = document.getElementById(b.dataset.tab);
      if (on) {
        panel.hidden = false;
        panel.classList.remove('is-entering');
        void panel.offsetWidth;            // restart the fade-in
        panel.classList.add('is-entering');
      } else {
        panel.hidden = true;
      }
    });
    movePill(btn);
    if (updateHash) btn.scrollIntoView({ block: 'nearest', inline: 'nearest' });   // mobile: keep tab in view
    if (focus) btn.focus();
    if (updateHash) history.replaceState(null, '', `#${btn.dataset.tab}`);
  };

  buttons.forEach((b) => b.addEventListener('click', () => show(b)));
  // buttons inside a panel can jump to another tab, e.g. data-goto-tab="visual"
  document.querySelectorAll('[data-goto-tab]').forEach((link) => link.addEventListener('click', () => {
    const target = buttons.find((b) => b.dataset.tab === link.dataset.gotoTab);
    if (target) { show(target); tabs.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
  }));
  // ← / → keys move between tabs
  tabs.addEventListener('keydown', (e) => {
    const i = buttons.indexOf(document.activeElement);
    if (i < 0) return;
    if (e.key === 'ArrowRight') { e.preventDefault(); show(buttons[(i + 1) % buttons.length], { focus: true }); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); show(buttons[(i - 1 + buttons.length) % buttons.length], { focus: true }); }
  });

  // open the tab named in the URL (work.html#photography), otherwise the first one.
  // The pill jumps straight into place on load (no slide-in from zero width).
  const fromHash = buttons.find((b) => `#${b.dataset.tab}` === location.hash);
  pill.style.transition = 'none';
  show(fromHash || buttons[0], { updateHash: false });
  pill.getBoundingClientRect();
  requestAnimationFrame(() => { pill.style.transition = ''; });
  const refit = () => movePill(tabs.querySelector('.tabs__btn.is-active'));
  window.addEventListener('resize', refit);
  if (document.fonts) document.fonts.ready.then(refit);
}

/* ---------- Case study: reading progress line ---------- */
const readBar = document.getElementById('readBar');
if (readBar) {
  const updateRead = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    readBar.style.transform = `scaleX(${max > 0 ? Math.min(1, window.scrollY / max) : 0})`;
  };
  window.addEventListener('scroll', updateRead, { passive: true });
  window.addEventListener('resize', updateRead);
  updateRead();
}

/* ---------- Case study: concept card types the prompt, pauses, clears, repeats ---------- */
const typed = document.querySelector('.concept__typed');
if (typed) {
  const text = typed.dataset.text;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
    typed.textContent = text;
  } else {
    let i = 0, dir = 1;
    const step = () => {
      i += dir;
      typed.textContent = text.slice(0, i);
      let wait = dir > 0 ? 55 : 22;
      if (i >= text.length) { dir = -1; wait = 2600; }   // hold the full prompt
      if (i <= 0) { dir = 1; wait = 700; }
      setTimeout(step, wait);
    };
    setTimeout(step, 600);
  }
}

/* ---------- Case study: concept cards that step through items (data-cycle) ---------- */
document.querySelectorAll('[data-cycle]').forEach((list) => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const items = [...list.children];
  let i = 0;
  setInterval(() => {
    items[i].classList.remove('is-active');
    i = (i + 1) % items.length;
    items[i].classList.add('is-active');
  }, 1600);
});

/* ---------- Work page: click a card to preview it large (lightbox) ---------- */
const lightbox = document.getElementById('lightbox');
if (lightbox) {
  const stage = document.getElementById('lbStage');
  const caption = document.getElementById('lbCaption');
  const count = document.getElementById('lbCount');
  let group = [], index = 0, lastFocus = null;

  const render = () => {
    const shot = group[index];
    const media = shot.querySelector('.shot__media');
    const tall = shot.classList.contains('shot--tall');
    stage.className = `lightbox__stage${tall ? ' lightbox__stage--tall' : ''}${media.classList.contains('shot__media--placeholder') ? ' shot__media--placeholder' : ''}`;
    const ratio = shot.dataset.ratio || (tall ? '3 / 4' : '4 / 3');   // data-ratio on the <figure> wins
    const [rw, rh] = ratio.split('/').map(Number);
    stage.style.setProperty('--lb-ratio', ratio);
    stage.style.setProperty('--lb-r', rw / rh);
    stage.innerHTML = media.innerHTML;                      // real image/video, or the placeholder
    stage.querySelectorAll('.shot__play').forEach((el) => el.remove());   // the grid's play button isn't needed here
    const video = stage.querySelector('video');
    if (video) {
      video.src = video.getAttribute('src').replace(/#t=[\d.]+$/, '');   // play from the very start
      video.controls = true; video.muted = false; video.play().catch(() => {});
    }
    const title = shot.querySelector('figcaption b');
    const tab = document.querySelector(`[data-tab="${shot.closest('[data-lightbox]').id}"]`);
    caption.textContent = title ? title.textContent : (tab ? tab.firstChild.textContent.trim() : '');   // photos use the tab name
    count.textContent = `${index + 1} / ${group.length}`;
  };

  const open = (shot) => {
    group = [...shot.closest('[data-lightbox]').querySelectorAll('.shot')];
    index = group.indexOf(shot);
    lastFocus = document.activeElement;
    render();
    lightbox.hidden = false;
    requestAnimationFrame(() => lightbox.classList.add('is-open'));
    document.body.style.overflow = 'hidden';
    document.getElementById('lbClose').focus();
  };
  const close = () => {
    lightbox.classList.remove('is-open');
    document.body.style.overflow = '';
    setTimeout(() => { lightbox.hidden = true; stage.innerHTML = ''; }, 300);   // also stops any video
    if (lastFocus) lastFocus.focus();
  };
  const step = (d) => { index = (index + d + group.length) % group.length; render(); };

  document.querySelectorAll('[data-lightbox] .shot').forEach((shot) => {
    const media = shot.querySelector('.shot__media');
    media.tabIndex = 0;
    media.setAttribute('role', 'button');
    media.setAttribute('aria-label', `Preview ${shot.querySelector('figcaption b')?.textContent || 'item'}`);
    media.addEventListener('click', () => open(shot));
    media.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(shot); } });
  });
  document.getElementById('lbClose').addEventListener('click', close);
  document.getElementById('lbPrev').addEventListener('click', () => step(-1));
  document.getElementById('lbNext').addEventListener('click', () => step(1));
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) close(); });   // click the backdrop
  document.addEventListener('keydown', (e) => {
    if (lightbox.hidden) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowRight') step(1);
    if (e.key === 'ArrowLeft') step(-1);
  });
}

/* ---------- Copy email / phone ---------- */
const toast = document.getElementById('toast');
document.querySelectorAll('[data-copy]').forEach((btn) => {
  btn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(btn.dataset.copy);
      toast.textContent = 'Copied to clipboard';
    } catch {
      toast.textContent = btn.dataset.copy;
    }
    toast.classList.add('is-show');
    setTimeout(() => toast.classList.remove('is-show'), 1800);
  });
});

/* ---------- Reveal on scroll (staggered per section) ---------- */
const io = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-in');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('section, footer').forEach((section) => {
  section.querySelectorAll('.reveal').forEach((el, i) => {
    el.style.transitionDelay = `${Math.min(i, 5) * 80}ms`;
    // drop the stagger once revealed so hover effects respond instantly
    el.addEventListener('transitionend', () => { el.style.transitionDelay = ''; }, { once: true });
    io.observe(el);
  });
});

document.getElementById('year').textContent = new Date().getFullYear();
