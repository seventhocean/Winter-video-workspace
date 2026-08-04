import {AbsoluteFill} from "remotion";

const regionStyle = {
  position: "absolute",
  border: "2px dashed rgba(255, 101, 119, .68)",
} as const;

export const SafeZone = ({
  enabled,
  protectedRegions,
}: {
  enabled: boolean;
  protectedRegions: string[];
}) => {
  if (!enabled) return null;

  const faceProtected =
    protectedRegions.includes("face") ||
    protectedRegions.includes("mouth") ||
    protectedRegions.includes("face-center");
  const subtitleProtected =
    protectedRegions.includes("subtitle") ||
    protectedRegions.includes("subtitle-bottom");

  return (
    <AbsoluteFill style={{pointerEvents: "none", zIndex: 100}}>
      <div
        style={{
          position: "absolute",
          inset: "6% 5%",
          border: "2px dashed rgba(255, 195, 77, .58)",
        }}
      />
      {faceProtected ? (
        <div
          style={{
            ...regionStyle,
            left: "36%",
            top: "15%",
            width: "28%",
            height: "48%",
            borderRadius: "48%",
          }}
        />
      ) : null}
      {subtitleProtected ? (
        <div
          style={{
            position: "absolute",
            left: "5%",
            right: "5%",
            bottom: "3%",
            height: "12%",
            border: "2px dashed rgba(66, 223, 134, .62)",
          }}
        />
      ) : null}
      {protectedRegions.includes("lower-operation") ? (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: "46%",
            bottom: 0,
            backgroundColor: "rgba(255, 101, 119, .08)",
            borderTop: "2px dashed rgba(255, 101, 119, .68)",
          }}
        />
      ) : null}
    </AbsoluteFill>
  );
};
