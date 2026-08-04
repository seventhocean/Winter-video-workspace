import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from "remotion";

const inputSets = [
  ["回避型依恋", "存在主义", "虚无主义"],
  ["INTJ", "ENFP", "ISTP"],
  ["书封 01", "书封 02", "书封 03"],
];

export const ReusableWorkflow = () => {
  const frame = useCurrentFrame();
  const phase = Math.min(2, Math.floor(frame / 86));
  const local = frame - phase * 86;
  const swap = interpolate(local, [0, 12, 70, 84], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const flow = interpolate(frame, [10, 46], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(circle at 52% 54%,rgba(78,104,255,.19),transparent 34%),linear-gradient(135deg,#070a13,#10162a)",
        color: "#f6f8ff",
        fontFamily: '"PingFang SC","Helvetica Neue",sans-serif',
        padding: "92px 118px",
      }}
    >
      <div style={{fontSize: 82, fontWeight: 850}}>换内容，不重剪</div>
      <div style={{fontSize: 34, color: "#aab5d2", marginTop: 12}}>
        模板逻辑、节奏与音效规则持续复用
      </div>
      <div
        style={{
          flex: 1,
          display: "grid",
          gridTemplateColumns: "1fr 140px 1fr 140px 1fr",
          alignItems: "center",
          marginTop: 52,
        }}
      >
        <div
          style={{
            height: 470,
            borderRadius: 34,
            border: "1px solid rgba(115,148,255,.44)",
            background: "rgba(18,25,48,.86)",
            padding: 38,
            opacity: swap,
          }}
        >
          <div style={{fontSize: 30, color: "#7da3ff"}}>新文本 / 新图片</div>
          <div style={{display: "flex", flexDirection: "column", gap: 22, marginTop: 46}}>
            {inputSets[phase].map((item, index) => (
              <div
                key={item}
                style={{
                  padding: "22px 26px",
                  borderRadius: 18,
                  background: "rgba(255,255,255,.07)",
                  fontSize: 32,
                  translate: `${interpolate(swap, [0, 1], [-24 - index * 8, 0])}px 0`,
                }}
              >
                {item}
              </div>
            ))}
          </div>
        </div>
        <div style={{fontSize: 72, color: "#6e8cff", textAlign: "center", opacity: flow}}>→</div>
        <div
          style={{
            height: 300,
            borderRadius: 42,
            background: "linear-gradient(145deg,#6d58ff,#375ae9)",
            boxShadow: "0 30px 90px rgba(82,77,255,.35)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            opacity: flow,
            scale: interpolate(flow, [0, 1], [0.86, 1]),
          }}
        >
          <div style={{fontSize: 30, opacity: 0.75}}>SKILL</div>
          <div style={{fontSize: 52, fontWeight: 850, marginTop: 12}}>Contact Wheel</div>
        </div>
        <div style={{fontSize: 72, color: "#6e8cff", textAlign: "center", opacity: flow}}>→</div>
        <div
          style={{
            height: 510,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: flow,
          }}
        >
          <div
            style={{
              width: 250,
              height: 444,
              borderRadius: 30,
              padding: 10,
              background: "linear-gradient(145deg,#4d5676,#151827)",
              boxShadow: "0 30px 80px rgba(0,0,0,.45)",
            }}
          >
            <div
              style={{
                width: "100%",
                height: "100%",
                borderRadius: 22,
                background: `linear-gradient(160deg,${["#5e4ae3", "#136b72", "#92501f"][phase]},#090b15)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                padding: 24,
                fontSize: 36,
                fontWeight: 800,
              }}
            >
              新视频
              <br />
              开头
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
