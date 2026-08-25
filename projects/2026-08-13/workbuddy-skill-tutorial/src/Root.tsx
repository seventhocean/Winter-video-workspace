import type {CalculateMetadataFunction} from "remotion";
import {Composition} from "remotion";
import {Main} from "./Main";
import type {ProjectProps, Timeline} from "./schema";
import rawTimeline from "../work/timeline.json";

const timeline = rawTimeline as Timeline;

const calculateMetadata: CalculateMetadataFunction<ProjectProps> = ({
  props,
}) => ({
  durationInFrames: Math.ceil(props.timeline.duration * props.timeline.fps),
  fps: props.timeline.fps,
});

export const Root = () => (
  <>
    <Composition
      id="Main"
      component={Main}
      durationInFrames={timeline.duration * timeline.fps}
      fps={timeline.fps}
      width={1920}
      height={1080}
      calculateMetadata={calculateMetadata}
      defaultProps={{sourceFile: "", debugSafeZones: false, timeline}}
    />
    <Composition
      id="Main43"
      component={Main}
      durationInFrames={timeline.duration * timeline.fps}
      fps={timeline.fps}
      width={1440}
      height={1080}
      calculateMetadata={calculateMetadata}
      defaultProps={{sourceFile: "", debugSafeZones: false, timeline}}
    />
    <Composition
      id="Main43HQ"
      component={Main}
      durationInFrames={timeline.duration * timeline.fps}
      fps={timeline.fps}
      width={1920}
      height={1440}
      calculateMetadata={calculateMetadata}
      defaultProps={{sourceFile: "", debugSafeZones: false, timeline}}
    />
    <Composition
      id="MainPortrait"
      component={Main}
      durationInFrames={timeline.duration * timeline.fps}
      fps={timeline.fps}
      width={1080}
      height={1920}
      calculateMetadata={calculateMetadata}
      defaultProps={{sourceFile: "", debugSafeZones: false, timeline}}
    />
    <Composition
      id="Main4K"
      component={Main}
      durationInFrames={timeline.duration * timeline.fps}
      fps={timeline.fps}
      width={3840}
      height={2160}
      calculateMetadata={calculateMetadata}
      defaultProps={{sourceFile: "", debugSafeZones: false, timeline}}
    />
    <Composition
      id="MainPortrait4K"
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
