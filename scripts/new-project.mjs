import {cpSync, existsSync, mkdirSync, readFileSync, writeFileSync} from "node:fs";
import path from "node:path";
import {
  getDatedProjectDir,
  requireProjectDate,
  requireSlug,
  requireWinterVideoSkillRoot,
  workspaceRoot,
} from "./lib.mjs";

const slug = requireSlug(process.argv[2]);
const date = requireProjectDate(
  process.argv[3] ?? new Date().toISOString().slice(0, 10),
);
const projectId = `${date}/${slug}`;
const target = getDatedProjectDir(date, slug);
const skillRoot = requireWinterVideoSkillRoot();
const template = path.join(skillRoot, "assets", "remotion-project-base");

if (existsSync(target)) {
  throw new Error(`项目已经存在：${target}`);
}
if (!existsSync(path.join(template, "src", "Root.tsx"))) {
  throw new Error(`winter-video-create 公共工程底座不完整：${template}`);
}

mkdirSync(path.dirname(target), {recursive: true});
cpSync(template, target, {recursive: true});

writeFileSync(
  path.join(target, "project.json"),
  `${JSON.stringify(
    {
      slug,
      projectId,
      created: date,
      workspace: workspaceRoot,
      template: "winter-video-create/remotion-project-base",
      templateSource: template,
      sourcePolicy: "link-only",
      dependencyPolicy: "workspace-shared",
      deliveryStatus: "draft",
      lifecycle: {
        state: "active",
        retentionDays: 30,
        keep: false,
        deleteAfter: null,
      },
    },
    null,
    2,
  )}\n`,
);

const specPath = path.join(target, "work", "制作规格.md");
const spec = readFileSync(specPath, "utf8")
  .replaceAll("{{PROJECT_SLUG}}", slug)
  .replaceAll("{{CREATED_DATE}}", date);
writeFileSync(specPath, spec);

console.log(`已创建项目：${target}`);
console.log(`项目标识：${projectId}`);
console.log(`下一步：npm run link-asset -- ${projectId} /绝对路径/口播.mov source.mov`);
