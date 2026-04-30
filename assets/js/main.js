/* DHYAI — Iteration 2 (Placeholder Build)
   - Mobile nav toggle
   - Subtle fade-in via IntersectionObserver (opacity only)
   - Active nav highlighting
*/

(function(){
  // Apply saved colour theme before anything renders
  var savedTheme = localStorage.getItem('dhyai_theme') || '';
  document.documentElement.setAttribute('data-theme', savedTheme);

  // Inject theme toggle swatches into header
  var themeToggle = document.createElement('div');
  themeToggle.className = 'theme-toggle';
  themeToggle.setAttribute('aria-label', 'Switch colour theme');
  [
    ['',       '#e2dccf', 'Warm'],
    ['white',  '#ffffff', 'White'],
    ['ivory',  '#f5f0e8', 'Ivory'],
    ['stone',  '#d2cec8', 'Stone'],
    ['blush',  '#ece0db', 'Blush'],
    ['sage',   '#d6dcd3', 'Sage'],
    ['slate',  '#d4d8dc', 'Slate'],
  ].forEach(function(opt) {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'theme-swatch' + (savedTheme === opt[0] ? ' is-active' : '');
    btn.style.background = opt[1];
    btn.setAttribute('aria-label', opt[2] + ' theme');
    btn.title = opt[2];
    btn.addEventListener('click', function() {
      savedTheme = opt[0];
      document.documentElement.setAttribute('data-theme', opt[0]);
      localStorage.setItem('dhyai_theme', opt[0]);
      themeToggle.querySelectorAll('.theme-swatch').forEach(function(s) { s.classList.remove('is-active'); });
      btn.classList.add('is-active');
    });
    themeToggle.appendChild(btn);
  });
  const navToggle = document.querySelector('[data-nav-toggle]');
  const nav = document.querySelector('[data-nav]');
  if (nav) nav.appendChild(themeToggle);
  else {
    var headerInner = document.querySelector('.header-inner');
    if (headerInner) headerInner.appendChild(themeToggle);
  }

  if(navToggle && nav){
    navToggle.addEventListener('click', () => {
      const open = nav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    document.addEventListener('click', (e) => {
      if (nav.classList.contains('is-open') && !e.target.closest('.site-header')) {
        nav.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });

    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Active nav link based on current pathname
  const path = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  document.querySelectorAll('a[data-nav-link]').forEach(a => {
    const href = (a.getAttribute('href') || '').toLowerCase();
    if(href === path){
      a.setAttribute('aria-current', 'page');
    }
  });
  document.querySelectorAll('a[data-subnav-link]').forEach(a => {
    const href = (a.getAttribute('href') || '').toLowerCase();
    if(href === path){
      a.setAttribute('aria-current', 'page');
    }
  });

  // Cookie consent banner
  if (!localStorage.getItem('dhyai_cookie_consent')) {
    const banner = document.createElement('div');
    banner.className = 'cookie-banner';
    banner.setAttribute('role', 'region');
    banner.setAttribute('aria-label', 'Cookie consent');
    banner.innerHTML =
      '<p>We use cookies to improve your experience. Essential cookies keep the site functional.</p>' +
      '<div class="cookie-actions">' +
        '<button class="btn-accept" type="button">Accept all</button>' +
        '<button class="btn-essential" type="button">Essential only</button>' +
      '</div>';
    document.body.appendChild(banner);
    requestAnimationFrame(() => banner.classList.add('is-visible'));

    function dismissBanner(value) {
      localStorage.setItem('dhyai_cookie_consent', value);
      banner.classList.remove('is-visible');
      banner.addEventListener('transitionend', () => banner.remove(), { once: true });
    }

    banner.querySelector('.btn-accept').addEventListener('click', () => dismissBanner('all'));
    banner.querySelector('.btn-essential').addEventListener('click', () => dismissBanner('essential'));
  }

  // Reveal on scroll (opacity only)
  const els = document.querySelectorAll('.reveal');
  if('IntersectionObserver' in window){
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if(entry.isIntersecting){
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    els.forEach(el => io.observe(el));
  } else {
    els.forEach(el => el.classList.add('is-visible'));
  }
})();