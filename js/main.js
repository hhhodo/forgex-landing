(() => {
  const nav = document.getElementById('nav');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  const onScroll = () => {
    nav.classList.toggle('is-scrolled', window.scrollY > 40);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  // ---------- hero: auto-advancing slider (dots + pause + drag/swipe) ----------
  const heroVisual = document.querySelector('.hero__visual');
  const heroSlidesEl = document.getElementById('heroSlides');
  const heroPause = document.getElementById('heroPause');
  const heroDotsWrap = document.getElementById('heroDots');
  if (heroVisual && heroSlidesEl) {
    const slides = [...heroSlidesEl.querySelectorAll('.hero__slide')];
    const dots = [...heroDotsWrap.querySelectorAll('.hero__dot')];
    const AUTO_MS = 5000;
    const reduceMotionHero = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let current = 0;
    let timer = null;
    let paused = reduceMotionHero;

    const render = () => {
      slides.forEach((s, i) => s.classList.toggle('is-active', i === current));
      dots.forEach((d, i) => d.classList.toggle('is-active', i === current));
    };
    const goTo = (index) => {
      current = ((index % slides.length) + slides.length) % slides.length;
      render();
    };
    const next = () => goTo(current + 1);

    const stop = () => { if (timer) { clearInterval(timer); timer = null; } };
    const start = () => {
      stop();
      if (paused) return;
      timer = setInterval(next, AUTO_MS);
    };

    heroPause.addEventListener('click', () => {
      paused = !paused;
      heroPause.classList.toggle('is-paused', paused);
      heroPause.setAttribute('aria-pressed', String(paused));
      heroPause.setAttribute('aria-label', paused ? '자동 재생 시작' : '자동 재생 일시정지');
      start();
    });

    dots.forEach((dot) => {
      dot.addEventListener('click', () => {
        goTo(Number(dot.dataset.slide));
        start();
      });
    });

    let dragStartX = null;
    heroVisual.addEventListener('pointerdown', (e) => {
      dragStartX = e.clientX;
      heroVisual.classList.add('is-dragging');
    });
    window.addEventListener('pointerup', (e) => {
      if (dragStartX === null) return;
      const delta = e.clientX - dragStartX;
      dragStartX = null;
      heroVisual.classList.remove('is-dragging');
      const THRESHOLD = 40;
      if (delta <= -THRESHOLD) { next(); start(); }
      else if (delta >= THRESHOLD) { goTo(current - 1); start(); }
    });
    window.addEventListener('pointercancel', () => {
      dragStartX = null;
      heroVisual.classList.remove('is-dragging');
    });

    render();
    start();
  }

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  // ---------- showcase: center-focus scroll carousel ----------
  const track = document.getElementById('showcaseTrack');
  if (track) {
    const cards = [...track.querySelectorAll('.showcase__card')];
    let rafId = null;

    const updateCenter = () => {
      rafId = null;
      const trackRect = track.getBoundingClientRect();
      const centerX = trackRect.left + trackRect.width / 2;
      let closest = null;
      let closestDist = Infinity;
      cards.forEach((card) => {
        const r = card.getBoundingClientRect();
        const dist = Math.abs(r.left + r.width / 2 - centerX);
        if (dist < closestDist) { closestDist = dist; closest = card; }
      });
      cards.forEach((card) => card.classList.toggle('is-center', card === closest));
    };
    const scheduleUpdate = () => { if (!rafId) rafId = requestAnimationFrame(updateCenter); };

    updateCenter();
    track.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate);

    let isDown = false;
    let startX = 0;
    let startScroll = 0;
    track.addEventListener('mousedown', (e) => {
      isDown = true;
      track.classList.add('is-dragging');
      startX = e.pageX;
      startScroll = track.scrollLeft;
    });
    window.addEventListener('mouseup', () => { isDown = false; track.classList.remove('is-dragging'); });
    window.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      track.scrollLeft = startScroll - (e.pageX - startX);
    });
  }

  // ---------- cta: mouse-following interactive dot grid ----------
  const ctaSection = document.querySelector('.cta');
  const dotsWrap = document.getElementById('ctaDots');
  if (ctaSection && dotsWrap) {
    const spacing = 44;
    let dots = [];

    const buildDots = () => {
      dotsWrap.innerHTML = '';
      dots = [];
      const w = ctaSection.offsetWidth;
      const h = ctaSection.offsetHeight;
      const cols = Math.ceil(w / spacing);
      const rows = Math.ceil(h / spacing);
      const frag = document.createDocumentFragment();
      for (let r = 0; r <= rows; r += 1) {
        for (let c = 0; c <= cols; c += 1) {
          const x = c * spacing;
          const y = r * spacing;
          const dot = document.createElement('span');
          dot.className = 'cta__dot';
          dot.style.left = `${x}px`;
          dot.style.top = `${y}px`;
          frag.appendChild(dot);
          dots.push({ el: dot, x, y });
        }
      }
      dotsWrap.appendChild(frag);
    };
    buildDots();
    window.addEventListener('resize', buildDots);

    let dotsRaf = null;
    let pointer = null;
    const applyDots = () => {
      dotsRaf = null;
      dots.forEach(({ el, x, y }) => {
        if (!pointer) { el.style.transform = 'scale(1)'; return; }
        const dist = Math.hypot(pointer.x - x, pointer.y - y);
        const scale = Math.min(2.8, Math.max(0.5, 2.8 - dist / 60));
        el.style.transform = `scale(${scale})`;
      });
    };
    const scheduleDots = () => { if (!dotsRaf) dotsRaf = requestAnimationFrame(applyDots); };

    ctaSection.addEventListener('mousemove', (e) => {
      const rect = ctaSection.getBoundingClientRect();
      pointer = { x: e.clientX - rect.left, y: e.clientY - rect.top };
      scheduleDots();
    });
    ctaSection.addEventListener('mouseleave', () => { pointer = null; scheduleDots(); });
  }

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealTargets = document.querySelectorAll('[data-reveal]');

  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealTargets.forEach((el) => el.classList.add('is-visible'));
  } else {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
    );
    revealTargets.forEach((el) => observer.observe(el));
  }
})();
