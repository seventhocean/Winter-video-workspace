import {AbsoluteFill, useCurrentFrame} from "remotion";
import type {StageScene} from "../schema";
import {progress} from "../motion";
import {theme} from "../theme";

const paths: Record<string, string> = {
  "curved-flow": "M 8 24 C 30 4, 62 82, 92 28",
  stack: "M 12 74 L 32 58 L 54 66 L 72 38 L 90 46",
  network:
    "M 12 22 C 35 22, 40 50, 50 50 C 62 50, 66 20, 88 20 M 50 50 C 45 75, 30 78, 14 82 M 50 50 C 58 74, 70 78, 88 82",
  "diagnostic-rail": "M 10 28 L 90 28 M 10 50 L 90 50 M 10 72 L 90 72",
  "split-compare":
    "M 12 50 L 42 50 M 58 50 L 88 50 M 48 42 L 54 50 L 48 58",
  "editorial-split": "M 8 18 L 42 18 M 58 82 L 92 82",
};

export const StageTopology = ({scene}: {scene: StageScene}) => {
  const frame = useCurrentFrame();
  const localOrProtected = [
    "talking-head-editorial",
    "talking-head-semantic-rail",
    "talking-head-progressive-stage",
    "presentation-protected",
    "operation-upper",
  ].includes(scene.layoutProfile);

  if (scene.topology === "none" || localOrProtected) return null;

  const draw = progress(frame, 2, 34);
  const path = paths[scene.topology] ?? paths["curved-flow"];

  return (
    <AbsoluteFill style={{pointerEvents: "none"}}>
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        style={{width: "100%", height: "100%"}}
      >
        <path
          d={path}
          fill="none"
          stroke={theme.accent}
          strokeWidth=".35"
          strokeDasharray="130"
          strokeDashoffset={130 * (1 - draw)}
          opacity=".4"
        />
      </svg>
    </AbsoluteFill>
  );
};
