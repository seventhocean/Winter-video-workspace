import {existsSync, readFileSync, rmSync} from "node:fs";
import os from "node:os";
import path from "node:path";
import {spawnSync} from "node:child_process";
import {pathToFileURL} from "node:url";
import {workspaceRoot} from "./lib.mjs";

const skillRoot =
  process.env.SHOTCRAFT_SKILL_ROOT ??
  path.join(os.homedir(), ".codex", "skills", "video-shotcraft");
const chrome = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const packages = [
  "puppeteer",
  "three",
  "@react-three/fiber",
  "@remotion/three",
  "@remotion/motion-blur",
];
let failed = false;

const fail = (message) => {
  failed = true;
  console.error(`缺少：${message}`);
};

for (const file of [
  path.join(skillRoot, "SKILL.md"),
  path.join(skillRoot, "template", "src", "index.ts"),
  path.join(skillRoot, "assets", "scripts", "capture-template.mjs"),
  chrome,
]) {
  if (!existsSync(file)) fail(file);
}

for (const name of packages) {
  const manifest = path.join(workspaceRoot, "node_modules", name, "package.json");
  if (!existsSync(manifest)) {
    fail(name);
    continue;
  }
  const {version} = JSON.parse(readFileSync(manifest, "utf8"));
  console.log(`${name}: ${version}`);
}

for (const [command, versionArg] of [
  ["node", "--version"],
  ["ffmpeg", "-version"],
  ["ffprobe", "-version"],
  ["uv", "--version"],
]) {
  const result = spawnSync(command, [versionArg], {
    stdio: "ignore",
  });
  if (result.status !== 0) fail(`命令 ${command}`);
}

if (!failed) {
  const screenshot = path.join(os.tmpdir(), `shotcraft-browser-${process.pid}.png`);
  try {
    const puppeteerUrl = pathToFileURL(
      path.join(workspaceRoot, "node_modules", "puppeteer", "lib", "puppeteer", "puppeteer.js"),
    );
    const {default: puppeteer} = await import(puppeteerUrl.href);
    const browser = await puppeteer.launch({executablePath: chrome, headless: true});
    const page = await browser.newPage();
    await page.setViewport({width: 640, height: 360, deviceScaleFactor: 2});
    await page.setContent("<main style='font:48px sans-serif'>Shotcraft OK</main>");
    await page.screenshot({path: screenshot});
    await browser.close();
    if (!existsSync(screenshot)) fail("Puppeteer 截图输出");
  } finally {
    rmSync(screenshot, {force: true});
  }
}

if (failed) process.exit(1);
console.log(`video-shotcraft 环境可用：${workspaceRoot}`);
