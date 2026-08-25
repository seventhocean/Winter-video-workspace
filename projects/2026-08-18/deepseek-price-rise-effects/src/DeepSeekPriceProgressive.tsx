import {Video} from "@remotion/media";
import type {ReactNode} from "react";
import {AbsoluteFill, Easing, interpolate, spring, useCurrentFrame} from "remotion";

const T = {
  ink: "#071c2e",
  blue: "#1687ff",
  cyan: "#20cfe3",
  orange: "#ff8a42",
  red: "#ff5364",
  green: "#38c98a",
  gold: "#ffbd45",
  muted: "#63788b",
  white: "#ffffff",
};

const display = "-apple-system, BlinkMacSystemFont, 'PingFang SC', 'Microsoft YaHei', sans-serif";
const mono = "'SFMono-Regular', Menlo, Monaco, Consolas, monospace";
const source = "http://127.0.0.1:8769/source.mov";

const ease = (frame: number, input: number[], output: number[]) => interpolate(frame, input, output, {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
  easing: Easing.bezier(0.16, 1, 0.3, 1),
});

const pop = (frame: number, at: number, damping = 17) => spring({
  frame: frame - at * 30,
  fps: 30,
  config: {damping, stiffness: 185, mass: 0.72},
});

const life = (frame: number, start: number, end: number) => ease(frame, [start * 30, start * 30 + 7, end * 30 - 7, end * 30], [0, 1, 1, 0]);
const draw = (frame: number, at: number, duration = 18) => ease(frame, [at * 30, at * 30 + duration], [0, 1]);

type RailCue = {
  at: number;
  label: string;
  title: ReactNode;
  color?: string;
};

const ProgressiveRail = ({start, end, eyebrow, cues}: {start: number; end: number; eyebrow: string; cues: RailCue[]}) => {
  const frame = useCurrentFrame();
  const visible = cues.filter((item) => frame >= item.at * 30);
  const active = Math.max(0, visible.length - 1);
  return (
    <div style={{position: "absolute", inset: 0, opacity: life(frame, start, end)}}>
      <div style={{position: "absolute", left: 48, top: 38, width: 610}}>
        <div style={{fontFamily: mono, fontSize: 16, lineHeight: 1, fontWeight: 900, letterSpacing: 3.5, color: T.blue, textShadow: "0 0 10px rgba(255,255,255,.95), 0 0 22px rgba(255,255,255,.8)"}}>{eyebrow}</div>
        <div style={{position: "absolute", left: 7, top: 47, width: 2, height: Math.max(0, (visible.length - 1) * 91), background: "linear-gradient(180deg, rgba(22,135,255,.75), rgba(32,207,227,.28))"}} />
        <div style={{marginTop: 27}}>
          {cues.map((item, i) => {
            const p = pop(frame, item.at);
            const isVisible = frame >= item.at * 30;
            const isActive = i === active;
            if (!isVisible) return null;
            return (
              <div key={`${item.at}-${item.label}`} style={{position: "relative", minHeight: 91, paddingLeft: 34, opacity: isActive ? 1 : 0.5, transform: `translateY(${(1 - p) * 22}px)`}}>
                <div style={{position: "absolute", left: 0, top: 8, width: isActive ? 16 : 12, height: isActive ? 16 : 12, marginLeft: isActive ? 0 : 2, borderRadius: "50%", background: item.color ?? T.blue, boxShadow: isActive ? `0 0 0 6px ${(item.color ?? T.blue)}20, 0 0 20px ${(item.color ?? T.blue)}80` : undefined}} />
                <div style={{fontFamily: mono, fontSize: 12, lineHeight: 1.25, letterSpacing: 2.1, fontWeight: 900, color: item.color ?? T.blue}}>{item.label}</div>
                <div style={{marginTop: 6, maxWidth: 570, fontFamily: display, fontSize: isActive ? 46 : 38, lineHeight: 1.18, letterSpacing: -1.5, fontWeight: 950, color: T.ink, textShadow: "0 0 7px rgba(255,255,255,1), 0 0 16px rgba(255,255,255,.95), 0 0 28px rgba(255,255,255,.75)"}}>{item.title}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const RightStage = ({start, end, children}: {start: number; end: number; children: ReactNode}) => {
  const frame = useCurrentFrame();
  return <div style={{position: "absolute", right: 38, top: 42, width: 340, height: 420, opacity: life(frame, start, end), filter: "drop-shadow(0 0 9px rgba(255,255,255,.92)) drop-shadow(0 0 18px rgba(255,255,255,.72))"}}>{children}</div>;
};

const RisingPrice = ({start, end}: {start: number; end: number}) => {
  const frame = useCurrentFrame();
  const p = draw(frame, start + 0.3, 26);
  const crown = pop(frame, 3.5, 14);
  const numbers = pop(frame, 6.65, 14);
  return (
    <RightStage start={start} end={end}>
      <svg width="340" height="190" viewBox="0 0 340 190">
        <path d="M18 160 L92 132 L145 145 L224 65 L306 30" fill="none" stroke={T.red} strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={`${p * 440} 460`} />
        <path d="M274 25 L310 28 L306 65" fill="none" stroke={T.red} strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" opacity={p} />
      </svg>
      <div style={{position: "absolute", right: 24, top: 168, fontSize: 76, opacity: crown, transform: `translateY(${(1 - crown) * -25}px) rotate(${(1 - crown) * -18}deg)`, color: T.gold}}>♛</div>
      <div style={{position: "absolute", right: 4, top: 270, display: "flex", gap: 12, opacity: numbers, fontFamily: mono, fontWeight: 950}}>
        <span style={{fontSize: 48, color: T.orange}}>4.5×</span>
        <span style={{fontSize: 48, color: T.red}}>12×</span>
      </div>
    </RightStage>
  );
};

const PriceSteps = ({start, end}: {start: number; end: number}) => {
  const frame = useCurrentFrame();
  const first = pop(frame, 8.25);
  const second = pop(frame, 15.45);
  return (
    <RightStage start={start} end={end}>
      <div style={{fontFamily: mono, fontSize: 13, letterSpacing: 2.4, fontWeight: 900, color: T.muted}}>PRICE MULTIPLIER</div>
      <div style={{marginTop: 20, opacity: first, transform: `translateX(${(1 - first) * 36}px)`}}>
        <div style={{fontFamily: mono, fontSize: 30, fontWeight: 900, color: T.muted}}>6元</div>
        <div style={{display: "flex", alignItems: "center", gap: 15, marginTop: 5}}><div style={{width: 155, height: 8, borderRadius: 8, background: `linear-gradient(90deg, ${T.blue}, ${T.orange})`, transform: `scaleX(${draw(frame, 8.25, 20)})`, transformOrigin: "left"}} /><span style={{fontFamily: mono, fontSize: 58, fontWeight: 950, color: T.orange}}>27元</span></div>
        <div style={{fontFamily: mono, fontSize: 54, lineHeight: 1, fontWeight: 950, color: T.ink, textAlign: "right"}}>×4.5</div>
      </div>
      <div style={{marginTop: 35, opacity: second, transform: `translateX(${(1 - second) * 36}px)`}}>
        <div style={{fontFamily: mono, fontSize: 28, fontWeight: 900, color: T.muted}}>0.025元</div>
        <div style={{display: "flex", alignItems: "center", gap: 15, marginTop: 5}}><div style={{width: 150, height: 8, borderRadius: 8, background: `linear-gradient(90deg, ${T.cyan}, ${T.red})`, transform: `scaleX(${draw(frame, 15.45, 20)})`, transformOrigin: "left"}} /><span style={{fontFamily: mono, fontSize: 49, fontWeight: 950, color: T.red}}>0.30元</span></div>
        <div style={{fontFamily: mono, fontSize: 54, lineHeight: 1, fontWeight: 950, color: T.ink, textAlign: "right"}}>×12</div>
      </div>
    </RightStage>
  );
};

const CacheGauge = ({start, end}: {start: number; end: number}) => {
  const frame = useCurrentFrame();
  const p = draw(frame, 25.2, 28);
  const shock = draw(frame, 33.15, 18);
  const r = 95;
  const dash = 2 * Math.PI * r;
  return (
    <RightStage start={start} end={end}>
      <svg width="320" height="320" viewBox="0 0 320 320">
        <circle cx="160" cy="160" r={r} fill="rgba(255,255,255,.55)" stroke="rgba(7,28,46,.10)" strokeWidth="18" />
        <circle cx="160" cy="160" r={r} fill="none" stroke={shock > 0 ? T.red : T.green} strokeWidth="18" strokeLinecap="round" strokeDasharray={`${dash * p * 0.99} ${dash}`} transform="rotate(-90 160 160)" />
        <text x="160" y="175" textAnchor="middle" fill={T.ink} fontFamily={mono} fontSize="68" fontWeight="950">{Math.round(p * 99)}%</text>
      </svg>
      <div style={{marginTop: -20, fontFamily: mono, fontSize: 15, fontWeight: 900, letterSpacing: 2.2, color: shock > 0 ? T.red : T.green, textAlign: "center"}}>{shock > 0 ? "PRICE SHOCK ↗" : "CACHE HIT"}</div>
    </RightStage>
  );
};

const PeakClock = ({start, end}: {start: number; end: number}) => {
  const frame = useCurrentFrame();
  const p = draw(frame, 36.0, 24);
  const second = draw(frame, 40.0, 20);
  return (
    <RightStage start={start} end={end}>
      <svg width="330" height="330" viewBox="0 0 330 330">
        <circle cx="165" cy="165" r="125" fill="rgba(255,255,255,.55)" stroke={T.ink} strokeWidth="7" />
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => <line key={i} x1="165" y1="51" x2="165" y2="65" stroke={T.muted} strokeWidth="4" transform={`rotate(${i * 30} 165 165)`} />)}
        <path d="M165 165 L165 84" stroke={T.red} strokeWidth="10" strokeLinecap="round" transform={`rotate(${p * 100} 165 165)`} />
        <path d="M165 165 L235 165" stroke={T.orange} strokeWidth="8" strokeLinecap="round" opacity={second} transform={`rotate(${second * 70} 165 165)`} />
        <circle cx="165" cy="165" r="12" fill={T.blue} />
      </svg>
      <div style={{display: "flex", justifyContent: "center", gap: 12, marginTop: -10, fontFamily: mono, fontSize: 24, fontWeight: 950}}><span style={{color: T.red}}>09—12</span><span style={{color: T.muted}}>+</span><span style={{color: T.orange}}>14—18</span></div>
      <div style={{marginTop: 13, fontFamily: mono, fontSize: 44, fontWeight: 950, textAlign: "center", color: T.gold, opacity: pop(frame, 47.15)}}>午休 2H</div>
    </RightStage>
  );
};

const QuotaStack = ({start, end}: {start: number; end: number}) => {
  const frame = useCurrentFrame();
  const rows = [
    {at: 55.5, label: "V4 PRO", value: 33, color: T.orange},
    {at: 58.2, label: "V4 FLASH", value: 10, color: T.red},
    {at: 60.7, label: "TODAY", value: 20, color: T.green},
  ];
  return (
    <RightStage start={start} end={end}>
      <div style={{fontFamily: mono, fontSize: 14, fontWeight: 900, letterSpacing: 2.4, color: T.blue}}>OPENCODE GO / LIMITS</div>
      <div style={{marginTop: 28}}>{rows.map((row) => {
        const p = pop(frame, row.at);
        const amount = ease(frame, [row.at * 30, row.at * 30 + 22], [100, row.value]);
        return frame < row.at * 30 ? null : <div key={row.label} style={{marginBottom: 42, opacity: p, transform: `translateX(${(1 - p) * 28}px)`}}><div style={{display: "flex", justifyContent: "space-between", alignItems: "baseline", fontFamily: mono}}><span style={{fontSize: 18, fontWeight: 900, color: T.ink}}>{row.label}</span><span style={{fontSize: 42, fontWeight: 950, color: row.color}}>{Math.round(amount)}%</span></div><div style={{height: 12, borderRadius: 12, background: "rgba(7,28,46,.12)", overflow: "hidden"}}><div style={{width: `${amount}%`, height: "100%", background: row.color, boxShadow: `0 0 18px ${row.color}88`}} /></div></div>;
      })}</div>
    </RightStage>
  );
};

const ScopeVisual = ({start, end}: {start: number; end: number}) => {
  const frame = useCurrentFrame();
  const api = pop(frame, 66.8);
  const web = pop(frame, 68.55);
  const bill = pop(frame, 72.0);
  return (
    <RightStage start={start} end={end}>
      <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14}}>
        <div style={{height: 135, borderRadius: 28, background: T.red, color: T.white, display: "grid", placeItems: "center", opacity: api, transform: `scale(${0.75 + api * 0.25})`}}><div style={{textAlign: "center"}}><div style={{fontFamily: mono, fontSize: 46, fontWeight: 950}}>API</div><div style={{fontSize: 30, fontWeight: 950}}>涨价 ↗</div></div></div>
        <div style={{height: 135, borderRadius: 28, background: T.green, color: T.white, display: "grid", placeItems: "center", opacity: web, transform: `scale(${0.75 + web * 0.25})`}}><div style={{textAlign: "center"}}><div style={{fontFamily: mono, fontSize: 38, fontWeight: 950}}>WEB</div><div style={{fontSize: 30, fontWeight: 950}}>基本不变</div></div></div>
      </div>
      <div style={{marginTop: 38, opacity: bill, transform: `translateY(${(1 - bill) * 35}px)`}}><div style={{fontFamily: mono, fontSize: 15, letterSpacing: 2.5, fontWeight: 900, color: T.red}}>COST ALERT</div><div style={{display: "flex", alignItems: "center", gap: 20, marginTop: 10}}><span style={{fontFamily: mono, fontSize: 88, lineHeight: 1, fontWeight: 950, color: T.red}}>$</span><svg width="180" height="86" viewBox="0 0 180 86"><path d="M8 15 L58 38 L93 27 L145 70" fill="none" stroke={T.orange} strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={`${draw(frame, 72.1, 22) * 210} 220`} /><path d="M125 67 L150 72 L145 48" fill="none" stroke={T.orange} strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" /></svg></div></div>
    </RightStage>
  );
};

const ClosingVisual = ({start, end}: {start: number; end: number}) => {
  const frame = useCurrentFrame();
  const p = pop(frame, 79.25);
  return <RightStage start={start} end={end}><div style={{width: 270, height: 180, margin: "30px auto 0", border: `7px solid ${T.blue}`, borderRadius: 42, color: T.blue, display: "grid", placeItems: "center", opacity: p, transform: `scale(${0.72 + p * 0.28}) rotate(${(1 - p) * 8}deg)`}}><div style={{textAlign: "center"}}><div style={{fontSize: 72, lineHeight: 1}}>◌</div><div style={{fontFamily: mono, fontSize: 17, letterSpacing: 2, fontWeight: 900}}>COMMENTS</div></div></div></RightStage>;
};

export const DeepSeekPriceProgressive = () => {
  return (
    <AbsoluteFill style={{background: "#000"}}>
      <Video src={source} style={{width: "100%", height: "100%"}} />
      <div style={{position: "absolute", left: 0, top: 420, width: 1080, height: 900, transform: "scale(2)", transformOrigin: "top left", overflow: "hidden", fontFamily: display}}>
        <ProgressiveRail start={0.1} end={8.2} eyebrow="DEEPSEEK / PRICE UPDATE" cues={[
          {at: 0.2, label: "BREAKING", title: <>DeepSeek <span style={{color: T.red}}>突然涨价</span></>},
          {at: 2.7, label: "REACTION", title: <><span style={{color: T.gold}}>梁神</span> 变成梁子</>},
          {at: 6.58, label: "QUESTION", title: <>这次到底有多夸张？</>},
        ]} />
        <RisingPrice start={0.1} end={8.2} />

        <ProgressiveRail start={8.0} end={20.8} eyebrow="TWO PRICE SHOCKS" cues={[
          {at: 8.05, label: "V4 PRO / OUTPUT", title: <>每百万 Token 输出</>},
          {at: 9.55, label: "PRICE", title: <><span style={{color: T.muted}}>6 元</span> → <span style={{color: T.orange}}>27 元</span></>, color: T.orange},
          {at: 15.3, label: "CACHE HIT", title: <>缓存命中价格</>},
          {at: 16.75, label: "PRICE", title: <><span style={{color: T.muted}}>0.025 元</span> → <span style={{color: T.red}}>0.30 元</span></>, color: T.red},
        ]} />
        <PriceSteps start={8.0} end={20.8} />

        <ProgressiveRail start={20.7} end={35.3} eyebrow="CACHE EXPERIENCE" cues={[
          {at: 20.75, label: "PREVIOUS", title: <>缓存命中一直很高</>},
          {at: 24.15, label: "MINI APP TEST", title: <>实测命中率 <span style={{color: T.green}}>99%</span></>, color: T.green},
          {at: 29.0, label: "BEFORE", title: <>原本以为还用得起</>},
          {at: 33.15, label: "REALITY", title: <>没想到涨得这么夸张</>, color: T.red},
        ]} />
        <CacheGauge start={20.7} end={35.3} />

        <ProgressiveRail start={35.15} end={50.25} eyebrow="PEAK / OFF-PEAK PRICING" cues={[
          {at: 35.2, label: "NEW RULE", title: <>开始采用峰谷定价</>, color: T.orange},
          {at: 37.8, label: "PEAK 01", title: <>09:00—12:00</>, color: T.red},
          {at: 40.0, label: "PEAK 02", title: <>14:00—18:00</>, color: T.orange},
          {at: 46.75, label: "REST", title: <>中午休息足足 <span style={{color: T.gold}}>2 小时</span></>, color: T.gold},
        ]} />
        <PeakClock start={35.15} end={50.25} />

        <ProgressiveRail start={50.0} end={65.65} eyebrow="OPENCODE GO / USAGE LIMITS" cues={[
          {at: 50.05, label: "PLAN", title: <>OpenCode Go 订阅</>, color: T.blue},
          {at: 55.5, label: "V4 PRO", title: <>典型请求砍到 <span style={{color: T.orange}}>33%</span></>, color: T.orange},
          {at: 58.2, label: "V4 FLASH", title: <>一度只剩 <span style={{color: T.red}}>10%</span></>, color: T.red},
          {at: 60.7, label: "RECOVERY", title: <>今早恢复到 <span style={{color: T.green}}>20%</span></>, color: T.green},
        ]} />
        <QuotaStack start={50.0} end={65.65} />

        <ProgressiveRail start={66.55} end={79.05} eyebrow="WHO IS AFFECTED?" cues={[
          {at: 66.6, label: "API", title: <>API 调用价格上涨</>, color: T.red},
          {at: 68.3, label: "WEB", title: <>网页版基本不受影响</>, color: T.green},
          {at: 71.35, label: "CODING / AGENT", title: <>开发用户注意账单</>, color: T.orange},
          {at: 76.75, label: "RANKING", title: <>已经是最贵的一批</>, color: T.red},
        ]} />
        <ScopeVisual start={66.55} end={79.05} />

        <ProgressiveRail start={78.9} end={81.23} eyebrow="YOUR TURN" cues={[
          {at: 79.0, label: "COMMENTS", title: <>你在用什么<br />Coding Plan？</>, color: T.blue},
        ]} />
        <ClosingVisual start={78.9} end={81.23} />
      </div>
    </AbsoluteFill>
  );
};
