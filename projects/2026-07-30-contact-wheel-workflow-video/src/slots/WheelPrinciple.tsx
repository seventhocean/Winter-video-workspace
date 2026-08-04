import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const ITEMS = [
  "INTJ",
  "INTP",
  "ENTJ",
  "ENTP",
  "INFJ",
  "INFP",
  "ENFJ",
  "ENFP",
  "ISTJ",
  "ISFJ",
  "ESTJ",
  "ESFJ",
  "ISTP",
  "ISFP",
  "ESTP",
  "ESFP",
] as const;

const CARD_GAP = 154;
const TRACK_LENGTH = ITEMS.length * CARD_GAP;
const CENTER_Y = 540;
const TOTAL_FRAMES = 256;

const mod = (value: number, divisor: number) =>
  ((value % divisor) + divisor) % divisor;

const wheelCyclesAtFrame = (frame: number) => {
  const safeFrame = Math.max(0, Math.min(TOTAL_FRAMES - 1, frame));

  if (safeFrame <= 75) {
    const t = safeFrame / 75;
    return 0.75 * t * t;
  }

  if (safeFrame <= 145) {
    const t = (safeFrame - 75) / 70;
    return 0.75 + 1.4 * t;
  }

  const t = (safeFrame - 145) / 110;
  return 2.15 + 0.85 * (1 - Math.pow(1 - t, 3));
};

const velocityAtFrame = (frame: number) =>
  Math.abs(wheelCyclesAtFrame(frame + 0.5) - wheelCyclesAtFrame(frame - 0.5));

const phaseForFrame = (frame: number) => {
  if (frame < 38) return 0;
  if (frame < 92) return 1;
  if (frame < 190) return 2;
  return 3;
};

const phaseLabels = ["多轮循环", "加速", "减速", "定位"] as const;

export const WheelPrinciple: React.FC = () => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();
  const cycles = wheelCyclesAtFrame(frame);
  const distance = cycles * TRACK_LENGTH;
  const velocity = velocityAtFrame(frame);
  const phase = phaseForFrame(frame);
  const lockProgress = interpolate(frame, [210, 250], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const intro = interpolate(frame, [0, 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const speedGlow = interpolate(velocity, [0, 0.023], [0.25, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#050812",
        color: "#F7FAFF",
        fontFamily:
          '"Inter", "SF Pro Display", "PingFang SC", "Microsoft YaHei", sans-serif',
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 50% 48%, rgba(57,189,248,0.18), transparent 36%), radial-gradient(circle at 50% 86%, rgba(124,92,255,0.12), transparent 34%), linear-gradient(180deg, #070B17 0%, #03050B 100%)",
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.18,
          backgroundImage:
            "linear-gradient(rgba(119,218,255,0.16) 1px, transparent 1px), linear-gradient(90deg, rgba(119,218,255,0.12) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
          translate: `0 ${mod(distance * 0.04, 80)}px`,
        }}
      />

      <div
        style={{
          position: "absolute",
          left: width / 2 - 370,
          top: 105,
          width: 740,
          height: height - 210,
          borderRadius: 44,
          border: "1px solid rgba(157,224,255,0.20)",
          background:
            "linear-gradient(180deg, rgba(13,21,39,0.88), rgba(5,9,18,0.96))",
          boxShadow:
            "0 44px 120px rgba(0,0,0,0.55), inset 0 0 70px rgba(74,197,255,0.04)",
          opacity: intro,
          scale: interpolate(intro, [0, 1], [0.96, 1]),
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 50,
            right: 50,
            top: 0,
            height: 150,
            zIndex: 5,
            background:
              "linear-gradient(180deg, #0A1020 24%, rgba(10,16,32,0))",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 50,
            right: 50,
            bottom: 0,
            height: 150,
            zIndex: 5,
            background:
              "linear-gradient(0deg, #060A14 24%, rgba(6,10,20,0))",
          }}
        />

        <div
          style={{
            position: "absolute",
            left: 38,
            right: 38,
            top: CENTER_Y - 105 - 105,
            height: 210,
            borderRadius: 32,
            border: `2px solid rgba(102,224,255,${0.42 + lockProgress * 0.5})`,
            background: `rgba(28,91,122,${0.08 + lockProgress * 0.18})`,
            boxShadow: `0 0 ${40 + lockProgress * 55}px rgba(55,206,255,${
              0.12 + lockProgress * 0.24
            }), inset 0 0 40px rgba(85,218,255,${0.06 + lockProgress * 0.1})`,
            opacity: 0.72 + lockProgress * 0.28,
          }}
        />

        {ITEMS.map((item, index) => {
          const wrapped =
            mod(index * CARD_GAP - distance + TRACK_LENGTH / 2, TRACK_LENGTH) -
            TRACK_LENGTH / 2;
          const y = CENTER_Y - 105 + wrapped;
          const fromCenter = Math.abs(wrapped);
          const proximity = interpolate(fromCenter, [0, 330], [1, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const visible = interpolate(fromCenter, [270, 430], [1, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const isTarget = item === "INTJ";
          const targetLock = isTarget ? lockProgress * proximity : 0;

          return (
            <div
              key={item}
              style={{
                position: "absolute",
                left: 58,
                top: y,
                width: 624,
                height: 120,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 24,
                border: `1px solid rgba(151,221,255,${
                  0.14 + proximity * 0.34 + targetLock * 0.35
                })`,
                background: isTarget
                  ? `linear-gradient(110deg, rgba(21,55,84,${
                      0.82 + targetLock * 0.12
                    }), rgba(31,91,111,${0.72 + targetLock * 0.18}))`
                  : "linear-gradient(110deg, rgba(22,30,51,0.92), rgba(12,19,34,0.92))",
                boxShadow: isTarget
                  ? `0 0 ${20 + targetLock * 46}px rgba(54,210,255,${
                      0.1 + targetLock * 0.3
                    })`
                  : "0 16px 36px rgba(0,0,0,0.24)",
                opacity: visible * intro,
                scale: 0.91 + proximity * 0.09 + targetLock * 0.035,
                filter: `blur(${interpolate(
                  fromCenter,
                  [0, 420],
                  [0, 2.4],
                  {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                  },
                )}px)`,
              }}
            >
              <div
                style={{
                  fontSize: 62,
                  fontWeight: 760,
                  letterSpacing: "0.08em",
                  lineHeight: 1,
                  color: isTarget
                    ? `rgba(223,249,255,${0.84 + targetLock * 0.16})`
                    : "rgba(225,237,247,0.74)",
                  textShadow: isTarget
                    ? `0 0 ${18 + targetLock * 22}px rgba(80,220,255,0.46)`
                    : "none",
                }}
              >
                {item}
              </div>
            </div>
          );
        })}
      </div>

      <div
        style={{
          position: "absolute",
          left: width / 2 - 550,
          right: width / 2 + 550,
          top: CENTER_Y - 2,
          height: 4,
          borderRadius: 999,
          background: `rgba(88,222,255,${0.22 + lockProgress * 0.66})`,
          boxShadow: `0 0 ${24 + lockProgress * 34}px rgba(72,215,255,${
            0.28 + lockProgress * 0.45
          })`,
        }}
      />

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 150,
          display: "flex",
          justifyContent: "center",
          gap: 52,
          opacity: interpolate(frame, [8, 24], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        {phaseLabels.map((label, index) => {
          const active = index === phase;
          const passed = index < phase;
          return (
            <div
              key={label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                color: active
                  ? "#DDF9FF"
                  : passed
                    ? "rgba(151,220,236,0.62)"
                    : "rgba(165,181,202,0.34)",
                fontSize: 34,
                fontWeight: active ? 700 : 520,
                letterSpacing: "0.08em",
                scale: active ? 1.06 : 1,
              }}
            >
              <div
                style={{
                  width: active ? 30 : 10,
                  height: 10,
                  borderRadius: 999,
                  background: active
                    ? "#63E3FF"
                    : passed
                      ? "rgba(99,227,255,0.5)"
                      : "rgba(165,181,202,0.22)",
                  boxShadow: active
                    ? `0 0 ${18 + speedGlow * 12}px rgba(99,227,255,0.7)`
                    : "none",
                }}
              />
              {label}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
