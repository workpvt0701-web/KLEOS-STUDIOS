/* =====================================================================
   KLEOS — animations.js
   Everything that moves, except the cursor (that's in cursor.js).
   Sections are clearly separated so you can edit one without breaking others.
   ===================================================================== */
(function () {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 1. PRELOADER --------------------------------------------
     Spells out KLEOS letter by letter, draws the gold line, then reveals
     the site. Capped so it never feels slow (max ~2.5s).               */
  function runPreloader() {
    const word = document.getElementById('preloader-word');
    const preloader = document.getElementById('preloader');
    const letters = 'KLEOS'.split('');

    letters.forEach(function (ch, i) {
      const span = document.createElement('span');
      span.textContent = ch;
      span.style.animationDelay = (i * 0.12) + 's';
      word.appendChild(span);
    });

    // Reveal the site, then hide the preloader.
    const total = reduceMotion ? 200 : 2000;
    setTimeout(function () {
      document.body.classList.add('loaded');
      preloader.classList.add('done');
    }, total);
  }

  /* ---------- 2. SCROLL REVEALS ---------------------------------------
     Any element with class "reveal" fades up when it enters the screen. */
  function setupReveals() {
    const items = document.querySelectorAll('.reveal');
    if (reduceMotion) { items.forEach(el => el.classList.add('in')); return; }

    const obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    items.forEach(el => obs.observe(el));
  }

  /* ---------- 3. STAT COUNT-UP ----------------------------------------
     Numbers count from 0 to their data-count value when scrolled into view. */
  function setupCounters() {
    const nums = document.querySelectorAll('.stat-num');

    const obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-count'), 10);
        obs.unobserve(el);

        if (reduceMotion) { el.textContent = target.toLocaleString(); return; }

        const duration = 1600;
        const start = performance.now();
        function tick(now) {
          const p = Math.min((now - start) / duration, 1);
          // easeOutExpo for a cinematic settle
          const eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
          el.textContent = Math.floor(eased * target).toLocaleString();
          if (p < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
      });
    }, { threshold: 0.5 });

    nums.forEach(el => obs.observe(el));
  }

  /* ---------- 4. SCROLL PROGRESS BAR ---------------------------------- */
  function setupScrollProgress() {
    const bar = document.getElementById('scroll-progress');
    window.addEventListener('scroll', function () {
      const h = document.documentElement;
      const scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
      bar.style.width = scrolled + '%';
    });
  }

  /* ---------- 5. BACK TO TOP ------------------------------------------ */
  function setupBackToTop() {
    const btn = document.getElementById('back-to-top');
    window.addEventListener('scroll', function () {
      const half = (document.documentElement.scrollHeight - window.innerHeight) * 0.5;
      btn.classList.toggle('show', window.scrollY > half);
    });
    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  }

  /* ---------- 6. HERO GLOW + TITLE REVEAL ----------------------------- */
  /* ---- HERO VIDEO CROSSFADE ----
     Slowly fades between the two background videos every few seconds.
     Does nothing if there aren't two videos. */
  function setupHeroVideos() {
    const vids = document.querySelectorAll('.hero-vid');
    if (vids.length < 2) return;
    let active = 0;
    setInterval(function () {
      vids[active].classList.remove('is-active');
      active = (active + 1) % vids.length;
      vids[active].classList.add('is-active');
    }, 6000); // each clip is shown ~6s before crossfading
  }

  function setupHero() {
    const glow = document.getElementById('hero-glow');
    const hero = document.getElementById('hero');
    if (glow && hero && !reduceMotion) {
      hero.addEventListener('mousemove', function (e) {
        const r = hero.getBoundingClientRect();
        glow.style.left = (e.clientX - r.left) + 'px';
        glow.style.top  = (e.clientY - r.top)  + 'px';
      });
    }

    // Split the hero title into animated words/letters.
    const title = document.getElementById('hero-title');
    if (!title) return;
    const text = title.textContent.trim();
    title.innerHTML = '';
    text.split(' ').forEach(function (word, wi) {
      const wSpan = document.createElement('span');
      wSpan.className = 'word';
      const inner = document.createElement('span');
      inner.textContent = word;
      inner.style.animationDelay = (0.2 + wi * 0.12) + 's';
      wSpan.appendChild(inner);
      title.appendChild(wSpan);
      title.appendChild(document.createTextNode(' '));
    });
  }

  /* ---------- 7. PARALLAX ON HERO SIGNATURE LINE ---------------------- */
  function setupParallax() {
    if (reduceMotion) return;
    const line = document.querySelector('.hero-signature');
    if (!line) return;
    window.addEventListener('scroll', function () {
      const offset = window.scrollY * 0.15;
      line.style.transform = 'translateX(' + offset + 'px)';
    });
  }

  /* ---------- 8. TIMELINE (gold line draws, entries fade in) ---------- */
  function setupTimeline() {
    const line = document.getElementById('timeline-line');
    const entries = document.querySelectorAll('.timeline-entry');
    const timeline = document.querySelector('.timeline');
    if (!timeline) return;

    if (reduceMotion) {
      entries.forEach(e => e.classList.add('in'));
      if (line) line.style.height = '100%';
      return;
    }

    // Reveal each entry as it enters view.
    const obs = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); obs.unobserve(e.target); }
      });
    }, { threshold: 0.3 });
    entries.forEach(e => obs.observe(e));

    // Grow the gold line based on how far the timeline is scrolled.
    window.addEventListener('scroll', function () {
      const r = timeline.getBoundingClientRect();
      const vh = window.innerHeight;
      let progress = (vh - r.top) / (r.height + vh * 0.5);
      progress = Math.max(0, Math.min(1, progress));
      if (line) line.style.height = (progress * 100) + '%';
    });
  }

  /* ---------- 9. PORTFOLIO FILTER ------------------------------------- */
  function setupFilters() {
    const tabs = document.querySelectorAll('.filter-tab');
    const cards = document.querySelectorAll('.work-card');

    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const filter = tab.getAttribute('data-filter');
        cards.forEach(function (card) {
          const show = filter === 'all' || card.getAttribute('data-cat') === filter;
          card.style.display = show ? 'flex' : 'none';
        });
      });
    });
  }

  /* ---------- 10. MOBILE NAV TOGGLE ----------------------------------- */
  function setupNav() {
    const toggle = document.getElementById('nav-toggle');
    const links = document.getElementById('nav-links');
    if (!toggle) return;
    toggle.addEventListener('click', function () {
      links.classList.toggle('open');
      toggle.textContent = links.classList.contains('open') ? '✕' : '☰';
    });
    // close menu after clicking a link
    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        links.classList.remove('open');
        toggle.textContent = '☰';
      });
    });
  }

  /* ---------- 11. COOKIE NOTICE --------------------------------------- */
  function setupCookie() {
    const bar = document.getElementById('cookie-bar');
    const accept = document.getElementById('cookie-accept');
    if (!localStorage.getItem('kleos-cookie-ok')) {
      setTimeout(() => bar.classList.add('show'), 1500);
    }
    accept.addEventListener('click', function () {
      localStorage.setItem('kleos-cookie-ok', '1');
      bar.classList.remove('show');
    });
  }

  /* ---------- 12. CONTACT FORM ----------------------------------------
     Client-side validation + submit. By default it simulates success so
     the form works on a static site. To send real emails, see the
     deployment guide and replace the marked fetch() block.             */
  function setupForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;
    const status = document.getElementById('form-status');
    const submit = document.getElementById('submit-btn');

    function validate() {
      let ok = true;
      ['name', 'subject', 'message'].forEach(function (id) {
        const input = document.getElementById(id);
        const err = form.querySelector('.field-error[data-for="' + id + '"]');
        if (!input.value.trim()) {
          input.classList.add('invalid'); err.classList.add('show'); ok = false;
        } else {
          input.classList.remove('invalid'); err.classList.remove('show');
        }
      });
      return ok;
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      status.textContent = ''; status.className = 'form-status';
      if (!validate()) return;

      submit.classList.add('loading');
      submit.querySelector('.btn-text').textContent = 'Sending';

      // ============================================================
      // Sends the form to Formspree, which emails it to kleoscreates@gmail.com.
      // To change where it goes, swap the URL below for a new Formspree endpoint.
      // ============================================================
      fetch('https://formspree.io/f/mnjyldbk', {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: new FormData(form)
      })
      .then(function (r) { r.ok ? onSuccess() : onError(); })
      .catch(onError);

      function onSuccess() {
        submit.classList.remove('loading');
        submit.querySelector('.btn-text').textContent = 'Send message';
        status.textContent = 'Your message has been received. Kleos will be in touch.';
        status.classList.add('success');
        form.reset();
      }
      function onError() {
        submit.classList.remove('loading');
        submit.querySelector('.btn-text').textContent = 'Send message';
        status.textContent = 'Something went wrong. DM on Instagram instead.';
        status.classList.add('error');
      }
    });
  }

  /* ---------- 13. CINEMATIC PAGE TRANSITIONS --------------------------
     Intercept clicks to internal pages (case studies, home) and play a
     black fade with a KLEOS flash before navigating.                   */
  function setupTransitions() {
    const overlay = document.getElementById('page-transition');
    if (!overlay) return;

    document.querySelectorAll('a[href]').forEach(function (link) {
      const href = link.getAttribute('href');
      // only internal .html links — skip anchors, external, mailto, etc.
      const internal = href &&
        !href.startsWith('#') &&
        !href.startsWith('http') &&
        !href.startsWith('mailto') &&
        !href.startsWith('tel') &&
        (href.endsWith('.html') || href.endsWith('/'));
      if (!internal) return;

      link.addEventListener('click', function (e) {
        if (reduceMotion) return; // let it navigate normally
        e.preventDefault();
        overlay.classList.add('active');
        setTimeout(function () { window.location.href = href; }, 600);
      });
    });
  }

  /* ---------- RUN EVERYTHING ON LOAD ---------------------------------- */
  window.addEventListener('pageshow', function (e) {
    if (e.persisted) {
      document.body.classList.add('loaded');
      const pre = document.getElementById('preloader');
      if (pre) pre.classList.add('done');
    }
  });
  window.addEventListener('DOMContentLoaded', function () {
    runPreloader();
    setupHeroVideos();    // start the background video crossfade
    setupHero();          // build hero title before reveals run
    setupReveals();
    setupCounters();
    setupScrollProgress();
    setupBackToTop();
    setupParallax();
    setupTimeline();
    setupFilters();
    setupNav();
    setupCookie();
    setupForm();
    setupTransitions();
  });
})();
