import {
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { ReactNode } from "react";
import type { SemanticCue, StageScene } from "../schema";
import { progress } from "../motion";
import {
  accentColor,
  getProgressivePalette,
  panelStyle,
  type ProgressivePalette,
  theme,
} from "../theme";

const clamp01 = (value: number) => Math.max(0, Math.min(1, value));
const cueHeading = (cue: SemanticCue) =>
  (cue.title ?? cue.kind.replace(/-/g, " ")).replace(/^\d+\s*[·.]\s*/, "");

const CueBadge = ({
  children,
  color,
}: {
  children: ReactNode;
  color: string;
}) => (
  <span
    style={{
      display: "inline-flex",
      alignItems: "center",
      minHeight: 30,
      padding: "4px 11px",
      borderRadius: 999,
      border: `1px solid ${color}66`,
      color,
      fontFamily: theme.monoFont,
      fontSize: 16,
      letterSpacing: 1.2,
      whiteSpace: "nowrap",
    }}
  >
    {children}
  </span>
);

const CueTitle = ({
  cue,
  color,
  index,
}: {
  cue: SemanticCue;
  color: string;
  index: number;
}) => (
  <div style={{ display: "flex", justifyContent: "space-between", gap: 16 }}>
    <div style={{ display: "flex", gap: 14, minWidth: 0 }}>
      <div
        style={{
          flex: "0 0 auto",
          width: 48,
          height: 48,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 14,
          border: `1px solid ${color}88`,
          backgroundColor: `${color}18`,
          color,
          fontFamily: theme.monoFont,
          fontSize: 18,
          letterSpacing: 1,
        }}
      >
        {String(index + 1).padStart(2, "0")}
      </div>
      <div style={{ minWidth: 0 }}>
        <div
          style={{
            color,
            fontFamily: theme.monoFont,
            fontSize: 16,
            letterSpacing: 2.2,
            marginBottom: 8,
            textTransform: "uppercase",
          }}
        >
          {cueHeading(cue)}
        </div>
        <div
          style={{
            fontFamily: theme.displayFont,
            fontSize: 34,
            fontWeight: 760,
            lineHeight: 1.16,
          }}
        >
          {cue.label ?? "语义状态变化"}
        </div>
      </div>
    </div>
    <CueBadge color={color}>口播驱动</CueBadge>
  </div>
);

const Thermometer = ({
  cue,
  stateProgress,
}: {
  cue: SemanticCue;
  stateProgress: number;
}) => {
  const from = cue.valueFrom ?? 22;
  const to = cue.valueTo ?? 40;
  const value = interpolate(stateProgress, [0, 1], [from, to]);
  const normalized = clamp01(value / 50);
  const threshold = 30 / 50;
  const color = accentColor(cue.accent ?? "danger");
  const stateColor = value >= 30 ? color : theme.success;

  return (
    <div
      style={{ display: "flex", alignItems: "center", gap: 24, marginTop: 24 }}
    >
      <div
        style={{
          position: "relative",
          width: 38,
          height: 170,
          borderRadius: 22,
          border: `3px solid ${theme.border}`,
          background: "rgba(3, 10, 18, .82)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 7,
            right: 7,
            bottom: 8,
            height: `${Math.max(7, normalized * 154)}px`,
            borderRadius: 14,
            background: `linear-gradient(180deg, ${stateColor}, ${stateColor}66)`,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: -10,
            right: -10,
            bottom: `${threshold * 154 + 8}px`,
            borderTop: `2px dashed ${theme.warning}`,
          }}
        />
      </div>
      <div style={{ flex: 1 }}>
        <div
          style={{
            color: stateColor,
            fontFamily: theme.displayFont,
            fontSize: 72,
            fontWeight: 820,
            lineHeight: 1,
          }}
        >
          {Math.round(value)}
          <span style={{ fontSize: 30, marginLeft: 8 }}>
            {cue.unit ?? "°C"}
          </span>
        </div>
        <div style={{ color: theme.mutedText, fontSize: 22, marginTop: 12 }}>
          {value >= 30 ? "超过安全阈值 · 需要立即处理" : "安全范围 · 持续监测"}
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            color: theme.mutedText,
            fontFamily: theme.monoFont,
            fontSize: 15,
            marginTop: 18,
          }}
        >
          <span>16–25°C 安全</span>
          <span style={{ color: theme.warning }}>30°C 上限</span>
        </div>
      </div>
    </div>
  );
};

const SignalFlow = ({
  cue,
  frame,
  stateFrame,
}: {
  cue: SemanticCue;
  frame: number;
  stateFrame: number;
}) => {
  const nodes = cue.nodes?.length
    ? cue.nodes
    : ["手机指令", "Worker", "ESP32", "电机"];
  const flow = progress(frame, stateFrame - 8, stateFrame + 34);
  const color = accentColor(cue.accent ?? "accent");

  return (
    <div style={{ marginTop: 24 }}>
      <div
        style={{
          display: "flex",
          gap: 8,
          alignItems: "center",
        }}
      >
        {nodes.map((node, index) => {
          const nodeProgress = clamp01(
            (flow - index / nodes.length) * nodes.length,
          );
          return (
            <div key={node} style={{ display: "contents" }}>
              <div
                style={{
                  flex: 1,
                  minWidth: 0,
                  minHeight: 66,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "10px 8px",
                  borderRadius: 14,
                  border: `1px solid ${nodeProgress > 0.6 ? color : theme.border}`,
                  backgroundColor:
                    nodeProgress > 0.6 ? `${color}1c` : theme.surfaceSoft,
                  color: nodeProgress > 0.6 ? theme.text : theme.mutedText,
                  fontSize: 20,
                  fontWeight: 700,
                  opacity: 0.56 + nodeProgress * 0.44,
                  scale: 0.96 + nodeProgress * 0.04,
                }}
              >
                {node}
              </div>
              {index < nodes.length - 1 ? (
                <div
                  style={{
                    flex: "0 0 26px",
                    height: 3,
                    borderRadius: 3,
                    background: `linear-gradient(90deg, ${color} ${
                      clamp01(flow * nodes.length - index) * 100
                    }%, ${theme.border} 0)`,
                    transform: "translateX(-4px)",
                  }}
                />
              ) : null}
            </div>
          );
        })}
      </div>
      <div style={{ color: theme.mutedText, fontSize: 20, marginTop: 18 }}>
        {cue.body ?? "信息不是弹出一张卡，而是沿着真实链路抵达结果。"}
      </div>
    </div>
  );
};

const TranslationWave = ({
  cue,
  frame,
  stateProgress,
}: {
  cue: SemanticCue;
  frame: number;
  stateProgress: number;
}) => {
  const color = accentColor(cue.accent ?? "success");
  const source = cue.from ?? "孟加拉";
  const target = cue.to ?? "中文";
  const waveBars = Array.from({ length: 34 }, (_, index) => {
    const wave = Math.abs(Math.sin(index * 0.78 + frame * 0.09));
    return 8 + wave * 42;
  });

  return (
    <div style={{ marginTop: 22 }}>
      <div
        style={{
          height: 72,
          display: "flex",
          alignItems: "center",
          gap: 5,
          padding: "0 12px",
          borderRadius: 14,
          backgroundColor: theme.surfaceSoft,
          border: `1px solid ${theme.border}`,
        }}
      >
        {waveBars.map((bar, index) => (
          <div
            key={index}
            style={{
              flex: 1,
              height: `${bar}px`,
              borderRadius: 4,
              backgroundColor:
                index / waveBars.length < stateProgress
                  ? color
                  : theme.mutedText,
              opacity: index / waveBars.length < stateProgress ? 1 : 0.38,
            }}
          />
        ))}
      </div>
      <div
        style={{
          display: "flex",
          gap: 10,
          alignItems: "center",
          marginTop: 18,
        }}
      >
        <CueBadge color={theme.mutedText}>{source}</CueBadge>
        <span style={{ color, fontSize: 24 }}>→</span>
        <CueBadge color={color}>{target}</CueBadge>
      </div>
    </div>
  );
};

const GpsRoute = ({
  cue,
  stateProgress,
}: {
  cue: SemanticCue;
  stateProgress: number;
}) => {
  const color = accentColor(cue.accent ?? "accent");
  const routeProgress = clamp01(stateProgress);
  const x = interpolate(routeProgress, [0, 1], [18, 84]);
  const y = interpolate(routeProgress, [0, 0.45, 1], [76, 28, 64]);

  return (
    <div style={{ marginTop: 18 }}>
      <svg viewBox="0 0 100 100" style={{ width: "100%", height: 170 }}>
        <defs>
          <pattern
            id={`grid-${cue.id}`}
            width="10"
            height="10"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 10 0 L 0 0 0 10"
              fill="none"
              stroke={theme.border}
              strokeWidth=".35"
            />
          </pattern>
        </defs>
        <rect width="100" height="100" rx="8" fill={`url(#grid-${cue.id})`} />
        <path
          d="M 18 76 C 28 62, 30 36, 48 42 S 66 76, 84 64"
          fill="none"
          stroke={theme.border}
          strokeWidth="2"
        />
        <path
          d="M 18 76 C 28 62, 30 36, 48 42 S 66 76, 84 64"
          fill="none"
          stroke={color}
          strokeWidth="3.5"
          strokeLinecap="round"
          pathLength="1"
          strokeDasharray="1"
          strokeDashoffset={1 - routeProgress}
        />
        <circle cx={x} cy={y} r="4.4" fill={color} />
        <circle
          cx={x}
          cy={y}
          r="8"
          fill="none"
          stroke={color}
          strokeOpacity=".45"
          strokeWidth="1.2"
        />
      </svg>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          color: theme.mutedText,
          fontSize: 20,
        }}
      >
        <span>{cue.from ?? "手机定位"}</span>
        <span style={{ color }}>{cue.to ?? "自动写入数据库"}</span>
      </div>
    </div>
  );
};

const DatabaseWrite = ({
  cue,
  stateProgress,
}: {
  cue: SemanticCue;
  stateProgress: number;
}) => {
  const color = accentColor(cue.accent ?? "success");
  const rows = cue.nodes?.length
    ? cue.nodes
    : ["地块", "作物", "作业时间", "人员"];
  return (
    <div style={{ marginTop: 24, display: "grid", gap: 10 }}>
      {rows.map((row, index) => {
        const rowProgress = clamp01(
          (stateProgress - index / rows.length) * rows.length,
        );
        return (
          <div
            key={row}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              color: rowProgress > 0.5 ? theme.text : theme.mutedText,
            }}
          >
            <span
              style={{
                width: 12,
                height: 12,
                borderRadius: 3,
                backgroundColor: rowProgress > 0.5 ? color : theme.border,
              }}
            />
            <span style={{ flex: 1, fontSize: 22 }}>{row}</span>
            <span
              style={{
                fontFamily: theme.monoFont,
                fontSize: 16,
                color: rowProgress > 0.5 ? color : theme.mutedText,
              }}
            >
              {rowProgress > 0.5 ? "WRITTEN" : "WAITING"}
            </span>
          </div>
        );
      })}
    </div>
  );
};

const CostCompare = ({
  cue,
  stateProgress,
}: {
  cue: SemanticCue;
  stateProgress: number;
}) => {
  const color = accentColor(cue.accent ?? "warning");
  const self = interpolate(stateProgress, [0, 1], [12, cue.valueFrom ?? 24]);
  const outsource = interpolate(
    stateProgress,
    [0, 1],
    [18, cue.valueTo ?? 100],
  );
  return (
    <div style={{ marginTop: 24, display: "grid", gap: 18 }}>
      {[
        { label: "自己 vibe coding", value: self, color: theme.success },
        { label: "外包开发", value: outsource, color },
      ].map((bar) => (
        <div key={bar.label}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: 20,
              marginBottom: 8,
            }}
          >
            <span>{bar.label}</span>
            <span style={{ fontFamily: theme.monoFont, color: bar.color }}>
              {Math.round(bar.value)}万
            </span>
          </div>
          <div
            style={{
              height: 14,
              borderRadius: 999,
              backgroundColor: theme.surfaceSoft,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${Math.min(100, bar.value)}%`,
                height: "100%",
                borderRadius: 999,
                backgroundColor: bar.color,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

const GenericCueVisual = ({
  cue,
  stateProgress,
  palette,
}: {
  cue: SemanticCue;
  stateProgress: number;
  palette: ProgressivePalette;
}) => {
  const color = palette[cue.accent ?? "accent"];
  const content = cue.body ?? cue.label ?? "语义状态已建立";

  if (cue.kind === "image") {
    return (
      <div style={{ marginTop: 22 }}>
        {cue.assetId ? (
          <Img
            src={staticFile(cue.assetId)}
            alt={cue.alt ?? cue.label ?? "视觉素材"}
            style={{
              display: "block",
              width: "100%",
              maxHeight: 230,
              objectFit: "cover",
              borderRadius: 16,
              border: `1px solid ${palette.border}`,
            }}
          />
        ) : (
          <div
            style={{
              minHeight: 150,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 16,
              border: `1px dashed ${color}88`,
              backgroundColor: palette.surfaceSoft,
              color,
              fontFamily: theme.monoFont,
              fontSize: 22,
              letterSpacing: 2,
            }}
          >
            {cue.symbol ?? "IMAGE"}
          </div>
        )}
        <div style={{ color: palette.mutedText, fontSize: 20, marginTop: 12 }}>
          {content}
        </div>
      </div>
    );
  }

  if (cue.kind === "icon") {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 20,
          marginTop: 22,
          padding: "18px 20px",
          borderRadius: 18,
          border: `1px solid ${color}66`,
          backgroundColor: palette.surfaceSoft,
        }}
      >
        <div
          style={{
            flex: "0 0 auto",
            width: 86,
            height: 86,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 24,
            backgroundColor: `${color}20`,
            color,
            fontSize: 52,
            transform: `scale(${0.9 + stateProgress * 0.1})`,
          }}
        >
          {cue.symbol ?? "✦"}
        </div>
        <div style={{ color: palette.text, fontSize: 24, lineHeight: 1.25 }}>
          {content}
        </div>
      </div>
    );
  }

  if (cue.kind === "metric") {
    const from = cue.valueFrom ?? 0;
    const to = cue.valueTo ?? cue.valueFrom ?? 100;
    const value = interpolate(stateProgress, [0, 1], [from, to]);
    return (
      <div style={{ marginTop: 22 }}>
        <div
          style={{
            color,
            fontFamily: theme.displayFont,
            fontSize: 82,
            fontWeight: 820,
            lineHeight: 1,
          }}
        >
          {Math.round(value)}
          <span style={{ fontSize: 30, marginLeft: 8 }}>
            {cue.unit ?? ""}
          </span>
        </div>
        <div
          style={{
            height: 8,
            marginTop: 22,
            borderRadius: 999,
            backgroundColor: palette.surfaceSoft,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${clamp01(stateProgress) * 100}%`,
              height: "100%",
              borderRadius: 999,
              backgroundColor: color,
            }}
          />
        </div>
        <div style={{ color: palette.mutedText, fontSize: 20, marginTop: 14 }}>
          {content}
        </div>
      </div>
    );
  }

  if (cue.kind === "text" || cue.kind === "quote") {
    return (
      <div
        style={{
          marginTop: 22,
          padding: "18px 20px",
          borderLeft: `4px solid ${color}`,
          backgroundColor: palette.surfaceSoft,
          color: palette.text,
          fontFamily: theme.displayFont,
          fontSize: cue.kind === "quote" ? 30 : 26,
          lineHeight: 1.35,
        }}
      >
        {cue.kind === "quote" ? `“${content}”` : content}
      </div>
    );
  }

  const nodes = cue.nodes?.length ? cue.nodes : ["起点", "变化", "结果"];
  return (
    <div style={{ marginTop: 22, display: "grid", gap: 12 }}>
      {nodes.map((node, index) => {
        const nodeProgress = clamp01(
          (stateProgress - index / nodes.length) * nodes.length,
        );
        return (
          <div key={`${cue.id}-${node}`}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: "12px 14px",
                borderRadius: 14,
                border: `1px solid ${
                  nodeProgress > 0.5 ? color : palette.border
                }`,
                backgroundColor:
                  nodeProgress > 0.5 ? `${color}18` : palette.surfaceSoft,
                color: nodeProgress > 0.5 ? palette.text : palette.mutedText,
                fontSize: 22,
                fontWeight: 700,
              }}
            >
              <span
                style={{
                  color: nodeProgress > 0.5 ? color : palette.mutedText,
                  fontFamily: theme.monoFont,
                  fontSize: 15,
                }}
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <span>{node}</span>
            </div>
            {cue.kind === "diagram" && index < nodes.length - 1 ? (
              <div
                style={{
                  width: 2,
                  height: 12,
                  marginLeft: 25,
                  backgroundColor:
                    nodeProgress > 0.5 ? color : palette.border,
                }}
              />
            ) : null}
          </div>
        );
      })}
      <div style={{ color: palette.mutedText, fontSize: 20 }}>{content}</div>
    </div>
  );
};

const CueVisual = ({
  cue,
  frame,
  stateFrame,
  stateProgress,
  palette,
}: {
  cue: SemanticCue;
  frame: number;
  stateFrame: number;
  stateProgress: number;
  palette: ProgressivePalette;
}) => {
  if (
    cue.kind === "text" ||
    cue.kind === "icon" ||
    cue.kind === "image" ||
    cue.kind === "metric" ||
    cue.kind === "diagram" ||
    cue.kind === "steps" ||
    cue.kind === "quote"
  ) {
    return (
      <GenericCueVisual
        cue={cue}
        stateProgress={stateProgress}
        palette={palette}
      />
    );
  }
  if (cue.kind === "thermometer") {
    return <Thermometer cue={cue} stateProgress={stateProgress} />;
  }
  if (cue.kind === "signal-flow") {
    return <SignalFlow cue={cue} frame={frame} stateFrame={stateFrame} />;
  }
  if (cue.kind === "translation-wave") {
    return (
      <TranslationWave cue={cue} frame={frame} stateProgress={stateProgress} />
    );
  }
  if (cue.kind === "gps-route") {
    return <GpsRoute cue={cue} stateProgress={stateProgress} />;
  }
  if (cue.kind === "database-write") {
    return <DatabaseWrite cue={cue} stateProgress={stateProgress} />;
  }
  return <CostCompare cue={cue} stateProgress={stateProgress} />;
};

const cueMark = (kind: SemanticCue["kind"]) => {
  if (kind === "text") return "Aa";
  if (kind === "icon") return "✦";
  if (kind === "image") return "IMG";
  if (kind === "metric") return "#";
  if (kind === "diagram") return "↗";
  if (kind === "steps") return "01";
  if (kind === "quote") return "“";
  if (kind === "thermometer") return "°";
  if (kind === "signal-flow") return "→";
  if (kind === "translation-wave") return "≈";
  if (kind === "gps-route") return "⌁";
  if (kind === "database-write") return "DB";
  return "¥";
};

const CompactCueRow = ({
  cue,
  index,
  frame,
  fps,
  palette,
  stagePosition,
}: {
  cue: SemanticCue;
  index: number;
  frame: number;
  fps: number;
  palette: ProgressivePalette;
  stagePosition: "left" | "right";
}) => {
  const color = palette[cue.accent ?? "accent"];
  const startFrame = Math.round(cue.at * fps);
  const enter = progress(frame, startFrame, startFrame + 14);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 13,
        minHeight: 68,
        padding: "10px 14px",
        border: `1px solid ${color}55`,
        ...(stagePosition === "left"
          ? { borderLeft: `4px solid ${color}` }
          : { borderRight: `4px solid ${color}` }),
        borderRadius: stagePosition === "left" ? "0 16px 16px 0" : "16px 0 0 16px",
        background: `linear-gradient(90deg, ${palette.surface}, ${palette.surfaceSoft})`,
        opacity: enter,
        translate: `${(1 - enter) * (stagePosition === "left" ? -22 : 22)}px 0`,
      }}
    >
      <div
        style={{
          flex: "0 0 auto",
          width: 34,
          height: 34,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 10,
          backgroundColor: `${color}1c`,
          color,
          fontFamily: theme.monoFont,
          fontSize: ["DB", "IMG", "Aa"].includes(cueMark(cue.kind)) ? 12 : 21,
          fontWeight: 800,
        }}
      >
        {cueMark(cue.kind)}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            color,
            fontFamily: theme.monoFont,
            fontSize: 13,
            letterSpacing: 1.4,
            textTransform: "uppercase",
          }}
        >
          <span>{String(index + 1).padStart(2, "0")}</span>
          <span>{cueHeading(cue)}</span>
        </div>
        <div
          style={{
            marginTop: 4,
            color: palette.text,
            fontFamily: theme.displayFont,
            fontSize: 21,
            fontWeight: 700,
            lineHeight: 1.12,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {cue.label ?? "语义状态已建立"}
        </div>
      </div>
      <div
        style={{
          flex: "0 0 auto",
          color,
          fontFamily: theme.monoFont,
          fontSize: 13,
          letterSpacing: 1,
        }}
      >
        DONE
      </div>
    </div>
  );
};

const ActiveCueCard = ({
  cue,
  index,
  frame,
  fps,
  portrait,
  palette,
  stagePosition,
}: {
  cue: SemanticCue;
  index: number;
  frame: number;
  fps: number;
  portrait: boolean;
  palette: ProgressivePalette;
  stagePosition: "left" | "right";
}) => {
  const startFrame = Math.round(cue.at * fps);
  const stateFrame = Math.round((cue.stateAt ?? cue.at + 0.8) * fps);
  const enter = progress(frame, startFrame, startFrame + 14);
  const stateProgress = progress(frame, stateFrame - 8, stateFrame + 18);
  const color = palette[cue.accent ?? "accent"];

  return (
    <div
      style={{
        ...panelStyle,
        position: "relative",
        padding: portrait ? 20 : 22,
        backgroundColor: palette.surface,
        boxShadow: palette.shadow,
        border: `1px solid ${palette.border}`,
        borderColor: `${color}88`,
        ...(stagePosition === "left"
          ? { borderLeft: `5px solid ${color}` }
          : { borderRight: `5px solid ${color}` }),
        borderRadius: stagePosition === "left" ? "24px" : "24px",
        opacity: enter,
        translate: `${(1 - enter) * -22}px 0`,
        scale: 0.98 + enter * 0.02,
        pointerEvents: "none",
      }}
    >
      <CueTitle cue={cue} color={color} index={index} />
      <CueVisual
        cue={cue}
        frame={frame}
        stateFrame={stateFrame}
        stateProgress={stateProgress}
        palette={palette}
      />
    </div>
  );
};

export const ProgressiveStage = ({ scene }: { scene: StageScene }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const portrait = height > width;
  const genericStage = scene.layoutProfile === "talking-head-progressive-stage";
  const tone = scene.stageTone ?? scene.styleProfile ?? (genericStage ? "editorial-neutral" : "clinical-tech");
  const palette = getProgressivePalette(tone);
  const stagePosition = scene.stagePosition ?? "left";
  const cues = scene.semanticCues ?? [];
  const visibleCues = cues.filter(
    (cue) => Math.round(cue.at * fps) <= frame,
  );
  const activeCue = visibleCues[visibleCues.length - 1];
  const context = scene.layers.find((layer) => layer.role === "context");

  return (
    <div
      style={{
        position: "absolute",
        ...(stagePosition === "left"
          ? { left: portrait ? "6%" : "4.5%" }
          : { right: portrait ? "6%" : "4.5%" }),
        top: portrait ? "7%" : "13%",
        width: "42%",
        minHeight: portrait ? 420 : 338,
        padding: portrait ? 28 : 30,
        boxSizing: "border-box",
        ...(stagePosition === "left"
          ? {
              borderLeft: `4px solid ${palette.accent}`,
              borderRadius: "0 24px 24px 0",
            }
          : {
              borderRight: `4px solid ${palette.accent}`,
              borderRadius: "24px 0 0 24px",
            }),
        background: `linear-gradient(110deg, ${palette.surface}, ${palette.surfaceSoft} 72%, transparent)`,
        boxShadow: palette.shadow,
        zIndex: 7,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          color: palette.accent,
          fontFamily: theme.monoFont,
          fontSize: 15,
          letterSpacing: 2.5,
          marginBottom: 10,
        }}
      >
        {genericStage
          ? "PROGRESSIVE STAGE · 递进编辑舞台"
          : "SEMANTIC RAIL · 口播语义轨"}
      </div>
      <div
        style={{
          fontFamily: theme.displayFont,
          fontSize: portrait ? 34 : 32,
          fontWeight: 760,
          lineHeight: 1.15,
        }}
      >
        {context?.body ??
          (genericStage ? "一句话，一个视觉阶段" : "一句话，一个视觉状态")}
      </div>
      <div
        style={{
          position: "relative",
          display: "grid",
          gap: 12,
          marginTop: 20,
          paddingLeft: stagePosition === "left" ? 8 : 0,
          paddingRight: stagePosition === "right" ? 8 : 0,
        }}
      >
        <div
          style={{
            position: "absolute",
            ...(stagePosition === "left" ? { left: 0 } : { right: 0 }),
            top: 10,
            bottom: 10,
            width: 2,
            borderRadius: 2,
            background: `linear-gradient(180deg, ${palette.accent}, ${palette.border})`,
            opacity: 0.7,
          }}
        />
        {visibleCues.slice(0, -1).map((cue, index) => (
          <CompactCueRow
            key={cue.id}
            cue={cue}
            index={index}
            frame={frame}
            fps={fps}
            palette={palette}
            stagePosition={stagePosition}
          />
        ))}
        {activeCue ? (
          <ActiveCueCard
            cue={activeCue}
            index={visibleCues.length - 1}
            frame={frame}
            fps={fps}
            portrait={portrait}
            palette={palette}
            stagePosition={stagePosition}
          />
        ) : null}
      </div>
    </div>
  );
};

export const SemanticRail = ProgressiveStage;
