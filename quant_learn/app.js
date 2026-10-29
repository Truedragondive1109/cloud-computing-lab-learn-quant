/* QuantVerse — vanilla JS, no dependencies */
(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const store = {
    get(k, d) { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} }
  };
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const yt = q => 'https://www.youtube.com/results?search_query=' + encodeURIComponent(q);
  const hostOf = u => { try { return new URL(u).hostname.replace(/^www\./, ''); } catch { return 'external link'; } };

  /* ============ DATA ============ */
  const ROADMAP = [
    { t: 'Mathematical Foundations', d: 'The language of quant finance. Do not skip this — everything builds on it.',
      topics: ['Calculus (limits, derivatives, integrals)', 'Linear algebra (eigen, SVD, PCA)', 'Probability theory', 'Statistics & hypothesis testing', 'Optimization (convex, Lagrange)', 'Numerical methods'],
      links: [['3Blue1Brown', 'https://www.3blue1brown.com/'], ['MIT OCW Math', 'https://ocw.mit.edu/courses/mathematics/'], ['Khan Academy', 'https://www.khanacademy.org/math']] },
    { t: 'Programming & Data', d: 'Write fast, clean, reproducible research code.',
      topics: ['Python fundamentals', 'NumPy, pandas, SciPy', 'Matplotlib / Plotly', 'SQL & data wrangling', 'C++ basics (for low latency)', 'Git & testing'],
      links: [['Python docs', 'https://docs.python.org/3/tutorial/'], ['pandas', 'https://pandas.pydata.org/docs/'], ['learncpp.com', 'https://www.learncpp.com/']] },
    { t: 'Finance Fundamentals', d: 'Understand the instruments and markets you will model.',
      topics: ['Time value of money', 'Bonds, yields & duration', 'Equities & market structure', 'Futures, forwards, swaps', 'Options basics & payoffs', 'Portfolio theory & CAPM'],
      links: [['Investopedia', 'https://www.investopedia.com/'], ['Hull textbook', 'https://www.pearson.com/en-us/subject-catalog/p/options-futures-and-other-derivatives/P200000005942']] },
    { t: 'Stochastic Calculus & Derivatives', d: 'The core engine of derivatives pricing.',
      topics: ['Random walks & Brownian motion', 'Itô’s lemma', 'Martingales & risk-neutral pricing', 'Black–Scholes PDE', 'Greeks & hedging', 'Volatility smiles & local/stochastic vol'],
      links: [['Shreve Vol. I', 'https://link.springer.com/book/10.1007/978-0-387-22527-2'], ['QuantStart', 'https://www.quantstart.com/']] },
    { t: 'Statistics, Time Series & ML', d: 'Extract signal from noisy financial data.',
      topics: ['Regression & regularization', 'Time series (ARIMA, GARCH)', 'Cointegration & stat-arb', 'Cross-validation for finance', 'Tree models & gradient boosting', 'Deep learning basics'],
      links: [['Elements of Stat Learning', 'https://hastie.su.domains/ElemStatLearn/'], ['scikit-learn', 'https://scikit-learn.org/stable/user_guide.html']] },
    { t: 'Strategies & Backtesting', d: 'Turn ideas into tested, risk-aware strategies.',
      topics: ['Momentum & mean reversion', 'Factor investing', 'Backtest design & bias', 'Transaction costs & slippage', 'Position sizing (Kelly)', 'Performance metrics (Sharpe, drawdown)'],
      links: [['vectorbt', 'https://github.com/polakowo/vectorbt'], ['Backtrader', 'https://www.backtrader.com/']] },
    { t: 'Microstructure, Execution & Career', d: 'Go deeper and prepare for interviews.',
      topics: ['Order books & market making', 'Execution algos (VWAP/TWAP)', 'Mental maths & probability puzzles', 'Brainteaser practice', 'Build a public portfolio project', 'Mock interviews'],
      links: [['Jane Street puzzles', 'https://www.janestreet.com/puzzles/'], ['QuantNet', 'https://quantnet.com/']] }
  ];
  const VIDEO_IMAGES = [
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=82',
    'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=900&q=82',
    'https://images.unsplash.com/photo-1642790551116-18e150f248e0?auto=format&fit=crop&w=900&q=82',
    'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=900&q=82',
    'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=900&q=82',
    'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=900&q=82'
  ];

  const CONCEPTS = [
    'Black–Scholes model', 'Geometric Brownian motion', 'Itô\'s lemma', 'Sharpe ratio',
    'Modern portfolio theory', 'Capital asset pricing model', 'Kelly criterion', 'Value at risk',
    'Monte Carlo methods in finance', 'Mean reversion (finance)', 'Pairs trade', 'Efficient-market hypothesis',
    'Algorithmic trading', 'High-frequency trading', 'Stochastic volatility', 'Volatility smile',
    'Yield curve', 'Duration (finance)', 'Implied volatility', 'Binomial options model',
    'Cointegration', 'Autoregressive model', 'GARCH model', 'Limit order book',
    'Principal component analysis', 'Factor investing', 'Maximum drawdown', 'Risk-neutral measure'
  ];
  const conceptIcon = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 17l5-6 4 3 7-8"/><path d="M15 6h5v5"/><path d="M4 20h16"/></svg>`;

  const VIDEOS = [
    { c: 'Courses', t: 'MIT 18.S096 — Topics in Mathematics with Applications in Finance', by: 'MIT OpenCourseWare', u: 'https://ocw.mit.edu/courses/18-s096-topics-in-mathematics-with-applications-in-finance-fall-2013/', g: ['#2dd4bf', '#6366f1'], b: 'Full course' },
    { c: 'Courses', t: 'Financial Markets (Yale)', by: 'Open Yale Courses', u: 'https://oyc.yale.edu/economics/econ-252', g: ['#f2c572', '#f2a1b3'], b: 'Full course' },
    { c: 'Courses', t: 'Quantitative Finance lectures', by: 'YouTube search', u: yt('quantitative finance full course lecture'), g: ['#6366f1', '#a5b4fc'], b: 'Search' },
    { c: 'Math', t: 'Essence of Linear Algebra', by: '3Blue1Brown', u: 'https://www.3blue1brown.com/topics/linear-algebra', g: ['#38bdf8', '#818cf8'], b: 'Series' },
    { c: 'Math', t: 'Essence of Calculus', by: '3Blue1Brown', u: 'https://www.3blue1brown.com/topics/calculus', g: ['#5eead4', '#38bdf8'], b: 'Series' },
    { c: 'Math', t: 'Probability & Statistics', by: 'Khan Academy', u: 'https://www.khanacademy.org/math/statistics-probability', g: ['#34d399', '#fbbf24'], b: 'Course' },
    { c: 'Math', t: 'Stochastic calculus explained', by: 'YouTube search', u: yt('stochastic calculus for finance Ito lemma explained'), g: ['#a78bfa', '#f472b6'], b: 'Search' },
    { c: 'Derivatives', t: 'Black–Scholes derivation walkthrough', by: 'YouTube search', u: yt('Black Scholes equation derivation explained'), g: ['#f472b6', '#fb923c'], b: 'Search' },
    { c: 'Derivatives', t: 'Options Greeks intuition', by: 'YouTube search', u: yt('options greeks delta gamma vega theta explained'), g: ['#fb923c', '#facc15'], b: 'Search' },
    { c: 'Derivatives', t: 'Volatility surface & smile', by: 'YouTube search', u: yt('implied volatility surface smile skew explained'), g: ['#22d3ee', '#a78bfa'], b: 'Search' },
    { c: 'Python', t: 'Python for Finance tutorials', by: 'YouTube search', u: yt('python for finance quantitative tutorial'), g: ['#2dd4bf', '#facc15'], b: 'Search' },
    { c: 'Python', t: 'Backtesting a strategy in Python', by: 'YouTube search', u: yt('python backtesting trading strategy tutorial vectorbt backtrader'), g: ['#60a5fa', '#34d399'], b: 'Search' },
    { c: 'Python', t: 'pandas time series crash course', by: 'YouTube search', u: yt('pandas time series financial data tutorial'), g: ['#818cf8', '#2dd4bf'], b: 'Search' },
    { c: 'Strategies', t: 'Pairs trading & cointegration', by: 'YouTube search', u: yt('pairs trading cointegration statistical arbitrage python'), g: ['#f2a1b3', '#a5b4fc'], b: 'Search' },
    { c: 'Strategies', t: 'Market making & order books', by: 'YouTube search', u: yt('market making order book microstructure explained'), g: ['#fbbf24', '#f87171'], b: 'Search' },
    { c: 'Strategies', t: 'Portfolio optimization & Markowitz', by: 'YouTube search', u: yt('markowitz portfolio optimization efficient frontier python'), g: ['#34d399', '#38bdf8'], b: 'Search' },
    { c: 'Interviews', t: 'Quant interview probability puzzles', by: 'YouTube search', u: yt('quant interview probability brainteasers'), g: ['#c084fc', '#f472b6'], b: 'Search' },
    { c: 'Interviews', t: 'Jane Street talks & puzzles', by: 'Jane Street', u: 'https://www.janestreet.com/puzzles/', g: ['#22d3ee', '#6366f1'], b: 'Puzzles' }
    ,{ c: 'Courses', t: 'Machine Learning for Trading', by: 'Georgia Tech · YouTube search', u: yt('machine learning for trading Georgia Tech course'), g: ['#38bdf8', '#34d399'], b: 'Search' }
    ,{ c: 'Math', t: 'Visualising the Fourier transform', by: '3Blue1Brown', u: yt('3Blue1Brown Fourier transform visualisation'), g: ['#fbbf24', '#fb7185'], b: 'Search' }
    ,{ c: 'Derivatives', t: 'Understanding yield curves', by: 'YouTube search', u: yt('yield curve fixed income explained quantitative finance'), g: ['#60a5fa', '#a78bfa'], b: 'Search' }
    ,{ c: 'Python', t: 'Quantitative finance with Python', by: 'YouTube search', u: yt('quantitative finance Python project tutorial'), g: ['#2dd4bf', '#f59e0b'], b: 'Search' }
    ,{ c: 'Strategies', t: 'How to avoid backtest overfitting', by: 'YouTube search', u: yt('backtest overfitting quantitative trading explained'), g: ['#f472b6', '#818cf8'], b: 'Search' }
    ,{ c: 'Interviews', t: 'Quant interview statistics questions', by: 'YouTube search', u: yt('quant interview statistics questions explained'), g: ['#c084fc', '#22d3ee'], b: 'Search' }
  ];

  const RESOURCES = [
    ['Books', [
      ['Options, Futures, and Other Derivatives', 'John Hull — the standard derivatives text', 'https://www.pearson.com/en-us/subject-catalog/p/options-futures-and-other-derivatives/P200000005942'],
      ['Stochastic Calculus for Finance I & II', 'Steven Shreve — rigorous and readable', 'https://link.springer.com/book/10.1007/978-0-387-22527-2'],
      ['A Practical Guide to Quantitative Finance Interviews', 'Xinfeng Zhou — interview prep classic', 'https://www.amazon.com/s?k=practical+guide+to+quantitative+finance+interviews'],
      ['Heard on the Street', 'Timothy Crack — brainteasers & finance questions', 'https://www.amazon.com/s?k=heard+on+the+street+crack'],
      ['Advances in Financial Machine Learning', 'Marcos López de Prado — ML done right for finance', 'https://www.amazon.com/s?k=advances+in+financial+machine+learning'],
      ['The Elements of Statistical Learning', 'Hastie, Tibshirani, Friedman — free PDF', 'https://hastie.su.domains/ElemStatLearn/'],
      ['Quantitative Trading', 'Ernest Chan — building a trading business', 'https://www.amazon.com/s?k=quantitative+trading+ernest+chan']
    ]],
    ['Learning platforms', [
      ['QuantStart', 'Articles on strategies, backtesting, C++/Python', 'https://www.quantstart.com/'],
      ['MIT OpenCourseWare', 'Free university-level math & finance courses', 'https://ocw.mit.edu/'],
      ['Coursera — Financial Engineering', 'Courses from top universities', 'https://www.coursera.org/search?query=financial%20engineering'],
      ['Khan Academy', 'Calculus, linear algebra, probability, finance', 'https://www.khanacademy.org/'],
      ['Wilmott', 'Quant finance community & magazine', 'https://wilmott.com/'],
      ['QuantNet', 'MFE rankings, forums, career advice', 'https://quantnet.com/']
    ]],
    ['Research & papers', [
      ['arXiv q-fin', 'Preprints in quantitative finance', 'https://arxiv.org/archive/q-fin'],
      ['SSRN', 'Finance & economics working papers', 'https://www.ssrn.com/'],
      ['Journal of Financial Economics', 'Leading academic finance research', 'https://www.sciencedirect.com/journal/journal-of-financial-economics'],
      ['Kenneth French Data Library', 'Factor returns & datasets', 'https://mba.tuck.dartmouth.edu/pages/faculty/ken.french/data_library.html']
    ]],
    ['Libraries & code', [
      ['QuantLib', 'Open-source library for pricing & risk', 'https://www.quantlib.org/'],
      ['vectorbt', 'Fast vectorised backtesting in Python', 'https://github.com/polakowo/vectorbt'],
      ['Backtrader', 'Event-driven backtesting framework', 'https://www.backtrader.com/'],
      ['PyPortfolioOpt', 'Portfolio optimisation toolkit', 'https://github.com/robertmartin8/PyPortfolioOpt'],
      ['statsmodels', 'Time series & econometrics', 'https://www.statsmodels.org/'],
      ['yfinance', 'Fetch market data for research', 'https://github.com/ranaroussi/yfinance']
    ]],
    ['Practice & careers', [
      ['Jane Street Puzzles', 'Monthly puzzles from a top trading firm', 'https://www.janestreet.com/puzzles/'],
      ['Kaggle', 'Datasets, notebooks, competitions', 'https://www.kaggle.com/'],
      ['LeetCode', 'Algorithms practice for quant dev roles', 'https://leetcode.com/'],
      ['Optiver / IMC / Citadel careers', 'Look at what top firms ask for', 'https://optiver.com/working-at-optiver/career-opportunities/']
    ]]
  ];

  /* ============ ROUTER ============ */
  const tabs = $$('#tabs a'), views = $$('.view'), ink = $('#ink');
  function moveInk(a) {
    if (!a || innerWidth <= 760) return;
    ink.style.left = a.offsetLeft + 'px'; ink.style.width = a.offsetWidth + 'px';
  }
  function show(id) {
    if (!document.getElementById(id)) id = 'home';
    views.forEach(v => v.classList.toggle('active', v.id === id));
    tabs.forEach(a => { const on = a.dataset.tab === id; a.classList.toggle('active', on); on && moveInk(a); });
    $('#tabs').classList.remove('open');
    scrollTo({ top: 0, behavior: 'smooth' });
    if (id === 'concepts') loadConcepts();
    if (id === 'tools') { runMC(); runBS(); }
    if (id === 'home') animateCounts();
    if (id === 'progress') renderProgress();
  }
  addEventListener('hashchange', () => show(location.hash.slice(1)));
  addEventListener('resize', () => moveInk($('#tabs a.active')));
  $('#menuBtn').onclick = () => $('#tabs').classList.toggle('open');
  document.fonts?.ready.then(() => moveInk($('#tabs a.active')));

  /* ============ HOME ============ */
  function animateCounts() {
    $$('[data-count]').forEach(el => {
      const end = +el.dataset.count; let n = 0;
      const step = () => { n += Math.max(1, Math.ceil(end / 24)); if (n >= end) n = end; el.textContent = n + (end > 20 ? '+' : ''); n < end && requestAnimationFrame(step); };
      step();
    });
  }
  $$('.card.glow').forEach(c => c.addEventListener('pointermove', e => {
    const r = c.getBoundingClientRect();
    c.style.setProperty('--mx', (e.clientX - r.left) + 'px'); c.style.setProperty('--my', (e.clientY - r.top) + 'px');
  }));

  /* ============ ROADMAP ============ */
  const prog = store.get('qv-progress', {});
  function renderRoadmap() {
    const root = $('#timeline');
    root.innerHTML = ROADMAP.map((p, i) => `
      <article class="card phase ${i === 0 ? 'open' : ''}" data-i="${i}" data-n="${i + 1}">
        <header><div><h3>${esc(p.t)}</h3><span class="meta" data-meta></span></div><span class="muted">▾</span></header>
        <div class="bar"><i></i></div>
        <div class="body"><div>
          <p class="muted desc">${esc(p.d)}</p>
          <ul class="topics">${p.topics.map((t, j) => `<li><label><input type="checkbox" data-k="${i}-${j}" ${prog[`${i}-${j}`] ? 'checked' : ''}><span>${esc(t)}</span></label></li>`).join('')}</ul>
          <div class="tags">${p.links.map(l => `<span class="tag"><a href="${l[1]}" target="_blank" rel="noopener">${esc(l[0])} ↗</a></span>`).join('')}</div>
        </div></div>
      </article>`).join('');
    root.addEventListener('click', e => {
      const h = e.target.closest('header'); if (h) h.parentElement.classList.toggle('open');
    });
    root.addEventListener('change', e => {
      if (e.target.matches('input[type=checkbox]')) { prog[e.target.dataset.k] = e.target.checked; store.set('qv-progress', prog); updateProgress(); }
    });
    updateProgress();
  }
  function updateProgress() {
    let done = 0, total = 0;
    $$('.phase').forEach(ph => {
      const boxes = $$('input', ph), d = boxes.filter(b => b.checked).length;
      done += d; total += boxes.length;
      $('i', ph).style.width = (d / boxes.length * 100) + '%';
      $('[data-meta]', ph).textContent = `${d}/${boxes.length} topics`;
      ph.classList.toggle('done', d === boxes.length);
    });
    const pct = Math.round(done / total * 100);
    $('#ring').style.setProperty('--p', pct); $('#ringText').textContent = pct + '%';
    renderProgress();
  }

  function renderProgress() {
    const boxes = $$('input[type=checkbox][data-k]');
    const done = boxes.filter(b => b.checked).length;
    const total = boxes.length || ROADMAP.reduce((sum, p) => sum + p.topics.length, 0);
    const pct = total ? Math.round(done / total * 100) : 0;
    const remaining = boxes.find(b => !b.checked);
    const next = remaining ? remaining.nextElementSibling.textContent : 'You completed the roadmap';
    const phaseCount = $$('.phase.done').length;
    const stats = [
      ['Overall completion', `${pct}%`],
      ['Topics completed', `${done}/${total}`],
      ['Phases finished', `${phaseCount}/${ROADMAP.length}`]
    ];
    $('#progressRing').style.setProperty('--p', pct);
    $('#progressRingText').textContent = pct + '%';
    $('#progressStats').innerHTML = stats.map(([label, value]) => `<div class="card kpi progress-stat"><span>${label}</span><b>${value}</b></div>`).join('');
    $('#progressSummary').textContent = done ? `${total - done} topics remain. Small, consistent sessions beat heroic cramming.` : 'Tick topics in the roadmap as you learn. Your checklist stays on this device.';
    $('#progressHeadline').textContent = pct ? `${pct}% of the way to quant-ready.` : 'Your quant journey starts here.';
    $('#nextTopic').textContent = next;
    $('#nextTopicCopy').textContent = remaining ? 'Pick one focused topic, then mark it complete when you can explain it without notes.' : 'Nice work. Revisit a difficult phase or build a small project from the resources.';
  }

  /* ============ CONCEPTS (Wikipedia REST API) ============ */
  let conceptsLoaded = false;
  async function loadConcepts() {
    if (conceptsLoaded) return; conceptsLoaded = true;
    const grid = $('#conceptGrid');
    grid.innerHTML = CONCEPTS.map(name => `
      <article class="card concept" data-name="${esc(name.toLowerCase())}">
        <div class="thumb skeleton"></div>
        <div class="txt"><h3>${esc(name)}</h3><p class="muted">Loading…</p></div>
      </article>`).join('');
    await Promise.all(CONCEPTS.map(async (name, i) => {
      const card = grid.children[i];
      const page = 'https://en.wikipedia.org/wiki/' + encodeURIComponent(name.replace(/ /g, '_'));
      try {
        const r = await fetch('https://en.wikipedia.org/api/rest_v1/page/summary/' + encodeURIComponent(name.replace(/ /g, '_')));
        if (!r.ok) throw 0;
        const d = await r.json();
        const thumb = $('.thumb', card);
        thumb.classList.remove('skeleton');
        const src = d.thumbnail && d.thumbnail.source;
        if (src) {
          const img = new Image();
          img.alt = d.title;
          img.loading = 'lazy';
          img.referrerPolicy = 'no-referrer';
          img.onload = () => img.classList.add('loaded');
          img.onerror = () => { thumb.classList.add('fallback'); thumb.innerHTML = conceptIcon; };
          img.src = src;
          thumb.append(img);
        } else {
          thumb.classList.add('fallback'); thumb.innerHTML = conceptIcon;
        }
        $('.txt', card).innerHTML = `<h3>${esc(d.title)}</h3><p>${esc(d.extract || '')}</p><a class="more" href="${esc(d.content_urls?.desktop?.page || page)}" target="_blank" rel="noopener">Read on Wikipedia ↗</a>`;
      } catch {
        const thumb = $('.thumb', card);
        thumb.classList.remove('skeleton'); thumb.classList.add('fallback'); thumb.innerHTML = conceptIcon;
        $('.txt', card).innerHTML = `<h3>${esc(name)}</h3><p>Couldn’t load the summary right now (offline or blocked).</p><a class="more" href="${page}" target="_blank" rel="noopener">Open on Wikipedia ↗</a>`;
      }
    }));
  }
  $('#conceptSearch').addEventListener('input', e => {
    const q = e.target.value.trim().toLowerCase();
    $$('#conceptGrid .concept').forEach(c => c.style.display = c.textContent.toLowerCase().includes(q) ? '' : 'none');
  });

  /* ============ VIDEOS ============ */
  function renderVideos(cat = 'All') {
    const cats = ['All', ...new Set(VIDEOS.map(v => v.c))];
    $('#videoChips').innerHTML = cats.map(c => `<button class="chip ${c === cat ? 'on' : ''}" data-c="${c}">${c}</button>`).join('');
    $('#videoGrid').innerHTML = VIDEOS.filter(v => cat === 'All' || v.c === cat).map((v, i) => `
      <a class="card video link" href="${v.u}" target="_blank" rel="noopener">
        <div class="cover" style="background:linear-gradient(180deg,rgba(8,13,20,.08),rgba(8,13,20,.78)),linear-gradient(135deg,${v.g[0]}55,${v.g[1]}55),var(--surface-2)">
          <img src="${VIDEO_IMAGES[i % VIDEO_IMAGES.length]}" alt="" loading="lazy" referrerpolicy="no-referrer">
          <span class="badge">${esc(v.b)}</span>
          <span class="play"><svg width="20" height="20" viewBox="0 0 24 24" fill="#fff"><path d="M6 4l14 8-14 8z"/></svg></span>
        </div>
        <div class="txt"><div class="by">${esc(v.by)}</div><h3>${esc(v.t)}</h3><p>${esc(v.c)}</p></div>
      </a>`).join('');
  }
  $('#videoChips').addEventListener('click', e => { const b = e.target.closest('.chip'); b && renderVideos(b.dataset.c); });

  /* ============ RESOURCES ============ */
  function renderResources(q = '') {
    q = q.toLowerCase(); let any = false;
    const html = RESOURCES.map(([group, items]) => {
      const list = items.filter(i => (i.join(' ')).toLowerCase().includes(q));
      if (!list.length) return ''; any = true;
      return `<div class="res-group"><h3>${esc(group)}</h3><div class="grid cols-3">${list.map(([t, d, u]) => `
        <a class="card link res" href="${u}" target="_blank" rel="noopener">
          <div class="top"><h3>${esc(t)}</h3><span class="arrow">↗</span></div>
          <p>${esc(d)}</p><span class="host">${esc(hostOf(u))}</span>
        </a>`).join('')}</div></div>`;
    }).join('');
    $('#resGroups').innerHTML = any ? html : '<div class="empty">No resources match your search.</div>';
  }
  $('#resSearch').addEventListener('input', e => renderResources(e.target.value));

  /* ============ HERO BACKGROUND (random-walk price paths) ============ */
  (function bg() {
    const cv = $('#bg'), ctx = cv.getContext('2d');
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let W, H, paths = [], dpr = Math.min(devicePixelRatio || 1, 2);
    const colors = ['94,234,212', '165,180,252', '242,197,114'];
    function resize() {
      W = cv.width = innerWidth * dpr; H = cv.height = innerHeight * dpr;
      paths = Array.from({ length: 7 }, (_, i) => ({ y: H * (.25 + Math.random() * .5), pts: [], c: colors[i % 3], sp: .6 + Math.random() * .8 }));
      paths.forEach(p => { let y = p.y; for (let x = 0; x <= W; x += 8 * dpr) { y += (Math.random() - .5) * 16 * dpr; p.pts.push(y); } });
    }
    function draw(t) {
      ctx.clearRect(0, 0, W, H);
      paths.forEach(p => {
        ctx.beginPath();
        p.pts.forEach((y, i) => { const x = i * 8 * dpr; const yy = y + Math.sin(t / 2500 * p.sp + i / 18) * 10 * dpr; i ? ctx.lineTo(x, yy) : ctx.moveTo(x, yy); });
        ctx.strokeStyle = `rgba(${p.c},.35)`; ctx.lineWidth = 1.2 * dpr; ctx.stroke();
      });
      !reduce && requestAnimationFrame(draw);
    }
    resize(); requestAnimationFrame(draw);
    let to; addEventListener('resize', () => { clearTimeout(to); to = setTimeout(resize, 200); });
  })();

  /* ============ MONTE CARLO ============ */
  function gauss() { let u = 0, v = 0; while (!u) u = Math.random(); while (!v) v = Math.random(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); }
  function fit(cv) { const r = cv.getBoundingClientRect(), d = Math.min(devicePixelRatio || 1, 2); cv.width = r.width * d; cv.height = (+cv.getAttribute('height')) * d; const c = cv.getContext('2d'); c.setTransform(d, 0, 0, d, 0, 0); return [c, r.width, +cv.getAttribute('height')]; }
  function runMC() {
    const g = n => +$(`#mcForm [name=${n}]`).value;
    const S0 = g('s0'), mu = g('mu') / 100, sg = g('sigma') / 100, T = Math.max(.1, g('T')), N = Math.min(400, Math.max(10, g('n'))), steps = 120, dt = T / steps;
    const paths = [], finals = [];
    for (let i = 0; i < N; i++) {
      let s = S0; const p = [s];
      for (let k = 0; k < steps; k++) { s *= Math.exp((mu - .5 * sg * sg) * dt + sg * Math.sqrt(dt) * gauss()); p.push(s); }
      paths.push(p); finals.push(s);
    }
    const [c, w, h] = fit($('#mcCanvas')), pad = 34;
    const all = paths.flat(), lo = Math.min(...all), hi = Math.max(...all);
    const X = i => pad + (w - pad - 10) * i / steps, Y = v => h - pad / 1.4 - (h - pad * 1.4) * (v - lo) / (hi - lo || 1);
    c.clearRect(0, 0, w, h);
    c.strokeStyle = '#1d2531'; c.fillStyle = '#6f7a8c'; c.font = '10px JetBrains Mono'; c.lineWidth = 1;
    for (let i = 0; i <= 4; i++) { const v = lo + (hi - lo) * i / 4, y = Y(v); c.beginPath(); c.moveTo(pad, y); c.lineTo(w - 10, y); c.stroke(); c.fillText(v.toFixed(0), 4, y + 3); }
    paths.forEach((p, i) => {
      c.beginPath(); p.forEach((v, k) => k ? c.lineTo(X(k), Y(v)) : c.moveTo(X(k), Y(v)));
      c.strokeStyle = p[steps] >= S0 ? 'rgba(94,234,212,.22)' : 'rgba(242,161,179,.2)'; c.lineWidth = 1; c.stroke();
    });
    const mean = Array.from({ length: steps + 1 }, (_, k) => paths.reduce((a, p) => a + p[k], 0) / N);
    c.beginPath(); mean.forEach((v, k) => k ? c.lineTo(X(k), Y(v)) : c.moveTo(X(k), Y(v)));
    c.strokeStyle = '#f2c572'; c.lineWidth = 2; c.stroke();
    finals.sort((a, b) => a - b);
    const q = p => finals[Math.floor(p * (N - 1))], m = finals.reduce((a, b) => a + b, 0) / N;
    const up = finals.filter(v => v > S0).length / N;
    $('#mcStats').innerHTML = [['Mean S(T)', m.toFixed(2)], ['5th pct', q(.05).toFixed(2)], ['95th pct', q(.95).toFixed(2)], ['P(S_T > S₀)', (up * 100).toFixed(0) + '%']]
      .map(([a, b]) => `<div class="kpi"><span>${a}</span><b>${b}</b></div>`).join('');
  }
  $('#mcRun').onclick = runMC;

  /* ============ BLACK–SCHOLES ============ */
  const N = x => { // Abramowitz–Stegun CDF
    const t = 1 / (1 + .2316419 * Math.abs(x)), d = .3989423 * Math.exp(-x * x / 2);
    const p = d * t * (.3193815 + t * (-.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
    return x > 0 ? 1 - p : p;
  };
  const n = x => Math.exp(-x * x / 2) / Math.sqrt(2 * Math.PI);
  function runBS() {
    const g = k => +$(`#bsForm [name=${k}]`).value;
    const S = g('S'), K = g('K'), T = Math.max(1e-4, g('T')), r = g('r') / 100, v = Math.max(1e-4, g('v') / 100);
    const d1 = (Math.log(S / K) + (r + v * v / 2) * T) / (v * Math.sqrt(T)), d2 = d1 - v * Math.sqrt(T);
    const call = S * N(d1) - K * Math.exp(-r * T) * N(d2), put = K * Math.exp(-r * T) * N(-d2) - S * N(-d1);
    const out = [
      ['Call', call.toFixed(3), 'pos'], ['Put', put.toFixed(3), 'neg'],
      ['Δ call', N(d1).toFixed(3)], ['Γ', (n(d1) / (S * v * Math.sqrt(T))).toFixed(4)],
      ['Vega /1%', (S * n(d1) * Math.sqrt(T) / 100).toFixed(3)],
      ['Θ call /day', ((-S * n(d1) * v / (2 * Math.sqrt(T)) - r * K * Math.exp(-r * T) * N(d2)) / 365).toFixed(3)]
    ];
    $('#bsOut').innerHTML = out.map(([a, b, cl]) => `<div class="kpi"><span>${a}</span><b class="${cl || ''}">${b}</b></div>`).join('');
    // payoff chart: price now vs expiry
    const [c, w, h] = fit($('#payCanvas')), lo = S * .6, hi = S * 1.4, pad = 28;
    const bs = s => { const a = (Math.log(s / K) + (r + v * v / 2) * T) / (v * Math.sqrt(T)); return s * N(a) - K * Math.exp(-r * T) * N(a - v * Math.sqrt(T)); };
    const maxY = Math.max(hi - K, bs(hi)) * 1.05 || 1;
    const X = s => pad + (w - pad - 8) * (s - lo) / (hi - lo), Y = y => h - 20 - (h - 34) * y / maxY;
    c.clearRect(0, 0, w, h);
    c.strokeStyle = '#1d2531'; c.beginPath(); c.moveTo(pad, Y(0)); c.lineTo(w - 8, Y(0)); c.stroke();
    c.fillStyle = '#6f7a8c'; c.font = '10px JetBrains Mono'; c.fillText('Call value vs spot', pad, 12);
    const line = (fn, col, wd) => { c.beginPath(); for (let i = 0; i <= 80; i++) { const s = lo + (hi - lo) * i / 80; i ? c.lineTo(X(s), Y(fn(s))) : c.moveTo(X(s), Y(fn(s))); } c.strokeStyle = col; c.lineWidth = wd; c.stroke(); };
    line(s => Math.max(s - K, 0), '#a5b4fc', 1.5); line(bs, '#5eead4', 2.2);
    c.fillStyle = '#5eead4'; c.beginPath(); c.arc(X(S), Y(call), 4, 0, 7); c.fill();
    c.fillStyle = '#6f7a8c'; c.fillText('— BS value', w - 150, 12); c.fillStyle = '#a5b4fc'; c.fillText('— payoff at expiry', w - 100 > 0 ? w - 96 : 0, 24);
  }
  $('#bsForm').addEventListener('input', runBS);

  function runPositionSize() {
    const value = k => +$(`#positionForm [name=${k}]`).value || 0;
    const account = value('account'), risk = value('risk') / 100, entry = value('entry'), stop = value('stop');
    const riskBudget = account * risk, perUnit = Math.abs(entry - stop), units = perUnit ? riskBudget / perUnit : 0;
    $('#positionOut').innerHTML = [['Risk budget', riskBudget.toFixed(2)], ['Risk per unit', perUnit.toFixed(2)], ['Position size', `${units.toFixed(2)} units`]]
      .map(([a, b]) => `<div class="kpi"><span>${a}</span><b>${b}</b></div>`).join('');
  }
  function runGrowth() {
    const value = k => +$(`#growthForm [name=${k}]`).value || 0;
    const start = value('start'), monthly = value('monthly'), years = Math.max(1, value('years'));
    const monthlyRate = Math.pow(1 + value('return') / 100, 1 / 12) - 1;
    let balance = start;
    for (let month = 0; month < years * 12; month++) balance = balance * (1 + monthlyRate) + monthly;
    const contributed = start + monthly * years * 12;
    $('#growthOut').innerHTML = [['Projected value', balance.toFixed(2)], ['Contributed', contributed.toFixed(2)], ['Growth', (balance - contributed).toFixed(2)]]
      .map(([a, b]) => `<div class="kpi"><span>${a}</span><b>${b}</b></div>`).join('');
  }
  $('#positionForm').addEventListener('input', runPositionSize);
  $('#growthForm').addEventListener('input', runGrowth);
  let rz; addEventListener('resize', () => { clearTimeout(rz); rz = setTimeout(() => $('#tools').classList.contains('active') && (runMC(), runBS()), 150); });

  /* ============ INIT ============ */
  $('#yr').textContent = new Date().getFullYear();
  renderRoadmap(); renderVideos(); renderResources(); runPositionSize(); runGrowth(); renderProgress();
  show(location.hash.slice(1) || 'home');
})();