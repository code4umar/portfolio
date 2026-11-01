(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const root = document.documentElement;
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const EMAIL = 'muhammadumarfarooqi347@gmail.com';
  const NAV_OFFSET = -70;

  $('#year').textContent = new Date().getFullYear();
  const t = (key) => window.i18n?.t(key) ?? key;

  // The seal's name ring spins with SMIL, which ignores CSS motion settings
  if (reduceMotion) $$('.seal-ring animateTransform').forEach((a) => a.remove());

  /* ---------- Analytics (Google Analytics 4 and/or GoatCounter) ----------
     IDs are set in window.SITE_CONFIG in index.html. Nothing loads while
     they are empty, and nothing loads for visitors with Do Not Track on. */
  const CONFIG = window.SITE_CONFIG || {};
  const dnt = navigator.doNotTrack === '1' || window.doNotTrack === '1';
  const isLocal = location.protocol === 'file:' || ['localhost', '127.0.0.1'].includes(location.hostname);
  const loadScript = (src, attrs = {}) => {
    const s = document.createElement('script');
    s.async = true;
    s.src = src;
    Object.entries(attrs).forEach(([k, v]) => s.setAttribute(k, v));
    document.head.appendChild(s);
  };
  if (!dnt && !isLocal) {
    if (CONFIG.ga4) {
      window.dataLayer = window.dataLayer || [];
      window.gtag = function () { window.dataLayer.push(arguments); };
      window.gtag('js', new Date());
      window.gtag('config', CONFIG.ga4, { anonymize_ip: true });
      loadScript(`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(CONFIG.ga4)}`);
    }
    if (CONFIG.goatcounter) {
      loadScript('https://gc.zgo.at/count.js', { 'data-goatcounter': `https://${CONFIG.goatcounter}.goatcounter.com/count` });
    }
  }
  // Custom events: CV downloads, contact, project clicks, language switches
  const track = (name, params = {}) => {
    window.gtag?.('event', name, params);
    window.goatcounter?.count?.({ path: `event/${name}`, title: name, event: true });
  };
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a');
    if (!a) return;
    const href = a.getAttribute('href') || '';
    if (href.endsWith('resume.pdf')) track('download-cv');
    else if (href.includes('trydeskly')) track('open-deskly');
    else if (href.includes('github.com')) track('open-github', { url: href });
    else if (href.includes('linkedin.com')) track('open-linkedin');
    else if (href.includes('assets/certificates/')) track('view-certificate', { file: href });
  });
  document.addEventListener('langchange', (e) => track('language', { lang: e.detail.lang }));

  /* ---------- Toast ---------- */
  const toast = $('#toast');
  let toastTimer;
  const showToast = (msg) => {
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2400);
  };

  /* ---------- Split hero name into characters ---------- */
  let charIndex = 0;
  $$('[data-chars]').forEach((el) => {
    const text = el.textContent;
    el.textContent = '';
    el.setAttribute('aria-hidden', 'true');
    // Wrap each word so lines only break between words, never inside one
    text.split(' ').forEach((word, w) => {
      if (w > 0) el.appendChild(document.createTextNode(' '));
      const wordEl = document.createElement('span');
      wordEl.className = 'word';
      [...word].forEach((ch) => {
        const s = document.createElement('span');
        s.className = 'char';
        s.textContent = ch;
        s.style.setProperty('--i', charIndex++);
        wordEl.appendChild(s);
      });
      el.appendChild(wordEl);
    });
  });

  /* ---------- Smooth scrolling (Lenis, if it loaded) ---------- */
  let lenis = null;
  if (window.Lenis && !reduceMotion) {
    lenis = new Lenis({ duration: 1.15, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    const raf = (time) => { lenis.raf(time); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
  }
  const smoothTo = (target) => {
    if (target === '#top') target = 0;
    if (lenis) return lenis.scrollTo(target, { offset: typeof target === 'number' ? 0 : NAV_OFFSET });
    if (typeof target === 'number') scrollTo({ top: target, behavior: reduceMotion ? 'auto' : 'smooth' });
    else $(target)?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
  };
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a || a.hash.length < 2 || !$(a.hash)) return;
    e.preventDefault();
    smoothTo(a.hash);
    history.replaceState(null, '', a.hash);
  });

  /* ---------- Loader ---------- */
  const heroReveals = $$('.hero .reveal');
  const finishLoading = () => {
    if (document.body.classList.contains('loaded')) return;
    document.body.classList.add('loaded');
    heroReveals.forEach((el, i) => {
      el.style.setProperty('--d', `${0.5 + i * 0.1}s`);
      el.classList.add('in');
    });
  };
  (() => {
    const fill = $('#loaderFill');
    if (reduceMotion || !fill) return finishLoading();
    const start = performance.now();
    const minDur = 1500;
    // Safety net: rAF is paused in background tabs, so never wait longer than this
    setTimeout(finishLoading, 3500);
    let pageLoaded = document.readyState === 'complete';
    addEventListener('load', () => { pageLoaded = true; });
    const step = (now) => {
      const t = now - start;
      const cap = pageLoaded ? 1 : 0.9;
      const p = Math.min(cap, 1 - Math.pow(1 - Math.min(t / minDur, 1), 3));
      fill.style.width = `${p * 100}%`;
      if (p >= 1) return setTimeout(finishLoading, 200);
      if (t > 4000) return finishLoading();
      requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  })();

  /* ---------- Theme (circular reveal with View Transitions) ---------- */
  const setTheme = (theme) => {
    root.dataset.theme = theme;
    $('meta[name="theme-color"]').content = theme === 'dark' ? '#0a1a33' : '#ffffff';
    try { localStorage.setItem('theme', theme); } catch (e) {}
  };
  const toggleTheme = (e) => {
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    if (!document.startViewTransition || reduceMotion) return setTheme(next);
    const x = e?.clientX ?? innerWidth / 2;
    const y = e?.clientY ?? 0;
    const r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    document.startViewTransition(() => setTheme(next)).ready.then(() => {
      root.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
        { duration: 650, easing: 'cubic-bezier(.22,1,.36,1)', pseudoElement: '::view-transition-new(root)' }
      );
    });
  };
  $('#themeToggle').addEventListener('click', toggleTheme);

  /* ---------- Mobile menu ---------- */
  const burger = $('#burger');
  const navLinks = $('#navLinks');
  const closeMenu = () => { navLinks.classList.remove('open'); burger.setAttribute('aria-expanded', 'false'); };
  burger.addEventListener('click', () => burger.setAttribute('aria-expanded', String(navLinks.classList.toggle('open'))));
  $$('a', navLinks).forEach((a) => a.addEventListener('click', closeMenu));
  document.addEventListener('click', (e) => {
    if (!navLinks.contains(e.target) && !burger.contains(e.target)) closeMenu();
  });

  /* ---------- Scroll: nav state, progress fallback, hero parallax ---------- */
  const nav = $('#nav');
  const progress = $('.progress');
  const heroArt = $('#heroArt');
  const supportsScrollTimeline = CSS.supports('animation-timeline: scroll()');
  const onScroll = () => {
    const y = scrollY;
    nav.classList.toggle('scrolled', y > 20);
    if (!supportsScrollTimeline) {
      const max = document.documentElement.scrollHeight - innerHeight;
      progress.style.setProperty('--p', max > 0 ? y / max : 0);
    }
    if (!reduceMotion && y < innerHeight * 1.2) heroArt.style.translate = `0 ${y * 0.12}px`;
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Active nav link ---------- */
  const linkFor = Object.fromEntries($$('a', navLinks).map((a) => [a.hash.slice(1), a]));
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting || !linkFor[entry.target.id]) return;
      $$('a', navLinks).forEach((a) => a.classList.remove('active'));
      linkFor[entry.target.id].classList.add('active');
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  $$('main section[id]').forEach((s) => sectionObserver.observe(s));

  /* ---------- Reveal on scroll (staggered) ---------- */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('in');
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  $$('.reveal').forEach((el) => {
    if (el.closest('.hero')) return; // revealed by the loader
    const siblings = $$(':scope > .reveal', el.parentElement);
    el.style.setProperty('--d', `${Math.min(siblings.indexOf(el), 6) * 0.08}s`);
    revealObserver.observe(el);
  });

  /* ---------- Count-up stats ---------- */
  const countUp = (el) => {
    const target = Number(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    if (reduceMotion) { el.textContent = target + suffix; return; }
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min((now - start) / 1600, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - t, 4))) + suffix;
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      countUp(entry.target);
      countObserver.unobserve(entry.target);
    });
  }, { threshold: 0.6 });
  $$('[data-count]').forEach((el) => countObserver.observe(el));

  /* ---------- Marquee: duplicate items for a seamless loop ---------- */
  const marqueeTrack = $('.marquee-track');
  $$('span', marqueeTrack).forEach((s) => marqueeTrack.appendChild(s.cloneNode(true)));

  /* ---------- Deskly screenshot gallery (auto-advances every 5s) ---------- */
  const dkShots = $$('.dk-shot');
  const dkTabs = $$('.dk-tab');
  let dkIndex = 0, dkTimer;
  const showShot = (i) => {
    dkIndex = i;
    dkShots.forEach((s, j) => s.classList.toggle('active', j === i));
    dkTabs.forEach((t, j) => {
      t.classList.remove('active');
      t.setAttribute('aria-selected', String(j === i));
    });
    void dkTabs[i].offsetWidth; // restart the progress underline
    dkTabs[i].classList.add('active');
    $('#dkUrl').textContent = dkShots[i].dataset.url;
  };
  const startDk = () => {
    clearInterval(dkTimer);
    if (!reduceMotion) dkTimer = setInterval(() => showShot((dkIndex + 1) % dkShots.length), 5000);
  };
  dkTabs.forEach((t) => t.addEventListener('click', () => { showShot(Number(t.dataset.i)); startDk(); }));
  const dkGallery = $('.dk-gallery');
  dkGallery.addEventListener('pointerenter', () => { clearInterval(dkTimer); $('.dk-tabs').classList.add('paused'); });
  dkGallery.addEventListener('pointerleave', () => { $('.dk-tabs').classList.remove('paused'); showShot(dkIndex); startDk(); });
  startDk();

  /* ---------- Project filters ---------- */
  const projects = $$('#projGrid .proj');
  $$('.filter').forEach((btn) => btn.addEventListener('click', () => {
    $$('.filter').forEach((b) => { b.classList.remove('active'); b.setAttribute('aria-selected', 'false'); });
    btn.classList.add('active');
    btn.setAttribute('aria-selected', 'true');
    const f = btn.dataset.filter;
    const apply = () => projects.forEach((p) => {
      p.classList.toggle('hide', f !== 'all' && !p.dataset.cat.split(' ').includes(f));
      p.classList.add('in');
    });
    document.startViewTransition && !reduceMotion ? document.startViewTransition(apply) : apply();
  }));

  /* ---------- Certificate verify links ---------- */
  $$('.cert[data-verify]').forEach((card) => {
    const url = card.dataset.verify.trim();
    if (!url) return;
    const a = document.createElement('a');
    a.className = 'cert-verify';
    a.href = url;
    a.target = '_blank';
    a.rel = 'noopener';
    a.textContent = 'Verify credential ↗';
    card.appendChild(a);
  });

  /* ---------- Live GitHub: profile, languages, recent repos ---------- */
  const GH_USER = 'code4umar';
  const LANG_COLORS = { TypeScript: '#3178c6', JavaScript: '#f1e05a', HTML: '#e34c26', CSS: '#663399', Python: '#3572A5', Shell: '#89e051' };
  // Fallback descriptions for repos that have none on GitHub
  const REPO_NOTES = {
    'support-desk-client': 'Deskly client — Next.js App Router, role-based UI, URL-driven filters.',
    'Support-desk-checklist': 'Deskly API — NestJS, PostgreSQL, JWT roles, audit trail, 53 tests.',
    'Tasks-Api': 'Authenticated NestJS REST API with JWT, TypeORM and e2e tests.',
    'tasks-client-week9': 'Next.js client for the Tasks API — auth, filters, CRUD.',
    'task-manager-typeorm': 'PostgreSQL + TypeORM: typed entities, migrations and seeds.',
    'country-explorer-next': 'Country Explorer rebuilt with Next.js App Router.',
    'Country-Explorer': 'React + Vite + TypeScript country explorer.',
    'user-insights-cli': 'TypeScript CLI generating a ranked user activity report.',
    'task-board': 'React + TypeScript task board.',
    'portfolio': 'This portfolio — vanilla HTML, CSS and JavaScript.',
  };
  const repoList = $('#ghRepoList');
  repoList.innerHTML = '<div class="repo-skel"></div>'.repeat(4);
  const timeAgo = (iso) => {
    const days = Math.floor((Date.now() - new Date(iso)) / 864e5);
    if (days < 1) return 'today';
    if (days < 30) return `${days}d ago`;
    if (days < 365) return `${Math.floor(days / 30)}mo ago`;
    return `${Math.floor(days / 365)}y ago`;
  };
  const getJSON = (url) => fetch(url).then((r) => (r.ok ? r.json() : Promise.reject(r.status)));

  Promise.all([
    getJSON(`https://api.github.com/users/${GH_USER}`),
    getJSON(`https://api.github.com/users/${GH_USER}/repos?per_page=100&sort=pushed`),
  ]).then(([user, repos]) => {
    const countEl = $('#repoCount');
    countEl.dataset.count = user.public_repos;
    if (countEl.textContent !== '0') countEl.textContent = user.public_repos;
    $('#ghRepos').textContent = user.public_repos;
    $('#ghFollowers').textContent = user.followers;
    if (user.avatar_url) $('#ghAvatar').src = user.avatar_url;
    $('#ghSince').textContent = `On GitHub since ${new Date(user.created_at).getFullYear()}`;

    const langs = {};
    repos.forEach((r) => { if (r.language) langs[r.language] = (langs[r.language] || 0) + 1; });
    const total = Object.values(langs).reduce((a, b) => a + b, 0) || 1;
    const sorted = Object.entries(langs).sort((a, b) => b[1] - a[1]);
    const colorOf = (l) => LANG_COLORS[l] || '#8b949e';
    $('#ghLangs').textContent = sorted.length;
    $('#ghLangBar').innerHTML = sorted.map(([l, n]) => `<span style="flex-grow:${n};background:${colorOf(l)}" title="${l}"></span>`).join('');
    $('#ghLegend').innerHTML = sorted.map(([l, n]) => `<li><i style="background:${colorOf(l)}"></i>${l} <span class="muted">${Math.round((n / total) * 100)}%</span></li>`).join('');

    const recent = repos.filter((r) => !r.fork && r.name !== GH_USER).slice(0, 6);
    repoList.innerHTML = '';
    recent.forEach((r) => {
      const a = document.createElement('a');
      a.className = 'repo';
      a.href = r.html_url;
      a.target = '_blank';
      a.rel = 'noopener';
      a.innerHTML = `
        <span class="repo-name"><svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor"><path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.71 1.71.75.75 0 0 1-1.07 1.05A2.5 2.5 0 0 1 2 11.5zm10.5-1h-8a1 1 0 0 0-1 1v6.71A2.5 2.5 0 0 1 4.5 9h8z"/></svg><span></span></span>
        <span class="repo-desc"></span>
        <span class="repo-meta">${r.language ? `<span class="repo-lang"><i style="background:${colorOf(r.language)}"></i>${r.language}</span>` : ''}<span>★ ${r.stargazers_count}</span><span>Updated ${timeAgo(r.pushed_at)}</span></span>`;
      $('.repo-name > span', a).textContent = r.name.replace(/^-+|-+$/g, '').replace(/-/g, ' ');
      $('.repo-desc', a).textContent = r.description || REPO_NOTES[r.name] || 'Source code on GitHub.';
      repoList.appendChild(a);
    });
  }).catch(() => {
    repoList.innerHTML = `<a class="repo" href="https://github.com/${GH_USER}" target="_blank" rel="noopener"><span class="repo-name">View all repositories ↗</span><span class="repo-desc">Live data couldn't load right now.</span></a>`;
  });

  /* ---------- Copy email ---------- */
  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      showToast(t('copied'));
      track('copy-email');
    } catch (e) {
      location.href = `mailto:${EMAIL}`;
    }
  };
  $('#copyEmail').addEventListener('click', async () => {
    await copyEmail();
    const label = $('#copyEmail .copy-label');
    label.textContent = t('copiedLabel');
    setTimeout(() => (label.textContent = t('copy')), 1800);
  });

  /* ---------- Contact form ----------
     With a Web3Forms key (SITE_CONFIG.web3forms) messages are delivered
     straight to Gmail; without one it falls back to the visitor's mail app. */
  const form = $('#contactForm');
  const note = $('#formNote');
  const submitBtn = $('button[type="submit"]', form);
  const setNote = (text, state = '') => {
    note.className = `form-note ${state}`.trim();
    note.textContent = text;
  };
  const mailtoHref = ({ name, email, message }) =>
    `mailto:${EMAIL}?subject=${encodeURIComponent(`Portfolio enquiry from ${name}`)}&body=${encodeURIComponent(`${message}\n\n— ${name} (${email})`)}`;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    let ok = true;
    $$('.field', form).forEach((f) => {
      const input = $('input, textarea', f);
      const valid = input.value.trim() !== '' && input.checkValidity();
      f.classList.toggle('invalid', !valid);
      if (!valid) ok = false;
    });
    if (!ok) return setNote(t('formInvalid'), 'err');
    const data = Object.fromEntries(new FormData(form));
    if (data.botcheck) return; // spam bot ticked the hidden box

    if (!CONFIG.web3forms) {
      location.href = mailtoHref(data);
      setNote(t('formSent'));
      track('contact-form-submit', { via: 'mailto' });
      return form.reset();
    }

    submitBtn.disabled = true;
    setNote(t('formSending'));
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: CONFIG.web3forms,
          subject: `New portfolio message from ${data.name}`,
          from_name: 'Portfolio — code4umar.github.io',
          name: data.name,
          email: data.email,
          replyto: data.email,
          message: data.message,
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || json.success === false) throw new Error(json.message || res.status);
      setNote(t('formDelivered'), 'ok');
      track('contact-form-submit', { via: 'web3forms' });
      form.reset();
    } catch (err) {
      note.className = 'form-note err';
      note.innerHTML = `${t('formFailed')} <a href="${mailtoHref(data)}">${t('formFallback')}</a>`;
    } finally {
      submitBtn.disabled = false;
    }
  });
  $$('.field input, .field textarea', form).forEach((i) => i.addEventListener('input', () => i.parentElement.classList.remove('invalid')));

  /* ---------- Command palette (Ctrl/Cmd + K) ---------- */
  const cmd = $('#cmd');
  const cmdInput = $('#cmdInput');
  const cmdList = $('#cmdList');
  const go = (id) => () => smoothTo(id);
  const open = (url) => () => window.open(url, '_blank', 'noopener');
  const commands = [
    { group: 'Navigate', icon: '⌂', label: 'Home', run: go('#top') },
    { group: 'Navigate', icon: '◉', label: 'About', run: go('#about') },
    { group: 'Navigate', icon: '✦', label: 'Services', run: go('#services') },
    { group: 'Navigate', icon: '⚙', label: 'Skills', run: go('#skills') },
    { group: 'Navigate', icon: '▦', label: 'Work / Projects', run: go('#work') },
    { group: 'Navigate', icon: '↗', label: 'Journey', run: go('#journey') },
    { group: 'Navigate', icon: '⌥', label: 'GitHub activity', run: go('#github') },
    { group: 'Navigate', icon: '✪', label: 'Certifications', run: go('#certifications') },
    { group: 'Navigate', icon: '✉', label: 'Contact', run: go('#contact') },
    { group: 'Projects', icon: '★', label: 'Open Deskly (live demo)', hint: 'trydeskly.vercel.app', run: open('https://trydeskly.vercel.app') },
    { group: 'Projects', icon: '⌥', label: 'Deskly client source', run: open('https://github.com/code4umar/support-desk-client') },
    { group: 'Projects', icon: '⌥', label: 'Deskly API source', run: open('https://github.com/code4umar/Support-desk-checklist') },
    { group: 'Actions', icon: '◐', label: 'Toggle light / navy theme', run: () => toggleTheme() },
    { group: 'Actions', icon: 'ع', label: 'Switch language — English / اردو', hint: 'Urdu', run: () => window.i18n?.toggle() },
    { group: 'Actions', icon: '⧉', label: 'Copy email address', run: copyEmail },
    { group: 'Actions', icon: '↓', label: 'Download résumé', run: () => { const a = document.createElement('a'); a.href = 'resume.pdf'; a.download = ''; a.click(); } },
    { group: 'Links', icon: '⌨', label: 'GitHub profile', hint: '@code4umar', run: open('https://github.com/code4umar') },
    { group: 'Links', icon: 'in', label: 'LinkedIn profile', run: open('https://www.linkedin.com/in/muhammad-umar-farooqi-8825b9227') },
  ];
  let filtered = commands;
  let sel = 0;

  const render = () => {
    cmdList.innerHTML = '';
    if (!filtered.length) { cmdList.innerHTML = '<li class="cmd-empty">No results</li>'; return; }
    let lastGroup = '';
    filtered.forEach((c, i) => {
      if (c.group !== lastGroup) {
        lastGroup = c.group;
        const g = document.createElement('li');
        g.className = 'cmd-group';
        g.setAttribute('role', 'presentation');
        g.textContent = c.group;
        cmdList.appendChild(g);
      }
      const li = document.createElement('li');
      li.className = 'cmd-item';
      li.setAttribute('role', 'option');
      li.setAttribute('aria-selected', String(i === sel));
      li.innerHTML = `<span class="ci"></span><span class="cl"></span>${c.hint ? '<span class="hint"></span>' : ''}`;
      $('.ci', li).textContent = c.icon;
      $('.cl', li).textContent = c.label;
      if (c.hint) $('.hint', li).textContent = c.hint;
      li.addEventListener('click', () => runCmd(c));
      li.addEventListener('pointermove', () => { if (sel !== i) { sel = i; updateSel(); } });
      cmdList.appendChild(li);
    });
  };
  const updateSel = () => {
    const items = $$('.cmd-item', cmdList);
    items.forEach((li, i) => li.setAttribute('aria-selected', String(i === sel)));
    items[sel]?.scrollIntoView({ block: 'nearest' });
  };
  const openCmd = () => {
    if (cmd.open) return;
    cmdInput.value = '';
    filtered = commands;
    sel = 0;
    render();
    cmd.showModal();
    cmdInput.focus();
  };
  const runCmd = (c) => { cmd.close(); closeMenu(); c.run(); };

  $('#cmdOpen').addEventListener('click', openCmd);
  cmd.addEventListener('click', (e) => { if (e.target === cmd) cmd.close(); });
  cmdInput.addEventListener('input', () => {
    const q = cmdInput.value.toLowerCase().trim();
    filtered = commands.filter((c) => `${c.label} ${c.group} ${c.hint || ''}`.toLowerCase().includes(q));
    sel = 0;
    render();
  });
  cmdInput.addEventListener('keydown', (e) => {
    const n = Math.max(filtered.length, 1);
    if (e.key === 'ArrowDown') { e.preventDefault(); sel = (sel + 1) % n; updateSel(); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); sel = (sel - 1 + n) % n; updateSel(); }
    else if (e.key === 'Enter' && filtered[sel]) { e.preventDefault(); runCmd(filtered[sel]); }
  });
  addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); cmd.open ? cmd.close() : openCmd(); }
    else if (e.key === '/' && !/input|textarea/i.test(document.activeElement.tagName)) { e.preventDefault(); openCmd(); }
  });
})();
