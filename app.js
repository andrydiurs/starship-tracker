/* Starship Tracker: rendering statico da data/tracker.json (nessun framework). */
(function () {
  "use strict";

  // ---------- Icone SVG inline (stile Lucide, licenza ISC) ----------
  var P = {
    siti: '<path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/>',
    prototipi: '<path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>',
    test: '<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>',
    lanci: '<path d="M3 21c5.5-1 10.5-5.5 14-13" stroke-dasharray="2.5 3"/><path d="M13.5 5.5 19 4l-1 5.6"/><circle cx="4" cy="20" r="1.6"/>',
    prossimo: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h18"/><path d="m9 16 2 2 4-4"/>',
    notizie: '<path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/><path d="M18 14h-8"/><path d="M15 18h-5"/><path d="M10 6h8v4h-8V6Z"/>',
    camera: '<path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/>',
    image: '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.09-3.09a2 2 0 0 0-2.82 0L6 21"/>',
    ext: '<path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
    chevron: '<path d="m6 9 6 6 6-6"/>',
    chevronR: '<path d="m9 18 6-6-6-6"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    play: '<path d="M6 4l14 8-14 8z" fill="currentColor" stroke="none"/>',
    link: '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>'
  };
  function svg(name) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (P[name] || "") + "</svg>";
  }
  function ico(name, extra) {
    return '<span class="ico ' + (extra || "") + '">' + svg(name) + "</span>";
  }

  var SEZ = ["siti", "prototipi", "test", "lanci"];
  var NOME = { siti: "Siti", prototipi: "Prototipi", test: "Test", lanci: "Lanci", prossimo: "Prossimo volo", notizie: "Ultime notizie" };
  var DA_NOME = { Siti: "siti", Prototipi: "prototipi", Test: "test", Lanci: "lanci" };

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function $(id) { return document.getElementById(id); }
  function badge(label, tone) { return '<span class="badge t-' + esc(tone || "neutral") + '">' + esc(label) + "</span>"; }
  function sezTag(k) { return '<span class="sez-tag acc-' + k + '">' + svg(k) + esc(NOME[k]) + "</span>"; }
  function fonte(src) {
    if (!src || !src.url) return "";
    return '<a class="fonte" href="' + esc(src.url) + '" target="_blank" rel="noopener noreferrer" title="' + esc(src.label) + '">fonte · ' + esc(src.label) + "</a>";
  }
  function head(level, k, title, sub) {
    return '<div class="sec-head acc-' + k + '">' + ico(k) + "<h" + level + (level === 2 ? ' id="h-' + k + '"' : "") + ">" + esc(title) + "</h" + level + ">" + (sub ? '<div class="sub">' + esc(sub) + "</div>" : "") + "</div>";
  }

  var STATO_TONE = { Pronto: "success", Test: "accent", Distrutto: "danger" };
  var ESITO_TONE = { Completato: "success", Anomalia: "warning", "In corso": "accent" };

  // ---------- Lista con dettagli espandibili ----------
  var rowSeq = 0;
  function lista(items) {
    return '<div class="list">' + items.map(function (it) {
      var id = "d" + (++rowSeq);
      var h = '<div class="row' + (it.nc ? " nc" : "") + '"><div class="row-head">';
      if (it.data) h += '<span class="date">' + esc(it.data) + "</span>";
      h += '<span class="title">' + esc(it.titolo) + "</span>";
      if (it.badge) h += badge(it.badge.label, it.badge.tone);
      if (it.sez) h += sezTag(it.sez);
      if (it.tag) h += '<span class="chip">' + esc(it.tag) + "</span>";
      if (it.nc) h += '<span class="badge nc">non confermato</span>';
      h += "</div>";
      if (it.breve) h += '<div class="brief">' + esc(it.breve) + "</div>";
      if (it.dettaglio) h += '<div class="detail" id="' + id + '" hidden>' + esc(it.dettaglio) + "</div>";
      h += '<div class="row-foot">';
      if (it.dettaglio) h += '<button class="btn-det" type="button" aria-expanded="false" aria-controls="' + id + '"><span>dettagli</span>' + svg("chevron") + "</button>";
      h += fonte(it.src) + "</div></div>";
      return h;
    }).join("") + "</div>";
  }
  function legenda(voci) {
    return '<div class="legend">' + voci.map(function (v) { return "<span>" + badge(v.label, v.tone) + esc(v.spiega) + "</span>"; }).join("") + "</div>";
  }
  function more(title, inner, open) {
    return '<details class="more"' + (open ? " open" : "") + "><summary>" + svg("chevronR") + esc(title) + "</summary>" + inner + "</details>";
  }
  function props(arr) {
    return '<dl class="props">' + arr.map(function (p) {
      return "<dt>" + esc(p.label) + "</dt><dd>" + (p.badge ? badge(p.value, p.badge) : esc(p.value)) + "</dd>";
    }).join("") + "</dl>";
  }

  // ---------- Prossimo volo ----------
  function renderProssimo(D) {
    var pv = D.PROSSIMO_VOLO;
    var stadi = [pv.ship, pv.booster];
    var fatti = 0, tot = 0;
    stadi.forEach(function (s) { tot += s.milestones.length; fatti += s.milestones.filter(function (m) { return m.fatto; }).length; });
    var h = '<div class="card accented acc-prossimo">' + head(2, "prossimo", "Prossimo volo: " + pv.volo);
    h += '<p class="pv-lead">' + esc(pv.veicoli) + " · " + esc(pv.sito) + " · obiettivo: " + esc(pv.obiettivo.toLowerCase()) + "</p>";
    h += '<div class="metrics">' +
      '<div class="metric"><div class="v">' + esc(pv.netBreve) + '</div><div class="l">Data NET</div><div class="d">' + esc(pv.net) + "</div></div>" +
      '<div class="metric warn"><div class="v">' + esc(pv.licenzaBreve) + '</div><div class="l">Licenza FAA</div><div class="d">' + esc(pv.licenzaFaa) + "</div></div>" +
      '<div class="metric"><div class="v">' + fatti + "/" + tot + '</div><div class="l">Tappe pre-volo</div><div class="d">' + esc(pv.ship.titolo) + " + " + esc(pv.booster.titolo) + "</div></div></div>";
    h += '<div class="stadi">' + stadi.map(function (st) {
      var f = st.milestones.filter(function (m) { return m.fatto; }).length;
      var pct = Math.round((f / st.milestones.length) * 100);
      return '<div class="stadio"><h3>' + esc(st.titolo) + "</h3>" +
        '<div class="meta">' + esc(st.versione) + " " + badge(st.stato.label, st.stato.tone) + "</div>" +
        '<div class="progress"><div class="bar" role="progressbar" aria-valuemin="0" aria-valuemax="' + st.milestones.length + '" aria-valuenow="' + f + '"><i style="width:' + pct + '%"></i></div><span>' + f + "/" + st.milestones.length + " tappe</span></div>" +
        '<ul class="checklist">' + st.milestones.map(function (m) {
          return '<li class="' + (m.fatto ? "done" : "todo") + '"><span class="box">' + (m.fatto ? svg("check") : "") + '</span><span><span class="t">' + esc(m.nome) + ": " + (m.fatto ? "fatto" : "da fare") + '</span><span class="m">' + esc(m.data) + (m.nota ? " · " + esc(m.nota) : "") + " " + fonte(m.src) + "</span></span></li>";
        }).join("") + "</ul></div>";
    }).join("") + "</div>";
    h += '<div class="pv-fonti">' + fonte(pv.netSrc) + fonte(pv.licenzaSrc) + "</div></div>";
    $("prossimo").innerHTML = h;
  }

  // ---------- Notizie ----------
  function newsItems(arr) {
    return arr.map(function (n) { return { data: n.data, titolo: n.testo, sez: DA_NOME[n.sez], nc: n.nc, src: n.src }; });
  }
  function renderNotizie(D) {
    var h = '<div class="card accented acc-notizie">' + head(2, "notizie", "Ultime notizie");
    h += lista(newsItems(D.NEWS.slice(0, 6)));
    if (D.NEWS.length > 6) h += more("Notizie precedenti", lista(newsItems(D.NEWS.slice(6))));
    $("notizie").innerHTML = h + "</div>";
  }

  // ---------- Tab ----------
  var state = { tab: "lanci", tipo: "Tutti", stato: "Tutti", esito: "Tutti" };
  function renderTabs() {
    $("tabs").innerHTML = SEZ.map(function (k) {
      return '<button class="tab acc-' + k + '" role="tab" type="button" id="tab-' + k + '" aria-controls="sezione" aria-selected="' + (state.tab === k) + '" data-tab="' + k + '">' + ico(k) + esc(NOME[k]) + "</button>";
    }).join("");
  }

  function xThumbUrl(u, size) {
    // pbs.twimg.com accetta ?format=jpg&name=small|medium|large
    var m = /^(https:\/\/pbs\.twimg\.com\/.+)\.(jpg|jpeg|png|webp)$/i.exec(u);
    return m ? m[1] + "?format=" + m[2].toLowerCase().replace("jpeg", "jpg") + "&name=" + size : u;
  }
  function xBlock(D, k) {
    var posts = (D.X_POSTS && D.X_POSTS[k]) || [];
    if (!posts.length) return "";
    var h = '<div class="sub-card">' + head(3, k, "Dal mondo X").replace(ico(k), ico("camera", "sm")) +
      '<p class="xhint">Post pubblici recenti con foto o video. Tocca un\'immagine per ingrandirla, o il link per aprire il post su X. Scorri di lato per vederne altri.</p><div class="xrow">';
    h += posts.map(function (p) {
      var imgs = p.immagini || [];
      var shown = imgs.slice(0, 4);
      var m = '<div class="xmedia n' + Math.max(1, shown.length) + '">' + shown.map(function (im, i) {
        return '<button type="button" class="thumb" data-full="' + esc(xThumbUrl(im.url, "large")) + '" data-post="' + esc(p.url) + '" data-cap="' + esc(p.autore + " · " + p.data + ", " + p.ora + " · " + p.testo) + '" aria-label="Ingrandisci ' + (im.tipo === "video" ? "anteprima video" : "foto") + " di " + esc(p.autore) + '">' +
          '<img src="' + esc(xThumbUrl(im.url, "small")) + '" alt="' + esc((im.tipo === "video" ? "Anteprima video: " : "Foto: ") + p.testo) + '" loading="lazy" decoding="async" referrerpolicy="no-referrer">' +
          (im.tipo === "video" ? '<span class="play">' + svg("play") + "</span>" : "") +
          (i === 3 && imgs.length > 4 ? '<span class="more-n">+' + (imgs.length - 4) + "</span>" : "") +
          '<span class="fb">' + svg("image") + "Immagine non disponibile<br>apri il post su X</span></button>";
      }).join("") + "</div>";
      return '<article class="xpost acc-' + k + '">' + m + '<div class="xbody"><div class="xmeta"><span class="who">' + esc(p.autore) + "</span><span>" + esc(p.data) + ", " + esc(p.ora) + "</span><span>· " + esc(p.media) + '</span></div><p class="xtext">' + esc(p.testo) + '</p><a class="xlink" href="' + esc(p.url) + '" target="_blank" rel="noopener noreferrer">Apri su X' + svg("ext") + "</a></div></article>";
    }).join("");
    return h + "</div></div>";
  }

  function seg(name, opts, val) {
    return '<div class="seg" role="group">' + opts.map(function (o) {
      return '<button type="button" data-seg="' + name + '" data-v="' + esc(o) + '" aria-pressed="' + (o === val) + '">' + esc(o) + "</button>";
    }).join("") + "</div>";
  }

  function renderSezione(D) {
    var k = state.tab, h = '<div class="card accented acc-' + k + '">';
    var titoli = { siti: "Siti di costruzione", prototipi: "Prototipi", test: "Test a terra", lanci: "Lanci" };
    h += head(2, k, titoli[k]);
    h += '<div class="callout"><b>In breve</b>' + esc(D.IN_BREVE[k]) + "</div>";
    if (k === "siti") {
      h += legenda(D.LEGENDE.siti);
      h += lista(D.SITI.map(function (s) { return { data: s.data, titolo: s.sito, tag: s.area, badge: s.stato, breve: s.breve, dettaglio: s.ultimo, src: s.src }; }));
      h += xBlock(D, k);
      h += more("Contesto normativo", lista(D.NORMATIVO.map(function (n) { return { data: n.data, titolo: n.atto, breve: n.breve, dettaglio: n.dettaglio, src: n.src }; })));
      h += more("Segnalazioni non confermate", lista(D.NON_CONFERMATI.map(function (n) { return { data: n.data, titolo: n.titolo, breve: n.testo, nc: true, src: D.NC_SRC }; })));
    } else if (k === "prototipi") {
      h += '<div class="filters">' + seg("tipo", ["Tutti", "Ship", "Booster"], state.tipo) +
        '<label class="sel">Stato <select id="sel-stato">' + ["Tutti", "In costruzione", "Test", "Pronto", "Lanciato", "Distrutto", "Ritirato"].map(function (o) { return "<option" + (o === state.stato ? " selected" : "") + ">" + esc(o) + "</option>"; }).join("") + "</select></label></div>";
      h += legenda(D.LEGENDE.prototipi);
      var vs = D.VEICOLI.filter(function (v) { return (state.tipo === "Tutti" || v.tipo === state.tipo) && (state.stato === "Tutti" || v.stato === state.stato); });
      h += vs.length ? lista(vs.map(function (v) {
        return { data: v.data, titolo: v.serial, tag: v.versione + " · " + v.volo + (v.voloNc ? " (non confermato)" : ""), badge: { label: v.stato, tone: STATO_TONE[v.stato] || "neutral" }, breve: v.breve, dettaglio: v.note, src: v.src };
      })) : '<p class="note">Nessun veicolo con questi filtri.</p>';
      h += '<p class="note">' + esc(D.NOTA_PROTOTIPI) + "</p>";
      h += xBlock(D, k);
    } else if (k === "test") {
      h += '<div class="filters">' + seg("esito", ["Tutti", "Completato", "In corso", "Atteso", "Anomalia"], state.esito) + "</div>";
      h += legenda(D.LEGENDE.test);
      var ts = D.TEST.filter(function (t) { return state.esito === "Tutti" || t.esito === state.esito; });
      h += ts.length ? lista(ts.map(function (t) {
        return { data: t.data, titolo: t.veicolo + ": " + t.tipo, badge: { label: t.esito, tone: ESITO_TONE[t.esito] || "neutral" }, breve: t.luogo, dettaglio: t.nota, nc: t.nc, src: t.src };
      })) : '<p class="note">Nessun test con questo esito.</p>';
      h += xBlock(D, k);
    } else {
      (D.VOLI_FUTURI || []).forEach(function (v, i) {
        var inner = props(v.proprieta) + '<div class="pv-fonti">' + v.fonti.map(fonte).join("") + "</div>" + (v.dettagli ? more("Dettagli " + v.titolo.replace(/ \(.*\)$/, ""), '<p class="brief">' + esc(v.dettagli) + "</p>") : "");
        h += i === 0 ? '<div class="sub-card"><div class="sec-head"><h3>' + esc(v.titolo) + "</h3></div>" + inner + "</div>" : more(v.titolo, inner, v.aperto);
      });
      h += '<div class="sub-card"><div class="sec-head"><h3>Voli recenti</h3></div>' + lista(D.LANCI.map(function (l) {
        return { data: l.data, titolo: l.volo + " · " + l.veicoli, badge: l.esito, tag: l.pad, breve: l.breve, dettaglio: l.sintesi, src: l.src };
      })) + "</div>";
      h += xBlock(D, k);
    }
    $("sezione").setAttribute("aria-labelledby", "tab-" + k);
    $("sezione").innerHTML = h + "</div>";
    wireImages($("sezione"));
  }

  function renderFonti(D) {
    $("fonti").innerHTML = '<div class="card">' + more("Fonti principali", '<div class="fonti-grid">' + D.FONTI.map(function (f) {
      return '<a class="fonte-card" href="' + esc(f.href) + '" target="_blank" rel="noopener noreferrer">' + esc(f.title) + "<small>" + esc(f.site) + "</small></a>";
    }).join("") + "</div>") + "</div>";
  }

  // ---------- Immagini: caricamento, fallback, visore ----------
  function wireImages(root) {
    Array.prototype.forEach.call(root.querySelectorAll(".thumb img"), function (img) {
      var b = img.parentNode;
      function ok() { b.classList.add("loaded"); }
      function ko() { b.classList.add("failed"); b.setAttribute("aria-label", "Immagine non disponibile: apri il post su X"); }
      if (img.complete && img.naturalWidth) ok();
      else if (img.complete && img.currentSrc) ko();
      img.addEventListener("load", ok);
      img.addEventListener("error", ko);
    });
  }
  var viewer = $("viewer"), vImg = $("viewer-img"), vCap = $("viewer-cap");
  function openViewer(btn) {
    if (btn.classList.contains("failed") || !viewer || typeof viewer.showModal !== "function") {
      window.open(btn.getAttribute("data-post"), "_blank", "noopener");
      return;
    }
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

  // ---------- Eventi (delegati) ----------
  document.addEventListener("click", function (e) {
    var t = e.target.closest("[data-tab], .btn-det, [data-seg], .thumb");
    if (!t) return;
    if (t.hasAttribute("data-tab")) { setTab(t.getAttribute("data-tab"), true); return; }
    if (t.classList.contains("btn-det")) {
      var d = document.getElementById(t.getAttribute("aria-controls"));
      var open = t.getAttribute("aria-expanded") !== "true";
      t.setAttribute("aria-expanded", String(open));
      t.querySelector("span").textContent = open ? "chiudi dettagli" : "dettagli";
      if (d) d.hidden = !open;
      return;
    }
    if (t.hasAttribute("data-seg")) { state[t.getAttribute("data-seg")] = t.getAttribute("data-v"); renderSezione(DATA); return; }
    if (t.classList.contains("thumb")) { openViewer(t); }
  });
  document.addEventListener("change", function (e) {
    if (e.target && e.target.id === "sel-stato") { state.stato = e.target.value; renderSezione(DATA); }
  });
  document.addEventListener("keydown", function (e) {
    var t = e.target;
    if (!t.classList || !t.classList.contains("tab") || (e.key !== "ArrowRight" && e.key !== "ArrowLeft")) return;
    var i = SEZ.indexOf(state.tab) + (e.key === "ArrowRight" ? 1 : -1);
    setTab(SEZ[(i + SEZ.length) % SEZ.length], true);
    $("tab-" + state.tab).focus();
  });
  function setTab(k, push) {
    if (SEZ.indexOf(k) < 0) return;
    state.tab = k;
    renderTabs();
    renderSezione(DATA);
    if (push && history.replaceState) history.replaceState(null, "", "#" + k);
  }
  window.addEventListener("hashchange", function () { var k = location.hash.slice(1); if (k !== state.tab) setTab(k, false); });

  // ---------- Avvio ----------
  var DATA = null;
  fetch("data/tracker.json", { cache: "no-cache" })
    .then(function (r) { if (!r.ok) throw new Error("HTTP " + r.status); return r.json(); })
    .then(function (D) {
      DATA = D;
      $("updated").innerHTML = "Ultimo aggiornamento: <strong>" + esc(D.ULTIMO_AGGIORNAMENTO) + "</strong> (ora di Roma)";
      var h = location.hash.slice(1);
      if (SEZ.indexOf(h) >= 0) state.tab = h;
      renderProssimo(D);
      renderNotizie(D);
      renderTabs();
      renderSezione(D);
      renderFonti(D);
    })
    .catch(function (err) {
      $("updated").innerHTML = '<span class="err">Impossibile caricare data/tracker.json (' + esc(err.message) + "). Apri il sito tramite un server web, non da file://.</span>";
    });
})();
