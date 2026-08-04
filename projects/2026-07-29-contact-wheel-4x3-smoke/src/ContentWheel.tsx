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
import {StackedWheel} from "./StackedWheel";

type WheelItem = {
  id: string;
  type: "text" | "image";
  title: string;
  src?: string;
};

type WheelConfig = {
  template?: "reel" | "stacked";
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
    stop: string;
  };
};

const config = rawContent as WheelConfig;
const palette = ["#FF715B", "#FFCA5C", "#5BD6A2", "#66A7FF", "#AA87FF"];
const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};
const cardStep = 684;
const targetIndex = config.items.length - 1;
const totalSteps =
  config.roundsBeforeTarget * config.items.length - 1;
const reelItems = Array.from({length: totalSteps + 2}, (_, virtualIndex) => ({
  item: config.items[virtualIndex % config.items.length],
  sourceIndex: virtualIndex % config.items.length,
  virtualIndex,
}));

if (config.items.length < 2) {
  throw new Error("内容轮盘至少需要 2 个项目");
}
if (config.rollStart >= config.rollEnd) {
  throw new Error("rollStart 必须早于 rollEnd");
}
if (
  !Number.isInteger(config.roundsBeforeTarget) ||
  config.roundsBeforeTarget < 1
) {
  throw new Error("roundsBeforeTarget 必须是大于等于 1 的整数");
}

const accentFor = (index: number) => palette[index % palette.length];

const GearMarks = ({
  side,
  travel,
  accent,
}: {
  side: "left" | "right";
  travel: number;
  accent: string;
}) => (
  <div
    style={{
      position: "absolute",
      top: 28,
      bottom: 28,
      [side]: 15,
      width: 24,
      overflow: "hidden",
      opacity: 0.72,
    }}
  >
    <div style={{transform: `translateY(${travel % 42}px)`}}>
      {Array.from({length: 30}).map((_, index) => (
        <div
          key={index}
          style={{
            width: index % 3 === 0 ? 22 : 13,
            height: 8,
            marginBottom: 34,
            marginLeft: side === "left" ? 0 : "auto",
            borderRadius: 3,
            background: index % 3 === 0 ? accent : "#486174",
            boxShadow:
              index % 3 === 0 ? `0 0 12px ${accent}88` : "none",
          }}
        />
      ))}
    </div>
  </div>
);

const TextCard = ({
  item,
  accent,
  index,
}: {
  item: WheelItem;
  accent: string;
  index: number;
}) => (
  <div
    style={{
      width: "100%",
      height: "100%",
      borderRadius: 18,
      padding: "54px 46px",
      boxSizing: "border-box",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      color: "#F6FAFF",
      background: `linear-gradient(145deg, ${accent}44, #0B1B2A 46%, #07121D)`,
      border: `2px solid ${accent}AA`,
    }}
  >
    <div
      style={{
        color: accent,
        fontFamily: "Menlo, monospace",
        fontSize: 22,
        letterSpacing: 5,
      }}
    >
      ITEM {String(index + 1).padStart(2, "0")}
    </div>
    <div
      style={{
        fontSize: item.title.length > 12 ? 64 : 78,
        lineHeight: 1.18,
        fontWeight: 800,
        overflowWrap: "anywhere",
      }}
    >
      {item.title}
    </div>
    <div
      style={{
        height: 8,
        width: 120,
        borderRadius: 99,
        background: accent,
        boxShadow: `0 0 22px ${accent}`,
      }}
    />
  </div>
);

const ImageCard = ({
  item,
  accent,
}: {
  item: WheelItem;
  accent: string;
}) => (
  <div
    style={{
      width: "100%",
      height: "100%",
      borderRadius: 18,
      overflow: "hidden",
      background: "#050B11",
      border: `2px solid ${accent}AA`,
      position: "relative",
    }}
  >
    <Img
      src={staticFile(item.src || "")}
      style={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
      }}
    />
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        padding: "70px 34px 28px",
        color: "#F6FAFF",
        fontSize: 28,
        fontWeight: 700,
        background: "linear-gradient(transparent, rgba(0,0,0,.78))",
      }}
    >
      {item.title}
    </div>
  </div>
);

const ReelWheel = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const seconds = frame / fps;
  const rollDuration = config.rollEnd - config.rollStart;
  const normalized = Math.min(
    1,
    Math.max(0, (seconds - config.rollStart) / rollDuration),
  );
  const eased = (1 - Math.cos(Math.PI * normalized)) / 2;
  const scrollProgress = eased * totalSteps;
  const speed = Math.sin(Math.PI * normalized);
  const activeIndex =
    Math.floor(scrollProgress + 0.5) % config.items.length;
  const activeItem = config.items[activeIndex];
  const accent = accentFor(activeIndex);
  const settled = seconds >= config.settleAt;
  const reelTravel = scrollProgress * cardStep;
  const intro = interpolate(seconds, [0, 0.42], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });
  const lockReveal = interpolate(
    seconds,
    [config.settleAt - 0.05, config.settleAt + 0.32],
    [0, 1],
    {...clamp, easing: Easing.out(Easing.cubic)},
  );
  const settleBounce = interpolate(
    seconds,
    [
      config.settleAt - 0.04,
      config.settleAt + 0.08,
      config.settleAt + 0.22,
      config.settleAt + 0.38,
    ],
    [0, -16, 6, 0],
    clamp,
  );

  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(circle at 50% 42%, #18384F 0%, #091824 44%, #050D15 100%)",
        color: "#F5F9FF",
        overflow: "hidden",
        fontFamily: "PingFang SC, Hiragino Sans GB, Arial, sans-serif",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.2,
          backgroundImage:
            "linear-gradient(rgba(105,151,184,.14) 1px, transparent 1px), linear-gradient(90deg, rgba(105,151,184,.14) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          transform: `translateY(${(frame % 64) * 0.18}px)`,
        }}
      />

      <div
        style={{
          position: "absolute",
          left: 72,
          top: 82,
          opacity: intro,
          transform: `translateY(${(1 - intro) * 16}px)`,
        }}
      >
        <div
          style={{
            color: "#7FA5C0",
            fontFamily: "Menlo, monospace",
            fontSize: 21,
            letterSpacing: 5,
          }}
        >
          CONTENT WHEEL / {String(config.items.length).padStart(2, "0")}
        </div>
        <div style={{marginTop: 16, fontSize: 54, fontWeight: 800}}>
          内容轮盘
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          right: 72,
          top: 104,
          color: settled ? "#42DF86" : "#FFC34D",
          fontFamily: "Menlo, monospace",
          fontSize: 18,
          letterSpacing: 3,
        }}
      >
        ● {settled ? "LOCKED" : "ROLLING"}
      </div>

      <div
        style={{
          position: "absolute",
          left: 210,
          top: 308,
          width: 660,
          height: 1010,
          borderRadius: 32,
          padding: 16,
          background:
            "linear-gradient(180deg, rgba(4,11,17,.96), rgba(11,30,43,.98))",
          border: `2px solid ${accent}66`,
          boxShadow: `0 44px 90px rgba(0,0,0,.56), 0 0 44px ${accent}22`,
        }}
      >
        <GearMarks
          side="left"
          travel={-reelTravel * 0.24}
          accent={accent}
        />
        <GearMarks
          side="right"
          travel={-reelTravel * 0.24}
          accent={accent}
        />

        <div
          style={{
            position: "absolute",
            left: 57,
            right: 57,
            top: 54,
            bottom: 54,
            overflow: "hidden",
            borderRadius: 20,
            background: "#02070B",
            border: "1px solid rgba(137,177,204,.28)",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              transform: `translateY(${settleBounce}px) scaleY(${1 + speed * 0.008})`,
              filter: `blur(${speed * 1.4}px)`,
            }}
          >
            {reelItems.map(({item, sourceIndex, virtualIndex}) => {
              const distance = Math.abs(virtualIndex - scrollProgress);
              const cardScale = 1 - Math.min(distance, 1) * 0.055;
              const opacity = 1 - Math.min(distance, 1) * 0.42;
              const itemAccent = accentFor(sourceIndex);
              return (
                <div
                  key={`${item.id}-${virtualIndex}`}
                  style={{
                    position: "absolute",
                    width: 480,
                    height: 646,
                    left: 16,
                    top: 126 + virtualIndex * cardStep - reelTravel,
                    opacity,
                    transform: `scale(${cardScale})`,
                    filter: "drop-shadow(0 26px 32px rgba(0,0,0,.52))",
                  }}
                >
                  {item.type === "image" ? (
                    <ImageCard item={item} accent={itemAccent} />
                  ) : (
                    <TextCard
                      item={item}
                      accent={itemAccent}
                      index={sourceIndex}
                    />
                  )}
                  {virtualIndex === totalSteps && settled ? (
                    <div
                      style={{
                        position: "absolute",
                        inset: -3,
                        borderRadius: 20,
                        boxShadow: `0 0 58px ${itemAccent}88`,
                      }}
                    />
                  ) : null}
                </div>
              );
            })}
          </div>
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(180deg, #02070B 0%, transparent 14%, transparent 86%, #02070B 100%)",
            }}
          />
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: 88,
          right: 88,
          top: 1380,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
        }}
      >
        <div>
          <div
            style={{
              color: accent,
              fontFamily: "Menlo, monospace",
              fontSize: 18,
              letterSpacing: 3,
            }}
          >
            CURRENT ITEM / {String(activeIndex + 1).padStart(2, "0")}
          </div>
          <div
            style={{
              marginTop: 14,
              maxWidth: 720,
              fontSize: activeItem.title.length > 16 ? 38 : 46,
              fontWeight: 760,
            }}
          >
            {activeItem.title}
          </div>
        </div>
        <div style={{textAlign: "right"}}>
          <div
            style={{
              color: "#718DA2",
              fontFamily: "Menlo, monospace",
              fontSize: 16,
              letterSpacing: 3,
            }}
          >
            SPEED
          </div>
          <div
            style={{
              marginTop: 10,
              color: settled ? "#42DF86" : "#FFC34D",
              fontFamily: "Menlo, monospace",
              fontSize: 40,
              fontWeight: 700,
            }}
          >
            {settled ? "STOP" : `${Math.round(speed * 100)}%`}
          </div>
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: 88,
          right: 88,
          top: 1572,
          height: 82,
          borderRadius: 18,
          padding: "0 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "rgba(4,17,31,.76)",
          border: `1px solid ${settled ? "#42DF8666" : "#3F607755"}`,
          opacity: settled ? lockReveal : 0.72,
          transform: `translateY(${(1 - lockReveal) * 12}px)`,
        }}
      >
        <span
          style={{
            color: settled ? "#42DF86" : "#89A0B2",
            fontFamily: "Menlo, monospace",
            fontSize: 17,
            letterSpacing: 3,
          }}
        >
          {settled ? "FINAL ITEM LOCKED" : "SEARCHING"}
        </span>
        <span style={{fontSize: 24, fontWeight: 700}}>
          {config.items[targetIndex].title}
        </span>
      </div>

      <div
        style={{
          position: "absolute",
          left: 112,
          right: 112,
          bottom: 152,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 18,
        }}
      >
        {config.items.map((item, index) => (
          <div
            key={item.id}
            style={{
              flex: index === activeIndex ? 2 : 1,
              height: 8,
              borderRadius: 99,
              background:
                index === activeIndex
                  ? accentFor(index)
                  : "rgba(91,119,139,.42)",
              boxShadow:
                index === activeIndex
                  ? `0 0 18px ${accentFor(index)}`
                  : "none",
            }}
          />
        ))}
      </div>

      {config.gearTickTimes.map((tickAt, index) => {
        const isLast = index === config.gearTickTimes.length - 1;
        return (
          <Sequence
            key={`tick-${tickAt}`}
            from={Math.round(tickAt * fps)}
            durationInFrames={Math.round((isLast ? 0.28 : 0.1) * fps)}
          >
            <Audio
              src={staticFile(
                isLast ? config.audio.stop : config.audio.tick,
              )}
              volume={() => (isLast ? 1 : 0.9 + (index % 3) * 0.035)}
            />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

export const ContentWheel = () =>
  config.template === "stacked" ? <StackedWheel /> : <ReelWheel />;
