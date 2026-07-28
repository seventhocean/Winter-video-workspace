import {Video} from "@remotion/media";
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";

const C = {
  bg: "#F3EFE7",
  fg: "#17151B",
  accent: "#7657D6",
  accentSoft: "#E8E0FB",
  muted: "#6E6875",
  panel: "#FBF9F4",
  line: "#CBC3D7",
  dark: "#17161E",
  danger: "#D75555",
  green: "#A7E9B6",
};

const serif = '"Songti SC", STSong, Georgia, serif';
const sans =
  '"PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif';
const mono = '"SFMono-Regular", Menlo, Monaco, Consolas, monospace';

const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

const enter = (frame: number, start = 4, duration = 18) =>
  interpolate(frame, [start, start + duration], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

const leave = (frame: number, durationInFrames: number) =>
  interpolate(
    frame,
    [durationInFrames - 12, durationInFrames - 1],
    [1, 0],
    {
      ...clamp,
      easing: Easing.in(Easing.cubic),
    },
  );

const Shell: React.FC<{
  index: number;
  kind: string;
  title: string;
  description: string;
  chips: string[];
  durationInFrames: number;
  children: React.ReactNode;
}> = ({
  index,
  kind,
  title,
  description,
  chips,
  durationInFrames,
  children,
}) => {
  const frame = useCurrentFrame();
  const titleIn = enter(frame, 5, 18);
  const bodyIn = enter(frame, 13, 22);
  const stageIn = enter(frame, 18, 26);
  const sceneOut = leave(frame, durationInFrames);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: C.bg,
        color: C.fg,
        fontFamily: sans,
        opacity: sceneOut,
        overflow: "hidden",
      }}
    >
      <AbsoluteFill
        style={{
          backgroundImage:
            "radial-gradient(circle at 83% 18%, rgba(118,87,214,.13), transparent 32%), repeating-linear-gradient(90deg, rgba(67,55,84,.045) 0, rgba(67,55,84,.045) 1px, transparent 1px, transparent 96px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 680,
          height: 680,
          right: -260,
          bottom: -360,
          borderRadius: "50%",
          border: `2px solid ${C.accentSoft}`,
          scale: interpolate(frame, [0, durationInFrames], [0.96, 1.06], clamp),
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: "62px 76px",
          display: "grid",
          gridTemplateColumns: "540px 1fr",
          gap: 74,
        }}
      >
        <section
          style={{
            display: "flex",
            flexDirection: "column",
            minWidth: 0,
            position: "relative",
            paddingLeft: 42,
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 3,
              bottom: 0,
              width: 3,
              backgroundColor: C.line,
            }}
          />
          {[0, 1, 2, 3].map((dot) => (
            <div
              key={dot}
              style={{
                position: "absolute",
                left: -8,
                top: 70 + dot * 205,
                width: dot === index ? 19 : 13,
                height: dot === index ? 19 : 13,
                borderRadius: "50%",
                backgroundColor: dot === index ? C.accent : C.bg,
                border: `3px solid ${dot === index ? C.accent : C.line}`,
                boxShadow:
                  dot === index ? "0 0 0 10px rgba(118,87,214,.12)" : "none",
              }}
            />
          ))}

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              opacity: titleIn,
              translate: `${interpolate(titleIn, [0, 1], [-38, 0])}px 0`,
            }}
          >
            <div
              style={{
                fontFamily: mono,
                fontSize: 22,
                letterSpacing: 2,
                color: C.accent,
                fontWeight: 700,
              }}
            >
              {kind}
            </div>
            <div
              style={{
                fontFamily: mono,
                fontSize: 22,
                color: C.muted,
              }}
            >
              0{index + 1} / 04
            </div>
          </div>

          <h1
            style={{
              fontFamily: serif,
              fontSize: title.length > 14 ? 82 : 100,
              lineHeight: 0.98,
              margin: "88px 0 34px",
              letterSpacing: -3,
              opacity: titleIn,
              translate: `${interpolate(titleIn, [0, 1], [-54, 0])}px 0`,
            }}
          >
            {title}
          </h1>

          <div
            style={{
              height: 3,
              width: `${interpolate(bodyIn, [0, 1], [0, 100])}%`,
              backgroundColor: C.fg,
              marginBottom: 34,
            }}
          />

          <p
            style={{
              fontSize: 34,
              lineHeight: 1.55,
              margin: 0,
              maxWidth: 495,
              color: "#3A3540",
              opacity: bodyIn,
              translate: `0 ${interpolate(bodyIn, [0, 1], [24, 0])}px`,
            }}
          >
            {description}
          </p>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 12,
              marginTop: "auto",
              paddingBottom: 42,
            }}
          >
            {chips.map((chip, chipIndex) => {
              const chipIn = enter(frame, 32 + chipIndex * 4, 14);
              return (
                <div
                  key={chip}
                  style={{
                    border: `2px solid ${chipIndex === 0 ? C.accent : C.line}`,
                    background:
                      chipIndex === 0 ? C.accentSoft : "rgba(251,249,244,.72)",
                    borderRadius: 999,
                    padding: "12px 20px",
                    fontSize: 23,
                    fontWeight: 600,
                    opacity: chipIn,
                    scale: interpolate(chipIn, [0, 1], [0.9, 1]),
                  }}
                >
                  {chip}
                </div>
              );
            })}
          </div>
        </section>

        <section
          style={{
            position: "relative",
            borderRadius: 34,
            border: "2px solid rgba(38,30,49,.18)",
            backgroundColor: C.panel,
            boxShadow: "0 34px 90px rgba(45,32,64,.15)",
            overflow: "hidden",
            opacity: stageIn,
            scale: interpolate(stageIn, [0, 1], [0.94, 1]),
            translate: `${interpolate(stageIn, [0, 1], [70, 0])}px 0`,
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 62,
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "0 24px",
              borderBottom: "2px solid rgba(38,30,49,.13)",
              background: "rgba(255,255,255,.74)",
              zIndex: 10,
            }}
          >
            {[C.danger, "#E9C85B", "#61BE84"].map((color) => (
              <span
                key={color}
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: "50%",
                  backgroundColor: color,
                }}
              />
            ))}
            <span
              style={{
                marginLeft: 16,
                fontFamily: mono,
                fontSize: 18,
                color: C.muted,
                letterSpacing: 1.4,
              }}
            >
              AI VIDEO WORKFLOW
            </span>
          </div>
          <div style={{position: "absolute", inset: "62px 0 0"}}>{children}</div>
        </section>
      </div>
    </AbsoluteFill>
  );
};

const MetaLabel: React.FC<{children: React.ReactNode}> = ({children}) => (
  <div
    style={{
      fontFamily: mono,
      fontSize: 18,
      letterSpacing: 1.5,
      color: C.muted,
    }}
  >
    {children}
  </div>
);

export const HyperFramesScene: React.FC<{durationInFrames: number}> = ({
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const promptIn = enter(frame, 22, 18);
  const build = interpolate(frame, [48, 286], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.45, 0, 0.55, 1),
  });
  const resultIn = enter(frame, 258, 24);
  const phaseIndex = Math.min(
    3,
    Math.floor(interpolate(frame, [52, 282], [0, 3.99], clamp)),
  );

  const tiles = [
    {label: "脚本结构", bg: "#E7D6B5"},
    {label: "视觉系统", bg: "#C8D9D4"},
    {label: "动效节奏", bg: "#D8C8EA"},
  ];

  return (
    <Shell
      index={0}
      kind="BUILT-IN PLUGIN"
      title="HyperFrames"
      description="把主题、结构和视觉风格，组织成一套有设计、有动效的完整画面。"
      chips={["动态设计", "画面合成", "整体包装"]}
      durationInFrames={durationInFrames}
    >
      <div
        style={{
          position: "absolute",
          inset: 38,
          display: "grid",
          gridTemplateRows: "190px 1fr",
          gap: 28,
        }}
      >
        <div
          style={{
            borderRadius: 22,
            background: C.dark,
            color: "#F7F2E8",
            padding: "28px 34px",
            opacity: promptIn,
            translate: `0 ${interpolate(promptIn, [0, 1], [36, 0])}px`,
          }}
        >
          <MetaLabel>WHAT IT DOES · CREATIVE BRIEF</MetaLabel>
          <div
            style={{
              position: "absolute",
              right: 34,
              top: 25,
              fontFamily: mono,
              fontSize: 20,
              color: "#BBA7FF",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            BUILD 0{phaseIndex + 1} / 04
          </div>
          <div
            style={{
              fontSize: 34,
              lineHeight: 1.35,
              marginTop: 18,
              fontWeight: 600,
            }}
          >
            为「AI 视频工作流」设计一段
            <span style={{color: "#BBA7FF"}}>编辑杂志风</span>动画
          </div>
          <div
            style={{
              marginTop: 18,
              height: 4,
              width: `${Math.max(8, build * 100)}%`,
              borderRadius: 99,
              background: `linear-gradient(90deg, ${C.accent}, #BCA8FF)`,
            }}
          />
        </div>

        <div
          style={{
            position: "relative",
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 18,
            alignItems: "stretch",
          }}
        >
          {tiles.map((tile, index) => {
            const tileIn = enter(frame, 62 + index * 42, 22);
            const count = Math.round(
              interpolate(
                frame,
                [92 + index * 42, 155 + index * 46],
                [0, [12, 24, 30][index]],
                clamp,
              ),
            );
            const lineProgress = interpolate(
              frame,
              [126 + index * 38, 252 + index * 14],
              [0, 1],
              clamp,
            );
            const sweepX = interpolate(
              frame,
              [124 + index * 24, 302],
              [-150, 390],
              clamp,
            );
            return (
              <div
                key={tile.label}
                style={{
                  borderRadius: 24,
                  background: tile.bg,
                  border: "2px solid rgba(25,20,31,.13)",
                  padding: 28,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  opacity: tileIn,
                  translate: `0 ${interpolate(tileIn, [0, 1], [52, 0])}px`,
                  rotate: `${interpolate(tileIn, [0, 1], [index - 1, 0])}deg`,
                }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      bottom: 0,
                      left: sweepX,
                      width: 105,
                      rotate: "12deg",
                      background:
                        "linear-gradient(90deg, transparent, rgba(255,255,255,.52), transparent)",
                      pointerEvents: "none",
                    }}
                  />
                  <MetaLabel>0{index + 1}</MetaLabel>
                <div
                  style={{
                    fontFamily: serif,
                    fontSize: 54,
                    lineHeight: 1.05,
                  }}
                >
                  {tile.label}
                </div>
                <div
                  style={{
                    height: 110,
                    borderRadius: 18,
                    border: "2px solid rgba(24,20,30,.16)",
                    background:
                      index === 0
                        ? "repeating-linear-gradient(0deg, transparent 0 24px, rgba(25,20,30,.14) 25px 27px)"
                        : index === 1
                          ? "radial-gradient(circle at 35% 45%, #7657D6 0 13%, transparent 14%), radial-gradient(circle at 68% 54%, #17151B 0 11%, transparent 12%)"
                          : "linear-gradient(125deg, transparent 0 25%, rgba(118,87,214,.72) 26% 33%, transparent 34% 56%, rgba(23,21,27,.82) 57% 63%, transparent 64%)",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      left: 14,
                      bottom: 10,
                      fontFamily: mono,
                      fontSize: 34,
                      fontWeight: 800,
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {String(count).padStart(2, "0")}
                  </div>
                  <div
                    style={{
                      position: "absolute",
                      left: 12,
                      right: 12,
                      top: 12,
                      height: 5,
                      borderRadius: 99,
                      backgroundColor: "rgba(23,21,27,.12)",
                    }}
                  >
                    <div
                      style={{
                        width: `${lineProgress * 100}%`,
                        height: "100%",
                        borderRadius: 99,
                        backgroundColor: C.accent,
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
          <div
            style={{
              position: "absolute",
              right: 22,
              bottom: 22,
              borderRadius: 999,
              background: C.fg,
              color: C.bg,
              padding: "16px 24px",
              fontFamily: mono,
              fontSize: 18,
              opacity: resultIn,
              scale: interpolate(resultIn, [0, 1], [0.7, 1]),
            }}
          >
            IDEA → FRAME
          </div>
        </div>
      </div>
    </Shell>
  );
};

export const RemotionScene: React.FC<{durationInFrames: number}> = ({
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const codeIn = enter(frame, 32, 20);
  const headlineIn = enter(frame, 72, 24);
  const cursor = Math.floor(interpolate(frame, [40, 205], [0, 82], clamp));
  const renderedFrames = Math.round(
    interpolate(frame, [96, 312], [0, 330], {
      ...clamp,
      easing: Easing.out(Easing.cubic),
    }),
  );
  const datasetIndex = Math.min(
    2,
    Math.floor(interpolate(frame, [132, 312], [0, 2.99], clamp)),
  );
  const chartSets = [
    [0.42, 0.72, 0.58, 0.92, 0.66],
    [0.78, 0.46, 0.84, 0.62, 0.95],
    [0.58, 0.88, 0.72, 0.98, 0.81],
  ];
  const code =
    "const progress = interpolate(frame, [0, 90], [0, 1]);\nreturn <Scene progress={progress} />;";

  return (
    <Shell
      index={1}
      kind="BUILT-IN PLUGIN"
      title="Remotion"
      description="用 React 和时间轴精确控制画面，适合数据动画、流程演示和可复用模板。"
      chips={["代码动画", "精确时间轴", "批量模板"]}
      durationInFrames={durationInFrames}
    >
      <div
        style={{
          position: "absolute",
          inset: 30,
          borderRadius: 24,
          overflow: "hidden",
          background:
            "radial-gradient(circle at 76% 22%, rgba(135,255,139,.12), transparent 26%), #15141B",
          color: "#F4F1EB",
          padding: 34,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: interpolate(frame, [154, 324], [-180, 1180], clamp),
            width: 150,
            rotate: "10deg",
            background:
              "linear-gradient(90deg, transparent, rgba(167,233,182,.13), transparent)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <MetaLabel>REACT · FRAME · VIDEO</MetaLabel>
          <div
            style={{
              fontFamily: mono,
              fontSize: 18,
              color: C.green,
            }}
          >
            FRAME {String(frame).padStart(4, "0")}
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.08fr .92fr",
            gap: 34,
            marginTop: 34,
            height: 620,
          }}
        >
          <div
            style={{
              borderRadius: 20,
              border: "2px solid rgba(255,255,255,.12)",
              padding: 30,
              fontFamily: mono,
              fontSize: 24,
              lineHeight: 1.7,
              whiteSpace: "pre-wrap",
              color: "#D9D1E8",
              opacity: codeIn,
              translate: `${interpolate(codeIn, [0, 1], [-36, 0])}px 0`,
            }}
          >
            <span style={{color: "#A7E9B6"}}>
              {code.slice(0, cursor)}
            </span>
            <span
              style={{
                display: "inline-block",
                width: 12,
                height: 31,
                marginLeft: 3,
                background: C.accent,
                opacity: 1,
                verticalAlign: "middle",
              }}
            />
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              borderRadius: 20,
              border: "2px solid rgba(255,255,255,.12)",
              padding: 32,
              background: "rgba(255,255,255,.035)",
            }}
          >
            <div
              style={{
                fontFamily: serif,
                fontSize: 72,
                lineHeight: 0.96,
                opacity: headlineIn,
                translate: `0 ${interpolate(headlineIn, [0, 1], [34, 0])}px`,
              }}
            >
              MOTION
              <br />
              IS <span style={{color: C.green}}>CODE.</span>
            </div>
            <div
              style={{
                fontFamily: mono,
                fontVariantNumeric: "tabular-nums",
                color: "#F4F1EB",
                display: "flex",
                alignItems: "baseline",
                gap: 12,
              }}
            >
              <span style={{fontSize: 74, fontWeight: 800}}>
                {String(renderedFrames).padStart(3, "0")}
              </span>
              <span style={{fontSize: 19, color: "#A7E9B6"}}>
                FRAMES · DATA 0{datasetIndex + 1}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                height: 225,
                alignItems: "flex-end",
                gap: 16,
              }}
            >
              {chartSets[0].map((_, index) => {
                const height = interpolate(
                  frame,
                  [92, 142, 198, 252, 318],
                  [
                    0.04,
                    chartSets[0][index],
                    chartSets[1][index],
                    chartSets[2][index],
                    chartSets[2][(index + 2) % 5],
                  ],
                  {...clamp, easing: Easing.inOut(Easing.cubic)},
                );
                return (
                  <div
                    key={index}
                    style={{
                      flex: 1,
                      height: `${height * 100}%`,
                      minHeight: 4,
                      borderRadius: "10px 10px 3px 3px",
                      background:
                        index === 3
                          ? C.green
                          : `rgba(118,87,214,${0.46 + index * 0.1})`,
                    }}
                  />
                );
              })}
            </div>
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            left: 34,
            right: 34,
            bottom: 26,
            height: 7,
            borderRadius: 99,
            background: "rgba(255,255,255,.11)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${interpolate(frame, [0, durationInFrames], [0, 100], clamp)}%`,
              height: "100%",
              background: C.accent,
            }}
          />
        </div>
      </div>
    </Shell>
  );
};

const Waveform: React.FC<{frame: number; durationInFrames: number}> = ({
  frame,
  durationInFrames,
}) => (
  <div
    style={{
      height: 120,
      display: "flex",
      alignItems: "center",
      gap: 6,
      padding: "0 16px",
      border: "2px solid rgba(31,25,38,.13)",
      borderRadius: 18,
      background: "#FFF",
      overflow: "hidden",
    }}
  >
    {Array.from({length: 68}).map((_, index) => {
      const base = 22 + ((index * 29) % 66);
      const active =
        index <
        interpolate(frame, [42, durationInFrames - 38], [0, 68], clamp);
      return (
        <div
          key={index}
          style={{
            flex: 1,
            height: base,
            borderRadius: 99,
            backgroundColor: active ? C.accent : "#D8D0E4",
          }}
        />
      );
    })}
  </div>
);

export const VideoUseScene: React.FC<{durationInFrames: number}> = ({
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const videoIn = enter(frame, 28, 20);
  const transcriptIn = enter(frame, 58, 20);
  const timelineIn = enter(frame, 96, 22);
  const analysisPercent = Math.round(
    interpolate(frame, [45, 282], [0, 100], {
      ...clamp,
      easing: Easing.out(Easing.cubic),
    }),
  );

  return (
    <Shell
      index={2}
      kind="GITHUB PROJECT"
      title="video-use"
      description="理解你已经拍好的真人素材，整理内容、标记无效片段，再输出更干净的剪辑结果。"
      chips={["真人素材", "内容识别", "剪辑整理"]}
      durationInFrames={durationInFrames}
    >
      <div
        style={{
          position: "absolute",
          inset: 28,
          display: "grid",
          gridTemplateRows: "420px 120px 1fr",
          gap: 18,
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.35fr .65fr",
            gap: 18,
          }}
        >
          <div
            style={{
              borderRadius: 22,
              overflow: "hidden",
              background: C.dark,
              position: "relative",
              opacity: videoIn,
              scale: interpolate(videoIn, [0, 1], [0.95, 1]),
            }}
          >
            <Video
              src={staticFile("video-use.mp4")}
              muted
              loop
              objectFit="cover"
              style={{
                width: "100%",
                height: "100%",
              }}
            />
            <div
              style={{
                position: "absolute",
                left: 18,
                top: 18,
                background: "rgba(17,15,21,.76)",
                color: "#FFF",
                borderRadius: 999,
                padding: "10px 16px",
                fontFamily: mono,
                fontSize: 17,
              }}
            >
              RAW · 原始素材
            </div>
            <div
              style={{
                position: "absolute",
                right: 18,
                top: 18,
                background: "rgba(118,87,214,.86)",
                color: "#FFF",
                borderRadius: 999,
                padding: "10px 16px",
                fontFamily: mono,
                fontSize: 17,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              ANALYZE {String(analysisPercent).padStart(3, "0")}%
            </div>
            <div
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                bottom: 0,
                height: 7,
                background: "rgba(255,255,255,.18)",
              }}
            >
              <div
                style={{
                  width: `${interpolate(frame % 180, [0, 179], [0, 100], clamp)}%`,
                  height: "100%",
                  background: C.accent,
                }}
              />
            </div>
          </div>

          <div
            style={{
              border: "2px solid rgba(31,25,38,.13)",
              borderRadius: 22,
              background: "#FFF",
              padding: 24,
              opacity: transcriptIn,
              translate: `${interpolate(transcriptIn, [0, 1], [28, 0])}px 0`,
            }}
          >
            <MetaLabel>AUTO TRANSCRIPT</MetaLabel>
            {[
              "最近我一直在尝试，",
              "让 AI 帮我完成视频制作。",
              "从内容策划到素材剪辑……",
            ].map((line, index) => {
              const lineIn = enter(frame, 76 + index * 34, 18);
              const removedProgress =
                index === 2
                  ? interpolate(frame, [218, 254], [0, 1], clamp)
                  : 0;
              return (
                <div
                  key={line}
                  style={{
                  marginTop: 28,
                  fontSize: 25,
                  lineHeight: 1.35,
                  padding: "10px 12px",
                  borderRadius: 10,
                  color: index === 2 ? C.danger : C.fg,
                  background:
                    index === 2
                      ? "rgba(215,85,85,.10)"
                      : "transparent",
                  textDecoration: index === 2 ? "line-through" : "none",
                  opacity:
                    lineIn * (index === 2 ? 1 - removedProgress * 0.62 : 1),
                  translate: `${interpolate(lineIn, [0, 1], [22, 0])}px 0`,
                  }}
                >
                  {line}
                </div>
              );
            })}
          </div>
        </div>

        <Waveform frame={frame} durationInFrames={durationInFrames} />

        <div
          style={{
            display: "flex",
            gap: 14,
            alignItems: "stretch",
            opacity: timelineIn,
            translate: `0 ${interpolate(timelineIn, [0, 1], [24, 0])}px`,
          }}
        >
          {[0, 1, 2, 3, 4].map((item) => {
            const removed = item === 1 || item === 3;
            const cutProgress = removed
              ? interpolate(
                  frame,
                  item === 1 ? [174, 208] : [226, 260],
                  [0, 1],
                  clamp,
                )
              : 0;
            return (
              <div
                key={item}
                style={{
                  flex: interpolate(cutProgress, [0, 1], [1, 0.08]),
                  borderRadius: 17,
                  overflow: "hidden",
                  border: `3px solid ${removed ? C.danger : "rgba(31,25,38,.13)"}`,
                  background: removed ? "rgba(215,85,85,.12)" : "#FFF",
                  opacity: interpolate(cutProgress, [0, 1], [1, 0.25]),
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: mono,
                  fontSize: 18,
                  color: removed ? C.danger : C.muted,
                }}
              >
                {removed ? "删除" : `镜头 0${item + 1}`}
              </div>
            );
          })}
        </div>
      </div>
    </Shell>
  );
};

export const SeedanceScene: React.FC<{durationInFrames: number}> = ({
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const promptIn = enter(frame, 24, 22);
  const split = interpolate(frame, [70, 276], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const labels = ["ESTABLISH · 全景", "TRACK · 跟拍", "CLOSE-UP · 近景"];
  const generation = Math.round(
    interpolate(frame, [172, 286], [0, 100], {
      ...clamp,
      easing: Easing.out(Easing.cubic),
    }),
  );

  return (
    <Shell
      index={3}
      kind="PROMPT SKILL"
      title="Seedance"
      description="把普通想法拆成景别、运镜、光线和动作，并在生成前检查镜头能否连起来。"
      chips={["提示词", "连续分镜", "镜头规划"]}
      durationInFrames={durationInFrames}
    >
      <div
        style={{
          position: "absolute",
          inset: 26,
          display: "grid",
          gridTemplateRows: "154px 1fr 78px",
          gap: 20,
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1.35fr",
            gap: 18,
            opacity: promptIn,
            translate: `0 ${interpolate(promptIn, [0, 1], [28, 0])}px`,
          }}
        >
          <div
            style={{
              borderRadius: 18,
              background: C.dark,
              color: "#FFF",
              padding: "22px 26px",
            }}
          >
            <MetaLabel>INPUT · 一句普通描述</MetaLabel>
            <div style={{fontSize: 28, marginTop: 18}}>
              女生在傍晚的站台等待列车
            </div>
          </div>
          <div
            style={{
              borderRadius: 18,
              background: C.accentSoft,
              padding: "22px 26px",
              border: "2px solid rgba(118,87,214,.26)",
            }}
          >
            <MetaLabel>PROMPT STRUCTURE</MetaLabel>
            <div
              style={{
                display: "flex",
                gap: 12,
                marginTop: 18,
                flexWrap: "wrap",
              }}
            >
              {["蓝调时刻", "列车进站", "跟随移动", "暖光反射"].map(
                (tag, tagIndex) => {
                  const tagIn = enter(frame, 48 + tagIndex * 25, 16);
                  return (
                  <span
                    key={tag}
                    style={{
                      borderRadius: 999,
                      background: "#FFF",
                      padding: "10px 16px",
                      fontSize: 21,
                      border: "2px solid rgba(118,87,214,.18)",
                      opacity: tagIn,
                      scale: interpolate(tagIn, [0, 1], [0.82, 1]),
                    }}
                  >
                    {tag}
                  </span>
                  );
                },
              )}
            </div>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 18,
            position: "relative",
          }}
        >
          {labels.map((label, index) => {
            const cardIn = enter(frame, 92 + index * 42, 24);
            const zoom =
              1 +
              0.04 *
                Math.max(
                  0,
                  interpolate(frame, [110 + index * 38, 294], [0, 1], clamp),
                );
            const active =
              frame >= 128 + index * 50 && frame < 178 + index * 50;
            return (
              <div
                key={label}
                style={{
                  borderRadius: 22,
                  overflow: "hidden",
                  position: "relative",
                  border: `3px solid ${active ? C.accent : "rgba(31,25,38,.16)"}`,
                  boxShadow: "0 18px 40px rgba(30,23,38,.14)",
                  opacity: cardIn,
                  translate: `0 ${interpolate(cardIn, [0, 1], [58, 0])}px`,
                }}
              >
                <Img
                  src={staticFile("seedance-storyboard.png")}
                  style={{
                    position: "absolute",
                    width: "300%",
                    height: "100%",
                    objectFit: "cover",
                    left: `${index * -100}%`,
                    scale: zoom,
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    left: 14,
                    top: 14,
                    borderRadius: 999,
                    background: "rgba(17,15,21,.78)",
                    color: "#FFF",
                    padding: "10px 14px",
                    fontFamily: mono,
                    fontSize: 16,
                  }}
                >
                  {label}
                </div>
              </div>
            );
          })}

          <svg
            viewBox="0 0 1000 120"
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: -40,
              width: "100%",
              height: 120,
              pointerEvents: "none",
            }}
          >
            <path
              d="M 170 50 C 260 100, 405 100, 500 50 C 595 0, 740 0, 830 50"
              fill="none"
              stroke={C.accent}
              strokeWidth="4"
              strokeDasharray="12 12"
              strokeDashoffset={interpolate(split, [0, 1], [160, 0])}
              opacity={split}
            />
            {[170, 500, 830].map((x) => (
              <circle key={x} cx={x} cy="50" r="10" fill={C.accent} />
            ))}
          </svg>
        </div>

        <div
          style={{
            justifySelf: "center",
            alignSelf: "center",
            borderRadius: 999,
            padding: "14px 28px",
            background: generation >= 100 ? C.accent : C.fg,
            color: C.bg,
            fontSize: 23,
            fontWeight: 700,
            letterSpacing: 1,
          }}
        >
          分镜生成进度 {String(generation).padStart(3, "0")}% · 景别与运镜已连接
        </div>
      </div>
    </Shell>
  );
};
