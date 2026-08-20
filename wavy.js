(function () {
  function createNoise3D() {
    var p = new Uint8Array(256), i;
    for (i = 0; i < 256; i++) p[i] = i;
    var seed = 1234;
    function rnd() { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }
    for (i = 255; i > 0; i--) { var n = Math.floor((i + 1) * rnd()); var q = p[i]; p[i] = p[n]; p[n] = q; }
    var perm = new Uint8Array(512), pm = new Uint8Array(512);
    for (i = 0; i < 512; i++) { perm[i] = p[i & 255]; pm[i] = perm[i] % 12; }
    var g = new Float32Array([1,1,0,-1,1,0,1,-1,0,-1,-1,0,1,0,1,-1,0,1,1,0,-1,-1,0,-1,0,1,1,0,-1,1,0,1,-1,0,-1,-1]);
    var F = 1 / 3, G = 1 / 6;
    return function (x, y, z) {
      var n0, n1, n2, n3;
      var s = (x + y + z) * F;
      var i = Math.floor(x + s), j = Math.floor(y + s), k = Math.floor(z + s);
      var t = (i + j + k) * G;
      var x0 = x - (i - t), y0 = y - (j - t), z0 = z - (k - t);
      var i1, j1, k1, i2, j2, k2;
      if (x0 >= y0) { if (y0 >= z0) { i1=1;j1=0;k1=0;i2=1;j2=1;k2=0; } else if (x0 >= z0) { i1=1;j1=0;k1=0;i2=1;j2=0;k2=1; } else { i1=0;j1=0;k1=1;i2=1;j2=0;k2=1; } }
      else { if (y0 < z0) { i1=0;j1=0;k1=1;i2=0;j2=1;k2=1; } else if (x0 < z0) { i1=0;j1=1;k1=0;i2=0;j2=1;k2=1; } else { i1=0;j1=1;k1=0;i2=1;j2=1;k2=0; } }
      var x1=x0-i1+G, y1=y0-j1+G, z1=z0-k1+G;
      var x2=x0-i2+2*G, y2=y0-j2+2*G, z2=z0-k2+2*G;
      var x3=x0-1+3*G, y3=y0-1+3*G, z3=z0-1+3*G;
      var ii=i&255, jj=j&255, kk=k&255;
      var t0=0.6-x0*x0-y0*y0-z0*z0; if (t0<0) n0=0; else { var gi0=pm[ii+perm[jj+perm[kk]]]*3; t0*=t0; n0=t0*t0*(g[gi0]*x0+g[gi0+1]*y0+g[gi0+2]*z0); }
      var t1=0.6-x1*x1-y1*y1-z1*z1; if (t1<0) n1=0; else { var gi1=pm[ii+i1+perm[jj+j1+perm[kk+k1]]]*3; t1*=t1; n1=t1*t1*(g[gi1]*x1+g[gi1+1]*y1+g[gi1+2]*z1); }
      var t2=0.6-x2*x2-y2*y2-z2*z2; if (t2<0) n2=0; else { var gi2=pm[ii+i2+perm[jj+j2+perm[kk+k2]]]*3; t2*=t2; n2=t2*t2*(g[gi2]*x2+g[gi2+1]*y2+g[gi2+2]*z2); }
      var t3=0.6-x3*x3-y3*y3-z3*z3; if (t3<0) n3=0; else { var gi3=pm[ii+1+perm[jj+1+perm[kk+1]]]*3; t3*=t3; n3=t3*t3*(g[gi3]*x3+g[gi3+1]*y3+g[gi3+2]*z3); }
      return 32 * (n0 + n1 + n2 + n3);
    };
  }
  function initCanvas(canvas) {
    if (canvas.dataset.wavy) return; canvas.dataset.wavy = '1';
    var ctx = canvas.getContext('2d'); if (!ctx) return;
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var noise = createNoise3D();
    var colors = ['#279CBC', '#4FB6D4', '#1E6E88', '#4FD0E8', '#2E9FC0'];
    var dpr = Math.min(window.devicePixelRatio || 1, 1.5), nt = 0, W = 0, H = 0, raf = 0;
    function size() { var r = canvas.getBoundingClientRect(); W = r.width; H = r.height; canvas.width = Math.max(1, Math.round(W * dpr)); canvas.height = Math.max(1, Math.round(H * dpr)); ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.filter = 'blur(8px)'; }
    function frame() { nt += 0.0016; ctx.globalAlpha = 0.5; ctx.fillStyle = '#0C2A38'; ctx.fillRect(0, 0, W, H); for (var i = 0; i < 5; i++) { ctx.beginPath(); ctx.lineWidth = 40; ctx.strokeStyle = colors[i % colors.length]; for (var x = 0; x < W; x += 5) { var y = noise(x / 620, 0.28 * i, nt) * 90; ctx.lineTo(x, y + H * 0.5); } ctx.stroke(); ctx.closePath(); } }
    function loop() { frame(); raf = requestAnimationFrame(loop); }
    function start() { cancelAnimationFrame(raf); size(); if (reduce) { for (var k = 0; k < 44; k++) frame(); } else loop(); }
    requestAnimationFrame(start);
    var rt; window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(start, 180); });
  }
  function run() { var cs = document.querySelectorAll('.wavy-cta'); for (var i = 0; i < cs.length; i++) initCanvas(cs[i]); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run); else run();
})();
