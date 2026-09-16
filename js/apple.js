(function () {
	"use strict";

	var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
	var finePointer = window.matchMedia("(pointer: fine)").matches;
	var hasIO = "IntersectionObserver" in window;

	document.addEventListener("DOMContentLoaded", function () {
		initStagger();
		if (reduced) return;
		initHeroZoom();
		initNavHide();
		initScrollMotion();
		if (finePointer) {
			initTilt();
			initMagnetic();
		}
	});

	/* ------------------------------------------------------------
	   1 · Hero scroll-zoom — hero copy rises & fades, media scales
	   down as the section scrolls out of view (AirPods-style exit).
	   ------------------------------------------------------------ */
	function initHeroZoom() {
		var hero = document.getElementById("hero");
		if (!hero || window.innerWidth < 560) return;
		var copy = hero.querySelector(".hero-copy");
		var media = hero.querySelector(".hero-media");
		if (!copy || !media) return;

		hero.classList.add("hz");
		var ticking = false;

		function update() {
			ticking = false;
			var rect = hero.getBoundingClientRect();
			var p = -rect.top / (rect.height * 0.9);
			p = Math.max(0, Math.min(1, p));
			if (p <= 0) return;

			copy.style.setProperty("--hero-copy-y", (-46 * p).toFixed(1) + "px");
			copy.style.setProperty("--hero-copy-o", Math.max(0, 1 - p * 1.05).toFixed(3));
			copy.style.setProperty("--hero-copy-b", (10 * p).toFixed(2) + "px");

			media.style.setProperty("--hero-media-s", (1 - p * 0.11).toFixed(4));
			media.style.setProperty("--hero-media-y", (-30 * p).toFixed(1) + "px");
			media.style.setProperty("--hero-media-o", Math.max(0, 1 - p).toFixed(3));
		}

		window.addEventListener("scroll", function () {
			if (!ticking) {
				ticking = true;
				requestAnimationFrame(update);
			}
		}, { passive: true });
		update();
	}

	/* ------------------------------------------------------------
	   2 · Staggered grid entrances — takes over the reveal for
	   the product grids so children cascade one-by-one.
	   ------------------------------------------------------------ */
	function initStagger() {
		var groups = [
			{ root: ".feature-grid", items: ".feature-grid > .fc" },
			{ root: ".cert-grid", items: ".cert-grid > .cert" },
			{ root: ".sol-grid", items: ".sol-grid > .sol" },
			{ root: ".integ-grid", items: ".integ-grid > .integ" },
			{ root: ".uc-tabs", items: ".uc-tabs > .uc-tab" }
		];
		var all = [];
		groups.forEach(function (g) {
			var root = document.querySelector(g.root);
			if (!root) return;
			var kids = Array.prototype.slice.call(root.querySelectorAll(g.items));
			all.push(kids);
		});
		if (!all.length) return;

		/* Reduced motion / no IO: just make everything naturally visible. */
		if (reduced || !hasIO) {
			all.forEach(function (kids) {
				kids.forEach(function (el) {
					el.classList.remove("reveal", "in-view");
				});
			});
			return;
		}

		var STEP = 150;
		var timer;

		all.forEach(function (kids) {
			kids.forEach(function (el) {
				el.classList.remove("reveal", "in-view");
				el.style.opacity = "0";
				el.style.transform = "translate3d(0,26px,0)";
			});
		});

		function revealGroup(kids) {
			kids.forEach(function (el, i) {
				window.setTimeout(function () {
					el.style.transition =
						"opacity .7s ease, transform .7s cubic-bezier(.16,1,.3,1)";
					el.style.opacity = "1";
					el.style.transform = "translate3d(0,0,0)";
				}, i * STEP);
			});
			if (timer) window.clearTimeout(timer);
			timer = window.setTimeout(function () {
				kids.forEach(function (el) {
					el.style.transition = "";
					el.style.opacity = "";
					el.style.transform = "";
				});
			}, kids.length * STEP + 900);
		}

		all.forEach(function (kids) {
			var root = kids[0] && kids[0].closest(".feature-grid, .cert-grid, .sol-grid, .integ-grid, .uc-tabs");
			if (!root) {
				revealGroup(kids);
				return;
			}
			var io = new IntersectionObserver(function (entries) {
				entries.forEach(function (entry) {
					if (!entry.isIntersecting) return;
					io.disconnect();
					revealGroup(kids);
				});
			}, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
			io.observe(root);
		});
	}

	/* ------------------------------------------------------------
	   3 · 3D tilt — gentle card rotation that follows the cursor.
	   ------------------------------------------------------------ */
	function initTilt() {
		var ROOT = ".feature-grid, .cert-grid, .sol-grid, .integ-grid, .uc-tabs";
		var CARD = ".fc, .cert, .sol, .integ, .uc-tab";
		document.querySelectorAll(ROOT).forEach(function (root) {
			root.addEventListener("pointermove", function (e) {
				var el = e.target.closest(CARD);
				if (!el) return;
				if (parseFloat(el.style.opacity) === 0) return;
				var rect = el.getBoundingClientRect();
				var px = (e.clientX - rect.left) / rect.width - 0.5;
				var py = (e.clientY - rect.top) / rect.height - 0.5;
				el.style.setProperty("--rx", (py * -4).toFixed(2) + "deg");
				el.style.setProperty("--ry", (px * 5).toFixed(2) + "deg");
			}, { passive: true });
			root.addEventListener("pointerleave", function () {
				root.querySelectorAll(CARD).forEach(function (el) {
					el.style.setProperty("--rx", "0deg");
					el.style.setProperty("--ry", "0deg");
				});
			}, { passive: true });
		});
	}

	/* ------------------------------------------------------------
	   4 · Magnetic buttons — cards pull gently toward the cursor.
	   ------------------------------------------------------------ */
	function initMagnetic() {
		document.querySelectorAll(".btn:not(.btn-nav)").forEach(function (btn) {
			btn.addEventListener("pointermove", function (e) {
				var rect = btn.getBoundingClientRect();
				var dx = e.clientX - (rect.left + rect.width / 2);
				var dy = e.clientY - (rect.top + rect.height / 2);
				btn.style.setProperty("--mx", Math.max(-4, Math.min(4, dx * 0.12)).toFixed(2) + "px");
				btn.style.setProperty("--my", Math.max(-3, Math.min(3, dy * 0.12)).toFixed(2) + "px");
			}, { passive: true });
			btn.addEventListener("pointerleave", function () {
				btn.style.setProperty("--mx", "0px");
				btn.style.setProperty("--my", "0px");
			}, { passive: true });
		});
	}

	/* ------------------------------------------------------------
	   5 · Hide-on-scroll nav — header slides away when scrolling
	   down and returns when scrolling up (Apple behavior).
	   ------------------------------------------------------------ */
	function initNavHide() {
		var nav = document.getElementById("siteNav");
		var mobile = document.getElementById("navMobile");
		if (!nav) return;
		var lastY = window.scrollY;
		var hidden = false;
		var ticking = false;

		function update() {
			ticking = false;
			var y = window.scrollY;
			var menuOpen = mobile && mobile.classList.contains("open");
			var shouldHide = y > 320 && y > lastY + 2 && !menuOpen;
			if (shouldHide !== hidden) {
				hidden = shouldHide;
				nav.classList.toggle("nav-hidden", hidden);
			}
			lastY = y;
		}

		window.addEventListener("scroll", function () {
			if (!ticking) {
				ticking = true;
				requestAnimationFrame(update);
			}
		}, { passive: true });
	}

	/* ------------------------------------------------------------
	   6 · Scroll-linked content motion and hero parallax.
	   One rAF loop updates bounded custom properties for all effects.
	   ------------------------------------------------------------ */
	function initScrollMotion() {
		var sections = document.querySelectorAll(".section");
		var heads = document.querySelectorAll(".section-head");
		var dots = document.querySelector(".hero-dots");
		var ticking = false;

		function update() {
			ticking = false;
			var vh = window.innerHeight;
			sections.forEach(function (section) {
				var rect = section.getBoundingClientRect();
				var distance = Math.abs(rect.top + rect.height / 2 - vh / 2);
				var visibility = 1 - Math.min(1, distance / (vh * 0.95 + rect.height / 2));
				var ease = visibility * visibility * (3 - 2 * visibility);
				section.style.setProperty("--section-o", (0.9 + ease * 0.1).toFixed(3));
				section.style.setProperty("--section-y", ((1 - ease) * 18).toFixed(1) + "px");
				section.style.setProperty("--section-s", (0.992 + ease * 0.008).toFixed(4));
			});
			heads.forEach(function (head) {
				var rect = head.getBoundingClientRect();
				var progress = 1 - Math.max(0, Math.min(1, (rect.top - vh * 0.2) / (vh * 0.65)));
				head.style.setProperty("--heading-o", (0.88 + progress * 0.12).toFixed(3));
				head.style.setProperty("--heading-y", ((1 - progress) * 12).toFixed(1) + "px");
				head.style.setProperty("--heading-s", (0.985 + progress * 0.015).toFixed(4));
			});
			if (dots) dots.style.setProperty("--dots-y", Math.min(32, window.scrollY * 0.06).toFixed(1) + "px");
		}

		function requestUpdate() {
			if (ticking) return;
			ticking = true;
			requestAnimationFrame(update);
		}

		window.addEventListener("scroll", requestUpdate, { passive: true });
		window.addEventListener("resize", requestUpdate, { passive: true });
		update();
	}
})();
