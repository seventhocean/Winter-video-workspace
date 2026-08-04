import {Video} from "@remotion/media";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";

const clamp = {extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const};

export const TemplateStacked = () => {
  const frame = useCurrentFrame();
  const enter = interpolate(frame, [0, 22], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const drift = interpolate(frame, [0, 123], [-10, 10], clamp);

  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(circle at 74% 42%, rgba(126,87,255,.20), transparent 31%), linear-gradient(135deg,#070a13,#0e1326 55%,#090b15)",
        color: "#f5f7ff",
        fontFamily: '"PingFang SC","Helvetica Neue",sans-serif',
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.16,
          backgroundImage:
            "linear-gradient(rgba(120,135,190,.16) 1px,transparent 1px),linear-gradient(90deg,rgba(120,135,190,.16) 1px,transparent 1px)",
          backgroundSize: "72px 72px",
          translate: `${drift}px ${drift}px`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 132,
          top: 278,
          width: 760,
          opacity: enter,
          translate: `${interpolate(enter, [0, 1], [-56, 0])}px 0`,
        }}
      >
        <div style={{fontSize: 30, color: "#9b8cff", letterSpacing: 5}}>
          CONTACT WHEEL
        </div>
        <div style={{fontSize: 92, fontWeight: 800, lineHeight: 1.12, marginTop: 24}}>
          模板二
          <br />
          层层堆叠
        </div>
        <div style={{fontSize: 38, color: "#b6bfd8", marginTop: 34}}>
          卡片推进 · 景深层次 · 目标定格
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 1220,
          top: 68,
          width: 480,
          height: 856,
          borderRadius: 38,
          padding: 12,
          background: "linear-gradient(145deg,#424967,#141827)",
          boxShadow: "0 40px 100px rgba(0,0,0,.55),0 0 70px rgba(126,87,255,.2)",
          opacity: enter,
          scale: interpolate(enter, [0, 1], [0.88, 1]),
          rotate: `${interpolate(enter, [0, 1], [4, 0])}deg`,
        }}
      >
        <div style={{width: "100%", height: "100%", overflow: "hidden", borderRadius: 28}}>
          <Video
            src={staticFile("template-stacked-mbti.mp4")}
            muted
            loop
            objectFit="contain"
            style={{width: "100%", height: "100%", background: "#05070d"}}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};
