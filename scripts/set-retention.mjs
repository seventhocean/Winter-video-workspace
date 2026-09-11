import {getProjectDir} from "./lib.mjs";
import {
  addDays,
  lifecycleFor,
  readProject,
  writeProject,
} from "./project-lifecycle.mjs";

const reference = process.argv[2];
const policy = process.argv[3];

if (!reference || !policy) {
  throw new Error(
    "用法：npm run retention -- <项目名或日期/项目名> <7|30|keep>",
  );
}

const projectDir = getProjectDir(reference);
const project = readProject(projectDir);
if (!project) throw new Error(`项目缺少 project.json：${projectDir}`);

const current = lifecycleFor(project);
if (policy === "keep") {
  project.lifecycle = {...current, keep: true, deleteAfter: null};
} else {
  const retentionDays = Number(policy);
  if (!Number.isInteger(retentionDays) || retentionDays < 1 || retentionDays > 3650) {
    throw new Error("保留天数必须是 1～3650 的整数，或使用 keep 永久保留");
  }
  const deliveredAt = project.delivery?.deliveredAt;
  project.lifecycle = {
    ...current,
    retentionDays,
    keep: false,
    deleteAfter:
      current.state === "delivered" && deliveredAt
        ? addDays(deliveredAt, retentionDays)
        : null,
  };
}

writeProject(projectDir, project);
console.log(`已更新保留策略：${reference}`);
console.log(
  project.lifecycle.keep
    ? "保留方式：永久"
    : `保留方式：交付后 ${project.lifecycle.retentionDays} 天`,
);
console.log(`预计删除日：${project.lifecycle.deleteAfter ?? "交付后计算"}`);
