import {existsSync, readFileSync} from "node:fs";
import os from "node:os";
import path from "node:path";
import {spawnSync} from "node:child_process";
import {fileURLToPath} from "node:url";

const workspaceRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const explicitRoot = process.env.THREEUI_ROOT
  ? path.resolve(process.env.THREEUI_ROOT)
  : null;
const candidates = explicitRoot
  ? [explicitRoot]
  : [
      path.resolve(workspaceRoot, "..", "threeui"),
      path.join(os.homedir(), "Documents", "Project", "threeui"),
    ];
const required = [
  "package.json",
  "LICENSE",
  "ASSET-LICENSES.md",
  "FONT-LICENSES.md",
  "public/community-sync-report.json",
  "src/data/shaders.tsx",
  "src/package-components",
];
const threeuiRoot = candidates.find((candidate) =>
  required.every((item) => existsSync(path.join(candidate, item))),
);

if (!threeuiRoot) {
  console.error("找不到可用的 ThreeUI 可选资产库。");
  console.error(`已检查：${candidates.join("、")}`);
  console.error("可克隆到工作区同级 threeui，或设置 THREEUI_ROOT。");
  process.exit(1);
}

if (existsSync(path.join(threeuiRoot, "node_modules"))) {
  console.error(`ThreeUI 应保持为源码资产库，不应安装独立依赖：${threeuiRoot}`);
  process.exit(1);
}

const git = spawnSync("git", ["-C", threeuiRoot, "rev-parse", "HEAD"], {
  encoding: "utf8",
});
if (git.status !== 0) {
  console.error(`ThreeUI 不是有效 Git 仓库：${threeuiRoot}`);
  process.exit(1);
}

const manifest = JSON.parse(
  readFileSync(path.join(threeuiRoot, "package.json"), "utf8"),
);
const report = JSON.parse(
  readFileSync(
    path.join(threeuiRoot, "public", "community-sync-report.json"),
    "utf8",
  ),
);

console.log(`ThreeUI 可选资产库可用：${threeuiRoot}`);
console.log(`源码提交：${git.stdout.trim()}`);
console.log(`社区包：${manifest.name}@${manifest.version}`);
console.log(
  `目录口径：${report.communityParents} 个父组件、${report.communityRoutes} 条路由、${report.communityVariants} 个变体`,
);
console.log("依赖策略：源码只读，未安装独立 node_modules");
