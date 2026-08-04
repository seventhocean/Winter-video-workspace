import {existsSync} from "node:fs";
import path from "node:path";
import {spawnSync} from "node:child_process";
import {getProjectDir, workspaceRoot} from "./lib.mjs";

const projectDir = getProjectDir(process.argv[2]);
const relativeScript = process.argv[3] ?? "scripts/capture-pages.mjs";
const script = path.resolve(projectDir, relativeScript);
const relativeToProject = path.relative(projectDir, script);

if (
  relativeToProject.startsWith("..") ||
  path.isAbsolute(relativeToProject) ||
  !existsSync(script)
) {
  throw new Error(`采集脚本必须位于项目目录内：${script}`);
}

const chromeCandidates = [
  process.env.PUPPETEER_EXECUTABLE_PATH,
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Google Chrome Canary.app/Contents/MacOS/Google Chrome Canary",
].filter(Boolean);
const chrome = chromeCandidates.find((candidate) => existsSync(candidate));

if (!chrome) {
  throw new Error("找不到可供 Puppeteer 使用的 Google Chrome");
}

const result = spawnSync(process.execPath, [script], {
  cwd: projectDir,
  stdio: "inherit",
  env: {
    ...process.env,
    NODE_PATH: path.join(workspaceRoot, "node_modules"),
    PUPPETEER_EXECUTABLE_PATH: chrome,
  },
});

if (result.error) throw result.error;
if (result.status !== 0) process.exit(result.status ?? 1);
