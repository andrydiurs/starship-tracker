/* Menù condiviso delle pagine del sito.
   Desktop: colonna a sinistra. Sotto i 960px: tendina dal pulsante Menù.
   La pagina corrente si ricava dal percorso (voli, raptor, dati, resoconti, altrimenti Tracker). */
(function () {
  "use strict";

  var ICONS = {
    home: '<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V20h14V9.5"/><path d="M10 20v-6h4v6"/>',
    engine: '<path d="M9 3h6v6.5c0 2-1.1 3.4-3 4.5-1.9-1.1-3-2.5-3-4.5V3z"/><path d="M10.2 15c.5 1.4 1.1 2.5 1.8 3.3.7-.8 1.3-1.9 1.8-3.3"/><path d="M7 7h2M15 7h2"/>',
    book: '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>',
    chart: '<path d="M3 3v18h18"/><path d="M7 16v-4"/><path d="M12 16V8"/><path d="M17 16v-7"/>',
    rocket: '<path d="M12 3c3 2.2 5 5.6 5 9.5l-2 3.5H9l-2-3.5C7 8.6 9 5.2 12 3z"/><circle cx="12" cy="10" r="1.6"/><path d="M9 16l-2.5 4M15 16l2.5 4"/>',
    menu: '<path d="M4 7h16"/><path d="M4 12h16"/><path d="M4 17h16"/>'
  };

  var PAGES = [
    { id: "tracker", label: "Tracker", href: "" },
    { id: "voli", label: "Voli passati", href: "voli/", icon: "rocket" },
    { id: "raptor", label: "Raptor", href: "raptor/", icon: "engine" },
    { id: "resoconti", label: "Resoconti", href: "resoconti/", icon: "book" },
    { id: "dati", label: "Dati SpaceX", href: "dati/", icon: "chart" }
  ];
  PAGES[0].icon = "home";

  function svg(name) {
    return '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (ICONS[name] || "") + "</svg>";
  }

  function context() {
    var path = location.pathname || "";
    var match = path.match(/\/(voli|raptor|dati|resoconti)(?=\/|$)/);
    if (match) return { root: "../", id: match[1] };
    return { root: "", id: "tracker" };
  }

  function pageHref(page, root) {
    if (page.id === "tracker") return root || "./";
    return root + page.href;
  }

  var ctx = context();
  var nav = document.createElement("nav");
  nav.id = "site-nav";
  nav.className = "site-nav";
  nav.setAttribute("aria-label", "Pagine del sito");
  var html = '<p class="site-nav-label">Pagine</p>';
  PAGES.forEach(function (page) {
    var current = page.id === ctx.id;
    html += '<a href="' + pageHref(page, ctx.root) + '"' + (current ? ' aria-current="page"' : "") + ">" + svg(page.icon) + "<span>" + page.label + "</span></a>";
  });
  nav.innerHTML = html;
  document.body.appendChild(nav);

  var toggle = null;
  function setOpen(open) {
    document.body.classList.toggle("nav-open", open);
    if (toggle) {
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Chiudi il menù" : "Apri il menù");
    }
  }

  function syncHeaderHeight() {
    var header = document.querySelector("header.top");
    if (!header) return;
    document.documentElement.style.setProperty("--header-h", header.offsetHeight + "px");
  }

  function mountToggle() {
    var inner = document.querySelector("header.top .top-inner");
    if (!inner || toggle) return;
    toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = "nav-toggle";
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-controls", "site-nav");
    toggle.setAttribute("aria-label", "Apri il menù");
    toggle.innerHTML = svg("menu") + "<span>Menù</span>";
    toggle.addEventListener("click", function (e) {
      e.stopPropagation();
      setOpen(!document.body.classList.contains("nav-open"));
    });
    inner.insertBefore(toggle, inner.firstChild);
    syncHeaderHeight();
  }

  function onReady() {
    mountToggle();
    syncHeaderHeight();
    if (window.ResizeObserver) {
      var header = document.querySelector("header.top");
      if (header) new ResizeObserver(syncHeaderHeight).observe(header);
    } else {
      window.addEventListener("resize", syncHeaderHeight);
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", onReady);
  else onReady();

  document.addEventListener("click", function (e) {
    if (!document.body.classList.contains("nav-open")) return;
    var el = e.target && e.target.closest ? e.target : e.target && e.target.parentElement;
    if (el && el.closest && el.closest(".site-nav, .nav-toggle")) return;
    setOpen(false);
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") setOpen(false);
  });
  window.addEventListener("resize", function () {
    if (window.matchMedia("(min-width: 960px)").matches) setOpen(false);
  });
})();
