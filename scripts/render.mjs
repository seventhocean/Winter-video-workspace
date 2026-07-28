import path from "node:path";
import {getProjectDir, remotionBin, run} from "./lib.mjs";

const slug = process.argv[2];
const composition = process.argv[3];
if (!composition) {
  throw new Error("用法：npm run render -- <项目名> <Composition> [输出文件名] [Remotion 参数]");
}

const projectDir = getProjectDir(slug);
const outputName = process.argv[4] ?? `${composition}-preview.mp4`;
if (outputName.includes("/") || outputName === "." || outputName === "..") {
  throw new Error("输出名称只能是文件名");
}

const output = path.join("output", outputName);
const extraArgs = process.argv.slice(5);
run(
  remotionBin,
  ["render", "src/index.ts", composition, output, "--codec=h264", ...extraArgs],
  {cwd: projectDir},
);
