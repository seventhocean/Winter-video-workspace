import type {CSSProperties, ReactNode} from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const COLORS = {
  background: "#050817",
  panel: "rgba(12, 18, 42, 0.92)",
  panelStrong: "rgba(14, 21, 51, 0.98)",
  text: "#F7F9FF",
  muted: "#AEB9D8",
  blue: "#59C7FF",
  violet: "#9274FF",
  border: "rgba(135, 168, 255, 0.28)",
};

const FONT =
  '"SF Pro Display", "PingFang SC", "Microsoft YaHei", system-ui, sans-serif';

const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

const softOut = Easing.bezier(0.16, 1, 0.3, 1);

const GridBackground = () => {
  const frame = useCurrentFrame();
  const drift = frame * 0.34;

  return (
    <AbsoluteFill
      style={{
        overflow: "hidden",
        background:
          "radial-gradient(circle at 50% 48%, rgba(80, 91, 255, 0.18), transparent 34%), linear-gradient(145deg, #070B1D 0%, #040713 55%, #09051A 100%)",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: -90,
          opacity: 0.28,
          backgroundImage:
            "linear-gradient(rgba(124, 155, 255, 0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(124, 155, 255, 0.12) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          translate: `${drift % 72}px ${drift % 72}px`,
          maskImage:
            "radial-gradient(ellipse at center, black 8%, rgba(0,0,0,0.55) 48%, transparent 78%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 760,
          height: 760,
          left: 580,
          top: 155,
          borderRadius: "50%",
          border: "1px solid rgba(112, 142, 255, 0.14)",
          scale: interpolate(Math.sin(frame / 24), [-1, 1], [0.98, 1.03]),
        }}
      />
      {Array.from({length: 12}).map((_, index) => {
        const angle = (index / 12) * Math.PI * 2 + frame * 0.0025;
        const radius = 450 + (index % 3) * 74;
        return (
          <div
            key={index}
            style={{
              position: "absolute",
              width: 7,
              height: 7,
              left: 956 + Math.cos(angle) * radius,
              top: 536 + Math.sin(angle) * radius * 0.48,
              borderRadius: "50%",
              backgroundColor: index % 2 === 0 ? COLORS.blue : COLORS.violet,
              boxShadow: `0 0 18px ${
                index % 2 === 0 ? COLORS.blue : COLORS.violet
              }`,
              opacity: 0.3,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

const LogicChip = ({
  children,
  x,
  y,
  delay,
}: {
  children: ReactNode;
  x: number;
  y: number;
  delay: number;
}) => {
  const frame = useCurrentFrame();
  const enter = interpolate(frame, [delay, delay + 14], [0, 1], {
    ...clamp,
    easing: softOut,
  });
  const collapse = interpolate(frame, [28, 58], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });

  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        width: 248,
        height: 92,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 22,
        color: COLORS.text,
        fontFamily: FONT,
        fontSize: 35,
        fontWeight: 700,
        letterSpacing: 1,
        background: COLORS.panel,
        border: `1px solid ${COLORS.border}`,
        boxShadow: "0 18px 54px rgba(0, 0, 0, 0.35)",
        opacity: enter * (1 - collapse),
        translate: `${x * (1 - collapse) - 124}px ${
          y * (1 - collapse) - 46
        }px`,
        scale: interpolate(collapse, [0, 1], [1, 0.42]),
      }}
    >
      {children}
    </div>
  );
};

const Connector = ({
  side,
  delay,
}: {
  side: "left" | "right" | "bottom-left" | "bottom-right";
  delay: number;
}) => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [delay, delay + 18], [0, 1], {
    ...clamp,
    easing: softOut,
  });
  const isBottom = side.startsWith("bottom");
  const isLeft = side.endsWith("left") || side === "left";

  return (
    <div
      style={{
        position: "absolute",
        left: isBottom ? (isLeft ? 620 : 1090) : isLeft ? 482 : 1178,
        top: isBottom ? 710 : 508,
        width: isBottom ? 210 : 260,
        height: 3,
        transformOrigin: isLeft ? "right center" : "left center",
        rotate: isBottom ? (isLeft ? "28deg" : "-28deg") : "0deg",
        scale: `${progress} 1`,
        opacity: progress * 0.75,
        background: isLeft
          ? `linear-gradient(90deg, transparent, ${COLORS.blue})`
          : `linear-gradient(90deg, ${COLORS.violet}, transparent)`,
        boxShadow: `0 0 18px ${isLeft ? COLORS.blue : COLORS.violet}`,
      }}
    />
  );
};

const Endpoint = ({
  title,
  side,
  delay,
}: {
  title: string;
  side: "left" | "right";
  delay: number;
}) => {
  const frame = useCurrentFrame();
  const reveal = interpolate(frame, [delay, delay + 16], [0, 1], {
    ...clamp,
    easing: softOut,
  });

  return (
    <div
      style={{
        width: 280,
        height: 108,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 28,
        border: `1px solid ${
          side === "left"
            ? "rgba(89, 199, 255, 0.46)"
            : "rgba(146, 116, 255, 0.46)"
        }`,
        background:
          side === "left"
            ? "linear-gradient(135deg, rgba(25, 74, 111, 0.82), rgba(10, 20, 43, 0.94))"
            : "linear-gradient(135deg, rgba(67, 46, 130, 0.82), rgba(14, 18, 45, 0.94))",
        color: COLORS.text,
        fontFamily: FONT,
        fontSize: 43,
        fontWeight: 800,
        letterSpacing: 2,
        opacity: reveal,
        translate: `${interpolate(
          reveal,
          [0, 1],
          [side === "left" ? -70 : 70, 0],
        )}px 0px`,
        boxShadow: `0 22px 64px ${
          side === "left"
            ? "rgba(54, 162, 239, 0.18)"
            : "rgba(123, 83, 245, 0.2)"
        }`,
      }}
    >
      {title}
    </div>
  );
};

const SkillCard = () => {
  const frame = useCurrentFrame();
  const reveal = interpolate(frame, [42, 72], [0, 1], {
    ...clamp,
    easing: softOut,
  });
  const pulse = interpolate(Math.sin((frame - 56) / 10), [-1, 1], [0.98, 1.02]);

  return (
    <div
      style={{
        position: "absolute",
        left: 725,
        top: 312,
        width: 470,
        height: 360,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 20,
        borderRadius: 48,
        background:
          "linear-gradient(145deg, rgba(20, 30, 70, 0.98), rgba(11, 14, 35, 0.98))",
        border: "2px solid rgba(126, 152, 255, 0.55)",
        boxShadow:
          "0 42px 120px rgba(0, 0, 0, 0.5), 0 0 85px rgba(103, 101, 255, 0.28), inset 0 1px 0 rgba(255,255,255,0.12)",
        opacity: reveal,
        scale: reveal * pulse,
      }}
    >
      <div
        style={{
          width: 92,
          height: 92,
          display: "grid",
          placeItems: "center",
          borderRadius: 28,
          background:
            "linear-gradient(135deg, rgba(89, 199, 255, 0.95), rgba(133, 91, 255, 0.95))",
          boxShadow: "0 18px 46px rgba(102, 115, 255, 0.42)",
        }}
      >
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: "50%",
            border: "7px solid white",
            borderTopColor: "transparent",
            rotate: `${frame * 1.4}deg`,
          }}
        />
      </div>
      <div
        style={{
          color: COLORS.text,
          fontFamily: FONT,
          fontSize: 68,
          fontWeight: 900,
          letterSpacing: -2,
          lineHeight: 1,
        }}
      >
        Contact Wheel
      </div>
      <div
        style={{
          color: COLORS.muted,
          fontFamily: FONT,
          fontSize: 30,
          fontWeight: 650,
          letterSpacing: 3,
        }}
      >
        一次封装 · 重复生成
      </div>
    </div>
  );
};

const SystemView = () => {
  const frame = useCurrentFrame();
  const leave = interpolate(frame, [130, 148], [1, 0], {
    ...clamp,
    easing: Easing.in(Easing.cubic),
  });
  const headingOpacity = interpolate(frame, [1, 16, 35, 45], [0, 1, 1, 0], {
    ...clamp,
    easing: softOut,
  });

  return (
    <AbsoluteFill style={{opacity: leave}}>
      <div
        style={{
          position: "absolute",
          top: 100,
          left: 0,
          right: 0,
          textAlign: "center",
          color: COLORS.text,
          fontFamily: FONT,
          fontSize: 76,
          fontWeight: 900,
          letterSpacing: -1,
          opacity: headingOpacity,
          translate: `0px ${interpolate(
            frame,
            [1, 18],
            [30, 0],
            clamp,
          )}px`,
        }}
      >
        把动画逻辑，封装成一个 Skill
      </div>

      <LogicChip x={-520} y={-80} delay={2}>
        轮播逻辑
      </LogicChip>
      <LogicChip x={0} y={-245} delay={6}>
        缓动曲线
      </LogicChip>
      <LogicChip x={520} y={-80} delay={10}>
        节奏控制
      </LogicChip>
      <LogicChip x={-410} y={250} delay={14}>
        齿轮音效
      </LogicChip>
      <LogicChip x={410} y={250} delay={18}>
        定点停靠
      </LogicChip>

      <div
        style={{
          position: "absolute",
          left: 130,
          top: 470,
        }}
      >
        <Endpoint title="图片" side="left" delay={70} />
      </div>
      <div
        style={{
          position: "absolute",
          right: 130,
          top: 470,
        }}
      >
        <Endpoint title="文本" side="right" delay={75} />
      </div>

      <Connector side="left" delay={72} />
      <Connector side="right" delay={77} />
      <Connector side="bottom-left" delay={91} />
      <Connector side="bottom-right" delay={96} />

      <SkillCard />

      <div
        style={{
          position: "absolute",
          left: 385,
          right: 385,
          top: 800,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Endpoint title="竖向轮播" side="left" delay={94} />
        <Endpoint title="层层堆叠" side="right" delay={99} />
      </div>
    </AbsoluteFill>
  );
};

const CtaView = () => {
  const frame = useCurrentFrame();
  const reveal = interpolate(frame, [136, 156], [0, 1], {
    ...clamp,
    easing: softOut,
  });
  const underline = interpolate(frame, [153, 174], [0, 1], {
    ...clamp,
    easing: softOut,
  });

  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        justifyContent: "center",
        opacity: reveal,
      }}
    >
      <div
        style={{
          position: "absolute",
          width: 1080,
          height: 460,
          borderRadius: "50%",
          background:
            "radial-gradient(ellipse, rgba(90, 119, 255, 0.38), rgba(91, 75, 220, 0.08) 48%, transparent 72%)",
          filter: "blur(14px)",
          scale: interpolate(frame, [136, 180], [0.7, 1.18], clamp),
        }}
      />
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 28,
          scale: interpolate(reveal, [0, 1], [0.72, 1]),
          translate: `0px ${interpolate(reveal, [0, 1], [70, 0])}px`,
        }}
      >
        <div
          style={{
            color: COLORS.blue,
            fontFamily: FONT,
            fontSize: 34,
            fontWeight: 800,
            letterSpacing: 12,
          }}
        >
          CONTACT WHEEL
        </div>
        <div
          style={{
            color: COLORS.text,
            fontFamily: FONT,
            fontSize: 188,
            fontWeight: 950,
            letterSpacing: -9,
            lineHeight: 0.95,
            textShadow:
              "0 0 48px rgba(89, 199, 255, 0.22), 0 20px 80px rgba(0, 0, 0, 0.45)",
          }}
        >
          实测走起
        </div>
        <div
          style={{
            width: 680,
            height: 8,
            borderRadius: 999,
            background: `linear-gradient(90deg, ${COLORS.blue}, ${COLORS.violet})`,
            boxShadow: "0 0 30px rgba(102, 131, 255, 0.7)",
            scale: `${underline} 1`,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};

export const SkillReveal = () => {
  const {width, height} = useVideoConfig();

  return (
    <AbsoluteFill
      style={
        {
          width,
          height,
          backgroundColor: COLORS.background,
          color: COLORS.text,
          overflow: "hidden",
        } satisfies CSSProperties
      }
    >
      <GridBackground />
      <SystemView />
      <CtaView />
    </AbsoluteFill>
  );
};
