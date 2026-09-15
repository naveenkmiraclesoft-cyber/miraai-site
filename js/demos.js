(function () {
	"use strict";

	var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

	document.addEventListener("DOMContentLoaded", init);

	function init() {
		initHeroMedia();
	}

	/* Hero demo player.
	   Uses a real <video> when assets/miraai-hero-demo.mp4 is present and playable.
	   If the source is missing/unsupported, swaps to the built-in looping CSS demo
	   so the hero still "plays" with zero external assets. */
	function initHeroMedia() {
		var frame = document.getElementById("heroFrame");
		var video = document.getElementById("heroVideo");
		var toggle = document.getElementById("heroMediaToggle");
		var demo = document.getElementById("heroDemo");
		if (!frame || !video) return;

		var fallback = false;
		var playing = true;

		function enableFallback() {
			if (fallback) return;
			fallback = true;
			frame.classList.add("is-fallback");
			if (reduced && demo) demo.classList.add("is-paused");
			setButton(reduced ? false : true);
		}

		function setButton(on) {
			playing = on;
			if (!toggle) return;
			toggle.setAttribute("aria-pressed", String(!on));
			toggle.setAttribute("aria-label", on ? "Pause demo" : "Play demo");
			var icon = toggle.querySelector("i");
			if (icon) icon.className = on ? "fa-solid fa-pause" : "fa-solid fa-play";
		}

		video.addEventListener("error", enableFallback);
		var source = video.querySelector("source");
		if (source) source.addEventListener("error", enableFallback);

		video.play && video.play().catch(function () {});

		window.setTimeout(function () {
			if (video.readyState < 2 && (video.networkState === 3 || video.networkState === 0)) {
				enableFallback();
			}
		}, 1200);

		if (toggle) {
			toggle.addEventListener("click", function () {
				if (fallback) {
					var paused = demo.classList.toggle("is-paused");
					setButton(!paused);
					return;
				}
				if (video.paused) {
					video.play().catch(function () {});
					setButton(true);
				} else {
					video.pause();
					setButton(false);
				}
			});
		}

		if (reduced) {
			try { video.pause(); } catch (e) {}
			if (fallback && demo) demo.classList.add("is-paused");
			setButton(false);
			return;
		}

		if ("IntersectionObserver" in window) {
			new IntersectionObserver(
				function (entries) {
					if (fallback) return;
					entries.forEach(function (entry) {
						if (entry.isIntersecting) {
							if (playing) video.play().catch(function () {});
						} else {
							video.pause();
						}
					});
				},
				{ threshold: 0.15 }
			).observe(frame);
		}
	}
})();
