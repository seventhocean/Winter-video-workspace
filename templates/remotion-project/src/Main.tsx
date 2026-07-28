import {AbsoluteFill, interpolate, useCurrentFrame} from "remotion";

export const Main = () => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [0, 89], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill className="stage">
      <div className="eyebrow">WINTER VIDEO WORKSPACE</div>
      <div className="title">新视频项目</div>
      <div className="track">
        <div className="progress" style={{width: `${progress}%`}} />
      </div>
    </AbsoluteFill>
  );
};
