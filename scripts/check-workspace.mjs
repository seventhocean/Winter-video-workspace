import {existsSync, readdirSync} from "node:fs";
import path from "node:path";
import {spawnSync} from "node:child_process";
import {projectsRoot, remotionBin, workspaceRoot} from "./lib.mjs";

const required = [
  "package.json",
  "package-lock.json",
  "node_modules",
  "projects",
  "templates/remotion-project",
  "scripts",
  "shared",
  "cache",
  "templates/remotion-project/src/schema.ts",
  "templates/remotion-project/src/Main.tsx",
  "templates/remotion-project/src/components/Stage.tsx",
  "templates/remotion-project/src/components/LayerTimeline.tsx",
  "templates/remotion-project/src/components/BaseVideo.tsx",
  "templates/remotion-project/src/components/HyperFramesOverlay.tsx",
  "templates/remotion-project/work/timeline.json",
];

let failed = false;
for (const item of required) {
  const absolute = path.join(workspaceRoot, item);
  if (!existsSync(absolute)) {
    failed = true;
    console.error(`缺少：${absolute}`);
  }
}

if (!existsSync(remotionBin)) {
  failed = true;
  console.error(`缺少 Remotion CLI：${remotionBin}`);
}

const projects = existsSync(projectsRoot)
  ? readdirSync(projectsRoot, {withFileTypes: true}).filter((item) =>
      item.isDirectory(),
    )
  : [];

for (const project of projects) {
  const localModules = path.join(projectsRoot, project.name, "node_modules");
  if (existsSync(localModules)) {
    failed = true;
    console.error(`项目中不应存在独立 node_modules：${localModules}`);
  }
}

for (const [command, versionArg] of [
  ["node", "--version"],
  ["npm", "--version"],
  ["ffmpeg", "-version"],
  ["ffprobe", "-version"],
]) {
  const result = spawnSync(command, [versionArg], {stdio: "ignore"});
  if (result.status !== 0) {
    failed = true;
    console.error(`命令不可用：${command}`);
  }
}

if (failed) {
  process.exit(1);
}

console.log(`集中工作区有效：${workspaceRoot}`);
console.log(`共享依赖：${path.join(workspaceRoot, "node_modules")}`);
console.log(`项目数量：${projects.length}`);
