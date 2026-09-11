import {listProjectDirs} from "./lib.mjs";
import {
  formatBytes,
  lifecycleFor,
  measureDirectory,
  projectIdFor,
  readProject,
} from "./project-lifecycle.mjs";

const now = Date.now();
const rows = [];
let visibleTotal = 0;
let exclusiveTotal = 0;
let hardlinkedTotal = 0;

for (const projectDir of listProjectDirs()) {
  const project = readProject(projectDir);
  const lifecycle = lifecycleFor(project);
  const usage = measureDirectory(projectDir);
  visibleTotal += usage.visibleBytes;
  exclusiveTotal += usage.exclusiveBytes;
  hardlinkedTotal += usage.hardlinkedBytes;

  const due =
    lifecycle.state === "delivered" &&
    !lifecycle.keep &&
    lifecycle.deleteAfter &&
    new Date(lifecycle.deleteAfter).getTime() <= now;

  rows.push({
    项目: projectIdFor(projectDir),
    状态: project ? lifecycle.state : "需检查",
    保留: lifecycle.keep ? "永久" : `${lifecycle.retentionDays}天`,
    删除日: lifecycle.deleteAfter?.slice(0, 10) ?? "—",
    到期: due ? "是" : "否",
    可释放: formatBytes(usage.exclusiveBytes),
    目录可见: formatBytes(usage.visibleBytes),
  });
}

console.table(rows);
console.log(`项目数量：${rows.length}`);
console.log(`目录可见总量：${formatBytes(visibleTotal)}`);
console.log(`项目独占、删除可释放：${formatBytes(exclusiveTotal)}`);
console.log(`与原片共享的硬链接：${formatBytes(hardlinkedTotal)}`);
