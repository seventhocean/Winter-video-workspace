import {Video} from "@remotion/media";
import type {ReactNode} from "react";
import {AbsoluteFill, Easing, interpolate, spring, useCurrentFrame} from "remotion";

const C = {blue: "#4a66ff", cyan: "#29d7ed", white: "#f8fbff", soft: "#aab8d4", ink: "#050914", orange: "#ff8a42", red: "#ff5364", green: "#5be1a4", gold: "#ffd36a"};
const sans = "-apple-system, BlinkMacSystemFont, 'PingFang SC', 'Microsoft YaHei', sans-serif";
const mono = "'SFMono-Regular', Menlo, Monaco, Consolas, monospace";
const source = "http://127.0.0.1:8769/source.mov";

const cue = (frame: number, start: number, end: number, enter = 7, exit = 7) => {
  const s = Math.round(start * 30);
  const e = Math.round(end * 30);
  return interpolate(frame, [s, s + enter, Math.max(s + enter + 1, e - exit), e], [0, 1, 1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
};

const progress = (frame: number, start: number, duration = 14) => interpolate(frame, [start * 30, start * 30 + duration], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic)});
const pop = (frame: number, at: number, damping = 17) => spring({frame: frame - at * 30, fps: 30, config: {damping, stiffness: 190, mass: 0.7}});

const Stage = ({start, end, children}: {start: number; end: number; children: ReactNode}) => {
  const frame = useCurrentFrame();
  return <div style={{position: "absolute", inset: 0, opacity: cue(frame, start, end), pointerEvents: "none"}}>
    <div style={{position: "absolute", left: 18, right: 18, top: 10, bottom: 10, borderRadius: 22, background: "linear-gradient(90deg, rgba(3,8,20,.86) 0%, rgba(3,8,20,.72) 68%, rgba(3,8,20,.48) 100%)", border: "1px solid rgba(93,120,255,.20)", boxShadow: "0 12px 34px rgba(0,0,0,.24)", backdropFilter: "blur(8px)"}} />
    {children}
  </div>;
};

const Eyebrow = ({children, color = C.cyan}: {children: ReactNode; color?: string}) => <div style={{fontFamily: mono, fontSize: 17, fontWeight: 900, letterSpacing: 3.2, color, lineHeight: 1}}>{children}</div>;
const Underline = ({value, color = C.blue, width = 600}: {value: number; color?: string; width?: number}) => <div style={{marginTop: 13, height: 5, width: value * width, borderRadius: 8, background: `linear-gradient(90deg, ${color}, ${C.cyan})`, boxShadow: `0 0 18px ${color}88`}} />;

const HeaderTitle = ({start, end, eyebrow, hero, accent, side}: {start: number; end: number; eyebrow: string; hero: string; accent?: string; side?: ReactNode}) => {
  const frame = useCurrentFrame();
  const p = pop(frame, start + 0.05);
  return <Stage start={start} end={end}><div style={{position: "absolute", left: 44, top: 35, transform: `translateY(${(1 - p) * 24}px)`}}><Eyebrow>{eyebrow}</Eyebrow><div style={{marginTop: 12, fontSize: 76, lineHeight: 0.94, fontWeight: 950, letterSpacing: -4, color: accent ?? C.white}}>{hero}</div><Underline value={progress(frame, start + 0.1)} color={accent ?? C.blue} width={560} /></div>{side ? <div style={{position: "absolute", right: 44, top: 35, height: 140, display: "grid", alignItems: "center", justifyItems: "end"}}>{side}</div> : null}</Stage>;
};

const ArrowUp = ({frame, at, color = C.red}: {frame: number; at: number; color?: string}) => {
  const p = progress(frame, at, 18);
  return <svg width="220" height="130" viewBox="0 0 220 130"><path d="M10 112 L68 88 L106 99 L158 43 L204 23" fill="none" stroke={color} strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={`${p * 310} 330`} /><path d="M176 20 L207 21 L203 52" fill="none" stroke={color} strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" opacity={p} /></svg>;
};

const PriceCompare = ({start, end, eyebrow, from, to, multiple, fromColor = C.soft, toColor = C.orange}: {start: number; end: number; eyebrow: string; from: string; to: string; multiple: string; fromColor?: string; toColor?: string}) => {
  const frame = useCurrentFrame();
  const p = progress(frame, start + 0.08, 18);
  const hit = pop(frame, start + 0.55, 14);
  return <Stage start={start} end={end}><div style={{position: "absolute", left: 44, top: 34}}><Eyebrow>{eyebrow}</Eyebrow><div style={{display: "flex", alignItems: "center", gap: 27, marginTop: 8, fontFamily: mono}}><span style={{fontSize: 74, lineHeight: 1, fontWeight: 950, color: fromColor}}>{from}</span><svg width="180" height="56" viewBox="0 0 180 56"><path d="M4 28 H161" stroke={C.blue} strokeWidth="7" strokeLinecap="round" strokeDasharray={`${p * 170} 180`} /><path d="M143 8 L166 28 L143 49" fill="none" stroke={C.blue} strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" opacity={p} /></svg><span style={{fontSize: 94, lineHeight: 1, fontWeight: 950, color: toColor, transform: `scale(${0.8 + hit * 0.2})`, transformOrigin: "left center"}}>{to}</span></div></div><div style={{position: "absolute", right: 46, top: 42, textAlign: "right"}}><div style={{fontFamily: mono, fontSize: 86, fontWeight: 950, color: C.white, lineHeight: 1}}>{multiple}</div><div style={{fontFamily: mono, fontSize: 14, fontWeight: 900, letterSpacing: 2.2, color: C.soft, marginTop: 12}}>PRICE MULTIPLIER</div></div></Stage>;
};

const PercentRing = ({frame, at, value, color}: {frame: number; at: number; value: number; color: string}) => {
  const p = progress(frame, at, 22); const r = 52; const dash = 2 * Math.PI * r;
  return <svg width="130" height="130" viewBox="0 0 130 130"><circle cx="65" cy="65" r={r} fill="none" stroke="rgba(255,255,255,.14)" strokeWidth="10" /><circle cx="65" cy="65" r={r} fill="none" stroke={color} strokeWidth="10" strokeLinecap="round" strokeDasharray={`${dash * p * value / 100} ${dash}`} transform="rotate(-90 65 65)" /><text x="65" y="75" textAnchor="middle" fill={C.white} fontFamily={mono} fontSize="30" fontWeight="950">{Math.round(value * p)}%</text></svg>;
};

const Schedule = ({start, end}: {start: number; end: number}) => {
  const frame = useCurrentFrame(); const p1 = pop(frame, 38.85); const p2 = pop(frame, 40.5);
  return <Stage start={start} end={end}><div style={{position: "absolute", left: 42, right: 42, top: 30}}><Eyebrow>PEAK HOURS · BEIJING TIME</Eyebrow><div style={{display: "flex", alignItems: "center", gap: 26, marginTop: 18, fontFamily: mono}}><span style={{fontSize: 57, fontWeight: 950, color: C.white, opacity: p1, transform: `translateX(${(1 - p1) * -35}px)`}}>09:00—12:00</span><span style={{fontSize: 32, fontWeight: 950, color: C.red}}>+</span><span style={{fontSize: 57, fontWeight: 950, color: C.white, opacity: p2, transform: `translateX(${(1 - p2) * 35}px)`}}>14:00—18:00</span></div><div style={{marginTop: 15, height: 5, background: `linear-gradient(90deg, ${C.red} 0 29%, rgba(255,255,255,.16) 29% 47%, ${C.orange} 47% 86%, rgba(255,255,255,.16) 86%)`, transform: `scaleX(${progress(frame, 38.5, 35)})`, transformOrigin: "left"}} /></div></Stage>;
};

const QuotaBar = ({start, end, label, from, to, color}: {start: number; end: number; label: string; from: number; to: number; color: string}) => {
  const frame = useCurrentFrame(); const shrink = progress(frame, start + 0.45, 22); const current = from + (to - from) * shrink;
  return <Stage start={start} end={end}><div style={{position: "absolute", left: 44, right: 44, top: 34}}><div style={{display: "flex", justifyContent: "space-between", alignItems: "baseline"}}><div><Eyebrow color={color}>{label}</Eyebrow><div style={{fontSize: 54, fontWeight: 950, color: C.white, marginTop: 12}}>典型请求额度</div></div><div style={{fontFamily: mono, fontSize: 54, fontWeight: 950, color}}>{Math.round(current)}%</div></div><div style={{marginTop: 17, height: 15, borderRadius: 15, background: "rgba(255,255,255,.13)", overflow: "hidden"}}><div style={{width: `${current}%`, height: "100%", background: `linear-gradient(90deg, ${color}, ${C.cyan})`, boxShadow: `0 0 24px ${color}`}} /></div></div></Stage>;
};

const ApiWeb = ({start, end, webFocus = false}: {start: number; end: number; webFocus?: boolean}) => {
  const frame = useCurrentFrame(); const p = progress(frame, start + 0.08, 18);
  return <Stage start={start} end={end}><div style={{position: "absolute", left: 44, right: 44, top: 34}}><Eyebrow>{webFocus ? "WHO IS AFFECTED" : "PRICE SCOPE"}</Eyebrow><div style={{display: "flex", alignItems: "center", gap: 42, marginTop: 13}}><span style={{fontFamily: mono, fontSize: 75, fontWeight: 950, color: webFocus ? C.soft : C.red}}>API</span><div style={{width: 170, height: 6, background: `linear-gradient(90deg, ${C.red}, ${C.green})`, transform: `scaleX(${p})`, transformOrigin: "left"}} /><span style={{fontFamily: mono, fontSize: 75, fontWeight: 950, color: webFocus ? C.green : C.soft}}>WEB {webFocus ? "✓" : ""}</span></div><div style={{position: "absolute", right: 0, top: 48, fontSize: 31, fontWeight: 850, color: C.white}}>{webFocus ? "网页版基本不受影响" : "主要上涨"}</div></div></Stage>;
};

const Ranking = ({start, end}: {start: number; end: number}) => {
  const frame = useCurrentFrame();
  return <Stage start={start} end={end}><div style={{position: "absolute", left: 44, top: 30}}><Eyebrow color={C.red}>PRICE POSITION</Eyebrow><div style={{marginTop: 12, fontSize: 67, fontWeight: 950, color: C.white}}>最贵的那一批</div></div><div style={{position: "absolute", right: 44, top: 30, width: 360}}>{[0, 1, 2].map((i) => {const p = progress(frame, start + i * 0.14, 16); return <div key={i} style={{height: 19, marginTop: 15, width: p * (150 + i * 100), marginLeft: "auto", background: i === 2 ? C.red : i === 1 ? C.orange : C.blue, borderRadius: 10, boxShadow: i === 2 ? `0 0 20px ${C.red}88` : undefined}} />;})}</div></Stage>;
};

export const DeepSeekPriceEffects = () => {
  const frame = useCurrentFrame();
  return <AbsoluteFill style={{background: C.ink}}><Video src={source} style={{width: "100%", height: "100%"}} /><div style={{position: "absolute", left: 0, top: 420, width: 1080, height: 210, transform: "scale(2)", transformOrigin: "top left", overflow: "hidden", fontFamily: sans}}>
    <HeaderTitle start={0.12} end={2.55} eyebrow="DEEPSEEK / PRICE UPDATE" hero="突然涨价了" accent={C.blue} side={<ArrowUp frame={frame} at={0.55} />} />
    <Stage start={2.5} end={6.05}><div style={{position: "absolute", left: 44, top: 31}}><Eyebrow color={C.gold}>FROM GOD MODE TO REALITY</Eyebrow><div style={{marginTop: 13, display: "flex", alignItems: "center", gap: 24, fontSize: 72, fontWeight: 950}}><span style={{color: C.gold}}>梁神</span><span style={{color: C.blue, transform: `translateX(${progress(frame, 4.7, 14) * 10}px)`}}>→</span><span style={{color: C.white, opacity: progress(frame, 5.05, 12)}}>梁子</span></div><Underline value={progress(frame, 4.75, 20)} color={C.gold} width={590} /></div><div style={{position: "absolute", right: 60, top: 43, fontSize: 92, transform: `rotate(${(1 - progress(frame, 4.8, 16)) * -20}deg) translateY(${progress(frame, 5.0, 18) * 24}px)`}}>♛</div></Stage>
    <Stage start={6.1} end={8.25}><div style={{position: "absolute", left: 44, top: 31}}><Eyebrow>HOW EXPENSIVE?</Eyebrow><div style={{marginTop: 12, fontSize: 66, fontWeight: 950, color: C.white}}>这次有多夸张？</div></div><div style={{position: "absolute", right: 44, top: 38, display: "flex", gap: 24, fontFamily: mono}}><span style={{fontSize: 64, fontWeight: 950, color: C.orange, opacity: pop(frame, 6.55)}}>4.5×</span><span style={{fontSize: 64, fontWeight: 950, color: C.red, opacity: pop(frame, 6.9)}}>12×</span></div></Stage>
    <PriceCompare start={8.0} end={15.0} eyebrow="V4 PRO / OUTPUT · 每百万 TOKEN" from="6元" to="27元" multiple="×4.5" />
    <PriceCompare start={15.0} end={20.78} eyebrow="CACHE HIT · 每百万 TOKEN" from="0.025" to="0.30" multiple="×12" fromColor={C.cyan} toColor={C.red} />
    <HeaderTitle start={20.7} end={24.25} eyebrow="PREVIOUS EXPERIENCE" hero="缓存命中很高" accent={C.cyan} side={<div style={{fontFamily: mono, fontSize: 27, color: C.green, fontWeight: 950}}>HIT ✓ HIT ✓</div>} />
    <HeaderTitle start={24.15} end={29.15} eyebrow="MINI APP / CACHE TEST" hero="命中率 99%" accent={C.green} side={<PercentRing frame={frame} at={26.8} value={99} color={C.green} />} />
    <HeaderTitle start={29.0} end={33.25} eyebrow="BEFORE THE SHOCK" hero="涨价也还用得起" accent={C.green} side={<div style={{fontSize: 78, color: C.green}}>✓</div>} />
    <HeaderTitle start={33.15} end={35.3} eyebrow="REALITY CHECK" hero="没想到这么夸张" accent={C.red} side={<ArrowUp frame={frame} at={33.45} color={C.red} />} />
    <HeaderTitle start={35.15} end={38.05} eyebrow="NEW PRICING MODEL" hero="峰谷定价" accent={C.orange} side={<svg width="230" height="120" viewBox="0 0 230 120"><path d="M5 30 C45 30 45 92 86 92 S126 30 166 30 S194 92 225 92" fill="none" stroke={C.orange} strokeWidth="8" strokeLinecap="round" strokeDasharray={`${progress(frame,35.5,30)*430} 450`} /></svg>} />
    <Schedule start={37.75} end={43.35} />
    <HeaderTitle start={43.2} end={46.85} eyebrow="WORKING HOURS" hero="你上班，它也上班" accent={C.white} side={<div style={{display: "flex", gap: 15, fontSize: 57}}><span>◷</span><span style={{color: C.blue}}>◷</span></div>} />
    <HeaderTitle start={46.7} end={50.25} eyebrow="HEALTHY SCHEDULE" hero="午休足足 2 小时" accent={C.gold} side={<div style={{fontFamily: mono, fontSize: 58, fontWeight: 950, color: C.gold}}>2H</div>} />
    <HeaderTitle start={50.0} end={55.7} eyebrow="SUBSCRIPTION / TYPICAL USAGE" hero="OpenCode Go" accent={C.blue} side={<div style={{fontFamily: mono, fontSize: 26, fontWeight: 900, color: C.soft}}>USAGE LIMITS</div>} />
    <QuotaBar start={55.5} end={58.35} label="V4 PRO · 砍掉三分之二" from={100} to={33} color={C.orange} />
    <QuotaBar start={58.2} end={60.82} label="V4 FLASH · 只剩" from={100} to={10} color={C.red} />
    <QuotaBar start={60.7} end={63.85} label="TODAY · RECOVERY" from={10} to={20} color={C.green} />
    <HeaderTitle start={63.7} end={65.6} eyebrow="HOPE / NEXT UPDATE" hero="希望继续恢复" accent={C.green} side={<div style={{fontSize: 76, color: C.green}}>↗</div>} />
    <ApiWeb start={66.55} end={68.45} />
    <ApiWeb start={68.25} end={71.45} webFocus />
    <HeaderTitle start={71.3} end={76.3} eyebrow="CODING / AGENT USERS" hero="注意你的账单" accent={C.orange} side={<div style={{fontFamily: mono, fontSize: 60, fontWeight: 950, color: C.red}}>$ ↓</div>} />
    <Ranking start={76.55} end={79.05} />
    <HeaderTitle start={78.9} end={81.23} eyebrow="COMMENTS / YOUR TURN" hero="你在用什么 Coding Plan？" accent={C.blue} side={<div style={{fontSize: 65}}>◌</div>} />
  </div></AbsoluteFill>;
};
