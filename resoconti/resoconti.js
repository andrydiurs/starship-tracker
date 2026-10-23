/* Resoconti mensili: archivio e pagina del mese. Dati in ../data/resoconti/ */
(function () {
  "use strict";
  var P = {
    siti: '<path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/>',
    prototipi: '<path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>',
    test: '<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>',
    lanci: '<path d="M3 21c5.5-1 10.5-5.5 14-13" stroke-dasharray="2.5 3"/><path d="M13.5 5.5 19 4l-1 5.6"/><circle cx="4" cy="20" r="1.6"/>',
    prossimo: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h18"/><path d="m9 16 2 2 4-4"/>',
    notizie: '<path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/><path d="M18 14h-8"/><path d="M15 18h-5"/><path d="M10 6h8v4h-8V6Z"/>',
    book: '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>',
    back: '<path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>',
    image: '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.09-3.09a2 2 0 0 0-2.82 0L6 21"/>',
    ext: '<path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
    chevronR: '<path d="m9 18 6-6-6-6"/>',
    play: '<path d="M6 4l14 8-14 8z" fill="currentColor" stroke="none"/>',
    info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>'
  };
  function svg(n) { return '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (P[n] || "") + "</svg>"; }
  function ico(n, extra) { return '<span class="ico ' + (extra || "") + '">' + svg(n) + "</span>"; }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function $(id) { return document.getElementById(id); }
  // Testo con link minimi: [testo](https://...) e **grassetto**. Si fa l'escape prima.
  function rich(s) {
    return esc(s)
      .replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  }
  function xThumbUrl(u, size) {
    var m = /^(https:\/\/pbs\.twimg\.com\/.+)\.(jpg|jpeg|png|webp)$/i.exec(u);
    return m ? m[1] + "?format=" + m[2].toLowerCase().replace("jpeg", "jpg") + "&name=" + size : u;
  }
  var BASE = "../data/resoconti/";
  function getJSON(u) { return fetch(u, { cache: "no-cache" }).then(function (r) { if (!r.ok) throw new Error("HTTP " + r.status + " su " + u); return r.json(); }); }
  function fail(e) { $("app").innerHTML = '<div class="card"><p class="err">Impossibile caricare il resoconto (' + esc(e.message) + ").</p></div>"; }

  // ---------- Post X come figura nel testo ----------
  function xFig(p, k) {
    var imgs = (p.immagini || []).slice(0, 4), n = Math.max(1, imgs.length);
    var style = "";
    if (n === 1 && imgs[0] && imgs[0].w && imgs[0].h) style = ' style="aspect-ratio:' + imgs[0].w + " / " + imgs[0].h + '"';
    var cap = p.autore + " · " + p.data + ", " + p.ora + " · " + p.testo;
    var media = '<div class="xmedia n' + n + '"' + style + ">" + imgs.map(function (im) {
      return '<button type="button" class="thumb" data-full="' + esc(xThumbUrl(im.url, "large")) + '" data-post="' + esc(p.url) + '" data-cap="' + esc(cap) + '" aria-label="Ingrandisci ' + (im.tipo === "video" ? "anteprima video" : "foto") + " di " + esc(p.autore) + '">' +
        '<img src="' + esc(xThumbUrl(im.url, n === 1 ? "medium" : "small")) + '" alt="' + esc((im.tipo === "video" ? "Anteprima video: " : "Foto: ") + p.testo) + '" loading="lazy" decoding="async" referrerpolicy="no-referrer">' +
        (im.tipo === "video" ? '<span class="play">' + svg("play") + "</span>" : "") +
        '<span class="fb">' + svg("image") + "Immagine non disponibile<br>apri il post su X</span></button>";
    }).join("") + "</div>";
    var tipo = imgs.some(function (i) { return i.tipo === "video"; }) ? "video" : (imgs.length > 1 ? imgs.length + " foto" : "foto");
    return '<figure class="rfig acc-' + k + '">' + media + '<figcaption><p class="rfig-text">' + esc(p.testo) + '</p><div class="xmeta"><span class="who">' + esc(p.autore) + "</span><span>" + esc(p.data) + ", " + esc(p.ora) + "</span><span>· " + tipo + '</span><a class="xlink" href="' + esc(p.url) + '" target="_blank" rel="noopener noreferrer">Apri su X' + svg("ext") + "</a></div></figcaption></figure>";
  }
  function blocchi(arr, k) {
    return (arr || []).map(function (b) {
      if (b.x) return xFig(b.x, k);
      if (b.h) return "<h3>" + esc(b.h) + "</h3>";
      return "<p>" + rich(b.p) + "</p>";
    }).join("");
  }

  // ---------- Pagina del mese ----------
  function renderMese(R, idx) {
    document.title = R.titolo + " · Resoconti · Starship Tracker";
    $("updated").innerHTML = "Resoconto mensile · aggiornato al <strong>" + esc(R.aggiornato) + "</strong>";
    var nx = 0;
    R.sezioni.forEach(function (s) { s.blocchi.forEach(function (b) { if (b.x) nx++; }); });
    var toc = R.sezioni.map(function (s) {
      return '<a class="toc-item acc-' + s.k + '" href="#' + s.k + '">' + ico(s.k, "sm") + "<span>" + esc(s.titolo) + "</span></a>";
    }).join("") + '<a class="toc-item acc-prossimo" href="#novembre">' + ico("prossimo", "sm") + "<span>" + esc(R.novembre.titolo) + "</span></a>";
    var h = '<div class="report-grid"><aside class="report-toc" aria-label="Indice"><p class="toc-label">In questo resoconto</p><nav>' + toc + '</nav><a class="toc-back" href="./">' + svg("book") + "Tutti i resoconti</a></aside>";
    h += '<article class="report">';
    h += '<header class="card report-hero"><p class="kicker">' + svg("book") + esc(R.occhiello) + " · " + esc(R.mese) + "</p><h1>" + esc(R.titolo) + '</h1><p class="report-note">' + svg("info") + "<span>" + rich(R.nota) + '</span></p><div class="prose lead">' + R.intro.map(function (p) { return "<p>" + rich(p) + "</p>"; }).join("") + '</div><p class="report-meta">' + esc(R.periodo) + " · " + R.sezioni.length + " sezioni · " + nx + " post da X</p></header>";
    R.sezioni.forEach(function (s) {
      h += '<section class="card accented acc-' + s.k + ' report-sec" id="' + s.k + '"><div class="sec-head">' + ico(s.k) + "<h2>" + esc(s.titolo) + "</h2>" + (s.sottotitolo ? '<p class="sub">' + esc(s.sottotitolo) + "</p>" : "") + '</div><div class="prose">' + blocchi(s.blocchi, s.k) + "</div></section>";
    });
    h += '<section class="card accented acc-prossimo report-sec" id="novembre"><div class="sec-head">' + ico("prossimo") + "<h2>" + esc(R.novembre.titolo) + '</h2></div><div class="prose">' + blocchi(R.novembre.blocchi, "prossimo") + "</div></section>";
    if (R.fonti && R.fonti.length) {
      h += '<section class="card report-sec" id="fonti"><div class="sec-head">' + ico("notizie", "sm acc-notizie") + '<h3>Fonti principali</h3></div><ul class="rfonti">' + R.fonti.map(function (f) {
        return '<li><a href="' + esc(f.url) + '" target="_blank" rel="noopener noreferrer">' + esc(f.label) + svg("ext") + "</a></li>";
      }).join("") + "</ul></section>";
    }
    // navigazione tra mesi (l'indice è dal più recente)
    var list = (idx && idx.resoconti) || [], i = -1;
    list.forEach(function (m, j) { if (m.id === R.id) i = j; });
    var newer = i > 0 ? list[i - 1] : null, older = i >= 0 && i < list.length - 1 ? list[i + 1] : null;
    h += '<nav class="month-nav">' + (older ? '<a href="' + esc(older.id) + '.html">← ' + esc(older.mese) + "</a>" : "<span></span>") + '<a href="./">Archivio</a>' + (newer ? '<a href="' + esc(newer.id) + '.html">' + esc(newer.mese) + " →</a>" : "<span></span>") + "</nav>";
    h += "</article></div>";
    $("app").innerHTML = h;
    wireImages($("app"));
  }

  // ---------- Archivio ----------
  function renderArchivio(idx) {
    $("updated").innerHTML = "Archivio dei resoconti mensili";
    var list = idx.resoconti || [];
    var h = '<section class="card archive-hero"><p class="kicker">' + svg("book") + 'Archivio</p><h1>Resoconti mensili</h1><p class="lead-small">Ogni mese, il racconto di quanto è successo a Starship: cantieri, prototipi, test e lanci, con le fonti e le foto dal mondo X. Dal più recente.</p></section>';
    h += '<div class="archive-list">' + list.map(function (m) {
      return '<a class="card archive-item" href="' + esc(m.id) + '.html">' +
        (m.copertina ? '<span class="archive-cover thumb"><img src="' + esc(xThumbUrl(m.copertina, "small")) + '" alt="" loading="lazy" decoding="async" referrerpolicy="no-referrer"><span class="fb">' + svg("image") + "</span></span>" : "") +
        '<span class="archive-body"><span class="archive-month">' + esc(m.mese) + (m.stato ? ' <span class="badge t-accent">' + esc(m.stato) + "</span>" : "") + '</span><span class="archive-title">' + esc(m.titolo) + '</span><span class="archive-sum">' + esc(m.sommario) + '</span><span class="archive-meta">' + esc(m.periodo) + " · aggiornato al " + esc(m.aggiornato) + '</span><span class="archive-cta">Leggi il resoconto' + svg("chevronR") + "</span></span></a>";
    }).join("") + "</div>";
    $("app").innerHTML = h;
    wireImages($("app"));
  }

  // ---------- Immagini e visore ----------
  function wireImages(root) {
    Array.prototype.forEach.call(root.querySelectorAll(".thumb img"), function (img) {
      var b = img.parentNode;
      function ok() { b.classList.add("loaded"); }
      function ko() { b.classList.add("failed"); }
      if (img.complete && img.naturalWidth) ok(); else if (img.complete && img.currentSrc) ko();
      img.addEventListener("load", ok); img.addEventListener("error", ko);
    });
  }
  var viewer = $("viewer"), vImg = $("viewer-img"), vCap = $("viewer-cap");
  function openViewer(btn) {
    if (btn.classList.contains("failed") || !viewer || typeof viewer.showModal !== "function") { window.open(btn.getAttribute("data-post"), "_blank", "noopener"); return; }
    vImg.onerror = function () { viewer.close(); window.open(btn.getAttribute("data-post"), "_blank", "noopener"); };
    vImg.src = btn.getAttribute("data-full");
    vImg.alt = btn.querySelector("img").alt;
    vCap.innerHTML = esc(btn.getAttribute("data-cap")) + ' · <a href="' + esc(btn.getAttribute("data-post")) + '" target="_blank" rel="noopener noreferrer">apri su X</a>';
    viewer.showModal();
  }
  if (viewer) {
    viewer.addEventListener("click", function (e) { if (e.target === viewer || e.target.closest(".viewer-close")) viewer.close(); });
    viewer.addEventListener("close", function () { vImg.removeAttribute("src"); });
  }
  document.addEventListener("click", function (e) {
    var b = e.target.closest("button.thumb");
    if (b) { e.preventDefault(); openViewer(b); }
  });

  // ---------- Avvio ----------
  var m = /(\d{4}-\d{2})\.html$/.exec(location.pathname) || /[?&]m=(\d{4}-\d{2})/.exec(location.search);
  var idxP = getJSON(BASE + "index.json");
  if (m) {
    Promise.all([getJSON(BASE + m[1] + ".json"), idxP.catch(function () { return null; })])
      .then(function (r) { renderMese(r[0], r[1]); if (location.hash) { var t = document.querySelector(location.hash); if (t) t.scrollIntoView(); } })
      .catch(fail);
  } else {
    idxP.then(renderArchivio).catch(fail);
  }
})();
