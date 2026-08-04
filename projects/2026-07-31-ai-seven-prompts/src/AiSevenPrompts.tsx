import type {CSSProperties, ReactNode} from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame,
} from "remotion";
import {theme} from "./theme";

export const TOTAL_FRAMES = 1700;

const editorialVisuals = {
  source: staticFile("visuals/source-check-editorial.png"),
  redTeam: staticFile("visuals/red-team-editorial.png"),
  veteran: staticFile("visuals/veteran-framework-editorial.png"),
  selfCorrection: staticFile("visuals/self-correction-editorial.png"),
};

const promptCopy = {
  source:
    "有事实依据的部分，请附上可核验的来源和链接。无法核验的内容请明确说明；如果只是推测，请直接标注“这是我的推测”。",
  plainLanguage:
    "假设对方对这个话题完全不了解。把专业术语改成日常语言，并将核心内容浓缩成三行。",
  vulnerabilities:
    "这个回答最可能受到哪三个质疑？请先判断这些质疑是否成立。成立就直接修改；不成立再说明理由。",
  conclusion:
    "先用一句话给出结论，再列出三个主要理由，最后说明适用条件和例外情况。",
  honesty:
    "不知道就明确说不知道。存在不确定性或推测时，请主动标注，不要补全或编造缺失的信息。",
  veteran:
    "请按照资深从业者的分析框架回答，给出具体案例、判断依据、适用条件和边界，不要只给抽象建议。",
  selfCorrection:
    "回答完成后，请重新检查其中的逻辑漏洞、事实错误和缺失条件。如果发现问题，请修正后重新给出完整版本。",
};

const ease = Easing.bezier(0.16, 1, 0.3, 1);
const clamp = (frame: number, input: number[], output: number[]) =>
  interpolate(frame, input, output, {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });

const enter = (frame: number, delay = 0, length = 16) =>
  clamp(frame, [delay, delay + length], [0, 1]);

// 场景之间采用直接切换，避免相邻 Sequence 的淡出/淡入同时变成纯背景。
const sceneOpacity = (frame: number, duration: number) => {
  void frame;
  void duration;
  return 1;
};

const glass: CSSProperties = {
  background:
    "linear-gradient(145deg, rgba(10,31,49,.94), rgba(4,17,31,.84))",
  border: `1px solid ${theme.border}`,
  borderRadius: 30,
  boxShadow: "0 28px 90px rgba(0,0,0,.34)",
};

const Background = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(circle at 18% 16%, rgba(50,174,255,.16), transparent 30%), radial-gradient(circle at 84% 72%, rgba(66,223,134,.09), transparent 28%), #07121d",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.22,
          backgroundImage:
            "linear-gradient(rgba(127,199,255,.12) 1px, transparent 1px), linear-gradient(90deg, rgba(127,199,255,.12) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          translate: `${-(frame % 72)}px ${-(frame % 72)}px`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: -180,
          top: 250,
          width: 460,
          height: 460,
          borderRadius: "50%",
          border: "1px solid rgba(50,174,255,.16)",
          boxShadow:
            "0 0 100px rgba(50,174,255,.08), inset 0 0 80px rgba(50,174,255,.05)",
          scale: 1 + Math.sin(frame / 42) * 0.04,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          height: 2,
          top: (frame * 6) % 1920,
          background:
            "linear-gradient(90deg, transparent, rgba(50,174,255,.26), transparent)",
          opacity: 0.55,
        }}
      />
    </AbsoluteFill>
  );
};

const Header = ({
  number,
  title,
  kicker,
  accent = theme.accent,
}: {
  number?: number;
  title: string;
  kicker: string;
  accent?: string;
}) => {
  const frame = useCurrentFrame();
  const p = enter(frame, 0, 18);
  return (
    <div
      style={{
        position: "absolute",
        left: 80,
        right: 80,
        top: 92,
        opacity: p,
        translate: `0 ${(1 - p) * 36}px`,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 18,
          color: accent,
          fontFamily: theme.monoFont,
          fontSize: 28,
          fontWeight: 700,
          letterSpacing: 4,
        }}
      >
        {number ? (
          <span
            style={{
              display: "grid",
              placeItems: "center",
              width: 54,
              height: 54,
              borderRadius: 18,
              background: accent,
              color: "#06111c",
              fontSize: 30,
              letterSpacing: 0,
            }}
          >
            {number}
          </span>
        ) : null}
        {kicker}
      </div>
      <div
        style={{
          marginTop: 24,
          fontFamily: theme.displayFont,
          color: theme.text,
          fontSize: 88,
          lineHeight: 1.04,
          fontWeight: 850,
          letterSpacing: -3,
        }}
      >
        {title}
      </div>
    </div>
  );
};

const VisualInsert = ({
  src,
  label,
  accent = theme.accent,
  style,
}: {
  src: string;
  label: string;
  accent?: string;
  style?: CSSProperties;
}) => {
  const frame = useCurrentFrame();
  const p = enter(frame, 18, 18);
  return (
    <div
      style={{
        ...glass,
        position: "absolute",
        overflow: "hidden",
        borderColor: accent,
        opacity: p,
        translate: `0 ${(1 - p) * 22}px`,
        ...style,
      }}
    >
      <Img
        src={src}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          filter: "saturate(.92) contrast(1.04)",
          scale: 1.04 + Math.sin(frame / 80) * 0.015,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(7,18,29,.02), rgba(7,18,29,.18) 56%, rgba(7,18,29,.82))",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 20,
          right: 20,
          bottom: 18,
          display: "flex",
          alignItems: "center",
          gap: 12,
          color: theme.text,
          fontFamily: theme.monoFont,
          fontSize: 22,
          letterSpacing: 2,
          fontWeight: 800,
        }}
      >
        <span
          style={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: accent,
            boxShadow: `0 0 18px ${accent}`,
          }}
        />
        {label}
      </div>
    </div>
  );
};

const PromptBar = ({
  children,
  accent = theme.accent,
  number,
  title,
}: {
  children: ReactNode;
  accent?: string;
  number?: number;
  title?: string;
}) => {
  const frame = useCurrentFrame();
  const p = enter(frame, 0, 18);
  return (
    <div
      style={{
        position: "absolute",
        left: 80,
        right: 80,
        top: 1120,
        height: 520,
        ...glass,
        borderTop: `7px solid ${accent}`,
        padding: "26px 32px 24px",
        color: theme.text,
        opacity: p,
        translate: `0 ${(1 - p) * 30}px`,
        zIndex: 30,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          color: accent,
          fontFamily: theme.monoFont,
          fontWeight: 800,
          fontSize: 23,
          letterSpacing: 2,
        }}
      >
        <span>
          {number ? `STEP 0${number} · ` : ""}可直接复制的提示词
          {title ? ` / ${title}` : ""}
        </span>
        <span style={{color: theme.mutedText, fontSize: 26}}>⧉ COPY</span>
      </div>
      <div
        style={{
          marginTop: 28,
          color: theme.text,
          fontSize: 33,
          lineHeight: 1.5,
          fontWeight: 620,
          letterSpacing: 0,
        }}
      >
        {children}
      </div>
      <div
        style={{
          position: "absolute",
          left: 32,
          right: 32,
          bottom: 22,
          display: "flex",
          alignItems: "center",
          gap: 16,
          color: theme.mutedText,
          fontFamily: theme.monoFont,
          fontSize: 21,
          letterSpacing: 2,
        }}
      >
        <div style={{flex: 1, height: 5, borderRadius: 10, background: "rgba(175,192,210,.18)"}}>
          <div style={{width: `${Math.min(100, Math.max(18, p * 100))}%`, height: "100%", borderRadius: 10, background: accent}} />
        </div>
        <span>暂停即可复制</span>
      </div>
    </div>
  );
};

const ProgressRail = ({current}: {current: number}) => (
  <div
    style={{
      position: "absolute",
      right: 28,
      top: 500,
      display: "flex",
      flexDirection: "column",
      gap: 19,
      zIndex: 20,
    }}
  >
    {Array.from({length: 7}, (_, index) => (
      <div
        key={index}
        style={{
          width: current === index + 1 ? 18 : 10,
          height: current === index + 1 ? 42 : 10,
          borderRadius: 20,
          background:
            current === index + 1 ? theme.accent : "rgba(175,192,210,.28)",
          boxShadow:
            current === index + 1
              ? "0 0 22px rgba(50,174,255,.6)"
              : "none",
        }}
      />
    ))}
  </div>
);

const Window = ({
  title,
  children,
  style,
  accent = theme.accent,
}: {
  title: string;
  children: ReactNode;
  style?: CSSProperties;
  accent?: string;
}) => (
  <div style={{...glass, overflow: "hidden", ...style}}>
    <div
      style={{
        height: 64,
        display: "flex",
        alignItems: "center",
        padding: "0 24px",
        gap: 11,
        borderBottom: `1px solid ${theme.border}`,
        color: theme.mutedText,
        fontFamily: theme.monoFont,
        fontSize: 24,
      }}
    >
      <span style={{width: 12, height: 12, borderRadius: "50%", background: accent}} />
      <span style={{width: 12, height: 12, borderRadius: "50%", background: theme.warning}} />
      <span style={{width: 12, height: 12, borderRadius: "50%", background: theme.danger}} />
      <span style={{marginLeft: 12}}>{title}</span>
    </div>
    {children}
  </div>
);

const OpeningScene = () => {
  const frame = useCurrentFrame();
  const duration = 110;
  const phase1 = clamp(frame, [0, 10], [0, 1]);

  const junkLines = [
    "这个问题需要从多个角度综合分析……",
    "在当今快速发展的时代背景下……",
    "总而言之，我们应该辩证地看待……",
    "以上内容仅供参考，希望对你有所帮助。",
  ];

  return (
    <AbsoluteFill style={{opacity: sceneOpacity(frame, duration)}}>
      <div style={{opacity: phase1}}>
        {junkLines.map((line, index) => {
          const p = enter(frame, index * 8, 14);
          return (
            <div
              key={line}
              style={{
                position: "absolute",
                left: 100 + (index % 2) * 50,
                right: 100 - (index % 2) * 20,
                top: 210 + index * 205,
                ...glass,
                padding: "34px 38px",
                color: theme.mutedText,
                fontSize: 38,
                lineHeight: 1.35,
                opacity: p * (1 - index * 0.09),
                translate: `0 ${(1 - p) * -90}px`,
                rotate: `${index % 2 === 0 ? -1.4 : 1.2}deg`,
              }}
            >
              {line}
            </div>
          );
        })}
        <div
          style={{
            position: "absolute",
            left: 80,
            right: 80,
            top: 1080,
            textAlign: "center",
            fontFamily: theme.displayFont,
            fontSize: 102,
            fontWeight: 900,
            color: theme.text,
            letterSpacing: -4,
          }}
        >
          给 AI 加上 7 句话
          <div style={{color: theme.accent}}>让你的 AI 变得更聪明</div>
        </div>
      </div>

    </AbsoluteFill>
  );
};

const SourceScene = () => {
  const frame = useCurrentFrame();
  const duration = 180;
  const lineP = enter(frame, 26, 22);
  const cite1 = enter(frame, 58, 14);
  const cite2 = enter(frame, 78, 14);
  const unknown = enter(frame, 104, 16);
  const path = clamp(frame, [46, 92], [0, 1]);

  return (
    <AbsoluteFill style={{opacity: sceneOpacity(frame, duration)}}>
      <Header number={1} kicker="SOURCE CHECK" title="来源可核验" />
      <ProgressRail current={1} />
      <Window
        title="AI ANSWER"
        style={{position: "absolute", left: 70, right: 400, top: 360, height: 690}}
      >
        <div style={{position: "relative", padding: 36, height: "100%"}}>
          {[
            "2025 年，生成式 AI 的使用持续增长。",
            "多数团队已经建立自己的 AI 工作流。",
            "某项数据暂时无法找到可靠出处。",
          ].map((line, index) => (
            <div
              key={line}
              style={{
                position: "relative",
                marginBottom: 34,
                padding: "22px 24px",
                borderRadius: 18,
                background: theme.surfaceSoft,
                color: theme.text,
                fontSize: 34,
                lineHeight: 1.4,
                opacity: lineP,
                translate: `${(1 - lineP) * 24}px 0`,
              }}
            >
              {line}
              {index < 2 ? (
                <span
                  style={{
                    position: "absolute",
                    right: 18,
                    top: 18,
                    color: theme.success,
                    fontFamily: theme.monoFont,
                    fontSize: 28,
                    opacity: index === 0 ? cite1 : cite2,
                  }}
                >
                  [{index + 1}]
                </span>
              ) : (
                <span
                  style={{
                    display: "block",
                    marginTop: 14,
                    color: theme.warning,
                    fontSize: 28,
                    fontWeight: 760,
                    opacity: unknown,
                  }}
                >
                  ⚠ 无法核验，明确说明
                </span>
              )}
            </div>
          ))}
          <svg
            viewBox="0 0 900 180"
            style={{position: "absolute", left: 20, right: 20, bottom: 16, width: 880}}
          >
            <path
              d="M80 92 C250 8 420 170 600 76 S760 36 838 86"
              fill="none"
              stroke={theme.accent}
              strokeWidth="5"
              strokeDasharray="1000"
              strokeDashoffset={1000 * (1 - path)}
              opacity=".7"
            />
            {[80, 600, 838].map((cx, index) => (
              <circle
                key={cx}
                cx={cx}
                cy={index === 0 ? 92 : index === 1 ? 76 : 86}
                r="13"
                fill={index === 2 ? theme.warning : theme.success}
              />
            ))}
          </svg>
        </div>
      </Window>
      <VisualInsert
        src={editorialVisuals.source}
        label="EVIDENCE · VERIFY"
        accent={theme.success}
        style={{right: 70, top: 430, width: 300, height: 420}}
      />
      <PromptBar number={1} title="来源可核验" accent={theme.success}>
        {promptCopy.source}
      </PromptBar>
    </AbsoluteFill>
  );
};

const PlainLanguageScene = () => {
  const frame = useCurrentFrame();
  const duration = 180;
  const transformP = clamp(frame, [56, 112], [0, 1]);
  const terms = ["多模态表征学习", "上下文窗口衰减", "概率分布校准", "推理时计算"];
  const simple = ["把文字、图片一起理解", "对话太长会忘记前文", "知道答案有多确定"];

  return (
    <AbsoluteFill style={{opacity: sceneOpacity(frame, duration)}}>
      <Header number={2} kicker="PLAIN LANGUAGE" title="零基础转换" accent={theme.warning} />
      <ProgressRail current={2} />
      <div
        style={{
          position: "absolute",
          left: 80,
          right: 80,
          top: 360,
          height: 660,
          display: "grid",
          gridTemplateRows: "1fr 70px 1fr",
          gap: 20,
        }}
      >
        <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18}}>
          {terms.map((term, index) => {
            const p = enter(frame, 18 + index * 8, 14);
            return (
              <div
                key={term}
                style={{
                  ...glass,
                  display: "grid",
                  placeItems: "center",
                  padding: 24,
                  color: theme.mutedText,
                  fontSize: 34,
                  fontWeight: 720,
                  textAlign: "center",
                  opacity: p * (1 - transformP),
                  translate: `0 ${transformP * -30}px`,
                  filter: `blur(${transformP * 10}px)`,
                }}
              >
                {term}
              </div>
            );
          })}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: theme.warning,
            fontFamily: theme.monoFont,
            fontSize: 28,
            letterSpacing: 4,
          }}
        >
          COMPLEXITY ↓
        </div>
        <div style={{display: "flex", flexDirection: "column", gap: 16}}>
          {simple.map((item, index) => {
            const p = enter(frame, 80 + index * 12, 18);
            return (
              <div
                key={item}
                style={{
                  ...glass,
                  padding: "24px 30px",
                  borderColor: "rgba(255,195,77,.35)",
                  display: "flex",
                  alignItems: "center",
                  gap: 20,
                  color: theme.text,
                  fontSize: 38,
                  fontWeight: 760,
                  opacity: p,
                  translate: `${(1 - p) * 40}px 0`,
                }}
              >
                <span style={{color: theme.warning, fontFamily: theme.monoFont}}>
                  0{index + 1}
                </span>
                {item}
              </div>
            );
          })}
        </div>
      </div>
      <PromptBar number={2} title="零基础转换" accent={theme.warning}>
        {promptCopy.plainLanguage}
      </PromptBar>
    </AbsoluteFill>
  );
};

const VulnerabilityScene = () => {
  const frame = useCurrentFrame();
  const duration = 180;
  const rails = [
    {label: "证据不足", valid: true},
    {label: "结论跳跃", valid: true},
    {label: "反例是否成立", valid: false},
  ];
  return (
    <AbsoluteFill style={{opacity: sceneOpacity(frame, duration)}}>
      <Header number={3} kicker="RED TEAM" title="先找漏洞" accent={theme.danger} />
      <ProgressRail current={3} />
      <div
        style={{
          position: "absolute",
          left: 80,
          right: 400,
          top: 360,
          display: "flex",
          flexDirection: "column",
          gap: 18,
        }}
      >
        {rails.map((rail, index) => {
          const p = enter(frame, 18 + index * 18, 16);
          const checked = enter(frame, 74 + index * 15, 12);
          return (
            <div
              key={rail.label}
              style={{
                ...glass,
                padding: "28px 30px",
                opacity: p,
                translate: `${(1 - p) * 70}px 0`,
              }}
            >
              <div style={{display: "flex", alignItems: "center", gap: 20}}>
                <div
                  style={{
                    width: 58,
                    height: 58,
                    borderRadius: 20,
                    display: "grid",
                    placeItems: "center",
                    background: rail.valid
                      ? "rgba(255,101,119,.15)"
                      : "rgba(66,223,134,.12)",
                    color: rail.valid ? theme.danger : theme.success,
                    fontSize: 30,
                    fontWeight: 900,
                  }}
                >
                  {checked < 1 ? "?" : rail.valid ? "!" : "✓"}
                </div>
                <div style={{flex: 1}}>
                  <div style={{fontSize: 38, fontWeight: 780}}>{rail.label}</div>
                  <div
                    style={{
                      marginTop: 15,
                      height: 9,
                      borderRadius: 20,
                      background: "rgba(175,192,210,.14)",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: `${checked * 100}%`,
                        height: "100%",
                        background: rail.valid ? theme.danger : theme.success,
                      }}
                    />
                  </div>
                </div>
                <div
                  style={{
                    color: rail.valid ? theme.danger : theme.success,
                    fontFamily: theme.monoFont,
                    fontSize: 25,
                    fontWeight: 800,
                    opacity: checked,
                  }}
                >
                  {rail.valid ? "成立 → 修改" : "不成立 → 解释"}
                </div>
              </div>
            </div>
          );
        })}
        <div
          style={{
            ...glass,
            marginTop: 12,
            padding: "34px 36px",
            borderColor: "rgba(66,223,134,.42)",
            fontSize: 42,
            fontWeight: 820,
            color: theme.success,
            opacity: enter(frame, 124, 18),
            scale: 0.94 + enter(frame, 124, 18) * 0.06,
          }}
        >
          先判断，再修改。不是强行反驳。
        </div>
      </div>
      <VisualInsert
        src={editorialVisuals.redTeam}
        label="RED TEAM · FIND THE GAP"
        accent={theme.danger}
        style={{right: 70, top: 430, width: 300, height: 420}}
      />
      <PromptBar number={3} title="先找漏洞" accent={theme.danger}>
        {promptCopy.vulnerabilities}
      </PromptBar>
    </AbsoluteFill>
  );
};

const ConclusionScene = () => {
  const frame = useCurrentFrame();
  const duration = 180;
  const sorted = clamp(frame, [58, 108], [0, 1]);
  const ordered = [
    {tag: "结论", text: "先做小规模测试", color: theme.accent},
    {tag: "理由", text: "成本可控 · 反馈更快 · 风险更低", color: theme.success},
    {tag: "例外", text: "数据不足时先补充验证", color: theme.warning},
  ];
  return (
    <AbsoluteFill style={{opacity: sceneOpacity(frame, duration)}}>
      <Header number={4} kicker="ANSWER STRUCTURE" title="结论优先" />
      <ProgressRail current={4} />
      <div
        style={{
          position: "absolute",
          left: 80,
          right: 80,
          top: 360,
          height: 680,
        }}
      >
        <Window title="BEFORE · 绕圈回答" style={{height: "100%", opacity: 1 - sorted}}>
          <div style={{padding: 36, display: "flex", flexWrap: "wrap", gap: 18}}>
            {[
              "从多个角度来看",
              "这取决于具体情况",
              "需要综合考虑",
              "没有绝对答案",
              "我们可以进一步分析",
              "不同人有不同看法",
            ].map((item, index) => (
              <div
                key={item}
                style={{
                  padding: "22px 26px",
                  borderRadius: 18,
                  background: "rgba(175,192,210,.08)",
                  border: `1px solid ${theme.border}`,
                  color: theme.mutedText,
                  fontSize: 34,
                  rotate: `${index % 2 ? 2 : -2}deg`,
                  translate: `${Math.sin((frame + index * 13) / 20) * 10}px ${
                    Math.cos((frame + index * 9) / 19) * 10
                  }px`,
                }}
              >
                {item}
              </div>
            ))}
          </div>
        </Window>
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            gap: 22,
            opacity: sorted,
          }}
        >
          {ordered.map((item, index) => {
            const p = enter(frame, 76 + index * 13, 16);
            return (
              <div
                key={item.tag}
                style={{
                  ...glass,
                  flex: 1,
                  padding: "28px 34px",
                  display: "grid",
                  gridTemplateColumns: "130px 1fr",
                  alignItems: "center",
                  gap: 24,
                  borderLeft: `8px solid ${item.color}`,
                  opacity: p,
                  translate: `${(1 - p) * 70}px 0`,
                }}
              >
                <div
                  style={{
                    color: item.color,
                    fontFamily: theme.monoFont,
                    fontSize: 30,
                    fontWeight: 850,
                  }}
                >
                  {item.tag}
                </div>
                <div style={{fontSize: 39, fontWeight: 760}}>{item.text}</div>
              </div>
            );
          })}
        </div>
      </div>
      <PromptBar number={4} title="结论优先">
        {promptCopy.conclusion}
      </PromptBar>
    </AbsoluteFill>
  );
};

const HonestyScene = () => {
  const frame = useCurrentFrame();
  const duration = 180;
  const scan = clamp(frame, [24, 112], [0, 1]);
  const needle = -120 + scan * 205;
  const states = [
    {label: "确定", color: theme.success, value: "有依据"},
    {label: "推测", color: theme.warning, value: "主动标记"},
    {label: "不知道", color: theme.mutedText, value: "不补全"},
  ];
  return (
    <AbsoluteFill style={{opacity: sceneOpacity(frame, duration)}}>
      <Header number={5} kicker="UNCERTAINTY" title="坦诚模式" accent={theme.warning} />
      <ProgressRail current={5} />
      <div
        style={{
          position: "absolute",
          left: 120,
          right: 120,
          top: 390,
          height: 680,
          ...glass,
          padding: 42,
        }}
      >
        <div
          style={{
            position: "relative",
            width: 560,
            height: 330,
            margin: "10px auto 30px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 30,
              top: 20,
              width: 500,
              height: 500,
              borderRadius: "50%",
              background:
                "conic-gradient(from 240deg, #42df86 0deg 75deg, #ffc34d 75deg 150deg, #607082 150deg 240deg, transparent 240deg 360deg)",
              opacity: 0.86,
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 100,
              top: 90,
              width: 360,
              height: 360,
              borderRadius: "50%",
              background: "#07121d",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 275,
              top: 244,
              width: 12,
              height: 145,
              borderRadius: 20,
              background: theme.text,
              transformOrigin: "50% 100%",
              rotate: `${needle}deg`,
              boxShadow: "0 0 24px rgba(245,249,255,.46)",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 260,
              top: 372,
              width: 42,
              height: 42,
              borderRadius: "50%",
              background: theme.text,
            }}
          />
        </div>
        <div style={{display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18}}>
          {states.map((state, index) => {
            const p = enter(frame, 58 + index * 18, 14);
            return (
              <div
                key={state.label}
                style={{
                  borderRadius: 22,
                  padding: "24px 18px",
                  border: `1px solid ${state.color}`,
                  background: `${state.color}16`,
                  textAlign: "center",
                  opacity: p,
                }}
              >
                <div style={{color: state.color, fontSize: 36, fontWeight: 850}}>
                  {state.label}
                </div>
                <div style={{marginTop: 12, color: theme.mutedText, fontSize: 27}}>
                  {state.value}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <PromptBar number={5} title="坦诚模式" accent={theme.warning}>
        {promptCopy.honesty}
      </PromptBar>
    </AbsoluteFill>
  );
};

const VeteranScene = () => {
  const frame = useCurrentFrame();
  const duration = 180;
  const path = clamp(frame, [42, 112], [0, 1]);
  const nodes = [
    {label: "具体案例", detail: "发生了什么", color: theme.accent},
    {label: "判断依据", detail: "为什么这么判断", color: theme.success},
    {label: "适用边界", detail: "什么时候不成立", color: theme.warning},
  ];
  return (
    <AbsoluteFill style={{opacity: sceneOpacity(frame, duration)}}>
      <Header number={6} kicker="EXPERT FRAMEWORK" title="老手框架" accent={theme.success} />
      <ProgressRail current={6} />
      <div
        style={{
          position: "absolute",
          left: 80,
          right: 400,
          top: 350,
          height: 700,
        }}
      >
        <div
          style={{
            ...glass,
            padding: "26px 30px",
            color: theme.mutedText,
            fontSize: 37,
            textAlign: "center",
            opacity: 1 - path * 0.75,
          }}
        >
          “多关注用户需求，持续优化体验。”
          <div style={{marginTop: 12, color: theme.danger, fontSize: 27}}>
            抽象建议 · 无法执行
          </div>
        </div>
        <svg
          viewBox="0 0 900 560"
          style={{position: "absolute", left: 10, top: 130, width: 900, height: 560}}
        >
          <path
            d="M80 60 C160 210 110 420 270 460 S460 220 540 330 S690 500 820 395"
            fill="none"
            stroke={theme.accent}
            strokeWidth="6"
            strokeDasharray="1400"
            strokeDashoffset={1400 * (1 - path)}
            opacity=".55"
          />
        </svg>
        {nodes.map((node, index) => {
          const positions = [
            {left: 40, top: 260},
            {left: 330, top: 430},
            {right: 20, top: 300},
          ];
          const p = enter(frame, 60 + index * 22, 16);
          return (
            <div
              key={node.label}
              style={{
                position: "absolute",
                width: 280,
                ...positions[index],
                ...glass,
                padding: "26px 24px",
                borderColor: node.color,
                opacity: p,
                scale: 0.88 + p * 0.12,
              }}
            >
              <div style={{color: node.color, fontSize: 36, fontWeight: 840}}>
                {node.label}
              </div>
              <div style={{marginTop: 12, color: theme.mutedText, fontSize: 26}}>
                {node.detail}
              </div>
            </div>
          );
        })}
        <div
          style={{
            position: "absolute",
            left: 260,
            right: 260,
            bottom: 0,
            borderRadius: 22,
            padding: "22px",
            background: theme.success,
            color: "#06111c",
            textAlign: "center",
            fontSize: 36,
            fontWeight: 900,
            opacity: enter(frame, 130, 16),
          }}
        >
          建议 → 能执行
        </div>
      </div>
      <VisualInsert
        src={editorialVisuals.veteran}
        label="FRAMEWORK · MAKE IT ACTIONABLE"
        accent={theme.success}
        style={{right: 70, top: 430, width: 300, height: 420}}
      />
      <PromptBar number={6} title="老手框架" accent={theme.success}>
        {promptCopy.veteran}
      </PromptBar>
    </AbsoluteFill>
  );
};

const SelfCorrectionScene = () => {
  const frame = useCurrentFrame();
  const duration = 240;
  const scan = clamp(frame, [40, 116], [0, 1]);
  const issues = enter(frame, 105, 16);
  const rewrite = enter(frame, 150, 24);
  const v1Opacity = 1 - rewrite;
  const answerV2 = "结论：先验证关键假设。\n理由：数据完整、成本可控、风险可逆。\n边界：样本不足时暂不扩大。";
  const typed = answerV2.slice(
    0,
    Math.floor(clamp(frame, [158, 210], [0, answerV2.length])),
  );

  return (
    <AbsoluteFill style={{opacity: sceneOpacity(frame, duration)}}>
      <Header number={7} kicker="SELF CHECK" title="自我纠正" accent={theme.success} />
      <ProgressRail current={7} />
      <Window
        title={rewrite < 0.5 ? "ANSWER V1 · CHECKING" : "ANSWER V2 · REWRITING"}
        accent={rewrite < 0.5 ? theme.danger : theme.success}
        style={{position: "absolute", left: 70, right: 400, top: 360, height: 720}}
      >
        <div style={{position: "relative", height: "100%", padding: 38}}>
          <div style={{opacity: v1Opacity}}>
            {[
              "结论：直接扩大投入规模。",
              "理由一：市场反馈整体积极。",
              "理由二：所有用户都会持续使用。",
              "因此该方案不存在明显风险。",
            ].map((line, index) => (
              <div
                key={line}
                style={{
                  padding: "24px 26px",
                  marginBottom: 20,
                  borderRadius: 18,
                  background: theme.surfaceSoft,
                  border:
                    issues > 0 && (index === 2 || index === 3)
                      ? `2px solid ${index === 2 ? theme.warning : theme.danger}`
                      : `1px solid ${theme.border}`,
                  color: theme.text,
                  fontSize: 35,
                  lineHeight: 1.35,
                }}
              >
                {line}
                {issues > 0 && index === 2 ? (
                  <span style={{float: "right", color: theme.warning, fontSize: 25}}>
                    事实缺口
                  </span>
                ) : null}
                {issues > 0 && index === 3 ? (
                  <span style={{float: "right", color: theme.danger, fontSize: 25}}>
                    逻辑跳跃
                  </span>
                ) : null}
              </div>
            ))}
          </div>
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: `${scan * 76}%`,
              height: 4,
              background:
                "linear-gradient(90deg, transparent, #32aeff, rgba(50,174,255,.2), transparent)",
              boxShadow: "0 0 34px rgba(50,174,255,.7)",
              opacity: rewrite < 0.3 ? 1 : 0,
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 38,
              opacity: rewrite,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                padding: "22px 24px",
                borderRadius: 18,
                background: "rgba(66,223,134,.12)",
                border: "1px solid rgba(66,223,134,.38)",
                color: theme.success,
                fontFamily: theme.monoFont,
                fontSize: 28,
                fontWeight: 850,
              }}
            >
              2 个问题已发现 · 正在重写
            </div>
            <div
              style={{
                flex: 1,
                marginTop: 24,
                padding: "30px",
                borderRadius: 22,
                background: theme.surfaceSoft,
                whiteSpace: "pre-wrap",
                color: theme.text,
                fontSize: 39,
                lineHeight: 1.62,
                fontWeight: 680,
              }}
            >
              {typed}
              <span style={{color: theme.success}}>|</span>
            </div>
            <div
              style={{
                marginTop: 22,
                padding: "22px",
                borderRadius: 20,
                background: theme.success,
                color: "#06111c",
                textAlign: "center",
                fontSize: 34,
                fontWeight: 920,
                letterSpacing: 2,
                opacity: enter(frame, 208, 12),
              }}
            >
              SELF-CHECKED · 已自检
            </div>
          </div>
        </div>
      </Window>
      <VisualInsert
        src={editorialVisuals.selfCorrection}
        label="SCAN · REWRITE · VERSION 2"
        accent={theme.success}
        style={{right: 70, top: 460, width: 300, height: 380}}
      />
      <PromptBar number={7} title="自我纠正" accent={theme.success}>
        {promptCopy.selfCorrection}
      </PromptBar>
    </AbsoluteFill>
  );
};

const FinalScene = () => {
  const frame = useCurrentFrame();
  const duration = 270;
  const networkOpacity = clamp(frame, [0, 14, 154, 172], [0, 1, 1, 0]);
  const cta = enter(frame, 166, 24);
  const nodeLabels = ["来源", "大白话", "漏洞", "结论", "坦诚", "老手", "自检"];
  const positions = [
    [180, 430],
    [500, 360],
    [790, 500],
    [160, 850],
    [780, 900],
    [310, 1160],
    [680, 1200],
  ];
  return (
    <AbsoluteFill style={{opacity: sceneOpacity(frame, duration)}}>
      <div style={{opacity: networkOpacity}}>
        <Header kicker="7 PROMPTS · 1 BETTER ANSWER" title="真正改变的是回答方式" />
        <svg
          viewBox="0 0 1080 1500"
          style={{position: "absolute", inset: 0, width: 1080, height: 1500}}
        >
          {positions.map(([x, y], index) => {
            const p = enter(frame, 24 + index * 8, 20);
            return (
              <line
                key={index}
                x1={x}
                y1={y}
                x2="540"
                y2="760"
                stroke={index === 6 ? theme.success : theme.accent}
                strokeWidth="4"
                strokeDasharray="600"
                strokeDashoffset={600 * (1 - p)}
                opacity=".38"
              />
            );
          })}
        </svg>
        {nodeLabels.map((label, index) => {
          const p = enter(frame, 24 + index * 8, 16);
          return (
            <div
              key={label}
              style={{
                position: "absolute",
                left: positions[index][0] - 70,
                top: positions[index][1] - 42,
                width: 140,
                height: 84,
                borderRadius: 25,
                display: "grid",
                placeItems: "center",
                background:
                  index === 6 ? "rgba(66,223,134,.18)" : "rgba(50,174,255,.14)",
                border: `1px solid ${index === 6 ? theme.success : theme.accent}`,
                color: index === 6 ? theme.success : theme.text,
                fontSize: 31,
                fontWeight: 820,
                opacity: p,
                scale: 0.8 + p * 0.2,
              }}
            >
              {label}
            </div>
          );
        })}
        <div
          style={{
            position: "absolute",
            left: 300,
            top: 630,
            width: 480,
            height: 260,
            ...glass,
            borderColor: theme.success,
            display: "grid",
            placeItems: "center",
            textAlign: "center",
            padding: 34,
            opacity: enter(frame, 76, 22),
            scale: 0.86 + enter(frame, 76, 22) * 0.14,
          }}
        >
          <div>
            <div style={{color: theme.success, fontFamily: theme.monoFont, fontSize: 26}}>
              HIGH QUALITY ANSWER
            </div>
            <div style={{marginTop: 18, fontSize: 55, fontWeight: 900}}>
              证据 · 结构 · 边界
            </div>
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            left: 80,
            right: 80,
            bottom: 220,
            textAlign: "center",
            color: theme.mutedText,
            fontSize: 38,
            lineHeight: 1.45,
            opacity: enter(frame, 116, 18),
          }}
        >
          它们不是魔法咒语
          <br />
          而是让 AI 交代证据、理清结构、承认未知
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          inset: "190px 80px 180px",
          opacity: cta,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
        }}
      >
        <div
          style={{
            width: 260,
            height: 260,
            borderRadius: 78,
            display: "grid",
            placeItems: "center",
            background: theme.accent,
            color: "#06111c",
            fontSize: 124,
            boxShadow: "0 30px 100px rgba(50,174,255,.28)",
            scale: 0.8 + cta * 0.2,
          }}
        >
          ☆
        </div>
        <div
          style={{
            marginTop: 72,
            color: theme.text,
            fontSize: 108,
            lineHeight: 1.08,
            fontWeight: 920,
            letterSpacing: -5,
          }}
        >
          先收藏
        </div>
        <div
          style={{
            marginTop: 28,
            color: theme.accent,
            fontSize: 58,
            fontWeight: 820,
          }}
        >
          下次提问，直接复制
        </div>
        <div
          style={{
            marginTop: 110,
            color: theme.mutedText,
            fontFamily: theme.monoFont,
            fontSize: 26,
            letterSpacing: 5,
          }}
        >
          WINTER · AI WORKFLOW
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const AiSevenPrompts = () => (
  <AbsoluteFill
    style={{
      color: theme.text,
      fontFamily: theme.bodyFont,
      overflow: "hidden",
    }}
  >
    <Background />
    <Sequence durationInFrames={110}>
      <OpeningScene />
    </Sequence>
    <Sequence from={110} durationInFrames={180}>
      <SourceScene />
    </Sequence>
    <Sequence from={290} durationInFrames={180}>
      <PlainLanguageScene />
    </Sequence>
    <Sequence from={470} durationInFrames={180}>
      <VulnerabilityScene />
    </Sequence>
    <Sequence from={650} durationInFrames={180}>
      <ConclusionScene />
    </Sequence>
    <Sequence from={830} durationInFrames={180}>
      <HonestyScene />
    </Sequence>
    <Sequence from={1010} durationInFrames={180}>
      <VeteranScene />
    </Sequence>
    <Sequence from={1190} durationInFrames={240}>
      <SelfCorrectionScene />
    </Sequence>
    <Sequence from={1430} durationInFrames={270}>
      <FinalScene />
    </Sequence>
  </AbsoluteFill>
);
