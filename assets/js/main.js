/* DHYAI V5 — main.js */
(function(){

  // ── Mobile nav hamburger ─────────────────────────────────────────────────
  var burg = document.getElementById('burg');
  var nl   = document.getElementById('nl');
  if(burg && nl){
    burg.addEventListener('click', function(){
      var open = nl.classList.toggle('open');
      burg.classList.toggle('open', open);
      burg.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nl.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click', function(){
        nl.classList.remove('open');
        burg.classList.remove('open');
        burg.setAttribute('aria-expanded', 'false');
      });
    });
    document.addEventListener('click', function(e){
      if(nl.classList.contains('open') && !e.target.closest('#nav')){
        nl.classList.remove('open');
        burg.classList.remove('open');
        burg.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // ── Active nav link ──────────────────────────────────────────────────────
  var path = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  if(nl) nl.querySelectorAll('a').forEach(function(a){
    var href = (a.getAttribute('href') || '').toLowerCase().split('/').pop();
    if(href === path) a.setAttribute('aria-current', 'page');
  });

  // ── Cookie consent banner ────────────────────────────────────────────────
  if(!localStorage.getItem('dhyai_cookie_consent')){
    var banner = document.createElement('div');
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
    requestAnimationFrame(function(){ banner.classList.add('is-visible'); });
    function dismiss(val){
      localStorage.setItem('dhyai_cookie_consent', val);
      banner.classList.remove('is-visible');
      banner.addEventListener('transitionend', function(){ banner.remove(); }, {once:true});
    }
    banner.querySelector('.btn-accept').addEventListener('click', function(){ dismiss('all'); });
    banner.querySelector('.btn-essential').addEventListener('click', function(){ dismiss('essential'); });
  }

  // ── Scroll reveal (.fd → .lit) ───────────────────────────────────────────
  var fdEls = document.querySelectorAll('.fd');
  if('IntersectionObserver' in window && fdEls.length){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting){ e.target.classList.add('lit'); io.unobserve(e.target); }
      });
    }, {threshold: 0.1});
    fdEls.forEach(function(el){ io.observe(el); });
  } else {
    fdEls.forEach(function(el){ el.classList.add('lit'); });
  }

})();
