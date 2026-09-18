const http = require("http");
const fs = require("fs");
const path = require("path");
const os = require("os");
const { spawn } = require("child_process");

const root = path.resolve(__dirname, "..");
const port = 4440;
const debugPort = 9440;
const outDir = path.join(root, "assets");

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
  const pathname = decodeURIComponent(new URL(request.url, `http://127.0.0.1:${port}`).pathname);
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
        }, 8000);
      });
    },
    close() { socket.close(); }
  };
}

async function run() {
  const server = http.createServer(serveFile);
  await new Promise(resolve => server.listen(port, "127.0.0.1", resolve));
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), "miraai-og-"));
  const chrome = spawn(resolveChrome(), [
    "--headless=new", "--disable-gpu", "--no-sandbox", "--no-first-run", "--no-default-browser-check",
    "--hide-scrollbars", `--remote-debugging-port=${debugPort}`, `--user-data-dir=${profile}`,
    `http://127.0.0.1:${port}/tools/og-card.html`
  ], { stdio: ["ignore", "ignore", "ignore"] });

  try {
    const target = await waitForTarget();
    const client = createClient(target.webSocketDebuggerUrl);
    await Promise.race([client.ready, new Promise((_, reject) => setTimeout(() => reject(new Error("WS open timeout")), 8000))]);
    await client.send("Runtime.enable");
    await client.send("Page.enable");

    await client.send("Emulation.setDeviceMetricsOverride", { width: 1200, height: 630, deviceScaleFactor: 1, mobile: false });
    await client.send("Page.navigate", { url: `http://127.0.0.1:${port}/tools/og-card.html` });
    for (let i = 0; i < 60; i += 1) {
      await new Promise(resolve => setTimeout(resolve, 150));
      const ready = await client.send("Runtime.evaluate", { expression: "document.fonts && document.fonts.status" });
      if (String(ready.result.value).toLowerCase() === "loaded") break;
    }
    await new Promise(resolve => setTimeout(resolve, 600));
    let shot = await client.send("Page.captureScreenshot", { format: "png" });
    fs.writeFileSync(path.join(outDir, "og-image.png"), Buffer.from(shot.data, "base64"));

    await client.send("Emulation.setDeviceMetricsOverride", { width: 180, height: 180, deviceScaleFactor: 1, mobile: false });
    await client.send("Page.navigate", { url: `http://127.0.0.1:${port}/assets/favicon.svg` });
    await new Promise(resolve => setTimeout(resolve, 900));
    shot = await client.send("Page.captureScreenshot", { format: "png", clip: { x: 0, y: 0, width: 180, height: 180, scale: 1 } });
    fs.writeFileSync(path.join(outDir, "apple-touch-icon.png"), Buffer.from(shot.data, "base64"));

    client.close();
    const og = fs.statSync(path.join(outDir, "og-image.png"));
    const ati = fs.statSync(path.join(outDir, "apple-touch-icon.png"));
    console.log(`og-image.png ${og.size} bytes; apple-touch-icon.png ${ati.size} bytes`);
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