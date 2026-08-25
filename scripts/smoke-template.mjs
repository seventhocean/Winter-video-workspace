import {existsSync, rmSync} from "node:fs";
import path from "node:path";
import {spawnSync} from "node:child_process";
import {getDatedProjectDir, workspaceRoot} from "./lib.mjs";

const slug = `project-base-smoke-${process.pid}`;
const date = "2026-07-28";
const projectId = `${date}/${slug}`;
const projectDir = getDatedProjectDir(date, slug);
const validator = path.join(
  workspaceRoot,
  ".codex",
  "skills",
  "winter-video-create",
  "scripts",
  "validate_timeline.py",
);

const run = (command, args, cwd = workspaceRoot) => {
  const result = spawnSync(command, args, {cwd, stdio: "inherit"});
  if (result.error) throw result.error;
  if (result.status !== 0) {
    throw new Error(`${command} ${args.join(" ")} 执行失败`);
  }
};

try {
  run("node", ["scripts/new-project.mjs", slug, date]);
  run("python3", [
    validator,
    path.join(projectDir, "work", "timeline.json"),
  ]);
  run("node", ["scripts/lint.mjs", projectId]);
  run("node", ["scripts/compositions.mjs", projectId]);
  run("node", [
    "scripts/still.mjs",
    projectId,
    "Main",
    "60",
    "smoke-landscape.png",
  ]);
  run("node", [
    "scripts/still.mjs",
    projectId,
    "MainPortrait",
    "240",
    "smoke-portrait.png",
  ]);
  run("node", [
    "scripts/still.mjs",
    projectId,
    "Main",
    "420",
    "smoke-semantic-landscape.png",
  ]);
  run("node", [
    "scripts/still.mjs",
    projectId,
    "Main",
    "480",
    "smoke-semantic-signal.png",
  ]);
  run("node", [
    "scripts/still.mjs",
    projectId,
    "MainPortrait",
    "600",
    "smoke-semantic-portrait.png",
  ]);

  for (const file of [
    "output/smoke-landscape.png",
    "output/smoke-portrait.png",
    "output/smoke-semantic-landscape.png",
    "output/smoke-semantic-signal.png",
    "output/smoke-semantic-portrait.png",
  ]) {
    if (!existsSync(path.join(projectDir, file))) {
      throw new Error(`冒烟测试缺少输出：${file}`);
    }
  }

  console.log("winter-video-create 公共工程底座冒烟测试通过");
} finally {
  if (existsSync(projectDir)) {
    rmSync(projectDir, {recursive: true, force: true});
  }
}
