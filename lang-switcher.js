/* ============================================================
   Aqua Hunza — selector de idiomas (ES / EN / PT / DE)
   Traducción automática vía Google Translate, SIN la barra ni el
   gadget de Google (todo oculto) y SIN recargar la página.
   Un solo archivo, incluido en todas las páginas.
   ============================================================ */
(function () {
  var LANGS = [['es', 'ES'], ['en', 'EN'], ['pt', 'PT'], ['de', 'DE']];
  // banderitas SVG (se ven en todos los sistemas, a diferencia de los emoji en Windows)
  var FLAGS = {
    es: "<svg class='fl' viewBox='0 0 30 20'><rect width='30' height='20' fill='#c60b1e'/><rect y='5' width='30' height='10' fill='#ffc400'/></svg>",
    en: "<svg class='fl' viewBox='0 0 30 20'><rect width='30' height='20' fill='#012169'/><path d='M0,0L30,20M30,0L0,20' stroke='#fff' stroke-width='4'/><path d='M0,0L30,20M30,0L0,20' stroke='#C8102E' stroke-width='2'/><rect x='12' width='6' height='20' fill='#fff'/><rect y='7' width='30' height='6' fill='#fff'/><rect x='13.5' width='3' height='20' fill='#C8102E'/><rect y='8.5' width='30' height='3' fill='#C8102E'/></svg>",
    pt: "<svg class='fl' viewBox='0 0 30 20'><rect width='30' height='20' fill='#da291c'/><rect width='12' height='20' fill='#046a38'/><circle cx='12' cy='10' r='3.4' fill='#ffe000' stroke='#fff' stroke-width='.5'/></svg>",
    de: "<svg class='fl' viewBox='0 0 30 20'><rect width='30' height='20' fill='#000'/><rect y='6.67' width='30' height='6.67' fill='#dd0000'/><rect y='13.33' width='30' height='6.67' fill='#ffce00'/></svg>"
  };

  // --- estilos: ocultar TODO lo de Google + estilar mi barra ---
  function css() {
    if (document.getElementById('als-css')) return;
    var s = document.createElement('style');
    s.id = 'als-css';
    s.textContent =
      '#google_translate_element{position:fixed!important;left:-99999px!important;top:-9999px!important;width:1px!important;height:1px!important;overflow:hidden!important;opacity:0!important;pointer-events:none!important}' +
      '.goog-te-banner-frame,iframe.skiptranslate,.VIpgJd-ZVi9od-ORHb-OEVmcd,#goog-gt-tt,.goog-te-balloon-frame,.goog-tooltip{display:none!important;visibility:hidden!important;height:0!important}' +
      'body{top:0!important;position:static!important}' +
      '.goog-text-highlight{background:none!important;box-shadow:none!important}' +
      '#als-bar{position:fixed;left:16px;bottom:16px;z-index:2147483000;display:flex;gap:2px;' +
      'background:rgba(255,255,255,.96);backdrop-filter:blur(8px);border:1px solid #E4EEF3;border-radius:999px;' +
      'padding:4px;box-shadow:0 8px 24px -10px rgba(16,42,56,.45);font-family:Manrope,system-ui,sans-serif}' +
      '#als-bar button{border:0;background:transparent;color:#3C5464;font-size:12px;font-weight:700;' +
      'padding:6px 10px;border-radius:999px;cursor:pointer;line-height:1;letter-spacing:.03em;transition:all .15s;' +
      'display:inline-flex;align-items:center;gap:6px}' +
      '#als-bar .fl{width:19px;height:13px;border-radius:2px;flex:none;display:block;box-shadow:0 0 0 1px rgba(0,0,0,.12)}' +
      '#als-bar button:hover{color:#102A38;background:#EAF4F8}' +
      '#als-bar button.on{background:#279CBC;color:#fff}' +
      '@media(max-width:520px){#als-bar{left:10px;bottom:10px}#als-bar button{padding:6px 8px;font-size:11px;gap:5px}#als-bar .fl{width:17px;height:11px}}';
    (document.head || document.documentElement).appendChild(s);
  }

  // --- contenedor oculto del widget de Google ---
  function box() {
    var b = document.getElementById('google_translate_element');
    if (!b) {
      b = document.createElement('div');
      b.id = 'google_translate_element';
      b.className = 'notranslate';
      (document.body || document.documentElement).appendChild(b);
    }
    return b;
  }

  window.googleTranslateElementInit = function () {
    box();
    try {
      new google.translate.TranslateElement(
        { pageLanguage: 'es', includedLanguages: 'es,en,pt,de', autoDisplay: false },
        'google_translate_element'
      );
    } catch (e) { /* reintenta */ }
  };

  function loadGoogle() {
    if (window.__alsGoogle) return; window.__alsGoogle = 1;
    box();
    var sc = document.createElement('script');
    sc.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    (document.head || document.documentElement).appendChild(sc);
  }

  // --- idioma actual (cookie googtrans=/es/xx) ---
  function curr() { var m = document.cookie.match(/googtrans=\/[^/]*\/([^;]+)/); return (m && m[1]) ? m[1] : 'es'; }
  function mark() {
    var bar = document.getElementById('als-bar'); if (!bar) return;
    var c = curr();
    [].forEach.call(bar.children, function (b) { b.classList.toggle('on', b.getAttribute('data-l') === c); });
  }
  function clearCookie() {
    var e = '; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
    document.cookie = 'googtrans=' + e;
    document.cookie = 'googtrans=' + e + '; domain=' + location.hostname;
    document.cookie = 'googtrans=' + e + '; domain=.' + location.hostname;
  }
  function setCookie(lang) {
    document.cookie = 'googtrans=/es/' + lang + '; path=/';
    document.cookie = 'googtrans=/es/' + lang + '; path=/; domain=' + location.hostname;
    document.cookie = 'googtrans=/es/' + lang + '; path=/; domain=.' + location.hostname;
  }
  function translated() { return !!document.querySelector('font') || document.documentElement.classList.contains('translated-ltr') || document.documentElement.classList.contains('translated-rtl'); }

  // --- aplicar idioma SIEMPRE en la misma página (sin recargar) ---
  function apply(lang) {
    var combo = document.querySelector('.goog-te-combo');
    if (!combo) { loadGoogle(); setTimeout(function () { apply(lang); }, 350); return; }
    if (lang === 'es') { clearCookie(); combo.value = ''; }   // '' = restaurar original in-situ
    else { combo.value = lang; }
    combo.dispatchEvent(new Event('change'));
    setTimeout(mark, 120);
  }

  // --- barra de idiomas ---
  function bar() {
    if (document.getElementById('als-bar')) return;
    var bar = document.createElement('div');
    bar.id = 'als-bar'; bar.className = 'notranslate'; bar.setAttribute('translate', 'no');
    LANGS.forEach(function (l) {
      var b = document.createElement('button');
      b.type = 'button'; b.innerHTML = (FLAGS[l[0]] || '') + '<span>' + l[1] + '</span>'; b.setAttribute('data-l', l[0]);
      b.setAttribute('aria-label', 'Idioma ' + l[1]);
      b.addEventListener('click', function () { apply(l[0]); });
      bar.appendChild(b);
    });
    (document.body || document.documentElement).appendChild(bar);
    mark();
  }

  // --- mantener todo presente (el bundle reconstruye el DOM) ---
  function tick() {
    css(); bar(); mark();
    var b = document.querySelector('.goog-te-banner-frame, iframe.skiptranslate, .VIpgJd-ZVi9od-ORHb-OEVmcd');
    if (b) { b.style.display = 'none'; }
    if (document.body) { document.body.style.top = '0px'; document.body.style.position = 'static'; }
  }

  function start() { css(); bar(); loadGoogle(); mark(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();

  var n = 0, iv = setInterval(function () { tick(); if (++n > 60) clearInterval(iv); }, 500);
  (function watch() {
    if (!document.body || !window.MutationObserver) { setTimeout(watch, 300); return; }
    var t;
    new MutationObserver(function () { clearTimeout(t); t = setTimeout(tick, 60); }).observe(document.body, { childList: true });
  })();
})();
