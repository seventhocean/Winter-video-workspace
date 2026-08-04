import {
  AbsoluteFill,
  Audio,
  Easing,
  Img,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import rawContent from "../work/content.json";

type WheelItem = {
  id: string;
  type: "text" | "image";
  title: string;
  src?: string;
};

type WheelConfig = {
  fps: number;
  duration: number;
  rollStart: number;
  rollEnd: number;
  roundsBeforeTarget: number;
  settleAt: number;
  gearTickTimes: number[];
  items: WheelItem[];
  audio: {
    tick: string;
    roll: string;
    stop: string;
  };
};

const config = rawContent as WheelConfig;
const palette = ["#FF684E", "#F7B733", "#24C486", "#4C8DFF", "#A56EFF"];
const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};
const targetIndex = config.items.length - 1;
const totalSteps =
  config.roundsBeforeTarget * config.items.length + targetIndex;

const accentFor = (index: number) => palette[index % palette.length];

const StackedCard = ({
  item,
  sourceIndex,
  accent,
}: {
  item: WheelItem;
  sourceIndex: number;
  accent: string;
}) => (
  <div
    style={{
      width: "100%",
      height: "100%",
      position: "relative",
      overflow: "hidden",
      borderRadius: 34,
      border: `3px solid ${accent}`,
      color: "#FAFCFF",
      background: `linear-gradient(145deg, ${accent}55 0%, #17202B 46%, #080D13 100%)`,
      boxShadow: `0 30px 80px rgba(0,0,0,.58), 0 0 42px ${accent}44`,
    }}
  >
    {item.type === "image" ? (
      <>
        <Img
          src={staticFile(item.src || "")}
          style={{width: "100%", height: "100%", objectFit: "cover"}}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(0,0,0,.04) 46%, rgba(0,0,0,.88) 100%)",
          }}
        />
      </>
    ) : (
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.22,
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.13) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.13) 1px, transparent 1px)",
          backgroundSize: "54px 54px",
        }}
      />
    )}

    <div
      style={{
        position: "absolute",
        left: 54,
        top: 48,
        color: accent,
        fontFamily: "Menlo, monospace",
        fontSize: 22,
        letterSpacing: 5,
        textShadow: "0 2px 8px rgba(0,0,0,.8)",
      }}
    >
      CARD {String(sourceIndex + 1).padStart(2, "0")}
    </div>

    <div
      style={{
        position: "absolute",
        left: 54,
        right: 54,
        bottom: 74,
        fontSize: item.title.length > 16 ? 46 : item.title.length > 8 ? 58 : 78,
        lineHeight: 1.12,
        fontWeight: 850,
        overflowWrap: "anywhere",
        textShadow: "0 5px 22px rgba(0,0,0,.9)",
      }}
    >
      {item.title}
    </div>
  </div>
);

export const StackedWheel = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const seconds = frame / fps;
  const duration = config.rollEnd - config.rollStart;
  const normalized = Math.min(
    1,
    Math.max(0, (seconds - config.rollStart) / duration),
  );
  const eased = (1 - Math.cos(Math.PI * normalized)) / 2;
  const progress = eased * totalSteps;
  const currentStep = Math.min(totalSteps, Math.floor(progress));
  const localProgress = Math.min(1, Math.max(0, progress - currentStep));
  const currentIndex = currentStep % config.items.length;
  const incomingStep = Math.min(totalSteps, currentStep + 1);
  const incomingIndex = incomingStep % config.items.length;
  const settled = seconds >= config.settleAt;
  const speed = Math.sin(Math.PI * normalized);
  const stackStart = Math.max(0, currentStep - 6);
  const settledGlow = interpolate(
    seconds,
    [config.settleAt - 0.04, config.settleAt + 0.35],
    [0, 1],
    {...clamp, easing: Easing.out(Easing.cubic)},
  );
  const incomingEase = Easing.out(Easing.cubic)(localProgress);
  const shake =
    !settled && localProgress > 0.78
      ? Math.sin(localProgress * Math.PI * 8) * (1 - localProgress) * 18
      : 0;

  const visibleSteps = Array.from(
    {length: currentStep - stackStart + 1},
    (_, offset) => stackStart + offset,
  );

  return (
    <AbsoluteFill
      style={{
        overflow: "hidden",
        color: "#FAFCFF",
        fontFamily: "PingFang SC, Hiragino Sans GB, Arial, sans-serif",
        background:
          "radial-gradient(circle at 50% 35%, #30363E 0%, #12171D 44%, #07090C 100%)",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.2,
          backgroundImage:
            "repeating-linear-gradient(115deg, transparent 0 34px, rgba(255,255,255,.045) 35px 36px)",
          transform: `translateX(${frame * -0.35}px)`,
        }}
      />

      <div
        style={{
          position: "absolute",
          left: 70,
          top: 78,
          right: 70,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>
          <div
            style={{
              color: "#AAB5C0",
              fontFamily: "Menlo, monospace",
              fontSize: 20,
              letterSpacing: 5,
            }}
          >
            CONTACT WHEEL / STACKED
          </div>
          <div style={{marginTop: 14, fontSize: 50, fontWeight: 850}}>
            层层堆叠
          </div>
        </div>
        <div
          style={{
            color: settled ? "#54E091" : "#F5B942",
            fontFamily: "Menlo, monospace",
            fontSize: 18,
            letterSpacing: 3,
          }}
        >
          ● {settled ? "LOCKED" : "STACKING"}
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: 130,
          top: 300,
          width: 820,
          height: 1160,
          transform: `translate(${shake}px, ${Math.abs(shake) * 0.28}px)`,
        }}
      >
        {visibleSteps.map((step) => {
          const depth = currentStep - step;
          const sourceIndex = step % config.items.length;
          const item = config.items[sourceIndex];
          const accent = accentFor(sourceIndex);
          return (
            <div
              key={`stack-${step}`}
              style={{
                position: "absolute",
                inset: 0,
                transformOrigin: "50% 92%",
                transform: `translateY(${-depth * 15}px) scale(${1 - depth * 0.018}) rotate(${((step % 5) - 2) * 0.72}deg)`,
                opacity: 1 - depth * 0.095,
                filter: `brightness(${1 - depth * 0.08})`,
              }}
            >
              <StackedCard
                item={item}
                sourceIndex={sourceIndex}
                accent={accent}
              />
            </div>
          );
        })}

        {!settled && incomingStep > currentStep ? (
          <div
            style={{
              position: "absolute",
              inset: 0,
              transformOrigin: "50% 92%",
              transform: `translate(${(1 - incomingEase) * (incomingStep % 2 === 0 ? 150 : -150)}px, ${(1 - incomingEase) * 980}px) scale(${0.92 + incomingEase * 0.08}) rotate(${(1 - incomingEase) * (incomingStep % 2 === 0 ? 8 : -8)}deg)`,
              opacity: interpolate(localProgress, [0, 0.14], [0, 1], clamp),
              filter: `blur(${speed * (1 - incomingEase) * 2.4}px)`,
            }}
          >
            <StackedCard
              item={config.items[incomingIndex]}
              sourceIndex={incomingIndex}
              accent={accentFor(incomingIndex)}
            />
          </div>
        ) : null}

        {settled ? (
          <div
            style={{
              position: "absolute",
              inset: -5,
              borderRadius: 38,
              border: `3px solid ${accentFor(targetIndex)}`,
              opacity: settledGlow,
              boxShadow: `0 0 72px ${accentFor(targetIndex)}99`,
            }}
          />
        ) : null}
      </div>

      <div
        style={{
          position: "absolute",
          left: 92,
          right: 92,
          bottom: 194,
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
        }}
      >
        <div>
          <div
            style={{
              color: accentFor(currentIndex),
              fontFamily: "Menlo, monospace",
              fontSize: 18,
              letterSpacing: 3,
            }}
          >
            TOP CARD / {String(currentIndex + 1).padStart(2, "0")}
          </div>
          <div style={{marginTop: 12, fontSize: 46, fontWeight: 820}}>
            {config.items[currentIndex].title}
          </div>
        </div>
        <div
          style={{
            color: settled ? "#54E091" : "#F5B942",
            fontFamily: "Menlo, monospace",
            fontSize: 34,
            fontWeight: 750,
          }}
        >
          {settled ? "STOP" : `${Math.round(speed * 100)}%`}
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: 92,
          right: 92,
          bottom: 94,
          height: 64,
          borderRadius: 16,
          padding: "0 22px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          color: settled ? "#54E091" : "#A3AFBA",
          background: "rgba(5,8,12,.82)",
          border: `1px solid ${settled ? "#54E09177" : "#69737D55"}`,
        }}
      >
        <span style={{fontFamily: "Menlo, monospace", letterSpacing: 3}}>
          {settled ? "FINAL CARD LOCKED" : "MECHANICAL FEED"}
        </span>
        <span style={{fontSize: 24, fontWeight: 760}}>
          {config.items[targetIndex].title}
        </span>
      </div>

      {config.gearTickTimes.map((tickAt, index) => (
        <Sequence
          key={`tick-${tickAt}`}
          from={Math.round(tickAt * fps)}
          durationInFrames={Math.round(0.24 * fps)}
        >
          <Audio
            src={staticFile(config.audio.tick)}
            volume={() =>
              0.44 +
              Math.sin(
                Math.PI *
                  ((tickAt - config.rollStart) /
                    (config.rollEnd - config.rollStart)),
              ) *
                0.25 +
              (index % 3) * 0.035
            }
          />
        </Sequence>
      ))}
      <Sequence
        from={Math.round(config.rollStart * fps)}
        durationInFrames={Math.round(
          (config.rollEnd - config.rollStart) * fps,
        )}
      >
        <Audio src={staticFile(config.audio.roll)} volume={() => 0.52} />
      </Sequence>
      <Sequence
        from={Math.round(config.settleAt * fps)}
        durationInFrames={Math.round(1.15 * fps)}
      >
        <Audio src={staticFile(config.audio.stop)} volume={() => 0.92} />
      </Sequence>
    </AbsoluteFill>
  );
};
