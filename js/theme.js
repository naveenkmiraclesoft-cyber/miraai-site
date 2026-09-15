(function () {
	"use strict";

	var KEY = "mira-theme";
	var root = document.documentElement;
	var meta = document.getElementById("themeColorMeta");

	function stored() {
		try {
			var v = localStorage.getItem(KEY);
			return v === "dark" || v === "light" ? v : null;
		} catch (e) {
			return null;
		}
	}

	function current() {
		return root.getAttribute("data-theme") === "dark" ? "dark" : "light";
	}

	function syncControls(theme) {
		var dark = theme === "dark";
		document.querySelectorAll(".theme-switch").forEach(function (btn) {
			btn.setAttribute("aria-checked", String(dark));
			btn.setAttribute("aria-label", dark ? "Activate light theme" : "Activate dark theme");
			var label = btn.querySelector(".ts-label");
			if (label) label.textContent = dark ? "Dark" : "Light";
		});
		document.querySelectorAll(".theme-toggle").forEach(function (btn) {
			btn.setAttribute("aria-pressed", String(dark));
			btn.setAttribute("aria-label", dark ? "Switch to light theme" : "Switch to dark theme");
			var icon = btn.querySelector("i");
			if (icon) icon.className = dark ? "fa-solid fa-sun" : "fa-solid fa-moon";
		});
		if (meta) meta.setAttribute("content", dark ? "#030d18" : "#ffffff");
	}

	function apply(theme, persist) {
		root.setAttribute("data-theme", theme);
		if (persist) {
			try {
				localStorage.setItem(KEY, theme);
			} catch (e) {
				/* storage unavailable */
			}
		}
		syncControls(theme);
	}

	document.addEventListener("DOMContentLoaded", function () {
		syncControls(current());

		document.querySelectorAll(".theme-switch, .theme-toggle").forEach(function (btn) {
			btn.addEventListener("click", function () {
				apply(current() === "dark" ? "light" : "dark", true);
			});
		});

		if (window.matchMedia) {
			var mq = window.matchMedia("(prefers-color-scheme: dark)");
			var onChange = function (e) {
				if (stored()) return;
				apply(e.matches ? "dark" : "light", false);
			};
			if (mq.addEventListener) mq.addEventListener("change", onChange);
			else if (mq.addListener) mq.addListener(onChange);
		}
	});
})();
