import path from "node:path";
import {getProjectDir, publicDirArg, remotionBin, run} from "./lib.mjs";

const slug = process.argv[2];
const composition = process.argv[3];
const frame = process.argv[4] ?? "0";
if (!composition) {
  throw new Error("用法：npm run still -- <项目名> <Composition> [帧号] [输出文件名]");
}

const projectDir = getProjectDir(slug);
const outputName = process.argv[5] ?? `${composition}-frame-${frame}.png`;
if (outputName.includes("/") || outputName === "." || outputName === "..") {
  throw new Error("输出名称只能是文件名");
}

run(
  remotionBin,
  [
    "still",
    "src/index.ts",
    composition,
    path.join("output", outputName),
    `--frame=${frame}`,
    publicDirArg(projectDir),
  ],
  {cwd: projectDir},
);
