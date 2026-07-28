import {existsSync, lstatSync, mkdirSync, symlinkSync} from "node:fs";
import path from "node:path";
import {getProjectDir} from "./lib.mjs";

const projectDir = getProjectDir(process.argv[2]);
const source = path.resolve(process.argv[3] ?? "");
const alias = process.argv[4] ?? path.basename(source);

if (!existsSync(source)) {
  throw new Error(`素材不存在：${source}`);
}
if (alias.includes("/") || alias === "." || alias === "..") {
  throw new Error("素材别名只能是文件名，不能包含目录");
}

const publicDir = path.join(projectDir, "public");
const target = path.join(publicDir, alias);
mkdirSync(publicDir, {recursive: true});

if (existsSync(target) || (() => {
  try {
    lstatSync(target);
    return true;
  } catch {
    return false;
  }
})()) {
  throw new Error(`目标已经存在：${target}`);
}

symlinkSync(source, target);
console.log(`已建立素材链接：${target} -> ${source}`);
