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
    excerpt: "Conocé cómo funciona los procesos de Purificación de última generación para toda la casa." },
  { id: "soluciones-rurales", title: "Soluciones Rurales", cat: "Sector rural", img: "hero33.webp", url: "soluciones-rurales.html", builtin: true,
    excerpt: "Filtros de agua para tajamares del Chaco Paraguayo." },
  { id: "piel-y-cabello", title: "Piel y Cabello", cat: "Cuidado personal", img: "piel-cabello2.jpg", url: "piel-y-cabello.html", builtin: true,
    excerpt: "Protegé tu piel y cabello con purificadores de agua Aqua Hunza." },
  { id: "ganaderia-rentable", title: "Ganaderia Rentable", cat: "Ganadería", img: "campo-rural33.jpg", url: "ganaderia-rentable.html", builtin: true,
    excerpt: "¿Sabías que la calidad del agua puede ser la clave para maximizar el crecimiento y la rentabilidad de tu ganado de engorde?" },
  { id: "notas-tecnicas", title: "Notas Técnicas", cat: "Notas técnicas", img: "NT-1-600x450.jpg", url: "notas-tecnicas.html", builtin: true,
    excerpt: "En esta sección encontrarás notas técnicas elaboradas por nuestro director Pablo Ott, vinculadas a los efectos del consumo de agua, y su impacto en la performance animal." },
  { id: "clean-water", title: "Why Clean Water Is Essential for Cattle & Buffalo Health", cat: "Ganadería", img: "Untitled-design-1-1.jpg", url: "clean-water.html", builtin: true,
    excerpt: "Water is life—not just for humans but for cattle and buffaloes too. Just like us, these animals need clean and fresh water every day to stay healthy, grow well, and produce better milk." },
  { id: "start-thinking", title: "Start Thinking: Water for Livestock", cat: "Ganadería", img: "cow-842543_1280-696x464.jpg", url: "start-thinking.html", builtin: true,
    excerpt: "Studies have consistently shown that livestock dry matter intake is related to water consumed." },
  { id: "calidad-agua", title: "Evaluando la Calidad del Agua para el Ganado", cat: "Ganadería", img: "blog-cattle-2.jpg", url: "calidad-agua.html", builtin: true,
    excerpt: "El agua es el nutriente simple más importante para el ganado." },
  { id: "water-intake", title: "Water Intake Errors That Reduce Weight Gain", cat: "Ganadería", img: "blog-cattle-3.jpg", url: "water-intake.html", builtin: true,
    excerpt: "Most cattle producers focus on feed rations, mineral supplementation, and forage quality when weight gain stalls." },
  { id: "water-more", title: "Why Is Water More Important Than Feed For Fattening Cattle?", cat: "Ganadería", img: "blog-cattle-4.jpg", url: "water-more.html", builtin: true,
    excerpt: "Most farmers obsess over feed, but here’s the truth: water is more important than feed when it comes to fattening cattle." }
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
