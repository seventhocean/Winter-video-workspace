import path from "node:path";
import {getProjectDir, run, workspaceRoot} from "./lib.mjs";

const projectDir = getProjectDir(process.argv[2]);
const eslintBin = path.join(workspaceRoot, "node_modules", ".bin", "eslint");
const tscBin = path.join(workspaceRoot, "node_modules", ".bin", "tsc");

run(eslintBin, ["src"], {cwd: projectDir});
run(tscBin, ["-p", "tsconfig.json", "--noEmit"], {cwd: projectDir});
