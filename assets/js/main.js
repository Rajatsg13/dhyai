/* DHYAI V3 — main.js */
(function(){

  // ── Entry animation (index.html only) ──────────────────────────────────────
  var entryEl = document.getElementById('entry');
  if(entryEl){
    document.body.style.overflow = 'hidden';
    var slides = entryEl.querySelectorAll('.es'),
        cur    = 0,
        FADE   = 900,
        done   = false;

    function finish(){
      if(done) return;
      done = true;
      document.body.style.overflow = '';
      entryEl.classList.add('done');
      setTimeout(function(){ entryEl.style.display = 'none'; }, 1200);
    }

    function nextSlide(){
      if(cur >= slides.length){ finish(); return; }
      slides[cur].classList.add('active');
      var hold = parseInt(slides[cur].getAttribute('data-hold'), 10);
      setTimeout(function(){
        slides[cur].classList.remove('active');
        cur++;
        setTimeout(nextSlide, FADE);
      }, hold);
    }
    setTimeout(nextSlide, 400);

    // Skip on click or tap
    entryEl.addEventListener('click', finish);
    var skipBtn = entryEl.querySelector('.entry-skip');
    if(skipBtn) skipBtn.addEventListener('click', function(e){ e.stopPropagation(); finish(); });
  }

  // ── Mobile nav toggle ──────────────────────────────────────────────────────
  var navToggle = document.querySelector('[data-nav-toggle]');
  var nav       = document.querySelector('[data-nav]');
  if(navToggle && nav){
    navToggle.addEventListener('click', function(){
      var open = nav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    document.addEventListener('click', function(e){
      if(nav.classList.contains('is-open') && !e.target.closest('.site-header')){
        nav.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
    nav.querySelectorAll('a').forEach(function(link){
      link.addEventListener('click', function(){
        nav.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ── Active nav highlighting ────────────────────────────────────────────────
  var path = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  document.querySelectorAll('a[data-nav-link]').forEach(function(a){
    if((a.getAttribute('href') || '').toLowerCase() === path)
      a.setAttribute('aria-current', 'page');
  });
  document.querySelectorAll('a[data-subnav-link]').forEach(function(a){
    if((a.getAttribute('href') || '').toLowerCase() === path)
      a.setAttribute('aria-current', 'page');
  });

  // ── Cookie consent banner ──────────────────────────────────────────────────
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
      banner.addEventListener('transitionend', function(){ banner.remove(); }, {once: true});
    }
    banner.querySelector('.btn-accept').addEventListener('click', function(){ dismiss('all'); });
    banner.querySelector('.btn-essential').addEventListener('click', function(){ dismiss('essential'); });
  }

  // ── Scroll reveal ──────────────────────────────────────────────────────────
  var revEls = document.querySelectorAll('.reveal');
  if('IntersectionObserver' in window){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, {threshold: 0.12});
    revEls.forEach(function(el){ io.observe(el); });
  } else {
    revEls.forEach(function(el){ el.classList.add('is-visible'); });
  }

})();
