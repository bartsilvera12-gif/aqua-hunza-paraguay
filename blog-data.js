/* ============================================================
   Aqua Hunza — datos del blog (Supabase + respaldo local)
   - Si Supabase está configurado (window.sb), lee/escribe en la tabla
     aquahunza.posts.
   - Si NO está configurado o falla, usa BLOG_SEED (respaldo) para que el
     blog siga funcionando.
   - La API es ASÍNCRONA (devuelve Promesas).
   ============================================================ */
window.BLOG_SEED = [
  { id: "como-funciona", title: "¿Cómo funciona?", cat: "Tecnología", img: "comof.webp", url: "como-funciona.html", builtin: true, published: true, sort: 10,
    excerpt: "Conocé cómo funcionan los procesos de purificación de última generación para toda la casa." },
  { id: "soluciones-rurales", title: "Soluciones rurales", cat: "Sector rural", img: "hero33.webp", url: "soluciones-rurales.html", builtin: true, published: true, sort: 20,
    excerpt: "Filtros de agua para tajamares del Chaco Paraguayo." },
  { id: "piel-y-cabello", title: "Piel y cabello", cat: "Cuidado personal", img: "piel-cabello2.webp", url: "piel-y-cabello.html", builtin: true, published: true, sort: 30,
    excerpt: "Protegé tu piel y cabello con purificadores de agua Aqua Hunza." },
  { id: "ganaderia-rentable", title: "Ganadería rentable", cat: "Ganadería", img: "campo-rural33.jpg", url: "ganaderia-rentable.html", builtin: true, published: true, sort: 40,
    excerpt: "¿Sabías que la calidad del agua puede ser la clave para maximizar el crecimiento y la rentabilidad de tu ganado?" },
  { id: "notas-tecnicas", title: "Notas técnicas", cat: "Notas técnicas", img: "rural-system2.webp", url: "notas-tecnicas.html", builtin: true, published: true, sort: 50,
    excerpt: "Notas de Pablo Ott sobre los efectos del consumo de agua y su impacto en la performance animal." },
  { id: "clean-water", title: "Why Clean Water Is Essential for Cattle & Buffalo Health", cat: "Ganadería", img: "rural-hero.webp", url: "clean-water.html", builtin: true, published: true, sort: 60,
    excerpt: "El agua limpia es esencial para la salud, el crecimiento y la producción de leche del ganado." },
  { id: "start-thinking", title: "Start Thinking: Water for Livestock", cat: "Ganadería", img: "cow-842543_1280-696x464.webp", url: "start-thinking.html", builtin: true, published: true, sort: 70,
    excerpt: "El consumo de materia seca del ganado está directamente relacionado con el agua que bebe." },
  { id: "calidad-agua", title: "Evaluando la calidad del agua para el ganado", cat: "Ganadería", img: "blog-cattle-2.jpg", url: "calidad-agua.html", builtin: true, published: true, sort: 80,
    excerpt: "El agua es el nutriente simple más importante para el ganado." },
  { id: "water-intake", title: "Water Intake Errors That Reduce Weight Gain", cat: "Ganadería", img: "blog-cattle-3.jpg", url: "water-intake.html", builtin: true, published: true, sort: 90,
    excerpt: "Errores en el consumo de agua que reducen la ganancia de peso del ganado." },
  { id: "water-more", title: "Why Is Water More Important Than Feed For Fattening Cattle?", cat: "Ganadería", img: "blog-cattle-4.jpg", url: "water-more.html", builtin: true, published: true, sort: 100,
    excerpt: "Por qué el agua es más importante que el alimento a la hora de engordar ganado." }
];

window.AquaBlog = (function () {
  function seed() { return JSON.parse(JSON.stringify(window.BLOG_SEED)); }
  function sb() { return window.sb || null; }
  function pubSeed() {
    return seed().filter(function (p) { return p.published !== false; })
      .sort(function (a, b) { return (a.sort || 0) - (b.sort || 0); });
  }

  // ---- lectura pública (blog) ----
  function getPosts() {
    var c = sb();
    if (!c) return Promise.resolve(pubSeed());
    return c.from("posts").select("*").eq("published", true).order("sort", { ascending: true })
      .then(function (r) { if (r.error) throw r.error; return (r.data && r.data.length) ? r.data : pubSeed(); })
      .catch(function (e) { console.warn("[blog] Supabase falló, uso seed:", e.message || e); return pubSeed(); });
  }
  function getPost(id) {
    var c = sb();
    var fb = seed().filter(function (p) { return p.id === id; })[0] || null;
    if (!c) return Promise.resolve(fb);
    return c.from("posts").select("*").eq("id", id).maybeSingle()
      .then(function (r) { if (r.error) throw r.error; return r.data || fb; })
      .catch(function () { return fb; });
  }

  // ---- panel de admin ----
  function getAll() {
    var c = sb();
    if (!c) return Promise.resolve(seed());
    return c.from("posts").select("*").order("sort", { ascending: true })
      .then(function (r) { if (r.error) throw r.error; return r.data || []; });
  }
  function upsert(post) {
    return sb().from("posts").upsert(post, { onConflict: "id" }).select();
  }
  function update(id, fields) {
    return sb().from("posts").update(fields).eq("id", id);
  }
  function remove(id) {
    return sb().from("posts").delete().eq("id", id);
  }
  function uploadImage(file) {
    var c = sb();
    var safe = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    var path = "img/" + Date.now() + "-" + safe;
    return c.storage.from("blog").upload(path, file, { upsert: false, contentType: file.type })
      .then(function (r) { if (r.error) throw r.error; return c.storage.from("blog").getPublicUrl(path).data.publicUrl; });
  }

  // ---- auth ----
  function signIn(email, password) { return sb().auth.signInWithPassword({ email: email, password: password }); }
  function signOut() { return sb() ? sb().auth.signOut() : Promise.resolve(); }
  function getUser() {
    var c = sb(); if (!c) return Promise.resolve(null);
    return c.auth.getUser().then(function (r) { return r.data ? r.data.user : null; }).catch(function () { return null; });
  }
  function configured() { return !!sb(); }

  function slugify(s) {
    return (s || "").toString().toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60) || ("post-" + Date.now());
  }

  return {
    getPosts: getPosts, getPost: getPost, getAll: getAll,
    upsert: upsert, update: update, remove: remove, uploadImage: uploadImage,
    signIn: signIn, signOut: signOut, getUser: getUser, configured: configured,
    slugify: slugify
  };
})();
