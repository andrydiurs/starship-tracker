/* Pagina Prossimo volo. Legge ../data/volo-prossimo.json (decollo in UTC + eventi in secondi da T-0)
   e aggiorna conti alla rovescia e fasi sull'orologio. Orari sempre in ora di Roma.
   Debug: ?t=T-600, ?t=T+400, ?t=T+21:40:00 oppure ?t=2026-11-14T10:00:00Z; ?speed=60 accelera. */
(function () {
  "use strict";

  var app = document.getElementById("app");
  var TZ = "Europe/Rome";
  var fmtDay = new Intl.DateTimeFormat("it-IT", { timeZone: TZ, weekday: "short", day: "numeric", month: "short" });
  var fmtHM = new Intl.DateTimeFormat("it-IT", { timeZone: TZ, hour: "2-digit", minute: "2-digit", hourCycle: "h23" });
  var fmtHMS = new Intl.DateTimeFormat("it-IT", { timeZone: TZ, hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23" });
  var fmtYMD = new Intl.DateTimeFormat("en-CA", { timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit" });

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function hms(sec) {
    sec = Math.max(0, Math.floor(sec));
    return pad(Math.floor(sec / 3600)) + ":" + pad(Math.floor(sec / 60) % 60) + ":" + pad(sec % 60);
  }
  function tLabel(t) { return (t < 0 ? "T−" : "T+") + hms(Math.abs(t)); }
  function day(d) { return fmtDay.format(d).replace(/\./g, ""); }
  function sameDay(a, b) { return fmtYMD.format(a) === fmtYMD.format(b); }
  function dur(sec) {
    sec = Math.max(0, Math.floor(sec));
    var d = Math.floor(sec / 86400), h = Math.floor(sec / 3600) % 24, m = Math.floor(sec / 60) % 60, s = sec % 60;
    if (d) return d + "g " + h + "h " + pad(m) + "m";
    if (h) return h + "h " + pad(m) + "m " + pad(s) + "s";
    return m + "m " + pad(s) + "s";
  }

  /* Orologio, con eventuale simulazione per i test */
  var T0 = 0, simOffset = 0, speed = 1, realStart = Date.now(), simActive = false, simSpec = null;
  (function readSim() {
    var q = location.search;
    var mt = q.match(/[?&]t=([^&]*)/);
    var ms = q.match(/[?&]speed=([\d.]+)/);
    if (ms) { speed = Math.max(0.01, parseFloat(ms[1]) || 1); simActive = true; }
    if (mt) { simSpec = decodeURIComponent(mt[1].replace(/\+/g, "%2B")).trim(); simActive = true; }
  })();
  function parseRel(spec) {
    var m = spec.match(/^T?\s*([+\-−])?\s*(\d+(?::\d+){0,2})$/i);
    if (!m) return null;
    var parts = m[2].split(":").map(Number), s = 0;
    parts.forEach(function (p) { s = s * 60 + p; });
    return (m[1] === "-" || m[1] === "−") ? -s : s;
  }
  function now() {
    var base = realStart + simOffset;
    return base + (Date.now() - realStart) * speed;
  }

  var D, EV, BOOST, SHIP, PRE, CATCH_T, BOOST_CATCH_T, els = {}, lastState = {};

  function rome(t) { return new Date(T0 + t * 1000); }
  function when(t, withSec) {
    var d = rome(t), f = withSec ? fmtHMS : fmtHM;
    return f.format(d);
  }

  function svgInline(url) {
    return fetch(url).then(function (r) { return r.ok ? r.text() : ""; }).catch(function () { return ""; });
  }

  function evItem(e, vehicle) {
    var d = rome(e.t);
    var dayTxt = sameDay(d, new Date(T0)) ? "" : day(d) + ", ";
    return '<li class="ev" data-t="' + e.t + '">' +
      '<span class="ev-dot" aria-hidden="true"></span>' +
      '<div class="ev-main">' +
        '<div class="ev-head"><span class="ev-name">' + esc(e.nome) + '</span><span class="ev-now">In corso</span></div>' +
        '<div class="ev-time"><span class="ev-t">' + tLabel(e.t) + '</span><span class="ev-rome">' + esc(dayTxt) + when(e.t, true) + '</span></div>' +
        '<p class="ev-desc">' + esc(e.desc) + '</p>' +
      '</div></li>';
  }

  function ticks(list, end) {
    var keys = { booster: ["meco", "bb_start", "b_land"], ship: ["hotstage", "oib_end", "pl_end", "deorbit_start", "entry"] };
    return list.filter(function (e) { return e.t > 0 && e.t < end && (keys.booster.concat(keys.ship).indexOf(e.id) >= 0); })
      .map(function (e) { return '<i class="tick" style="left:' + (e.t / end * 100).toFixed(3) + '%" title="' + esc(e.nome) + '"></i>'; }).join("");
  }

  function vehicleCard(kind) {
    var isB = kind === "booster";
    var list = isB ? BOOST : SHIP;
    var end = isB ? BOOST_CATCH_T : CATCH_T;
    return '<article class="vcard ' + (isB ? "acc-booster" : "acc-ship") + '" id="v-' + kind + '">' +
      '<div class="vrender" id="r-' + kind + '"><div class="vrender-art"></div>' +
        '<span class="vstate" id="s-' + kind + '">Sulla rampa</span>' +
        '<span class="vtag">' + (isB ? "Booster " + esc(D.booster) : "Ship " + esc(D.ship.replace(/^S/, ""))) + '</span>' +
      '</div>' +
      '<div class="vbody">' +
        '<div class="vtitle"><h2>' + (isB ? "Super Heavy" : "Starship") + ' <small>' + (isB ? esc(D.booster) + " · V3" : esc(D.ship) + " · V3") + '</small></h2>' +
        '<p class="vsub">' + (isB
          ? "Salita, separazione, boostback e ritorno alla torre per la cattura: il primo tentativo con un booster V3."
          : "Orbita a ~275 km, rilascio di 26 Starlink V3, circa 14 orbite e ritorno a Starbase per la cattura.") + '</p></div>' +
        '<div class="vprog"><div class="vbar"><i id="b-' + kind + '"></i>' + ticks(list, end) + '</div>' +
          '<div class="vprog-txt"><span id="p-' + kind + '">0%</span><span id="n-' + kind + '"></span></div></div>' +
        '<ol class="tl" id="tl-' + kind + '">' + list.map(function (e) { return evItem(e, kind); }).join("") + '</ol>' +
      '</div></article>';
  }

  function cdPanel(id, label, cls) {
    return '<div class="cd ' + cls + '" id="cd-' + id + '">' +
      '<p class="cd-label" id="cdl-' + id + '">' + esc(label) + '</p>' +
      '<div class="cd-digits" id="cdd-' + id + '" aria-live="off"></div>' +
      '<p class="cd-when" id="cdw-' + id + '"></p></div>';
  }

  function render() {
    var t0 = new Date(T0), tEnd = new Date(T0 + D.finestra_min * 60000), faa = D.faa_fine_utc ? new Date(D.faa_fine_utc) : null;
    var bk = D.riserva_utc ? new Date(D.riserva_utc) : null;
    var sim = simActive ? '<p class="sim">Simulazione attiva: orologio spostato (' + esc(simSpec || "") + (speed !== 1 ? " · velocità ×" + speed : "") + '). <a href="./">Torna all\'ora reale</a></p>' : "";
    app.innerHTML =
      '<section class="pv-hero acc-pv">' + sim +
        '<p class="kicker"><span class="live-dot" aria-hidden="true"></span>Prossimo volo · Starbase</p>' +
        '<h1>' + esc(D.volo) + ' <span class="h1-veh">' + esc(D.booster) + ' + ' + esc(D.ship) + '</span></h1>' +
        '<p class="vp-lead">' + esc(D.obiettivo) + '</p>' +
        '<p class="pv-status"><span class="badge t-accent">' + esc(D.stato) + ' ' + esc(day(t0)) + '</span><span>' + esc(D.stato_testo) + '</span></p>' +
      '</section>' +
      '<section class="cd-grid" aria-label="Conti alla rovescia">' +
        cdPanel("launch", "Decollo tra", "cd-launch") + cdPanel("catch", "Cattura di Ship 42 tra", "cd-catch") +
      '</section>' +
      '<p class="pv-note"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 8h.01M11 12h1v5h1"/></svg><span>' +
        'Gli orari presuppongono il decollo all\'apertura della finestra: <b>' + esc(day(t0)) + ', ' + fmtHM.format(t0) + '–' + fmtHM.format(tEnd) + '</b> (' + D.finestra_min + ' minuti, SpaceX)' +
        (faa ? '; l\'avviso FAA arriva fino alle ' + fmtHM.format(faa) : '') +
        (bk ? '. Data di riserva: <b>' + esc(day(bk)) + ', ' + fmtHM.format(bk) + '</b>' : '') +
        '. Diretta su X di @SpaceX circa ' + D.diretta_min_prima + ' minuti prima (' + fmtHM.format(new Date(T0 - D.diretta_min_prima * 60000)) + ').</span></p>' +
      '<section class="veh-grid">' + vehicleCard("booster") + vehicleCard("ship") + '</section>' +
      '<section class="card pre-card acc-pv"><div class="sec-head"><h3>Conto alla rovescia a terra</h3><p class="sub">Le operazioni prima del decollo, dalla timeline ufficiale.</p></div>' +
        '<ol class="pre-list" id="tl-pre">' + PRE.map(function (e) {
          return '<li class="ev" data-t="' + e.t + '"><span class="ev-dot" aria-hidden="true"></span><div><span class="ev-t">' + tLabel(e.t) + '</span> <span class="ev-rome">' + when(e.t, false) + '</span><p class="ev-name">' + esc(e.nome) + '</p><p class="ev-desc">' + esc(e.desc) + '</p></div></li>';
        }).join("") + '</ol></section>' +
      '<section class="pv-src"><span>Fonti:</span>' + (D.fonti || []).map(function (f) { return '<a href="' + esc(f.url) + '" target="_blank" rel="noopener">' + esc(f.nome) + '</a>'; }).join("") + '</section>';

    document.getElementById("updated").innerHTML = "Aggiornato: <strong>" + esc(D.aggiornato) + "</strong>";
    ["launch", "catch"].forEach(function (k) {
      els[k] = { box: document.getElementById("cd-" + k), l: document.getElementById("cdl-" + k), d: document.getElementById("cdd-" + k), w: document.getElementById("cdw-" + k) };
    });
    els.clock = document.getElementById("clock");
    ["booster", "ship"].forEach(function (k) {
      els[k] = { r: document.getElementById("r-" + k), s: document.getElementById("s-" + k), b: document.getElementById("b-" + k), p: document.getElementById("p-" + k), n: document.getElementById("n-" + k), items: [].slice.call(document.querySelectorAll("#tl-" + k + " .ev")) };
    });
    els.pre = [].slice.call(document.querySelectorAll("#tl-pre .ev"));

    svgInline("assets/super-heavy-v3.svg").then(function (s) { els.booster.r.querySelector(".vrender-art").innerHTML = s; });
    svgInline("assets/ship-v3.svg").then(function (s) { els.ship.r.querySelector(".vrender-art").innerHTML = s; });
  }

  function digits(sec, sign) {
    sec = Math.max(0, Math.floor(sec));
    var d = Math.floor(sec / 86400), h = Math.floor(sec / 3600) % 24, m = Math.floor(sec / 60) % 60, s = sec % 60;
    var parts = [];
    if (d) parts.push([d, d === 1 ? "giorno" : "giorni"]);
    parts.push([pad(h), "ore"], [pad(m), "min"], [pad(s), "sec"]);
    return '<span class="cd-sign">' + sign + '</span>' + parts.map(function (p) {
      return '<span class="cd-u"><b>' + p[0] + '</b><small>' + p[1] + '</small></span>';
    }).join('<span class="cd-sep">:</span>');
  }

  function inRanges(t, ranges) {
    return (ranges || []).some(function (r) { return t >= r[0] && t < r[1]; });
  }

  function setOnce(el, key, html) {
    if (lastState[key] === html) return;
    lastState[key] = html;
    el.innerHTML = html;
  }

  function updateList(items, t, final) {
    var cur = -1;
    items.forEach(function (li, i) { if (t >= +li.dataset.t) cur = i; });
    items.forEach(function (li, i) {
      var st = i < cur ? "done" : i === cur ? (i === items.length - 1 && final ? "done" : "cur") : "next";
      if (i === cur + 1 && t >= (final ? -Infinity : -Infinity)) st = st === "next" ? "next soon" : st;
      if (li.className !== "ev " + st) li.className = "ev " + st;
    });
    return cur;
  }

  function vehState(kind, t, cur, list) {
    var last = list[list.length - 1].t;
    if (t < 0) return "Sulla rampa";
    if (t >= last) return "Sulla torre · previsto";
    if (kind === "booster") {
      if (t < 139) return "Salita";
      if (t < 146) return "Separazione";
      if (inRanges(t, D.accensioni.booster)) return "Motori accesi";
      return "Ritorno verso la torre";
    }
    if (inRanges(t, D.accensioni.ship)) return "Motori accesi";
    if (D.rientro && t >= D.rientro[0] && t < D.rientro[1]) return "Rientro";
    var oib = EV.filter(function (e) { return e.id === "oib_end"; })[0];
    var entry = EV.filter(function (e) { return e.id === "entry"; })[0];
    if (oib && entry && t >= oib.t && t < entry.t) return "In orbita";
    return "In volo";
  }

  function updateVehicle(kind, t) {
    var list = kind === "booster" ? BOOST : SHIP, e = els[kind];
    var last = list[list.length - 1].t;
    var cur = updateList(e.items, t, true);
    var frac = Math.min(1, Math.max(0, t / last));
    e.b.style.width = (frac * 100).toFixed(2) + "%";
    e.p.textContent = t < 0 ? "In attesa del decollo" : t >= last ? "Timeline completata" : (cur >= 0 ? list[cur].nome : "");
    var nxt = list[cur + 1];
    e.n.textContent = nxt ? "Prossimo: " + nxt.nome + " tra " + dur(nxt.t - t) : "Ultimo evento: " + tLabel(last);
    var stTxt = vehState(kind, t, cur, list);
    if (e.s.textContent !== stTxt) e.s.textContent = stTxt;
    e.r.classList.toggle("burning", t >= 0 && inRanges(t, D.accensioni[kind]));
    e.r.classList.toggle("reentry", kind === "ship" && D.rientro && t >= D.rientro[0] && t < D.rientro[1]);
    e.r.classList.toggle("flying", t >= 0 && t < last);
    e.r.classList.toggle("landed", t >= last);
  }

  function tick() {
    var n = now(), t = (n - T0) / 1000;
    els.clock.innerHTML = "Ora di Roma: <strong>" + fmtHMS.format(new Date(n)) + "</strong>";

    // Decollo
    var L = els.launch;
    if (t < 0) {
      L.l.textContent = "Decollo tra";
      setOnce(L.d, "ld", digits(-t, "T−"));
      L.w.textContent = day(new Date(T0)) + " · " + fmtHM.format(new Date(T0)) + " ora di Roma";
    } else if (t < CATCH_T) {
      L.l.textContent = "Tempo di volo";
      setOnce(L.d, "ld", digits(t, "T+"));
      L.w.textContent = "Decollo previsto alle " + fmtHM.format(new Date(T0)) + " di " + day(new Date(T0));
    } else {
      L.l.textContent = "Durata prevista del volo";
      setOnce(L.d, "ld", digits(CATCH_T, "T+"));
      L.w.textContent = "Dal decollo (" + day(new Date(T0)) + ", " + fmtHM.format(new Date(T0)) + ") alla cattura della Ship";
    }
    L.box.classList.toggle("is-live", t >= 0 && t < CATCH_T);

    // Cattura della Ship
    var C = els.catch, ct = CATCH_T - t, cd = rome(CATCH_T);
    if (ct > 0) {
      C.l.textContent = "Cattura di Ship 42 tra";
      setOnce(C.d, "cd", digits(ct, "T−"));
    } else {
      C.l.textContent = "Cattura di Ship 42";
      setOnce(C.d, "cd", '<span class="cd-done">Orario previsto raggiunto</span>');
    }
    C.w.textContent = day(cd) + " · " + fmtHMS.format(cd) + " ora di Roma (" + tLabel(CATCH_T) + ")";

    updateVehicle("booster", t);
    updateVehicle("ship", t);
    updateList(els.pre, t, true);
    if (t >= 0) els.pre.forEach(function (li) { if (li.className !== "ev done") li.className = "ev done"; });
  }

  fetch("../data/volo-prossimo.json", { cache: "no-cache" }).then(function (r) { return r.json(); }).then(function (data) {
    D = data;
    T0 = Date.parse(D.decollo_utc);
    EV = D.eventi.slice().sort(function (a, b) { return a.t - b.t; });
    PRE = EV.filter(function (e) { return e.v === "pre"; });
    BOOST = EV.filter(function (e) { return e.v === "booster" || e.v === "both"; });
    SHIP = EV.filter(function (e) { return e.v === "ship" || e.v === "both"; });
    CATCH_T = (EV.filter(function (e) { return e.id === "s_catch"; })[0] || SHIP[SHIP.length - 1]).t;
    BOOST_CATCH_T = (EV.filter(function (e) { return e.id === "b_catch"; })[0] || BOOST[BOOST.length - 1]).t;
    if (simSpec) {
      var rel = parseRel(simSpec), target = rel != null ? T0 + rel * 1000 : Date.parse(simSpec);
      if (!isNaN(target)) simOffset = target - realStart;
    }
    render();
    tick();
    setInterval(tick, 250);
  }).catch(function () {
    app.innerHTML = '<p class="card">Non riesco a caricare i dati del volo. Riprova tra poco.</p>';
  });
})();
