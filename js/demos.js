(function () {
	"use strict";

	var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

	document.addEventListener("DOMContentLoaded", init);

	function init() {
		var frame = document.getElementById("heroFrame");
		var video = document.getElementById("heroVideo");
		var toggle = document.getElementById("heroMediaToggle");
		if (!frame || !video) return;

		var ready = false;
		var playing = true;

		/* Show the real player only when a video file is actually present
		   (assets/miraai-hero-demo.mp4). Until then the "Video to be uploaded here"
		   note stays visible over the poster. */
		function onReady() {
			if (ready) return;
			ready = true;
			frame.classList.add("has-video");
			setButton(!video.paused);
		}

		function setButton(on) {
			playing = on;
			if (!toggle) return;
			toggle.setAttribute("aria-pressed", String(!on));
			toggle.setAttribute("aria-label", on ? "Pause demo video" : "Play demo video");
			var icon = toggle.querySelector("i");
			if (icon) icon.className = on ? "fa-solid fa-pause" : "fa-solid fa-play";
		}

		video.addEventListener("canplay", onReady);
		video.addEventListener("playing", function () { setButton(true); });
		video.addEventListener("pause", function () { setButton(false); });

		window.setTimeout(function () {
			if (video.readyState >= 2) onReady();
		}, 1800);

		if (toggle) {
			toggle.addEventListener("click", function () {
				if (video.paused) video.play().catch(function () {});
				else video.pause();
			});
		}

		if (reduced) {
			try { video.pause(); } catch (e) {}
			setButton(false);
			return;
		}

		if ("IntersectionObserver" in window) {
			new IntersectionObserver(
				function (entries) {
					entries.forEach(function (entry) {
						if (entry.isIntersecting) {
							if (ready && playing) video.play().catch(function () {});
						} else if (!entry.isIntersecting && ready) {
							video.pause();
						}
					});
				},
				{ threshold: 0.12 }
			).observe(frame);
		}
	}
})();