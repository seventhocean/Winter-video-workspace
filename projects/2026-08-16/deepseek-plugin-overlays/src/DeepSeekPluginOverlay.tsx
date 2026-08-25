import {Video} from "@remotion/media";
import type {ReactNode} from "react";
import {AbsoluteFill, Easing, interpolate, Sequence, spring, useCurrentFrame} from "remotion";

const T = {
  ink: "#071c2e",
  blue: "#1687ff",
  cyan: "#20cfe3",
  amber: "#ffad24",
  green: "#38c98a",
  red: "#ff6273",
  muted: "#567087",
  pale: "rgba(234,246,255,.86)",
  white: "#ffffff",
};

const display = "-apple-system, BlinkMacSystemFont, 'PingFang SC', 'Microsoft YaHei', sans-serif";
const mono = "'SFMono-Regular', Menlo, Monaco, Consolas, monospace";

const sources: Record<string, string> = {
  opening: "http://127.0.0.1:8768/%E5%BC%80%E5%A4%B4%E5%8F%A3%E6%92%AD/%E5%BC%80%E5%A4%B4%E5%8F%A3%E6%92%AD-1.mov",
  closing: "http://127.0.0.1:8768/%E7%BB%93%E5%B0%BE%E5%8F%A3%E6%92%AD/%E7%BB%93%E5%B0%BE%E5%8F%A3%E6%92%AD-1.mov",
};

const ease = (frame: number, input: number[], output: number[]) =>
  interpolate(frame, input, output, {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

const pop = (frame: number, delay = 0, damping = 17) =>
  spring({frame: frame - delay, fps: 30, config: {damping, stiffness: 180, mass: 0.72}});

const life = (frame: number, duration: number, enter = 7, exit = 9) => {
  const options = {extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const};
  if (exit <= 0) {
    return interpolate(frame, [0, enter, duration], [0, 1, 1], options);
  }
  return interpolate(frame, [0, enter, Math.max(enter + 1, duration - exit), duration], [0, 1, 1, 0], options);
};

const BaseVideo = ({source}: {source: "opening" | "closing"}) => (
  <AbsoluteFill style={{background: T.white}}>
    <Video src={sources[source]} objectFit="cover" style={{width: "100%", height: "100%"}} />
  </AbsoluteFill>
);

const LogicalStage = ({children}: {children: ReactNode}) => (
  <AbsoluteFill style={{overflow: "hidden"}}>
    <div style={{position: "absolute", left: 0, top: 0, width: 1080, height: 1920, transform: "scale(2)", transformOrigin: "top left", overflow: "hidden", fontFamily: display}}>
      {children}
    </div>
  </AbsoluteFill>
);

const TopWash = ({height = 480}: {height?: number}) => (
  <div style={{position: "absolute", left: 0, right: 0, top: 0, height, background: "linear-gradient(180deg, rgba(255,255,255,.98) 0%, rgba(255,255,255,.88) 50%, rgba(255,255,255,0) 100%)", pointerEvents: "none"}} />
);

const Eyebrow = ({children, color = T.blue}: {children: string; color?: string}) => (
  <div style={{fontFamily: mono, fontSize: 18, lineHeight: 1, fontWeight: 900, letterSpacing: 4, color}}>{children}</div>
);

const PluginGlyph = ({x, y, frame, delay, color = T.blue, label, scale = 1}: {x: number; y: number; frame: number; delay: number; color?: string; label?: string; scale?: number}) => {
  const p = pop(frame, delay, 15);
  const pulse = 1 + Math.sin((frame - delay) / 7) * 0.025;
  return (
    <div style={{position: "absolute", left: x, top: y, width: 92, textAlign: "center", opacity: p, transform: `scale(${p * pulse * scale})`, transformOrigin: "center"}}>
      <div style={{position: "relative", margin: "0 auto", width: 62, height: 62, borderRadius: 18, background: color, boxShadow: `0 10px 24px ${color}38`, display: "grid", placeItems: "center"}}>
        <div style={{position: "absolute", top: -8, left: 22, width: 18, height: 12, borderRadius: "6px 6px 0 0", border: `5px solid ${color}`, background: T.white}} />
        <div style={{position: "absolute", bottom: -8, left: 22, width: 18, height: 12, borderRadius: "0 0 6px 6px", border: `5px solid ${color}`, background: T.white}} />
        <span style={{fontFamily: mono, color: T.white, fontSize: 31, fontWeight: 950}}>+</span>
      </div>
      {label ? <div style={{marginTop: 10, fontFamily: mono, color: T.ink, fontSize: 12, fontWeight: 900, letterSpacing: 1.2}}>{label}</div> : null}
    </div>
  );
};

const HouseBlueprint = ({frame}: {frame: number}) => {
  const draw = ease(frame, [3, 27], [0, 1]);
  const sockets = ease(frame, [55, 75], [0, 1]);
  const raw = ease(frame, [109, 144], [0, 1]);
  return (
    <svg width="300" height="235" viewBox="0 0 300 235" style={{overflow: "visible"}}>
      <g opacity={draw}>
        <path d="M24 108 L148 22 L276 108" fill="none" stroke={T.blue} strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={`${draw * 390} 420`} />
        <path d="M49 98 V212 H251 V98" fill="rgba(22,135,255,.035)" stroke={T.ink} strokeWidth="6" strokeDasharray={`${draw * 520} 540`} />
        <path d="M149 72 V212 M49 148 H251" stroke={T.muted} strokeWidth="3" opacity=".48" strokeDasharray="8 8" />
        <rect x="122" y="151" width="54" height="61" rx="4" fill="none" stroke={T.blue} strokeWidth="5" />
        <circle cx="164" cy="181" r="4" fill={T.blue} />
      </g>
      {[72, 112, 188, 228].map((x, i) => <g key={x} opacity={sockets} transform={`translate(${x} ${i % 2 ? 128 : 176})`}><circle r="12" fill={T.white} stroke={T.red} strokeWidth="4" /><line x1="-5" y1="-5" x2="5" y2="5" stroke={T.red} strokeWidth="3" /><line x1="5" y1="-5" x2="-5" y2="5" stroke={T.red} strokeWidth="3" /></g>)}
      <g opacity={raw} stroke={T.amber} fill="none" strokeWidth="4" strokeDasharray="7 7">
        <path d="M66 193 h41 v-25 h-41z" />
        <path d="M192 191 q20-36 40 0" />
        <path d="M190 106 h43 v24 h-43z" />
      </g>
    </svg>
  );
};

const HouseProgressive = () => {
  const frame = useCurrentFrame();
  const opacity = life(frame, 169);
  const compact = ease(frame, [45, 58], [0, 1]);
  const noPlugin = pop(frame, 57);
  const analogy = pop(frame, 108);
  return (
    <AbsoluteFill style={{opacity}}>
      <TopWash height={520} />
      <div style={{position: "absolute", left: 62, top: 68, transform: `translateY(${-compact * 16}px) scale(${1 - compact * 0.2})`, transformOrigin: "top left"}}>
        <Eyebrow>DEEPSEEK / AGENT RUNTIME</Eyebrow>
        <div style={{marginTop: 14, fontFamily: mono, fontSize: 68 - compact * 30, fontWeight: 950, lineHeight: 0.9, letterSpacing: -4, color: T.blue}}>DEEPSEEK</div>
        <div style={{fontFamily: mono, fontSize: 86 - compact * 44, fontWeight: 950, lineHeight: 0.95, letterSpacing: -5, color: T.ink}}>HARNESS</div>
      </div>
      <div style={{position: "absolute", right: 46, top: 50, opacity: ease(frame, [7, 24], [0, 1]), transform: `translateY(${(1 - pop(frame, 5)) * -28}px) scale(.86)`}}><HouseBlueprint frame={frame} /></div>
      <div style={{position: "absolute", left: 62, top: 202, opacity: noPlugin, transform: `translateY(${(1 - noPlugin) * 28}px)`}}>
        <Eyebrow color={T.red}>BUT / EMPTY SLOTS</Eyebrow>
        <div style={{marginTop: 10, fontSize: 80, fontWeight: 950, lineHeight: 0.95, color: T.ink}}><span style={{color: T.red}}>没有</span>插件</div>
      </div>
      <div style={{position: "absolute", left: 62, top: 302, width: 630, opacity: analogy, transform: `translateX(${(1 - analogy) * -38}px)`}}>
        <div style={{fontSize: 66, lineHeight: 1, fontWeight: 950, color: T.ink}}>买了房，<span style={{color: T.amber}}>不装修</span></div>
        <div style={{marginTop: 13, width: analogy * 500, height: 7, borderRadius: 8, background: `linear-gradient(90deg, ${T.amber}, ${T.cyan})`}} />
      </div>
      <div style={{position: "absolute", left: 70, top: 540, opacity: noPlugin * (1 - analogy * 0.65)}}>
        {[0, 1, 2].map((i) => <div key={i} style={{position: "absolute", left: i * 88, top: i % 2 * 34, width: 56, height: 56, borderRadius: 16, border: `3px dashed ${T.red}`, color: T.red, display: "grid", placeItems: "center", fontFamily: mono, fontSize: 25, fontWeight: 900, opacity: ease(frame, [66 + i * 7, 76 + i * 7], [0, 1])}}>×</div>)}
      </div>
    </AbsoluteFill>
  );
};

const CommunityStage = () => {
  const frame = useCurrentFrame();
  const opacity = life(frame, 66);
  const count = Math.round(ease(frame, [20, 40], [0, 300]));
  const nodes = [[36, 455], [38, 635], [52, 815], [940, 455], [938, 635], [924, 815]] as const;
  return (
    <AbsoluteFill style={{opacity}}>
      <TopWash height={455} />
      <div style={{position: "absolute", left: 62, top: 64}}>
        <Eyebrow>COMMUNITY / ECOSYSTEM</Eyebrow>
        <div style={{marginTop: 12, color: T.ink, fontSize: 58, fontWeight: 950}}>社区已经有了</div>
        <div style={{display: "flex", alignItems: "baseline", gap: 14, marginTop: 4}}><span style={{fontFamily: mono, color: T.blue, fontSize: 126, lineHeight: 0.9, fontWeight: 950, letterSpacing: -8}}>{count}+</span><span style={{fontSize: 52, fontWeight: 950, color: T.ink}}>个插件</span></div>
      </div>
      <div style={{position: "absolute", left: 77, top: 430, width: 3, height: ease(frame, [13, 38], [0, 470]), background: `linear-gradient(${T.blue}, ${T.cyan})`, opacity: .32}} />
      <div style={{position: "absolute", right: 55, top: 430, width: 3, height: ease(frame, [13, 38], [0, 470]), background: `linear-gradient(${T.cyan}, ${T.blue})`, opacity: .32}} />
      {nodes.map(([x, y], i) => <PluginGlyph key={`${x}-${y}`} x={x} y={y} frame={frame} delay={14 + i * 3} color={[T.blue, T.cyan, T.green, T.amber][i % 4]} scale={0.72 + (i % 3) * 0.08} />)}
    </AbsoluteFill>
  );
};

const TopFiveStage = () => {
  const frame = useCurrentFrame();
  const opacity = life(frame, 72, 6, 3);
  const five = pop(frame, 22, 14);
  const filter = ease(frame, [12, 42], [0, 1]);
  return (
    <AbsoluteFill style={{opacity}}>
      <TopWash height={500} />
      <div style={{position: "absolute", left: 58, top: 58}}>
        <Eyebrow>WINTER'S SHORTLIST</Eyebrow>
        <div style={{display: "flex", alignItems: "flex-end", gap: 16, marginTop: 8}}><span style={{fontFamily: mono, fontSize: 74, fontWeight: 950, color: T.ink, lineHeight: 1}}>TOP</span><span style={{fontFamily: mono, fontSize: 180, fontWeight: 950, color: T.blue, lineHeight: 0.78, transform: `scale(${0.72 + five * 0.28})`, transformOrigin: "bottom left"}}>5</span></div>
        <div style={{marginTop: 18, color: T.ink, fontSize: 52, lineHeight: 1, fontWeight: 950}}>最值得安装的插件</div>
      </div>
      <div style={{position: "absolute", left: 118, top: 322, display: "flex", gap: 68}}>
        {[0, 1, 2, 3, 4].map((i) => {
          const p = pop(frame, 28 + i * 5, 14);
          return <div key={i} style={{width: 108, textAlign: "center", opacity: p, transform: `translateY(${(1 - p) * 85}px) scale(${0.65 + p * 0.35})`}}><div style={{width: 86, height: 86, margin: "0 auto", borderRadius: 24, background: i === 4 ? T.amber : i % 2 ? T.cyan : T.blue, display: "grid", placeItems: "center", color: T.white, fontFamily: mono, fontSize: 38, fontWeight: 950, boxShadow: "0 14px 30px rgba(22,135,255,.2)"}}>{i + 1}</div><div style={{marginTop: 12, fontFamily: mono, fontSize: 13, letterSpacing: 1.4, fontWeight: 900, color: T.ink}}>PLUGIN</div></div>;
        })}
      </div>
      <div style={{position: "absolute", left: 118, top: 465, width: filter * 826, height: 5, borderRadius: 5, background: `linear-gradient(90deg, ${T.blue}, ${T.cyan}, ${T.amber})`, opacity: .58}} />
    </AbsoluteFill>
  );
};

const ResourceStage = () => {
  const frame = useCurrentFrame();
  const opacity = life(frame, 122);
  const names = pop(frame, 31);
  const commands = pop(frame, 45);
  const ready = pop(frame, 59);
  const reply = pop(frame, 82, 14);
  const positions = [[46, 510], [46, 715], [46, 920], [902, 590], [902, 825]] as const;
  return (
    <AbsoluteFill style={{opacity}}>
      <TopWash height={470} />
      <div style={{position: "absolute", left: 58, top: 62, opacity: 1 - ease(frame, [78, 91], [0, 1])}}>
        <Eyebrow>READY TO INSTALL</Eyebrow>
        <div style={{display: "flex", alignItems: "baseline", gap: 15, marginTop: 8}}><span style={{fontFamily: mono, fontSize: 146, lineHeight: 0.86, fontWeight: 950, color: T.blue}}>5</span><span style={{fontSize: 58, fontWeight: 950, color: T.ink}}>个插件</span></div>
        <div style={{display: "flex", gap: 22, marginTop: 17, fontSize: 43, fontWeight: 950}}><span style={{color: T.ink, opacity: names}}>名字</span><span style={{color: T.cyan, opacity: names}}>+</span><span style={{color: T.ink, opacity: commands}}>命令</span><span style={{color: T.green, opacity: ready}}>✓ 已备好</span></div>
      </div>
      {positions.map(([x, y], i) => {
        const p = pop(frame, 4 + i * 4);
        return <div key={`${x}-${y}`} style={{position: "absolute", left: x, top: y, width: 132, opacity: p * (1 - ease(frame, [88, 105], [0, 1])), transform: `scale(${0.74 + p * 0.26})`}}><div style={{width: 66, height: 66, borderRadius: 19, background: i % 2 ? T.cyan : T.blue, color: T.white, display: "grid", placeItems: "center", fontFamily: mono, fontSize: 27, fontWeight: 950}}>{i + 1}</div><div style={{marginTop: 10, fontFamily: mono, color: T.ink, fontSize: 12, fontWeight: 900, opacity: names}}>PLUGIN {String(i + 1).padStart(2, "0")}</div><div style={{marginTop: 5, fontFamily: mono, color: T.muted, fontSize: 12, fontWeight: 800, opacity: commands}}>&gt; install</div><div style={{position: "absolute", left: 49, top: 48, width: 25, height: 25, borderRadius: "50%", background: T.green, color: T.white, display: "grid", placeItems: "center", fontSize: 16, fontWeight: 950, opacity: ready}}>✓</div></div>;
      })}
      <div style={{position: "absolute", left: 105, right: 105, top: 155, opacity: reply, transform: `translateY(${(1 - reply) * 44}px)`}}>
        <Eyebrow color={T.amber}>COMMENT TO RECEIVE</Eyebrow>
        <div style={{marginTop: 13, fontSize: 52, fontWeight: 950, color: T.ink}}>需要的话，回复</div>
        <div style={{marginTop: 10, display: "flex", alignItems: "center", gap: 18}}><div style={{padding: "18px 34px", borderRadius: 35, background: T.ink, color: T.white, fontSize: 74, lineHeight: 1, fontWeight: 950, boxShadow: "0 18px 40px rgba(7,28,46,.18)"}}>插件</div><div style={{width: 78, height: 78, borderRadius: "50%", background: T.blue, color: T.white, display: "grid", placeItems: "center", fontSize: 37, transform: `rotate(${reply * -18}deg)`}}>➜</div></div>
      </div>
    </AbsoluteFill>
  );
};

const SignoffStage = () => {
  const frame = useCurrentFrame();
  const opacity = life(frame, 90, 5, 0);
  const winter = pop(frame, 5);
  const next = pop(frame, 20);
  const bye = pop(frame, 35, 13);
  return (
    <AbsoluteFill style={{opacity}}>
      <TopWash height={520} />
      <div style={{position: "absolute", left: 60, top: 70, opacity: winter, transform: `translateX(${(1 - winter) * -38}px)`}}><Eyebrow>CREATOR / SIGN OFF</Eyebrow><div style={{marginTop: 12, color: T.ink, fontSize: 54, fontWeight: 850}}>我是</div><div style={{fontFamily: mono, color: T.blue, fontSize: 112, fontWeight: 950, lineHeight: 0.92, letterSpacing: -6}}>WINTER</div></div>
      <div style={{position: "absolute", right: 55, top: 255, textAlign: "right", opacity: next, transform: `translateY(${(1 - next) * 38}px)`}}><div style={{color: T.ink, fontSize: 72, lineHeight: 1, fontWeight: 950}}>下期见</div><div style={{marginTop: 16, display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 14}}><span style={{fontFamily: mono, color: T.muted, fontSize: 17, fontWeight: 900, letterSpacing: 3}}>NEXT EPISODE</span><span style={{color: T.cyan, fontSize: 44}}>→</span></div></div>
      <div style={{position: "absolute", left: 58, top: 420, display: "flex", alignItems: "center", gap: 24, opacity: bye, transform: `scale(${0.84 + bye * 0.16})`, transformOrigin: "left center"}}><div style={{fontSize: 94, lineHeight: 1, fontWeight: 950, color: T.blue}}>拜拜</div><svg width="130" height="130" viewBox="0 0 130 130" style={{transform: `rotate(${Math.sin(frame / 3) * 8}deg)`, transformOrigin: "70% 80%"}}><path d="M43 91 C25 72 33 58 43 62 L55 72 L52 29 C51 18 66 17 69 28 L72 58 L79 24 C81 13 96 17 95 29 L93 61 L102 39 C107 28 120 35 116 46 L102 88 C94 111 61 116 43 91Z" fill="none" stroke={T.amber} strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" /></svg></div>
      <div style={{position: "absolute", left: 60, top: 605, width: ease(frame, [22, 48], [0, 650]), height: 6, borderRadius: 6, background: `linear-gradient(90deg, ${T.blue}, ${T.cyan}, ${T.amber})`, opacity: next}} />
    </AbsoluteFill>
  );
};

export const OpeningPluginOverlay = () => (
  <AbsoluteFill>
    <BaseVideo source="opening" />
    <LogicalStage>
      <Sequence durationInFrames={170}><HouseProgressive /></Sequence>
      <Sequence from={165} durationInFrames={67}><CommunityStage /></Sequence>
      <Sequence from={223} durationInFrames={72}><TopFiveStage /></Sequence>
    </LogicalStage>
  </AbsoluteFill>
);

export const ClosingPluginOverlay = () => (
  <AbsoluteFill>
    <BaseVideo source="closing" />
    <LogicalStage>
      <Sequence durationInFrames={123}><ResourceStage /></Sequence>
      <Sequence from={120} durationInFrames={90}><SignoffStage /></Sequence>
    </LogicalStage>
  </AbsoluteFill>
);
