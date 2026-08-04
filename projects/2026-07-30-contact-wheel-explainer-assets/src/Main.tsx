import {
  AbsoluteFill,
  Audio,
  Img,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type {CSSProperties, ReactNode} from "react";

const colors = {
  background: "#07121d",
  panel: "rgba(7, 24, 38, 0.92)",
  panelSoft: "rgba(13, 39, 59, 0.72)",
  border: "rgba(111, 184, 224, 0.28)",
  text: "#f5f9ff",
  muted: "#9eb5c8",
  cyan: "#43d8ff",
  blue: "#66a7ff",
  amber: "#ffc34d",
  green: "#42df86",
  red: "#ff715b",
  purple: "#aa87ff",
};

const font = '"SF Pro Display", "PingFang SC", "Microsoft YaHei", system-ui, sans-serif';
const mono = 'Menlo, Monaco, "Courier New", monospace';
const clamp = {extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const};

const ease = (value: number) => {
  const t = Math.max(0, Math.min(1, value));
  return 1 - Math.pow(1 - t, 3);
};

const fade = (frame: number, start: number, end: number) =>
  interpolate(frame, [start, Math.max(start + 1, end)], [0, 1], {
    ...clamp,
  });

const Panel = ({
  children,
  style,
  accent = colors.cyan,
}: {
  children: ReactNode;
  style?: CSSProperties;
  accent?: string;
}) => (
  <div
    style={{
      position: "absolute",
      borderRadius: 26,
      border: `1px solid ${accent}55`,
      background: colors.panel,
      boxShadow: "0 28px 80px rgba(0, 0, 0, .3)",
      overflow: "hidden",
      ...style,
    }}
  >
    {children}
  </div>
);

const Tag = ({children, color = colors.cyan}: {children: ReactNode; color?: string}) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 10,
      padding: "9px 16px",
      borderRadius: 999,
      border: `1px solid ${color}66`,
      color,
      background: `${color}14`,
      fontFamily: mono,
      fontSize: 16,
      letterSpacing: 2,
    }}
  >
    <span style={{width: 7, height: 7, borderRadius: "50%", background: color}} />
    {children}
  </div>
);

const Header = ({kicker, title}: {kicker: string; title: string}) => (
  <div style={{position: "absolute", left: 84, top: 66, zIndex: 4}}>
    <div style={{color: colors.muted, fontFamily: mono, fontSize: 17, letterSpacing: 4}}>
      {kicker}
    </div>
    <div style={{marginTop: 18, color: colors.text, fontFamily: font, fontSize: 52, fontWeight: 850}}>
      {title}
    </div>
  </div>
);

const Background = ({
  kicker,
  title,
  children,
}: {
  kicker: string;
  title: string;
  children: ReactNode;
}) => (
  <AbsoluteFill
    style={{
      background: "radial-gradient(circle at 54% 42%, #17364d 0%, #091925 45%, #050d15 100%)",
      color: colors.text,
      fontFamily: font,
      overflow: "hidden",
    }}
  >
    <div
      style={{
        position: "absolute",
        inset: 0,
        opacity: 0.18,
        backgroundImage:
          "linear-gradient(rgba(105,151,184,.16) 1px, transparent 1px), linear-gradient(90deg, rgba(105,151,184,.16) 1px, transparent 1px)",
        backgroundSize: "64px 64px",
      }}
    />
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: "linear-gradient(115deg, rgba(67,216,255,.08), transparent 35%, rgba(255,195,77,.06))",
      }}
    />
    <Header kicker={kicker} title={title} />
    {children}
    <div style={{position: "absolute", left: 84, right: 84, bottom: 54, display: "flex", justifyContent: "space-between", color: colors.muted, fontFamily: mono, fontSize: 15, letterSpacing: 2}}>
      <span>CONTACT WHEEL / FULL-SCREEN EXPLAINER</span>
      <span>REMOTION TEMPLATE SYSTEM</span>
    </div>
  </AbsoluteFill>
);

const Card = ({
  title,
  color,
  style,
}: {
  title: string;
  color: string;
  style?: CSSProperties;
}) => (
  <div
    style={{
      height: 88,
      borderRadius: 16,
      padding: "0 24px",
      display: "flex",
      alignItems: "center",
      gap: 18,
      background: `linear-gradient(135deg, ${color}32, rgba(3, 11, 18, .94))`,
      border: `1px solid ${color}88`,
      color: colors.text,
      fontSize: 27,
      fontWeight: 750,
      ...style,
    }}
  >
    <span style={{width: 12, height: 12, borderRadius: "50%", background: color, boxShadow: `0 0 18px ${color}`}} />
    {title}
  </div>
);

const Arrow = ({left, top, width, color = colors.cyan}: {left: number; top: number; width: number; color?: string}) => (
  <div style={{position: "absolute", left, top, width, height: 2, background: `linear-gradient(90deg, transparent, ${color}, transparent)`, opacity: 0.9}}>
    <div style={{position: "absolute", right: -2, top: -5, width: 0, height: 0, borderTop: "6px solid transparent", borderBottom: "6px solid transparent", borderLeft: `10px solid ${color}`}} />
  </div>
);

export const WheelPrinciple = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const motion = ease((t - 0.9) / 4.7);
  const speed = Math.sin(Math.PI * Math.max(0, Math.min(1, (t - 1.1) / 4.2)));
  const reelOffset = motion * 610;
  const activePhase = t < 1.55 ? 0 : t < 3.1 ? 1 : t < 5.45 ? 2 : 3;
  const cards = ["心理学名词", "MBTI 类型", "图书封面", "工具清单", "存在主义", "心理学名词"];
  const cardColors = [colors.cyan, colors.purple, colors.amber, colors.green, colors.red, colors.cyan];

  return (
    <Background kicker="01 / PRINCIPLE" title="把一次轮转，变成固定规则">
      <Panel style={{left: 96, top: 264, width: 430, height: 546}} accent={colors.blue}>
        <div style={{padding: "28px 30px", color: colors.muted, fontFamily: mono, fontSize: 16, letterSpacing: 3}}>INPUT / CONTENT</div>
        <div style={{padding: "8px 30px", display: "grid", gap: 14, opacity: fade(frame, 4, 20)}}>
          <Card title="一组卡片内容" color={colors.cyan} />
          <Card title="文字或图片" color={colors.purple} />
          <Card title="最终停留项" color={colors.amber} />
        </div>
        <div style={{position: "absolute", left: 30, right: 30, bottom: 30, color: colors.muted, fontSize: 18}}>内容变化，输入方式不变</div>
      </Panel>

      <Arrow left={535} top={536} width={112} color={colors.cyan} />

      <Panel style={{left: 666, top: 190, width: 628, height: 680}} accent={colors.cyan}>
        <div style={{padding: "28px 32px", display: "flex", justifyContent: "space-between", alignItems: "center"}}>
          <div style={{color: colors.muted, fontFamily: mono, fontSize: 16, letterSpacing: 3}}>MOTION / REEL</div>
          <Tag color={speed > 0.74 ? colors.amber : colors.cyan}>{speed > 0.74 ? "FAST" : "ROLLING"}</Tag>
        </div>
        <div style={{position: "absolute", left: 34, right: 34, top: 92, bottom: 34, borderRadius: 20, background: "#02070b", border: "1px solid rgba(137,177,204,.3)", overflow: "hidden"}}>
          <div style={{position: "absolute", inset: 0, transform: `translateY(${-reelOffset}px)`, filter: `blur(${speed * 1.4}px)`}}>
            {cards.map((title, index) => (
              <Card key={`${title}-${index}`} title={title} color={cardColors[index]} style={{position: "absolute", left: 36, right: 36, top: 196 + index * 118}} />
            ))}
          </div>
          <div style={{position: "absolute", inset: 0, background: "linear-gradient(180deg, #02070b, transparent 19%, transparent 78%, #02070b)"}} />
          <div style={{position: "absolute", left: 28, right: 28, top: "50%", height: 2, background: colors.amber, boxShadow: `0 0 16px ${colors.amber}`}} />
        </div>
      </Panel>

      <Arrow left={1300} top={536} width={86} color={colors.amber} />

      <Panel style={{left: 1430, top: 258, width: 390, height: 330}} accent={colors.amber}>
        <div style={{padding: "28px 28px 0", color: colors.muted, fontFamily: mono, fontSize: 16, letterSpacing: 3}}>SPEED CURVE</div>
        <svg width="334" height="170" viewBox="0 0 334 170" style={{margin: "22px 28px 0"}}>
          <path d="M8 148 C72 148 88 36 168 36 C248 36 254 148 326 148" fill="none" stroke="#33536a" strokeWidth="3" />
          <path d="M8 148 C72 148 88 36 168 36 C248 36 254 148 326 148" fill="none" stroke={colors.cyan} strokeWidth="6" strokeDasharray="460" strokeDashoffset={460 - Math.min(460, Math.max(0, motion * 460))} />
          <circle cx={8 + motion * 318} cy={148 - Math.sin(Math.PI * motion) * 112} r="9" fill={colors.amber} />
          <text x="8" y="166" fill={colors.muted} fontSize="13">启动</text>
          <text x="145" y="22" fill={colors.muted} fontSize="13">加速</text>
          <text x="285" y="166" fill={colors.muted} fontSize="13">减速</text>
        </svg>
      </Panel>

      <div style={{position: "absolute", left: 96, right: 96, bottom: 150, display: "flex", gap: 14}}>
        {["循环", "加速", "减速", "最终锁定"].map((item, index) => (
          <div key={item} style={{flex: 1, height: 58, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", color: index === activePhase ? colors.text : colors.muted, background: index === activePhase ? `${[colors.cyan, colors.blue, colors.amber, colors.green][index]}28` : "rgba(10, 28, 43, .7)", border: `1px solid ${index === activePhase ? [colors.cyan, colors.blue, colors.amber, colors.green][index] : colors.border}`}}>{item}</div>
        ))}
      </div>
    </Background>
  );
};

export const ReusableWorkflow = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const output = ease((t - 2.35) / 1.2);
  const repeat = ease((t - 4.2) / 1.1);

  return (
    <Background kicker="03 / REUSABLE WORKFLOW" title="只替换内容，逻辑继续复用">
      <Panel style={{left: 84, top: 246, width: 414, height: 560}} accent={colors.blue}>
        <div style={{padding: "30px 30px 20px", color: colors.muted, fontFamily: mono, fontSize: 16, letterSpacing: 3}}>INPUT / CONTENT</div>
        <div style={{position: "absolute", left: 30, right: 30, top: 114, opacity: 1 - repeat * 0.3}}>
          <div style={{color: colors.text, fontSize: 30, fontWeight: 800, marginBottom: 28}}>心理学名词</div>
          {[
            ["西西弗斯", colors.cyan],
            ["回避型依恋", colors.purple],
            ["存在主义", colors.amber],
          ].map(([title, color]) => <Card key={title} title={title} color={color} style={{marginBottom: 14}} />)}
        </div>
        <div style={{position: "absolute", left: 30, right: 30, top: 114, opacity: repeat, transform: `translateY(${(1 - repeat) * 24}px)`}}>
          <div style={{color: colors.text, fontSize: 30, fontWeight: 800, marginBottom: 28}}>新一组内容</div>
          {["图书封面", "MBTI 类型", "工具清单"].map((title, index) => <Card key={title} title={title} color={[colors.green, colors.red, colors.blue][index]} style={{marginBottom: 14}} />)}
        </div>
        <div style={{position: "absolute", left: 30, bottom: 26, color: colors.muted, fontSize: 18}}>文字 / 图片，任选其一</div>
      </Panel>

      <Arrow left={510} top={526} width={138} color={colors.cyan} />

      <Panel style={{left: 666, top: 216, width: 508, height: 620}} accent={colors.cyan}>
        <div style={{padding: "30px 32px 0", display: "flex", justifyContent: "space-between", alignItems: "center"}}>
          <div style={{color: colors.muted, fontFamily: mono, fontSize: 16, letterSpacing: 3}}>FIXED TEMPLATE</div>
          <Tag color={colors.green}>REUSABLE</Tag>
        </div>
        <div style={{position: "absolute", left: 42, right: 42, top: 128, height: 330, borderRadius: 20, padding: 22, background: "linear-gradient(145deg, rgba(67,216,255,.18), rgba(4,14,24,.92))", border: `1px solid ${colors.cyan}88`}}>
          <div style={{color: colors.cyan, fontFamily: mono, fontSize: 16, letterSpacing: 3}}>CONTACT WHEEL</div>
          <div style={{marginTop: 22, height: 154, borderRadius: 16, overflow: "hidden", background: "#02070b", border: "1px solid rgba(137,177,204,.3)"}}>
            {[0, 1, 2, 3].map((index) => <div key={index} style={{height: 38, margin: 8, borderRadius: 8, background: `${[colors.cyan, colors.purple, colors.amber, colors.green][index]}${index === 0 ? "66" : "28"}`, transform: `translateY(${Math.sin((frame + index * 20) / 12) * 3}px)`}} />)}
          </div>
          <div style={{marginTop: 22, display: "flex", gap: 10}}>{["轮数", "速度", "音效", "停留"].map((x) => <span key={x} style={{flex: 1, padding: "8px 4px", borderRadius: 8, textAlign: "center", color: colors.muted, background: "rgba(255,255,255,.06)", fontSize: 15}}>{x}</span>)}</div>
        </div>
        <div style={{position: "absolute", left: 42, right: 42, bottom: 42, color: colors.text, fontSize: 24, fontWeight: 750}}>内容换了，规则不重做</div>
      </Panel>

      <Arrow left={1232} top={526} width={116} color={colors.amber} />

      <Panel style={{left: 1384, top: 246, width: 452, height: 560}} accent={colors.amber}>
        <div style={{padding: "30px 30px 20px", color: colors.muted, fontFamily: mono, fontSize: 16, letterSpacing: 3}}>OUTPUT / VIDEO OPENING</div>
        <div style={{position: "absolute", left: 40, right: 40, top: 124, height: 292, borderRadius: 20, overflow: "hidden", background: "#02070b", border: `1px solid ${colors.amber}88`}}>
          {[0, 1, 2, 3].map((index) => <div key={index} style={{position: "absolute", left: 46, right: 46, top: 44 + index * 54, height: 46, borderRadius: 10, background: `${[colors.cyan, colors.purple, colors.amber, colors.green][index]}66`, transform: `translateY(${-(output * 18) + Math.sin((frame + index * 15) / 10) * 3}px)`}} />)}
          <div style={{position: "absolute", inset: 0, background: "linear-gradient(180deg, #02070b, transparent 28%, transparent 70%, #02070b)"}} />
        </div>
        <div style={{position: "absolute", left: 30, right: 30, bottom: 42, display: "flex", alignItems: "center", justifyContent: "space-between"}}>
          <span style={{color: colors.green, fontFamily: mono, fontSize: 16, letterSpacing: 2}}>GENERATED</span>
          <span style={{color: colors.text, fontSize: 25, fontWeight: 800}}>新视频开头</span>
        </div>
      </Panel>

      <div style={{position: "absolute", left: 84, right: 84, bottom: 150, display: "flex", alignItems: "center", justifyContent: "center", gap: 16}}>
        <Tag color={colors.cyan}>输入可变</Tag>
        <div style={{width: 120, height: 2, background: `linear-gradient(90deg, ${colors.cyan}, ${colors.amber})`}} />
        <Tag color={colors.amber}>模板固定</Tag>
        <div style={{width: 120, height: 2, background: `linear-gradient(90deg, ${colors.amber}, ${colors.green})`}} />
        <Tag color={colors.green}>结果复用</Tag>
      </div>
    </Background>
  );
};

const AppScene = ({
  index,
  title,
  subtitle,
  accent,
  children,
}: {
  index: number;
  title: string;
  subtitle: string;
  accent: string;
  children: ReactNode;
}) => {
  const frame = useCurrentFrame();
  const start = index * 45;
  const local = frame - start;
  const opacity = interpolate(local, [0, 10, 36, 45], [0, 1, 1, 0], {...clamp});
  const shift = interpolate(local, [0, 16], [80, 0], {...clamp});
  return (
    <div style={{position: "absolute", inset: 0, opacity, transform: `translateX(${shift}px)`}}>
      <div style={{position: "absolute", left: 112, top: 260, width: 570}}>
        <div style={{color: accent, fontFamily: mono, fontSize: 18, letterSpacing: 4}}>APPLICATION / 0{index + 1}</div>
        <div style={{marginTop: 26, color: colors.text, fontSize: 78, lineHeight: 1.05, fontWeight: 850}}>{title}</div>
        <div style={{marginTop: 28, color: colors.muted, fontSize: 28, lineHeight: 1.55}}>{subtitle}</div>
      </div>
      <div style={{position: "absolute", left: 830, top: 180, width: 920, height: 650}}>{children}</div>
    </div>
  );
};

export const ApplicationMontage = () => {
  const frame = useCurrentFrame();
  return (
    <Background kicker="04 / APPLICATIONS" title="同一个模板，可以换很多内容">
      <AppScene index={0} title="心理学名词" subtitle="用象征性图片和概念名称，快速生成系列化片头。" accent={colors.cyan}>
        <Panel style={{left: 0, top: 0, width: 730, height: 590}} accent={colors.cyan}>
          <Img src={staticFile("assets/sisyphus.png")} style={{width: "100%", height: "100%", objectFit: "cover", opacity: 0.9}} />
          <div style={{position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 38%, rgba(2,7,11,.94))"}} />
          <div style={{position: "absolute", left: 36, bottom: 34, color: colors.text, fontSize: 38, fontWeight: 800}}>西西弗斯</div>
        </Panel>
      </AppScene>
      <AppScene index={1} title="MBTI" subtitle="十六种人格类型，可以直接替换文本内容。" accent={colors.purple}>
        <Panel style={{left: 0, top: 0, width: 730, height: 590}} accent={colors.purple}>
          <div style={{padding: 34, color: colors.muted, fontFamily: mono, fontSize: 17, letterSpacing: 3}}>16 PERSONALITIES</div>
          <div style={{padding: "34px 40px", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16}}>
            {["INTJ", "ENFP", "INFP", "ENTP", "INFJ", "ISTP", "ISFP", "ENTJ"].map((x, i) => <div key={x} style={{height: 92, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", color: colors.text, fontFamily: mono, fontSize: 25, fontWeight: 800, background: `${[colors.purple, colors.cyan, colors.amber, colors.green][i % 4]}32`, border: `1px solid ${[colors.purple, colors.cyan, colors.amber, colors.green][i % 4]}88`}}>{x}</div>)}
          </div>
          <div style={{position: "absolute", left: 40, right: 40, bottom: 30, color: colors.purple, fontFamily: mono, fontSize: 17, letterSpacing: 3}}>TEXT INPUT / REUSABLE</div>
        </Panel>
      </AppScene>
      <AppScene index={2} title="图书封面" subtitle="书单、作者、主题封面，也可以变成连续轮转的开头。" accent={colors.amber}>
        <Panel style={{left: 0, top: 0, width: 730, height: 590}} accent={colors.amber}>
          <div style={{padding: "38px 40px 10px", color: colors.muted, fontFamily: mono, fontSize: 17, letterSpacing: 3}}>BOOK COVER LIST</div>
          <div style={{display: "flex", gap: 18, padding: "36px 40px"}}>
            {["系统之美", "长期主义", "思考的边界"].map((x, i) => <div key={x} style={{width: 198, height: 334, borderRadius: 12, padding: 20, display: "flex", alignItems: "flex-end", background: `linear-gradient(150deg, ${[colors.amber, colors.red, colors.blue][i]}bb, #07121d 72%)`, border: `1px solid ${[colors.amber, colors.red, colors.blue][i]}aa`, color: colors.text, fontSize: 24, fontWeight: 800}}>{x}</div>)}
          </div>
        </Panel>
      </AppScene>
      <AppScene index={3} title="工具清单" subtitle="只要内容结构稳定，工具、插件和资源都能复用这个模板。" accent={colors.green}>
        <Panel style={{left: 0, top: 0, width: 730, height: 590}} accent={colors.green}>
          <div style={{padding: "34px 40px", color: colors.muted, fontFamily: mono, fontSize: 17, letterSpacing: 3}}>TOOL LIST / CONTENT PIPELINE</div>
          <div style={{padding: "18px 40px", display: "grid", gap: 18}}>
            {["视频剪辑", "动画制作", "旁白生成", "音效与素材"].map((x, i) => <div key={x} style={{height: 78, borderRadius: 14, padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", background: `${[colors.cyan, colors.purple, colors.amber, colors.green][i]}26`, border: `1px solid ${[colors.cyan, colors.purple, colors.amber, colors.green][i]}77`, color: colors.text, fontSize: 28, fontWeight: 760}}><span>{x}</span><span style={{fontFamily: mono, color: [colors.cyan, colors.purple, colors.amber, colors.green][i], fontSize: 17}}>READY</span></div>)}
          </div>
        </Panel>
      </AppScene>
      <div style={{position: "absolute", left: 84, right: 84, bottom: 146, display: "flex", gap: 12}}>
        {[0, 1, 2, 3].map((index) => <div key={index} style={{height: 7, flex: 1, borderRadius: 99, background: index === Math.min(3, Math.floor(frame / 45)) ? [colors.cyan, colors.purple, colors.amber, colors.green][index] : "rgba(91,119,139,.4)"}} />)}
      </div>
    </Background>
  );
};

const psychologyWheelItems = [
  {title: "西西弗斯", src: "assets/wheel/01-西西弗斯.png", color: colors.cyan},
  {title: "弗洛伊德梦境理论", src: "assets/wheel/02-弗洛伊德梦境理论.png", color: colors.purple},
  {title: "虚无主义", src: "assets/wheel/03-虚无主义.png", color: colors.blue},
  {title: "悲观主义", src: "assets/wheel/04-悲观主义.png", color: colors.red},
  {title: "浪漫主义", src: "assets/wheel/05-浪漫主义.png", color: colors.amber},
  {title: "回避型依恋", src: "assets/wheel/06-回避型依恋.png", color: colors.cyan},
  {title: "存在主义", src: "assets/wheel/07-存在主义.png", color: colors.green},
];

export const PsychologyOpeningLandscape = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const seconds = frame / fps;
  const rollStart = 0.28;
  const rollEnd = 2.12;
  const normalized = Math.max(0, Math.min(1, (seconds - rollStart) / (rollEnd - rollStart)));
  const eased = ease(normalized);
  const totalSteps = psychologyWheelItems.length + psychologyWheelItems.length - 1;
  const scrollProgress = eased * totalSteps;
  const speed = Math.sin(Math.PI * normalized);
  const settled = seconds >= rollEnd;
  const activeIndex = Math.floor(scrollProgress + 0.5) % psychologyWheelItems.length;
  const activeItem = psychologyWheelItems[activeIndex];
  const cardStep = 314;

  return (
    <AbsoluteFill style={{background: "radial-gradient(circle at 50% 45%, #18384f 0%, #091824 46%, #050d15 100%)", color: colors.text, fontFamily: font, overflow: "hidden"}}>
      <div style={{position: "absolute", inset: 0, opacity: 0.2, backgroundImage: "linear-gradient(rgba(105,151,184,.14) 1px, transparent 1px), linear-gradient(90deg, rgba(105,151,184,.14) 1px, transparent 1px)", backgroundSize: "64px 64px"}} />
      <div style={{position: "absolute", left: 82, top: 62}}>
        <div style={{color: colors.muted, fontFamily: mono, fontSize: 17, letterSpacing: 4}}>CONTACT WHEEL / PSYCHOLOGY</div>
        <div style={{marginTop: 16, fontSize: 48, fontWeight: 850}}>心理学主题轮盘</div>
      </div>
      <div style={{position: "absolute", right: 84, top: 76, color: settled ? colors.green : colors.amber, fontFamily: mono, fontSize: 16, letterSpacing: 3}}>
        ● {settled ? "FINAL ITEM LOCKED" : "ROLLING"}
      </div>

      <Panel style={{left: 80, top: 270, width: 310, height: 420}} accent={colors.cyan}>
        <div style={{padding: "28px 28px 0", color: colors.muted, fontFamily: mono, fontSize: 15, letterSpacing: 3}}>VISUAL INPUT</div>
        <div style={{padding: "30px 28px", display: "grid", gap: 14}}>
          {["象征性图片", "主题名称", "连续轮转"].map((x, i) => <div key={x} style={{height: 62, borderRadius: 12, display: "flex", alignItems: "center", padding: "0 18px", color: colors.text, background: `${[colors.cyan, colors.purple, colors.amber][i]}25`, border: `1px solid ${[colors.cyan, colors.purple, colors.amber][i]}77`, fontSize: 20, fontWeight: 700}}>{x}</div>)}
        </div>
        <div style={{position: "absolute", left: 28, right: 28, bottom: 25, color: colors.muted, fontSize: 16}}>每张图片都是一张卡片</div>
      </Panel>
      <Arrow left={400} top={480} width={70} color={colors.cyan} />

      <Panel style={{left: 492, top: 142, width: 820, height: 780}} accent={activeItem.color}>
        <div style={{padding: "28px 32px 0", display: "flex", justifyContent: "space-between", alignItems: "center"}}>
          <div style={{color: colors.muted, fontFamily: mono, fontSize: 15, letterSpacing: 3}}>CONTINUOUS REEL / 01</div>
          <Tag color={speed > 0.72 ? colors.amber : activeItem.color}>{speed > 0.72 ? "ACCELERATING" : settled ? "LOCKED" : "ROLLING"}</Tag>
        </div>
        <div style={{position: "absolute", left: 42, right: 42, top: 94, bottom: 42, borderRadius: 22, overflow: "hidden", background: "#02070b", border: "1px solid rgba(137,177,204,.32)"}}>
          <div style={{position: "absolute", inset: 0, transform: `translateY(${-scrollProgress * cardStep}px)`, filter: `blur(${speed * 1.5}px)`}}>
            {Array.from({length: totalSteps + 2}, (_, virtualIndex) => {
              const item = psychologyWheelItems[virtualIndex % psychologyWheelItems.length];
              const distance = Math.abs(virtualIndex - scrollProgress);
              const opacity = 1 - Math.min(distance, 1.3) * 0.38;
              return (
                <div key={`${item.title}-${virtualIndex}`} style={{position: "absolute", left: 78, top: 188 + virtualIndex * cardStep, width: 620, height: 278, borderRadius: 18, overflow: "hidden", opacity, border: `2px solid ${item.color}99`, boxShadow: `0 20px 50px rgba(0,0,0,.48)`}}>
                  <Img src={staticFile(item.src)} style={{width: "100%", height: "100%", objectFit: "cover"}} />
                  <div style={{position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 34%, rgba(2,7,11,.92))"}} />
                  <div style={{position: "absolute", left: 28, right: 28, bottom: 24, color: colors.text, fontSize: 32, fontWeight: 850, textShadow: "0 2px 10px rgba(0,0,0,.8)"}}>{item.title}</div>
                </div>
              );
            })}
          </div>
          <div style={{position: "absolute", inset: 0, background: "linear-gradient(180deg, #02070b 0%, transparent 17%, transparent 82%, #02070b 100%)"}} />
          <div style={{position: "absolute", left: 54, right: 54, top: "50%", height: 3, background: colors.amber, boxShadow: `0 0 18px ${colors.amber}`}} />
        </div>
      </Panel>

      <Arrow left={1324} top={480} width={54} color={colors.amber} />
      <Panel style={{left: 1408, top: 270, width: 430, height: 420}} accent={activeItem.color}>
        <div style={{padding: "28px 28px 0", color: colors.muted, fontFamily: mono, fontSize: 15, letterSpacing: 3}}>CURRENT ITEM</div>
        <div style={{padding: "40px 28px 0", color: activeItem.color, fontFamily: mono, fontSize: 16, letterSpacing: 3}}>CONCEPT / {String(activeIndex + 1).padStart(2, "0")}</div>
        <div style={{padding: "20px 28px 0", fontSize: activeItem.title.length > 8 ? 36 : 48, lineHeight: 1.25, fontWeight: 850}}>{activeItem.title}</div>
        <div style={{position: "absolute", left: 28, right: 28, bottom: 72, height: 8, borderRadius: 99, background: "rgba(91,119,139,.3)"}}>
          <div style={{height: "100%", width: `${Math.max(8, eased * 100)}%`, borderRadius: 99, background: activeItem.color, boxShadow: `0 0 18px ${activeItem.color}`}} />
        </div>
        <div style={{position: "absolute", left: 28, right: 28, bottom: 28, display: "flex", justifyContent: "space-between", color: settled ? colors.green : colors.muted, fontFamily: mono, fontSize: 15, letterSpacing: 2}}><span>{settled ? "LOCKED" : "SEARCHING"}</span><span>{settled ? "STOP" : `${Math.round(speed * 100)}%`}</span></div>
      </Panel>

      <div style={{position: "absolute", left: 80, right: 80, bottom: 126, display: "flex", gap: 12}}>
        {psychologyWheelItems.map((item, index) => <div key={item.title} style={{height: 7, flex: index === activeIndex ? 2 : 1, borderRadius: 99, background: index === activeIndex ? item.color : "rgba(91,119,139,.4)", boxShadow: index === activeIndex ? `0 0 16px ${item.color}` : "none"}} />)}
      </div>
      {[0.4, 0.68, 0.94, 1.18, 1.42, 1.7, 2.02].map((at, index) => <Sequence key={at} from={Math.round(at * fps)} durationInFrames={3}><Audio src={staticFile(index === 6 ? "sfx/stop-lock.wav" : "sfx/gear-tick.wav")} volume={0.75} /></Sequence>)}
    </AbsoluteFill>
  );
};
