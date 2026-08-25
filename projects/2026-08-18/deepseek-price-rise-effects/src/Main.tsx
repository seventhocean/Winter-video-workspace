import {AbsoluteFill, Sequence, useVideoConfig} from "remotion";
import type {ProjectProps} from "./schema";
import {BaseVideo} from "./components/BaseVideo";
import {Stage} from "./components/Stage";
import {styleVariables, theme} from "./theme";

export const Main = ({
  sourceFile,
  debugSafeZones,
  timeline,
}: ProjectProps) => {
  const {fps, width, height} = useVideoConfig();
  const portrait = height > width;
  const designWidth = portrait ? 1080 : 1920;
  const designHeight = portrait ? 1920 : 1080;
  const scale = width / designWidth;

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
        {timeline.scenes.map((scene) => (
          <Sequence
            key={scene.sceneId}
            from={Math.round(scene.start * fps)}
            durationInFrames={Math.round(scene.duration * fps)}
          >
            <Stage scene={scene} debugSafeZones={debugSafeZones} />
          </Sequence>
        ))}
      </div>
    </AbsoluteFill>
  );
};
