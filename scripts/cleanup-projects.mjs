import {existsSync, readdirSync, rmdirSync, rmSync} from "node:fs";
import path from "node:path";
import {getProjectDir, listProjectDirs, projectsRoot} from "./lib.mjs";
import {
  assertSafeProjectDir,
  formatBytes,
  hashFile,
  lifecycleFor,
  measureDirectory,
  projectIdFor,
  readProject,
} from "./project-lifecycle.mjs";

const args = process.argv.slice(2);
const confirm = args.includes("--confirm");
const references = args.filter((arg) => arg !== "--confirm");
if (references.length > 1) {
  throw new Error("一次最多指定一个项目；不指定项目时检查全部到期工程");
}

const projectDirs = references.length
  ? [getProjectDir(references[0])]
  : listProjectDirs();
const now = Date.now();
const eligible = [];

for (const projectDir of projectDirs) {
  const project = readProject(projectDir);
  if (!project) continue;
  const lifecycle = lifecycleFor(project);
  const deleteAt = lifecycle.deleteAfter
    ? new Date(lifecycle.deleteAfter).getTime()
    : Number.POSITIVE_INFINITY;
  if (
    lifecycle.state === "delivered" &&
    !lifecycle.keep &&
    Number.isFinite(deleteAt) &&
    deleteAt <= now
  ) {
    eligible.push({projectDir, project, usage: measureDirectory(projectDir)});
  }
}

if (eligible.length === 0) {
  console.log("没有达到安全清理条件的项目。未做任何修改。");
  process.exit(0);
}

for (const item of eligible) {
  console.log(
    `${confirm ? "准备清理" : "可清理"}：${projectIdFor(item.projectDir)} ` +
      `（预计释放 ${formatBytes(item.usage.exclusiveBytes)}）`,
  );
}

if (!confirm) {
  const confirmCommand = references.length
    ? `npm run cleanup -- ${references[0]} --confirm`
    : "npm run cleanup -- --confirm";
  console.log(`当前为预览模式。确认后运行：${confirmCommand}`);
  process.exit(0);
}

for (const {projectDir, project} of eligible) {
  assertSafeProjectDir(projectDir);
  const deliveries = Array.isArray(project.deliveries)
    ? project.deliveries
    : project.delivery
      ? [project.delivery]
      : [];
  if (deliveries.length === 0) {
    console.warn(`跳过，没有交付记录：${projectIdFor(projectDir)}`);
    continue;
  }

  let deliveryValid = true;
  for (const delivery of deliveries) {
    if (!delivery.path || !delivery.sha256 || !existsSync(delivery.path)) {
      console.warn(
        `跳过，交付文件或哈希记录缺失：${projectIdFor(projectDir)} -> ${delivery.path ?? "未知路径"}`,
      );
      deliveryValid = false;
      break;
    }
    const actualHash = await hashFile(delivery.path);
    if (actualHash !== delivery.sha256) {
      console.warn(
        `跳过，交付文件哈希不一致：${projectIdFor(projectDir)} -> ${delivery.path}`,
      );
      deliveryValid = false;
      break;
    }
  }
  if (!deliveryValid) continue;

  rmSync(projectDir, {recursive: true, force: false});
  const dateDir = path.dirname(projectDir);
  if (dateDir !== projectsRoot && readdirSync(dateDir).length === 0) {
    rmdirSync(dateDir);
  }
  console.log(`已清理：${projectIdFor(projectDir)}`);
}
