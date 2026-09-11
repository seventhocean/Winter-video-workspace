import {existsSync} from "node:fs";
import path from "node:path";
import {spawnSync} from "node:child_process";
import {
  projectsRoot,
  listProjectDirs,
  remotionBin,
  requireWinterVideoSkillRoot,
  workspaceRoot,
} from "./lib.mjs";

let winterVideoSkillRoot;
try {
  winterVideoSkillRoot = requireWinterVideoSkillRoot();
} catch (error) {
  console.error(error.message);
  process.exit(1);
}

const projectBase = path.join(
  winterVideoSkillRoot,
  "assets",
  "remotion-project-base",
);

const required = [
  "package.json",
  "package-lock.json",
  "README.md",
  "node_modules",
  "projects",
  "projects/.gitkeep",
  "scripts",
  "scripts/project-lifecycle.mjs",
  "scripts/projects-status.mjs",
  "scripts/set-retention.mjs",
  "scripts/cleanup-projects.mjs",
  "scripts/audit-workspace.mjs",
  "shared",
  "cache",
  "docs/history",
];

const requiredProjectBase = [
  "src/schema.ts",
  "src/Main.tsx",
  "src/components/Stage.tsx",
  "src/components/BaseVideo.tsx",
  "src/components/ReferenceGradeTalkingHeadStage.tsx",
  "src/components/SubtitleLayer.tsx",
  "src/components/SafeZone.tsx",
  "work/timeline.json",
  "work/制作规格.md",
];

let failed = false;
for (const item of required) {
  const absolute = path.join(workspaceRoot, item);
  if (!existsSync(absolute)) {
    failed = true;
    console.error(`缺少：${absolute}`);
  }
}

for (const item of requiredProjectBase) {
  const absolute = path.join(projectBase, item);
  if (!existsSync(absolute)) {
    failed = true;
    console.error(`Skill 公共工程底座缺少：${absolute}`);
  }
}

if (!existsSync(remotionBin)) {
  failed = true;
  console.error(`缺少 Remotion CLI：${remotionBin}`);
}

const projects = listProjectDirs();

for (const projectDir of projects) {
  const localModules = path.join(projectDir, "node_modules");
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
console.log(`视频 Skill：${winterVideoSkillRoot}`);
console.log(`工程底座：${projectBase}`);
console.log(`共享依赖：${path.join(workspaceRoot, "node_modules")}`);
console.log(`项目数量：${projects.length}`);
