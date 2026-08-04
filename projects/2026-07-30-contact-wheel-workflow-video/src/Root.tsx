import type {CalculateMetadataFunction} from "remotion";
import {Composition} from "remotion";
import {FullEdit} from "./FullEdit";
import {Main} from "./Main";
import type {StageKitProps, Timeline} from "./schema";
import {ReusableWorkflow} from "./slots/ReusableWorkflow";
import {SkillReveal} from "./slots/SkillReveal";
import {TechBasis} from "./slots/TechBasis";
import {TemplateReel} from "./slots/TemplateReel";
import {TemplateStacked} from "./slots/TemplateStacked";
import {TimeSaving} from "./slots/TimeSaving";
import {UseCases} from "./slots/UseCases";
import {WheelPrinciple} from "./slots/WheelPrinciple";
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
      id="ContactWheelFinal"
      component={FullEdit}
      durationInFrames={3379}
      fps={30}
      width={1920}
      height={1080}
    />
    <Composition id="TechBasis" component={TechBasis} durationInFrames={142} fps={30} width={1920} height={1080} />
    <Composition id="WheelPrinciple" component={WheelPrinciple} durationInFrames={256} fps={30} width={1920} height={1080} />
    <Composition id="SkillReveal" component={SkillReveal} durationInFrames={181} fps={30} width={1920} height={1080} />
    <Composition id="TemplateReel" component={TemplateReel} durationInFrames={170} fps={30} width={1920} height={1080} />
    <Composition id="TemplateStacked" component={TemplateStacked} durationInFrames={123} fps={30} width={1920} height={1080} />
    <Composition id="UseCases" component={UseCases} durationInFrames={127} fps={30} width={1920} height={1080} />
    <Composition id="ReusableWorkflow" component={ReusableWorkflow} durationInFrames={295} fps={30} width={1920} height={1080} />
    <Composition id="TimeSaving" component={TimeSaving} durationInFrames={202} fps={30} width={1920} height={1080} />
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
