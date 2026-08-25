import {existsSync, readdirSync} from "node:fs";
import {fileURLToPath} from "node:url";
import path from "node:path";
import {spawnSync} from "node:child_process";

export const workspaceRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);

export const projectsRoot = path.join(workspaceRoot, "projects");

const winterVideoSkillCandidates = [
  process.env.WINTER_VIDEO_CREATE_SKILL_ROOT,
  path.join(workspaceRoot, ".codex", "skills", "winter-video-create"),
  "/Users/winter/Documents/Project/Winter-private-skill/winter-video-create",
].filter(Boolean);

export const winterVideoSkillRoot = winterVideoSkillCandidates.find((candidate) =>
  existsSync(path.join(candidate, "SKILL.md")),
);

export const requireWinterVideoSkillRoot = () => {
  if (!winterVideoSkillRoot) {
    throw new Error(
      "找不到 winter-video-create Skill；可设置 WINTER_VIDEO_CREATE_SKILL_ROOT",
    );
  }
  return winterVideoSkillRoot;
};

export const requireSlug = (value) => {
  if (!value || !/^[a-z0-9][a-z0-9-]*$/.test(value)) {
    throw new Error("项目名必须使用小写字母、数字和连字符，例如 2026-07-28-ai-video");
  }
  return value;
};

export const requireProjectDate = (value) => {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    throw new Error("项目日期必须使用 YYYY-MM-DD，例如 2026-08-13");
  }

  const parsed = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== value) {
    throw new Error(`项目日期无效：${value}`);
  }
  return value;
};

export const getDatedProjectDir = (date, slug) =>
  path.join(projectsRoot, requireProjectDate(date), requireSlug(slug));

export const listProjectDirs = () => {
  if (!existsSync(projectsRoot)) return [];

  const projects = [];
  for (const entry of readdirSync(projectsRoot, {withFileTypes: true})) {
    if (!entry.isDirectory()) continue;
    const entryDir = path.join(projectsRoot, entry.name);

    // 兼容日期分层启用前的 projects/<项目名>/ 旧工程，包括早期未写 project.json 的工程。
    if (!/^\d{4}-\d{2}-\d{2}$/.test(entry.name)) {
      projects.push(entryDir);
      continue;
    }

    // 极少数旧工程可能恰好只用日期命名，优先按工程识别。
    if (existsSync(path.join(entryDir, "project.json"))) {
      projects.push(entryDir);
      continue;
    }

    for (const child of readdirSync(entryDir, {withFileTypes: true})) {
      if (!child.isDirectory()) continue;
      projects.push(path.join(entryDir, child.name));
    }
  }
  return projects.sort();
};

export const getProjectDir = (reference) => {
  if (!reference) {
    throw new Error("缺少项目名；可使用 <项目名> 或 <YYYY-MM-DD>/<项目名>");
  }

  const parts = reference.split("/");
  if (parts.length === 2) {
    const projectDir = getDatedProjectDir(parts[0], parts[1]);
    if (!existsSync(projectDir)) {
      throw new Error(`项目不存在：${projectDir}`);
    }
    return projectDir;
  }
  if (parts.length !== 1) {
    throw new Error(`项目标识无效：${reference}`);
  }

  const slug = requireSlug(reference);
  const matches = listProjectDirs().filter(
    (projectDir) => path.basename(projectDir) === slug,
  );
  if (matches.length === 0) {
    throw new Error(`项目不存在：${slug}`);
  }
  if (matches.length > 1) {
    const choices = matches
      .map((projectDir) => path.relative(projectsRoot, projectDir))
      .join("、");
    throw new Error(`存在多个同名项目，请使用完整标识：${choices}`);
  }
  return matches[0];
};

export const remotionBin = path.join(
  workspaceRoot,
  "node_modules",
  ".bin",
  "remotion",
);

export const publicDirArg = (projectDir) =>
  `--public-dir=${path.join(projectDir, "public")}`;

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
