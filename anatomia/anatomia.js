/* Anatomia: schede Ship / Booster / Raptor e caricamento differito degli embed Sketchfab. */
(function () {
  "use strict";

  var tabs = Array.prototype.slice.call(document.querySelectorAll('[role="tab"][data-tab]'));
  var panels = Array.prototype.slice.call(document.querySelectorAll("[data-panel]"));

  function allowAuto() {
    if (!window.matchMedia("(min-width: 901px)").matches) return false;
    var c = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (c && c.saveData) return false;
    return true;
  }

  function mount(frame) {
    if (!frame || frame.getAttribute("data-state") === "loading" || frame.getAttribute("data-state") === "live") return;
    var src = frame.getAttribute("data-src");
    if (!src) return;
    frame.setAttribute("data-state", "loading");
    var btn = frame.querySelector(".viewer-load");
    if (btn) {
      btn.disabled = true;
      var label = btn.querySelector("strong");
      if (label) label.textContent = "Caricamento…";
    }
    var iframe = document.createElement("iframe");
    iframe.src = src;
    iframe.title = frame.getAttribute("data-title") || "Modello 3D su Sketchfab";
    iframe.loading = "lazy";
    iframe.referrerPolicy = "strict-origin-when-cross-origin";
    iframe.allowFullscreen = true;
    iframe.setAttribute("allow", "autoplay; fullscreen; xr-spatial-tracking");
    iframe.setAttribute("allowfullscreen", "");
    iframe.setAttribute("webkitallowfullscreen", "true");
    iframe.setAttribute("mozallowfullscreen", "true");
    iframe.addEventListener("load", function () {
      frame.setAttribute("data-state", "live");
      frame.classList.add("is-live");
    });
    frame.appendChild(iframe);
  }

  function autoload(panel) {
    if (!panel || !allowAuto()) return;
    var frame = panel.querySelector(".viewer-frame[data-autoload]");
    if (frame) mount(frame);
  }

  function show(id, push) {
    var known = false;
    panels.forEach(function (p) {
      var on = p.id === id;
      if (on) known = true;
      p.classList.toggle("is-on", on);
      if (on) p.removeAttribute("hidden");
      else p.setAttribute("hidden", "");
    });
    if (!known) return false;
    tabs.forEach(function (t) {
      var on = t.getAttribute("data-tab") === id;
      t.setAttribute("aria-selected", on ? "true" : "false");
      t.tabIndex = on ? 0 : -1;
    });
    autoload(document.getElementById(id));
    if (push && history.pushState && location.hash !== "#" + id) history.pushState({ anat: id }, "", "#" + id);
    return true;
  }

  function scrollToEl(el) {
    if (!el || !el.scrollIntoView) return;
    window.requestAnimationFrame(function () { el.scrollIntoView({ block: "start" }); });
  }

  function applyHash(scroll) {
    var h = (location.hash || "").replace(/^#/, "");
    if (!h) { show("ship", false); return; }
    var el = document.getElementById(h);
    if (el && el.hasAttribute("data-panel")) { show(h, false); return; }
    if (el) {
      var host = el.closest("[data-panel]");
      if (host) {
        show(host.id, false);
        var frame = el.classList.contains("viewer-frame") ? el : el.querySelector(".viewer-frame");
        if (frame) mount(frame);
        if (scroll) scrollToEl(el);
        return;
      }
    }
    show("ship", false);
  }

  document.addEventListener("click", function (e) {
    var tab = e.target.closest('[role="tab"][data-tab]');
    if (tab) {
      var id = tab.getAttribute("data-tab");
      var panel = document.getElementById(id);
      show(id, true);
      if (panel) {
        var top = panel.getBoundingClientRect().top;
        if (top < 60 || top > window.innerHeight * 0.45) scrollToEl(panel);
      }
      return;
    }
    var load = e.target.closest("[data-load]");
    if (load) mount(load.closest(".viewer-frame"));
  });

  document.addEventListener("keydown", function (e) {
    var t = e.target;
    if (!t || !t.getAttribute || t.getAttribute("role") !== "tab") return;
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft" && e.key !== "Home" && e.key !== "End") return;
    var i = tabs.indexOf(t);
    if (i < 0) return;
    if (e.key === "Home") i = 0;
    else if (e.key === "End") i = tabs.length - 1;
    else i = (i + (e.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length;
    e.preventDefault();
    var id = tabs[i].getAttribute("data-tab");
    show(id, true);
    tabs[i].focus();
  });

  window.addEventListener("hashchange", function () { applyHash(true); });
  var wide = window.matchMedia("(min-width: 901px)");
  if (wide.addEventListener) wide.addEventListener("change", function () {
    var on = document.querySelector(".anat-panel.is-on");
    if (on) autoload(on);
  });

  applyHash(true);
})();
