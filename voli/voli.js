/* Pagina Voli passati. Legge ../data/voli.json e disegna una scheda per volo.
   I video sono post di @SpaceX: miniatura leggera, l'incorporamento ufficiale di X
   si carica solo quando si tocca la miniatura. */
(function () {
  "use strict";

  var app = document.getElementById("app");
  var ICON = {
    ok: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
    part: '<path d="M12 4a8 8 0 1 0 0 16z" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="8"/>',
    fail: '<path d="M6 6l12 12M18 6 6 18"/>',
    skip: '<path d="M6 12h12"/>'
  };
  var STATUS_LABEL = { ok: "Raggiunto", part: "Parziale", fail: "Non raggiunto", skip: "Non eseguito" };

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function icon(kind, size) {
    return '<svg width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + ICON[kind] + "</svg>";
  }
  function st(kind) {
    return '<span class="st ' + kind + '" role="img" aria-label="' + STATUS_LABEL[kind] + '">' + icon(kind, 13) + "</span>";
  }
  function mmss(sec) {
    return Math.floor(sec / 60) + ":" + ("0" + (sec % 60)).slice(-2);
  }
  function postUrl(id) { return "https://x.com/SpaceX/status/" + id; }

  function goalRows(f) {
    return f.obiettivi.map(function (g) {
      return '<li class="goal">' +
        '<div class="g-o"><span class="g-lab">Obiettivo</span>' + esc(g.o) + "</div>" +
        '<div class="g-r">' + st(g.s) + '<div class="g-rt"><span class="g-lab">Risultato</span>' + esc(g.r) + "</div></div>" +
        "</li>";
    }).join("");
  }

  function videoCards(f) {
    return f.video.map(function (v) {
      var url = postUrl(v.id);
      return '<div class="vid" data-id="' + esc(v.id) + '">' +
        '<a class="vid-card" href="' + url + '" target="_blank" rel="noopener noreferrer" aria-label="Guarda il video: ' + esc(v.fase) + ', ' + esc(f.nome) + '">' +
        '<img src="' + esc(v.thumb) + '" alt="" loading="lazy" decoding="async" referrerpolicy="no-referrer" width="640" height="360">' +
        '<span class="play" aria-hidden="true"><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M7 4.5v15l13-7.5z"/></svg></span>' +
        '<span class="dur">' + mmss(v.dur) + "</span></a>" +
        '<div class="vid-meta"><b>' + esc(v.fase) + '</b><a href="' + url + '" target="_blank" rel="noopener noreferrer">@SpaceX su X <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17 17 7"/><path d="M8 7h9v9"/></svg></a></div>' +
        "</div>";
    }).join("");
  }

  function card(f) {
    return '<article class="card accented acc-voli flight" id="ift-' + f.n + '" aria-labelledby="h-ift-' + f.n + '">' +
      '<div class="fl-head">' +
        '<h2 class="fl-title" id="h-ift-' + f.n + '">' + esc(f.ift) + " <small>" + esc(f.nome) + "</small></h2>" +
      "</div>" +
      '<p class="fl-when">' + esc(f.data) + ", " + esc(f.ora) + " (ora di Roma)</p>" +
      '<p class="fl-focus">' + esc(f.focus) + "</p>" +
      '<ul class="fl-veh" aria-label="Veicoli">' +
        "<li><em>Booster</em> <b>" + esc(f.booster) + "</b></li>" +
        "<li><em>Ship</em> <b>" + esc(f.ship) + "</b></li>" +
        "<li><em>Versione</em> <b>" + esc(f.versione) + "</b> <span class=\"chip\">" + esc(f.versione_nota) + "</span></li>" +
      "</ul>" +
      '<div class="fl-desc"><p>' + esc(f.descrizione) + '</p><p class="fl-cur"><b>Curiosità</b> ' + esc(f.curiosita) + "</p></div>" +
      '<ul class="goals" aria-label="Obiettivi e risultato">' +
        '<li class="goals-head" aria-hidden="true"><span>Obiettivi</span><span>Risultato</span></li>' +
        goalRows(f) +
      "</ul>" +
      '<h3 class="vids-h">Video di @SpaceX</h3>' +
      '<div class="vids">' + videoCards(f) + "</div>" +
      '<p class="fl-src">Fonte: <a href="' + esc(f.src.url) + '" target="_blank" rel="noopener noreferrer">' + esc(f.src.label) + "</a></p>" +
    "</article>";
  }

  function render(data) {
    var voli = data.voli;
    document.getElementById("updated").innerHTML = "Scheda al <strong>" + esc(data.aggiornato) + "</strong>";

    var legend = ["ok", "part", "fail", "skip"].map(function (k) {
      return "<span>" + st(k) + " " + STATUS_LABEL[k].toLowerCase() + "</span>";
    }).join("");

    var nav = voli.map(function (f) {
      return '<a href="#ift-' + f.n + '" aria-label="' + esc(f.ift) + '">' + f.n + "</a>";
    }).join("");

    app.innerHTML =
      '<section class="card accented acc-voli vp-hero" aria-labelledby="h-voli">' +
        '<p class="kicker">Storico</p>' +
        '<h1 id="h-voli">Voli passati</h1>' +
        '<p class="vp-lead">I ' + voli.length + " voli di prova di Starship completa, uno per uno: gli obiettivi dichiarati, che cosa è successo davvero e un video di SpaceX su X di una fase principale.</p>" +
        '<p class="vp-legend" aria-label="Legenda">' + legend + "</p>" +
      "</section>" +
      '<nav class="vp-nav" aria-label="Vai al volo">' + nav + "</nav>" +
      '<div class="vp-list">' + voli.map(card).join("") + "</div>";
    bindEmbeds();
  }

  /* Incorporamento ufficiale di X, caricato solo al primo tocco */
  var widgetsPromise = null;
  function loadWidgets() {
    if (widgetsPromise) return widgetsPromise;
    widgetsPromise = new Promise(function (resolve, reject) {
      var s = document.createElement("script");
      s.src = "https://platform.twitter.com/widgets.js";
      s.async = true;
      s.charset = "utf-8";
      s.onload = function () { resolve(window.twttr); };
      s.onerror = function () { widgetsPromise = null; reject(new Error("widgets.js")); };
      document.head.appendChild(s);
    });
    return widgetsPromise;
  }

  function bindEmbeds() {
    app.addEventListener("click", function (e) {
      var link = e.target.closest ? e.target.closest("a.vid-card") : null;
      if (!link || e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return;
      var box = link.closest(".vid");
      if (!box) return;
      e.preventDefault();
      var id = box.getAttribute("data-id");
      var holder = document.createElement("div");
      holder.className = "vid-embed";
      holder.innerHTML = '<blockquote class="twitter-tweet" data-theme="dark" data-dnt="true" data-conversation="none" data-media-max-width="560"><a href="https://twitter.com/SpaceX/status/' + id + '">Apri il post di @SpaceX su X</a></blockquote>';
      box.replaceChild(holder, link);
      loadWidgets().then(function (t) {
        if (t && t.widgets) t.widgets.load(holder);
      }).catch(function () {
        /* se X non si carica resta il link al post dentro la citazione */
      });
    });
  }

  fetch("../data/voli.json?v=20261110b")
    .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then(render)
    .catch(function () {
      app.innerHTML = '<p class="card err">Non riesco a caricare i voli. Riprova più tardi.</p>';
      document.getElementById("updated").textContent = "";
    });
})();
