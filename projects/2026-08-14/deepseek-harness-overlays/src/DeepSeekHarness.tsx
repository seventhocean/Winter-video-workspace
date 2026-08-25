import {Video} from "@remotion/media";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  Sequence,
  spring,
  useCurrentFrame,
} from "remotion";

const C = {
  ink: "#071b2d",
  blue: "#1687ff",
  cyan: "#20d5e8",
  mint: "#75e6ba",
  gold: "#ffb526",
  amber: "#f07735",
  muted: "#537087",
  white: "#ffffff",
};

const font = "-apple-system, BlinkMacSystemFont, 'PingFang SC', 'Microsoft YaHei', sans-serif";
const mono = "'SFMono-Regular', Consolas, 'Liberation Mono', monospace";

const clamp = (frame: number, input: number[], output: number[]) =>
  interpolate(frame, input, output, {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

const life = (frame: number, duration: number) =>
  interpolate(frame, [0, 8, Math.max(9, duration - 10), duration], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

const pop = (frame: number, delay = 0, damping = 18) =>
  spring({frame: frame - delay, fps: 30, config: {damping, stiffness: 180, mass: 0.7}});

const RightWash = () => (
  <div
    style={{
      position: "absolute",
      right: -100,
      top: -80,
      width: 1120,
      height: 1420,
      background: "radial-gradient(ellipse at 62% 38%, rgba(255,255,255,.96) 0%, rgba(255,255,255,.72) 42%, rgba(255,255,255,0) 74%)",
      pointerEvents: "none",
    }}
  />
);

const videoSources: Record<string, string> = {
  "opening.mov": "http://127.0.0.1:8767/%E5%BC%80%E5%A4%B4%E5%8F%A3%E6%92%AD/%E5%BC%80%E5%A4%B4%E5%8F%A3%E6%92%AD-1.mov",
  "closing.mov": "http://127.0.0.1:8767/%E7%BB%93%E5%B0%BE%E5%8F%A3%E6%92%AD/%E7%BB%93%E5%B0%BE%E5%8F%A3%E6%92%AD.mov",
};

const Base = ({src}: {src: string}) => (
  <AbsoluteFill style={{backgroundColor: C.white}}>
    <Video src={videoSources[src]} objectFit="cover" style={{width: "100%", height: "100%"}} />
  </AbsoluteFill>
);

const Label = ({children, color = C.blue}: {children: string; color?: string}) => (
  <div style={{fontFamily: mono, color, fontSize: 31, fontWeight: 800, letterSpacing: 6, textTransform: "uppercase"}}>
    {children}
  </div>
);

const AgentCore = ({frame}: {frame: number}) => {
  const ring = clamp(frame, [4, 28], [0, 1]);
  const pulse = 1 + Math.sin(frame / 5) * 0.035;
  return (
    <svg width="720" height="430" viewBox="0 0 720 430" style={{overflow: "visible"}}>
      <g transform={`translate(360 225) scale(${pulse}) translate(-360 -225)`}>
        {[0, 1, 2].map((i) => (
          <circle
            key={i}
            cx="360"
            cy="225"
            r={72 + i * 36}
            fill="none"
            stroke={i === 0 ? C.cyan : C.blue}
            strokeWidth={i === 0 ? 7 : 3}
            opacity={(0.7 - i * 0.17) * ring}
            strokeDasharray={`${ring * (250 + i * 90)} 900`}
            transform={`rotate(${-90 + frame * (i % 2 === 0 ? 0.5 : -0.35)} 360 225)`}
          />
        ))}
        <circle cx="360" cy="225" r="54" fill={C.ink} opacity={pop(frame, 6)} />
        <circle cx="360" cy="225" r="15" fill={C.cyan} opacity={pop(frame, 12)} />
      </g>
      {[
        [86, 84], [608, 68], [654, 304], [116, 345],
      ].map(([x, y], i) => {
        const p = pop(frame, 10 + i * 5);
        return (
          <g key={`${x}-${y}`} opacity={p}>
            <line x1="360" y1="225" x2={x} y2={y} stroke={C.blue} strokeWidth="4" opacity=".5" strokeDasharray="10 13" />
            <circle cx={x} cy={y} r={16 + p * 8} fill={i % 2 ? C.cyan : C.blue} />
          </g>
        );
      })}
    </svg>
  );
};

const OpeningAgent = () => {
  const frame = useCurrentFrame();
  const opacity = life(frame, 54);
  const title = pop(frame, 3);
  return (
    <AbsoluteFill style={{opacity, fontFamily: font}}>
      <RightWash />
      <div style={{position: "absolute", right: 110, top: 160, width: 770}}>
        <Label>DEEPSEEK / NEW ROLE</Label>
        <div style={{marginTop: 18, color: C.ink, fontSize: 88, fontWeight: 900, lineHeight: 1, transform: `translateY(${(1 - title) * 36}px)`, opacity: title}}>
          终于有了自己的
        </div>
        <div style={{display: "flex", alignItems: "baseline", gap: 18, marginTop: 10, transform: `scale(${0.94 + title * 0.06})`, transformOrigin: "left center"}}>
          <span style={{fontSize: 194, lineHeight: 0.95, fontWeight: 950, color: C.blue, letterSpacing: -8}}>AGENT</span>
          <span style={{fontFamily: mono, fontSize: 30, color: C.muted}}>ONLINE</span>
        </div>
        <div style={{marginTop: -20, marginLeft: 20}}><AgentCore frame={frame} /></div>
      </div>
    </AbsoluteFill>
  );
};

const Stars = ({frame}: {frame: number}) => (
  <>
    {Array.from({length: 12}).map((_, i) => {
      const p = pop(frame, 50 + i * 2, 15);
      const angle = (i / 12) * Math.PI * 2;
      const radius = 190 + (i % 3) * 45;
      return (
        <div
          key={i}
          style={{
            position: "absolute",
            left: 410 + Math.cos(angle) * radius * p,
            top: 420 + Math.sin(angle) * radius * p,
            color: i % 3 === 0 ? C.gold : C.blue,
            fontSize: 30 + (i % 3) * 9,
            opacity: p * (1 - Math.max(0, (frame - 88) / 12)),
            transform: `rotate(${i * 23}deg) scale(${p})`,
          }}
        >★</div>
      );
    })}
  </>
);

const OpeningStats = () => {
  const frame = useCurrentFrame();
  const opacity = life(frame, 101);
  const day = pop(frame, 1);
  const count = Math.round(clamp(frame, [50, 78], [0, 70]));
  const countScale = pop(frame, 48, 16);
  return (
    <AbsoluteFill style={{opacity, fontFamily: font}}>
      <RightWash />
      <div style={{position: "absolute", right: 95, top: 180, width: 850, height: 1060}}>
        <Label color={C.gold}>GITHUB MOMENTUM</Label>
        <div style={{marginTop: 28, display: "flex", alignItems: "flex-end", gap: 24, opacity: day, transform: `translateX(${(1 - day) * 55}px)`}}>
          <span style={{fontFamily: mono, color: C.ink, fontSize: 174, fontWeight: 950, letterSpacing: -10}}>&lt;24H</span>
          <span style={{fontSize: 39, color: C.muted, paddingBottom: 28, fontWeight: 700}}>一天不到</span>
        </div>
        <div style={{position: "relative", marginTop: 65, height: 700}}>
          <Stars frame={frame} />
          <div style={{position: "absolute", left: 52, top: 150, transform: `scale(${0.88 + countScale * 0.12})`, transformOrigin: "left center"}}>
            <div style={{fontFamily: mono, fontSize: 245, lineHeight: 0.88, color: C.blue, fontWeight: 950, letterSpacing: -18}}>{count}K+</div>
            <div style={{marginTop: 28, display: "flex", alignItems: "center", gap: 18}}>
              <span style={{color: C.gold, fontSize: 61}}>★</span>
              <span style={{fontFamily: mono, fontSize: 38, color: C.ink, letterSpacing: 5, fontWeight: 800}}>STARS</span>
            </div>
          </div>
          <svg width="790" height="680" style={{position: "absolute", inset: 0}}>
            <path d="M70 580 C210 565 260 500 365 470 C520 425 560 312 730 180" fill="none" stroke={C.cyan} strokeWidth="9" strokeLinecap="round" strokeDasharray="12 18" opacity={clamp(frame, [8, 42], [0, 0.65])} />
            <circle cx={clamp(frame, [8, 42], [70, 730])} cy={clamp(frame, [8, 42], [580, 180])} r="13" fill={C.blue} opacity={clamp(frame, [8, 18], [0, 1])} />
          </svg>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const Whale = ({frame}: {frame: number}) => {
  const body = pop(frame, 23);
  const harness = clamp(frame, [55, 73], [0, 1]);
  return (
    <svg width="760" height="620" viewBox="0 0 760 620" style={{overflow: "visible"}}>
      <g opacity={body} transform={`translate(60 ${75 + (1 - body) * 60}) scale(${0.88 + body * 0.12})`}>
        <path d="M126 271 C162 147 309 118 449 176 C528 209 567 269 552 330 C532 413 417 453 303 424 C210 401 159 343 126 271Z" fill={C.blue} />
        <path d="M509 234 C587 197 629 145 646 90 C658 158 646 215 608 260 C652 277 687 309 700 353 C648 343 600 328 552 301Z" fill={C.cyan} opacity=".9" />
        <path d="M128 270 C93 236 69 199 56 157 C107 168 145 194 171 231Z" fill={C.blue} />
        <path d="M182 190 C246 145 358 144 446 177" fill="none" stroke={C.white} strokeWidth="14" opacity=".7" strokeLinecap="round" />
        <circle cx="224" cy="250" r="13" fill={C.white} />
        <circle cx="227" cy="251" r="6" fill={C.ink} />
        <path d="M263 327 C326 364 407 359 462 317" fill="none" stroke={C.white} strokeWidth="11" opacity=".8" strokeLinecap="round" />
      </g>
      <g transform="translate(335 305)">
        <circle cx="0" cy="0" r="232" fill="none" stroke={C.gold} strokeWidth="8" opacity={harness * 0.9} strokeDasharray={`${harness * 1460} 1460`} transform="rotate(-90)" />
        <circle cx="0" cy="0" r="270" fill="none" stroke={C.blue} strokeWidth="3" opacity={harness * 0.55} strokeDasharray="18 22" transform={`rotate(${frame * 1.4})`} />
        {[0, 90, 180, 270].map((a, i) => {
          const rad = (a * Math.PI) / 180;
          return <circle key={a} cx={Math.cos(rad) * 232} cy={Math.sin(rad) * 232} r={8 + i * 2} fill={i % 2 ? C.cyan : C.gold} opacity={harness} />;
        })}
      </g>
    </svg>
  );
};

const WeaponScene = ({duration = 88, recap = false}: {duration?: number; recap?: boolean}) => {
  const frame = useCurrentFrame();
  const opacity = life(frame, duration);
  return (
    <AbsoluteFill style={{opacity, fontFamily: font}}>
      <RightWash />
      <div style={{position: "absolute", right: 80, top: 150, width: 900}}>
        <Label>{recap ? "FIELD TEST / SUMMARY" : "DEEPSEEK / EQUIPMENT"}</Label>
        <div style={{marginTop: 18, color: C.ink, fontSize: 90, fontWeight: 900}}>{recap ? "终于有了自己的" : "肥鲸鱼的"}</div>
        <div style={{fontSize: 180, lineHeight: 0.95, fontWeight: 950, color: C.blue, letterSpacing: -8}}>专武</div>
        <div style={{position: "absolute", left: 70, top: 260}}><Whale frame={frame} /></div>
        <div style={{position: "absolute", right: 15, top: 720, fontFamily: mono, color: C.gold, fontSize: 34, fontWeight: 900, letterSpacing: 5, opacity: clamp(frame, [58, 72], [0, 1])}}>HARNESS EQUIPPED</div>
      </div>
    </AbsoluteFill>
  );
};

const OpeningTest = () => {
  const frame = useCurrentFrame();
  const opacity = life(frame, 84);
  const run = pop(frame, 64, 13);
  const nodes = ["PLAN", "TOOL", "ACT"];
  return (
    <AbsoluteFill style={{opacity, fontFamily: font}}>
      <RightWash />
      <div style={{position: "absolute", right: 70, top: 200, width: 900}}>
        <Label>DEEPSEEK HARNESS</Label>
        <div style={{marginTop: 26, fontSize: 86, lineHeight: 1.08, color: C.ink, fontWeight: 900}}>到底怎么样？</div>
        <div style={{position: "relative", marginTop: 85, height: 380}}>
          <svg width="850" height="220" style={{position: "absolute", top: 40}}>
            <line x1="105" y1="105" x2="745" y2="105" stroke={C.blue} strokeWidth="8" strokeDasharray={`${clamp(frame, [18, 48], [0, 640])} 700`} />
          </svg>
          {nodes.map((n, i) => {
            const p = pop(frame, 18 + i * 12);
            return (
              <div key={n} style={{position: "absolute", left: 30 + i * 285, top: 70, width: 150, textAlign: "center", opacity: p, transform: `scale(${0.7 + p * 0.3})`}}>
                <div style={{margin: "0 auto", width: 70, height: 70, borderRadius: "50%", background: i === 2 ? C.cyan : C.blue, boxShadow: `0 0 0 ${12 * p}px rgba(22,135,255,.12)`}} />
                <div style={{marginTop: 28, fontFamily: mono, color: C.muted, fontWeight: 800, fontSize: 29, letterSpacing: 3}}>{n}</div>
              </div>
            );
          })}
        </div>
        <div style={{display: "flex", alignItems: "center", gap: 24, transform: `scale(${0.88 + run * 0.12})`, transformOrigin: "left center", opacity: run}}>
          <span style={{fontFamily: mono, color: C.blue, fontSize: 54, fontWeight: 900}}>&gt;</span>
          <span style={{color: C.ink, fontSize: 118, fontWeight: 950, letterSpacing: -5}}>试一下</span>
          <span style={{width: 12, height: 90, background: C.cyan, opacity: frame % 16 < 9 ? 1 : 0.18}} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

const SpeedCache = () => {
  const frame = useCurrentFrame();
  const opacity = life(frame, 104);
  const speed = pop(frame, 4);
  const cache = pop(frame, 54);
  return (
    <AbsoluteFill style={{opacity, fontFamily: font}}>
      <RightWash />
      <div style={{position: "absolute", right: 95, top: 180, width: 850}}>
        <Label>FIELD TEST / TWO SIGNALS</Label>
        <div style={{marginTop: 44, display: "flex", alignItems: "center", gap: 42, opacity: speed, transform: `translateX(${(1 - speed) * 80}px)`}}>
          <div style={{position: "relative", width: 240, height: 160}}>
            {[0, 1, 2, 3].map((i) => <div key={i} style={{position: "absolute", right: 0, top: 18 + i * 34, width: clamp(frame, [6 + i * 3, 28 + i * 3], [35, 230 - i * 26]), height: 9, borderRadius: 9, background: i % 2 ? C.cyan : C.blue}} />)}
          </div>
          <div><div style={{fontSize: 126, fontWeight: 950, color: C.ink, lineHeight: 0.9}}>速度</div><div style={{marginTop: 16, fontFamily: mono, fontSize: 39, color: C.blue, letterSpacing: 5, fontWeight: 900}}>VERY FAST</div></div>
        </div>
        <div style={{marginTop: 80, display: "flex", alignItems: "center", gap: 46, opacity: cache, transform: `translateY(${(1 - cache) * 55}px)`}}>
          <div style={{width: 270, height: 270, position: "relative"}}>
            {Array.from({length: 9}).map((_, i) => {
              const hit = pop(frame, 52 + i * 4);
              return <div key={i} style={{position: "absolute", left: (i % 3) * 88, top: Math.floor(i / 3) * 88, width: 67, height: 67, borderRadius: 13, background: hit > 0.75 ? C.mint : "rgba(22,135,255,.15)", border: `4px solid ${hit > 0.75 ? C.mint : C.blue}`, transform: `scale(${0.72 + hit * 0.28})`, boxShadow: hit > 0.75 ? "0 10px 28px rgba(50,190,140,.25)" : "none"}} />;
            })}
          </div>
          <div><div style={{fontSize: 106, fontWeight: 950, color: C.ink, lineHeight: 0.95}}>缓存命中</div><div style={{marginTop: 20, fontFamily: mono, fontSize: 39, color: "#27a875", letterSpacing: 5, fontWeight: 900}}>HIT RATE ↑</div></div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const Threshold = () => {
  const frame = useCurrentFrame();
  const opacity = life(frame, 236);
  const progress = clamp(frame, [12, 126], [0, 1]);
  const optimize = clamp(frame, [170, 214], [0, 1]);
  const steps = ["环境", "配置", "部署", "启动"];
  return (
    <AbsoluteFill style={{opacity, fontFamily: font}}>
      <RightWash />
      <div style={{position: "absolute", right: 75, top: 165, width: 910}}>
        <Label color={C.amber}>CURRENT FRICTION</Label>
        <div style={{marginTop: 24, color: C.ink, fontWeight: 950, fontSize: 101, lineHeight: 1.02}}>还不是<br />开箱即用</div>
        <div style={{position: "relative", height: 780, marginTop: 20}}>
          <svg width="900" height="690" style={{position: "absolute", inset: 0}}>
            <path d="M52 570 L210 570 L210 450 L390 450 L390 325 L580 325 L580 195 L820 195" fill="none" stroke={C.amber} strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={`${progress * 1550} 1600`} />
            <path d="M52 570 C260 570 330 375 495 345 C650 315 705 220 820 195" fill="none" stroke={C.cyan} strokeWidth="12" strokeLinecap="round" strokeDasharray={`${optimize * 990} 1000`} opacity={optimize} />
          </svg>
          {steps.map((s, i) => {
            const p = pop(frame, 20 + i * 25);
            const coords = [[90, 535], [245, 415], [425, 290], [615, 160]][i];
            return (
              <div key={s} style={{position: "absolute", left: coords[0], top: coords[1], opacity: p, transform: `translateY(${(1 - p) * 30}px)`}}>
                <div style={{width: 30, height: 30, borderRadius: "50%", background: optimize > 0.4 ? C.cyan : C.amber, boxShadow: `0 0 0 10px ${optimize > 0.4 ? "rgba(32,213,232,.15)" : "rgba(240,119,53,.14)"}`}} />
                <div style={{marginTop: 16, fontSize: 39, color: C.ink, fontWeight: 800}}>{s}</div>
              </div>
            );
          })}
          <div style={{position: "absolute", right: 30, top: 390, opacity: pop(frame, 124), transform: `translateX(${(1 - pop(frame, 124)) * 50}px)`}}>
            <div style={{fontFamily: mono, color: C.amber, fontSize: 31, letterSpacing: 5, fontWeight: 900}}>ENTRY BARRIER</div>
            <div style={{fontSize: 96, color: C.ink, fontWeight: 950}}>门槛偏高</div>
          </div>
          <div style={{position: "absolute", right: 25, top: 550, display: "flex", alignItems: "center", gap: 18, opacity: optimize}}>
            <span style={{fontSize: 34, fontWeight: 900, color: C.muted}}>后续优化</span>
            <span style={{fontFamily: mono, color: C.cyan, fontSize: 48}}>→</span>
            <span style={{fontFamily: mono, color: C.blue, fontSize: 34, fontWeight: 900, letterSpacing: 4}}>SIMPLER PATH</span>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const PluginMarket = () => {
  const frame = useCurrentFrame();
  const opacity = life(frame, 188);
  const core = pop(frame, 5);
  const nodes = [
    [110, 155, "MEMORY"], [660, 95, "WEB"], [780, 420, "TOOLS"], [520, 680, "VISION"], [75, 620, "AUTO"],
  ] as const;
  return (
    <AbsoluteFill style={{opacity, fontFamily: font}}>
      <RightWash />
      <div style={{position: "absolute", right: 60, top: 130, width: 950}}>
        <Label>THE NEXT WAVE</Label>
        <div style={{marginTop: 18, fontSize: 93, lineHeight: 1, fontWeight: 950, color: C.ink}}>插件市场</div>
        <div style={{fontFamily: mono, fontSize: 33, color: C.blue, marginTop: 18, letterSpacing: 4, fontWeight: 800}}>ECOSYSTEM IS GROWING</div>
        <div style={{position: "relative", height: 920, marginTop: 10}}>
          <svg width="930" height="850" style={{position: "absolute", inset: 0}}>
            {nodes.map(([x, y], i) => {
              const p = pop(frame, 45 + i * 17);
              return <line key={`${x}-${y}`} x1="455" y1="390" x2={x} y2={y} stroke={i % 2 ? C.cyan : C.blue} strokeWidth="5" opacity={p * 0.55} strokeDasharray="12 14" />;
            })}
            <circle cx="455" cy="390" r={150 * core} fill="rgba(7,27,45,.97)" />
            <circle cx="455" cy="390" r={190 * core} fill="none" stroke={C.blue} strokeWidth="6" opacity=".45" strokeDasharray="16 18" transform={`rotate(${frame * 0.8} 455 390)`} />
            <text x="455" y="380" textAnchor="middle" fill={C.white} fontFamily={mono} fontWeight="900" fontSize="36" opacity={core}>DEEPSEEK</text>
            <text x="455" y="428" textAnchor="middle" fill={C.cyan} fontFamily={mono} fontWeight="900" fontSize="31" opacity={core}>HARNESS</text>
          </svg>
          {nodes.map(([x, y, label], i) => {
            const p = pop(frame, 45 + i * 17);
            return (
              <div key={label} style={{position: "absolute", left: x - 70, top: y - 52, width: 140, textAlign: "center", opacity: p, transform: `scale(${0.6 + p * 0.4})`}}>
                <div style={{margin: "0 auto", width: 80, height: 80, borderRadius: 22, background: i % 2 ? C.cyan : C.blue, display: "grid", placeItems: "center", color: C.white, fontFamily: mono, fontSize: 36, fontWeight: 950, boxShadow: "0 14px 35px rgba(22,135,255,.22)"}}>+</div>
                <div style={{marginTop: 14, fontFamily: mono, color: C.ink, fontSize: 23, fontWeight: 900, letterSpacing: 2}}>{label}</div>
              </div>
            );
          })}
          <div style={{position: "absolute", left: 190, top: 770, fontSize: 41, color: C.muted, fontWeight: 700, opacity: pop(frame, 108)}}>更多开发者，更多有意思的插件</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const ClosingQuestion = () => {
  const frame = useCurrentFrame();
  const opacity = life(frame, 72);
  const p = pop(frame, 2, 14);
  return (
    <AbsoluteFill style={{opacity, fontFamily: font}}>
      <RightWash />
      <div style={{position: "absolute", right: 85, top: 260, width: 880, transform: `translateY(${(1 - p) * 45}px)`, opacity: p}}>
        <Label color={C.cyan}>YOUR TURN</Label>
        <div style={{marginTop: 28, color: C.ink, fontSize: 104, fontWeight: 950, lineHeight: 1.06}}>如果是你，<br />会开发什么功能？</div>
        <div style={{display: "flex", gap: 26, marginTop: 70}}>
          {[0, 1, 2].map((i) => <div key={i} style={{width: 155, height: 155, borderRadius: 36, border: `5px dashed ${i === 1 ? C.cyan : C.blue}`, display: "grid", placeItems: "center", color: i === 1 ? C.cyan : C.blue, fontSize: 76, fontWeight: 300, opacity: pop(frame, 14 + i * 6), transform: `rotate(${i === 1 ? 4 : -4}deg)`}}>+</div>)}
        </div>
        <div style={{marginTop: 64, display: "flex", alignItems: "center", gap: 22, opacity: pop(frame, 38)}}>
          <div style={{width: 16, height: 16, borderRadius: "50%", background: C.gold, boxShadow: "0 0 0 12px rgba(255,181,38,.18)"}} />
          <div style={{fontSize: 51, fontWeight: 850, color: C.muted}}>评论区聊一聊</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const OpeningComposition = () => (
  <AbsoluteFill>
    <Base src="opening.mov" />
    <Sequence durationInFrames={55}><OpeningAgent /></Sequence>
    <Sequence from={48} durationInFrames={102}><OpeningStats /></Sequence>
    <Sequence from={145} durationInFrames={89}><WeaponScene duration={89} /></Sequence>
    <Sequence from={228} durationInFrames={84}><OpeningTest /></Sequence>
  </AbsoluteFill>
);

export const ClosingComposition = () => (
  <AbsoluteFill>
    <Base src="closing.mov" />
    <Sequence durationInFrames={104}><WeaponScene duration={104} recap /></Sequence>
    <Sequence from={104} durationInFrames={105}><SpeedCache /></Sequence>
    <Sequence from={204} durationInFrames={237}><Threshold /></Sequence>
    <Sequence from={434} durationInFrames={189}><PluginMarket /></Sequence>
    <Sequence from={614} durationInFrames={68}><ClosingQuestion /></Sequence>
  </AbsoluteFill>
);
