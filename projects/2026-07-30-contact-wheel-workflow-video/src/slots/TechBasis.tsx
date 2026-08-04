import type {CSSProperties, ReactNode} from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
} from "remotion";

const COLORS = {
  background: "#070B18",
  panel: "rgba(18, 25, 49, 0.88)",
  panelStrong: "rgba(24, 32, 63, 0.96)",
  border: "rgba(139, 164, 255, 0.28)",
  text: "#F7F9FF",
  muted: "#A8B2D8",
  blue: "#5EA7FF",
  violet: "#9B7BFF",
  cyan: "#6EE7F2",
};

const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
const easeInOut = Easing.bezier(0.65, 0, 0.35, 1);

const reveal = (frame: number, start: number, end: number) =>
  interpolate(frame, [start, end], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });

const FlowCard = ({
  label,
  detail,
  accent,
  progress,
  children,
}: {
  label: string;
  detail: string;
  accent: string;
  progress: number;
  children: ReactNode;
}) => (
  <div
    style={{
      width: 410,
      height: 238,
      boxSizing: "border-box",
      borderRadius: 34,
      border: `1px solid ${COLORS.border}`,
      background: COLORS.panelStrong,
      boxShadow: `0 28px 80px rgba(0, 0, 0, 0.38), 0 0 56px ${accent}22`,
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      padding: "34px 38px",
      opacity: progress,
      scale: interpolate(progress, [0, 1], [0.88, 1]),
      translate: `0 ${interpolate(progress, [0, 1], [52, 0])}px`,
    }}
  >
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 18,
        color: COLORS.text,
        fontSize: 48,
        fontWeight: 800,
        letterSpacing: -1,
      }}
    >
      {children}
      <span>{label}</span>
    </div>
    <div
      style={{
        color: COLORS.muted,
        fontSize: 29,
        fontWeight: 500,
        letterSpacing: 1,
      }}
    >
      {detail}
    </div>
    <div
      style={{
        height: 5,
        width: `${interpolate(progress, [0, 1], [0, 100])}%`,
        borderRadius: 999,
        background: `linear-gradient(90deg, ${accent}, transparent)`,
      }}
    />
  </div>
);

const Arrow = ({
  progress,
  pulse,
}: {
  progress: number;
  pulse: number;
}) => (
  <div
    style={{
      width: 116,
      display: "flex",
      alignItems: "center",
      opacity: progress,
      scale: interpolate(progress, [0, 1], [0.7, 1]),
    }}
  >
    <div
      style={{
        width: interpolate(progress, [0, 1], [0, 82]),
        height: 4,
        borderRadius: 999,
        background: `linear-gradient(90deg, ${COLORS.blue}, ${COLORS.violet})`,
        boxShadow: `0 0 ${16 + pulse * 18}px rgba(112, 141, 255, 0.72)`,
      }}
    />
    <div
      style={{
        width: 18,
        height: 18,
        borderTop: `4px solid ${COLORS.violet}`,
        borderRight: `4px solid ${COLORS.violet}`,
        rotate: "45deg",
        translate: "-10px 0",
      }}
    />
  </div>
);

const RemotionMark = () => (
  <div
    style={{
      width: 62,
      height: 62,
      borderRadius: 18,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(145deg, #36C5F0, #6558F5)",
      color: "#FFFFFF",
      fontSize: 34,
      fontWeight: 900,
      boxShadow: "0 12px 32px rgba(78, 119, 255, 0.36)",
    }}
  >
    R
  </div>
);

const CodeMark = ({frame}: {frame: number}) => {
  const cursor = Math.floor(frame / 6) % 2 === 0;

  return (
    <div
      style={{
        width: 68,
        height: 62,
        borderRadius: 17,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(94, 167, 255, 0.13)",
        border: "1px solid rgba(94, 167, 255, 0.42)",
        color: COLORS.cyan,
        fontSize: 29,
        fontWeight: 800,
        fontFamily: "SFMono-Regular, Menlo, Monaco, Consolas, monospace",
      }}
    >
      {"</>"}
      <span
        style={{
          width: 3,
          height: 31,
          marginLeft: 4,
          background: COLORS.cyan,
          opacity: cursor ? 1 : 0.22,
        }}
      />
    </div>
  );
};

const VideoMark = ({frame}: {frame: number}) => {
  const playScale = interpolate(
    Math.sin((frame / 30) * Math.PI * 2),
    [-1, 1],
    [0.92, 1.08],
  );

  return (
    <div
      style={{
        width: 68,
        height: 62,
        borderRadius: 17,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(145deg, #9B7BFF, #5EA7FF)",
        boxShadow: "0 12px 34px rgba(122, 108, 255, 0.35)",
      }}
    >
      <div
        style={{
          width: 0,
          height: 0,
          borderTop: "13px solid transparent",
          borderBottom: "13px solid transparent",
          borderLeft: "21px solid white",
          marginLeft: 5,
          scale: playScale,
        }}
      />
    </div>
  );
};

export const TechBasis = () => {
  const frame = useCurrentFrame();
  const titleProgress = reveal(frame, 0, 18);
  const toolProgress = reveal(frame, 12, 35);
  const codeProgress = reveal(frame, 38, 60);
  const videoProgress = reveal(frame, 68, 90);
  const firstArrowProgress = reveal(frame, 29, 48);
  const secondArrowProgress = reveal(frame, 59, 78);
  const statementProgress = reveal(frame, 91, 116);
  const lineProgress = reveal(frame, 106, 135);
  const ambientShift = interpolate(frame, [0, 141], [-40, 70], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeInOut,
  });
  const pulse = interpolate(
    Math.sin((frame / 22) * Math.PI * 2),
    [-1, 1],
    [0, 1],
  );

  const gridStyle: CSSProperties = {
    position: "absolute",
    inset: 0,
    opacity: 0.22,
    backgroundImage:
      "linear-gradient(rgba(126, 147, 218, 0.10) 1px, transparent 1px), linear-gradient(90deg, rgba(126, 147, 218, 0.10) 1px, transparent 1px)",
    backgroundSize: "72px 72px",
    translate: `${ambientShift}px ${ambientShift * 0.36}px`,
  };

  return (
    <AbsoluteFill
      style={{
        overflow: "hidden",
        background:
          "radial-gradient(circle at 18% 16%, #172752 0%, transparent 35%), radial-gradient(circle at 82% 72%, #24194D 0%, transparent 39%), #070B18",
        color: COLORS.text,
        fontFamily:
          '"PingFang SC", "Noto Sans CJK SC", "Microsoft YaHei", sans-serif',
      }}
    >
      <div style={gridStyle} />

      <div
        style={{
          position: "absolute",
          width: 620,
          height: 620,
          left: -210 + ambientShift,
          top: 360,
          borderRadius: "50%",
          background: "rgba(67, 123, 255, 0.12)",
          filter: "blur(90px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 560,
          height: 560,
          right: -130 - ambientShift * 0.5,
          top: -180,
          borderRadius: "50%",
          background: "rgba(151, 91, 255, 0.14)",
          filter: "blur(100px)",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 2,
          height: "100%",
          boxSizing: "border-box",
          padding: "92px 120px 84px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 18,
            opacity: titleProgress,
            translate: `0 ${interpolate(
              titleProgress,
              [0, 1],
              [28, 0],
            )}px`,
          }}
        >
          <div
            style={{
              width: 48,
              height: 5,
              borderRadius: 999,
              background: `linear-gradient(90deg, ${COLORS.blue}, ${COLORS.violet})`,
            }}
          />
          <span
            style={{
              color: COLORS.muted,
              fontSize: 34,
              fontWeight: 650,
              letterSpacing: 7,
            }}
          >
            上期讲过的视频生产方式
          </span>
          <div
            style={{
              width: 48,
              height: 5,
              borderRadius: 999,
              background: `linear-gradient(90deg, ${COLORS.violet}, ${COLORS.blue})`,
            }}
          />
        </div>

        <div
          style={{
            marginTop: 28,
            opacity: titleProgress,
            scale: interpolate(titleProgress, [0, 1], [0.94, 1]),
            fontSize: 92,
            lineHeight: 1.06,
            fontWeight: 900,
            letterSpacing: -4,
            textAlign: "center",
          }}
        >
          <span>Remotion</span>
          <span
            style={{
              margin: "0 28px",
              color: COLORS.muted,
              fontWeight: 450,
            }}
          >
            +
          </span>
          <span
            style={{
              background: `linear-gradient(110deg, ${COLORS.blue}, ${COLORS.violet}, ${COLORS.cyan})`,
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            HyperFrames
          </span>
        </div>

        <div
          style={{
            width: "100%",
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 2,
            marginTop: 16,
          }}
        >
          <FlowCard
            label="创作工具"
            detail="Remotion + HyperFrames"
            accent={COLORS.blue}
            progress={toolProgress}
          >
            <RemotionMark />
          </FlowCard>

          <Arrow progress={firstArrowProgress} pulse={pulse} />

          <FlowCard
            label="代码动画"
            detail="画面运动与交互逻辑"
            accent={COLORS.cyan}
            progress={codeProgress}
          >
            <CodeMark frame={frame} />
          </FlowCard>

          <Arrow progress={secondArrowProgress} pulse={1 - pulse} />

          <FlowCard
            label="视频"
            detail="稳定生成 · 可重复调用"
            accent={COLORS.violet}
            progress={videoProgress}
          >
            <VideoMark frame={frame} />
          </FlowCard>
        </div>

        <div
          style={{
            width: 1460,
            minHeight: 126,
            boxSizing: "border-box",
            borderRadius: 30,
            border: "1px solid rgba(132, 153, 235, 0.22)",
            background: COLORS.panel,
            boxShadow: "0 24px 70px rgba(0, 0, 0, 0.28)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 26,
            padding: "24px 44px",
            opacity: statementProgress,
            translate: `0 ${interpolate(
              statementProgress,
              [0, 1],
              [38, 0],
            )}px`,
          }}
        >
          <span
            style={{
              color: COLORS.muted,
              fontSize: 42,
              fontWeight: 650,
            }}
          >
            核心原理
          </span>
          <div
            style={{
              width: 2,
              height: 54,
              background: "rgba(168, 178, 216, 0.25)",
            }}
          />
          <span
            style={{
              fontSize: 53,
              fontWeight: 850,
              letterSpacing: 1,
            }}
          >
            代码生成动画
          </span>
          <span
            style={{
              color: COLORS.violet,
              fontSize: 46,
              fontWeight: 500,
            }}
          >
            +
          </span>
          <span
            style={{
              fontSize: 53,
              fontWeight: 850,
              letterSpacing: 1,
            }}
          >
            添加交互逻辑
          </span>
        </div>

        <div
          style={{
            width: interpolate(lineProgress, [0, 1], [0, 640]),
            height: 5,
            marginTop: 24,
            borderRadius: 999,
            background: `linear-gradient(90deg, transparent, ${COLORS.blue}, ${COLORS.violet}, transparent)`,
            boxShadow: `0 0 ${18 + pulse * 14}px rgba(110, 132, 255, 0.54)`,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
