(function () {
  window.__rvOK = true;
  var SEL = 'main h1,main h2,main h3,main h4,main h5,main p,main li,main blockquote,main figcaption,' +
            'main .eyebrow,main .tagline,main .btn,main .sub,main .lead,main .quote,main .colhead,main .num';
  function run() {
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var els = [].slice.call(document.querySelectorAll(SEL));
    if (!els.length) return;
    if (reduce || !('IntersectionObserver' in window)) {
      els.forEach(function (e) { e.classList.add('rv-in'); });
      return;
    }
    var seen = new Map();
    els.forEach(function (el) {
      var p = el.parentElement;
      var i = seen.get(p) || 0; seen.set(p, i + 1);
      el.style.transitionDelay = Math.min(i * 55, 330) + 'ms';
    });
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('rv-in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });
    els.forEach(function (el) { io.observe(el); });
    // Safety net: if the observer never fired (nothing revealed shortly after load),
    // reveal everything so text is never stuck hidden. If IO works, scroll-reveal is preserved.
    setTimeout(function () {
      var any = els.some(function (e) { return e.classList.contains('rv-in'); });
      if (!any) els.forEach(function (e) { e.classList.add('rv-in'); });
    }, 1500);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run); else run();
})();
