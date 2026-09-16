(function () {
  "use strict";
  document.documentElement.classList.add("js");
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function initTheme() {
    var button = document.querySelector(".theme-button");
    if (!button) return;
    button.addEventListener("click", function () {
      var next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
      document.documentElement.dataset.theme = next;
      try { localStorage.setItem("mira-theme", next); } catch (error) {}
    });
  }

  function initMenus() {
    var languageButton = document.querySelector(".language-button");
    var languageMenu = document.getElementById("languageMenu");
    var menuButton = document.querySelector(".menu-button");
    var mobileNav = document.getElementById("mobileNav");
    function closeAll() {
      if (languageMenu) languageMenu.hidden = true;
      if (languageButton) languageButton.setAttribute("aria-expanded", "false");
      if (mobileNav) mobileNav.hidden = true;
      if (menuButton) menuButton.setAttribute("aria-expanded", "false");
    }
    if (languageButton && languageMenu) languageButton.addEventListener("click", function () {
      var open = languageMenu.hidden;
      closeAll(); languageMenu.hidden = !open; languageButton.setAttribute("aria-expanded", String(open));
    });
    if (menuButton && mobileNav) menuButton.addEventListener("click", function () {
      var open = mobileNav.hidden;
      closeAll(); mobileNav.hidden = !open; menuButton.setAttribute("aria-expanded", String(open));
      if (open) mobileNav.querySelector("a").focus();
    });
    document.addEventListener("keydown", function (event) { if (event.key === "Escape") { closeAll(); if (menuButton) menuButton.focus(); } });
    document.addEventListener("click", function (event) { if (!event.target.closest(".language") && !event.target.closest(".menu-button") && !event.target.closest(".mobile-nav")) closeAll(); });
    if (mobileNav) mobileNav.querySelectorAll("a").forEach(function (link) { link.addEventListener("click", closeAll); });
  }

  function initReveal() {
    var items = document.querySelectorAll(".reveal");
    if (reduced || !("IntersectionObserver" in window)) return items.forEach(function (item) { item.classList.add("is-visible"); });
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) { if (entry.isIntersecting) { entry.target.classList.add("is-visible"); observer.unobserve(entry.target); } });
    }, { threshold: 0.14, rootMargin: "0px 0px -8%" });
    items.forEach(function (item, index) { item.style.transitionDelay = Math.min(index % 4 * 70, 210) + "ms"; observer.observe(item); });
  }

  function initPlatform() {
    var steps = document.querySelectorAll("[data-platform-step]");
    if (!steps.length || !("IntersectionObserver" in window)) return;
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) { if (entry.isIntersecting) steps.forEach(function (step) { step.classList.toggle("is-active", step === entry.target); }); });
    }, { rootMargin: "-35% 0px -45%", threshold: 0 });
    steps.forEach(function (step) { observer.observe(step); step.addEventListener("focus", function () { steps.forEach(function (item) { item.classList.toggle("is-active", item === step); }); }); });
  }

  function initGallery() {
    document.querySelectorAll("[data-gallery]").forEach(function (gallery) {
      var track = gallery.querySelector(".gallery-track");
      var slides = Array.prototype.slice.call(gallery.querySelectorAll(".case-slide"));
      var dots = gallery.querySelectorAll("[data-gallery-dot]");
      var status = gallery.querySelector(".gallery-status");
      var index = 0;
      function show(next) {
        index = (next + slides.length) % slides.length;
        track.style.transform = "translate3d(" + (-index * 100) + "%,0,0)";
        slides.forEach(function (slide, i) { slide.toggleAttribute("inert", i !== index); });
        dots.forEach(function (dot, i) { if (i === index) dot.setAttribute("aria-current", "true"); else dot.removeAttribute("aria-current"); });
        status.textContent = status.dataset.statusTemplate.replace("{current}", index + 1).replace("{total}", slides.length);
      }
      gallery.querySelector("[data-gallery-prev]").addEventListener("click", function () { show(index - 1); });
      gallery.querySelector("[data-gallery-next]").addEventListener("click", function () { show(index + 1); });
      dots.forEach(function (dot) { dot.addEventListener("click", function () { show(Number(dot.dataset.galleryDot)); }); });
      gallery.addEventListener("keydown", function (event) { if (event.key === "ArrowLeft") show(index - 1); if (event.key === "ArrowRight") show(index + 1); });
      var startX = 0;
      track.addEventListener("pointerdown", function (event) { startX = event.clientX; });
      track.addEventListener("pointerup", function (event) { var distance = event.clientX - startX; if (Math.abs(distance) > 50) show(index + (distance < 0 ? 1 : -1)); });
      show(0);
    });
  }

  function initFaq() {
    document.querySelectorAll(".faq-item button").forEach(function (button) {
      button.addEventListener("click", function () {
        var item = button.closest(".faq-item");
        var answer = document.getElementById(button.getAttribute("aria-controls"));
        var open = button.getAttribute("aria-expanded") === "true";
        button.setAttribute("aria-expanded", String(!open)); item.classList.toggle("is-open", !open); answer.hidden = open;
      });
    });
  }

  function initScrollSpy() {
    var links = document.querySelectorAll(".desktop-nav a");
    var sections = Array.prototype.map.call(links, function (link) { return document.querySelector(link.getAttribute("href")); }).filter(Boolean);
    if (!("IntersectionObserver" in window)) return;
    var observer = new IntersectionObserver(function (entries) { entries.forEach(function (entry) { if (entry.isIntersecting) links.forEach(function (link) { link.toggleAttribute("aria-current", link.getAttribute("href") === "#" + entry.target.id); }); }); }, { rootMargin: "-35% 0px -55%", threshold: 0 });
    sections.forEach(function (section) { observer.observe(section); });
  }

  document.addEventListener("DOMContentLoaded", function () { initTheme(); initMenus(); initReveal(); initPlatform(); initGallery(); initFaq(); initScrollSpy(); });
})();
