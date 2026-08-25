import type {CSSProperties, ReactNode} from "react";
import {Video} from "@remotion/media";
import {
  AbsoluteFill,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {theme} from "../theme";

type NarrativeSceneProps = {
  sceneId: string;
  sourceFile: string;
  sourceStart: number;
};

const clamp = {extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const};

const localAsset = (filename: string) => `http://127.0.0.1:8765/${encodeURIComponent(filename)}`;

const assetSources: Record<string, string> = {
  "workbench-create.mov": localAsset("首先开始创作工作台。.mov"),
  "cloudflare-deploy.mov": localAsset("帮我用Cloudflare部署工作台。.mov"),
  "workbench-desktop.mov": localAsset("电脑版工作台示例。.mov"),
  "workbench-mobile.mov": localAsset("手机版工作台示例。.mov"),
  "save-to-home.jpg": localAsset("保存到手机.jpg"),
  "deployed-link.png": localAsset("会给你一个链接截图展示.png"),
};

const resolveAsset = (assetId: string) => assetSources[assetId] ?? staticFile(assetId);

const reveal = (frame: number, delay = 0, length = 18) =>
  interpolate(frame, [delay, delay + length], [0, 1], clamp);

const lift = (frame: number, delay = 0, length = 18) => {
  const progress = reveal(frame, delay, length);
  return `translateY(${(1 - progress) * 28}px)`;
};

const SceneRoot = ({
  children,
  transparent = false,
}: {
  children: ReactNode;
  transparent?: boolean;
}) => (
  <AbsoluteFill
    style={{
      color: theme.text,
      fontFamily: theme.bodyFont,
      background: transparent
        ? "linear-gradient(90deg, rgba(3, 8, 13, .64), rgba(3, 8, 13, .16) 58%, rgba(3, 8, 13, .52))"
        : "linear-gradient(135deg, #07121d 0%, #0b1c2b 52%, #07121d 100%)",
      overflow: "hidden",
    }}
  >
    <div
      style={{
        position: "absolute",
        inset: 0,
        opacity: transparent ? 0.26 : 0.6,
        background:
          "radial-gradient(circle at 78% 18%, rgba(50, 174, 255, .24), transparent 28%), radial-gradient(circle at 18% 86%, rgba(66, 223, 134, .12), transparent 24%)",
      }}
    />
    <div
      style={{
        position: "absolute",
        left: "6%",
        right: "6%",
        top: "18%",
        height: 1,
        background: "linear-gradient(90deg, transparent, rgba(127, 199, 255, .35), transparent)",
        opacity: 0.55,
      }}
    />
    {children}
  </AbsoluteFill>
);

const ChapterTag = ({children, color = theme.accent}: {children: ReactNode; color?: string}) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 12,
      color,
      fontFamily: theme.monoFont,
      fontSize: 17,
      fontWeight: 800,
      letterSpacing: 3,
      textTransform: "uppercase",
    }}
  >
    <span style={{width: 38, height: 4, background: color}} />
    {children}
  </div>
);

const BigTitle = ({
  children,
  frame,
  delay = 0,
  color = theme.text,
  size = 118,
  style,
}: {
  children: ReactNode;
  frame: number;
  delay?: number;
  color?: string;
  size?: number;
  style?: CSSProperties;
}) => (
  <div
    style={{
      opacity: reveal(frame, delay),
      transform: lift(frame, delay),
      color,
      fontFamily: theme.displayFont,
      fontSize: size,
      fontWeight: 900,
      letterSpacing: -5,
      lineHeight: 0.96,
      textShadow: "0 8px 32px rgba(0, 0, 0, .35)",
      ...style,
    }}
  >
    {children}
  </div>
);

const FineText = ({
  children,
  frame,
  delay = 12,
  color = theme.mutedText,
  style,
}: {
  children: ReactNode;
  frame: number;
  delay?: number;
  color?: string;
  style?: CSSProperties;
}) => (
  <div
    style={{
      opacity: reveal(frame, delay),
      transform: lift(frame, delay),
      color,
      fontSize: 30,
      fontWeight: 600,
      lineHeight: 1.35,
      ...style,
    }}
  >
    {children}
  </div>
);

const FacePip = ({sourceFile, sourceStart, side = "right"}: {sourceFile: string; sourceStart: number; side?: "left" | "right"}) => {
  const {fps, height, width} = useVideoConfig();
  const portrait = height > width;
  return (
    <div
      style={{
        position: "absolute",
        right: side === "right" ? (portrait ? "8%" : "7%") : undefined,
        left: side === "left" ? (portrait ? "8%" : "7%") : undefined,
        bottom: portrait ? "18%" : "10%",
        width: portrait ? 210 : 190,
        height: portrait ? 210 : 190,
        borderRadius: "50%",
        overflow: "hidden",
        border: `6px solid ${theme.accent}`,
        boxShadow: "0 14px 36px rgba(0, 0, 0, .42)",
        zIndex: 8,
      }}
    >
      <Video
        src={sourceFile.startsWith("http://") || sourceFile.startsWith("https://") ? sourceFile : staticFile(sourceFile)}
        trimBefore={Math.round(sourceStart * fps)}
        muted
        objectFit="cover"
        style={{width: "100%", height: "100%"}}
      />
    </div>
  );
};

const MediaFrame = ({
  assetId,
  frame,
  delay = 8,
  width = "48%",
  height = "58%",
  left = "44%",
  top = "24%",
  radius = 26,
  objectFit = "cover",
  label,
  portraitMode = false,
  mediaScale = 1,
}: {
  assetId: string;
  frame: number;
  delay?: number;
  width?: string | number;
  height?: string | number;
  left?: string | number;
  top?: string | number;
  radius?: number;
  objectFit?: "cover" | "contain";
  label?: string;
  portraitMode?: boolean;
  mediaScale?: number;
}) => {
  const isVideo = /\.(mov|mp4|webm)$/i.test(assetId);
  const commonStyle: CSSProperties = {
    width: "100%",
    height: "100%",
    objectFit,
    borderRadius: radius,
    backgroundColor: "rgba(4, 17, 31, .82)",
    transform: `scale(${mediaScale})`,
    transformOrigin: "center center",
  };
  return (
    <div
      style={{
        position: "absolute",
        left,
        top,
        width,
        height,
        opacity: reveal(frame, delay),
        transform: lift(frame, delay),
        zIndex: 3,
        overflow: "hidden",
        borderRadius: radius,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          border: `2px solid ${portraitMode ? theme.warning : theme.accent}`,
          borderRadius: radius,
          opacity: 0.72,
          zIndex: 4,
          pointerEvents: "none",
        }}
      />
      {isVideo ? (
        <Video src={resolveAsset(assetId)} muted loop objectFit={objectFit} style={commonStyle} />
      ) : (
        <Img src={resolveAsset(assetId)} style={commonStyle} />
      )}
      {label ? (
        <div
          style={{
            position: "absolute",
            left: 18,
            bottom: 16,
            color: "white",
            fontFamily: theme.monoFont,
            fontSize: 14,
            letterSpacing: 2,
            textShadow: "0 2px 12px rgba(0, 0, 0, .8)",
          }}
        >
          {label}
        </div>
      ) : null}
    </div>
  );
};

const Arrow = ({frame, delay = 14, color = theme.accent}: {frame: number; delay?: number; color?: string}) => (
  <div
    style={{
      opacity: reveal(frame, delay),
      transform: `scaleX(${reveal(frame, delay)})`,
      transformOrigin: "left center",
      height: 4,
      flex: 1,
      background: color,
      position: "relative",
    }}
  >
    <span
      style={{
        position: "absolute",
        right: -2,
        top: -7,
        width: 18,
        height: 18,
        borderTop: `4px solid ${color}`,
        borderRight: `4px solid ${color}`,
        transform: "rotate(45deg)",
      }}
    />
  </div>
);

const Node = ({children, frame, delay = 0, color = theme.accent}: {children: ReactNode; frame: number; delay?: number; color?: string}) => (
  <div
    style={{
      opacity: reveal(frame, delay),
      transform: lift(frame, delay),
      minWidth: 230,
      padding: "22px 24px",
      borderBottom: `4px solid ${color}`,
      background: "rgba(4, 17, 31, .74)",
      color: theme.text,
      fontSize: 30,
      fontWeight: 800,
      textAlign: "center",
      boxShadow: "0 16px 40px rgba(0, 0, 0, .2)",
    }}
  >
    {children}
  </div>
);

const StatusPill = ({
  children,
  frame,
  delay = 0,
  color = theme.accent,
}: {
  children: ReactNode;
  frame: number;
  delay?: number;
  color?: string;
}) => (
  <div
    style={{
      opacity: reveal(frame, delay),
      transform: lift(frame, delay, 14),
      display: "inline-flex",
      alignItems: "center",
      gap: 12,
      padding: "13px 20px",
      border: `1px solid ${color}`,
      borderRadius: 999,
      color,
      background: "rgba(4, 17, 31, .72)",
      fontFamily: theme.monoFont,
      fontSize: 16,
      fontWeight: 800,
      letterSpacing: 1.4,
      whiteSpace: "nowrap",
    }}
  >
    <span style={{width: 9, height: 9, borderRadius: "50%", background: color, boxShadow: `0 0 18px ${color}`}} />
    {children}
  </div>
);

const ExpiryClock = ({frame}: {frame: number}) => {
  const rotation = interpolate(frame, [14, 148], [-90, 270], clamp);
  const expired = reveal(frame, 122, 12);
  return (
    <div style={{position: "absolute", right: "8%", top: "21%", width: 430, height: 430, opacity: reveal(frame, 8), transform: `scale(${0.9 + reveal(frame, 8) * 0.1})`}}>
      <div style={{position: "absolute", inset: 0, borderRadius: "50%", border: `3px solid ${theme.border}`, boxShadow: "inset 0 0 70px rgba(50,174,255,.08), 0 24px 80px rgba(0,0,0,.24)"}} />
      {Array.from({length: 12}).map((_, index) => (
        <div key={index} style={{position: "absolute", left: "50%", top: "50%", width: 4, height: 18, background: index <= Math.floor(reveal(frame, 18, 120) * 11) ? theme.danger : "rgba(255,255,255,.18)", transformOrigin: "2px -184px", transform: `translate(-2px, 184px) rotate(${index * 30}deg)`}} />
      ))}
      <div style={{position: "absolute", left: "50%", top: "50%", width: 150, height: 4, background: theme.danger, transformOrigin: "0 50%", transform: `rotate(${rotation}deg)`, boxShadow: `0 0 18px ${theme.danger}`}} />
      <div style={{position: "absolute", left: "50%", top: "50%", width: 18, height: 18, marginLeft: -9, marginTop: -9, borderRadius: "50%", background: theme.danger}} />
      <div style={{position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", paddingTop: 18}}>
        <div style={{fontFamily: theme.displayFont, fontSize: 100, fontWeight: 900, color: theme.text}}>12H</div>
        <div style={{fontFamily: theme.monoFont, fontSize: 15, letterSpacing: 2.4, color: theme.mutedText}}>VALID WINDOW</div>
      </div>
      <div style={{position: "absolute", left: 28, right: 28, bottom: -82, padding: "18px 22px", borderLeft: `4px solid ${expired > 0.5 ? theme.danger : theme.accent}`, background: "rgba(4,17,31,.8)", opacity: reveal(frame, 52)}}>
        <div style={{fontFamily: theme.monoFont, color: theme.mutedText, fontSize: 14}}>workspace-temp.pages.dev</div>
        <div style={{marginTop: 6, color: expired > 0.5 ? theme.danger : theme.accent, fontWeight: 900, fontSize: 22}}>{expired > 0.5 ? "LINK EXPIRED" : "TEMPORARY LINK"}</div>
      </div>
    </div>
  );
};

const ServerGlyph = ({frame}: {frame: number}) => (
  <div style={{position: "absolute", right: "8%", top: "19%", width: 360, height: 255, opacity: reveal(frame, 12)}}>
    <div style={{position: "absolute", inset: "34px 42px 32px", border: `2px solid ${theme.warning}`, borderRadius: 32, background: "rgba(4,17,31,.62)", boxShadow: `0 0 70px rgba(255,195,77,${0.05 + reveal(frame, 74) * 0.12})`}}>
      {[0, 1, 2].map((index) => (
        <div key={index} style={{height: 38, margin: "18px 24px 0", border: `1px solid ${theme.border}`, borderRadius: 8, opacity: reveal(frame, 20 + index * 10), transform: `translateX(${(1 - reveal(frame, 20 + index * 10)) * 32}px)`, display: "flex", alignItems: "center", padding: "0 14px", gap: 10}}>
          <span style={{width: 8, height: 8, borderRadius: "50%", background: index < Math.floor(reveal(frame, 52, 36) * 3) ? theme.success : theme.warning}} />
          <span style={{height: 5, flex: 1, background: "rgba(255,255,255,.16)", borderRadius: 9}} />
        </div>
      ))}
    </div>
    <div style={{position: "absolute", left: 0, right: 0, bottom: 0, textAlign: "center", fontFamily: theme.monoFont, fontSize: 14, letterSpacing: 2, color: theme.warning}}>FREE CLOUD SERVER · READY</div>
  </div>
);

const StageChecklist = ({frame}: {frame: number}) => (
  <div style={{position: "absolute", right: "8%", top: "25%", width: 420}}>
    {["创建工作台", "部署上线", "长期使用"].map((item, index) => {
      const progress = reveal(frame, 18 + index * 16, 12);
      const active = index === 2;
      return (
        <div key={item} style={{display: "flex", alignItems: "center", gap: 18, marginBottom: 22, opacity: progress, transform: `translateX(${(1 - progress) * 42}px)`, padding: "17px 20px", borderLeft: `4px solid ${active ? theme.success : theme.accent}`, background: active ? "rgba(66,223,134,.1)" : "rgba(4,17,31,.56)"}}>
          <div style={{width: 34, height: 34, borderRadius: "50%", display: "grid", placeItems: "center", border: `2px solid ${active ? theme.success : theme.accent}`, color: active ? theme.success : theme.accent, fontWeight: 900}}>✓</div>
          <div style={{fontSize: 28, fontWeight: 850, color: active ? theme.success : theme.text}}>{item}</div>
          <div style={{marginLeft: "auto", fontFamily: theme.monoFont, color: active ? theme.success : theme.mutedText, fontSize: 14}}>{active ? "REAL VALUE" : "DONE"}</div>
        </div>
      );
    })}
  </div>
);

const HookScene = ({frame}: {frame: number}) => (
  <SceneRoot transparent>
    <div style={{position: "absolute", left: "7%", top: "16%", width: "66%"}}>
      <ChapterTag>THE PROBLEM · 临时链接</ChapterTag>
      <BigTitle frame={frame} delay={6} size={108}>自己能打开</BigTitle>
      <BigTitle frame={frame} delay={14} size={108} color={theme.danger}>不等于长期可用</BigTitle>
      <FineText frame={frame} delay={26}>你的 AI 工作台，过一段时间就打不开了？</FineText>
    </div>
  </SceneRoot>
);

const ProblemScene = ({frame}: {frame: number}) => (
  <SceneRoot>
    <div style={{position: "absolute", left: "8%", top: "18%", width: "48%"}}>
      <ChapterTag color={theme.danger}>TEMPORARY LINK · 临时链接</ChapterTag>
      <div style={{display: "flex", alignItems: "baseline", gap: 22, marginTop: 30}}>
        <BigTitle frame={frame} delay={6} size={190} color={theme.danger}>TEMP</BigTitle>
        <BigTitle frame={frame} delay={12} size={90}>LINK</BigTitle>
      </div>
      <FineText frame={frame} delay={28} color={theme.text}>之前的方法只能生成一个临时地址。</FineText>
    </div>
    <div style={{position: "absolute", left: "8%", right: "8%", bottom: "21%", height: 8, background: "rgba(255,255,255,.16)"}}>
      <div style={{width: `${Math.min(100, 24 + reveal(frame, 18) * 76)}%`, height: "100%", background: theme.danger}} />
    </div>
    <div style={{position: "absolute", left: "8%", bottom: "14%", color: theme.mutedText, fontFamily: theme.monoFont, fontSize: 16, letterSpacing: 2}}>TEMPORARY LINK</div>
    <ExpiryClock frame={frame} />
  </SceneRoot>
);

const PromiseScene = ({frame}: {frame: number}) => (
  <SceneRoot>
    <div style={{position: "absolute", left: "8%", top: "16%", width: "84%"}}>
      <ChapterTag color={theme.success}>THE PROMISE · 长期可用</ChapterTag>
      <div style={{display: "flex", alignItems: "center", gap: 28, marginTop: 44}}>
        <div style={{opacity: reveal(frame, 6), transform: lift(frame, 6), color: theme.danger, fontFamily: theme.displayFont, fontSize: 130, fontWeight: 900, textDecoration: "line-through"}}>12H</div>
        <Arrow frame={frame} delay={16} color={theme.success} />
        <BigTitle frame={frame} delay={22} size={112} color={theme.success}>长期可用</BigTitle>
      </div>
      <FineText frame={frame} delay={34} color={theme.text}>把一次性的临时地址，变成可以一直打开的在线工具。</FineText>
    </div>
    <div style={{position: "absolute", left: "12%", right: "12%", bottom: "16%", display: "flex", alignItems: "center", gap: 20}}>
      <StatusPill frame={frame} delay={30} color={theme.danger}>TEMP · 12 HOURS</StatusPill>
      <Arrow frame={frame} delay={42} color={theme.success} />
      <StatusPill frame={frame} delay={54} color={theme.success}>PERMANENT · 24/7</StatusPill>
      <div style={{opacity: reveal(frame, 70), color: theme.success, fontFamily: theme.displayFont, fontSize: 82, fontWeight: 900, lineHeight: 1}}>∞</div>
    </div>
  </SceneRoot>
);

const ProofScene = ({frame, sourceFile, sourceStart}: {frame: number; sourceFile: string; sourceStart: number}) => {
  const {height, width} = useVideoConfig();
  const portrait = height > width;
  return (
    <SceneRoot>
      <div style={{position: "absolute", left: portrait ? "8%" : "7%", top: portrait ? "9%" : "12%", width: portrait ? "84%" : "36%"}}>
        <ChapterTag>THE RESULT · 先看效果</ChapterTag>
        <BigTitle frame={frame} delay={8} size={portrait ? 82 : 72} style={{whiteSpace: "nowrap"}}>电脑、手机都能打开</BigTitle>
        <FineText frame={frame} delay={20} color={theme.success}>还可以保存到手机桌面，像 APP 一样使用。</FineText>
      </div>
      <MediaFrame assetId="workbench-desktop.mov" frame={frame} delay={10} width={portrait ? "88%" : "48%"} height={portrait ? "27%" : "53%"} left={portrait ? "6%" : "43%"} top={portrait ? "40%" : "22%"} label="DESKTOP · ONLINE" />
      <MediaFrame assetId="workbench-mobile.mov" frame={frame} delay={24} width={portrait ? "36%" : "18%"} height={portrait ? "32%" : "48%"} left={portrait ? "32%" : "72%"} top={portrait ? "68%" : "30%"} label="MOBILE" portraitMode mediaScale={1.35} />
      <FacePip sourceFile={sourceFile} sourceStart={sourceStart} side="left" />
    </SceneRoot>
  );
};

const StepOneScene = ({frame}: {frame: number}) => (
  <SceneRoot>
    <div style={{position: "absolute", left: "7%", top: "15%", width: "34%"}}>
      <ChapterTag>STEP 01 · 先建立工作台</ChapterTag>
      <BigTitle frame={frame} delay={7} size={240} color={theme.accent}>01</BigTitle>
      <BigTitle frame={frame} delay={15} size={72}>新建一个工作目录</BigTitle>
      <FineText frame={frame} delay={28}>来到 WorkBuddy，点击个人工作台，再点击开始。</FineText>
    </div>
    <MediaFrame assetId="workbench-create.mov" frame={frame} delay={12} width="52%" height="62%" left="42%" top="19%" label="WORKBUDDY · CREATE WORKSPACE" />
  </SceneRoot>
);

const StepTwoScene = ({frame}: {frame: number}) => (
  <SceneRoot>
    <div style={{position: "absolute", left: "7%", top: "15%", width: "35%"}}>
      <ChapterTag color={theme.warning}>STEP 02 · 部署</ChapterTag>
      <BigTitle frame={frame} delay={7} size={230} color={theme.warning}>02</BigTitle>
      <BigTitle frame={frame} delay={15} size={76}>告诉 WorkBuddy</BigTitle>
      <FineText frame={frame} delay={29} color={theme.text}>帮我用 Cloudflare 部署这个工作台。</FineText>
    </div>
    <MediaFrame assetId="cloudflare-deploy.mov" frame={frame} delay={10} width="52%" height="58%" left="42%" top="20%" label="WORKBUDDY → CLOUDFLARE" />
  </SceneRoot>
);

const InstallBrowserScene = ({frame}: {frame: number}) => (
  <SceneRoot>
    <div style={{position: "absolute", left: "7%", top: "15%", width: "37%"}}>
      <ChapterTag color={theme.accent}>AUTO SETUP · 自动准备</ChapterTag>
      <BigTitle frame={frame} delay={6} size={124} color={theme.accent}>wrangler</BigTitle>
      <FineText frame={frame} delay={22} color={theme.text}>没有安装过？WorkBuddy 会自动下载部署工具。</FineText>
      <div style={{display: "flex", alignItems: "center", gap: 18, marginTop: 34}}>
        <Node frame={frame} delay={34} color={theme.accent}>自动下载</Node>
        <Arrow frame={frame} delay={45} color={theme.warning} />
        <Node frame={frame} delay={55} color={theme.warning}>浏览器授权</Node>
      </div>
    </div>
    <MediaFrame assetId="cloudflare-deploy.mov" frame={frame} delay={18} width="49%" height="58%" left="45%" top="21%" label="BROWSER · CLOUDFLARE LOGIN" />
  </SceneRoot>
);

const CloudflareScene = ({frame}: {frame: number}) => (
  <SceneRoot>
    <div style={{position: "absolute", left: "8%", top: "13%", width: "60%"}}>
      <ChapterTag>WHAT IS CLOUDFLARE · 它是什么</ChapterTag>
      <BigTitle frame={frame} delay={7} size={96}>免费的云端服务器</BigTitle>
      <FineText frame={frame} delay={20} color={theme.text}>它把你的工作台，从本地文件送到一个固定的访问地址。</FineText>
    </div>
    <ServerGlyph frame={frame} />
    <div style={{position: "absolute", left: "9%", right: "9%", top: "56%", display: "flex", alignItems: "center", gap: 22}}>
      <Node frame={frame} delay={26}>WorkBuddy</Node>
      <Arrow frame={frame} delay={34} />
      <Node frame={frame} delay={40} color={theme.warning}>Cloudflare</Node>
      <Arrow frame={frame} delay={48} color={theme.success} />
      <Node frame={frame} delay={54} color={theme.success}>固定链接</Node>
    </div>
  </SceneRoot>
);

const AuthorizeScene = ({frame}: {frame: number}) => (
  <SceneRoot>
    <div style={{position: "absolute", left: "8%", top: "13%", width: "84%", textAlign: "center"}}>
      <ChapterTag color={theme.warning}>ONE-TIME AUTHORIZATION · 授权一次</ChapterTag>
      <BigTitle frame={frame} delay={6} size={190} color={theme.warning}>1×</BigTitle>
      <FineText frame={frame} delay={23} color={theme.text}>登录并授权一次，之后每次部署都不需要重新登录。</FineText>
    </div>
    <div style={{position: "absolute", left: "9%", right: "9%", top: "60%", display: "flex", alignItems: "center", gap: 20}}>
      <Node frame={frame} delay={18} color={theme.warning}>登录</Node>
      <Arrow frame={frame} delay={28} color={theme.warning} />
      <Node frame={frame} delay={38} color={theme.success}>授权完成</Node>
      <Arrow frame={frame} delay={48} color={theme.success} />
      <Node frame={frame} delay={58} color={theme.success}>以后免登录</Node>
    </div>
    <div style={{position: "absolute", right: "8%", top: "15%"}}><StatusPill frame={frame} delay={52} color={theme.success}>ACCESS TOKEN · SAVED</StatusPill></div>
  </SceneRoot>
);

const UploadScene = ({frame}: {frame: number}) => {
  const {height, width} = useVideoConfig();
  const portrait = height > width;
  return (
    <SceneRoot>
      <div style={{position: "absolute", left: "8%", top: portrait ? "11%" : "16%", width: portrait ? "84%" : "40%"}}>
        <ChapterTag color={theme.success}>DEPLOYING · 等待上传</ChapterTag>
        <div style={{display: "flex", alignItems: "baseline", gap: 16, marginTop: 38}}>
          <BigTitle frame={frame} delay={7} size={portrait ? 176 : 220} color={theme.success}>20</BigTitle>
          <BigTitle frame={frame} delay={14} size={portrait ? 70 : 78}>SEC</BigTitle>
        </div>
        <FineText frame={frame} delay={26} color={theme.text}>AI 自动把工作台文件上传到云端。</FineText>
        <div style={{marginTop: 36, width: "100%", height: 10, background: "rgba(255,255,255,.16)"}}>
          <div style={{width: `${reveal(frame, 30) * 100}%`, height: "100%", background: theme.success}} />
        </div>
        <div style={{marginTop: 14, color: theme.mutedText, fontFamily: theme.monoFont, fontSize: 16, letterSpacing: 2}}>UPLOADING WORKSPACE FILES...</div>
      </div>
      <MediaFrame
        assetId="deployed-link.png"
        frame={frame}
        delay={28}
        width={portrait ? "84%" : "40%"}
        height={portrait ? "25%" : "46%"}
        left={portrait ? "8%" : "54%"}
        top={portrait ? "49%" : "23%"}
        label="DEPLOYMENT COMPLETE"
        objectFit="contain"
      />
    </SceneRoot>
  );
};

const PermanentScene = ({frame}: {frame: number}) => (
  <SceneRoot>
    <div style={{position: "absolute", left: "8%", top: "18%", width: "52%"}}>
      <ChapterTag color={theme.success}>DEPLOYMENT COMPLETE · 部署完成</ChapterTag>
      <BigTitle frame={frame} delay={7} size={114} color={theme.success}>永久链接</BigTitle>
      <BigTitle frame={frame} delay={18} size={80}>不再受 12 小时限制</BigTitle>
      <FineText frame={frame} delay={31} color={theme.text}>一次部署，之后随时打开。</FineText>
    </div>
    <div style={{position: "absolute", right: "10%", top: "17%", width: 420, height: 420, display: "grid", placeItems: "center", opacity: reveal(frame, 14), transform: `scale(${0.86 + reveal(frame, 14) * 0.14})`}}>
      <div style={{position: "absolute", inset: 20, borderRadius: "50%", border: `2px dashed ${theme.success}`, transform: `rotate(${interpolate(frame, [0, 112], [0, 120], clamp)}deg)`, boxShadow: "0 0 70px rgba(66,223,134,.12)"}} />
      <div style={{fontFamily: theme.displayFont, fontSize: 270, fontWeight: 900, color: theme.success, lineHeight: 1}}>∞</div>
      <div style={{position: "absolute", bottom: 30}}><StatusPill frame={frame} delay={38} color={theme.success}>LINK STATUS · PERMANENT</StatusPill></div>
    </div>
    <div style={{position: "absolute", left: "8%", right: "8%", bottom: "13%", display: "flex", alignItems: "center", gap: 18}}>
      <StatusPill frame={frame} delay={26} color={theme.danger}>12H · EXPIRED</StatusPill>
      <Arrow frame={frame} delay={36} color={theme.success} />
      <StatusPill frame={frame} delay={48} color={theme.success}>24/7 · AVAILABLE</StatusPill>
    </div>
  </SceneRoot>
);

const ExistingWorkspaceScene = ({frame}: {frame: number}) => {
  const {height, width} = useVideoConfig();
  const portrait = height > width;
  return (
    <SceneRoot>
      <div style={{position: "absolute", left: portrait ? "8%" : "7%", top: portrait ? "9%" : "14%", width: portrait ? "84%" : "36%"}}>
        <ChapterTag>ALREADY HAVE ONE · 已有工作台</ChapterTag>
        <BigTitle frame={frame} delay={7} size={portrait ? 86 : 88}>操作更简单</BigTitle>
        <FineText frame={frame} delay={20} color={theme.text}>把工作台文件放到一个文件夹，直接告诉 WorkBuddy。</FineText>
      </div>
      <div style={{position: "absolute", left: portrait ? "9%" : "7%", top: portrait ? "43%" : "55%", width: portrait ? "82%" : "34%"}}>
        {["工作台文件", "index.html", "assets/"].map((item, index) => (
          <div key={item} style={{display: "flex", gap: 16, alignItems: "center", marginTop: 18, opacity: reveal(frame, 30 + index * 8), transform: lift(frame, 30 + index * 8), color: index === 0 ? theme.warning : theme.mutedText, fontSize: index === 0 ? 30 : 23}}>
            <span style={{width: 14, height: 14, borderRadius: 3, background: index === 0 ? theme.warning : theme.accent}} />
            {item}
          </div>
        ))}
      </div>
      <MediaFrame assetId="cloudflare-deploy.mov" frame={frame} delay={16} width={portrait ? "84%" : "48%"} height={portrait ? "25%" : "52%"} left={portrait ? "8%" : "44%"} top={portrait ? "68%" : "25%"} label="ONE COMMAND" />
    </SceneRoot>
  );
};

const AddToHomeScene = ({frame}: {frame: number}) => {
  const {height, width} = useVideoConfig();
  const portrait = height > width;
  return (
    <SceneRoot>
      <div style={{position: "absolute", left: portrait ? "8%" : "7%", top: portrait ? "8%" : "13%", width: portrait ? "84%" : "38%"}}>
        <ChapterTag color={theme.warning}>SAVE TO HOME SCREEN · 手机桌面</ChapterTag>
        <BigTitle frame={frame} delay={7} size={portrait ? 86 : 90}>像 APP 一样使用</BigTitle>
        <FineText frame={frame} delay={20} color={theme.text}>打开链接，点击分享，再选择添加到手机桌面。</FineText>
      </div>
      <MediaFrame assetId="workbench-mobile.mov" frame={frame} delay={12} width={portrait ? "42%" : "24%"} height={portrait ? "39%" : "58%"} left={portrait ? "8%" : "49%"} top={portrait ? "42%" : "25%"} label="MOBILE WORKSPACE" portraitMode objectFit="cover" mediaScale={1.35} />
      <MediaFrame assetId="save-to-home.jpg" frame={frame} delay={30} width={portrait ? "42%" : "27%"} height={portrait ? "39%" : "58%"} left={portrait ? "50%" : "75%"} top={portrait ? "42%" : "25%"} label="ADD TO HOME" portraitMode objectFit="contain" />
    </SceneRoot>
  );
};

const ShareScene = ({frame, sourceFile, sourceStart}: {frame: number; sourceFile: string; sourceStart: number}) => {
  const {height, width} = useVideoConfig();
  const portrait = height > width;
  return (
    <SceneRoot>
      <div style={{position: "absolute", left: portrait ? "8%" : "7%", top: portrait ? "8%" : "12%", width: portrait ? "84%" : "38%"}}>
        <ChapterTag color={theme.success}>SHARE THE LINK · 分享给别人</ChapterTag>
        <BigTitle frame={frame} delay={7} size={portrait ? 82 : 88}>分享给其他人</BigTitle>
        <FineText frame={frame} delay={22} color={theme.text}>他们打开链接，就能用你的工作台。</FineText>
      </div>
      <MediaFrame assetId="deployed-link.png" frame={frame} delay={14} width={portrait ? "82%" : "37%"} height={portrait ? "25%" : "48%"} left={portrait ? "9%" : "50%"} top={portrait ? "45%" : "22%"} label="SHAREABLE LINK" objectFit="contain" />
      <div style={{position: "absolute", left: portrait ? "9%" : "50%", right: portrait ? "9%" : "10%", bottom: portrait ? "18%" : "14%", display: "flex", alignItems: "center", gap: 18}}>
        <Node frame={frame} delay={24} color={theme.accent}>你</Node>
        <Arrow frame={frame} delay={32} color={theme.success} />
        <Node frame={frame} delay={38} color={theme.success}>其他人</Node>
      </div>
      <FacePip sourceFile={sourceFile} sourceStart={sourceStart} side="left" />
    </SceneRoot>
  );
};

const OnlineToolScene = ({frame}: {frame: number}) => (
  <SceneRoot>
    <div style={{position: "absolute", left: "8%", top: "15%", width: "84%"}}>
      <ChapterTag color={theme.success}>FROM FILE TO TOOL · 在线工具</ChapterTag>
      <div style={{display: "flex", alignItems: "center", gap: 28, marginTop: 42}}>
        <BigTitle frame={frame} delay={6} size={116}>电脑文件</BigTitle>
        <Arrow frame={frame} delay={18} color={theme.success} />
        <BigTitle frame={frame} delay={25} size={116} color={theme.success}>在线工具</BigTitle>
      </div>
      <FineText frame={frame} delay={39} color={theme.text}>可以长期打开，也可以分享给别人使用。</FineText>
    </div>
    <div style={{position: "absolute", right: "8%", top: "49%", display: "flex", gap: 14}}>
      <StatusPill frame={frame} delay={28} color={theme.accent}>电脑打开</StatusPill>
      <StatusPill frame={frame} delay={38} color={theme.warning}>手机访问</StatusPill>
      <StatusPill frame={frame} delay={48} color={theme.success}>分享他人</StatusPill>
    </div>
    <div style={{position: "absolute", left: "9%", right: "9%", top: "64%", display: "flex", alignItems: "center", gap: 22}}>
      <Node frame={frame} delay={30} color={theme.accent}>本地文件</Node>
      <Arrow frame={frame} delay={40} color={theme.success} />
      <Node frame={frame} delay={48} color={theme.success}>固定链接</Node>
      <Arrow frame={frame} delay={56} color={theme.success} />
      <Node frame={frame} delay={64} color={theme.success}>在线工具</Node>
    </div>
  </SceneRoot>
);

const FinalThoughtScene = ({frame}: {frame: number}) => (
  <SceneRoot>
    <div style={{position: "absolute", left: "8%", top: "20%", width: "50%"}}>
      <ChapterTag color={theme.success}>FINAL THOUGHT · 真正做好</ChapterTag>
      <div style={{display: "flex", alignItems: "center", gap: 28, marginTop: 42}}>
        <BigTitle frame={frame} delay={6} size={170} color={theme.accent}>01</BigTitle>
        <Arrow frame={frame} delay={18} color={theme.success} />
        <BigTitle frame={frame} delay={25} size={94} color={theme.success}>长期使用</BigTitle>
      </div>
      <FineText frame={frame} delay={36} color={theme.text}>做出来只是第一步，能长期打开、拿来使用，才算真的做好了。</FineText>
    </div>
    <StageChecklist frame={frame} />
  </SceneRoot>
);

const ClosingCtaScene = ({frame}: {frame: number}) => {
  const {height, width} = useVideoConfig();
  const portrait = height > width;
  return (
    <SceneRoot transparent>
      <div style={{position: "absolute", left: portrait ? "8%" : "7%", top: portrait ? "20%" : "25%", width: portrait ? "84%" : "56%"}}>
        <ChapterTag color={theme.success}>COMMENT · 评论区</ChapterTag>
        <BigTitle frame={frame} delay={6} size={portrait ? 86 : 84}>让我看看</BigTitle>
        <BigTitle frame={frame} delay={18} size={portrait ? 86 : 78} color={theme.success}>你的专属工作台</BigTitle>
      </div>
    </SceneRoot>
  );
};

export const NarrativeScene = ({sceneId, sourceFile, sourceStart}: NarrativeSceneProps) => {
  const frame = useCurrentFrame();
  if (sceneId === "hook-expired-link") return <HookScene frame={frame} />;
  if (sceneId === "problem-12-hours") return <ProblemScene frame={frame} />;
  if (sceneId === "promise-long-term") return <PromiseScene frame={frame} />;
  if (sceneId === "proof-desktop-mobile") return <ProofScene frame={frame} sourceFile={sourceFile} sourceStart={sourceStart} />;
  if (sceneId === "step-one-workbuddy") return <StepOneScene frame={frame} />;
  if (sceneId === "step-two-cloudflare") return <StepTwoScene frame={frame} />;
  if (sceneId === "install-browser-auth") return <InstallBrowserScene frame={frame} />;
  if (sceneId === "cloudflare-explained") return <CloudflareScene frame={frame} />;
  if (sceneId === "authorize-once") return <AuthorizeScene frame={frame} />;
  if (sceneId === "upload-progress") return <UploadScene frame={frame} />;
  if (sceneId === "permanent-link") return <PermanentScene frame={frame} />;
  if (sceneId === "existing-workspace") return <ExistingWorkspaceScene frame={frame} />;
  if (sceneId === "add-to-home") return <AddToHomeScene frame={frame} />;
  if (sceneId === "share-link") return <ShareScene frame={frame} sourceFile={sourceFile} sourceStart={sourceStart} />;
  if (sceneId === "online-tool") return <OnlineToolScene frame={frame} />;
  if (sceneId === "final-thought") return <FinalThoughtScene frame={frame} />;
  return <ClosingCtaScene frame={frame} />;
};
