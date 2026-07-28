import {
  copyFileSync,
  createReadStream,
  existsSync,
  mkdirSync,
  statSync,
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
    console.log(`交付文件已经存在且哈希一致：${target}`);
    process.exit(0);
  }
  throw new Error(`交付目录存在同名但内容不同的文件：${target}`);
}

copyFileSync(source, target);
const targetHash = await hashFile(target);
if (sourceHash !== targetHash) {
  throw new Error("复制完成但哈希不一致，已停止交付");
}

console.log(`交付完成：${target}`);
console.log(`SHA-256：${targetHash}`);
console.log("工程输出仍保留；确认发布后再单独清理。");
