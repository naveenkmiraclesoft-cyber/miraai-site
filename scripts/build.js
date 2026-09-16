const fs = require("fs");
const path = require("path");
const { common, locales } = require("../src/content");

const root = path.resolve(__dirname, "..");
const site = "https://naveenkmiraclesoft-cyber.github.io/miraai-site";
const required = ["metaTitle", "metaDescription", "skip", "language", "nav", "briefing", "hero", "value", "platform", "assurance", "useCases", "integrations", "deployment", "resources", "faq", "cta", "footer"];

function escape(value) {
  return String(value).replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
}

function validate() {
  const errors = [];
  common.languages.forEach(language => {
    const locale = locales[language.code];
    if (!locale) return errors.push(`Missing locale: ${language.code}`);
    required.forEach(key => {
      if (locale[key] === undefined || locale[key] === null || locale[key] === "") errors.push(`${language.code}: missing ${key}`);
    });
    if (locale.nav.length !== 6) errors.push(`${language.code}: nav must contain 6 labels`);
    if (locale.useCases.slides.length < 4) errors.push(`${language.code}: at least 4 use cases required`);
  });
  if (errors.length) throw new Error(errors.join("\n"));
  console.log(`Validated ${common.languages.length} locales.`);
}

function validateSite() {
  const errors = [];
  const expectedRoutes = ["", ...common.languages.map(language => `${language.path}/`)];

  const sitemapFile = path.join(root, "sitemap.xml");
  if (!fs.existsSync(sitemapFile)) errors.push("sitemap.xml not found — run npm run build first");
  else {
    const sitemap = fs.readFileSync(sitemapFile, "utf8");
    const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1]);
    const expectedUrls = expectedRoutes.map(route => `${site}/${route}`);
    expectedUrls.forEach(url => { if (!locs.includes(url)) errors.push(`sitemap missing ${url}`); });
    if (locs.length !== expectedUrls.length) errors.push(`sitemap lists ${locs.length} URLs, expected ${expectedUrls.length}`);
  }

  const robotsFile = path.join(root, "robots.txt");
  if (!fs.existsSync(robotsFile)) errors.push("robots.txt not found — run npm run build first");
  else if (!fs.readFileSync(robotsFile, "utf8").includes(`${site}/sitemap.xml`)) errors.push("robots.txt missing sitemap reference");

  const pages = [{ route: "en-US", page: path.join(root, "index.html"), canonical: `${site}/` }].concat(
    common.languages.map(language => ({ route: language.code, page: path.join(root, language.path, "index.html"), canonical: `${site}/${language.path}/` }))
  );

  pages.forEach(({ route, page, canonical }) => {
    if (!fs.existsSync(page)) return errors.push(`${canonical} page not found — run npm run build first`);
    const html = fs.readFileSync(page, "utf8");
    if (!html.includes(`<link rel="canonical" href="${canonical}">`)) errors.push(`${route}: canonical mismatch`);
    common.languages.forEach(language => {
      const link = `<link rel="alternate" hreflang="${language.code}" href="${site}/${language.path}/">`;
      if (!html.includes(link)) errors.push(`${route}: missing hreflang ${language.code}`);
    });
    if (!html.includes(`<link rel="alternate" hreflang="x-default" href="${site}/en-us/">`)) errors.push(`${route}: missing x-default`);
    const hasDraftBanner = html.includes("translation-note");
    if (route === "en-US" && hasDraftBanner) errors.push("en-US must not carry a translation draft banner");
    if (route !== "en-US" && !hasDraftBanner) errors.push(`${route}: non-English page must carry a translation draft banner`);
    if (!html.includes("TODO — content to be filled later:")) errors.push(`${route}: missing pending-content comment`);
  });

  if (errors.length) throw new Error(errors.join("\n"));
  console.log(`Validated built site: ${pages.length} pages, sitemap, robots.`);
}

function icon(name) {
  const paths = {
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.66 6.34l1.41-1.41"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    chevron: '<path d="m8 10 4 4 4-4"/>',
    check: '<path d="m5 12 4 4L19 6"/>',
    layers: '<path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="m3 12 9 5 9-5M3 16l9 5 9-5"/>',
    shield: '<path d="M12 3 5 6v5c0 4.4 2.8 8 7 10 4.2-2 7-5.6 7-10V6l-7-3Z"/><path d="m9 12 2 2 4-4"/>',
    grid: '<rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/>'
  };
  return `<svg class="icon" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${paths[name]}</svg>`;
}

function card(title, text, index) {
  const icons = ["layers", "grid", "shield"];
  return `<article class="value-card reveal"><span class="icon-disc">${icon(icons[index % icons.length])}</span><h3>${escape(title)}</h3><p>${escape(text)}</p></article>`;
}

function render(locale, route, rootPage = false) {
  const prefix = rootPage ? "" : "../";
  const current = common.languages.find(item => item.code === route) || common.languages[0];
  const canonical = rootPage ? `${site}/` : `${site}/${current.path}/`;
  const hrefFor = language => rootPage ? `${language.path}/` : `../${language.path}/`;
  const navIds = ["overview", "value", "platform", "security", "use-cases", "resources"];
  const langLinks = common.languages.map(language => `<a lang="${language.code}" href="${hrefFor(language)}"${language.code === route ? ' aria-current="page"' : ""}>${language.label}</a>`).join("");
  const alternate = common.languages.map(language => `<link rel="alternate" hreflang="${language.code}" href="${site}/${language.path}/">`).join("\n\t");
  const nav = locale.nav.map((label, index) => `<a href="#${navIds[index]}">${escape(label)}</a>`).join("");
  const outcomeCards = locale.value.cards.map((item, index) => card(item[0], item[1], index)).join("");
  const platformSteps = locale.platform.steps.map((item, index) => `<article class="platform-step${index === 0 ? " is-active" : ""}" data-platform-step="${index}" tabindex="0"><span>${escape(item[0])}</span><div><h3>${escape(item[1])}</h3><p>${escape(item[2])}</p></div></article>`).join("");
  const orbitLabels = locale.platform.steps.map((item, index) => `<span class="orbit-label orbit-${index + 1}">${escape(item[1].replace(" Sphere", ""))}</span>`).join("");
  const assurance = locale.assurance.cards.map((item, index) => `<article class="assurance-card reveal"><span>0${index + 1}</span><h3>${escape(item[0])}</h3><p>${escape(item[1])}</p></article>`).join("");
  const slides = locale.useCases.slides.map((slide, index) => `<article class="case-slide" id="case-${index + 1}" role="group" aria-roledescription="slide" aria-label="${index + 1} / ${locale.useCases.slides.length}"${index ? " inert" : ""}><div class="case-art case-art-${index + 1}" aria-hidden="true"><span>0${index + 1}</span>${icon(index % 2 ? "grid" : "layers")}</div><div class="case-copy"><p class="case-sector">${escape(slide[0])}</p><h3>${escape(slide[1])}</h3><p>${escape(slide[2])}</p><ul class="chips">${slide[3].map(chip => `<li>${escape(chip)}</li>`).join("")}</ul><a class="text-link" href="${common.briefingUrl}">${escape(locale.useCases.discuss)} ${icon("arrow")}</a></div></article>`).join("");
  const dots = locale.useCases.slides.map((slide, index) => `<button type="button" data-gallery-dot="${index}" aria-label="${escape(slide[1])}"${index === 0 ? ' aria-current="true"' : ""}></button>`).join("");
  const integrations = locale.integrations.groups.map(item => `<article class="integration-card reveal"><p>${escape(item[0])}</p><h3>${escape(item[1])}</h3></article>`).join("");
  const deployment = locale.deployment.steps.map((item, index) => `<li class="delivery-step reveal"><span>0${index + 1}</span><div><h3>${escape(item[0])}</h3><p>${escape(item[1])}</p></div></li>`).join("");
  const resources = locale.resources.cards.map((item, index) => `<a class="resource-card reveal" href="${common.briefingUrl}"><span>${icon(index === 2 ? "shield" : index === 1 ? "grid" : "layers")}</span><h3>${escape(item[0])}</h3><p>${escape(item[1])}</p><strong>${escape(locale.resources.action)} ${icon("arrow")}</strong></a>`).join("");
  const faq = locale.faq.items.map((item, index) => `<article class="faq-item${index === 0 ? " is-open" : ""}"><h3><button type="button" aria-expanded="${index === 0}" aria-controls="answer-${index + 1}">${escape(item[0])}${icon("chevron")}</button></h3><div class="faq-answer" id="answer-${index + 1}"${index ? ' aria-hidden="true" inert' : ""}><p>${escape(item[1])}</p></div></article>`).join("");
  const draft = locale.draft ? `<div class="translation-note" role="note">${escape(locale.draft)}</div>` : "";
  const pendingNote = "TODO — content to be filled later:\n" + common.pending.map(item => "- " + item).join("\n");
  const schema = JSON.stringify({ "@context": "https://schema.org", "@type": "SoftwareApplication", name: "miraAI", applicationCategory: "BusinessApplication", description: locale.metaDescription, url: canonical, publisher: { "@type": "Organization", name: "Miracle Software Systems, Inc.", url: "https://www.miraclesoft.com/" } }).replace(/</g, "\\u003c");

  return `<!DOCTYPE html>
<html lang="${route}">
<head>
	<meta charset="utf-8">
<!-- ${pendingNote} -->
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title>${escape(locale.metaTitle)}</title>
	<meta name="description" content="${escape(locale.metaDescription)}">
	<meta name="theme-color" content="#f5f7fa" id="themeColorMeta">
	<link rel="canonical" href="${canonical}">
	${alternate}
	<link rel="alternate" hreflang="x-default" href="${site}/en-us/">
	<meta property="og:type" content="website"><meta property="og:title" content="${escape(locale.metaTitle)}"><meta property="og:description" content="${escape(locale.metaDescription)}"><meta property="og:url" content="${canonical}">
	<link rel="icon" href="https://d2b8lqy494c4mo.cloudfront.net/mss/images/favicon.ico">
	<link rel="preload" href="${prefix}assets/fonts/montserrat-latin.woff2" as="font" type="font/woff2" crossorigin>
	<link rel="stylesheet" href="${prefix}assets/fonts/montserrat.css">
	<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
	<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@500;600;700&family=Noto+Sans+SC:wght@500;600;700&display=swap" media="print" onload="this.media='all'">
	<noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@500;600;700&family=Noto+Sans+SC:wght@500;600;700&display=swap"><style>.gallery-track{display:block}</style></noscript>
	<link rel="stylesheet" href="${prefix}assets/site.css">
	<script>try{document.documentElement.dataset.theme=localStorage.getItem('mira-theme')||'light'}catch(e){document.documentElement.dataset.theme='light'}</script>
	<script type="application/ld+json">${schema}</script>
</head>
<body>
	<a class="skip-link" href="#main">${escape(locale.skip)}</a>${draft}
	<header class="site-header" id="siteHeader"><div class="nav-shell">
		<a class="brand" href="#overview" aria-label="miraAI"><img src="${prefix}assets/miraai-white-horizontal.svg" alt="miraAI" width="151" height="42"></a>
		<nav class="desktop-nav" aria-label="Primary">${nav}</nav>
		<div class="nav-actions">
			<div class="language"><button class="icon-button language-button" type="button" aria-label="${escape(locale.language)}: ${current.label}" aria-expanded="false" aria-controls="languageMenu">${icon("globe")}<span>${current.label}</span>${icon("chevron")}</button><div class="language-menu" id="languageMenu" hidden>${langLinks}</div></div>
			<button class="icon-button theme-button" type="button" aria-label="${escape(locale.theme)}">${icon("sun")}</button>
			<a class="button button-small desktop-cta" href="${common.briefingUrl}">${escape(locale.briefing)}</a>
			<button class="icon-button menu-button" type="button" aria-expanded="false" aria-controls="mobileNav" aria-label="${escape(locale.menu)}">${icon("menu")}</button>
		</div>
	</div><nav class="mobile-nav" id="mobileNav" aria-label="Mobile" hidden>${nav}<a class="button" href="${common.briefingUrl}">${escape(locale.briefing)}</a></nav></header>
	<main id="main">
		<section class="hero" id="overview"><div class="hero-aurora" aria-hidden="true"></div><div class="shell hero-grid">
			<div class="hero-copy"><p class="eyebrow" data-entrance>${escape(locale.hero.eyebrow)}</p><h1 data-entrance>${escape(locale.hero.title)}</h1><p class="hero-text" data-entrance>${escape(locale.hero.text)}</p><div class="hero-actions" data-entrance><a class="button" href="${common.briefingUrl}">${escape(locale.briefing)} ${icon("arrow")}</a><a class="button button-secondary" href="#platform">${escape(locale.hero.secondary)}</a></div><ul class="hero-points" data-entrance>${locale.hero.points.map(point => `<li>${icon("check")}${escape(point)}</li>`).join("")}</ul></div>
			<div class="hero-product" data-entrance><div class="product-bar"><span></span><span></span><span></span><strong>miraAI</strong></div><div class="product-canvas"><p>${escape(locale.hero.visualTitle)}</p><div class="flow">${locale.hero.visualSteps.map((step, index) => `<div><span>0${index + 1}</span><strong>${escape(step)}</strong></div>`).join("")}</div></div></div>
		</div></section>
		<section class="section" id="value"><div class="shell"><header class="section-heading reveal"><p class="eyebrow">${escape(locale.value.eyebrow)}</p><h2>${escape(locale.value.title)}</h2><p>${escape(locale.value.text)}</p></header><div class="value-grid">${outcomeCards}</div></div></section>
		<section class="section platform-section" id="platform"><div class="shell"><header class="section-heading section-heading-light reveal"><p class="eyebrow">${escape(locale.platform.eyebrow)}</p><h2>${escape(locale.platform.title)}</h2><p>${escape(locale.platform.text)}</p></header><div class="platform-story"><div class="platform-visual" aria-hidden="true"><div class="orbit orbit-a"></div><div class="orbit orbit-b"></div><div class="platform-core">miraAI</div>${orbitLabels}</div><div class="platform-steps">${platformSteps}</div></div></div></section>
		<section class="section" id="security"><div class="shell"><header class="section-heading reveal"><p class="eyebrow">${escape(locale.assurance.eyebrow)}</p><h2>${escape(locale.assurance.title)}</h2><p>${escape(locale.assurance.text)}</p></header><div class="assurance-grid">${assurance}</div></div></section>
		<section class="section case-section" id="use-cases"><div class="shell"><header class="section-heading reveal"><p class="eyebrow">${escape(locale.useCases.eyebrow)}</p><h2>${escape(locale.useCases.title)}</h2><p>${escape(locale.useCases.text)}</p></header><div class="gallery reveal" data-gallery><div class="gallery-viewport"><div class="gallery-track">${slides}</div><div class="gallery-progress" data-gallery-progress></div></div><div class="gallery-controls"><button class="gallery-arrow" type="button" data-gallery-prev aria-label="${escape(locale.useCases.previous)}">${icon("arrow")}</button><div class="gallery-dots">${dots}</div><p class="gallery-status" aria-live="polite" data-status-template="${escape(locale.useCases.status)}"></p><button class="gallery-arrow" type="button" data-gallery-next aria-label="${escape(locale.useCases.next)}">${icon("arrow")}</button></div></div></div></section>
		<section class="section integrations-section"><div class="shell"><header class="section-heading reveal"><p class="eyebrow">${escape(locale.integrations.eyebrow)}</p><h2>${escape(locale.integrations.title)}</h2><p>${escape(locale.integrations.text)}</p></header><div class="integration-grid">${integrations}</div></div></section>
		<section class="section delivery-section"><div class="shell split-heading"><header class="section-heading reveal"><p class="eyebrow">${escape(locale.deployment.eyebrow)}</p><h2>${escape(locale.deployment.title)}</h2><p>${escape(locale.deployment.text)}</p></header><ol class="delivery-list">${deployment}</ol></div></section>
		<section class="section" id="resources"><div class="shell"><header class="section-heading reveal"><p class="eyebrow">${escape(locale.resources.eyebrow)}</p><h2>${escape(locale.resources.title)}</h2></header><div class="resource-grid">${resources}</div></div></section>
		<section class="section faq-section"><div class="shell faq-layout"><header class="section-heading reveal"><p class="eyebrow">${escape(locale.faq.eyebrow)}</p><h2>${escape(locale.faq.title)}</h2></header><div class="faq-list reveal">${faq}</div></div></section>
		<section class="section cta-section"><div class="shell"><div class="cta-panel reveal"><p class="eyebrow">${escape(locale.cta.eyebrow)}</p><h2>${escape(locale.cta.title)}</h2><p>${escape(locale.cta.text)}</p><a class="button button-light" href="${common.briefingUrl}">${escape(locale.briefing)} ${icon("arrow")}</a><small>${escape(locale.cta.note)}</small></div></div></section>
	</main>
	<footer class="footer"><div class="shell footer-grid"><div><img src="${prefix}assets/miracle-logo-white.svg" alt="Miracle Software Systems" width="188" height="42"><p>${escape(locale.footer.text)}</p></div><nav aria-label="${escape(locale.footer.company)}"><strong>${escape(locale.footer.company)}</strong><a href="https://www.miraclesoft.com/company/">Miracle Software Systems</a><a href="https://www.miraclesoft.com/company/global-presence">Global Presence</a></nav><nav aria-label="${escape(locale.footer.product)}"><strong>${escape(locale.footer.product)}</strong><a href="${common.productUrl}">miraAI</a><a href="#platform">${escape(locale.nav[2])}</a></nav><nav aria-label="${escape(locale.footer.connect)}"><strong>${escape(locale.footer.connect)}</strong><a href="${common.briefingUrl}">${escape(locale.briefing)}</a><a href="https://www.miraclesoft.com/privacy-policy">${escape(locale.footer.privacy)}</a></nav></div><div class="shell footer-bottom">© 2026 Miracle Software Systems, Inc. ${escape(locale.footer.rights)}</div></footer>
	<script src="${prefix}assets/site.js" defer></script>
</body></html>`;
}

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content, "utf8");
}

validate();
if (process.argv.includes("--validate")) process.exit(0);
if (process.argv.includes("--validate-site")) { validateSite(); process.exit(0); }

common.languages.forEach(language => write(path.join(root, language.path, "index.html"), render(locales[language.code], language.code)));
write(path.join(root, "index.html"), render(locales["en-US"], "en-US", true));
const urls = ["", ...common.languages.map(language => `${language.path}/`)];
write(path.join(root, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map(url => `\n  <url><loc>${site}/${url}</loc></url>`).join("")}\n</urlset>\n`);
write(path.join(root, "robots.txt"), `User-agent: *\nAllow: /\nSitemap: ${site}/sitemap.xml\n`);
console.log(`Built ${common.languages.length + 1} pages.`);
