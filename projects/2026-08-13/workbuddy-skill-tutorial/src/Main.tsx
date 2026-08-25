import {Audio} from "@remotion/media";
import {AbsoluteFill, Sequence, staticFile, useCurrentFrame, useVideoConfig} from "remotion";
import type {ProjectProps} from "./schema";
import {BaseVideo} from "./components/BaseVideo";
import {Stage} from "./components/Stage";
import {styleVariables, theme} from "./theme";
import {TutorialScene} from "./TutorialScene";

const voices: ReadonlyArray<readonly [number, number, string]> = [
  [0.4, 18.192, "voice/01-opening.mp3"],
  [19.042, 25.464, "voice/02-what-is-skill.mp3"],
  [44.956, 23.736, "voice/03-when-to-build.mp3"],
  [69.142, 28.2, "voice/04-workflow-card.mp3"],
  [97.792, 20.424, "voice/05-trigger-tests.mp3"],
  [118.666, 18.384, "voice/06-file-structure.mp3"],
  [137.5, 22.632, "voice/07-create.mp3"],
  [160.582, 25.392, "voice/08-skill-md.mp3"],
  [186.424, 27.624, "voice/09-validate.mp3"],
  [214.498, 47.088, "voice/10-pitfalls.mp3"],
  [262.036, 35.592, "voice/11-closing.mp3"],
];

export const Main = ({
  sourceFile,
  debugSafeZones,
  timeline,
}: ProjectProps) => {
  const {fps, width, height} = useVideoConfig();
  const frame = useCurrentFrame();
  const portrait = height > width;
  const fourThree = !portrait && Math.abs(width / height - 4 / 3) < 0.01;
  const designWidth = portrait ? 1080 : fourThree ? 1440 : 1920;
  const designHeight = portrait ? 1920 : 1080;
  const scale = width / designWidth;
  const now = frame / fps;
  const activeScene = timeline.scenes.find((scene) => now >= scene.start && now < scene.start + scene.duration);

  return (
    <AbsoluteFill
      style={{
        ...styleVariables(timeline.scenes[0]?.styleProfile ?? "editorial-neutral"),
        backgroundColor: theme.background,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: designWidth,
          height: designHeight,
          scale,
          transformOrigin: "top left",
        }}
      >
        <BaseVideo sourceFile={sourceFile} />
        {!sourceFile && !activeScene ? <AbsoluteFill style={{background: "#f3ecdf"}}><div style={{position:"absolute",left:0,top:"50%",width:`${(frame%14)/13*100}%`,height:5,background:"#1557ff"}}/></AbsoluteFill> : null}
        {timeline.scenes.map((scene) => (
          <Sequence
            key={scene.sceneId}
            from={Math.round(scene.start * fps)}
            durationInFrames={Math.round(scene.duration * fps)}
          >
            {scene.sceneId.match(/^\d\d-/)?<TutorialScene scene={scene}/>:<Stage scene={scene} debugSafeZones={debugSafeZones} />}
          </Sequence>
        ))}
        {voices.map(([start,duration,file])=><Sequence key={file} from={Math.round(start*fps)} durationInFrames={Math.ceil(duration*fps)} premountFor={fps}><Audio src={staticFile(file)}/></Sequence>)}
      </div>
    </AbsoluteFill>
  );
};
