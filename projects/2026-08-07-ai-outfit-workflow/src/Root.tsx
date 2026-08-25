import {Composition} from "remotion";
import {OutfitWorkflow} from "./OutfitWorkflow";
import type {Timeline} from "./schema";
import rawTimeline from "../work/timeline.json";

const timeline = rawTimeline as Timeline;

export const Root = () => (
  <Composition
    id="OutfitWorkflow3x4"
    component={OutfitWorkflow}
    durationInFrames={Math.ceil(timeline.duration * timeline.fps)}
    fps={timeline.fps}
    width={1080}
    height={1440}
  />
);
