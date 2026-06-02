/* ══════════════════════════════════════════
   PROGRESS BAR
══════════════════════════════════════════ */
window.addEventListener('scroll', () => {
  const pct = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
  const bar = document.getElementById('progress-bar');
  if (bar) bar.style.width = pct + '%';
}, { passive: true });


/* ══════════════════════════════════════════
   SMOOTH SCROLL — with nav offset
══════════════════════════════════════════ */
const NAV_HEIGHT = 72; // keep in sync with --nav-height in CSS

document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const href = link.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - NAV_HEIGHT;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});


/* ══════════════════════════════════════════
   ACTIVE NAV ON SCROLL
   — "creative" removed from NAV_SECTIONS
     because the section is commented out.
   — Add it back here when restoring:
     const NAV_SECTIONS = ['work', 'creative', 'about', 'contact'];
══════════════════════════════════════════ */
const navLinks     = document.querySelectorAll('.nav-links a[data-nav]');
const NAV_SECTIONS = ['work', 'about', 'contact'];

function updateActiveNav() {
  const nearBottom = window.scrollY + window.innerHeight >= document.body.scrollHeight - 10;
  if (nearBottom) {
    navLinks.forEach(a => { a.classList.toggle('active', a.dataset.nav === 'contact'); });
    return;
  }

  const buffer = NAV_HEIGHT + 10;

  const heroEl = document.getElementById('hero');
  if (heroEl && heroEl.getBoundingClientRect().bottom > buffer) {
    navLinks.forEach(a => a.classList.remove('active'));
    return;
  }

  let activeId = null;
  for (const id of NAV_SECTIONS) {
    const el = document.getElementById(id);
    if (!el) continue;
    if (el.getBoundingClientRect().top <= buffer) {
      activeId = id;
    }
  }

  navLinks.forEach(a => {
    a.classList.toggle('active', !!activeId && a.dataset.nav === activeId);
  });
}

window.addEventListener('scroll', updateActiveNav, { passive: true });
updateActiveNav();


/* ══════════════════════════════════════════
   CREATIVE GRID — filter + load more
   — commented out: section is hidden for revamp.
   — un-comment this block AND the HTML section
     AND the lightbox HTML together when restoring.
══════════════════════════════════════════ */

/*
const ITEMS_PER_PAGE = 8;
let currentFilter = 'all';
let visibleCount  = ITEMS_PER_PAGE;

const allItems  = [...document.querySelectorAll('.creative-item')];
const tabs      = document.querySelectorAll('.filter-tab');
const loadBtn   = document.getElementById('loadMoreBtn');
const loadWrap  = document.getElementById('loadMoreWrap');
const loadCount = document.getElementById('loadCount');

function filteredItems() {
  return allItems.filter(item =>
    currentFilter === 'all' || item.dataset.cat === currentFilter
  );
}

function render() {
  if (!allItems.length) return;

  const filtered = filteredItems();
  const showing  = Math.min(visibleCount, filtered.length);

  allItems.forEach(item => {
    const inFilter = currentFilter === 'all' || item.dataset.cat === currentFilter;
    const idx      = filtered.indexOf(item);
    item.classList.toggle('hidden', !inFilter || idx < 0 || idx >= visibleCount);
  });

  if (!loadBtn || !loadCount || !loadWrap) return;

  const remaining = filtered.length - showing;
  if (remaining <= 0) {
    loadBtn.disabled  = true;
    loadBtn.innerHTML = 'All caught up \u2713';
    loadCount.textContent = 'Showing all ' + filtered.length + ' pieces';
  } else {
    loadBtn.disabled = false;
    loadBtn.innerHTML = 'Load more <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M8 3v10M4 9l4 4 4-4"/></svg>';
    loadCount.textContent = 'Showing ' + showing + ' of ' + filtered.length;
  }

  loadWrap.style.display = filtered.length <= ITEMS_PER_PAGE ? 'none' : 'block';
}

function loadMore() {
  const filtered  = filteredItems();
  const prevCount = visibleCount;
  visibleCount    = Math.min(visibleCount + ITEMS_PER_PAGE, filtered.length);

  filtered.slice(prevCount, visibleCount).forEach((item, i) => {
    item.classList.remove('hidden');
    item.classList.add('revealing');
    item.style.animationDelay = (i * 60) + 'ms';
    item.addEventListener('animationend', () => item.classList.remove('revealing'), { once: true });
  });

  if (!loadBtn || !loadCount) return;

  const remaining = filtered.length - visibleCount;
  if (remaining <= 0) {
    loadBtn.disabled  = true;
    loadBtn.innerHTML = 'All caught up \u2713';
    loadCount.textContent = 'Showing all ' + filtered.length + ' pieces';
  } else {
    loadCount.textContent = 'Showing ' + visibleCount + ' of ' + filtered.length;
  }
}

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    currentFilter = tab.dataset.filter;
    visibleCount  = ITEMS_PER_PAGE;
    render();
  });
});

render();
*/


/* ══════════════════════════════════════════
   LIGHTBOX — image & video
   — commented out: tied to creative section.
   — un-comment together with the section.
══════════════════════════════════════════ */

/*
const lightbox  = document.getElementById('lightbox');
const lbMedia   = document.getElementById('lbMedia');
const lbCaption = document.getElementById('lbCaption');

function openLightbox(el) {
  if (!lightbox || !lbMedia || !lbCaption) return;

  const type  = el.dataset.type;
  const src   = el.dataset.src;
  const title = el.dataset.title || '';

  lbMedia.innerHTML = '';

  if (type === 'video') {
    const video = document.createElement('video');
    video.src                     = src;
    video.controls                = true;
    video.autoplay                = true;
    video.controlsList            = 'nodownload noremoteplayback';
    video.disablePictureInPicture = true;
    video.setAttribute('playsinline', '');
    video.addEventListener('contextmenu', e => e.preventDefault());
    lbMedia.appendChild(video);
  } else {
    const img = document.createElement('img');
    img.src = src;
    img.alt = title;
    img.addEventListener('contextmenu', e => e.preventDefault());
    lbMedia.appendChild(img);
  }

  lbCaption.textContent = title;
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox(e) {
  if (!lightbox) return;
  if (e && e.target !== lightbox && !e.target.classList.contains('lb-close')) return;

  const video = lbMedia ? lbMedia.querySelector('video') : null;
  if (video) { video.pause(); video.src = ''; }
  if (lbMedia) lbMedia.innerHTML = '';
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && lightbox && lightbox.classList.contains('open')) {
    const video = lbMedia ? lbMedia.querySelector('video') : null;
    if (video) { video.pause(); video.src = ''; }
    if (lbMedia) lbMedia.innerHTML = '';
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }
});
*/


/* ══════════════════════════════════════════
   FORMSPREE CONTACT FORM
══════════════════════════════════════════ */
async function sendToFormspree() {
  const nameEl  = document.getElementById('fs-name');
  const emailEl = document.getElementById('fs-email');
  const msgEl   = document.getElementById('fs-msg');
  const btn     = document.getElementById('fs-btn');
  const ok      = document.getElementById('fs-success');
  const err     = document.getElementById('fs-error');

  if (!nameEl || !emailEl || !msgEl || !btn) return;

  const name  = nameEl.value.trim();
  const email = emailEl.value.trim();
  const msg   = msgEl.value.trim();

  if (!name || !email || !msg) {
    alert('Please fill in all fields before sending.');
    return;
  }

  btn.disabled = true;
  btn.innerHTML = 'Sending\u2026';
  if (ok)  ok.style.display  = 'none';
  if (err) err.style.display = 'none';

  try {
    const res = await fetch('https://formspree.io/f/mzdokywj', {
      method:  'POST',
      headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, message: msg })
    });

    if (res.ok) {
      if (ok) ok.style.display = 'block';
      nameEl.value  = '';
      emailEl.value = '';
      msgEl.value   = '';
      btn.innerHTML = '\u2713 Sent!';
    } else {
      throw new Error('Failed');
    }
  } catch {
    if (err) err.style.display = 'block';
    btn.disabled  = false;
    btn.innerHTML = 'Try again \u2197';
  }
}


/* ══════════════════════════════════════════
   MAGICA STAR FIELD
   — only runs if #stars canvas is present
     (magica-coming-soon.html only)
══════════════════════════════════════════ */
const canvas = document.getElementById('stars');
if (canvas) {
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const stars = Array.from({ length: 160 }, () => ({
    x:   Math.random(),
    y:   Math.random(),
    r:   Math.random() * 1.1 + 0.2,
    a:   Math.random(),
    spd: Math.random() * 0.004 + 0.001,
    dir: Math.random() > 0.5 ? 1 : -1
  }));

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    stars.forEach(s => {
      s.a += s.spd * s.dir;
      if (s.a > 1 || s.a < 0.1) s.dir *= -1;
      ctx.beginPath();
      ctx.arc(s.x * canvas.width, s.y * canvas.height, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(220,180,255,${s.a * 0.65})`;
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }

  draw();
}


/* ══════════════════════════════════════════
   HAMBURGER MENU
══════════════════════════════════════════ */
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

function closeMenu() {
  if (!mobileMenu || !hamburger) return;
  mobileMenu.classList.remove('open');
  hamburger.classList.remove('open');
  document.body.style.overflow = '';
}

function toggleMenu() {
  if (!mobileMenu || !hamburger) return;
  const isOpen = mobileMenu.classList.contains('open');
  if (isOpen) {
    closeMenu();
  } else {
    mobileMenu.classList.add('open');
    hamburger.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}

if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', function (e) {
    e.stopPropagation();
    toggleMenu();
  });

  mobileMenu.querySelectorAll('.mobile-link, .mobile-cta').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('click', function (e) {
    if (!mobileMenu.contains(e.target) && !hamburger.contains(e.target)) {
      closeMenu();
    }
  });
}