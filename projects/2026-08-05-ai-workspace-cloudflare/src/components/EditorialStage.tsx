import type {CSSProperties, ReactNode} from "react";
import {Img, interpolate, staticFile, useCurrentFrame, useVideoConfig} from "remotion";
import type {SemanticCue, StageScene} from "../schema";
import {accentColor, getProgressivePalette, theme} from "../theme";

const ease = (frame: number, from: number, length = 14) =>
  interpolate(frame, [from, from + length], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

const CueIn = ({
  children,
  progress,
  style,
}: {
  children: ReactNode;
  progress: number;
  style?: CSSProperties;
}) => (
  <div
    style={{
      opacity: progress,
      transform: `translateY(${(1 - progress) * 24}px)`,
      ...style,
    }}
  >
    {children}
  </div>
);

const Eyebrow = ({cue, color}: {cue: SemanticCue; color: string}) => (
  <div style={{display: "flex", alignItems: "center", gap: 12, marginBottom: 12}}>
    <span style={{width: 4, height: 22, background: color}} />
    <span
      style={{
        color,
        fontFamily: theme.monoFont,
        fontSize: 15,
        fontWeight: 700,
        letterSpacing: 2.5,
        textTransform: "uppercase",
      }}
    >
      {cue.eyebrow ?? cue.title ?? "EDITORIAL NOTE"}
    </span>
  </div>
);

const FinePrint = ({children}: {children?: string}) =>
  children ? (
    <div
      style={{
        marginTop: 12,
        maxWidth: 620,
        color: "rgba(255,255,255,.72)",
        fontSize: 22,
        fontWeight: 500,
        lineHeight: 1.4,
        textShadow: "0 2px 12px rgba(0,0,0,.75)",
      }}
    >
      {children}
    </div>
  ) : null;

const MicroTag = ({children, color}: {children: string; color: string}) => (
  <span
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 7,
      color: "rgba(255,255,255,.82)",
      fontFamily: theme.monoFont,
      fontSize: 13,
      fontWeight: 700,
      letterSpacing: 1.2,
      whiteSpace: "nowrap",
    }}
  >
    <span style={{width: 6, height: 6, borderRadius: "50%", background: color}} />
    {children}
  </span>
);

const DocumentCluster = ({cue, progress, color}: {cue: SemanticCue; progress: number; color: string}) => {
  const labels = cue.nodes?.slice(0, 3) ?? ["WEB PAGE", "SKILL.md", "INSTALL"];
  return (
    <div style={{position: "relative", width: 230, height: 176}}>
      <div style={{position: "absolute", left: 2, top: 30, width: 148, height: 104, border: "2px solid rgba(255,255,255,.78)", background: "rgba(12,16,18,.18)", transform: `translateX(${(1 - progress) * 25}px) rotate(-5deg)`}}>
        <div style={{height: 18, borderBottom: "1px solid rgba(255,255,255,.42)", display: "flex", gap: 5, alignItems: "center", paddingLeft: 8}}>
          {[0, 1, 2].map((dot) => <span key={dot} style={{width: 4, height: 4, borderRadius: "50%", background: dot === 0 ? color : "rgba(255,255,255,.55)"}} />)}
        </div>
        <div style={{padding: 12}}>
          <div style={{height: 7, width: 86, background: "white"}} />
          <div style={{height: 4, width: 110, background: "rgba(255,255,255,.42)", marginTop: 10}} />
          <div style={{height: 4, width: 72, background: "rgba(255,255,255,.28)", marginTop: 6}} />
        </div>
      </div>
      <div style={{position: "absolute", right: 2, top: 0, width: 96, height: 126, padding: 12, boxSizing: "border-box", background: "rgba(246,246,242,.94)", color: "#171717", boxShadow: "0 12px 28px rgba(0,0,0,.3)", transform: `translateY(${(1 - progress) * -22}px) rotate(5deg)`}}>
        <div style={{fontSize: 11, fontWeight: 900}}>SKILL.md</div>
        <div style={{height: 3, background: color, marginTop: 9}} />
        {[70, 58, 76, 44].map((width, index) => <div key={index} style={{height: 3, width: `${width}%`, background: "rgba(10,10,10,.38)", marginTop: 8}} />)}
      </div>
      <div style={{position: "absolute", left: 4, bottom: 0, display: "flex", gap: 14}}>
        {labels.map((label) => <MicroTag key={label} color={color}>{label}</MicroTag>)}
      </div>
    </div>
  );
};

const HeroStat = ({cue, frame, cueFrame, color}: EditorialProps) => {
  const {width, height} = useVideoConfig();
  const portrait = height > width;
  const detail = ease(frame, cueFrame + 5);
  const support = ease(frame, cueFrame + 10, 14);
  return (
    <>
      <Eyebrow cue={cue} color={color} />
      <div style={{display: "flex", alignItems: "baseline", gap: 12}}>
        <span
          style={{
            fontFamily: theme.displayFont,
            fontSize: 148,
            fontWeight: 900,
            lineHeight: 0.86,
            letterSpacing: -9,
            textShadow: "0 5px 24px rgba(0,0,0,.5)",
          }}
        >
          {cue.hero ?? cue.valueTo ?? "1"}
        </span>
        <span style={{color, fontSize: 43, fontWeight: 850, letterSpacing: -1}}>
          {cue.suffix ?? cue.unit ?? "DAY"}
        </span>
      </div>
      <CueIn progress={detail}>
        <div style={{fontSize: 38, fontWeight: 820, marginTop: 16}}>
          {cue.secondary ?? cue.label}
        </div>
        <div style={{width: `${detail * 420}px`, height: 4, background: color, marginTop: 15}} />
        <FinePrint>{cue.body}</FinePrint>
      </CueIn>
      <CueIn progress={support} style={{position: "absolute", left: portrait ? 470 : 1120, top: portrait ? 42 : 82}}>
        <DocumentCluster cue={cue} progress={support} color={color} />
      </CueIn>
    </>
  );
};

const HeroTitle = ({cue, frame, cueFrame, color}: EditorialProps) => {
  const detail = ease(frame, cueFrame + 5);
  const relation = ease(frame, cueFrame + 11, 12);
  return (
    <>
      <Eyebrow cue={cue} color={color} />
      <div
        style={{
          maxWidth: 760,
          fontSize: cue.hero && cue.hero.length <= 2 ? 156 : 76,
          fontWeight: 900,
          lineHeight: 0.98,
          letterSpacing: -4,
          textShadow: "0 5px 28px rgba(0,0,0,.58)",
        }}
      >
        {cue.hero ?? cue.label ?? cue.title}
      </div>
      <CueIn progress={detail}>
        <div style={{display: "flex", alignItems: "center", gap: 14, marginTop: 20}}>
          <span style={{width: 42, height: 4, background: color}} />
          <span style={{fontSize: 30, fontWeight: 760}}>{cue.secondary ?? cue.label}</span>
        </div>
        <FinePrint>{cue.body}</FinePrint>
      </CueIn>
      {cue.nodes?.length ? (
        <CueIn progress={relation} style={{marginTop: 30}}>
          <div style={{display: "flex", alignItems: "center", gap: 11}}>
            {cue.nodes.slice(0, 3).map((node, index) => (
              <div key={node} style={{display: "flex", alignItems: "center", gap: 11}}>
                <div style={{position: "relative", minWidth: 114}}>
                  <div style={{fontFamily: theme.monoFont, fontSize: 12, color: index === 2 ? color : "rgba(255,255,255,.58)", letterSpacing: 1.6}}>0{index + 1}</div>
                  <div style={{fontSize: 20, fontWeight: 800, marginTop: 3}}>{node}</div>
                  {index === 2 ? <div style={{position: "absolute", left: -4, right: -4, top: 23, height: 3, background: color, transform: "rotate(-7deg)"}} /> : null}
                </div>
                {index < Math.min(2, cue.nodes!.length - 1) ? <span style={{fontSize: 24, color: "rgba(255,255,255,.52)"}}>→</span> : null}
              </div>
            ))}
          </div>
        </CueIn>
      ) : null}
    </>
  );
};

const Flow = ({cue, frame, cueFrame, color}: EditorialProps) => {
  const nodes = cue.nodes?.length ? cue.nodes : ["SOURCE", "PATH A", "PATH B", "RESULT"];
  const left = nodes.slice(0, 2);
  const right = nodes.slice(2, 4);
  return (
    <>
      <Eyebrow cue={cue} color={color} />
      <div style={{fontSize: 52, fontWeight: 900, lineHeight: 1.05}}>{cue.hero ?? cue.label}</div>
      <div style={{display: "flex", gap: 22, marginTop: 14}}>
        {(cue.tags ?? ["2 VERSION", "2 PROJECT"]).map((tag) => <MicroTag key={tag} color={color}>{tag}</MicroTag>)}
      </div>
      <div style={{position: "relative", width: 670, height: 190, marginTop: 30}}>
        <div style={{position: "absolute", left: 112, right: 112, top: 92, height: 2, background: "rgba(255,255,255,.34)"}} />
        <div style={{position: "absolute", left: 332, top: 30, width: 2, height: 126, background: "rgba(255,255,255,.24)"}} />
        {[...left, ...right].map((node, index) => {
          const nodeIn = ease(frame, cueFrame + 5 + index * 5, 10);
          const isRight = index >= 2;
          const row = index % 2;
          return (
            <CueIn
              key={`${node}-${index}`}
              progress={nodeIn}
              style={{
                position: "absolute",
                left: isRight ? 390 : 0,
                top: row * 105,
                width: 280,
                transform: `translateX(${(1 - nodeIn) * (isRight ? 22 : -22)}px)`,
              }}
            >
              <div style={{color: row === 0 ? color : "rgba(255,255,255,.58)", fontFamily: theme.monoFont, fontSize: 15, letterSpacing: 2}}>
                {String(index + 1).padStart(2, "0")}
              </div>
              <div style={{fontSize: 32, fontWeight: 850, marginTop: 4}}>{node}</div>
            </CueIn>
          );
        })}
      </div>
      <FinePrint>{cue.body}</FinePrint>
    </>
  );
};

const Steps = ({cue, frame, cueFrame, color}: EditorialProps) => {
  const items = cue.nodes?.length ? cue.nodes : ["理解", "整理", "映射", "调用"];
  const symbols = cue.symbols?.length ? cue.symbols : ["⌕", "V", "↔", "A"];
  return (
    <>
      <Eyebrow cue={cue} color={color} />
      <div style={{display: "flex", alignItems: "baseline", gap: 12}}>
        <span style={{fontSize: 104, fontWeight: 920, lineHeight: 0.9, letterSpacing: -6}}>{cue.hero ?? items.length}</span>
        <span style={{fontSize: 35, color, fontWeight: 850}}>{cue.suffix ?? "STEP"}</span>
      </div>
      <div style={{fontSize: 34, fontWeight: 780, marginTop: 16}}>{cue.secondary ?? cue.label}</div>
      <div style={{display: "flex", marginTop: 34, width: 760}}>
        {items.map((item, index) => {
          const itemIn = ease(frame, cueFrame + 6 + index * 5, 10);
          return (
            <CueIn key={item} progress={itemIn} style={{flex: 1, position: "relative", paddingRight: 18}}>
              <div style={{position: "absolute", right: 22, top: 22, color: "rgba(255,255,255,.24)", fontFamily: theme.monoFont, fontSize: 42, fontWeight: 900}}>{symbols[index] ?? "•"}</div>
              <div style={{display: "flex", alignItems: "center"}}>
                <div style={{width: 13, height: 13, borderRadius: "50%", background: index === items.length - 1 ? color : "white"}} />
                {index < items.length - 1 ? <div style={{height: 2, flex: 1, background: "rgba(255,255,255,.42)"}} /> : null}
              </div>
              <div style={{fontFamily: theme.monoFont, color, fontSize: 14, marginTop: 12}}>0{index + 1}</div>
              <div style={{fontSize: 25, fontWeight: 800, marginTop: 4}}>{item}</div>
            </CueIn>
          );
        })}
      </div>
      <div style={{display: "flex", gap: 24, marginTop: 22}}>
        {(cue.tags ?? []).map((tag) => <MicroTag key={tag} color={color}>{tag}</MicroTag>)}
      </div>
      <FinePrint>{cue.body}</FinePrint>
    </>
  );
};

const Quote = ({cue, color}: EditorialProps) => (
  <>
    <Eyebrow cue={cue} color={color} />
    <div style={{display: "flex", gap: 18, alignItems: "flex-start"}}>
      <div style={{color, fontSize: 92, fontFamily: "Georgia, serif", lineHeight: 0.9}}>“</div>
      <div style={{maxWidth: 680, fontSize: 52, fontWeight: 880, lineHeight: 1.16, letterSpacing: -2}}>
        {cue.hero ?? cue.label ?? cue.body}
      </div>
    </div>
    <FinePrint>{cue.secondary ?? (cue.hero || cue.label ? cue.body : undefined)}</FinePrint>
  </>
);

const Profile = ({cue, frame, cueFrame, color}: EditorialProps) => (
  <>
    <Eyebrow cue={cue} color={color} />
    <div style={{fontSize: 28, fontWeight: 650, opacity: 0.8}}>{cue.secondary}</div>
    <div style={{fontSize: 62, fontWeight: 900, lineHeight: 1.05, marginTop: 4}}>{cue.hero ?? cue.label}</div>
    <div style={{marginTop: 24}}>
      {(cue.nodes ?? []).map((item, index) => (
        <CueIn key={item} progress={ease(frame, cueFrame + 6 + index * 5, 10)} style={{display: "flex", gap: 14, alignItems: "center", marginTop: 14}}>
          <span style={{width: 8, height: 8, background: color}} />
          <span style={{fontSize: 25, fontWeight: 650}}>{item}</span>
        </CueIn>
      ))}
    </div>
  </>
);

const Bars = ({cue, frame, cueFrame, color}: EditorialProps) => {
  const items = cue.nodes ?? ["第一项", "第二项", "第三项"];
  return (
    <>
      <HeroStat cue={cue} frame={frame} cueFrame={cueFrame} color={color} />
      <div style={{marginTop: 26, width: 650}}>
        {items.map((item, index) => {
          const barIn = ease(frame, cueFrame + 10 + index * 5, 12);
          return (
            <div key={item} style={{display: "grid", gridTemplateColumns: "130px 1fr", gap: 18, alignItems: "center", marginTop: 13}}>
              <span style={{fontSize: 19, fontWeight: 650}}>{item}</span>
              <span style={{display: "block", height: 9, width: `${barIn * (90 - index * 18)}%`, background: index === 0 ? color : "rgba(255,255,255,.58)"}} />
            </div>
          );
        })}
      </div>
    </>
  );
};

const Media = ({cue, color}: EditorialProps) => (
  <>
    <Eyebrow cue={cue} color={color} />
    <div style={{fontSize: 52, fontWeight: 900, marginBottom: 20}}>{cue.hero ?? cue.label}</div>
    {cue.assetId ? (
      <Img src={staticFile(cue.assetId)} alt={cue.alt ?? ""} style={{width: 650, maxHeight: 360, objectFit: "cover", boxShadow: "0 18px 55px rgba(0,0,0,.42)"}} />
    ) : null}
    <FinePrint>{cue.secondary ?? cue.body}</FinePrint>
  </>
);

type EditorialProps = {
  cue: SemanticCue;
  frame: number;
  cueFrame: number;
  color: string;
};

const editorialComponents: Record<string, (props: EditorialProps) => ReactNode> = {
  "hero-stat": HeroStat,
  "hero-title": HeroTitle,
  flow: Flow,
  steps: Steps,
  quote: Quote,
  profile: Profile,
  media: Media,
  bars: Bars,
};

export const EditorialStage = ({scene}: {scene: StageScene}) => {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();
  const portrait = height > width;
  const cues = scene.semanticCues ?? [];
  let activeIndex = -1;
  for (let index = 0; index < cues.length; index++) {
    if (frame >= Math.round(cues[index].at * fps)) activeIndex = index;
  }
  if (activeIndex < 0) return null;
  const cue = cues[activeIndex];
  const cueFrame = Math.round(cue.at * fps);
  const nextFrame = cues[activeIndex + 1] ? Math.round(cues[activeIndex + 1].at * fps) : Math.round(scene.duration * fps);
  const enter = ease(frame, cueFrame, 12);
  const leave = interpolate(frame, [nextFrame - 8, nextFrame], [1, 0], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  const palette = getProgressivePalette(scene.styleProfile);
  const color = accentColor(cue.accent ?? "success", scene.styleProfile);
  const Component = editorialComponents[cue.composition ?? "hero-title"] ?? HeroTitle;
  const right = scene.stagePosition === "right";

  return (
    <div
      style={{
        position: "absolute",
        top: portrait ? 150 : 92,
        ...(right ? {right: portrait ? 70 : 86} : {left: portrait ? 70 : 86}),
        width: portrait ? 820 : 790,
        color: palette.text,
        zIndex: 7,
        opacity: enter * leave,
        transform: `translateX(${(1 - enter) * (right ? 28 : -28)}px)`,
        textAlign: right ? "left" : "left",
        textShadow: "0 3px 18px rgba(0,0,0,.38)",
      }}
    >
      <Component cue={cue} frame={frame} cueFrame={cueFrame} color={color} />
    </div>
  );
};
