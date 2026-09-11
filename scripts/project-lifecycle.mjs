import {
  existsSync,
  lstatSync,
  readFileSync,
  readdirSync,
  statSync,
  writeFileSync,
} from "node:fs";
import {createHash} from "node:crypto";
import {createReadStream} from "node:fs";
import path from "node:path";
import {projectsRoot} from "./lib.mjs";

export const defaultRetentionDays = 30;

export const readProject = (projectDir) => {
  const projectPath = path.join(projectDir, "project.json");
  if (!existsSync(projectPath)) return null;
  return JSON.parse(readFileSync(projectPath, "utf8"));
};

export const writeProject = (projectDir, project) => {
  writeFileSync(
    path.join(projectDir, "project.json"),
    `${JSON.stringify(project, null, 2)}\n`,
  );
};

export const addDays = (iso, days) =>
  new Date(new Date(iso).getTime() + days * 24 * 60 * 60 * 1000).toISOString();

export const lifecycleFor = (project) => ({
  state:
    project?.lifecycle?.state ??
    (project?.deliveryStatus === "delivered" ? "delivered" : "active"),
  retentionDays: Number(
    project?.lifecycle?.retentionDays ?? defaultRetentionDays,
  ),
  keep: project?.lifecycle?.keep === true,
  deleteAfter: project?.lifecycle?.deleteAfter ?? null,
});

export const measureDirectory = (directory) => {
  let visibleBytes = 0;
  let hardlinkedBytes = 0;
  let exclusiveBytes = 0;

  const visit = (current) => {
    for (const entry of readdirSync(current, {withFileTypes: true})) {
      const target = path.join(current, entry.name);
      if (entry.isSymbolicLink()) continue;
      if (entry.isDirectory()) {
        visit(target);
        continue;
      }
      if (!entry.isFile()) continue;
      const stats = lstatSync(target);
      visibleBytes += stats.size;
      if (stats.nlink > 1) hardlinkedBytes += stats.size;
      else exclusiveBytes += stats.size;
    }
  };

  visit(directory);
  return {visibleBytes, hardlinkedBytes, exclusiveBytes};
};

export const formatBytes = (bytes) => {
  const units = ["B", "KB", "MB", "GB", "TB"];
  let value = bytes;
  let unit = 0;
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit += 1;
  }
  return `${value.toFixed(value >= 10 || unit === 0 ? 0 : 1)} ${units[unit]}`;
};

export const projectIdFor = (projectDir) => path.relative(projectsRoot, projectDir);

export const hashFile = async (file) => {
  const hash = createHash("sha256");
  for await (const chunk of createReadStream(file)) hash.update(chunk);
  return hash.digest("hex");
};

export const assertSafeProjectDir = (projectDir) => {
  const root = path.resolve(projectsRoot);
  const target = path.resolve(projectDir);
  if (target === root || !target.startsWith(`${root}${path.sep}`)) {
    throw new Error(`拒绝清理项目根目录之外的路径：${target}`);
  }
  if (!existsSync(path.join(target, "project.json"))) {
    throw new Error(`拒绝清理缺少 project.json 的目录：${target}`);
  }
  if (!statSync(target).isDirectory()) {
    throw new Error(`项目路径不是目录：${target}`);
  }
};
