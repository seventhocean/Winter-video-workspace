import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from "remotion";

const items = [
  {name: "心理疗愈", symbol: "Ψ", color: "#9c7cff"},
  {name: "图书讲解", symbol: "阅", color: "#5ca8ff"},
  {name: "MBTI", symbol: "16", color: "#43d9bd"},
  {name: "AI 工具", symbol: "AI", color: "#ffb45f"},
];

export const UseCases = () => {
  const frame = useCurrentFrame();
  const title = interpolate(frame, [0, 16], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  return (
    <AbsoluteFill
      style={{
        background: "radial-gradient(circle at 50% 48%,#182447 0,#0c1122 42%,#070910 100%)",
        color: "white",
        fontFamily: '"PingFang SC","Helvetica Neue",sans-serif',
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 118,
          fontSize: 76,
          fontWeight: 800,
          opacity: title,
          translate: `0 ${interpolate(title, [0, 1], [26, 0])}px`,
        }}
      >
        不只是一种题材
      </div>
      <div style={{display: "flex", gap: 34, marginTop: 90}}>
        {items.map((item, index) => {
          const reveal = interpolate(frame, [12 + index * 14, 30 + index * 14], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          });
          return (
            <div
              key={item.name}
              style={{
                width: 360,
                height: 430,
                borderRadius: 34,
                background: "linear-gradient(155deg,rgba(255,255,255,.11),rgba(255,255,255,.035))",
                border: `1px solid ${item.color}88`,
                boxShadow: `0 24px 64px rgba(0,0,0,.3),0 0 44px ${item.color}22`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 38,
                opacity: reveal,
                translate: `0 ${interpolate(reveal, [0, 1], [70, 0])}px`,
                scale: interpolate(reveal, [0, 1], [0.88, 1]),
              }}
            >
              <div
                style={{
                  width: 150,
                  height: 150,
                  borderRadius: 44,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: `${item.color}22`,
                  color: item.color,
                  fontSize: 64,
                  fontWeight: 800,
                }}
              >
                {item.symbol}
              </div>
              <div style={{fontSize: 48, fontWeight: 700}}>{item.name}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
