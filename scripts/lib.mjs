import {existsSync} from "node:fs";
import {fileURLToPath} from "node:url";
import path from "node:path";
import {spawnSync} from "node:child_process";

export const workspaceRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);

export const projectsRoot = path.join(workspaceRoot, "projects");

export const requireSlug = (value) => {
  if (!value || !/^[a-z0-9][a-z0-9-]*$/.test(value)) {
    throw new Error("项目名必须使用小写字母、数字和连字符，例如 2026-07-28-ai-video");
  }
  return value;
};

export const getProjectDir = (slug) => {
  const projectDir = path.join(projectsRoot, requireSlug(slug));
  if (!existsSync(projectDir)) {
    throw new Error(`项目不存在：${projectDir}`);
  }
  return projectDir;
};

export const remotionBin = path.join(
  workspaceRoot,
  "node_modules",
  ".bin",
  "remotion",
);

export const run = (command, args, options = {}) => {
  const result = spawnSync(command, args, {
    stdio: "inherit",
    ...options,
  });
  if (result.error) {
    throw result.error;
  }
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
};
