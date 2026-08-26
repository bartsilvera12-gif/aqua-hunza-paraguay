/* ============================================================
   Configuración de Supabase — Aqua Hunza
   Completá con los datos de tu proyecto (Settings -> API).
   La "anon public key" es PÚBLICA (va en el frontend): es su función.
   Nunca pongas acá la "service_role" key.
   ============================================================ */
window.SUPABASE_URL  = "https://api.neura.com.py";  // Project URL
window.SUPABASE_ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzc0MTAxNDYxLCJleHAiOjE5MzE3ODE0NjF9.7_wAph8IolPMXtgfpezSwS5XR62IdD__qhqCywLDp3Q";  // anon public key

(function () {
  try {
    if (window.supabase && String(window.SUPABASE_URL).indexOf("http") === 0) {
      window.sb = window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON, {
        db: { schema: "aquahunza" },                 // usa el schema propio
        auth: { persistSession: true, autoRefreshToken: true }
      });
    } else {
      console.warn("[supabase] sin configurar — el blog usa los datos locales de respaldo (seed).");
    }
  } catch (e) {
    console.warn("[supabase] no se pudo inicializar:", e.message);
  }
})();
