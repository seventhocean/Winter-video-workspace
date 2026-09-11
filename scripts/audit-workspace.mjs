import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { listProjectDirs, workspaceRoot } from "./lib.mjs";
import {
  formatBytes,
  measureDirectory,
  projectIdFor,
} from "./project-lifecycle.mjs";

const allowedTopLevel = new Set([
  ".codex",
  ".git",
  ".github",
  ".gitignore",
  "AGENTS.md",
  "LICENSE",
  "README.md",
  "cache",
  "docs",
  "node_modules",
  "package-lock.json",
  "package.json",
  "projects",
  "scripts",
  "shared",
]);

const residueNames = new Set([".DS_Store", "Thumbs.db"]);
const nestedEnvironmentNames = new Set([
  ".git",
  ".venv",
  "node_modules",
  "venv",
]);

const walk = (root, visit, shouldDescend = () => true) => {
  if (!existsSync(root)) return;
  for (const entry of readdirSync(root, { withFileTypes: true })) {
    const absolute = path.join(root, entry.name);
    visit(absolute, entry);
    if (
      entry.isDirectory() &&
      !entry.isSymbolicLink() &&
      shouldDescend(absolute, entry)
    ) {
      walk(absolute, visit, shouldDescend);
    }
  }
};

const unexpectedTopLevel = readdirSync(workspaceRoot).filter(
  (name) => !allowedTopLevel.has(name) && !residueNames.has(name),
);

const residues = [];
walk(
  workspaceRoot,
  (absolute, entry) => {
    if (residueNames.has(entry.name)) residues.push(absolute);
  },
  (_absolute, entry) => ![".git", "node_modules"].includes(entry.name),
);

const nestedEnvironments = [];
for (const projectDir of listProjectDirs()) {
  walk(
    projectDir,
    (absolute, entry) => {
      if (entry.isDirectory() && nestedEnvironmentNames.has(entry.name)) {
        nestedEnvironments.push(path.relative(workspaceRoot, absolute));
      }
    },
    (_absolute, entry) => !nestedEnvironmentNames.has(entry.name),
  );
}

const manifest = JSON.parse(
  readFileSync(path.join(workspaceRoot, "package.json"), "utf8"),
);
const scriptSources = readdirSync(path.join(workspaceRoot, "scripts"))
  .filter((name) => name.endsWith(".mjs"))
  .map((name) => ({
    name,
    source: readFileSync(path.join(workspaceRoot, "scripts", name), "utf8"),
  }));
const commandText = Object.values(manifest.scripts ?? {}).join("\n");
const orphanScripts = scriptSources
  .filter(({ name }) => {
    if (commandText.includes(name)) return false;
    return !scriptSources.some(
      ({ name: otherName, source }) =>
        otherName !== name && source.includes(name),
    );
  })
  .map(({ name }) => name);

const cacheRoot = path.join(workspaceRoot, "cache");
const cacheRows = readdirSync(cacheRoot, { withFileTypes: true })
  .filter((entry) => ![".gitkeep", "README.md"].includes(entry.name))
  .map((entry) => {
    const absolute = path.join(cacheRoot, entry.name);
    const usage = entry.isDirectory()
      ? measureDirectory(absolute).visibleBytes
      : statSync(absolute).size;
    return { 缓存: entry.name, 大小: formatBytes(usage) };
  });

const projectRows = listProjectDirs().map((projectDir) => ({
  项目: projectIdFor(projectDir),
  项目配置: existsSync(path.join(projectDir, "project.json")) ? "正常" : "缺失",
}));

console.log("工作区沉淀审计");
console.log(`根目录：${workspaceRoot}`);
console.log(`项目数量：${projectRows.length}`);
console.table(projectRows);

if (cacheRows.length) {
  console.log("共享缓存：");
  console.table(cacheRows);
} else {
  console.log("共享缓存：空");
}

const issues = [
  ...unexpectedTopLevel.map((item) => `意外的顶层内容：${item}`),
  ...residues.map((item) => `系统残留：${path.relative(workspaceRoot, item)}`),
  ...nestedEnvironments.map((item) => `项目内重复环境：${item}`),
  ...orphanScripts.map((item) => `没有命令或内部引用的脚本：scripts/${item}`),
];

if (issues.length) {
  console.log("需要处理：");
  for (const issue of issues) console.log(`- ${issue}`);
  process.exitCode = 1;
} else {
  console.log("结果：没有发现顶层残留、孤立脚本或项目内重复依赖。");
}
