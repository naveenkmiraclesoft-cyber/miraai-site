const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const siteUrl = (process.env.SITE_URL || "https://naveenkmiraclesoft-cyber.github.io/miraai-site").replace(/\/+$/, "");
const siteOrigin = siteUrl.replace(/^https?:\/\//, "");
const scanFiles = ["index.html", ...commonPaths(), "404.html"];
const errors = [];
const checked = { internal: 0, anchors: 0, external: 0 };

function commonPaths() {
  const languages = require("../src/content").common.languages;
  return languages.map(language => `${language.path}/index.html`);
}

function pageFiles() {
  return [
    path.join(root, "index.html"),
    ...scanFiles.filter(name => name !== "index.html").map(name => path.join(root, name))
  ];
}

function resolveFrom(rootDir, target) {
  const resolved = path.normalize(path.join(rootDir, target));
  if (!resolved.startsWith(root)) return null;
  return resolved;
}

function repoFileForUrl(url) {
  const rest = url.replace(/^https?:\/\//, "").slice(siteOrigin.length);
  const slug = decodeURIComponent(rest.replace(/^\//, ""));
  return slug === "" ? path.join(root, "index.html") : resolveFrom(root, slug);
}

function findIds(source) {
  const ids = new Set();
  for (const match of source.matchAll(/<[^>]*\bid="([^"]+)"/g)) ids.add(match[1]);
  return ids;
}

function checkResource(url, dir, ids) {
  if (!url || url === "#" || url === "") return;
  if (url.startsWith("#")) {
    checked.anchors += 1;
    const target = decodeURIComponent(url.slice(1));
    if (!ids.has(target)) errors.push(`missing anchor #${target}`);
    return;
  }
  if (url.startsWith("http://") || url.startsWith("https://")) {
    if (url.replace(/^https?:\/\//, "").startsWith(siteOrigin)) {
      checked.internal += 1;
      const file = repoFileForUrl(url);
      if (!file) return errors.push(`unmapped site URL ${url}`);
      if (!fs.existsSync(file)) return errors.push(`missing file for ${url} (${file})`);
      return;
    }
    checked.external += 1;
    externals.push(url);
    return;
  }
  checked.internal += 1;
  const file = resolveFrom(dir, url.split("#")[0]);
  if (!file) return errors.push(`URL escapes site root: ${url}`);
  let exists = fs.existsSync(file);
  if (!exists && !path.extname(url)) exists = fs.existsSync(path.join(file, "index.html"));
  if (!exists) errors.push(`missing file for ${url}`);
}

const externals = [];

pageFiles().forEach(file => {
  if (!fs.existsSync(file)) { errors.push(`page missing: ${file}`); return; }
  const html = fs.readFileSync(file, "utf8");
  const ids = findIds(html);
  const dir = path.dirname(file);
  for (const match of html.matchAll(/(?:href|src)="([^"]*)"/g)) checkResource(match[1], dir, ids);
  for (const match of html.matchAll(/<(?:meta|link)[^>]*?(?:property="og:image"|name="twitter:image")[^>]*?content="([^"]*)"/g)) checkResource(match[1], dir, ids);
});

(async () => {
  if (process.argv.includes("--external")) {
    for (const url of new Set(externals)) {
      try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 8000);
        const response = await fetch(url, { method: "HEAD", redirect: "follow", signal: controller.signal });
        clearTimeout(timer);
        if (response.status >= 400) console.warn(`WARN external ${response.status} ${url}`);
      } catch (error) {
        console.warn(`WARN external unreachable ${url}: ${error.message}`);
      }
    }
  }

  if (errors.length) {
    errors.forEach(error => console.error(`ERROR ${error}`));
    console.log(`-- ${errors.length} ${errors.length === 1 ? "error" : "errors"} (${checked.internal} internal links, ${checked.anchors} anchors, ${checked.external} external)`);
    process.exitCode = 1;
  } else {
    console.log(`Link integrity OK: ${checked.internal} internal resources, ${checked.anchors} hash anchors, ${checked.external} external links (${externals.length} unique)`);
  }
})();