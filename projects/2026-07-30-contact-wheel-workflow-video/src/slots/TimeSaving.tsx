import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from "remotion";

const oldSteps = ["重复剪辑", "调节速度", "对齐音效"];

export const TimeSaving = () => {
  const frame = useCurrentFrame();
  const reveal = (start: number) =>
    interpolate(frame, [start, start + 16], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.16, 1, 0.3, 1),
    });
  const finish = reveal(112);

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg,#070910,#10162a 55%,#080b14)",
        color: "#f7f8ff",
        fontFamily: '"PingFang SC","Helvetica Neue",sans-serif',
        padding: "92px 120px",
      }}
    >
      <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: 54, height: 650}}>
        <div
          style={{
            borderRadius: 34,
            background: "rgba(255,105,105,.055)",
            border: "1px solid rgba(255,124,124,.28)",
            padding: 46,
          }}
        >
          <div style={{fontSize: 34, color: "#ff9797"}}>传统方式</div>
          <div style={{display: "flex", flexDirection: "column", gap: 22, marginTop: 42}}>
            {oldSteps.map((step, index) => {
              const p = reveal(12 + index * 20);
              return (
                <div
                  key={step}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 24,
                    padding: "25px 28px",
                    borderRadius: 18,
                    background: "rgba(255,255,255,.06)",
                    fontSize: 38,
                    opacity: p,
                    translate: `${interpolate(p, [0, 1], [-30, 0])}px 0`,
                  }}
                >
                  <span style={{color: "#ff7676"}}>×</span>
                  {step}
                </div>
              );
            })}
          </div>
          <div style={{fontSize: 32, color: "#8e96ad", marginTop: 32}}>每一期，再来一遍</div>
        </div>
        <div
          style={{
            borderRadius: 34,
            background: "rgba(67,217,189,.07)",
            border: "1px solid rgba(67,217,189,.36)",
            padding: 46,
          }}
        >
          <div style={{fontSize: 34, color: "#55e1c4"}}>Skill 方式</div>
          <div
            style={{
              height: 360,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 26,
              fontSize: 48,
              fontWeight: 800,
            }}
          >
            <div style={{opacity: reveal(58), padding: "28px 34px", borderRadius: 22, background: "#182540"}}>
              替换内容
            </div>
            <div style={{opacity: reveal(76), color: "#55e1c4"}}>→</div>
            <div
              style={{
                opacity: reveal(88),
                padding: "28px 34px",
                borderRadius: 22,
                background: "linear-gradient(135deg,#25a990,#386ee7)",
                boxShadow: "0 20px 65px rgba(55,204,176,.23)",
              }}
            >
              一键生成
            </div>
          </div>
          <div style={{fontSize: 32, color: "#9aa6bf", textAlign: "center"}}>同一套规则，持续复用</div>
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 180,
          textAlign: "center",
          fontSize: 68,
          fontWeight: 850,
          opacity: finish,
          scale: interpolate(finish, [0, 1], [0.94, 1]),
        }}
      >
        把重复劳动，变成
        <span style={{color: "#6d8cff"}}>固定工作流</span>
      </div>
    </AbsoluteFill>
  );
};
