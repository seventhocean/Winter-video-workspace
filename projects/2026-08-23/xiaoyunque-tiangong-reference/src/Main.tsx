import type {CSSProperties, ReactNode} from "react";
import {
  AbsoluteFill,
  Img,
  OffthreadVideo,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type {ProjectProps} from "./schema";

const clamp = {extrapolateLeft: "clamp", extrapolateRight: "clamp"} as const;

const palette = {
  ink: "#141516",
  paper: "#f2eee5",
  white: "#fffaf1",
  gold: "#d7a85a",
  goldSoft: "#efd7aa",
  muted: "#c9c2b5",
  line: "rgba(239, 215, 170, 0.38)",
};

const fontFamily =
  '"PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", system-ui, sans-serif';

const fadeMove = (
  frame: number,
  start: number,
  distance = 28,
): CSSProperties => ({
  opacity: interpolate(frame, [start, start + 12], [0, 1], clamp),
  transform: `translateY(${interpolate(
    frame,
    [start, start + 14],
    [distance, 0],
    clamp,
  )}px)`,
});

const Label = ({children, style}: {children: ReactNode; style?: CSSProperties}) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 12,
      padding: "11px 18px",
      borderRadius: 999,
      border: `1px solid ${palette.line}`,
      background: "rgba(15, 16, 17, 0.72)",
      color: palette.white,
      fontSize: 23,
      fontWeight: 600,
      letterSpacing: 1,
      backdropFilter: "blur(14px)",
      ...style,
    }}
  >
    {children}
  </div>
);

const SourceTag = () => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 10,
      padding: "10px 15px",
      borderRadius: 8,
      color: palette.white,
      background: "rgba(8, 9, 10, 0.66)",
      fontSize: 21,
      fontWeight: 500,
      letterSpacing: 0.5,
      backdropFilter: "blur(12px)",
    }}
  >
    <span
      style={{
        width: 8,
        height: 8,
        borderRadius: "50%",
        background: palette.gold,
        boxShadow: `0 0 18px ${palette.gold}`,
      }}
    />
    参考素材：@栖光
  </div>
);

const VideoWindow = ({frame}: {frame: number}) => {
  const enter = interpolate(frame, [0, 18], [0.95, 1], clamp);
  const lift = interpolate(frame, [0, 18], [30, 0], clamp);
  const opacity = interpolate(frame, [0, 12], [0, 1], clamp);

  return (
    <div
      style={{
        position: "absolute",
        left: 132,
        top: 76,
        width: 1656,
        height: 932,
        overflow: "hidden",
        borderRadius: 18,
        border: "1px solid rgba(239, 215, 170, 0.42)",
        boxShadow: "0 34px 100px rgba(0, 0, 0, 0.42)",
        transform: `translateY(${lift}px) scale(${enter})`,
        opacity,
        background: palette.ink,
      }}
    >
      <OffthreadVideo
        src={staticFile("reference-stable.mp4")}
        muted
        style={{width: "100%", height: "100%", objectFit: "cover"}}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.34) 0%, transparent 22%, transparent 72%, rgba(0,0,0,0.42) 100%)",
        }}
      />
      <div style={{position: "absolute", left: 30, top: 28}}>
        <Label>
          <span style={{color: palette.goldSoft, fontSize: 17, letterSpacing: 2}}>
            REFERENCE
          </span>
          <span style={{width: 1, height: 22, background: palette.line}} />
          近期热门案例
        </Label>
      </div>
      <div style={{position: "absolute", right: 28, bottom: 26}}>
        <SourceTag />
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          bottom: 0,
          width: `${interpolate(frame, [0, 150], [0, 100], clamp)}%`,
          height: 4,
          background: `linear-gradient(90deg, ${palette.gold}, ${palette.goldSoft})`,
        }}
      />
    </div>
  );
};

const FeatureRow = ({
  frame,
  start,
  index,
  title,
  body,
}: {
  frame: number;
  start: number;
  index: string;
  title: string;
  body: string;
}) => (
  <div
    style={{
      ...fadeMove(frame, start, 24),
      display: "grid",
      gridTemplateColumns: "54px 1fr",
      gap: 18,
      alignItems: "center",
      padding: "16px 0",
      borderBottom: "1px solid rgba(239, 215, 170, 0.17)",
    }}
  >
    <div
      style={{
        width: 48,
        height: 48,
        borderRadius: "50%",
        display: "grid",
        placeItems: "center",
        border: `1px solid ${palette.line}`,
        color: palette.goldSoft,
        fontSize: 17,
        fontWeight: 700,
        fontFamily: "Menlo, monospace",
      }}
    >
      {index}
    </div>
    <div>
      <div style={{fontSize: 31, fontWeight: 650, color: palette.white}}>{title}</div>
      <div style={{fontSize: 19, color: palette.muted, marginTop: 4}}>{body}</div>
    </div>
  </div>
);

const DeconstructStage = ({frame}: {frame: number}) => {
  const local = frame - 150;
  const sceneIn = interpolate(local, [0, 14], [0, 1], clamp);

  return (
    <AbsoluteFill style={{opacity: sceneIn}}>
      <div
        style={{
          position: "absolute",
          left: 76,
          top: 72,
          fontSize: 18,
          letterSpacing: 4,
          color: palette.goldSoft,
          fontWeight: 700,
        }}
      >
        VISUAL DECONSTRUCTION · 案例拆解
      </div>
      <div
        style={{
          position: "absolute",
          left: 76,
          top: 112,
          color: palette.white,
          fontSize: 45,
          fontWeight: 650,
          letterSpacing: -1,
        }}
      >
        为什么它有“巨物感”？
      </div>

      <div
        style={{
          position: "absolute",
          left: 76,
          top: 220,
          width: 1110,
          height: 624,
          borderRadius: 16,
          overflow: "hidden",
          border: `1px solid ${palette.line}`,
          boxShadow: "0 28px 90px rgba(0,0,0,0.42)",
        }}
      >
        <Img
          src={staticFile("reference-freeze.jpg")}
          style={{width: "100%", height: "100%", objectFit: "cover"}}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.08)",
          }}
        />
        <div style={{position: "absolute", right: 20, bottom: 18}}>
          <SourceTag />
        </div>
      </div>

      <div style={{position: "absolute", left: 1248, top: 238, width: 584}}>
        <FeatureRow frame={local} start={12} index="01" title="巨型建筑" body="主体突破常规尺度，占据画面中心" />
        <FeatureRow frame={local} start={22} index="02" title="极小人物" body="用人物比例直接建立尺度参照" />
        <FeatureRow frame={local} start={32} index="03" title="云海纵深" body="远近层次把空间继续向外拉开" />
      </div>
    </AbsoluteFill>
  );
};

const FlowStep = ({
  frame,
  start,
  eyebrow,
  title,
}: {
  frame: number;
  start: number;
  eyebrow: string;
  title: string;
}) => {
  const active = interpolate(frame, [start, start + 12], [0, 1], clamp);
  return (
    <div
      style={{
        width: 286,
        height: 154,
        padding: "26px 28px",
        borderRadius: 16,
        border: `1px solid rgba(239, 215, 170, ${0.2 + active * 0.55})`,
        background: `rgba(35, 31, 27, ${0.58 + active * 0.22})`,
        boxShadow: `0 18px 50px rgba(0,0,0,${0.16 + active * 0.16})`,
        transform: `translateY(${(1 - active) * 24}px)`,
        opacity: active,
      }}
    >
      <div style={{color: palette.goldSoft, fontSize: 15, letterSpacing: 2.4}}>{eyebrow}</div>
      <div style={{color: palette.white, fontSize: 32, fontWeight: 650, marginTop: 16}}>{title}</div>
    </div>
  );
};

const WorkflowStage = ({frame}: {frame: number}) => {
  const local = frame - 210;
  const enter = interpolate(local, [0, 14], [0, 1], clamp);
  const lineProgress = interpolate(local, [18, 62], [0, 1], clamp);

  return (
    <AbsoluteFill style={{opacity: enter}}>
      <div style={{position: "absolute", left: 76, top: 72, color: palette.goldSoft, fontSize: 18, letterSpacing: 4, fontWeight: 700}}>
        WINTER WORKFLOW · 天宫巨物 SKILL
      </div>
      <div style={{position: "absolute", left: 76, top: 122, color: palette.white, fontSize: 55, lineHeight: 1.2, fontWeight: 650}}>
        一句话，完成从构思到视频
      </div>
      <div style={{position: "absolute", left: 76, top: 207, color: palette.muted, fontSize: 25}}>
        输入场景与时长，自动生成关键帧和动态画面
      </div>

      <div style={{position: "absolute", left: 258, top: 414, display: "flex", gap: 78, zIndex: 2}}>
        <FlowStep frame={local} start={8} eyebrow="INPUT · 01" title="场景＋时长" />
        <FlowStep frame={local} start={24} eyebrow="FRAME · 02" title="生成关键帧" />
        <FlowStep frame={local} start={40} eyebrow="VIDEO · 03" title="生成视频" />
      </div>

      <div
        style={{
          position: "absolute",
          left: 544,
          top: 490,
          width: 884,
          height: 2,
          transformOrigin: "left center",
          transform: `scaleX(${lineProgress})`,
          background: `linear-gradient(90deg, ${palette.gold}, ${palette.goldSoft})`,
          opacity: 0.72,
          zIndex: 1,
        }}
      />
      {[544, 908, 1272].map((left, index) => (
        <div
          key={left}
          style={{
            position: "absolute",
            left: left - 6,
            top: 484,
            width: 14,
            height: 14,
            borderRadius: "50%",
            background: palette.gold,
            opacity: interpolate(local, [12 + index * 16, 22 + index * 16], [0, 1], clamp),
            boxShadow: `0 0 22px ${palette.gold}`,
          }}
        />
      ))}
    </AbsoluteFill>
  );
};

const HandoffStage = ({frame}: {frame: number}) => {
  const local = frame - 285;
  const reveal = interpolate(local, [0, 12], [0, 1], clamp);
  const wipe = interpolate(local, [16, 27], [0, 1], clamp);

  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "grid",
          placeItems: "center",
          opacity: reveal,
          transform: `scale(${0.96 + reveal * 0.04})`,
        }}
      >
        <div style={{textAlign: "center"}}>
          <div style={{fontSize: 18, letterSpacing: 5, color: palette.goldSoft, fontWeight: 700}}>
            GENERATED WITH MY SKILL
          </div>
          <div style={{fontSize: 68, color: palette.white, fontWeight: 680, marginTop: 22}}>
            我的生成效果
          </div>
          <div style={{width: 122, height: 3, margin: "28px auto 0", background: palette.gold, transform: `scaleX(${reveal})`}} />
        </div>
      </div>
      <div style={{position: "absolute", inset: 0, background: palette.paper, transform: `translateX(${(1 - wipe) * 100}%)`}} />
    </AbsoluteFill>
  );
};

export const Main = ({timeline}: ProjectProps) => {
  const frame = useCurrentFrame();
  const {width} = useVideoConfig();
  const scale = width / 1920;

  return (
    <AbsoluteFill style={{background: palette.ink, overflow: "hidden", fontFamily}}>
      <div style={{position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transform: `scale(${scale})`, transformOrigin: "top left"}}>
        <Img
          src={staticFile("reference-freeze.jpg")}
          style={{position: "absolute", inset: -50, width: 2020, height: 1180, objectFit: "cover", filter: "blur(36px) saturate(0.72)", opacity: 0.34, transform: "scale(1.08)"}}
        />
        <div style={{position: "absolute", inset: 0, background: "radial-gradient(circle at 50% 42%, rgba(215,168,90,0.10), transparent 46%), linear-gradient(135deg, rgba(10,12,13,0.74), rgba(21,22,23,0.94))"}} />

        <Sequence from={0} durationInFrames={150}><VideoWindow frame={frame} /></Sequence>
        <Sequence from={150} durationInFrames={60}><DeconstructStage frame={frame} /></Sequence>
        <Sequence from={210} durationInFrames={75}><WorkflowStage frame={frame} /></Sequence>
        <Sequence from={285} durationInFrames={Math.max(1, Math.round(timeline.duration * 30) - 285)}><HandoffStage frame={frame} /></Sequence>
      </div>
    </AbsoluteFill>
  );
};
