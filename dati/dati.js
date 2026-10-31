/* Dati SpaceX: pagina generata da ../data/spacex.json (nessun framework).
   Grafici e tabelle sono descritti da due liste di configurazione (CHARTS, TABLES):
   per aggiungerne uno basta aggiungere una voce. */
(function () {
  "use strict";

  // ---------- Icone (stile Lucide, licenza ISC) ----------
  var P = {
    lanci: '<path d="M3 21c5.5-1 10.5-5.5 14-13" stroke-dasharray="2.5 3"/><path d="M13.5 5.5 19 4l-1 5.6"/><circle cx="4" cy="20" r="1.6"/>',
    starlink: '<path d="M13 7 9 3 5 7l4 4"/><path d="m17 11 4 4-4 4-4-4"/><path d="m8 12 4 4 6-6-4-4Z"/><path d="m16 8 3-3"/><path d="M9 21a6 6 0 0 0-6-6"/>',
    booster: '<path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>',
    dragon: '<path d="M12 2c-3 3-5 7-5 12h10c0-5-2-9-5-12Z"/><path d="M7 14 4 18h16l-3-4"/><circle cx="12" cy="9" r="1.6"/><path d="M10 21h4"/>',
    archivio: '<rect width="20" height="5" x="2" y="3" rx="1"/><path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8"/><path d="M10 12h4"/>',
    chart: '<path d="M3 3v16a2 2 0 0 0 2 2h16"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/>',
    chevronR: '<path d="m9 18 6-6-6-6"/>',
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
    recycle: '<path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 16h5v5"/>',
    calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h18"/>',
    target: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
    info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>',
    table: '<path d="M12 3v18"/><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M3 15h18"/>'
  };
  function svg(name, size) {
    var s = size || 20;
    return '<svg width="' + s + '" height="' + s + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (P[name] || "") + "</svg>";
  }
  function ico(name, extra) { return '<span class="ico ' + (extra || "") + '">' + svg(name) + "</span>"; }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function $(id) { return document.getElementById(id); }

  // ---------- Formati (italiano; gli orari nel file sono già ora di Roma) ----------
  var NF = new Intl.NumberFormat("it-IT");
  var MESI = ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"];
  var MESI_B = ["gen", "feb", "mar", "apr", "mag", "giu", "lug", "ago", "set", "ott", "nov", "dic"];
  function nf(v) { return v == null || v === "" ? "—" : (typeof v === "number" ? NF.format(v) : esc(v)); }
  function parseISO(s) { return /^(\d{4})-(\d{2})-(\d{2})(?:T(\d{2}):(\d{2}))?/.exec(s || ""); }
  function fData(s) {
    var m = parseISO(s); if (!m) return s ? esc(s) : "—";
    return m[3] + "/" + m[2] + "/" + m[1] + (m[4] ? " " + m[4] + ":" + m[5] : "");
  }
  function fDataLunga(s) {
    var m = parseISO(s); if (!m) return s || "";
    return (+m[3]) + " " + MESI[+m[2] - 1].toLowerCase() + " " + m[1];
  }
  function fMln(v) { return v == null ? "—" : v >= 1e6 ? new Intl.NumberFormat("it-IT", { maximumFractionDigits: 1 }).format(v / 1e6) + " mln" : NF.format(v); }
  function abbOk() { return D.starlink.abbonati.filter(function (x) { return !x.daVerificare; }); }
  function abbQuando(x) { return x.dataEsatta ? "al " + fData(x.dataEsatta) : fMeseAnno(x.data); }
  function fMeseAnno(s) { var m = parseISO(s); return m ? MESI_B[+m[2] - 1] + " " + m[1] : s; }
  function fDur(sec) {
    if (sec == null) return "—";
    var d = Math.floor(sec / 86400), h = Math.floor(sec % 86400 / 3600), mi = Math.round(sec % 3600 / 60);
    return (d ? d + "g " : "") + h + "h " + (mi < 10 && (d || h) ? "0" : "") + mi + "m";
  }

  // ---------- Colori del sito ----------
  var C = { lanci: "#a78bfa", prototipi: "#38bdf8", test: "#fb7a3c", siti: "#f5b544", prossimo: "#34d399", notizie: "#f472b6", info: "#60a5fa", neutral: "#94a3b8", bad: "#f87171", warn: "#fbbf24" };
  var PALETTE = [C.lanci, C.prototipi, C.siti, C.test, C.prossimo, C.notizie, C.info, C.warn, C.neutral, C.bad];
  var TIPO_COL = { "Starlink": C.prossimo, "Commerciale": C.prototipi, "Space Force & NRO": C.siti, "SpaceForce & NRO": C.siti, "Rideshare": C.notizie, "Transporter": C.notizie, "Starlink Rideshare": "#6ee7b7", "Starlink rideshare": "#6ee7b7", "Enti terzi": C.prototipi, "Dragon": C.info, "NASA": C.warn, "Test Starship": C.test, "Starfall": C.neutral };
  var VETT_COL = { "Falcon 1": C.neutral, "Falcon 9": C.lanci, "F9": C.lanci, "Falcon Heavy": C.siti, "FH": C.siti, "Starship": C.test, "Atlas V": C.info, "Ariane 64": C.notizie };
  function colFor(map, label, i) { return map[label] || PALETTE[i % PALETTE.length]; }
  function alpha(hex, a) {
    var n = parseInt(hex.slice(1), 16);
    return "rgba(" + (n >> 16) + "," + (n >> 8 & 255) + "," + (n & 255) + "," + a + ")";
  }

  var TABS = [
    { id: "lanci", label: "Lanci", acc: "lanci", icon: "lanci", sub: "Tutti i lanci SpaceX: tipologie, mesi, anni, pad e atterraggi." },
    { id: "starlink", label: "Starlink", acc: "prossimo", icon: "starlink", sub: "Satelliti lanciati, missioni, gusci orbitali e abbonati." },
    { id: "falcon9", label: "Falcon 9 booster", acc: "test", icon: "booster", sub: "Voli per booster, riutilizzo e booster persi." },
    { id: "dragon", label: "Dragon", acc: "prototipi", icon: "dragon", sub: "Capsule equipaggio e cargo, missioni ed equipaggi." },
    { id: "archivio", label: "Archivio", acc: "siti", icon: "archivio", sub: "Kuiper, lanci per anno dal 2006, rideshare, registro modifiche e note sui dati." }
  ];

  var D = null;

  // ---------- Dati derivati ----------
  function anniLanci() { return Object.keys(D.lanci).map(Number).sort(function (a, b) { return b - a; }); }
  function riep(y) { return D.riepiloghi[String(y)] || {}; }
  function anniCon(key) { return anniLanci().filter(function (y) { var r = riep(y)[key]; return r && r.length; }); }
  function sum(arr, f) { return arr.reduce(function (s, x) { var v = f ? f(x) : x; return s + (typeof v === "number" ? v : 0); }, 0); }
  var RUOLO = { core: "FH core centrale", laterale: "FH laterale", ex: "Ex FH", fh: "FH" };
  var RUOLO_BREVE = { core: " (FH core)", laterale: " (FH lat.)", ex: " (ex FH)", fh: " (FH)" };
  // Colori dei luoghi di atterraggio (stessi in tutti i grafici)
  var ATT = [
    { k: "OCISLY", l: "OCISLY – Of Course I Still Love You", c: "#38bdf8" },
    { k: "JRTI", l: "JRTI – Just Read the Instructions", c: "#a78bfa" },
    { k: "ASOG", l: "ASOG – A Shortfall of Gravitas", c: "#2dd4bf" },
    { k: "LZ-1", l: "LZ-1", c: "#fef08a" },
    { k: "LZ-2", l: "LZ-2", c: "#facc15" },
    { k: "LZ-4", l: "LZ-4", c: "#f59e0b" },
    { k: "LZ-40", l: "LZ-40", c: "#c2700a" },
    { k: "Mechazilla", l: "Mechazilla (torre)", c: "#fb7a3c" },
    { k: "NO", l: "Expended / non recuperato", c: "#f472b6" },
    { k: "Fallito", l: "Atterraggio fallito", c: "#ef4444" },
    { k: "__ignoto", l: "Sconosciuto / prima del 2021", c: "#475569" }
  ];
  function attKey(raw) { if (!raw || raw === "__ignoto") return "__ignoto"; return /fallit/i.test(raw) ? "Fallito" : raw.trim(); }
  function attInfo(raw) {
    var k = attKey(raw);
    for (var i = 0; i < ATT.length; i++) if (ATT[i].k === k) return ATT[i];
    return { k: k, l: k, c: C.neutral };
  }
  function attBreve(m) {
    var ord = ATT.map(function (a) { return a.k; }), agg = {};
    Object.keys(m || {}).forEach(function (r) { var k = attKey(r); agg[k] = (agg[k] || 0) + m[r]; });
    return Object.keys(agg).sort(function (a, b) { return (ord.indexOf(a) + 1 || 99) - (ord.indexOf(b) + 1 || 99); })
      .map(function (k) { return (k === "__ignoto" ? "Sconosciuto" : k === "NO" ? "Non recup." : k) + " " + agg[k]; }).join(" · ");
  }
  function boosters() {
    var q = {};
    (D.f9Utilizzati2026 || []).forEach(function (b) { q[b.booster] = b; });
    function map(b, stato) {
      var x = q[b.booster] || {};
      var fr = b.fhRuolo || (/laterale FH/i.test(x.note || "") ? "laterale" : /core centrale FH/i.test(x.note || "") ? "core" : null);
      var last = b.voli[b.voli.length - 1] || {}, first = b.voli[0] || {};
      return { booster: b.booster, nome: b.nome, stato: stato, fh: b.fh, fhRuolo: fr, ruolo: RUOLO[fr] || null, voli: b.nVoli, perAnno: x.perAnno || {}, note: x.note || null, statoFile: x.stato || null,
               primo: first.data, primoM: first.missione, ultimo: last.data, ultimoM: last.missione, lista: b.voli,
               atterraggi: b.atterraggi || {}, attTesto: attBreve(b.atterraggi) };
    }
    return D.falcon9.attivi.map(function (b) { return map(b, "Attivo"); })
      .concat(D.falcon9.persi.map(function (b) { return map(b, "Perso / non recuperato"); }));
  }
  function dragonMissioni() {
    var out = [];
    D.dragon.capsule.forEach(function (c) {
      c.missioni.forEach(function (m) {
        out.push({ capsula: c.nome + (c.codice && c.nome.indexOf(c.codice) < 0 ? " (" + c.codice + ")" : ""), tipo: c.tipo === "cargo" ? "Cargo" : "Equipaggio",
                   missione: m.missione, partenza: m.partenza, rientro: m.rientro, durata: m.durata, turnaround: m.turnaround, caricoKg: m.caricoKg });
      });
    });
    return out;
  }

  // ---------- Configurazione grafici ----------
  // Ogni voce: id, tab, titolo, sub, years (opzionale: anni selezionabili), wide, build(y) -> {type, labels, datasets, opts, nota}
  var CHARTS = [
    { id: "tipologie", tab: "lanci", title: "Tipologie di missione", years: function () { return anniCon("tipologie"); },
      build: function (y) {
        var t = riep(y).tipologie;
        return { type: "doughnut", labels: t.map(function (x) { return x.label; }),
          datasets: [{ data: t.map(function (x) { return x.valore; }), backgroundColor: t.map(function (x, i) { return colFor(TIPO_COL, x.label, i); }), borderColor: "#121a2e", borderWidth: 2 }],
          nota: "Totale " + y + ": " + nf(sum(t, function (x) { return x.valore; })) + " lanci." };
      } },
    { id: "mesi", tab: "lanci", title: "Lanci per mese", years: function () { return anniCon("perMese"); },
      build: function (y) {
        var t = riep(y).perMese;
        return { type: "bar", labels: t.map(function (x) { return x.label.slice(0, 3); }),
          datasets: [{ label: "Lanci " + y, data: t.map(function (x) { return x.valore; }), backgroundColor: alpha(C.lanci, .75), borderColor: C.lanci, borderWidth: 1, borderRadius: 6 }],
          opts: { plugins: { legend: { display: false } } } };
      } },
    { id: "anni", tab: "lanci", title: "Lanci per anno, 2021–2026", sub: "Per vettore", wide: true,
      build: function () {
        var v = D.vettori, anni = v.anni.filter(function (a) { return a.anno >= 2021; });
        var nomi = v.vettori.filter(function (n) { return anni.some(function (a) { return a[n]; }); });
        return { type: "bar", labels: anni.map(function (a) { return String(a.anno); }),
          datasets: nomi.map(function (n, i) { return { label: n, data: anni.map(function (a) { return a[n] || 0; }), backgroundColor: colFor(VETT_COL, n, i), borderRadius: 4 }; }),
          opts: { scales: { x: { stacked: true }, y: { stacked: true } }, plugins: { tooltip: { mode: "index", callbacks: { footer: function (it) { return "Totale: " + NF.format(sum(it, function (x) { return x.raw; })); } } } } },
          nota: "Dalla tabella «Vettori» del foglio Lanci 2026." };
      } },
    { id: "pad", tab: "lanci", title: "Lanci per pad di lancio", years: function () { return anniCon("pad"); },
      build: function (y) {
        var t = riep(y).pad;
        return { type: "bar", labels: t.map(function (x) { return x.label; }),
          datasets: [{ label: "Lanci", data: t.map(function (x) { return x.valore; }), backgroundColor: t.map(function (x, i) { return PALETTE[i % PALETTE.length]; }), borderRadius: 6 }],
          opts: { plugins: { legend: { display: false } } },
          nota: riep(y).contatiDallaLista ? "Il file non ha un riepilogo dei pad per il " + y + ": conteggio della colonna «Pad» della lista lanci." : "" };
      } },
    { id: "atterraggi", tab: "lanci", title: "Atterraggi per piattaforma", years: function () { return anniCon("atterraggi"); },
      build: function (y) {
        var r = riep(y), t = r.atterraggi, tot = r.atterraggiTotali || {};
            var note = [];
        if (tot.Mare != null) note.push("in mare " + nf(tot.Mare));
        if (tot.Terra != null) note.push("a terra " + nf(tot.Terra));
        if (tot["Non recuperati"] != null) note.push("non recuperati " + nf(tot["Non recuperati"]));
        if (tot.Fallimenti) note.push("atterraggi falliti " + nf(tot.Fallimenti));
        if (tot["Tot booster"] != null) note.push("booster volati " + nf(tot["Tot booster"]));
        return { type: "bar", labels: t.map(function (x) { return x.label; }),
          datasets: [{ label: "Atterraggi", data: t.map(function (x) { return x.valore; }), backgroundColor: t.map(function (x) { return attInfo(x.label).c; }), borderRadius: 6 }],
          opts: { plugins: { legend: { display: false } } },
          nota: "Stessi colori del grafico dei booster: azzurro/viola/verde acqua le tre navi drone (OCISLY, JRTI, ASOG), toni di giallo-ambra le zone LZ a terra, arancio Mechazilla, rosso gli atterraggi falliti" + (note.length ? ". " + y + ": " + note.join(", ") + "." : ".") +
            (r.atterraggiNota ? " Nota del file: " + r.atterraggiNota.replace(/^./, function (c) { return c.toUpperCase(); }).replace(/\.\s*$/, "") + "." : "") +
            (r.contatiDallaLista ? " Il file non ha un riepilogo degli atterraggi per il " + y + ": conteggio della colonna «Atterraggio» della lista lanci." : "") };
      } },

    { id: "abbonati", tab: "starlink", title: "Abbonati Starlink nel tempo", sub: "Solo le rilevazioni presenti nel file", wide: true,
      build: function () {
        var all = D.starlink.abbonati, a = abbOk(), esclusi = all.filter(function (x) { return x.daVerificare; });
        var pts = a.map(function (x) { var m = parseISO(x.data); return { x: Date.UTC(+m[1], +m[2] - 1, +m[3]), y: x.abbonati, r: x }; });
        var nota = a.length + " rilevazioni a intervalli irregolari, da " + fMeseAnno(a[0].data) + " al " + (a[a.length - 1].dataEsatta ? fData(a[a.length - 1].dataEsatta) : fMeseAnno(a[a.length - 1].data)) + " (ultimo dato nel file). Nessun punto è stimato.";
        if (!esclusi.length && D.starlink.abbonatiNota) nota += " Nota del file: " + D.starlink.abbonatiNota;
        if (esclusi.length) nota += " Escluso dal grafico: " + esclusi.map(function (x) { return NF.format(x.abbonati) + " (" + fMeseAnno(x.data) + ")"; }).join(", ") + ", segnalato nel file come «Da verificare»" + (esclusi[0].nota ? " (" + esclusi[0].nota.replace(/^da verificare:\s*/i, "") + ")" : "") + ".";
        return { type: "line", datasets: [{ label: "Abbonati", data: pts, borderColor: C.prossimo, backgroundColor: alpha(C.prossimo, .15), fill: true, tension: .25, pointRadius: 4, pointHoverRadius: 6 }],
          opts: { parsing: false, plugins: { legend: { display: false }, tooltip: { callbacks: { title: function (it) { return abbQuando(it[0].raw.r); }, label: function (it) { return NF.format(it.raw.y) + " abbonati"; }, afterLabel: function (it) { return it.raw.r.nota || ""; } } } },
            scales: { x: { type: "linear", ticks: { maxTicksLimit: 8, callback: function (v) { var d = new Date(v); return MESI_B[d.getUTCMonth()] + " " + d.getUTCFullYear(); } } },
                      y: { beginAtZero: true, ticks: { callback: function (v) { return v >= 1e6 ? NF.format(v / 1e6) + " mln" : NF.format(v); } } } } },
          nota: nota };
      } },
    { id: "satAnno", tab: "starlink", title: "Satelliti Starlink lanciati per anno", sub: "2019–2026",
      build: function () {
        var t = D.starlink.satelliti.perAnno;
        return { type: "bar", labels: t.map(function (x) { return String(x.anno); }),
          datasets: [{ label: "Satelliti", data: t.map(function (x) { return x.valore; }), backgroundColor: alpha(C.prossimo, .75), borderColor: C.prossimo, borderWidth: 1, borderRadius: 6 }],
          opts: { plugins: { legend: { display: false } } },
          nota: "Totale: " + nf(D.starlink.satelliti.totale) + " satelliti (GEN1 " + nf(D.starlink.satelliti.totaleGen1) + ", GEN2 " + nf(D.starlink.satelliti.totaleGen2) + ")." };
      } },
    { id: "satMese", tab: "starlink", title: "Satelliti Starlink per mese", years: function () { return D.starlink.satelliti.anni.slice().sort(function (a, b) { return b - a; }); },
      build: function (y) {
        var t = D.starlink.satelliti.perMese;
        return { type: "bar", labels: t.map(function (x) { return x.mese.slice(0, 3); }),
          datasets: [{ label: "Satelliti " + y, data: t.map(function (x) { return x[String(y)]; }), backgroundColor: alpha(C.prossimo, .65), borderRadius: 5 }],
          opts: { plugins: { legend: { display: false } } } };
      } },
    { id: "missStarlink", tab: "starlink", title: "Missioni Starlink per anno", sub: function () { var t = D.starlink.missioni.perAnno; return t.length ? t[0].anno + "–" + t[t.length - 1].anno : ""; },
      build: function () {
        var t = D.starlink.missioni.perAnno, ts = D.starlink.missioni.perAnnoConStarship || [], ss = {};
        ts.forEach(function (x) { ss[x.anno] = x.valore; });
        var extra = t.map(function (x) { var v = ss[x.anno]; return v != null && x.valore != null && v > x.valore ? v - x.valore : null; });
        var ds = [{ label: "Falcon 9", data: t.map(function (x) { return x.valore; }), backgroundColor: alpha(C.lanci, .75), borderRadius: 6 }];
        var conS = extra.some(function (v) { return v; });
        if (conS) ds.push({ label: "Starship", data: extra, backgroundColor: C.test, borderRadius: 6 });
        var note = t.filter(function (x, i) { return extra[i]; }).map(function (x) { return x.anno + ": " + nf(x.valore) + " con Falcon 9, " + nf(ss[x.anno]) + " contando anche Starship"; });
        return { type: "bar", labels: t.map(function (x) { return String(x.anno); }), datasets: ds,
          opts: { scales: { x: { stacked: true }, y: { stacked: true } }, plugins: { legend: { display: conS } } },
          nota: note.length ? note.join("; ") + " (righe «Totale Falcon 9» e «Totale Falcon 9 + Starship»)." : "" };
      } },

    { id: "booster", tab: "falcon9", title: "Riutilizzo booster Falcon 9: voli e atterraggi per booster", sub: "Ordinati per numero di voli · colori = luogo di atterraggio", wide: true, tall: true,
      build: function () {
        var b = boosters().slice().sort(function (a, c) { return c.voli - a.voli || a.booster.localeCompare(c.booster); });
        var lab = b.map(function (x) { return x.booster + (x.stato === "Attivo" ? "" : " ✕") + (RUOLO_BREVE[x.fhRuolo] || (x.fh ? " (FH)" : "")); });
        var agg = b.map(function (x) { var o = {}; Object.keys(x.atterraggi).forEach(function (r) { var k = attKey(r); o[k] = (o[k] || 0) + x.atterraggi[r]; }); return o; });
        var chiavi = {};
        agg.forEach(function (o) { Object.keys(o).forEach(function (k) { chiavi[k] = 1; }); });
        var ord = ATT.map(function (a) { return a.k; });
        var ks = Object.keys(chiavi).sort(function (a, c) { return (ord.indexOf(a) + 1 || 99) - (ord.indexOf(c) + 1 || 99); });
        var ds = ks.map(function (k) { var a = attInfo(k);
          return { label: a.l, data: agg.map(function (o) { return o[k] || null; }), backgroundColor: a.c, borderWidth: 0, barThickness: 12, stack: "v" }; });
        var mobile = window.matchMedia("(max-width: 640px)").matches;
        var ign = sum(agg, function (o) { return o.__ignoto || 0; }), tot = sum(b, function (x) { return x.voli; });
        var pre = sum(b, function (x) { return x.lista.filter(function (v) { return v.data && v.data < "2021"; }).length; });
        return { type: "bar", labels: lab, height: Math.max(360, b.length * (mobile ? 19 : 17) + (mobile ? 230 : 110)), datasets: ds,
          opts: { indexAxis: "y", scales: { y: { stacked: true, ticks: { autoSkip: false, font: { size: 11 } } }, x: { stacked: true, position: "top", beginAtZero: true } },
            plugins: { legend: { labels: { padding: mobile ? 8 : 12, font: { size: mobile ? 11 : 12 } } },
              tooltip: { filter: function (it) { return it.raw; }, callbacks: {
                title: function (it) { var x = b[it[0].dataIndex]; return x.booster + " · " + x.stato + (x.ruolo ? " · " + x.ruolo : "") + " · " + x.voli + " voli"; },
                label: function (it) { return it.dataset.label + ": " + it.raw + (it.raw === 1 ? " volo" : " voli"); } } } } },
          nota: b.filter(function (x) { return x.stato === "Attivo"; }).length + " booster attivi e " + b.filter(function (x) { return x.stato !== "Attivo"; }).length +
            " persi o non recuperati (✕), dal foglio Falcon 9. FH core = core centrale Falcon Heavy, FH lat. = booster laterale. Atterraggi presi dalle liste dei lanci 2021–2026 abbinando booster e missione: " +
            nf(tot - ign) + " voli su " + nf(tot) + " hanno l'atterraggio; " + nf(ign) + " sono «Sconosciuto» (" + (ign === pre ? "tutti voli prima del 2021: le liste dei lanci del file partono dal 2021" :
            nf(pre) + " prima del 2021, " + nf(ign - pre) + " dal 2021 senza un atterraggio attribuibile a quel booster nelle liste: vedi «Note sui dati» nell'archivio") + "). Booster laterali Falcon Heavy dalle sotto-righe ↳ delle liste." };
      } },

    { id: "dragonUso", tab: "dragon", title: "Missioni per capsula Dragon",
      build: function () {
        var caps = D.dragon.capsule;
        return { type: "bar", labels: caps.map(function (c) { return c.tipo === "cargo" ? c.codice : c.nome; }),
          datasets: [{ label: "Missioni", data: caps.map(function (c) { return c.missioni.length; }), backgroundColor: caps.map(function (c) { return c.tipo === "cargo" ? C.siti : C.prototipi; }), borderRadius: 6 }],
          opts: { plugins: { legend: { display: false } } },
          nota: "Azzurro: capsule equipaggio · giallo: capsule cargo. Conteggio delle righe nelle tabelle del foglio Dragon." };
      } },
    { id: "dragonCargo", tab: "dragon", title: "Carico portato in orbita dalle missioni cargo", sub: "kg per missione, dove indicato",
      build: function () {
        var m = dragonMissioni().filter(function (x) { return x.tipo === "Cargo" && x.caricoKg != null; }).sort(function (a, b) { return (a.partenza || "").localeCompare(b.partenza || ""); });
        return { type: "bar", labels: m.map(function (x) { return x.missione; }),
          datasets: [{ label: "Carico (kg)", data: m.map(function (x) { return x.caricoKg; }), backgroundColor: alpha(C.siti, .75), borderRadius: 5 }],
          opts: { plugins: { legend: { display: false } } },
          nota: "Le missioni senza carico indicato nel file non compaiono." };
      } },

    { id: "kuiper", tab: "archivio", title: "Kuiper: satelliti per lancio", sub: "Colori per vettore", wide: true,
      build: function () {
        var k = D.kuiper.lanci;
        var vett = []; k.forEach(function (x) { if (vett.indexOf(x.vettore) < 0) vett.push(x.vettore); });
        return { type: "bar", labels: k.map(function (x) { return x.missione; }),
          datasets: vett.map(function (v, i) { return { label: v, data: k.map(function (x) { return x.vettore === v ? x.satelliti : null; }), backgroundColor: colFor(VETT_COL, v, i), borderRadius: 5, grouped: false }; }),
          nota: "Totale nel file: " + nf(D.kuiper.totaleSatelliti) + " satelliti in " + k.length + " lanci." };
      } }
  ];

  // ---------- Configurazione tabelle ----------
  // cols: key, label, type (text|num|date|dur|tag), wrap. filters: chiavi con menu a tendina.
  function lanciRows(y) {
    return (D.lanci[String(y)] || []).map(function (x) {
      var m = parseISO(x.partenza);
      var r = Object.assign({}, x, { mese: m ? MESI[+m[2] - 1] : null, _mi: m ? +m[2] : 0 });
      if (x.altriBooster) r.booster = [x.booster].concat(x.altriBooster.map(function (b) { return b.booster; })).join(" + ");
      if (x.altriBooster) r.atterraggio = [x.atterraggio].concat(x.altriBooster.map(function (b) { return b.atterraggio; })).join(" + ");
      if (x.altriAtterraggi) r.atterraggio = [x.atterraggio].concat(x.altriAtterraggi).join(" + ");
      return r;
    });
  }
  var LANCI_COLS = [
    { key: "n", label: "#", type: "num" }, { key: "partenza", label: "Partenza", type: "date" }, { key: "missione", label: "Missione" },
    { key: "tipologia", label: "Tipologia", type: "tag" }, { key: "vettore", label: "Vettore" }, { key: "booster", label: "Booster" },
    { key: "pad", label: "Pad" }, { key: "atterraggio", label: "Atterraggio" }, { key: "orbita", label: "Orbita" },
    { key: "intervallo", label: "Dal lancio prima", type: "dur" }
  ];
  var TABLES = [
    { id: "t-lanci", tab: "lanci", title: "Tutti i lanci", years: function () { return anniLanci(); }, rows: lanciRows, cols: LANCI_COLS,
      filters: ["tipologia", "vettore", "orbita", "pad", "mese"], sort: ["n", -1], open: true,
      note: "Le missioni Falcon Heavy mostrano tutti i booster e i rispettivi atterraggi (laterali inclusi). Pad e atterraggio 2022–2023 dal foglio «Pad & atterragi»." },

    { id: "t-starlink", tab: "starlink", title: "Missioni Starlink: satelliti per missione", years: function () { return Object.keys(D.starlink.liste).map(Number).sort(function (a, b) { return b - a; }); },
      rows: function (y) { return D.starlink.liste[String(y)]; },
      cols: [{ key: "missione", label: "Missione" }, { key: "satelliti", label: "Satelliti", type: "num" }, { key: "dtc", label: "Di cui Direct to Cell", type: "num" }, { key: "massaKg", label: "Massa (kg)", type: "num" }, { key: "mese", label: "Mese", type: "num" }],
      sort: null },
    { id: "t-gusci", tab: "starlink", title: "Gusci orbitali", rows: function () { return D.starlink.gusci; },
      cols: [{ key: "guscio", label: "Guscio" }, { key: "inclinazione", label: "Inclinazione" }, { key: "altitudine", label: "Altitudine" }, { key: "previsti", label: "Previsti", type: "num" }, { key: "lanciati", label: "Lanciati", type: "num" }, { key: "ultimoLancio", label: "Ultimo lancio" }, { key: "nota", label: "Nota", wrap: true }] },
    { id: "t-abbonati", tab: "starlink", title: "Abbonati Starlink", rows: function () { return D.starlink.abbonati; },
      cols: [{ key: "data", label: "Mese", type: "month" }, { key: "abbonati", label: "Abbonati", type: "num" }, { key: "stato", label: "Stato", type: "tag" }, { key: "nota", label: "Fonte / nota", wrap: true }],
      prep: function (r) { r.stato = r.daVerificare ? "Da verificare" : "OK"; return r; }, sort: ["data", -1],
      note: "Le date sono quelle della colonna «Data» del file (mese); la data esatta, quando c'è, è nella nota." },
    { id: "t-satmese", tab: "starlink", title: "Satelliti Starlink per mese e anno", rows: function () { return D.starlink.satelliti.perMese; },
      cols: [{ key: "mese", label: "Mese", nosort: true }].concat(D_ANNI_SAT()), nosearch: true },

    { id: "t-booster", tab: "falcon9", title: "Booster Falcon 9", rows: function () { return boosters(); },
      cols: [{ key: "booster", label: "Booster" }, { key: "stato", label: "Stato", type: "tag" }, { key: "statoFile", label: "Stato (tabella 2026)" }, { key: "ruolo", label: "Ruolo FH" }, { key: "voli", label: "Voli", type: "num" }, { key: "attTesto", label: "Atterraggi" },
             { key: "a2020", label: "2020", type: "num" }, { key: "a2021", label: "2021", type: "num" }, { key: "a2022", label: "2022", type: "num" }, { key: "a2023", label: "2023", type: "num" },
             { key: "a2024", label: "2024", type: "num" }, { key: "a2025", label: "2025", type: "num" }, { key: "a2026", label: "2026", type: "num" },
             { key: "primo", label: "Primo volo", type: "date" }, { key: "ultimoM", label: "Ultima missione" }, { key: "ultimo", label: "Data", type: "date" }, { key: "note", label: "Note" }],
      prep: function (r) { for (var y = 2020; y <= 2026; y++) r["a" + y] = r.perAnno[String(y)]; return r; },
      filters: ["stato", "ruolo"], sort: ["voli", -1], open: true, note: "Voli per anno solo per i booster della tabella «Falcon 9 utilizzati e attivi» (foglio Lanci 2026). Atterraggi: dalle liste dei lanci 2021–2026; «Sconosciuto» = voli prima del 2021 o senza atterraggio attribuibile." },
    { id: "t-voli", tab: "falcon9", title: "Tutti i voli per booster", rows: function () {
        var out = []; boosters().forEach(function (b) { b.lista.forEach(function (v) { out.push({ booster: b.booster, stato: b.stato, n: v.n, missione: v.missione, data: v.data, atterraggio: v.atterraggio || (v.data && v.data < "2021" ? "Sconosciuto (prima del 2021)" : "Sconosciuto") }); }); }); return out;
      }, cols: [{ key: "booster", label: "Booster" }, { key: "n", label: "Volo n.", type: "num" }, { key: "missione", label: "Missione" }, { key: "data", label: "Data", type: "date" }, { key: "atterraggio", label: "Atterraggio" }, { key: "stato", label: "Stato", type: "tag" }],
      filters: ["booster", "atterraggio", "stato"], sort: ["data", -1] },

    { id: "t-dragon", tab: "dragon", title: "Missioni Dragon", rows: function () { return dragonMissioni(); },
      cols: [{ key: "capsula", label: "Capsula" }, { key: "tipo", label: "Tipo", type: "tag" }, { key: "missione", label: "Missione" }, { key: "partenza", label: "Partenza", type: "date" }, { key: "rientro", label: "Rientro", type: "date" }, { key: "durata", label: "Durata" }, { key: "turnaround", label: "Turnaround" }, { key: "caricoKg", label: "Carico su (kg)", type: "num" }],
      filters: ["capsula", "tipo"], sort: ["partenza", -1], open: true },
    { id: "t-equipaggi", tab: "dragon", title: "Equipaggi Dragon", rows: function () { return D.dragon.equipaggi; },
      cols: [{ key: "n", label: "#", type: "num" }, { key: "missione", label: "Missione" }, { key: "capsula", label: "Capsula" }, { key: "comandante", label: "Comandante" }, { key: "pilota", label: "Pilota" }, { key: "spec1", label: "Specialista 1" }, { key: "spec2", label: "Specialista 2" }],
      filters: ["capsula"], sort: ["n", -1] },

    { id: "t-kuiper", tab: "archivio", title: "Lanci Kuiper", rows: function () { return D.kuiper.lanci; },
      cols: [{ key: "missione", label: "Missione" }, { key: "partenza", label: "Partenza", type: "date" }, { key: "vettore", label: "Vettore" }, { key: "satelliti", label: "Satelliti", type: "num" }, { key: "tempoStessoVettore", label: "Dal lancio prima, stesso vettore", type: "dur" }, { key: "tempoTrascorso", label: "Dal lancio Kuiper prima", type: "dur" }],
      filters: ["vettore"], sort: ["partenza", 1] },
    { id: "t-vettori", tab: "archivio", title: "Lanci per anno e vettore, 2006–2026", rows: function () { return D.vettori.anni; },
      cols: function () { return [{ key: "anno", label: "Anno", type: "num" }].concat(D.vettori.vettori.map(function (v) { return { key: v, label: v, type: "num" }; })); }, sort: ["anno", -1], nosearch: true },
    { id: "t-tipologie", tab: "archivio", title: "Tipologie di missione per anno", rows: function () {
        var anni = anniCon("tipologie"), map = {};
        anni.forEach(function (y) { riep(y).tipologie.forEach(function (t) { (map[t.label] = map[t.label] || { tipologia: t.label })["a" + y] = t.valore; }); });
        return Object.keys(map).map(function (k) { return map[k]; });
      }, cols: function () { return [{ key: "tipologia", label: "Tipologia" }].concat(anniCon("tipologie").map(function (y) { return { key: "a" + y, label: String(y), type: "num" }; })); }, nosearch: true,
      note: "Stesse 9 categorie per ogni anno; «Rideshare» comprende i voli condivisi (ex «Transporter»), «Starfall» è una categoria a sé." },
    { id: "t-rideshare", tab: "archivio", title: "Satelliti nelle missioni rideshare", years: function () { return ["2026", "2025", "2024"].filter(function (y) { return riep(y).rideshare && riep(y).rideshare.length; }); },
      rows: function (y) { return riep(y).rideshare; }, cols: [{ key: "missione", label: "Missione" }, { key: "satelliti", label: "Satelliti", type: "num" }], nosearch: true },
    { id: "t-modifiche", tab: "archivio", title: "Registro modifiche del file", rows: function () { return D.modifiche; },
      cols: [{ key: "data", label: "Data", type: "date" }, { key: "foglio", label: "Foglio" }, { key: "descrizione", label: "Descrizione", wrap: true }] }
  ];
  function D_ANNI_SAT() { return [2026, 2025, 2024, 2023, 2022, 2021, 2020, 2019].map(function (y) { return { key: String(y), label: String(y), type: "num" }; }); }

  // ---------- Numeri chiave ----------
  function kpis() {
    var y = "2026", r = riep(y), L = D.lanci[y] || [];
    var last = L.slice().sort(function (a, b) { return (a.partenza || "").localeCompare(b.partenza || ""); }).pop() || {};
    var tip = {}; (r.tipologie || []).forEach(function (t) { tip[t.label] = t.valore; });
    var sat = D.starlink.satelliti, sat26 = (sat.perAnno.filter(function (x) { return String(x.anno) === y; })[0] || {}).valore;
    var ab = abbOk().slice().sort(function (a, c) { return (a.dataEsatta || a.data).localeCompare(c.dataEsatta || c.data); }).pop() || {};
    var at = r.atterraggiTotali || {};
    var b = boosters().slice().sort(function (a, c) { return c.voli - a.voli; })[0] || {};
    var rec = D.recordRiutilizzo; // record assoluto (tutti gli anni), calcolato da tools/xlsx_to_json.py
    var dm = dragonMissioni();
    var K = [
      { acc: "lanci", icon: "lanci", l: "Lanci 2026", v: nf(r.padTotali && r.padTotali.Totale), d: "di cui " + nf(tip.Starlink) + " Starlink · " + nf(r.padTotali && r.padTotali.Falliti) + " falliti" },
      { acc: "lanci", icon: "calendar", l: "Ultimo lancio", v: esc(last.missione || "—"), d: fData(last.partenza) + (last.booster ? " · " + esc(last.booster) : "") },
      { acc: "prossimo", icon: "starlink", l: "Satelliti Starlink 2026", v: nf(sat26), d: nf(sat.totale) + " lanciati dal 2019" },
      { acc: "prossimo", icon: "users", l: "Abbonati Starlink", v: fMln(ab.abbonati), d: "ultimo dato: " + esc(abbQuando(ab)) },
      { acc: "test", icon: "target", l: "Recuperi booster 2026", v: nf(at["Tot recuperi"] != null ? at["Tot recuperi"] : at["Tot recuperi F9"]) + "<small> / " + nf(at["Tot tentativi"]) + "</small>", d: "tentativi di recupero riusciti" },
      { acc: "test", icon: "booster", l: "Booster più usato", v: esc(b.booster || "—") + "<small> · " + nf(b.voli) + " voli</small>", d: b.ultimoM ? "ultimo: " + esc(b.ultimoM) + " (" + fData(b.ultimo) + ")" : "" },
      { acc: "test", icon: "recycle", l: "Riutilizzo più rapido", v: esc(rec ? rec.valore : "—"), d: rec ? "record assoluto · " + esc(rec.booster) + " (" + esc(rec.a.missione) + ", " + fData((rec.a.partenza || "").slice(0, 10)) + ")" : "" },
      { acc: "prototipi", icon: "dragon", l: "Missioni Dragon 2026", v: nf(tip.Dragon), d: nf(dm.length) + " voli Dragon in archivio, " + D.dragon.capsule.length + " capsule" }
    ];
    return '<div class="kpis">' + K.map(function (k) {
      return '<div class="kpi acc-' + k.acc + '"><div class="l">' + svg(k.icon, 15) + esc(k.l) + '</div><div class="v">' + k.v + '</div><div class="d">' + k.d + "</div></div>";
    }).join("") + "</div>";
  }

  // ---------- Contenuti extra per scheda ----------
  var EXTRA = {
    lanci: function () {
      var h = "";
      ["2026", "2025", "2024"].forEach(function (y) {
        (riep(y).record || []).forEach(function (x) {
          h += '<div class="mini"><div class="l">' + esc(x.record) + " · " + y + '</div><div class="v">' + esc(x.valore) + (x.booster ? " <small>(" + esc(x.booster) + ")</small>" : "") + "</div></div>";
        });
      });
      return h ? '<div><div class="sec-head"><h3>Record</h3></div><div class="minis">' + h + "</div></div>" : "";
    },
    starlink: function () {
      var s = D.starlink, h = "";
      h += '<div class="mini"><div class="l">Satelliti lanciati in totale</div><div class="v">' + nf(s.satelliti.totale) + "</div></div>";
      h += '<div class="mini"><div class="l">GEN1 / GEN2</div><div class="v">' + nf(s.satelliti.totaleGen1) + " / " + nf(s.satelliti.totaleGen2) + "</div></div>";
      Object.keys(s.totDtc || {}).sort().reverse().forEach(function (y) { h += '<div class="mini"><div class="l">Direct to Cell lanciati nel ' + y + '</div><div class="v">' + nf(s.totDtc[y]) + "</div></div>"; });
      return '<div class="minis">' + h + "</div>";
    },
    dragon: function () {
      var h = (D.dragon.utilizzi || []).map(function (u) { return '<div class="mini"><div class="l">' + esc(u.nome) + '</div><div class="v">' + nf(u.voli) + " <small>voli</small></div></div>"; }).join("");
      return h ? '<div><div class="sec-head"><h3>Utilizzi capsule equipaggio</h3></div><div class="minis">' + h + "</div></div>" : "";
    },
    archivio: function () {
      var items = [];
      (D.meta.avvisi || []).concat(D.meta.note || []).forEach(function (a) { items.push(esc(a)); });
      if (!items.length) items.push("Nessuna incoerenza trovata dai controlli automatici (liste dei lanci contro riepiloghi di tipologie, pad e atterraggi, totali per anno, missioni e satelliti Starlink, stato dei booster, voli dei booster del foglio Falcon 9 contro le liste dei lanci).");
      return '<div><div class="sec-head"><h3>Note sui dati</h3></div><ul class="oddities">' + items.map(function (x) { return "<li>" + x + "</li>"; }).join("") + "</ul></div>";
    }
  };

  // ---------- Grafici: motore generico ----------
  var chartState = {}, charts = {};
  function chartBox(c) {
    var ys = c.years ? c.years() : null;
    if (typeof c.sub === "function") c.sub = c.sub();
    chartState[c.id] = ys ? ys[0] : null;
    var seg = ys && ys.length > 1 ? '<div class="seg sm" role="group" aria-label="Anno">' + ys.map(function (y, i) {
      return '<button type="button" data-chart="' + c.id + '" data-year="' + y + '" aria-pressed="' + (i === 0) + '">' + y + "</button>";
    }).join("") + "</div>" : "";
    return '<div class="chart-box' + (c.wide ? " wide" : "") + '"><div class="chart-head"><div><h3>' + esc(c.title) + "</h3>" +
      (c.sub || ys ? '<p class="sub" id="sub-' + c.id + '">' + esc(c.sub || "") + "</p>" : "") + "</div>" + seg +
      '</div><div class="chart-wrap' + (c.tall ? " tall" : "") + '" id="wrap-' + c.id + '"><canvas id="cv-' + c.id + '" role="img" aria-label="' + esc(c.title) + '"></canvas></div><p class="chart-note" id="note-' + c.id + '"></p></div>';
  }
  function drawChart(c) {
    var y = chartState[c.id], spec;
    try { spec = c.build(y); } catch (e) { console.warn("grafico", c.id, e); return; }
    if (c.years && $("sub-" + c.id)) $("sub-" + c.id).textContent = (c.sub ? c.sub + " · " : "") + "Anno " + y;
    $("note-" + c.id).textContent = spec.nota || "";
    var wrap = $("wrap-" + c.id);
    if (!window.Chart) {
      var ds = spec.datasets[0];
      wrap.innerHTML = '<div class="chart-fallback">Grafico non disponibile (libreria non caricata). Valori: ' +
        (spec.labels || []).map(function (l, i) { return esc(l) + " " + nf(ds.data[i] && ds.data[i].y != null ? ds.data[i].y : ds.data[i]); }).join(" · ") + "</div>";
      wrap.style.height = "auto";
      return;
    }
    if (spec.height) wrap.style.height = spec.height + "px";
    if (charts[c.id]) charts[c.id].destroy();
    var mobile = window.matchMedia("(max-width: 640px)").matches;
    var base = {
      responsive: true, maintainAspectRatio: false, locale: "it-IT", animation: { duration: 350 },
      plugins: { legend: { position: spec.type === "doughnut" ? (mobile ? "bottom" : "right") : "top", labels: { boxWidth: 12, boxHeight: 12, usePointStyle: true, padding: 12 } },
                 tooltip: { backgroundColor: "#0c1324", borderColor: "rgba(148,163,184,.26)", borderWidth: 1, padding: 10 } },
      scales: spec.type === "doughnut" ? {} : { x: { grid: { color: "rgba(148,163,184,.08)" } }, y: { beginAtZero: true, grid: { color: "rgba(148,163,184,.10)" } } }
    };
    if (spec.type === "doughnut") base.cutout = "58%";
    var opts = merge(base, spec.opts || {});
    charts[c.id] = new window.Chart($("cv-" + c.id), { type: spec.type, data: { labels: spec.labels, datasets: spec.datasets }, options: opts });
  }
  function merge(a, b) {
    Object.keys(b).forEach(function (k) {
      if (b[k] && typeof b[k] === "object" && !Array.isArray(b[k]) && typeof b[k] !== "function" && a[k] && typeof a[k] === "object") merge(a[k], b[k]);
      else a[k] = b[k];
    });
    return a;
  }

  // ---------- Tabelle: motore generico ----------
  var tState = {};
  function cols(t) { return typeof t.cols === "function" ? t.cols() : t.cols; }
  function tRows(t) {
    var s = tState[t.id], rows = (t.rows(s.year) || []).map(function (r) { r = Object.assign({}, r); return t.prep ? t.prep(r) : r; });
    // nasconde le colonne sempre vuote (es. booster per il 2021)
    s.cols = cols(t).filter(function (c) { return rows.some(function (r) { return r[c.key] != null && r[c.key] !== ""; }); });
    return rows;
  }
  function tableBox(t) {
    var ys = t.years ? t.years() : null;
    tState[t.id] = { year: ys ? ys[0] : null, q: "", f: {}, sort: t.sort ? t.sort[0] : null, dir: t.sort ? t.sort[1] : 1 };
    return '<details class="tbl" id="' + t.id + '"' + (t.open ? " open" : "") + "><summary>" + svg("chevronR", 16) + esc(t.title) + '<span class="cnt" id="cnt-' + t.id + '"></span></summary><div class="tbl-body"><div class="tools" id="tools-' + t.id + '"></div><div class="tscroll"><table class="dt"><thead id="th-' + t.id + '"></thead><tbody id="tb-' + t.id + '"></tbody></table></div>' +
      (t.note ? '<p class="note">' + esc(t.note) + "</p>" : "") + "</div></details>";
  }
  function renderTools(t) {
    var s = tState[t.id], rows = tRows(t), h = "";
    var ys = t.years ? t.years() : null;
    if (ys && ys.length > 1) h += '<div class="seg sm" role="group" aria-label="Anno">' + ys.map(function (y) { return '<button type="button" data-tyear="' + y + '" aria-pressed="' + (String(y) === String(s.year)) + '">' + y + "</button>"; }).join("") + "</div>";
    if (!t.nosearch) h += '<input type="search" placeholder="Cerca…" aria-label="Cerca in ' + esc(t.title) + '" data-tq value="' + esc(s.q) + '">';
    (t.filters || []).forEach(function (k) {
      var c = cols(t).filter(function (c) { return c.key === k; })[0] || { label: k === "mese" ? "Mese" : k };
      var vals = [];
      rows.forEach(function (r) { var v = r[k]; if (v != null && v !== "" && vals.indexOf(String(v)) < 0) vals.push(String(v)); });
      if (vals.length < 2) { delete s.f[k]; return; }
      if (k === "mese") vals.sort(function (a, b) { return MESI.indexOf(a) - MESI.indexOf(b); }); else vals.sort(function (a, b) { return a.localeCompare(b, "it", { numeric: true }); });
      if (s.f[k] && vals.indexOf(s.f[k]) < 0) delete s.f[k];
      h += '<label class="sel">' + esc(k === "mese" ? "Mese" : c.label) + ' <select data-tf="' + k + '"><option value="">Tutti</option>' + vals.map(function (v) { return '<option' + (s.f[k] === v ? " selected" : "") + ">" + esc(v) + "</option>"; }).join("") + "</select></label>";
    });
    if ((t.filters || []).length || !t.nosearch) h += '<button type="button" class="reset" data-treset>Azzera</button>';
    h += '<span class="count" id="count-' + t.id + '"></span>';
    $("tools-" + t.id).innerHTML = h;
    renderTable(t, rows);
  }
  function cell(c, v) {
    if (v == null || v === "") return '<td class="muted' + (c.type === "num" || c.type === "dur" ? " num" : "") + '">—</td>';
    if (c.type === "num") return '<td class="num">' + nf(v) + "</td>";
    if (c.type === "dur") return '<td class="num">' + fDur(v) + "</td>";
    if (c.type === "date") return "<td>" + fData(v) + "</td>";
    if (c.type === "month") return "<td>" + esc(fMeseAnno(v)) + "</td>";
    if (c.type === "tag") {
      var col = TIPO_COL[v] || (/^Attivo/.test(v) || v === "OK" ? C.prossimo : v === "Da verificare" ? C.warn : /Perso/.test(v) ? C.bad : v === "Cargo" ? C.siti : v === "Equipaggio" ? C.prototipi : C.neutral);
      return '<td><span class="tag" style="--tc:' + col + '">' + esc(v) + "</span></td>";
    }
    return "<td" + (c.wrap ? ' class="wrap"' : "") + ">" + esc(v) + "</td>";
  }
  function renderTable(t, rows) {
    var s = tState[t.id];
    rows = rows || tRows(t);
    var total = rows.length;
    var q = s.q.trim().toLowerCase();
    rows = rows.filter(function (r) {
      for (var k in s.f) if (s.f[k] && String(r[k]) !== s.f[k]) return false;
      if (!q) return true;
      return s.cols.some(function (c) { var v = r[c.key]; return v != null && (String(v).toLowerCase().indexOf(q) >= 0 || (c.type === "date" && fData(v).indexOf(q) >= 0)); });
    });
    if (s.sort) {
      var sc = s.cols.filter(function (c) { return c.key === s.sort; })[0] || {};
      rows.sort(function (a, b) {
        var x = a[s.sort], y = b[s.sort];
        if (x == null || x === "") return 1; if (y == null || y === "") return -1;
        var r = (typeof x === "number" && typeof y === "number") ? x - y : String(x).localeCompare(String(y), "it", { numeric: true });
        return r * s.dir;
      });
    }
    $("th-" + t.id).innerHTML = "<tr>" + s.cols.map(function (c) {
      var srt = s.sort === c.key ? (s.dir > 0 ? "ascending" : "descending") : "none";
      var cls = c.type === "num" || c.type === "dur" ? ' class="num"' : "";
      if (c.nosort) return "<th" + cls + ">" + esc(c.label) + "</th>";
      return "<th" + cls + ' aria-sort="' + srt + '"><button type="button" data-tsort="' + esc(c.key) + '">' + esc(c.label) + '<span class="ar" aria-hidden="true">' + (srt === "ascending" ? "▲" : srt === "descending" ? "▼" : "↕") + "</span></button></th>";
    }).join("") + "</tr>";
    $("tb-" + t.id).innerHTML = rows.length ? rows.map(function (r) { return "<tr>" + s.cols.map(function (c) { return cell(c, r[c.key]); }).join("") + "</tr>"; }).join("")
      : '<tr><td class="empty" colspan="' + s.cols.length + '">Nessun risultato con questi filtri.</td></tr>';
    var lbl = (s.year ? s.year + " · " : "") + (rows.length === total ? NF.format(total) + " righe" : NF.format(rows.length) + " di " + NF.format(total) + " righe");
    $("cnt-" + t.id).textContent = lbl;
    var cnt = $("count-" + t.id); if (cnt) cnt.textContent = rows.length === total ? NF.format(total) + " righe" : NF.format(rows.length) + " di " + NF.format(total);
  }
  function tableById(id) { return TABLES.filter(function (t) { return t.id === id; })[0]; }

  // ---------- Pagina ----------
  var drawn = {};
  function render() {
    var m = D.meta;
    $("updated").innerHTML = "Dati aggiornati al <strong>" + esc(fDataLunga(m.aggiornato)) + "</strong>";
    var h = '<section class="card d-hero"><p class="kicker">' + svg("chart", 16) + 'Archivio dati</p><h1>Dati SpaceX</h1><p class="lead-small">Lanci, Starlink, booster Falcon 9 e Dragon dal file di Master Dati. Prima i grafici, poi le tabelle complete: si possono cercare, filtrare e ordinare toccando le intestazioni.</p>' + kpis() + "</section>";
    h += '<nav class="tabs dtabs" id="tabs" role="tablist" aria-label="Sezioni dei dati">' + TABS.map(function (t) {
      return '<button class="tab acc-' + t.acc + '" type="button" role="tab" id="tab-' + t.id + '" aria-controls="p-' + t.id + '" aria-selected="false" data-tab="' + t.id + '">' + ico(t.icon) + esc(t.label) + "</button>";
    }).join("") + "</nav>";
    TABS.forEach(function (tab) {
      var cs = CHARTS.filter(function (c) { return c.tab === tab.id; }), ts = TABLES.filter(function (t) { return t.tab === tab.id; });
      h += '<section class="panel" id="p-' + tab.id + '" role="tabpanel" aria-labelledby="tab-' + tab.id + '" hidden><div class="card accented acc-' + tab.acc + '"><div class="sec-head">' + ico(tab.icon) + "<h2>" + esc(tab.label) + '</h2><p class="sub">' + esc(tab.sub) + "</p></div>" +
        (cs.length ? '<div class="charts">' + cs.map(chartBox).join("") + "</div>" : "") +
        (EXTRA[tab.id] ? '<div style="margin-top:20px">' + EXTRA[tab.id]() + "</div>" : "") +
        (ts.length ? '<div style="margin-top:22px"><div class="sec-head"><h3>Tabelle</h3></div>' + ts.map(tableBox).join("") + "</div>" : "") + "</div></section>";
    });
    $("app").innerHTML = h;
    TABLES.forEach(renderTools);
    bind();
    var start = (location.hash || "").replace("#", "");
    show(TABS.some(function (t) { return t.id === start; }) ? start : "lanci", false);
  }
  function show(id, scroll) {
    TABS.forEach(function (t) {
      $("tab-" + t.id).setAttribute("aria-selected", String(t.id === id));
      $("p-" + t.id).hidden = t.id !== id;
    });
    CHARTS.forEach(function (c) { if (c.tab === id && !drawn[c.id]) { drawn[c.id] = true; drawChart(c); } });
    if (scroll) {
      if (history.replaceState) history.replaceState(null, "", "#" + id);
      var tabs = $("tabs"), top = tabs.getBoundingClientRect().top;
      if (top < 0 || top > 120) window.scrollTo({ top: window.scrollY + $("p-" + id).getBoundingClientRect().top - (tabs.offsetHeight + (window.innerWidth > 640 ? 76 : 8)), behavior: "smooth" });
    }
  }
  function bind() {
    var app = $("app");
    app.addEventListener("click", function (e) {
      var b = e.target.closest("button"); if (!b) return;
      if (b.dataset.tab) return show(b.dataset.tab, true);
      if (b.dataset.chart) {
        var c = CHARTS.filter(function (x) { return x.id === b.dataset.chart; })[0];
        chartState[c.id] = b.dataset.year;
        b.parentNode.querySelectorAll("button").forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); });
        return drawChart(c);
      }
      var d = b.closest("details.tbl"); if (!d) return;
      var t = tableById(d.id), s = tState[t.id];
      if (b.dataset.tyear) { s.year = b.dataset.tyear; return renderTools(t); }
      if (b.hasAttribute("data-treset")) { s.q = ""; s.f = {}; s.sort = t.sort ? t.sort[0] : null; s.dir = t.sort ? t.sort[1] : 1; return renderTools(t); }
      if (b.dataset.tsort) {
        var k = b.dataset.tsort;
        if (s.sort === k) s.dir = -s.dir; else { s.sort = k; var c2 = s.cols.filter(function (c) { return c.key === k; })[0]; s.dir = c2 && (c2.type === "num" || c2.type === "date" || c2.type === "dur") ? -1 : 1; }
        return renderTable(t);
      }
    });
    app.addEventListener("input", function (e) {
      if (!e.target.hasAttribute("data-tq")) return;
      var t = tableById(e.target.closest("details.tbl").id); tState[t.id].q = e.target.value; renderTable(t);
    });
    app.addEventListener("change", function (e) {
      var k = e.target.dataset && e.target.dataset.tf; if (!k) return;
      var t = tableById(e.target.closest("details.tbl").id); tState[t.id].f[k] = e.target.value; renderTable(t);
    });
    $("tabs").addEventListener("keydown", function (e) {
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
      var ids = TABS.map(function (t) { return t.id; }), cur = ids.indexOf(document.activeElement.dataset.tab);
      if (cur < 0) return;
      var nx = ids[(cur + (e.key === "ArrowRight" ? 1 : ids.length - 1)) % ids.length];
      $("tab-" + nx).focus(); show(nx, false);
    });
    window.addEventListener("hashchange", function () { var id = location.hash.replace("#", ""); if (TABS.some(function (t) { return t.id === id; })) show(id, false); });
  }

  function setupChartDefaults() {
    if (!window.Chart) return;
    var Ch = window.Chart;
    Ch.defaults.color = "#a9b4c8";
    Ch.defaults.borderColor = "rgba(148,163,184,.14)";
    Ch.defaults.font.family = 'Inter, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';
    Ch.defaults.font.size = 12;
  }

  function init() {
    fetch("../data/spacex.json", { cache: "no-cache" })
      .then(function (r) { if (!r.ok) throw new Error("HTTP " + r.status); return r.json(); })
      .then(function (data) {
        D = data;
        // le colonne dei satelliti per mese seguono gli anni presenti nel file
        var tsm = tableById("t-satmese");
        tsm.cols = [{ key: "mese", label: "Mese", nosort: true }].concat(D.starlink.satelliti.anni.slice().sort(function (a, b) { return b - a; }).map(function (y) { return { key: String(y), label: String(y), type: "num" }; }));
        setupChartDefaults();
        render();
      })
      .catch(function (e) {
        console.error(e);
        $("updated").textContent = "Dati non disponibili";
        $("app").innerHTML = '<p class="card">Impossibile caricare i dati (' + esc(e.message) + "). Riprova più tardi.</p>";
      });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
