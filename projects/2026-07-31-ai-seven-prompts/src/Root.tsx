import type {CalculateMetadataFunction} from "remotion";
import {Composition} from "remotion";
import {Main} from "./Main";
import {AiSevenPrompts, TOTAL_FRAMES} from "./AiSevenPrompts";
import type {StageKitProps, Timeline} from "./schema";
import rawTimeline from "../work/timeline.json";

const timeline = rawTimeline as Timeline;

const calculateMetadata: CalculateMetadataFunction<StageKitProps> = ({
  props,
}) => ({
  durationInFrames: Math.ceil(props.timeline.duration * props.timeline.fps),
  fps: props.timeline.fps,
});

export const Root = () => (
  <>
    <Composition
      id="AiSevenPromptsPortrait"
      component={AiSevenPrompts}
      durationInFrames={TOTAL_FRAMES}
      fps={30}
      width={1080}
      height={1920}
    />
    <Composition
      id="StageKitLandscape"
      component={Main}
      durationInFrames={timeline.duration * timeline.fps}
      fps={timeline.fps}
      width={1920}
      height={1080}
      calculateMetadata={calculateMetadata}
      defaultProps={{sourceFile: "", debugSafeZones: false, timeline}}
    />
    <Composition
      id="StageKitPortrait"
      component={Main}
      durationInFrames={timeline.duration * timeline.fps}
      fps={timeline.fps}
      width={1080}
      height={1920}
      calculateMetadata={calculateMetadata}
      defaultProps={{sourceFile: "", debugSafeZones: false, timeline}}
    />
    <Composition
      id="StageKitLandscape4K"
      component={Main}
      durationInFrames={timeline.duration * timeline.fps}
      fps={timeline.fps}
      width={3840}
      height={2160}
      calculateMetadata={calculateMetadata}
      defaultProps={{sourceFile: "", debugSafeZones: false, timeline}}
    />
    <Composition
      id="StageKitPortrait4K"
      component={Main}
      durationInFrames={timeline.duration * timeline.fps}
      fps={timeline.fps}
      width={2160}
      height={3840}
      calculateMetadata={calculateMetadata}
      defaultProps={{sourceFile: "", debugSafeZones: false, timeline}}
    />
  </>
);
