/* Reproduce el video de fondo del banner CTA solo cuando está en pantalla
   (y lo pausa cuando no), garantizando autoplay silencioso y buen rendimiento. */
(function () {
  function inView(v) {
    var r = v.getBoundingClientRect();
    var h = window.innerHeight || document.documentElement.clientHeight;
    return r.bottom > 0 && r.top < h;
  }
  function play(v) {
    if (v.paused) { var p = v.play(); if (p && p.catch) p.catch(function () {}); }
  }
  function apply(v) {
    v.muted = true;
    if (inView(v)) play(v);
    else if (!v.paused) v.pause();
  }
  function all(fn) {
    var vs = document.querySelectorAll('.cta-video');
    for (var i = 0; i < vs.length; i++) fn(vs[i]);
  }
  function tick() { all(apply); }

  document.addEventListener('DOMContentLoaded', tick);
  window.addEventListener('load', tick);
  window.addEventListener('scroll', tick, { passive: true });
  window.addEventListener('resize', tick, { passive: true });

  try {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        var v = en.target; v.muted = true;
        if (en.isIntersecting) play(v);
        else if (!v.paused) v.pause();
      });
    }, { threshold: 0.1 });
    all(function (v) { io.observe(v); });
  } catch (e) { tick(); }
})();
