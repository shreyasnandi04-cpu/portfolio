/* ══════════════════════════════════════════════════════
   SHREYAS NANDI — PORTFOLIO v2
   Advanced animations & interactions
══════════════════════════════════════════════════════ */

// ── Generate starfield (shown in night mode) ──
(function makeStars() {
  const wrap = document.getElementById('stars');
  if (!wrap) return;
  const n = window.innerWidth < 600 ? 70 : 130;
  let html = '';
  for (let i = 0; i < n; i++) {
    const x = (Math.random() * 100).toFixed(2);
    const y = (Math.random() * 100).toFixed(2);
    const s = (Math.random() * 2 + 1).toFixed(2);
    const tw = (Math.random() * 3 + 2).toFixed(2);
    const dl = (Math.random() * 4).toFixed(2);
    html += `<span class="star" style="left:${x}%;top:${y}%;width:${s}px;height:${s}px;--tw:${tw}s;--dl:${dl}s"></span>`;
  }
  wrap.innerHTML = html;
})();

// ── Space parallax: layers drift at different rates on scroll + pointer ──
(function spaceParallax() {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const layers = [
    { el: document.getElementById('stars'), scroll: .05, pointer: 6 },
  ].filter(l => l.el);
  if (!layers.length) return;

  let sy = window.scrollY, px = 0, py = 0, queued = false;

  function apply() {
    queued = false;
    for (const l of layers) {
      const x = px * l.pointer;
      const y = sy * l.scroll + py * l.pointer;
      l.el.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0)`;
    }
  }
  function schedule() { if (!queued) { queued = true; requestAnimationFrame(apply); } }

  addEventListener('scroll', () => { sy = window.scrollY; schedule(); }, { passive: true });
  if (innerWidth > 768) {
    addEventListener('mousemove', e => {
      px = (e.clientX / innerWidth  - .5) * 2;
      py = (e.clientY / innerHeight - .5) * 2;
      schedule();
    }, { passive: true });
  }
  apply();
})();

// ── Dusk → midnight: publish scroll progress as --sp (0 at top, 1 at bottom) ──
(function skyProgress() {
  const root = document.documentElement;
  let queued = false;

  function apply() {
    queued = false;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    // ease-in-out so the shift is gentle at both ends rather than linear
    const p = max > 0 ? Math.min(Math.max(window.scrollY / max, 0), 1) : 0;
    const eased = p < .5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
    root.style.setProperty('--sp', eased.toFixed(4));
  }
  function schedule() { if (!queued) { queued = true; requestAnimationFrame(apply); } }

  addEventListener('scroll', schedule, { passive: true });
  addEventListener('resize', schedule, { passive: true });
  apply();
})();

// ── Cursor glow follow ──
const glow = document.getElementById('cursorGlow');
if (glow && window.innerWidth > 768) {
  document.addEventListener('mousemove', e => {
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
  });
}

// ── Navbar scroll effect ──
const navbar = document.getElementById('navbar');
let lastScroll = 0;
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  navbar.classList.toggle('scrolled', y > 40);
  lastScroll = y;
});

// ── Mobile menu ──
const navToggle = document.getElementById('navToggle');
const mobileMenu = document.getElementById('mobileMenu');
navToggle.addEventListener('click', () => {
  const open = mobileMenu.classList.toggle('open');
  const spans = navToggle.querySelectorAll('span');
  spans[0].style.transform = open ? 'rotate(45deg) translate(5px,5px)' : '';
  spans[1].style.opacity = open ? '0' : '1';
  spans[2].style.transform = open ? 'rotate(-45deg) translate(5px,-5px)' : '';
});
mobileMenu.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    navToggle.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = '1'; });
  });
});

// ── Counter animation ──
function animateCounters() {
  document.querySelectorAll('[data-count]').forEach(el => {
    const target = parseInt(el.dataset.count);
    const duration = 1500;
    const start = performance.now();
    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4); // easeOutQuart
      el.textContent = Math.round(target * eased);
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  });
}

// ── Scroll reveal with stagger ──
function setupReveal() {
  // Auto-classify elements
  const revealMap = [
    { sel: '.about-left', cls: 'reveal-left' },
    { sel: '.terminal-card', cls: 'reveal-right' },
    { sel: '.contact-left', cls: 'reveal-left' },
    { sel: '.contact-right', cls: 'reveal-right' },
    { sel: '.project-showcase', cls: 'reveal-scale' },
    { sel: '.arch-diagram', cls: 'reveal' },
    { sel: '.section-title', cls: 'reveal' },
    { sel: '.section-desc', cls: 'reveal' },
  ];

  revealMap.forEach(({ sel, cls }) => {
    document.querySelectorAll(sel).forEach(el => {
      if (!el.classList.contains('reveal') && !el.classList.contains('reveal-left') && !el.classList.contains('reveal-right') && !el.classList.contains('reveal-scale')) {
        el.classList.add(cls);
      }
    });
  });

  // Stagger grids
  document.querySelectorAll('.tech-grid, .features-grid, .skills-columns, .arch-services').forEach(grid => {
    grid.classList.add('reveal', 'stagger-children');
    Array.from(grid.children).forEach(child => child.classList.add('reveal'));
  });

  // Contact rows
  document.querySelectorAll('.contact-row').forEach(el => el.classList.add('reveal'));

  // Observe
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');

        // Trigger counters when hero metrics appear
        if (entry.target.closest && entry.target.closest('.hero-metrics')) {
          animateCounters();
        }
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(el => observer.observe(el));

  // Also observe hero-metrics
  const metrics = document.querySelector('.hero-metrics');
  if (metrics) {
    metrics.classList.add('reveal');
    observer.observe(metrics);
  }
}

setupReveal();

// ── Trigger counter on first paint for hero ──
const heroMetricsObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      setTimeout(animateCounters, 1300); // after hero animations
      heroMetricsObs.disconnect();
    }
  });
}, { threshold: 0.5 });
const hm = document.querySelector('.hero-metrics');
if (hm) heroMetricsObs.observe(hm);

// ── Smooth scroll ──
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// ── Active nav highlight on scroll ──
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY + 100;
  sections.forEach(section => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute('id');
    const link = document.querySelector(`.nav-links a[href="#${id}"]`);
    if (link) {
      if (scrollY >= top && scrollY < top + height) {
        link.style.color = 'var(--accent)';
      } else {
        link.style.color = '';
      }
    }
  });
});
