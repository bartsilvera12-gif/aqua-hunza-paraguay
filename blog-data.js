/* ============================================================
   Aqua Hunza — datos del blog (data-driven)
   - BLOG_SEED: posts que vienen "de fábrica" (commiteados en el repo).
   - Los cambios que hacés en el panel de admin se guardan en el
     navegador (localStorage). AquaBlog.getPosts() devuelve la lista
     efectiva (localStorage si existe, si no el seed).
   - Para publicar para TODOS: en el panel usás "Exportar" y se
     reemplaza este archivo (commit al repo).
   ============================================================ */
window.BLOG_SEED = [
  { id: "como-funciona", title: "¿Cómo funciona?", cat: "Tecnología", img: "comof.jpg", url: "como-funciona.html", builtin: true,
    excerpt: "Conocé cómo funcionan los procesos de purificación de última generación para toda la casa." },
  { id: "soluciones-rurales", title: "Soluciones rurales", cat: "Sector rural", img: "hero33.webp", url: "soluciones-rurales.html", builtin: true,
    excerpt: "Filtros de agua para tajamares del Chaco Paraguayo." },
  { id: "piel-y-cabello", title: "Piel y cabello", cat: "Cuidado personal", img: "piel-cabello2.jpg", url: "piel-y-cabello.html", builtin: true,
    excerpt: "Protegé tu piel y cabello con purificadores de agua Aqua Hunza." },
  { id: "ganaderia-rentable", title: "Ganadería rentable", cat: "Ganadería", img: "campo-rural33.jpg", url: "ganaderia-rentable.html", builtin: true,
    excerpt: "¿Sabías que la calidad del agua puede ser la clave para maximizar el crecimiento y la rentabilidad de tu ganado?" },
  { id: "notas-tecnicas", title: "Notas técnicas", cat: "Notas técnicas", img: "rural-system2.jpg", url: "notas-tecnicas.html", builtin: true,
    excerpt: "Notas de Pablo Ott sobre los efectos del consumo de agua y su impacto en la performance animal." },
  { id: "clean-water", title: "Why Clean Water Is Essential for Cattle & Buffalo Health", cat: "Ganadería", img: "rural-hero.jpg", url: "clean-water.html", builtin: true,
    excerpt: "El agua limpia es esencial para la salud, el crecimiento y la producción de leche del ganado." },
  { id: "start-thinking", title: "Start Thinking: Water for Livestock", cat: "Ganadería", img: "blog-cattle-1.jpg", url: "start-thinking.html", builtin: true,
    excerpt: "El consumo de materia seca del ganado está directamente relacionado con el agua que bebe." },
  { id: "calidad-agua", title: "Evaluando la calidad del agua para el ganado", cat: "Ganadería", img: "blog-cattle-2.jpg", url: "calidad-agua.html", builtin: true,
    excerpt: "El agua es el nutriente simple más importante para el ganado." },
  { id: "water-intake", title: "Water Intake Errors That Reduce Weight Gain", cat: "Ganadería", img: "blog-cattle-3.jpg", url: "water-intake.html", builtin: true,
    excerpt: "Errores en el consumo de agua que reducen la ganancia de peso del ganado." },
  { id: "water-more", title: "Why Is Water More Important Than Feed For Fattening Cattle?", cat: "Ganadería", img: "blog-cattle-4.jpg", url: "water-more.html", builtin: true,
    excerpt: "Por qué el agua es más importante que el alimento a la hora de engordar ganado." }
];

window.AquaBlog = (function () {
  var KEY = "ah_blog_posts_v1";
  function clone(o) { return JSON.parse(JSON.stringify(o)); }
  function load() {
    try { var raw = localStorage.getItem(KEY); if (raw) return JSON.parse(raw); } catch (e) {}
    return null;
  }
  function save(list) {
    try { localStorage.setItem(KEY, JSON.stringify(list)); return true; } catch (e) { return false; }
  }
  // lista efectiva: localStorage si el admin ya trabajó, si no el seed
  function getPosts() {
    var l = load();
    var list = (l && l.length !== undefined) ? l : clone(window.BLOG_SEED);
    return list.filter(function (p) { return p && p.published !== false; });
  }
  // lista completa (incluye no publicados) para el panel
  function getAll() {
    var l = load();
    return (l && l.length !== undefined) ? l : clone(window.BLOG_SEED);
  }
  function getPost(id) {
    var all = getAll();
    for (var i = 0; i < all.length; i++) if (all[i].id === id) return all[i];
    return null;
  }
  function slugify(s) {
    return (s || "").toString().toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60) || ("post-" + Date.now());
  }
  return { KEY: KEY, getPosts: getPosts, getAll: getAll, getPost: getPost, save: save, slugify: slugify, resetSeed: function () { try { localStorage.removeItem(KEY); } catch (e) {} } };
})();
