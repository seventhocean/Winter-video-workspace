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
import rawConfig from "../work/books.json";

type Book = {
  id: string;
  title: string;
  author: string;
  cover: string;
  accent: string;
};

type CarouselConfig = {
  fps: number;
  duration: number;
  targetBookId: string;
  rollStart: number;
  rollEnd: number;
  roundsBeforeTarget: number;
  gearTickTimes: number[];
  settleAt: number;
  books: Book[];
  audio: {
    flip: string;
    roll: string;
    stop: string;
  };
};

const config = rawConfig as CarouselConfig;
const projectAsset = (assetPath: string) => staticFile(assetPath);
const targetBookConfig = config.books.find(
  (book) => book.id === config.targetBookId,
);

if (!targetBookConfig) {
  throw new Error(`targetBookId 不存在：${config.targetBookId}`);
}

const orderedBooks = [
  ...config.books.filter((book) => book.id !== config.targetBookId),
  targetBookConfig,
];

if (config.rollStart >= config.rollEnd) {
  throw new Error("rollStart 必须早于 rollEnd");
}

if (
  !Number.isInteger(config.roundsBeforeTarget) ||
  config.roundsBeforeTarget < 1
) {
  throw new Error("roundsBeforeTarget 必须是大于等于 1 的整数");
}

if (
  config.gearTickTimes.some(
    (time, index) => index > 0 && time <= config.gearTickTimes[index - 1],
  )
) {
  throw new Error("gearTickTimes 必须严格递增");
}

const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};
const easeOut = Easing.out(Easing.cubic);
const cardStep = 742;
const targetIndex = orderedBooks.length - 1;
const totalSteps =
  config.roundsBeforeTarget * orderedBooks.length + targetIndex;
const reelBooks = Array.from({length: totalSteps + 2}, (_, virtualIndex) => ({
  book: orderedBooks[virtualIndex % orderedBooks.length],
  virtualIndex,
}));

const getRollState = (seconds: number) => {
  const duration = config.rollEnd - config.rollStart;
  const normalized = Math.min(
    1,
    Math.max(0, (seconds - config.rollStart) / duration),
  );
  const eased = (1 - Math.cos(Math.PI * normalized)) / 2;

  return {
    progress: eased * totalSteps,
    speed: Math.sin(Math.PI * normalized),
  };
};

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
      {Array.from({length: 28}).map((_, index) => (
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

export const BookCoverCarousel = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const seconds = frame / fps;
  const rollState = getRollState(seconds);
  const scrollProgress = rollState.progress;
  const activeIndex = Math.min(
    Math.floor(scrollProgress + 0.5) % orderedBooks.length,
    targetIndex,
  );
  const activeBook = orderedBooks[activeIndex];
  const settled = seconds >= config.settleAt;
  const intro = interpolate(seconds, [0, 0.45], [0, 1], {
    ...clamp,
    easing: easeOut,
  });
  const lockReveal = interpolate(
    seconds,
    [config.settleAt - 0.06, config.settleAt + 0.34],
    [0, 1],
    {...clamp, easing: easeOut},
  );
  const settleBounce = interpolate(
    seconds,
    [
      config.settleAt - 0.04,
      config.settleAt + 0.08,
      config.settleAt + 0.22,
      config.settleAt + 0.38,
    ],
    [0, -18, 7, 0],
    clamp,
  );
  const speed = Math.round(rollState.speed * 100);
  const reelTravel = scrollProgress * cardStep;

  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(circle at 50% 43%, #16334A 0%, #091824 42%, #06111B 100%)",
        color: "#F5F9FF",
        overflow: "hidden",
        fontFamily: "PingFang SC, Hiragino Sans GB, sans-serif",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.22,
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
          transform: `translateY(${(1 - intro) * 18}px)`,
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
          VERTICAL READING REEL / {String(orderedBooks.length).padStart(2, "0")}
        </div>
        <div
          style={{
            marginTop: 17,
            fontSize: 54,
            lineHeight: 1.1,
            fontWeight: 800,
            letterSpacing: -2,
          }}
        >
          书封上下轮转
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          right: 72,
          top: 103,
          display: "flex",
          alignItems: "center",
          gap: 12,
          color: settled ? "#42DF86" : "#FFC34D",
          fontFamily: "Menlo, monospace",
          fontSize: 18,
          letterSpacing: 2,
        }}
      >
        <span
          style={{
            width: 10,
            height: 10,
            borderRadius: 999,
            background: settled ? "#42DF86" : "#FFC34D",
            boxShadow: `0 0 18px ${settled ? "#42DF86" : "#FFC34D"}`,
          }}
        />
        {settled ? "LOCKED" : "ROLLING"}
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
            "linear-gradient(180deg, rgba(4,11,17,.94), rgba(11,30,43,.98))",
          border: `2px solid ${activeBook.accent}66`,
          boxShadow: `0 44px 90px rgba(0,0,0,.56), 0 0 44px ${activeBook.accent}22`,
        }}
      >
        <GearMarks
          side="left"
          travel={-reelTravel * 0.24}
          accent={activeBook.accent}
        />
        <GearMarks
          side="right"
          travel={-reelTravel * 0.24}
          accent={activeBook.accent}
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
              transform: `translateY(${settleBounce}px) scaleY(${1 + rollState.speed * 0.008})`,
              filter: `blur(${rollState.speed * 1.15}px)`,
            }}
          >
            {reelBooks.map(({book, virtualIndex}) => {
              const distance = Math.abs(virtualIndex - scrollProgress);
              const scale = 1 - Math.min(distance, 1) * 0.055;
              const opacity = 1 - Math.min(distance, 1) * 0.42;
              return (
                <div
                  key={`${book.id}-${virtualIndex}`}
                  style={{
                    position: "absolute",
                    width: 480,
                    height: 704,
                    left: 16,
                    top: 110 + virtualIndex * cardStep - reelTravel,
                    opacity,
                    transform: `scale(${scale})`,
                    transformOrigin: "50% 50%",
                    filter: `drop-shadow(0 26px 32px rgba(0,0,0,.52))`,
                  }}
                >
                  <Img
                    src={projectAsset(book.cover)}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: 14,
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      borderRadius: 14,
                      border: `2px solid ${book.accent}88`,
                      boxShadow:
                        virtualIndex === totalSteps && settled
                          ? `0 0 58px ${book.accent}66`
                          : "inset 0 0 28px rgba(255,255,255,.05)",
                    }}
                  />
                </div>
              );
            })}
          </div>

          <div
            style={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              background:
                "linear-gradient(180deg, #02070B 0%, transparent 14%, transparent 86%, #02070B 100%)",
            }}
          />
        </div>

        <div
          style={{
            position: "absolute",
            left: 52,
            right: 52,
            top: "50%",
            height: 2,
            background: activeBook.accent,
            opacity: settled ? 0.72 : 0.26,
            boxShadow: `0 0 16px ${activeBook.accent}`,
          }}
        />
      </div>

      <div
        style={{
          position: "absolute",
          left: 88,
          right: 88,
          top: 1370,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
        }}
      >
        <div>
          <div
            style={{
              color: activeBook.accent,
              fontFamily: "Menlo, monospace",
              fontSize: 18,
              letterSpacing: 3,
            }}
          >
            CURRENT BOOK / {String(activeIndex + 1).padStart(2, "0")}
          </div>
          <div
            style={{marginTop: 13, fontSize: 46, fontWeight: 750}}
          >
            {activeBook.title}
          </div>
          <div style={{marginTop: 8, color: "#8FA6B8", fontSize: 22}}>
            {activeBook.author}
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
            GEAR SPEED
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
            {settled ? "STOP" : `${speed}%`}
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
          background: "rgba(4,17,31,.76)",
          border: `1px solid ${settled ? "#42DF8666" : "#3F607755"}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 24px",
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
          {settled ? "TARGET BOOK LOCKED" : "TARGET BOOK SEARCHING"}
        </span>
        <span style={{fontSize: 24, fontWeight: 700}}>
          {targetBookConfig.title}
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
        }}
      >
        {orderedBooks.map((book, index) => (
          <div
            key={book.id}
            style={{
              width: index === activeIndex ? 118 : 58,
              height: 8,
              borderRadius: 99,
              background:
                index <= activeIndex ? book.accent : "rgba(91,119,139,.42)",
              boxShadow:
                index === activeIndex ? `0 0 18px ${book.accent}` : "none",
            }}
          />
        ))}
      </div>

      {config.gearTickTimes.map((tickAt, index) => (
        <Sequence
          key={`audio-tick-${tickAt}`}
          from={Math.round(tickAt * fps)}
          durationInFrames={Math.round(0.25 * fps)}
        >
          <Audio
            src={projectAsset(config.audio.flip)}
            volume={() =>
              0.42 +
              Math.sin(
                Math.PI *
                  ((tickAt - config.rollStart) /
                    (config.rollEnd - config.rollStart)),
              ) *
                0.34 +
              (index % 2) * 0.025
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
        <Audio src={projectAsset(config.audio.roll)} volume={() => 0.34} />
      </Sequence>
      <Sequence
        from={Math.round(config.settleAt * fps)}
        durationInFrames={Math.round(1.1 * fps)}
      >
        <Audio src={projectAsset(config.audio.stop)} volume={() => 0.88} />
      </Sequence>
    </AbsoluteFill>
  );
};
