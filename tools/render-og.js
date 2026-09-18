const http = require("http");
const fs = require("fs");
const path = require("path");
const os = require("os");
const { spawn } = require("child_process");
const { common, locales } = require("../src/content");

const root = path.resolve(__dirname, "..");
const port = 4440;
const debugPort = 9440;
const outDir = path.join(root, "assets");
const base = `http://127.0.0.1:${port}`;

function escape(value) {
  return String(value).replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
}

function cardHtml(language) {
  const locale = locales[language.code] || locales["en-US"];
  const cjk = language.code === "ja" ? "@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@600;700&display=swap');" : language.code === "zh-Hans" ? "@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@600;700&display=swap');" : "";
  const font = `'Noto Sans JP','Noto Sans SC'`;
  return `<!DOCTYPE html>
<html lang="${language.code}">
<head>
<meta charset="utf-8">
<style>
@import url('${base}/assets/fonts/montserrat.css');
${cjk}
html,body{margin:0;padding:0}
body{width:1200px;height:630px;overflow:hidden;background:radial-gradient(900px 460px at 82% -12%,rgba(0,170,231,.32),transparent 60%),radial-gradient(720px 440px at 10% 112%,rgba(60,130,240,.26),transparent 60%),#0a1224;color:#fff;font-family:Montserrat,${font},Arial,sans-serif}
.card{box-sizing:border-box;width:1200px;height:630px;padding:62px 84px 54px;display:flex;flex-direction:column;justify-content:space-between}
.logo{width:196px;display:block}
.eyebrow{font-size:17px;font-weight:600;letter-spacing:.22em;text-transform:uppercase;color:#7fd8ff;margin:0 0 16px}
h1{font-size:52px;line-height:1.12;font-weight:700;letter-spacing:-.01em;margin:0;max-width:1000px}
.sub{margin:20px 0 0;font-size:22px;line-height:1.5;color:rgba(255,255,255,.74);max-width:900px}
.foot{display:flex;align-items:center;gap:20px}
.pill{background:#0a94cf;color:#fff;border-radius:999px;font-size:18px;font-weight:600;padding:13px 26px;white-space:nowrap}
.foot small{color:rgba(255,255,255,.55);font-size:16px;letter-spacing:.06em}
</style>
</head>
<body>
<div class="card">
  <div><img class="logo" src="${base}/assets/miraai-white-horizontal.svg" alt="miraAI"></div>
  <div>
    <p class="eyebrow">${escape(locale.hero.eyebrow)}</p>
    <h1>${escape(locale.hero.title)}</h1>
    <p class="sub">${escape(locale.metaDescription)}</p>
  </div>
  <div class="foot"><span class="pill">${escape(locale.briefing)}</span><small>MIRACLESOFT.COM</small></div>
</div>
</body>
</html>`;
}

function resolveChrome() {
  const candidates = [
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe"
  ];
  const found = candidates.find(candidate => fs.existsSync(candidate));
  if (!found) throw new Error("Chrome not found");
  return found;
}

function serveFile(request, response) {
  const url = new URL(request.url, `${base}`);
  const pathname = decodeURIComponent(url.pathname);
  if (pathname === "/__card") {
    const language = common.languages.find(item => item.code === url.searchParams.get("lang")) || common.languages[0];
    response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    response.end(cardHtml(language));
    return;
  }
  let file = path.join(root, pathname);
  if (pathname.endsWith("/")) file = path.join(file, "index.html");
  if (!file.startsWith(root)) { response.writeHead(403).end(); return; }
  fs.readFile(file, (error, data) => {
    if (error) { response.writeHead(404).end(); return; }
    const ext = path.extname(file);
    const type = ext === ".css" ? "text/css" : ext === ".svg" ? "image/svg+xml" : ext === ".woff2" ? "font/woff2" : "text/html";
    response.writeHead(200, { "Content-Type": `${type}; charset=utf-8` });
    response.end(data);
  });
}

async function waitForTarget(attempts = 120) {
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    try {
      const targets = await fetch(`http://127.0.0.1:${debugPort}/json/list`).then(r => r.json());
      const page = targets.find(t => t.type === "page");
      if (page) return page;
    } catch (error) {}
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  throw new Error("CDP target did not become available");
}

function createClient(url) {
  const socket = new WebSocket(url);
  let id = 0;
  const pending = new Map();
  socket.addEventListener("message", event => {
    const message = JSON.parse(event.data);
    if (!message.id || !pending.has(message.id)) return;
    const { resolve, reject } = pending.get(message.id);
    pending.delete(message.id);
    if (message.error) reject(new Error(message.error.message));
    else resolve(message.result);
  });
  return {
    ready: new Promise((resolve, reject) => {
      socket.addEventListener("open", resolve, { once: true });
      socket.addEventListener("error", reject, { once: true });
    }),
    send(method, params = {}) {
      id += 1;
      const requestId = id;
      return new Promise((resolve, reject) => {
        pending.set(requestId, { resolve, reject });
        socket.send(JSON.stringify({ id: requestId, method, params }));
        setTimeout(() => {
          if (pending.has(requestId)) { pending.delete(requestId); reject(new Error(`CDP ${method} timed out`)); }
        }, 12000);
      });
    },
    close() { socket.close(); }
  };
}

async function waitFonts(client) {
  for (let attempt = 0; attempt < 80; attempt += 1) {
    try {
      await client.send("Runtime.evaluate", { expression: "document.fonts.ready", awaitPromise: true });
      break;
    } catch (error) {
      await new Promise(resolve => setTimeout(resolve, 150));
    }
  }
  await new Promise(resolve => setTimeout(resolve, 600));
}

async function run() {
  const server = http.createServer(serveFile);
  await new Promise(resolve => server.listen(port, "127.0.0.1", resolve));
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), "miraai-og-"));
  const chrome = spawn(resolveChrome(), [
    "--headless=new", "--disable-gpu", "--no-sandbox", "--no-first-run", "--no-default-browser-check",
    "--hide-scrollbars", "--font-render-hinting=none", `--remote-debugging-port=${debugPort}`, `--user-data-dir=${profile}`,
    `${base}/`
  ], { stdio: ["ignore", "ignore", "ignore"] });

  try {
    const target = await waitForTarget();
    const client = createClient(target.webSocketDebuggerUrl);
    await Promise.race([client.ready, new Promise((_, reject) => setTimeout(() => reject(new Error("WS open timeout")), 8000))]);
    await client.send("Runtime.enable");
    await client.send("Page.enable");
    await client.send("Emulation.setDeviceMetricsOverride", { width: 1200, height: 630, deviceScaleFactor: 1, mobile: false });

    const sizes = [];
    for (const language of common.languages) {
      const file = path.join(outDir, `og-${language.path}.png`);
      await client.send("Page.navigate", { url: `${base}/__card?lang=${language.code}` });
      await waitFonts(client);
      const shot = await client.send("Page.captureScreenshot", { format: "png" });
      fs.writeFileSync(file, Buffer.from(shot.data, "base64"));
      sizes.push(`og-${language.path}.png ${fs.statSync(file).size}`);
    }

    await client.send("Emulation.setDeviceMetricsOverride", { width: 180, height: 180, deviceScaleFactor: 1, mobile: false });
    await client.send("Page.navigate", { url: `${base}/assets/favicon.svg` });
    await new Promise(resolve => setTimeout(resolve, 900));
    let shot = await client.send("Page.captureScreenshot", { format: "png", clip: { x: 0, y: 0, width: 180, height: 180, scale: 1 } });
    fs.writeFileSync(path.join(outDir, "apple-touch-icon.png"), Buffer.from(shot.data, "base64"));

    client.close();
    const ati = fs.statSync(path.join(outDir, "apple-touch-icon.png"));
    console.log(`${sizes.join("; ")}; apple-touch-icon.png ${ati.size}`);
  } finally {
    chrome.kill();
    server.close();
    await new Promise(resolve => { if (chrome.exitCode !== null) resolve(); else chrome.once("exit", resolve); });
    for (let attempt = 0; attempt < 10; attempt += 1) {
      try { fs.rmSync(profile, { recursive: true, force: true }); break; } catch (error) {
        if (attempt === 9) console.warn(`Could not remove profile: ${profile}`);
        else await new Promise(resolve => setTimeout(resolve, 150));
      }
    }
  }
}

run().catch(error => { console.error(error.message); process.exitCode = 1; });