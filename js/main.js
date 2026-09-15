(function () {
	"use strict";

	var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

	document.addEventListener("DOMContentLoaded", function () {
		initAnnounce();
		initTickers();
		initNav();
		initReveals();
		initTypewriter();
		initCounters();
		initTabs();
		initFaq();
		initOrbs();

		var heroTitle = document.getElementById("heroTitle");
		if (heroTitle) {
			requestAnimationFrame(function () {
				heroTitle.classList.add("in-view");
			});
		}
	});

	function initAnnounce() {
		var track = document.querySelector(".announce-track");
		var bar = document.querySelector(".announce");
		if (!track || reduced) return;
		track.classList.add("seam");
		if (!bar) return;
		bar.addEventListener("mouseenter", function () {
			track.classList.add("paused");
		});
		bar.addEventListener("mouseleave", function () {
			track.classList.remove("paused");
		});
	}

	function initTickers() {
		document.querySelectorAll("[data-ticker]").forEach(function (track) {
			if (!reduced) {
				var clone = track.cloneNode(true);
				clone.setAttribute("aria-hidden", "true");
				track.appendChild(clone);
				track.classList.add("seam");
			}
			var shell = track.closest(".ticker");
			if (!shell) return;
			shell.addEventListener("mouseenter", function () {
				track.classList.add("paused");
			});
			shell.addEventListener("mouseleave", function () {
				track.classList.remove("paused");
			});
		});
	}

	function initNav() {
		var nav = document.getElementById("siteNav");
		var progress = document.getElementById("navProgress");
		var burger = document.getElementById("navBurger");
		var mobile = document.getElementById("navMobile");
		var spyLinks = document.querySelectorAll("[data-spy]");
		var sections = [];
		spyLinks.forEach(function (link) {
			var id = link.getAttribute("data-spy");
			var el = document.getElementById(id);
			if (el) sections.push({ id: id, el: el, link: link });
		});

		function onScroll() {
			var y = window.scrollY;
			if (nav) nav.classList.toggle("scrolled", y > 20);
			if (progress) {
				var max = document.documentElement.scrollHeight - window.innerHeight;
				progress.style.width = (max > 0 ? (y / max) * 100 : 0) + "%";
			}
		}

		window.addEventListener("scroll", onScroll, { passive: true });
		onScroll();
		initScrollSpy(sections);

		if (burger && mobile) {
			burger.addEventListener("click", function () {
				var open = mobile.classList.toggle("open");
				burger.setAttribute("aria-expanded", String(open));
				burger.innerHTML = open
					? '<i class="fa-solid fa-xmark"></i>'
					: '<i class="fa-solid fa-bars"></i>';
			});
			mobile.querySelectorAll("a").forEach(function (a) {
				a.addEventListener("click", function () {
					mobile.classList.remove("open");
					burger.setAttribute("aria-expanded", "false");
					burger.innerHTML = '<i class="fa-solid fa-bars"></i>';
				});
			});
		}
	}

	function initScrollSpy(sections) {
		if (!sections.length || !("IntersectionObserver" in window)) return;
		function setActive(id) {
			sections.forEach(function (sec) {
				sec.link.classList.toggle("active", sec.id === id);
			});
		}
		var io = new IntersectionObserver(
			function (entries) {
				entries.forEach(function (entry) {
					if (!entry.isIntersecting) return;
					for (var i = 0; i < sections.length; i++) {
						if (sections[i].el === entry.target) {
							setActive(sections[i].id);
							break;
						}
					}
				});
			},
			{ rootMargin: "-45% 0px -50% 0px", threshold: 0 }
		);
		sections.forEach(function (sec) {
			io.observe(sec.el);
		});
	}

	function initReveals() {
		var items = document.querySelectorAll(".reveal");
		if (!("IntersectionObserver" in window) || reduced) {
			items.forEach(function (el) {
				el.classList.add("in-view");
			});
			return;
		}
		var io = new IntersectionObserver(
			function (entries) {
				entries.forEach(function (entry) {
					if (!entry.isIntersecting) return;
					entry.target.classList.add("in-view");
					io.unobserve(entry.target);
				});
			},
			{ threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
		);
		items.forEach(function (el) {
			io.observe(el);
		});
	}

	function initTypewriter() {
		var el = document.getElementById("typeRotate");
		if (!el) return;
		var words = ["Automate.", "Innovate.", "Accelerate."];
		if (reduced) {
			el.textContent = words[words.length - 1];
			el.setAttribute("aria-label", words[words.length - 1]);
			return;
		}
		var word = 0;
		var char = 0;
		var deleting = false;
		var label = word;
		function tick() {
			var full = words[word];
			if (deleting) {
				char--;
				el.textContent = full.slice(0, char);
				if (char === 0) {
					deleting = false;
					word = (word + 1) % words.length;
					el.setAttribute("aria-label", words[word]);
					label = word;
					setTimeout(tick, 550);
					return;
				}
				setTimeout(tick, 42);
			} else {
				char++;
				el.textContent = full.slice(0, char);
				if (char === full.length) {
					deleting = true;
					setTimeout(tick, 2200);
					return;
				}
				setTimeout(tick, 66);
			}
		}
		setTimeout(tick, 900);
	}

	function initCounters() {
		var nums = document.querySelectorAll(".cert-num[data-count]");
		if (!nums.length) return;
		function run(el) {
			var target = parseInt(el.getAttribute("data-count"), 10);
			if (reduced) {
				el.textContent = String(target).padStart(3, "0");
				return;
			}
			var from = 0;
			var dur = 900;
			var start = null;
			function frame(ts) {
				if (!start) start = ts;
				var p = Math.min((ts - start) / dur, 1);
				var eased = 1 - Math.pow(1 - p, 3);
				var val = Math.round(from + (target - from) * eased);
				el.textContent = String(val).padStart(3, "0");
				if (p < 1) requestAnimationFrame(frame);
			}
			requestAnimationFrame(frame);
		}
		if (!("IntersectionObserver" in window)) {
			nums.forEach(run);
			return;
		}
		var io = new IntersectionObserver(
			function (entries) {
				entries.forEach(function (entry) {
					if (!entry.isIntersecting) return;
					run(entry.target);
					io.unobserve(entry.target);
				});
			},
			{ threshold: 0.6 }
		);
		nums.forEach(function (el) {
			io.observe(el);
		});
	}

	function initTabs() {
		var tabs = Array.prototype.slice.call(document.querySelectorAll(".uc-tab"));
		var bodies = document.querySelectorAll(".uc-body");

		function select(tab) {
			var id = tab.getAttribute("data-tab");
			tabs.forEach(function (t) {
				var on = t === tab;
				t.classList.toggle("is-active", on);
				t.setAttribute("aria-selected", String(on));
				t.tabIndex = on ? 0 : -1;
			});
			bodies.forEach(function (body) {
				var show = body.id === id;
				body.hidden = !show;
				if (show) body.classList.add("in-view");
			});
		}

		tabs.forEach(function (tab, i) {
			tab.addEventListener("click", function () {
				select(tab);
			});
			tab.addEventListener("keydown", function (e) {
				var next = null;
				if (e.key === "ArrowRight" || e.key === "ArrowDown") next = tabs[(i + 1) % tabs.length];
				else if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = tabs[(i - 1 + tabs.length) % tabs.length];
				else if (e.key === "Home") next = tabs[0];
				else if (e.key === "End") next = tabs[tabs.length - 1];
				if (next) {
					e.preventDefault();
					next.focus();
					select(next);
				}
			});
		});
	}

	function initFaq() {
		var items = document.querySelectorAll(".faq-q");
		items.forEach(function (btn) {
			btn.addEventListener("click", function () {
				var item = btn.closest(".faq-item");
				var ans = item.querySelector(".faq-a");
				var open = btn.getAttribute("aria-expanded") === "true";
				items.forEach(function (other) {
					var oItem = other.closest(".faq-item");
					var oAns = oItem.querySelector(".faq-a");
					if (other !== btn) {
						other.setAttribute("aria-expanded", "false");
						oItem.classList.remove("is-open");
						oAns.style.maxHeight = "0px";
					}
				});
				if (open) {
					btn.setAttribute("aria-expanded", "false");
					item.classList.remove("is-open");
					ans.style.maxHeight = "0px";
				} else {
					btn.setAttribute("aria-expanded", "true");
					item.classList.add("is-open");
					ans.style.maxHeight = ans.scrollHeight + "px";
				}
			});
		});
	}

	function initOrbs() {
		if (reduced || !("matchMedia" in window)) return;
		var orbA = document.getElementById("orbA");
		var orbB = document.getElementById("orbB");
		if (!orbA && !orbB) return;
		var tx = orbA ? parseFloat(getComputedStyle(orbA).translate) || 0 : 0;
		var rectA = orbA ? orbA.getBoundingClientRect() : null;
		var rectB = orbB ? orbB.getBoundingClientRect() : null;
		var cx = orbA ? rectA.left + rectA.width / 2 : window.innerWidth / 2;
		var cy = orbA ? rectA.top + rectA.height / 2 : window.innerHeight / 2;
		window.addEventListener(
			"pointermove",
			function (e) {
				var dx = (e.clientX - cx) / cx;
				var dy = (e.clientY - cy) / cy;
				if (orbA) orbA.style.translate = dx * 18 + "px " + dy * 18 + "px";
				if (orbB) orbB.style.translate = dx * -26 + "px " + dy * -26 + "px";
			},
			{ passive: true }
		);
	}
})();