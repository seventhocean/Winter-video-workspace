import {
  cpSync,
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import os from "node:os";
import path from "node:path";
import {
  getDatedProjectDir,
  requireProjectDate,
  requireSlug,
  workspaceRoot,
} from "./lib.mjs";

const slug = requireSlug(process.argv[2]);
const date = requireProjectDate(
  process.argv[3] ?? new Date().toISOString().slice(0, 10),
);
const projectId = `${date}/${slug}`;
const target = getDatedProjectDir(date, slug);
const skillRoot =
  process.env.SHOTCRAFT_SKILL_ROOT ??
  path.join(os.homedir(), ".codex", "skills", "video-shotcraft");
const template = path.join(skillRoot, "template");
const captureTemplate = path.join(
  skillRoot,
  "assets",
  "scripts",
  "capture-template.mjs",
);

if (existsSync(target)) {
  throw new Error(`项目已经存在：${target}`);
}
if (!existsSync(path.join(skillRoot, "SKILL.md"))) {
  throw new Error(`找不到 video-shotcraft Skill：${skillRoot}`);
}
if (!existsSync(template) || !existsSync(captureTemplate)) {
  throw new Error(`video-shotcraft 模板不完整：${skillRoot}`);
}

mkdirSync(path.dirname(target), {recursive: true});
cpSync(template, target, {
  recursive: true,
  filter: (source) => {
    const name = path.basename(source);
    return !["node_modules", "out", "package.json", "package-lock.json"].includes(
      name,
    );
  },
});

mkdirSync(path.join(target, "scripts"), {recursive: true});
mkdirSync(path.join(target, "work"), {recursive: true});
mkdirSync(path.join(target, "output"), {recursive: true});

const captureScript = readFileSync(captureTemplate, "utf8")
  .replace("OUT_DIR: '../../public/textures/live'", "OUT_DIR: '../public/textures/live'")
  .replace("LAYOUT_JSON: '../../src/live-layout.json'", "LAYOUT_JSON: '../src/live-layout.json'");
writeFileSync(path.join(target, "scripts", "capture-pages.mjs"), captureScript);

writeFileSync(
  path.join(target, "project.json"),
  `${JSON.stringify(
    {
      slug,
      projectId,
      created: date,
      workspace: workspaceRoot,
      template: "video-shotcraft",
      templateSource: template,
      sourcePolicy: "link-only",
      dependencyPolicy: "workspace-shared",
      deliveryStatus: "draft",
    },
    null,
    2,
  )}\n`,
);

writeFileSync(
  path.join(target, "work", "制作规格.md"),
  `---\n项目: ${slug}\n创建日期: ${date}\n模板: video-shotcraft\n状态: 草稿\n---\n# 制作规格\n\n- 目标：基于 Shotcraft 镜头语言制作高质量产品动效。\n- 默认 Composition：\`AiflPromo\`（1920×1080、30fps）。\n- 素材规则：真实页面先采集全页 2x 截图、元素切片和 layout.json。\n- 改造规则：保留节奏骨架，按本期内容重做页面素材、文案、镜头与声音钉帧。\n- 验收：每个镜头检查入场、动作峰值、落定三帧，再检查整片节奏与清晰度。\n`,
);

console.log(`已创建 Shotcraft 项目：${target}`);
console.log(`项目标识：${projectId}`);
console.log(`预览：npm run studio -- ${projectId}`);
console.log(`采集网页：npm run shotcraft:capture -- ${projectId}`);
console.log(`静帧：npm run still -- ${projectId} AiflPromo 150`);
