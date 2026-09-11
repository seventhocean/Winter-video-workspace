import {
  existsSync,
  linkSync,
  lstatSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
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

try {
  // Remotion copies files from public/ into its render bundle but does not
  // follow symlinks. A hard link remains zero-copy while appearing as a
  // regular file to the bundler.
  linkSync(source, target);
} catch (error) {
  if (error?.code === "EXDEV") {
    throw new Error(
      `素材与工程不在同一磁盘，无法建立 Remotion 可读取的零拷贝硬链接：${source}`,
    );
  }
  throw error;
}
console.log(`已建立素材硬链接：${target} -> ${source}`);

if (/^source\.(mov|mp4|m4v|webm)$/i.test(alias)) {
  const timelinePath = path.join(projectDir, "work", "timeline.json");
  if (existsSync(timelinePath)) {
    const timeline = JSON.parse(readFileSync(timelinePath, "utf8"));
    if (timeline.mode === "talking-head-enhancement") {
      timeline.sourceFile = alias;
      writeFileSync(timelinePath, `${JSON.stringify(timeline, null, 2)}\n`);
      console.log(`已同步口播底片：work/timeline.json -> ${alias}`);
    }
  }
}
