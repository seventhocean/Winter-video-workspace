import {cpSync, existsSync, mkdirSync, readFileSync, writeFileSync} from "node:fs";
import path from "node:path";
import {projectsRoot, requireSlug, workspaceRoot} from "./lib.mjs";

const slug = requireSlug(process.argv[2]);
const date = process.argv[3] ?? new Date().toISOString().slice(0, 10);
const target = path.join(projectsRoot, slug);
const template = path.join(workspaceRoot, "templates", "remotion-project");

if (existsSync(target)) {
  throw new Error(`项目已经存在：${target}`);
}

mkdirSync(projectsRoot, {recursive: true});
cpSync(template, target, {recursive: true});

writeFileSync(
  path.join(target, "project.json"),
  `${JSON.stringify(
    {
      slug,
      created: date,
      workspace: workspaceRoot,
      sourcePolicy: "link-only",
      deliveryStatus: "draft",
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
console.log(`下一步：npm run link-asset -- ${slug} /绝对路径/口播.mov source.mov`);
