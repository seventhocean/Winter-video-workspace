import {Sequence, useCurrentFrame, useVideoConfig} from "remotion";
import type {StageLayer} from "../schema";
import {lifecycle, progress} from "../motion";
import {VisualBlock} from "./VisualBlocks";

const pulse = (frame: number, center: number) => {
  const rise = progress(frame, center - 6, center);
  const fall = progress(frame, center, center + 8);
  return rise * (1 - fall);
};

const AnimatedLayer = ({
  layer,
  durationInFrames,
}: {
  layer: StageLayer;
  durationInFrames: number;
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const visibility = lifecycle(frame, durationInFrames);
  const emphasisFrame =
    layer.emphasizeAt === undefined
      ? -1
      : Math.round((layer.emphasizeAt - layer.appearAt) * fps);
  const emphasis = emphasisFrame < 0 ? 0 : pulse(frame, emphasisFrame);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: layer.anchor === "full" ? "100%" : undefined,
        opacity: visibility,
        translate: `0 ${(1 - visibility) * 22}px`,
        scale: 1 + emphasis * 0.025,
      }}
    >
      <VisualBlock layer={layer} />
    </div>
  );
};

export const LayerTimeline = ({
  layer,
  sceneDuration,
}: {
  layer: StageLayer;
  sceneDuration: number;
}) => {
  const {fps} = useVideoConfig();
  const from = Math.round(layer.appearAt * fps);
  const exitAt = layer.exitAt ?? sceneDuration;
  const durationInFrames = Math.max(
    1,
    Math.round((exitAt - layer.appearAt) * fps),
  );

  return (
    <Sequence
      from={from}
      durationInFrames={durationInFrames}
      layout="none"
    >
      <AnimatedLayer layer={layer} durationInFrames={durationInFrames} />
    </Sequence>
  );
};
