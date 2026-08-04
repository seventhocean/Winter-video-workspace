import type {CSSProperties} from "react";
import {AbsoluteFill, useVideoConfig} from "remotion";
import type {Anchor, StageScene} from "../schema";
import {theme} from "../theme";
import {LayerTimeline} from "./LayerTimeline";
import {SafeZone} from "./SafeZone";
import {StageTopology} from "./StageTopology";

const landscapeSlots: Record<Anchor, CSSProperties> = {
  "top-left": {left: "4.5%", top: "7%", width: "32%"},
  "top-right": {right: "4.5%", top: "7%", width: "32%"},
  "center-left": {left: "4.5%", top: "34%", width: "34%"},
  center: {left: "33%", top: "31%", width: "34%"},
  "center-right": {right: "4.5%", top: "34%", width: "34%"},
  "lower-left": {left: "4.5%", bottom: "10%", width: "32%"},
  "lower-right": {right: "4.5%", bottom: "10%", width: "32%"},
  full: {inset: 0, width: "100%", height: "100%"},
};

const portraitSlots: Record<Anchor, CSSProperties> = {
  "top-left": {left: "6%", top: "6%", width: "42%"},
  "top-right": {right: "6%", top: "6%", width: "42%"},
  "center-left": {left: "6%", top: "34%", width: "42%"},
  center: {left: "18%", top: "34%", width: "64%"},
  "center-right": {right: "6%", top: "34%", width: "42%"},
  "lower-left": {left: "6%", bottom: "15%", width: "42%"},
  "lower-right": {right: "6%", bottom: "15%", width: "42%"},
  full: {inset: 0, width: "100%", height: "100%"},
};

export const Stage = ({
  scene,
  debugSafeZones,
}: {
  scene: StageScene;
  debugSafeZones: boolean;
}) => {
  const {width, height} = useVideoConfig();
  const slots = height > width ? portraitSlots : landscapeSlots;

  return (
    <AbsoluteFill
      style={{
        color: theme.text,
        fontFamily: theme.bodyFont,
        overflow: "hidden",
      }}
    >
      <StageTopology scene={scene} />
      {scene.layers.map((layer) => (
        <div
          key={layer.id}
          style={{
            position: "absolute",
            ...slots[layer.anchor],
            zIndex:
              layer.role === "ambient"
                ? 1
                : layer.role === "primary"
                  ? 4
                  : layer.kind === "hyperframes-overlay"
                    ? 6
                    : 5,
          }}
        >
          <LayerTimeline layer={layer} sceneDuration={scene.duration} />
        </div>
      ))}
      <SafeZone
        enabled={debugSafeZones}
        protectedRegions={scene.protectedRegions}
      />
    </AbsoluteFill>
  );
};
