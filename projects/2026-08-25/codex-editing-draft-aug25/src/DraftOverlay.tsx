import type {CSSProperties, ReactNode} from "react";
import {Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from "remotion";

const CONTENT_TOP = 209.5;
const CONTENT_HEIGHT = 1920;

const T = {
  blue: "#147BFF",
  cyan: "#26C6F4",
  ink: "#0B0F17",
  white: "#FFFDF8",
  pale: "#DCEBFF",
  muted: "#657184",
} as const;

const clamp = {extrapolateLeft: "clamp", extrapolateRight: "clamp"} as const;
const ease = Easing.bezier(0.16, 1, 0.3, 1);
const progress = (time: number, at: number, duration = 0.38) =>
  interpolate(time, [at, at + duration], [0, 1], {...clamp, easing: ease});
const between = (time: number, start: number, end: number) =>
  Math.min(progress(time, start, 0.2), interpolate(time, [end - 0.2, end], [1, 0], {...clamp, easing: ease}));

const pop = (time: number, at: number) => spring({
  frame: Math.max(0, (time - at) * 30),
  fps: 30,
  config: {damping: 14, stiffness: 180, mass: 0.72},
});

const PictogramShell = ({children, amount, size = 142, color = T.blue, style}: {
  children: ReactNode;
  amount: number;
  size?: number;
  color?: string;
  style?: CSSProperties;
}) => <div style={{
  width: size,
  height: size,
  borderRadius: size * 0.29,
  background: color,
  position: "relative",
  opacity: amount,
  transform: `translateY(${(1 - amount) * 28}px) scale(${0.78 + amount * 0.22})`,
  boxShadow: `0 18px 38px ${color}33`,
  ...style,
}}>{children}</div>;

const MicIcon = ({amount, size = 142}: {amount: number; size?: number}) => <PictogramShell amount={amount} size={size}>
  <div style={{position: "absolute", left: "40%", top: "21%", width: "20%", height: "41%", borderRadius: 30, background: T.white}} />
  <div style={{position: "absolute", left: "31%", top: "51%", width: "38%", height: "25%", border: `${Math.max(5, size * 0.05)}px solid ${T.white}`, borderTop: 0, borderRadius: "0 0 30px 30px"}} />
  <div style={{position: "absolute", left: "47%", top: "73%", width: "7%", height: "15%", background: T.white}} />
</PictogramShell>;

const FolderIcon = ({amount, size = 150}: {amount: number; size?: number}) => <div style={{width: size * 1.18, height: size, position: "relative", opacity: amount, transform: `translateY(${(1 - amount) * 30}px) scale(${0.8 + amount * 0.2})`}}>
  <div style={{position: "absolute", left: 8, top: size * 0.25, width: size * 0.52, height: size * 0.24, borderRadius: "18px 18px 0 0", background: T.blue}} />
  <div style={{position: "absolute", inset: `${size * 0.38}px 0 0 0`, borderRadius: 26, background: T.blue, boxShadow: "0 18px 38px rgba(20,123,255,.25)"}} />
  <div style={{position: "absolute", left: size * 0.3, top: size * 0.04, width: size * 0.34, height: size * 0.53, borderRadius: 10, background: T.white, transform: "rotate(-7deg)"}}>
    <div style={{position: "absolute", left: "18%", top: "20%", width: "60%", height: "11%", borderRadius: 8, background: T.cyan}} />
  </div>
  <div style={{position: "absolute", right: size * 0.18, top: size * 0.1, width: size * 0.34, height: size * 0.53, borderRadius: 10, background: T.ink, transform: "rotate(7deg)"}}>
    <div style={{position: "absolute", left: "18%", top: "20%", width: "60%", height: "11%", borderRadius: 8, background: T.blue}} />
  </div>
</div>;

const CodexIcon = ({amount, size = 142}: {amount: number; size?: number}) => <PictogramShell amount={amount} size={size} color={T.ink}>
  {[[-1, 0], [1, 0], [0, -1], [0, 1]].map(([x, y], index) => <div key={index} style={{
    position: "absolute",
    left: "50%",
    top: "50%",
    width: size * 0.18,
    height: size * 0.18,
    borderRadius: size * 0.045,
    background: index === 3 ? T.cyan : T.blue,
    transform: `translate(calc(-50% + ${x * size * 0.2}px), calc(-50% + ${y * size * 0.2}px)) rotate(45deg)`,
  }} />)}
</PictogramShell>;

const SubtitleIcon = ({amount, width = 210}: {amount: number; width?: number}) => <div style={{
  width,
  height: width * 0.42,
  borderRadius: 22,
  background: T.ink,
  padding: 18,
  boxSizing: "border-box",
  opacity: amount,
  transform: `translateY(${(1 - amount) * 24}px) scale(${0.82 + amount * 0.18})`,
  boxShadow: "0 18px 38px rgba(11,15,23,.2)",
}}>
  <div style={{display: "flex", alignItems: "center", gap: 10}}>
    <div style={{padding: "7px 9px", borderRadius: 9, background: T.blue, color: T.white, fontSize: 14, fontWeight: 950}}>00:21</div>
    <div style={{color: T.white, fontSize: 22, fontWeight: 950}}>时间字幕</div>
  </div>
  <div style={{marginTop: 13, height: 8, borderRadius: 8, width: `${amount * 100}%`, background: `linear-gradient(90deg,${T.blue},${T.cyan})`}} />
</div>;

const BranchHeader = ({time}: {time: number}) => {
  const titleIn = pop(time, 9.98);
  const dock = progress(time, 11.5, 0.46);
  const options = progress(time, 10.48, 0.38);
  const active = progress(time, 11.62, 0.34);
  const second = progress(time, 56.14, 0.42);
  const titleSize = interpolate(dock, [0, 1], [112, 58], clamp);
  const titleY = interpolate(dock, [0, 1], [102, 58], clamp);
  const optionsY = interpolate(dock, [0, 1], [250, 138], clamp);

  return <div style={{position: "absolute", inset: 0}}>
    <div style={{
      position: "absolute",
      left: 54,
      top: titleY,
      color: T.ink,
      fontSize: titleSize,
      fontWeight: 950,
      letterSpacing: -4,
      lineHeight: 1,
      transform: `scale(${interpolate(titleIn, [0, 0.75, 1], [1.24, 0.97, 1], clamp)})`,
      transformOrigin: "left top",
      opacity: progress(time, 9.98, 0.16),
      textShadow: "0 3px 15px rgba(255,255,255,.8)",
    }}><span style={{color: T.blue}}>2</span>种方式</div>

    <div style={{position: "absolute", left: 54, top: optionsY, display: "flex", gap: 14, opacity: options, transform: `translateY(${(1 - options) * 20}px)`}}>
      <div style={{
        width: 276,
        height: 62,
        borderRadius: 17,
        background: second > 0.5 ? "rgba(11,15,23,.82)" : active > 0.5 ? T.blue : T.ink,
        color: T.white,
        display: "grid",
        placeItems: "center",
        fontSize: 29,
        fontWeight: 950,
        boxShadow: second < 0.5 && active > 0.5 ? "0 13px 28px rgba(20,123,255,.22)" : "0 12px 25px rgba(11,15,23,.13)",
      }}>真人口播</div>
      <div style={{
        width: 276,
        height: 62,
        borderRadius: 17,
        background: second > 0.5 ? T.blue : active > 0.5 ? "rgba(11,15,23,.82)" : T.blue,
        color: T.white,
        display: "grid",
        placeItems: "center",
        fontSize: 29,
        fontWeight: 950,
        opacity: second > 0.5 ? 1 : interpolate(active, [0, 1], [1, 0.72], clamp),
      }}>AI 生成</div>
    </div>
  </div>;
};

type ItemIcon = "mic" | "folder" | "codex" | "subtitle";

const ItemGraphic = ({kind, amount, mini}: {kind: ItemIcon; amount: number; mini: boolean}) => {
  const size = mini ? 52 : 142;
  if (kind === "mic") return <MicIcon amount={amount} size={size} />;
  if (kind === "folder") return <FolderIcon amount={amount} size={mini ? 58 : 150} />;
  if (kind === "codex") return <CodexIcon amount={amount} size={size} />;
  return <SubtitleIcon amount={amount} width={mini ? 106 : 226} />;
};

const ProgressiveItem = ({time, at, archiveAt, archiveY, title, accent, icon, bigY}: {
  time: number;
  at: number;
  archiveAt: number;
  archiveY: number;
  title: string;
  accent: string;
  icon: ItemIcon;
  bigY: number;
}) => {
  if (time < at) return null;
  const enter = pop(time, at);
  const archived = progress(time, archiveAt, 0.42);
  const fontSize = interpolate(archived, [0, 1], [72, 31], clamp);
  const y = interpolate(archived, [0, 1], [bigY, archiveY], clamp);
  const graphicScale = interpolate(archived, [0, 1], [1, 0.38], clamp);
  const graphicX = interpolate(archived, [0, 1], [840, 370], clamp);
  const graphicY = interpolate(archived, [0, 1], [bigY + 44, archiveY - 10], clamp);
  const titleParts = title.split(accent);

  return <div style={{position: "absolute", inset: 0}}>
    <div style={{
      position: "absolute",
      left: 58,
      top: y,
      fontSize,
      fontWeight: 950,
      color: T.ink,
      letterSpacing: archived > 0.5 ? -1 : -3,
      lineHeight: 1,
      whiteSpace: "nowrap",
      opacity: progress(time, at, 0.16),
      transform: `translateY(${(1 - enter) * 26}px) scale(${interpolate(enter, [0, 0.75, 1], [1.18, 0.98, 1], clamp)})`,
      transformOrigin: "left center",
      textShadow: "0 3px 13px rgba(255,255,255,.86)",
    }}>
      {titleParts[0]}<span style={{color: T.blue}}>{accent}</span>{titleParts[1]}
    </div>
    <div style={{position: "absolute", left: graphicX, top: graphicY, transform: `scale(${graphicScale})`, transformOrigin: "left top"}}>
      <ItemGraphic kind={icon} amount={progress(time, at + 0.18, 0.34)} mini={false} />
    </div>
  </div>;
};

const SummaryFlow = ({time}: {time: number}) => {
  const start = 23.08;
  if (time < start) return null;
  const overall = progress(time, start, 0.36);
  const steps = [
    {label: "口播", at: 23.12},
    {label: "素材", at: 23.42},
    {label: "Codex", at: 23.72},
    {label: "识别", at: 24.02},
    {label: "字幕", at: 24.32},
  ];
  return <div style={{position: "absolute", left: 54, right: 54, bottom: 110, opacity: overall}}>
    <div style={{fontSize: 30, fontWeight: 950, color: T.ink, marginBottom: 18}}>真人口播的剪辑流程</div>
    <div style={{display: "flex", alignItems: "center", gap: 8}}>
      {steps.map((step, index) => {
        const a = progress(time, step.at, 0.28);
        return <div key={step.label} style={{display: "contents"}}>
          <div style={{
            flex: 1,
            height: 66,
            borderRadius: 17,
            background: index === steps.length - 1 ? T.blue : T.ink,
            color: T.white,
            display: "grid",
            placeItems: "center",
            fontSize: 23,
            fontWeight: 950,
            opacity: a,
            transform: `translateY(${(1 - a) * 22}px)`,
            boxShadow: index === steps.length - 1 ? "0 12px 28px rgba(20,123,255,.22)" : "0 10px 24px rgba(11,15,23,.14)",
          }}>{step.label}</div>
          {index < steps.length - 1 && <div style={{fontSize: 27, fontWeight: 950, color: T.blue, opacity: progress(time, step.at + 0.2, 0.2)}}>→</div>}
        </div>;
      })}
    </div>
  </div>;
};

const OpeningStage = ({time}: {time: number}) => {
  const alpha = between(time, 0.2, 9.7);
  if (alpha <= 0) return null;
  const dock = progress(time, 3.35, 0.46);
  const count = Math.round(interpolate(time, [0.28, 1.35], [0, 10], clamp));
  const flow = [
    {label: "测试", at: 0.45},
    {label: "Codex", at: 3.82},
    {label: "剪辑", at: 4.55},
    {label: "跑通", at: 5.35},
  ];
  return <div style={{position: "absolute", inset: 0, opacity: alpha}}>
    <div style={{
      position: "absolute",
      left: 54,
      top: interpolate(dock, [0, 1], [112, 62], clamp),
      color: T.ink,
      fontSize: interpolate(dock, [0, 1], [118, 62], clamp),
      fontWeight: 950,
      lineHeight: 0.95,
      letterSpacing: -5,
      transform: `scale(${interpolate(pop(time, 0.28), [0, 0.75, 1], [1.24, 0.97, 1], clamp)})`,
      transformOrigin: "left top",
    }}><span style={{color: T.blue}}>{count}+</span> 视频测试</div>
    <div style={{position: "absolute", left: 56, top: 235, opacity: progress(time, 3.75, 0.3)}}>
      <div style={{fontSize: 58, color: T.ink, fontWeight: 950, letterSpacing: -2}}>Codex 剪辑</div>
      <div style={{marginTop: 14, fontSize: 82, color: T.blue, fontWeight: 950, letterSpacing: -4}}>流程跑通</div>
    </div>
    <div style={{position: "absolute", right: 62, top: 405}}>
      <CodexIcon amount={progress(time, 4.15, 0.4)} size={156} />
    </div>
    <div style={{position: "absolute", left: 54, right: 54, bottom: 126, opacity: progress(time, 5.15, 0.36)}}>
      <div style={{fontSize: 30, color: T.ink, fontWeight: 950, marginBottom: 18}}>这条主干已经跑通</div>
      <div style={{display: "flex", alignItems: "center", gap: 9}}>
        {flow.map((step, index) => {
          const a = progress(time, step.at, 0.25);
          return <div key={step.label} style={{display: "contents"}}>
            <div style={{flex: 1, height: 66, borderRadius: 17, background: index === flow.length - 1 ? T.blue : T.ink, color: T.white, display: "grid", placeItems: "center", fontSize: 24, fontWeight: 950, opacity: a, transform: `translateY(${(1 - a) * 20}px)`}}>{step.label}</div>
            {index < flow.length - 1 && <div style={{fontSize: 28, color: T.blue, fontWeight: 950, opacity: progress(time, step.at + 0.18, 0.2)}}>→</div>}
          </div>;
        })}
      </div>
    </div>
  </div>;
};

const DecisionStage = ({time}: {time: number}) => {
  const alpha = between(time, 25.72, 39.94);
  if (alpha <= 0) return null;
  const nodes = [
    {label: "保留人物", at: 25.92},
    {label: "切换录屏", at: 26.92},
    {label: "放大操作", at: 28.0},
    {label: "跟随时间轴", at: 29.64},
    {label: "数字出现", at: 32.18},
    {label: "步骤推进", at: 36.2},
  ];
  const active = nodes.reduce((last, node, index) => time >= node.at ? index : last, -1);
  return <div style={{position: "absolute", inset: 0, opacity: alpha}}>
    <div style={{position: "absolute", left: 56, top: 248, fontSize: 58, color: T.ink, fontWeight: 950, letterSpacing: -2}}>
      每句话，<span style={{color: T.blue}}>逐句判断</span>
    </div>
    <div style={{position: "absolute", left: 56, top: 330, width: 535, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 13}}>
      {nodes.map((node, index) => {
        const a = progress(time, node.at, 0.3);
        return <div key={node.label} style={{
          height: 62,
          borderRadius: 17,
          background: index === active ? T.blue : T.ink,
          color: T.white,
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "0 20px",
          boxSizing: "border-box",
          opacity: a,
          transform: `translateY(${(1 - a) * 18}px) scale(${index === active ? 1 : 0.96})`,
          fontSize: 24,
          fontWeight: 950,
        }}><span style={{fontSize: 15, opacity: 0.62}}>0{index + 1}</span>{node.label}</div>;
      })}
    </div>
    {time >= 32.18 && <div style={{position: "absolute", left: 60, top: 1160, opacity: progress(time, 32.18, 0.34)}}>
      <div style={{fontSize: 35, fontWeight: 900, color: T.ink}}>说到具体数字</div>
      <div style={{fontSize: 112, fontWeight: 950, color: T.blue, lineHeight: 1, marginTop: 8}}>42</div>
    </div>}
    {time >= 36.2 && <div style={{position: "absolute", left: 290, right: 55, top: 1250, opacity: progress(time, 36.2, 0.35)}}>
      <div style={{fontSize: 30, color: T.ink, fontWeight: 950, marginBottom: 14}}>步骤跟随口播推进</div>
      <div style={{display: "flex", gap: 10}}>
        {["01", "02", "03", "04"].map((label, index) => <div key={label} style={{width: 108, height: 72, borderRadius: 18, background: time >= 36.5 + index * 0.45 ? T.blue : T.ink, color: T.white, display: "grid", placeItems: "center", fontSize: 28, fontWeight: 950, opacity: progress(time, 36.2 + index * 0.45, 0.24)}}>{label}</div>)}
      </div>
    </div>}
  </div>;
};

const OperationStage = ({time}: {time: number}) => {
  const alpha = between(time, 39.8, 50.18);
  if (alpha <= 0) return null;
  const screen = progress(time, 40.05, 0.42);
  const items = [
    {label: "保护按钮", at: 43.64},
    {label: "保护光标", at: 44.52},
    {label: "不遮挡信息", at: 46.18},
  ];
  return <div style={{position: "absolute", inset: 0, opacity: alpha}}>
    <div style={{position: "absolute", left: 56, top: 250}}>
      <div style={{fontSize: 34, color: T.ink, fontWeight: 900}}>进入操作环节</div>
      <div style={{fontSize: 78, color: T.blue, fontWeight: 950, letterSpacing: -4, marginTop: 8}}>实景演示</div>
    </div>
    <div style={{position: "absolute", right: 58, top: 320, width: 290, height: 190, borderRadius: 28, background: T.ink, opacity: screen, transform: `translateX(${(1 - screen) * 46}px) scale(${0.86 + screen * 0.14})`, boxShadow: "0 20px 40px rgba(11,15,23,.2)"}}>
      <div style={{height: 34, background: T.blue, borderRadius: "28px 28px 0 0", display: "flex", alignItems: "center", paddingLeft: 18, gap: 7}}>
        {[0, 1, 2].map((dot) => <div key={dot} style={{width: 8, height: 8, borderRadius: "50%", background: T.white, opacity: 0.82}} />)}
      </div>
      <div style={{position: "absolute", left: 24, right: 24, top: 67, height: 24, borderRadius: 10, background: T.white}} />
      <div style={{position: "absolute", left: 24, width: 110, top: 112, height: 42, borderRadius: 12, background: T.blue}} />
      <div style={{position: "absolute", right: 26, top: 104, width: 28, height: 42, background: T.white, clipPath: "polygon(0 0,100% 65%,63% 72%,82% 100%,64% 100%,48% 76%,20% 100%)"}} />
    </div>
    <div style={{position: "absolute", left: 55, right: 55, bottom: 170, display: "flex", gap: 13}}>
      {items.map((item, index) => {
        const a = progress(time, item.at, 0.32);
        return <div key={item.label} style={{flex: 1, height: 80, borderRadius: 20, background: index === 2 ? T.blue : T.ink, color: T.white, display: "grid", placeItems: "center", fontSize: 25, fontWeight: 950, opacity: a, transform: `translateY(${(1 - a) * 24}px)`}}>{item.label}</div>;
      })}
    </div>
  </div>;
};

const PostStage = ({time}: {time: number}) => {
  const alpha = between(time, 50.18, 56.14);
  if (alpha <= 0) return null;
  const items = [
    {label: "字幕", at: 50.35},
    {label: "转场", at: 51.65},
    {label: "BGM", at: 52.9},
  ];
  return <div style={{position: "absolute", inset: 0, opacity: alpha}}>
    <div style={{position: "absolute", left: 55, top: 250, fontSize: 38, fontWeight: 900, color: T.ink}}>最后的后期收尾</div>
    <div style={{position: "absolute", left: 55, top: 310, fontSize: 76, fontWeight: 950, color: T.blue, letterSpacing: -4}}>一个任务完成</div>
    <div style={{position: "absolute", right: 64, top: 470}}><CodexIcon amount={progress(time, 52.5, 0.36)} size={150} /></div>
    <div style={{position: "absolute", left: 55, right: 55, bottom: 190, display: "flex", alignItems: "center", gap: 14}}>
      {items.map((item, index) => {
        const a = progress(time, item.at, 0.3);
        return <div key={item.label} style={{display: "contents"}}>
          <div style={{flex: 1, height: 94, borderRadius: 22, background: index === items.length - 1 ? T.blue : T.ink, color: T.white, display: "grid", placeItems: "center", fontSize: 32, fontWeight: 950, opacity: a, transform: `translateY(${(1 - a) * 26}px)`}}>{item.label}</div>
          {index < items.length - 1 && <div style={{fontSize: 28, color: T.blue, fontWeight: 950, opacity: a}}>＋</div>}
        </div>;
      })}
    </div>
  </div>;
};

const SecondMethodStage = ({time}: {time: number}) => {
  const alpha = between(time, 56.1, 60.38);
  if (alpha <= 0) return null;
  const a = pop(time, 56.18);
  return <div style={{position: "absolute", inset: 0, opacity: alpha}}>
    <div style={{position: "absolute", left: 55, top: 270, color: T.ink, fontSize: 36, fontWeight: 900}}>第二种，更彻底</div>
    <div style={{position: "absolute", left: 55, top: 330, color: T.blue, fontSize: 78, fontWeight: 950, lineHeight: 1.02, letterSpacing: -4, transform: `scale(${interpolate(a, [0, 0.75, 1], [1.2, 0.98, 1], clamp)})`, transformOrigin: "left top"}}>无需真人出镜</div>
    <div style={{position: "absolute", right: 64, top: 510, width: 190, height: 190, borderRadius: 52, background: T.blue, display: "grid", placeItems: "center", opacity: progress(time, 56.7, 0.4), boxShadow: "0 20px 42px rgba(20,123,255,.25)"}}>
      <div style={{fontSize: 56, color: T.white, fontWeight: 950}}>AI</div>
    </div>
    <div style={{position: "absolute", left: 55, right: 55, bottom: 185, display: "flex", gap: 13}}>
      {["文本稿", "AI旁白", "动画", "完整视频"].map((label, index) => <div key={label} style={{flex: 1, height: 76, borderRadius: 18, background: index === 3 ? T.blue : T.ink, color: T.white, display: "grid", placeItems: "center", fontSize: 23, fontWeight: 950, opacity: progress(time, 57.1 + index * 0.35, 0.25), transform: `translateY(${(1 - progress(time, 57.1 + index * 0.35, 0.25)) * 20}px)`}}>{label}</div>)}
    </div>
  </div>;
};

const FirstMethodStage = ({time}: {time: number}) => {
  const alpha = between(time, 9.92, 60.38);
  if (alpha <= 0) return null;
  return <div style={{position: "absolute", inset: 0, opacity: alpha}}>
    <BranchHeader time={time} />
    <div style={{position: "absolute", inset: 0, opacity: between(time, 11.62, 26.35)}}>
      <ProgressiveItem time={time} at={11.66} archiveAt={14.7} archiveY={242} bigY={260} title="拍好人物口播" accent="人物口播" icon="mic" />
      <ProgressiveItem time={time} at={14.84} archiveAt={18.75} archiveY={314} bigY={390} title="加入素材＋录屏" accent="素材＋录屏" icon="folder" />
      <ProgressiveItem time={time} at={18.98} archiveAt={20.5} archiveY={386} bigY={540} title="一股脑交给 Codex" accent="Codex" icon="codex" />
      <ProgressiveItem time={time} at={20.58} archiveAt={23.0} archiveY={458} bigY={1180} title="识别口播，生成时间字幕" accent="时间字幕" icon="subtitle" />
      <SummaryFlow time={time} />
    </div>
    <DecisionStage time={time} />
    <OperationStage time={time} />
    <PostStage time={time} />
    <SecondMethodStage time={time} />
  </div>;
};

const CoreHeader = ({time}: {time: number}) => {
  const dock = progress(time, 103.35, 0.45);
  return <div style={{position: "absolute", left: 55, top: interpolate(dock, [0, 1], [260, 60], clamp), fontSize: interpolate(dock, [0, 1], [88, 58], clamp), fontWeight: 950, color: T.ink, letterSpacing: -4, lineHeight: 1, opacity: progress(time, 100.28, 0.25)}}>同一个 <span style={{color: T.blue}}>Skill</span></div>;
};

const CoreProcess = ({time}: {time: number}) => {
  const alpha = between(time, 99.5, 109.18);
  if (alpha <= 0) return null;
  const steps = [
    {label: "读懂画面", at: 103.56},
    {label: "时间轴", at: 104.84},
    {label: "安排画面", at: 106.22},
    {label: "语音合成", at: 107.2},
  ];
  return <div style={{position: "absolute", inset: 0, opacity: alpha}}>
    {time < 101.1 && <div style={{position: "absolute", left: 55, top: 250, fontSize: 72, fontWeight: 950, color: T.blue, opacity: between(time, 99.62, 101.1)}}>回到人物</div>}
    <div style={{position: "absolute", right: 62, top: 420}}><CodexIcon amount={progress(time, 102.9, 0.38)} size={158} /></div>
    <div style={{position: "absolute", left: 55, right: 55, bottom: 180, display: "flex", alignItems: "center", gap: 9}}>
      {steps.map((step, index) => {
        const a = progress(time, step.at, 0.3);
        return <div key={step.label} style={{display: "contents"}}>
          <div style={{flex: 1, height: 78, borderRadius: 19, background: index === steps.length - 1 ? T.blue : T.ink, color: T.white, display: "grid", placeItems: "center", fontSize: 22, fontWeight: 950, opacity: a, transform: `translateY(${(1 - a) * 22}px)`}}>{step.label}</div>
          {index < steps.length - 1 && <div style={{fontSize: 26, color: T.blue, fontWeight: 950, opacity: a}}>→</div>}
        </div>;
      })}
    </div>
  </div>;
};

const CompareStage = ({time}: {time: number}) => {
  const alpha = between(time, 109.16, 122.58);
  if (alpha <= 0) return null;
  const second = progress(time, 115.86, 0.42);
  const leftItems = ["真人出镜", "录制口播", "Codex后期"];
  const rightItems = ["无需出镜", "AI语音", "完整生成"];
  return <div style={{position: "absolute", inset: 0, opacity: alpha}}>
    <div style={{position: "absolute", left: 55, right: 55, top: 150, display: "flex", gap: 14}}>
      <div style={{flex: 1, height: 66, borderRadius: 18, background: second < 0.5 ? T.blue : T.ink, color: T.white, display: "grid", placeItems: "center", fontSize: 29, fontWeight: 950}}>真人口播</div>
      <div style={{flex: 1, height: 66, borderRadius: 18, background: second > 0.5 ? T.blue : T.ink, color: T.white, display: "grid", placeItems: "center", fontSize: 29, fontWeight: 950}}>AI 生成</div>
    </div>
    <div style={{position: "absolute", left: 55, right: 55, bottom: 180, display: "flex", gap: 18}}>
      <div style={{flex: 1, display: "flex", flexDirection: "column", gap: 12}}>
        {leftItems.map((label, index) => <div key={label} style={{height: 66, borderRadius: 17, background: second < 0.5 && index === Math.min(2, Math.floor(Math.max(0, time - 109.22) / 1.8)) ? T.blue : T.ink, color: T.white, display: "flex", alignItems: "center", paddingLeft: 22, fontSize: 24, fontWeight: 950, opacity: progress(time, 109.22 + index * 1.45, 0.28)}}><span style={{fontSize: 15, opacity: 0.62, marginRight: 12}}>0{index + 1}</span>{label}</div>)}
      </div>
      <div style={{flex: 1, display: "flex", flexDirection: "column", gap: 12}}>
        {rightItems.map((label, index) => <div key={label} style={{height: 66, borderRadius: 17, background: second > 0.5 && index === Math.min(2, Math.floor(Math.max(0, time - 115.86) / 1.9)) ? T.blue : T.ink, color: T.white, display: "flex", alignItems: "center", paddingLeft: 22, fontSize: 24, fontWeight: 950, opacity: progress(time, 115.86 + index * 1.5, 0.28)}}><span style={{fontSize: 15, opacity: 0.62, marginRight: 12}}>0{index + 1}</span>{label}</div>)}
      </div>
    </div>
  </div>;
};

const ClosingStage = ({time}: {time: number}) => {
  const alpha = between(time, 122.58, 135.25);
  if (alpha <= 0) return null;
  const proof = between(time, 122.66, 126.05);
  const open = progress(time, 126.12, 0.4);
  const cta = progress(time, 129.16, 0.4);
  return <div style={{position: "absolute", inset: 0, opacity: alpha}}>
    <div style={{position: "absolute", left: 55, top: 150, fontSize: 28, color: T.ink, fontWeight: 900, opacity: progress(time, 122.66, 0.3)}}>真人口播 × AI 后期</div>
    <div style={{position: "absolute", left: 55, top: 250, opacity: proof}}>
      <div style={{fontSize: 72, color: T.ink, fontWeight: 950, letterSpacing: -3}}>这条视频</div>
      <div style={{fontSize: 62, color: T.blue, fontWeight: 950, marginTop: 12}}>Codex 后期剪辑</div>
    </div>
    <div style={{position: "absolute", left: 55, top: 300, opacity: open, transform: `translateY(${(1 - open) * 34}px)`}}>
      <div style={{fontSize: 34, color: T.ink, fontWeight: 900}}>Skill 继续迭代</div>
      <div style={{fontSize: 94, color: T.blue, fontWeight: 950, letterSpacing: -5, marginTop: 10}}>9月开源</div>
    </div>
    <div style={{position: "absolute", right: 62, top: 440}}><CodexIcon amount={open} size={158} /></div>
    <div style={{position: "absolute", left: 55, right: 55, bottom: 170, opacity: cta, transform: `translateY(${(1 - cta) * 30}px)`}}>
      <div style={{display: "flex", gap: 14}}>
        <div style={{flex: 1, height: 100, borderRadius: 24, background: T.ink, color: T.white, display: "grid", placeItems: "center", fontSize: 34, fontWeight: 950}}>收藏</div>
        <div style={{flex: 1, height: 100, borderRadius: 24, background: T.blue, color: T.white, display: "grid", placeItems: "center", fontSize: 34, fontWeight: 950}}>关注</div>
      </div>
      {time >= 133.64 && <div style={{marginTop: 20, textAlign: "right", color: T.ink, fontSize: 30, fontWeight: 950, opacity: progress(time, 133.64, 0.3)}}>这里是冬天 · 下期见</div>}
    </div>
  </div>;
};

const ReturnStage = ({time}: {time: number}) => {
  const alpha = between(time, 99.5, 135.25);
  if (alpha <= 0) return null;
  return <div style={{position: "absolute", inset: 0, opacity: alpha}}>
    <CoreHeader time={time} />
    <CoreProcess time={time} />
    <CompareStage time={time} />
    <ClosingStage time={time} />
  </div>;
};

export const DraftOverlay = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return <div style={{
    position: "absolute",
    left: 0,
    top: CONTENT_TOP,
    width: 1080,
    height: CONTENT_HEIGHT,
    overflow: "hidden",
    fontFamily: '"PingFang SC", "SF Pro Display", "Helvetica Neue", Arial, sans-serif',
  }}>
    <OpeningStage time={frame / fps} />
    <FirstMethodStage time={frame / fps} />
    <ReturnStage time={frame / fps} />
  </div>;
};
