const http = require("http");
const fs = require("fs");
const path = require("path");
const os = require("os");
const { spawn } = require("child_process");

const root = path.resolve(__dirname, "..");
const port = 4266;
const debugPort = 9305;

function resolveChrome() {
  if (process.env.CHROME_PATH && fs.existsSync(process.env.CHROME_PATH)) return process.env.CHROME_PATH;
  const candidates = [
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
    "/usr/bin/google-chrome",
    "/usr/bin/google-chrome-stable",
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
  ];
  const found = candidates.find(candidate => fs.existsSync(candidate));
  if (!found) throw new Error("Chrome not found. Set CHROME_PATH to a Chrome executable.");
  return found;
}

const chromePath = resolveChrome();

function serveFile(request, response) {
  const pathname = decodeURIComponent(new URL(request.url, `http://127.0.0.1:${port}`).pathname);
  let file = path.join(root, pathname);
  if (pathname.endsWith("/")) file = path.join(file, "index.html");
  if (!file.startsWith(root)) {
    response.writeHead(403).end();
    return;
  }
  fs.readFile(file, (error, data) => {
    if (error) { response.writeHead(404).end(); return; }
    const extension = path.extname(file);
    const contentType = extension === ".css" ? "text/css" : extension === ".js" ? "text/javascript" : extension === ".svg" ? "image/svg+xml" : "text/html";
    response.writeHead(200, { "Content-Type": `${contentType}; charset=utf-8` });
    response.end(data);
  });
}

async function waitForTarget(attempts = 120) {
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    try {
      const targets = await fetch(`http://127.0.0.1:${debugPort}/json/list`).then(response => response.json());
      const page = targets.find(target => target.type === "page" && target.url.includes(`/en-us/`));
      if (page) return page;
    } catch (error) {}
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  throw new Error("Chrome DevTools target did not become available.");
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
          if (pending.has(requestId)) {
            pending.delete(requestId);
            reject(new Error(`CDP ${method} timed out`));
          }
        }, 8000);
      });
    },
    close() { socket.close(); }
  };
}

async function waitFor(client, expression) {
  for (let attempt = 0; attempt < 100; attempt += 1) {
    const result = await client.send("Runtime.evaluate", { expression, returnByValue: true });
    if (result.result.value) return result.result.value;
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  throw new Error(`Timed out waiting for: ${expression}`);
}

async function sample(client, expression, intervalMs, count) {
  const values = [];
  for (let i = 0; i < count; i += 1) {
    const result = await client.send("Runtime.evaluate", { expression, returnByValue: true });
    values.push(result.result.value);
    await new Promise(resolve => setTimeout(resolve, intervalMs));
  }
  return values;
}

async function waitUntil(client, expression, timeoutMs) {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    const result = await client.send("Runtime.evaluate", { expression, returnByValue: true });
    if (result.result.value) return result.result.value;
    await new Promise(resolve => setTimeout(resolve, 200));
  }
  return null;
}

async function run() {
  const server = http.createServer(serveFile);
  await new Promise(resolve => server.listen(port, "127.0.0.1", resolve));
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), "miraai-auto-"));
  const chromeLog = [];
  const chrome = spawn(chromePath, [
    "--headless=new", "--disable-gpu", "--no-sandbox", "--no-first-run", "--no-default-browser-check",
    "--disable-background-timer-throttling", "--disable-renderer-backgrounding", "--disable-backgrounding-occluded-windows",
    `--remote-debugging-port=${debugPort}`, `--user-data-dir=${profile}`,
    `http://127.0.0.1:${port}/en-us/`
  ], { stdio: ["ignore", "ignore", "pipe"] });
  chrome.stderr.on("data", chunk => chromeLog.push(String(chunk)));

  try {
    let target;
    try { target = await waitForTarget(); } catch (error) {
      throw new Error(`${error.message}\nChrome stderr:\n${chromeLog.join("").slice(0, 2000)}`);
    }
    console.log("autonomous: target attached");
    const client = createClient(target.webSocketDebuggerUrl);
    await Promise.race([client.ready, new Promise((resolve, reject) => setTimeout(() => reject(new Error("WebSocket open timed out")), 8000))]);
    console.log("autonomous: socket open");
    await client.send("Runtime.enable");
    const initialMedia = JSON.parse((await client.send("Runtime.evaluate", { expression: "JSON.stringify({reduce: matchMedia('(prefers-reduced-motion: reduce)').matches, quiet: matchMedia('(prefers-reduced-motion: no-preference)').matches})", returnByValue: true })).result.value);
    console.log("autonomous: initial motion preference ->", JSON.stringify(initialMedia));
    await client.send("Emulation.setDeviceMetricsOverride", { width: 1440, height: 2200, deviceScaleFactor: 1, mobile: false });
    await client.send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-reduced-motion", value: "no-preference" }] });
    await client.send("Page.reload");
    await waitFor(client, "document.readyState === 'complete' && !!document.querySelector('.sim[data-autonomous=\"hero\"]')");
    const motion = JSON.parse((await client.send("Runtime.evaluate", { expression: "JSON.stringify({reduce: matchMedia('(prefers-reduced-motion: reduce)').matches})", returnByValue: true })).result.value);
    if (motion.reduce) throw new Error("Failed to emulate no-preference motion");
    console.log("autonomous: page loaded, motion no-preference");
    const probe = JSON.parse((await client.send("Runtime.evaluate", { expression: "JSON.stringify({slides: document.querySelectorAll('.theater-slide').length, prev: document.querySelectorAll('[data-theater-prev]').length, next: document.querySelectorAll('[data-theater-next]').length, dots: document.querySelectorAll('[data-theater-dot]').length, toggle: document.querySelectorAll('.theater [data-autoplay]').length, isStatic: document.querySelector('.theater').classList.contains('is-static'), status: document.querySelector('.theater [data-status-template]').textContent})", returnByValue: true })).result.value);
    console.log("autonomous: theater probe ->", JSON.stringify(probe));
    await client.send("Runtime.evaluate", { expression: "document.querySelector('.theater [data-theater-next]').click()" });
    const manual = (await client.send("Runtime.evaluate", { expression: "document.querySelector('.theater [data-status-template]').textContent", returnByValue: true })).result.value;
    console.log("autonomous: after manual next ->", manual);

    if (!(await client.send("Runtime.evaluate", { expression: "!!document.querySelector('.theater[data-autonomous=\"theater\"]')", returnByValue: true })).result.value) {
      throw new Error("Theater demo not found");
    }

    const resultSeen = await sample(client, "document.querySelector('.sim-result').classList.contains('is-visible')", 200, 45);
    if (!resultSeen.some(visible => visible)) throw new Error("Hero simulation never reached the result state");
    const activeSteps = await sample(client, "document.querySelectorAll('.sim [data-sim-step].is-active').length", 200, 45);
    if (Math.max(...activeSteps) < 4) throw new Error(`Hero simulation never lit all 4 steps (max ${Math.max(...activeSteps)})`);

    const theatreAdvanced = await waitUntil(client, "document.querySelector('.theater [data-status-template]').textContent.indexOf('Scenario 2') === 0", 15000);
    console.log("autonomous: theater advanced ->", theatreAdvanced);
    if (!theatreAdvanced) throw new Error("Theater did not auto-advance to scenario 2");
    const beforeKeys = (await client.send("Runtime.evaluate", { expression: "document.querySelector('.theater [data-status-template]').textContent", returnByValue: true })).result.value;
    await client.send("Runtime.evaluate", { expression: "document.querySelector('.theater[data-autonomous]').dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }))" });
    const afterKeys = (await client.send("Runtime.evaluate", { expression: "document.querySelector('.theater [data-status-template]').textContent", returnByValue: true })).result.value;
    if (afterKeys === beforeKeys) throw new Error(`Theater arrow keys did not advance: ${beforeKeys}`);

    await client.send("Runtime.evaluate", { expression: "document.querySelector('.hero-toggle').click()" });
    const paused = await client.send("Runtime.evaluate", { expression: "JSON.stringify({pressed: document.querySelector('.hero-toggle').getAttribute('aria-pressed'), label: document.querySelector('.hero-toggle [data-autoplay-label]').textContent})", returnByValue: true });
    const pausedState = JSON.parse(paused.result.value);
    if (pausedState.pressed !== "false" || pausedState.label !== "Play") throw new Error(`Pause toggle failed: ${JSON.stringify(pausedState)}`);
    await client.send("Runtime.evaluate", { expression: "document.querySelector('.hero-toggle').click()" });
    const resumed = JSON.parse((await client.send("Runtime.evaluate", { expression: "JSON.stringify({pressed: document.querySelector('.hero-toggle').getAttribute('aria-pressed'), label: document.querySelector('.hero-toggle [data-autoplay-label]').textContent})", returnByValue: true })).result.value);
    if (resumed.pressed !== "true" || resumed.label !== "Pause") throw new Error(`Resume toggle failed: ${JSON.stringify(resumed)}`);

    await client.send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-reduced-motion", value: "reduce" }] });
    await client.send("Page.reload");
    await waitFor(client, "document.readyState === 'complete' && !!document.querySelector('.sim[data-autonomous=\"hero\"]')");
    const reduced = JSON.parse((await client.send("Runtime.evaluate", { expression: "JSON.stringify({heroStatic: document.querySelector('.sim').classList.contains('is-static'), resultVisible: document.querySelector('.sim-result').classList.contains('is-visible'), theaterStatic: document.querySelector('.theater').classList.contains('is-static'), status: document.querySelector('.theater [data-status-template]').textContent})", returnByValue: true })).result.value);
    if (!reduced.heroStatic || !reduced.resultVisible || !reduced.theaterStatic || reduced.status !== "Scenario 1 of 3") {
      throw new Error(`Reduced-motion static state failed: ${JSON.stringify(reduced)}`);
    }
    await new Promise(resolve => setTimeout(resolve, 1500));
    const afterWait = (await client.send("Runtime.evaluate", { expression: "document.querySelector('.theater [data-status-template]').textContent", returnByValue: true })).result.value;
    if (afterWait !== "Scenario 1 of 3") throw new Error(`Reduced-motion auto-advanced: ${afterWait}`);

    client.close();
    console.log("Autonomous test passed: hero cycle, theater advance, play/pause, reduced-motion static.");
  } finally {
    chrome.kill();
    server.close();
    await new Promise(resolve => {
      if (chrome.exitCode !== null) resolve();
      else chrome.once("exit", resolve);
    });
    for (let attempt = 0; attempt < 10; attempt += 1) {
      try { fs.rmSync(profile, { recursive: true, force: true }); break; } catch (error) {
        if (attempt === 9) console.warn(`Could not remove temporary Chrome profile: ${profile}`);
        else await new Promise(resolve => setTimeout(resolve, 150));
      }
    }
  }
}

run().catch(error => {
  console.error(error.message);
  process.exitCode = 1;
});