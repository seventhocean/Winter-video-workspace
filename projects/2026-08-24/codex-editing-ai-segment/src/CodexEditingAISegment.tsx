import type {CSSProperties} from "react";
import {AbsoluteFill, Audio, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from "remotion";

const W = 1080;
const H = 1920;
const clamp = {extrapolateLeft: "clamp", extrapolateRight: "clamp"} as const;
const STYLE = {
  paper: "#F1EEE6", paper2: "#E5DED2", ink: "#171715", muted: "#716D65", white: "#FFFDF8",
  vermilion: "#F15A3B", cobalt: "#3157D5", yellow: "#E7B94B", mint: "#87B9A8",
  line: "rgba(23,23,21,.18)", shadow: "rgba(36,27,18,.18)",
  sans: '"PingFang SC", "Microsoft YaHei", Arial, sans-serif', serif: '"Songti SC", "STSong", Georgia, serif',
} as const;

const captions = [
  [0.28, 2.68, "现在你听到的声音、看到的字幕"], [2.79, 5.51, "界面和动画，全部由 AI 生成"],
  [5.75, 8.59, "我只需要把文章或者文本稿交给 Codex"], [8.83, 10.4, "再配合我的视频 Skill"],
  [10.76, 12.43, "它会先生成 AI 旁白"], [12.58, 14.34, "把声音对齐到每一句话"],
  [14.62, 16.62, "然后按照分镜制作动画"], [16.78, 18.14, "合成字幕和音效"], [18.42, 20.92, "最后直接生成一条完整的视频"],
  [21.4, 24.28, "我前几期发过的《如何从零手搓一个 Skill》"], [24.52, 26.2, "就是用这种方式完成的"],
  [26.44, 28.08, "整条视频接近五分钟"], [28.24, 31.15, "从声音、字幕到里面的界面和动画"], [31.22, 32.62, "全程没有真人出镜"],
  [32.92, 34.25, "我也没有打开时间轴"], [34.25, 36.08, "手动调整任何一帧动画"],
  [36.2, 37.43, "这就是第二种方式"], [37.76, 39.02, "从一份文本开始"], [39.16, 41.9, "由 Codex 和 Skill 完成整条视频"],
] as const;

const fadeScene = (time: number, from: number, to: number, fade = 0.32) => Math.min(
  interpolate(time, [from, from + fade], [0, 1], clamp), interpolate(time, [to - fade, to], [1, 0], clamp),
);
const ease = (v: number) => v < 0.5 ? 4 * v ** 3 : 1 - ((-2 * v + 2) ** 3) / 2;
const seg = (time: number, from: number, to: number) => ease(interpolate(time, [from, to], [0, 1], clamp));

const PaperBackground = ({dark = false}: {dark?: boolean}) => <AbsoluteFill style={{background: dark ? STYLE.ink : STYLE.paper, color: dark ? STYLE.white : STYLE.ink, overflow: "hidden"}}>
  <div style={{position: "absolute", inset: 0, opacity: dark ? 0.1 : 0.22, backgroundImage: "radial-gradient(circle at 15% 18%, rgba(255,255,255,.9) 0 1px, transparent 1.5px),radial-gradient(circle at 76% 62%, rgba(20,18,14,.36) 0 .8px, transparent 1.3px)", backgroundSize: "19px 19px,23px 23px"}} />
  <div style={{position: "absolute", left: 44, right: 44, top: 42, height: 1, background: dark ? "rgba(255,255,255,.24)" : STYLE.line}} />
  <div style={{position: "absolute", left: 44, bottom: 38, fontSize: 17, letterSpacing: 4, color: dark ? "rgba(255,255,255,.48)" : STYLE.muted}}>WINTER / CODEX FILM STUDY</div>
</AbsoluteFill>;

const GrainPlate = ({index, time, appear}: {index: number; time: number; appear: number}) => {
  const colors = [STYLE.vermilion, STYLE.cobalt, STYLE.yellow, STYLE.mint, STYLE.ink, "#C6A5D8", "#E8D8B3", "#8A91A1"];
  const labels = ["VOICE", "CAPTION", "SCRIPT", "MOTION", "CODEX", "SKILL", "SOUND", "OUTPUT"];
  const angle = index / 8 * Math.PI * 2 + time * 0.12;
  const x = 540 + Math.cos(angle) * 405;
  const y = 865 + Math.sin(angle) * 635;
  const z = (Math.sin(angle) + 1) / 2;
  return <div style={{position: "absolute", left: x, top: y, width: 190, height: 142, borderRadius: 24, overflow: "hidden", zIndex: Math.round(z * 20), transform: `translate(-50%,-50%) perspective(600px) rotateY(${Math.cos(angle) * 18}deg) scale(${(0.72 + z * 0.34) * appear})`, opacity: appear * (0.52 + z * 0.48), background: colors[index], boxShadow: `0 ${12 + z * 22}px ${30 + z * 28}px ${STYLE.shadow}`}}>
    <div style={{position: "absolute", inset: 0, opacity: 0.35, backgroundImage: "repeating-linear-gradient(125deg,rgba(255,255,255,.18) 0 1px,transparent 1px 8px)"}} />
    <div style={{position: "absolute", left: 18, right: 18, top: 17, display: "flex", justifyContent: "space-between", fontFamily: STYLE.sans, fontSize: 15, fontWeight: 800, color: index === 6 ? STYLE.ink : STYLE.white}}><span>0{index + 1}</span><span>{labels[index]}</span></div>
    <div style={{position: "absolute", left: 18, right: 18, bottom: 19, height: 5, background: index === 6 ? STYLE.ink : STYLE.white, opacity: 0.8}} />
  </div>;
};

const OpeningScene = ({frame, time}: {frame: number; time: number}) => {
  const opacity = fadeScene(time, 0, 5.8);
  const titleIn = spring({frame: frame - 6, fps: 30, config: {damping: 18, stiffness: 105}});
  return <div style={{position: "absolute", inset: 0, opacity}}><PaperBackground />
    {Array.from({length: 8}).map((_, i) => <GrainPlate key={i} index={i} time={time} appear={spring({frame: frame - 8 - i * 3, fps: 30, config: {damping: 18, stiffness: 95}})} />)}
    <div style={{position: "absolute", inset: 0, display: "grid", placeItems: "center", zIndex: 12}}><div style={{width: 760, transform: `translateY(${(1 - titleIn) * 34}px)`, opacity: titleIn, textAlign: "center"}}>
      <div style={{fontFamily: STYLE.sans, color: STYLE.vermilion, fontSize: 22, letterSpacing: 8, fontWeight: 900}}>THIS PART IS</div>
      <div style={{fontFamily: STYLE.serif, color: STYLE.ink, fontSize: 106, lineHeight: 1.02, fontWeight: 800, letterSpacing: -6, marginTop: 24}}>全部由 AI<br />生成</div>
      <div style={{width: 170, height: 12, background: STYLE.cobalt, margin: "34px auto 0", transform: `scaleX(${seg(time, .8, 1.5)})`}} />
      <div style={{fontFamily: STYLE.sans, color: STYLE.muted, fontSize: 26, letterSpacing: 3, marginTop: 24}}>声音 · 字幕 · 界面 · 动画</div>
    </div></div>
  </div>;
};

const workflow = [
  {title: "文本稿", verb: "读取文本", color: STYLE.vermilion, sub: "ARTICLE / SCRIPT"},
  {title: "视频 Skill", verb: "加载方法", color: STYLE.yellow, sub: "RULES / CRAFT"},
  {title: "AI 旁白", verb: "生成声音", color: STYLE.cobalt, sub: "VOICE / TTS"},
  {title: "声音对齐", verb: "标记时间", color: STYLE.mint, sub: "WORD / TIMELINE"},
  {title: "分镜动画", verb: "制作画面", color: "#C6A5D8", sub: "SHOT / MOTION"},
  {title: "完整视频", verb: "输出成片", color: STYLE.vermilion, sub: "CAPTION / SOUND"},
] as const;

const WorkflowCard = ({item, index}: {item: typeof workflow[number]; index: number}) => {
  const dark = index % 2 === 1;
  return <div style={{position: "absolute", inset: 0, padding: 28, background: dark ? STYLE.ink : STYLE.white, color: dark ? STYLE.white : STYLE.ink, border: `1px solid ${dark ? "rgba(255,255,255,.14)" : STYLE.line}`, boxShadow: `0 20px 55px ${STYLE.shadow}`}}>
    <div style={{display: "flex", justifyContent: "space-between", fontFamily: STYLE.sans, fontSize: 17, letterSpacing: 3, color: dark ? "rgba(255,255,255,.55)" : STYLE.muted}}><span>0{index + 1}</span><span>{item.sub}</span></div>
    <div style={{fontFamily: STYLE.serif, fontSize: 51, fontWeight: 800, marginTop: 54}}>{item.title}</div>
    <div style={{display: "flex", gap: 8, marginTop: 35}}>{[.86, .58, .72].map((w, i) => <div key={i} style={{height: 9, width: `${w * 100}%`, background: i === 0 ? item.color : (dark ? "rgba(255,255,255,.22)" : "rgba(23,23,21,.16)")}} />)}</div>
  </div>;
};

const WorkflowScene = ({time}: {time: number}) => {
  const opacity = fadeScene(time, 5.5, 21.45);
  const local = time - 5.5;
  const demote = seg(local, 1.05, 1.75);
  const changeTimes = [.25, 5.26, 7.08, 9.12, 11.28, 12.92];
  let step = 0;
  for (let i = 1; i < changeTimes.length; i++) step += seg(local, changeTimes[i] - .18, changeTimes[i] + .28);
  const active = Math.min(workflow.length - 1, Math.round(step));
  const titleScale = interpolate(demote, [0, 1], [1, .34]);
  const titleX = interpolate(demote, [0, 1], [540, 72]);
  const titleY = interpolate(demote, [0, 1], [650, 120]);
  return <div style={{position: "absolute", inset: 0, opacity}}><PaperBackground />
    <div style={{position: "absolute", left: titleX, top: titleY, transform: `translate(${-(1 - demote) * 50}%, -50%) scale(${titleScale})`, transformOrigin: "left center", whiteSpace: "nowrap", fontFamily: STYLE.serif, fontSize: 84, fontWeight: 800, letterSpacing: -4, zIndex: 20}}>从一份文本开始</div>
    <div style={{position: "absolute", left: 58, top: 220, width: 480, height: 1390, overflow: "hidden"}}>
      {workflow.map((item, index) => <div key={item.title} style={{position: "absolute", left: 0, width: 450, height: 292, top: 809 + (index - step) * 330, borderRadius: 20, overflow: "hidden", transform: `rotate(${index % 2 ? 1.2 : -1.2}deg)`, opacity: Math.abs(index - step) > 2.1 ? .18 : 1}}><WorkflowCard item={item} index={index} /></div>)}
      <div style={{position: "absolute", right: 1, top: 80, bottom: 80, width: 2, background: STYLE.line}} />
    </div>
    <div style={{position: "absolute", left: 580, right: 56, top: 650}}>
      <div style={{fontFamily: STYLE.sans, fontSize: 22, letterSpacing: 5, color: STYLE.muted, fontWeight: 800}}>CODEX 正在</div>
      <div style={{fontFamily: STYLE.serif, fontSize: 88, lineHeight: 1.04, fontWeight: 800, letterSpacing: -4, marginTop: 24}}>{workflow[active].verb}</div>
      <div style={{height: 12, width: 270, background: workflow[active].color, marginTop: 36}} />
      <div style={{fontFamily: STYLE.sans, marginTop: 48, color: STYLE.muted, fontSize: 23, lineHeight: 1.7}}>证据胶片只在步骤切换时推进一格。<br />声音、字幕和动画共用同一条时间轴。</div>
    </div>
    <div style={{position: "absolute", left: 580, right: 70, bottom: 245}}><div style={{display: "flex", justifyContent: "space-between", fontFamily: STYLE.sans, fontSize: 18, color: STYLE.muted}}><span>PROCESS</span><span>{active + 1} / 6</span></div><div style={{height: 4, background: STYLE.line, marginTop: 16}}><div style={{height: "100%", width: `${((step + 1) / 6) * 100}%`, background: STYLE.ink}} /></div></div>
  </div>;
};

const Stat = ({value, label, color, show}: {value: string; label: string; color: string; show: number}) => <div style={{opacity: show, transform: `translateY(${(1 - show) * 30}px)`, borderLeft: `2px solid ${STYLE.line}`, paddingLeft: 25}}><div style={{fontFamily: STYLE.serif, fontSize: 78, lineHeight: 1, fontWeight: 800, color}}>{value}</div><div style={{fontFamily: STYLE.sans, fontSize: 20, letterSpacing: 2, color: STYLE.muted, marginTop: 11}}>{label}</div></div>;

const ProofScene = ({time}: {time: number}) => {
  const opacity = fadeScene(time, 21.15, 36.35);
  const posterIn = seg(time, 21.5, 22.3);
  const secondFrame = seg(time, 28.12, 28.55);
  return <div style={{position: "absolute", inset: 0, opacity}}><PaperBackground />
    <div style={{position: "absolute", left: 58, top: 98, fontFamily: STYLE.sans, fontSize: 20, fontWeight: 900, letterSpacing: 6, color: STYLE.vermilion}}>03 / REAL CASE</div>
    <div style={{position: "absolute", left: 58, right: 58, top: 150, fontFamily: STYLE.serif, fontSize: 70, lineHeight: 1.08, fontWeight: 800, letterSpacing: -3}}>它已经完成过<br />一条接近五分钟的视频</div>
    <div style={{position: "absolute", left: 90, top: 420, width: 900, height: 890, transform: `translateY(${(1 - posterIn) * 70}px) rotate(-1.5deg) scale(${.95 + posterIn * .05})`, opacity: posterIn, background: STYLE.white, padding: 20, boxShadow: `0 34px 90px ${STYLE.shadow}`}}>
      <div style={{position: "relative", width: "100%", height: 760, overflow: "hidden", background: STYLE.ink}}><Img src={staticFile("case-frame-01.jpg")} style={{position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 1 - secondFrame}} /><Img src={staticFile("case-frame-02.jpg")} style={{position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: secondFrame, transform: `scale(${1.04 - secondFrame * .04})`}} /></div>
      <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", height: 90, fontFamily: STYLE.sans}}><span style={{fontSize: 25, fontWeight: 900}}>如何从零手搓一个 Skill</span><span style={{fontSize: 17, color: STYLE.muted, letterSpacing: 3}}>AI OUTPUT / 01</span></div>
    </div>
    <div style={{position: "absolute", left: 70, right: 70, top: 1370, display: "grid", gridTemplateColumns: "1.25fr 1fr 1fr", gap: 28}}><Stat value="≈ 5 MIN" label="完整时长" color={STYLE.vermilion} show={seg(time, 26.2, 26.75)} /><Stat value="0" label="真人出镜" color={STYLE.cobalt} show={seg(time, 31, 31.48)} /><Stat value="0" label="手调动画帧" color={STYLE.ink} show={seg(time, 33, 34.5)} /></div>
    <div style={{position: "absolute", left: 70, right: 70, top: 1560, fontFamily: STYLE.sans, fontSize: 24, lineHeight: 1.6, color: STYLE.muted, opacity: seg(time, 28.1, 28.65)}}>声音、字幕、界面与动画均由同一套流程生成；<br />没有打开传统剪辑时间轴。</div>
  </div>;
};

const MethodScene = ({time}: {time: number}) => {
  const opacity = fadeScene(time, 35.95, 37.75, .18);
  const p = seg(time, 36.08, 36.62);
  return <div style={{position: "absolute", inset: 0, opacity, color: STYLE.white}}><PaperBackground dark /><div style={{position: "absolute", left: 58, top: 85, fontFamily: STYLE.sans, fontSize: 20, letterSpacing: 6, color: STYLE.yellow}}>CHAPTER / 02</div><div style={{position: "absolute", left: 52, top: 330, fontFamily: STYLE.serif, fontSize: 360, lineHeight: .86, fontWeight: 800, color: STYLE.vermilion, transform: `translateX(${(1 - p) * -90}px)`, opacity: p}}>02</div><div style={{position: "absolute", left: 70, right: 70, top: 930, fontFamily: STYLE.serif, fontSize: 105, lineHeight: 1.08, fontWeight: 800, color: STYLE.white, transform: `translateY(${(1 - p) * 50}px)`, opacity: p}}>第二种方式<br />全 AI 剪辑</div><div style={{position: "absolute", left: 72, top: 1215, width: 440, height: 10, background: STYLE.white, transform: `scaleX(${p})`, transformOrigin: "left"}} /></div>;
};

const cubicPoint = (y0: number, u: number) => {const v = 1 - u; return {x: v ** 3 * 155 + 3 * v ** 2 * u * 340 + 3 * v * u ** 2 * 575 + u ** 3 * 790, y: v ** 3 * y0 + 3 * v ** 2 * u * y0 + 3 * v * u ** 2 * 940 + u ** 3 * 940};};

const FinalScene = ({time}: {time: number}) => {
  const opacity = fadeScene(time, 37.5, 42.72, .28);
  const local = time - 37.5;
  const draw = seg(local, .35, 1.65);
  const merge = seg(local, 1.7, 3.6);
  const result = seg(local, 2.7, 3.55);
  const sources = [{label: "文本", y: 620, color: STYLE.vermilion}, {label: "Codex", y: 940, color: STYLE.cobalt}, {label: "Skill", y: 1260, color: STYLE.yellow}];
  return <div style={{position: "absolute", inset: 0, opacity}}><PaperBackground />
    <div style={{position: "absolute", left: 58, top: 95, fontFamily: STYLE.sans, fontSize: 20, letterSpacing: 6, color: STYLE.muted}}>TEXT → COMPLETE VIDEO</div><div style={{position: "absolute", left: 58, top: 145, fontFamily: STYLE.serif, fontSize: 78, lineHeight: 1.06, fontWeight: 800, letterSpacing: -4}}>从一份文本开始</div>
    <svg width={1080} height={1500} viewBox="0 0 1080 1500" style={{position: "absolute", left: 0, top: 300, overflow: "visible"}}>{sources.map((s) => <path key={s.label} d={`M 155 ${s.y - 300} C 340 ${s.y - 300},575 640,790 640`} fill="none" stroke={STYLE.ink} strokeWidth={3} strokeDasharray={900} strokeDashoffset={900 * (1 - draw)} opacity={.7} />)}</svg>
    {sources.map((s) => {const q = cubicPoint(s.y, merge); const size = merge < .76 ? interpolate(merge, [0, .76], [122, 52]) : interpolate(merge, [.76, 1], [52, 0], clamp); return <div key={s.label} style={{position: "absolute", left: q.x, top: q.y, width: Math.max(size, 1), height: Math.max(size, 1), borderRadius: 999, transform: "translate(-50%,-50%)", background: s.color, display: "grid", placeItems: "center", fontFamily: STYLE.sans, fontSize: Math.max(13, size * .23), fontWeight: 900, color: s.label === "Skill" ? STYLE.ink : STYLE.white, boxShadow: `0 14px 34px ${STYLE.shadow}`}}>{size > 34 ? s.label : ""}</div>;})}
    <div style={{position: "absolute", left: 710, top: 620, width: 340, height: 590, background: STYLE.ink, padding: 16, boxShadow: `18px 22px 0 ${STYLE.vermilion},0 38px 86px ${STYLE.shadow}`, opacity: .12 + result * .88, transform: `translateY(${(1 - result) * 45}px) scale(${.92 + result * .08})`}}><div style={{height: 475, overflow: "hidden"}}><Img src={staticFile("case-frame-01.jpg")} style={{width: "100%", height: "100%", objectFit: "cover"}} /></div><div style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 25, fontFamily: STYLE.sans, color: STYLE.white}}><span style={{fontSize: 22, fontWeight: 900}}>完整视频</span><span style={{fontSize: 14, letterSpacing: 3, color: "rgba(255,255,255,.55)"}}>OUTPUT</span></div></div>
    <div style={{position: "absolute", left: 65, right: 65, top: 1425, opacity: seg(local, 3.45, 4.15)}}><div style={{fontFamily: STYLE.sans, fontSize: 20, letterSpacing: 5, color: STYLE.vermilion, fontWeight: 900}}>ONE DOCUMENT IN</div><div style={{fontFamily: STYLE.serif, fontSize: 65, fontWeight: 800, marginTop: 12}}>Codex + Skill → 一条完整视频</div></div>
  </div>;
};

const Caption = ({time}: {time: number}) => {const cue = captions.find(([start, end]) => time >= start && time < end); if (!cue) return null; const [start, end, text] = cue; const opacity = Math.min(interpolate(time, [start, start + .1], [0, 1], clamp), interpolate(time, [end - .1, end], [1, 0], clamp)); return <div style={{position: "absolute", left: 48, right: 48, bottom: 70, zIndex: 80, display: "flex", justifyContent: "center", opacity}}><div style={{maxWidth: 930, padding: "21px 34px", borderRadius: 16, background: "rgba(18,18,16,.92)", color: STYLE.white, fontFamily: STYLE.sans, fontSize: 36, lineHeight: 1.36, fontWeight: 800, textAlign: "center", boxShadow: "0 14px 38px rgba(0,0,0,.2)"}}>{text}</div></div>;};

export const CodexEditingAISegment = () => {const frame = useCurrentFrame(); const {fps} = useVideoConfig(); const time = frame / fps; const logical: CSSProperties = {width: W, height: H, transform: "scale(2)", transformOrigin: "top left", position: "absolute", left: 0, top: 0, fontFamily: STYLE.sans}; return <AbsoluteFill style={{background: STYLE.paper}}><Audio src={staticFile("voice/ai-segment.mp3")} /><div style={logical}><OpeningScene frame={frame} time={time} /><WorkflowScene time={time} /><ProofScene time={time} /><MethodScene time={time} /><FinalScene time={time} /><Caption time={time} /></div></AbsoluteFill>;};
