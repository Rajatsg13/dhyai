/* DHYAI — Iteration 2 (Placeholder Build)
   - Mobile nav toggle
   - Subtle fade-in via IntersectionObserver (opacity only)
   - Active nav highlighting
*/

(function(){
  const navToggle = document.querySelector('[data-nav-toggle]');
  const nav = document.querySelector('[data-nav]');
  if(navToggle && nav){
    navToggle.addEventListener('click', () => {
      const open = nav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
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