const http = require("http");
const fs = require("fs");
const path = require("path");
const os = require("os");
const { spawn } = require("child_process");

const root = path.resolve(__dirname, "..");
const port = 4173;
const debugPort = 9222;

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
    if (error) {
      response.writeHead(404).end();
      return;
    }
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
      });
    },
    close() { socket.close(); }
  };
}

async function waitFor(client, expression) {
  for (let attempt = 0; attempt < 50; attempt += 1) {
    const result = await client.send("Runtime.evaluate", { expression, returnByValue: true });
    if (result.result.value) return result.result.value;
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  throw new Error(`Timed out waiting for: ${expression}`);
}

async function run() {
  const server = http.createServer(serveFile);
  await new Promise(resolve => server.listen(port, "127.0.0.1", resolve));
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), "miraai-chrome-"));
  const chromeLog = [];
  const chrome = spawn(chromePath, [
    "--headless=new", "--disable-gpu", "--no-sandbox", "--no-first-run", "--no-default-browser-check",
    `--remote-debugging-port=${debugPort}`, `--user-data-dir=${profile}`,
    `http://127.0.0.1:${port}/en-us/`
  ], { stdio: ["ignore", "ignore", "pipe"] });
  chrome.stderr.on("data", chunk => chromeLog.push(String(chunk)));

  try {
    let target;
    try {
      target = await waitForTarget();
    } catch (error) {
      throw new Error(`${error.message}\nChrome stderr:\n${chromeLog.join("").slice(0, 2000)}`);
    }
    const client = createClient(target.webSocketDebuggerUrl);
    await client.ready;
    await client.send("Runtime.enable");
    await waitFor(client, "document.readyState === 'complete' && !!document.querySelector('.platform-section .section-heading h2')");

    const light = await client.send("Runtime.evaluate", {
      expression: `JSON.stringify({
        platform: getComputedStyle(document.querySelector('.platform-section .section-heading h2')).color,
        delivery: getComputedStyle(document.querySelector('.delivery-section .section-heading h2')).color,
        french: new URL(document.querySelector('.language-menu a[lang="fr"]').getAttribute('href'), location.href).pathname
      })`,
      returnByValue: true
    });
    if (typeof light.result.value !== "string") throw new Error(`Browser evaluation failed: ${JSON.stringify(light)}`);
    const lightResult = JSON.parse(light.result.value);
    if (lightResult.platform !== "rgb(255, 255, 255)" || lightResult.delivery !== "rgb(255, 255, 255)") throw new Error(`Dark-band title contrast failed: ${JSON.stringify(lightResult)}`);
    if (lightResult.french !== "/fr/") throw new Error(`Language route resolved to ${lightResult.french}`);

    await client.send("Runtime.evaluate", { expression: "localStorage.setItem('mira-theme','dark'); location.reload()" });
    await waitFor(client, "document.readyState === 'complete' && document.documentElement.dataset.theme === 'dark'");
    const dark = await client.send("Runtime.evaluate", {
      expression: `JSON.stringify({
        standard: getComputedStyle(document.querySelector('#value .section-heading h2')).color,
        platform: getComputedStyle(document.querySelector('.platform-section .section-heading h2')).color
      })`,
      returnByValue: true
    });
    if (typeof dark.result.value !== "string") throw new Error(`Dark-theme evaluation failed: ${JSON.stringify(dark)}`);
    const darkResult = JSON.parse(dark.result.value);
    if (darkResult.standard !== "rgb(247, 249, 252)" || darkResult.platform !== "rgb(255, 255, 255)") throw new Error(`Dark-theme title contrast failed: ${JSON.stringify(darkResult)}`);

    client.close();
    console.log("Browser smoke test passed: locale routes and section title contrast are correct.");
  } finally {
    chrome.kill();
    server.close();
    await new Promise(resolve => {
      if (chrome.exitCode !== null) resolve();
      else chrome.once("exit", resolve);
    });
    for (let attempt = 0; attempt < 10; attempt += 1) {
      try {
        fs.rmSync(profile, { recursive: true, force: true });
        break;
      } catch (error) {
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
