import {existsSync, rmSync} from "node:fs";
import path from "node:path";
import {spawnSync} from "node:child_process";
import {getDatedProjectDir, workspaceRoot} from "./lib.mjs";

const slug = `shotcraft-smoke-${process.pid}`;
const date = "2026-08-03";
const projectId = `${date}/${slug}`;
const projectDir = getDatedProjectDir(date, slug);

const run = (command, args) => {
  const result = spawnSync(command, args, {
    cwd: workspaceRoot,
    stdio: "inherit",
  });
  if (result.error) throw result.error;
  if (result.status !== 0) {
    throw new Error(`${command} ${args.join(" ")} 执行失败`);
  }
};

try {
  run("node", ["scripts/check-shotcraft.mjs"]);
  run("node", ["scripts/new-shotcraft-project.mjs", slug, date]);
  run("node", ["scripts/compositions.mjs", projectId]);
  run("node", [
    "scripts/still.mjs",
    projectId,
    "AiflPromo",
    "150",
    "shotcraft-smoke.png",
  ]);
  run("node", [
    "scripts/render.mjs",
    projectId,
    "AiflPromo",
    "shotcraft-smoke.mp4",
    "--frames=0-29",
    "--crf=18",
  ]);
  run("ffprobe", [
    "-v",
    "error",
    "-show_entries",
    "format=duration",
    "-of",
    "default=noprint_wrappers=1:nokey=1",
    path.join(projectDir, "output", "shotcraft-smoke.mp4"),
  ]);

  for (const file of [
    "output/shotcraft-smoke.png",
    "output/shotcraft-smoke.mp4",
  ]) {
    if (!existsSync(path.join(projectDir, file))) {
      throw new Error(`冒烟测试缺少输出：${file}`);
    }
  }
  console.log("video-shotcraft 静帧与短视频冒烟测试通过");
} finally {
  if (existsSync(projectDir)) {
    rmSync(projectDir, {recursive: true, force: true});
  }
}
