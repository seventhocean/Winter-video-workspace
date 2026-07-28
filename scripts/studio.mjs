import {getProjectDir, remotionBin, run} from "./lib.mjs";

const projectDir = getProjectDir(process.argv[2]);
run(remotionBin, ["studio", "src/index.ts"], {cwd: projectDir});
