import {
  copyFileSync,
  createReadStream,
  existsSync,
  mkdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} from "node:fs";
import {createHash} from "node:crypto";
import path from "node:path";
import {getProjectDir} from "./lib.mjs";

const hashFile = async (file) => {
  const hash = createHash("sha256");
  for await (const chunk of createReadStream(file)) {
    hash.update(chunk);
  }
  return hash.digest("hex");
};

const recordDelivery = (projectDir, source, target, sha256) => {
  const projectPath = path.join(projectDir, "project.json");
  if (!existsSync(projectPath)) {
    console.warn(`项目缺少 project.json，已完成交付但无法登记生命周期：${projectPath}`);
    return;
  }

  const project = JSON.parse(readFileSync(projectPath, "utf8"));
  const existingDeliveries = Array.isArray(project.deliveries)
    ? project.deliveries
    : project.delivery
      ? [project.delivery]
      : [];
  const previousDelivery = existingDeliveries.find(
    (entry) => entry.path === target && entry.sha256 === sha256,
  );
  const sameRecordedDelivery = Boolean(previousDelivery);
  const deliveredAt =
    (sameRecordedDelivery && previousDelivery?.deliveredAt) ||
    new Date().toISOString();
  const configuredRetention = Number(project.lifecycle?.retentionDays ?? 30);
  const retentionDays =
    Number.isInteger(configuredRetention) && configuredRetention > 0
      ? configuredRetention
      : 30;
  const keep = project.lifecycle?.keep === true;
  const deleteAfter = keep
    ? null
    : new Date(
        new Date(deliveredAt).getTime() + retentionDays * 24 * 60 * 60 * 1000,
      ).toISOString();

  project.deliveryStatus = "delivered";
  const relativeSource = path.relative(projectDir, source);
  const delivery = {
    source: relativeSource.startsWith("..") ? source : relativeSource,
    path: target,
    sha256,
    deliveredAt,
  };
  project.delivery = delivery;
  project.deliveries = [
    ...existingDeliveries.filter((entry) => entry.path !== target),
    delivery,
  ];
  project.lifecycle = {
    state: "delivered",
    retentionDays,
    keep,
    deleteAfter,
  };
  writeFileSync(projectPath, `${JSON.stringify(project, null, 2)}\n`);
};

const projectDir = getProjectDir(process.argv[2]);
const sourceArg = process.argv[3];
const deliveryDirArg = process.argv[4];
const outputName = process.argv[5];

if (!sourceArg || !deliveryDirArg) {
  throw new Error(
    "用法：npm run deliver -- <项目名> <工程内输出或绝对路径> <当天交付目录> [交付文件名]",
  );
}

const source = path.isAbsolute(sourceArg)
  ? sourceArg
  : path.resolve(projectDir, sourceArg);
if (!existsSync(source) || !statSync(source).isFile()) {
  throw new Error(`成片不存在：${source}`);
}

const deliveryDir = path.resolve(deliveryDirArg);
mkdirSync(deliveryDir, {recursive: true});
const target = path.join(deliveryDir, outputName ?? path.basename(source));

const sourceHash = await hashFile(source);
if (existsSync(target)) {
  const targetHash = await hashFile(target);
  if (sourceHash === targetHash) {
    recordDelivery(projectDir, source, target, sourceHash);
    console.log(`交付文件已经存在且哈希一致：${target}`);
    console.log("已补记交付状态与清理日期。");
    process.exit(0);
  }
  throw new Error(`交付目录存在同名但内容不同的文件：${target}`);
}

copyFileSync(source, target);
const targetHash = await hashFile(target);
if (sourceHash !== targetHash) {
  throw new Error("复制完成但哈希不一致，已停止交付");
}

recordDelivery(projectDir, source, target, targetHash);

console.log(`交付完成：${target}`);
console.log(`SHA-256：${targetHash}`);
console.log("已登记交付状态；可用 npm run projects 查看预计清理日期。");
