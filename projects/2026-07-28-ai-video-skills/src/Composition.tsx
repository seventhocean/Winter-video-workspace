import {Composition, Sequence} from "remotion";
import {
  HyperFramesScene,
  RemotionScene,
  SeedanceScene,
  VideoUseScene,
} from "./Scenes";
import {OpeningManualToFourSkills} from "./OpeningScene";
import {ClosingWorkflowScene} from "./ClosingScene";

export const FPS = 30;
export const OPENING_FRAMES = 8 * FPS;
export const HYPERFRAMES_FRAMES = 11 * FPS;
export const REMOTION_FRAMES = 11 * FPS;
export const VIDEO_USE_FRAMES = 11 * FPS;
export const SEEDANCE_FRAMES = 11 * FPS;
export const CLOSING_FRAMES = 8 * FPS;
export const TOTAL_FRAMES =
  HYPERFRAMES_FRAMES +
  REMOTION_FRAMES +
  VIDEO_USE_FRAMES +
  SEEDANCE_FRAMES;
export const FULL_PREVIEW_FRAMES =
  OPENING_FRAMES + TOTAL_FRAMES + CLOSING_FRAMES;

const Combined: React.FC = () => {
  return (
    <>
      <Sequence durationInFrames={HYPERFRAMES_FRAMES}>
        <HyperFramesScene durationInFrames={HYPERFRAMES_FRAMES} />
      </Sequence>
      <Sequence from={HYPERFRAMES_FRAMES} durationInFrames={REMOTION_FRAMES}>
        <RemotionScene durationInFrames={REMOTION_FRAMES} />
      </Sequence>
      <Sequence
        from={HYPERFRAMES_FRAMES + REMOTION_FRAMES}
        durationInFrames={VIDEO_USE_FRAMES}
      >
        <VideoUseScene durationInFrames={VIDEO_USE_FRAMES} />
      </Sequence>
      <Sequence
        from={HYPERFRAMES_FRAMES + REMOTION_FRAMES + VIDEO_USE_FRAMES}
        durationInFrames={SEEDANCE_FRAMES}
      >
        <SeedanceScene durationInFrames={SEEDANCE_FRAMES} />
      </Sequence>
    </>
  );
};

const FullPreview: React.FC = () => {
  const skillsStart = OPENING_FRAMES;
  const closingStart = OPENING_FRAMES + TOTAL_FRAMES;
  return (
    <>
      <Sequence durationInFrames={OPENING_FRAMES}>
        <OpeningManualToFourSkills />
      </Sequence>
      <Sequence from={skillsStart} durationInFrames={TOTAL_FRAMES}>
        <Combined />
      </Sequence>
      <Sequence from={closingStart} durationInFrames={CLOSING_FRAMES}>
        <ClosingWorkflowScene />
      </Sequence>
    </>
  );
};

const common = {
  fps: FPS,
  width: 1920,
  height: 1080,
} as const;

export const VideoCompositions: React.FC = () => {
  return (
    <>
      <Composition
        id="OpeningManualToFourSkills"
        component={OpeningManualToFourSkills}
        durationInFrames={OPENING_FRAMES}
        {...common}
      />
      <Composition
        id="FullOneMinutePreview"
        component={FullPreview}
        durationInFrames={FULL_PREVIEW_FRAMES}
        {...common}
      />
      <Composition
        id="ClosingWorkflow"
        component={ClosingWorkflowScene}
        durationInFrames={CLOSING_FRAMES}
        {...common}
      />
      <Composition
        id="FourSkillsCombined"
        component={Combined}
        durationInFrames={TOTAL_FRAMES}
        {...common}
      />
      <Composition
        id="Skill01HyperFrames"
        component={HyperFramesScene}
        defaultProps={{durationInFrames: HYPERFRAMES_FRAMES}}
        durationInFrames={HYPERFRAMES_FRAMES}
        {...common}
      />
      <Composition
        id="Skill02Remotion"
        component={RemotionScene}
        defaultProps={{durationInFrames: REMOTION_FRAMES}}
        durationInFrames={REMOTION_FRAMES}
        {...common}
      />
      <Composition
        id="Skill03VideoUse"
        component={VideoUseScene}
        defaultProps={{durationInFrames: VIDEO_USE_FRAMES}}
        durationInFrames={VIDEO_USE_FRAMES}
        {...common}
      />
      <Composition
        id="Skill04Seedance"
        component={SeedanceScene}
        defaultProps={{durationInFrames: SEEDANCE_FRAMES}}
        durationInFrames={SEEDANCE_FRAMES}
        {...common}
      />
    </>
  );
};
