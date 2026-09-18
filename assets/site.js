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
      var progress = gallery.querySelector("[data-gallery-progress]");
      var index = 0;
      var timer = null;
      var interval = 6000;

      function show(next) {
        index = (next + slides.length) % slides.length;
        track.style.transform = "translate3d(" + (-index * 100) + "%,0,0)";
        slides.forEach(function (slide, i) { slide.toggleAttribute("inert", i !== index); });
        dots.forEach(function (dot, i) { if (i === index) dot.setAttribute("aria-current", "true"); else dot.removeAttribute("aria-current"); });
        status.textContent = status.dataset.statusTemplate.replace("{current}", index + 1).replace("{total}", slides.length);
        resetProgress();
      }

      function resetProgress() {
        if (!progress || reduced) return;
        progress.classList.remove("is-animating");
        progress.style.width = "0";
        void progress.offsetWidth;
        progress.classList.add("is-animating");
        progress.style.width = "100%";
      }

      function startAutoAdvance() {
        if (reduced) return;
        stopAutoAdvance();
        timer = setInterval(function () { show(index + 1); }, interval);
        resetProgress();
      }

      function stopAutoAdvance() {
        if (timer) { clearInterval(timer); timer = null; }
        if (progress) { progress.classList.remove("is-animating"); progress.style.width = "0"; }
      }

      gallery.querySelector("[data-gallery-prev]").addEventListener("click", function () { show(index - 1); startAutoAdvance(); });
      gallery.querySelector("[data-gallery-next]").addEventListener("click", function () { show(index + 1); startAutoAdvance(); });
      dots.forEach(function (dot) { dot.addEventListener("click", function () { show(Number(dot.dataset.galleryDot)); startAutoAdvance(); }); });
      gallery.addEventListener("keydown", function (event) { if (event.key === "ArrowLeft") { show(index - 1); startAutoAdvance(); } if (event.key === "ArrowRight") { show(index + 1); startAutoAdvance(); } });
      var startX = 0;
      track.addEventListener("pointerdown", function (event) { startX = event.clientX; });
      track.addEventListener("pointerup", function (event) { var distance = event.clientX - startX; if (Math.abs(distance) > 50) { show(index + (distance < 0 ? 1 : -1)); startAutoAdvance(); } });
      gallery.addEventListener("mouseenter", stopAutoAdvance);
      gallery.addEventListener("mouseleave", startAutoAdvance);
      gallery.addEventListener("focusin", stopAutoAdvance);
      gallery.addEventListener("focusout", startAutoAdvance);
      show(0);
      startAutoAdvance();
    });
  }

  function initFaq() {
    document.querySelectorAll(".faq-item button").forEach(function (button) {
      button.addEventListener("click", function () {
        var item = button.closest(".faq-item");
        var answer = document.getElementById(button.getAttribute("aria-controls"));
        var open = button.getAttribute("aria-expanded") === "true";
        document.querySelectorAll(".faq-item.is-open").forEach(function (openItem) {
          if (openItem !== item) {
            var openBtn = openItem.querySelector("button");
            var openAns = document.getElementById(openBtn.getAttribute("aria-controls"));
            openBtn.setAttribute("aria-expanded", "false");
            openItem.classList.remove("is-open");
            openAns.setAttribute("aria-hidden", "true");
            openAns.setAttribute("inert", "");
          }
        });
        button.setAttribute("aria-expanded", String(!open));
        item.classList.toggle("is-open", !open);
        answer.setAttribute("aria-hidden", String(open));
        answer.toggleAttribute("inert", open);
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

  function initScrollProgress() {
    if (reduced) return;
    var ticking = false;
    window.addEventListener("scroll", function () {
      if (!ticking) {
        requestAnimationFrame(function () {
          var scrollTop = window.scrollY;
          var docHeight = document.documentElement.scrollHeight - window.innerHeight;
          var progress = docHeight > 0 ? Math.min(scrollTop / docHeight, 1) : 0;
          document.documentElement.style.setProperty("--scroll-progress", progress);
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  function initHeroEntrance() {
    var items = document.querySelectorAll(".hero [data-entrance]");
    if (reduced) { items.forEach(function (item) { item.classList.add("is-entrance"); }); return; }
    items.forEach(function (item, index) {
      setTimeout(function () { item.classList.add("is-entrance"); }, index * 80);
    });
  }

  function initDeliveryProgress() {
    var steps = document.querySelectorAll(".delivery-step");
    if (!steps.length || !("IntersectionObserver" in window)) return;
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) { if (entry.isIntersecting) entry.target.classList.add("is-past"); });
    }, { rootMargin: "-40% 0px -40%", threshold: 0 });
    steps.forEach(function (step) { observer.observe(step); });
  }

  function setToggle(toggle, paused) {
    toggle.setAttribute("aria-pressed", String(!paused));
    toggle.setAttribute("aria-label", paused ? toggle.dataset.labelPlay : toggle.dataset.labelPause);
    var label = toggle.querySelector("[data-autoplay-label]");
    if (label) label.textContent = paused ? toggle.dataset.labelPlay : toggle.dataset.labelPause;
  }

  function initHeroSim(zone) {
    var steps = zone.querySelectorAll("[data-sim-step]");
    var trace = zone.querySelector("[data-sim-trace]");
    var result = zone.querySelector("[data-sim-result]");
    var toggle = zone.querySelector("[data-autoplay]");
    if (!steps.length || !toggle) return;
    var duration = 8000;
    var running = false;
    var paused = false;
    var raf = 0;
    var last = 0;
    var elapsed = 0;

    function paint() {
      var t = (elapsed % duration) / duration;
      steps.forEach(function (step, index) { step.classList.toggle("is-active", t >= 0.22 + index * 0.14); });
      if (trace) zone.style.setProperty("--sim-progress", String(Math.max(0, Math.min(1, (t - 0.16) / 0.58))));
      result.classList.toggle("is-visible", t > 0.72);
    }
    function frame() {
      if (!running) return;
      var now = Date.now();
      elapsed += now - last;
      last = now;
      paint();
      raf = requestAnimationFrame(frame);
    }
    function start() {
      if (reduced || paused || running) return;
      running = true;
      last = Date.now();
      frame();
    }
    function stop() {
      running = false;
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    }
    toggle.addEventListener("click", function () {
      paused = !paused;
      setToggle(toggle, paused);
      if (paused) stop(); else start();
    });
    if (reduced) {
      zone.classList.add("is-static");
      steps.forEach(function (step) { step.classList.add("is-active"); });
      if (trace) zone.style.setProperty("--sim-progress", "1");
      result.classList.add("is-visible");
      return;
    }
    zone.addEventListener("mouseenter", stop);
    zone.addEventListener("mouseleave", start);
    zone.addEventListener("focusin", stop);
    zone.addEventListener("focusout", function () { if (!paused) start(); });
    start();
  }

  function initTheater(zone) {
    var track = zone.querySelector(".theater-track");
    var slides = Array.prototype.slice.call(zone.querySelectorAll(".theater-slide"));
    var dots = zone.querySelectorAll("[data-theater-dot]");
    var status = zone.querySelector("[data-status-template]");
    var progress = zone.querySelector("[data-theater-progress]");
    var toggle = zone.querySelector("[data-autoplay]");
    if (!track || !slides.length || !toggle) return;
    var index = 0;
    var timer = null;
    var paused = false;
    var interval = 9000;

    function show(next) {
      index = (next + slides.length) % slides.length;
      track.style.transform = "translate3d(" + (-index * 100) + "%,0,0)";
      slides.forEach(function (slide, i) { slide.toggleAttribute("inert", i !== index); });
      dots.forEach(function (dot, i) {
        if (i === index) dot.setAttribute("aria-current", "true"); else dot.removeAttribute("aria-current");
      });
      if (status) status.textContent = status.dataset.statusTemplate.replace("{current}", index + 1).replace("{total}", slides.length);
      resetProgress();
    }
    function resetProgress() {
      if (!progress || reduced) return;
      progress.classList.remove("is-animating");
      progress.style.width = "0";
      void progress.offsetWidth;
      progress.classList.add("is-animating");
      progress.style.width = "100%";
    }
    function start() {
      if (reduced || paused || timer) return;
      timer = setInterval(function () { show(index + 1); }, interval);
      resetProgress();
    }
    function stop() {
      if (timer) { clearInterval(timer); timer = null; }
      if (progress) { progress.classList.remove("is-animating"); progress.style.width = "0"; }
    }
    function prev() { show(index - 1); start(); }
    function next() { show(index + 1); start(); }
    zone.querySelector("[data-theater-prev]").addEventListener("click", prev);
    zone.querySelector("[data-theater-next]").addEventListener("click", next);
    dots.forEach(function (dot) {
      dot.addEventListener("click", function () { show(Number(dot.dataset.theaterDot)); start(); });
    });
    toggle.addEventListener("click", function () {
      paused = !paused;
      setToggle(toggle, paused);
      if (paused) stop(); else start();
    });
    if (reduced) {
      zone.classList.add("is-static");
      show(0);
      return;
    }
    zone.addEventListener("mouseenter", stop);
    zone.addEventListener("mouseleave", start);
    zone.addEventListener("focusin", stop);
    zone.addEventListener("focusout", function () { if (!paused) start(); });
    show(0);
    start();
  }

  function initAutonomous() {
    document.querySelectorAll("[data-autonomous]").forEach(function (zone) {
      if (zone.dataset.autonomous === "hero") initHeroSim(zone);
      if (zone.dataset.autonomous === "theater") initTheater(zone);
    });
    if (!reduced) document.addEventListener("visibilitychange", function () {
      document.querySelectorAll("[data-autonomous]").forEach(function (zone) {
        var toggle = zone.querySelector("[data-autoplay]");
        var paused = toggle && toggle.getAttribute("aria-pressed") === "false";
        if (document.hidden) {
          zone.dispatchEvent(new Event("mouseenter"));
        } else if (!paused) {
          zone.dispatchEvent(new Event("mouseleave"));
        }
      });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initTheme();
    initMenus();
    initReveal();
    initPlatform();
    initGallery();
    initFaq();
    initScrollSpy();
    initScrollProgress();
    initHeroEntrance();
    initDeliveryProgress();
    initAutonomous();
  });
})();