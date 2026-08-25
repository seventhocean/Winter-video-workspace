import type {ReactNode} from "react";
import {Video} from "@remotion/media";
import {Img, staticFile, useCurrentFrame, useVideoConfig} from "remotion";
import type {StageLayer} from "../schema";
import {progress} from "../motion";
import {accentColor, panelStyle, theme} from "../theme";
import {HyperFramesOverlay} from "./HyperFramesOverlay";

const Panel = ({
  children,
  compact = false,
}: {
  children: ReactNode;
  compact?: boolean;
}) => (
  <div
    style={{
      ...panelStyle,
      padding: compact ? "20px 24px" : "28px 32px",
      color: theme.text,
      fontFamily: theme.bodyFont,
      width: "100%",
      boxSizing: "border-box",
    }}
  >
    {children}
  </div>
);

const Label = ({children, color}: {children: ReactNode; color: string}) => (
  <div
    style={{
      color,
      fontFamily: theme.monoFont,
      fontSize: 20,
      letterSpacing: 3,
      marginBottom: 14,
    }}
  >
    {children}
  </div>
);

const TextBlock = ({layer}: {layer: StageLayer}) => {
  const color = accentColor(layer.accent);
  const staticEmphasis = layer.motionMode === "static-emphasis";

  if (staticEmphasis) {
    return (
      <div
        style={{
          padding: "22px 26px",
          borderLeft: `6px solid ${color}`,
          background:
            "linear-gradient(90deg, rgba(4,17,31,.88), rgba(4,17,31,.28))",
          borderRadius: "0 20px 20px 0",
        }}
      >
        <Label color={color}>{layer.title ?? "KEY LINE"}</Label>
        <div
          style={{
            fontFamily: theme.displayFont,
            fontSize: 58,
            fontWeight: 760,
            lineHeight: 1.16,
          }}
        >
          {layer.body ?? layer.title}
        </div>
      </div>
    );
  }

  return (
    <Panel>
      <Label color={color}>{layer.title ?? "CONTEXT"}</Label>
      <div
        style={{
          fontFamily: theme.displayFont,
          fontSize: 46,
          fontWeight: 720,
          lineHeight: 1.22,
        }}
      >
        {layer.body ?? layer.title}
      </div>
    </Panel>
  );
};

const MetricGauge = ({layer}: {layer: StageLayer}) => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();
  const portrait = height > width;
  const color = accentColor(layer.accent);
  const amount = progress(frame, 4, 34);
  const value = Math.round((layer.value ?? 0) * amount);
  const circumference = 2 * Math.PI * 54;

  return (
    <Panel>
      <Label color={color}>{layer.title ?? "METRIC"}</Label>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: portrait
            ? "112px minmax(0, 1fr)"
            : "142px minmax(0, 1fr)",
          alignItems: "center",
          gap: 24,
        }}
      >
        <svg
          viewBox="0 0 132 132"
          style={{
            width: portrait ? 112 : 142,
            height: portrait ? 112 : 142,
          }}
        >
          <circle
            cx="66"
            cy="66"
            r="54"
            fill="none"
            stroke={theme.border}
            strokeWidth="10"
          />
          <circle
            cx="66"
            cy="66"
            r="54"
            fill="none"
            stroke={color}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - value / 100)}
            transform="rotate(-90 66 66)"
          />
        </svg>
        <div>
          <div
            style={{
              fontSize: portrait ? 62 : 76,
              lineHeight: 1,
              fontWeight: 820,
              fontFamily: theme.displayFont,
            }}
          >
            {value}
            <span style={{fontSize: 32, color}}>{layer.unit}</span>
          </div>
          <div
            style={{marginTop: 12, color: theme.mutedText, fontSize: 28}}
          >
            关键词处完成变化
          </div>
        </div>
      </div>
    </Panel>
  );
};

const DataStack = ({layer}: {layer: StageLayer}) => {
  const frame = useCurrentFrame();
  const color = accentColor(layer.accent);
  const items = layer.items ?? [];

  return (
    <Panel>
      <Label color={color}>{layer.title ?? "DATA STACK"}</Label>
      <div style={{display: "flex", flexDirection: "column", gap: 12}}>
        {items.map((item, index) => {
          const itemProgress = progress(frame, 4 + index * 7, 16 + index * 7);
          return (
            <div
              key={item}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                padding: "15px 18px",
                borderRadius: 14,
                backgroundColor: theme.surfaceSoft,
                border: `1px solid ${theme.border}`,
                opacity: itemProgress,
                translate: `${(1 - itemProgress) * 26}px 0`,
              }}
            >
              <span
                style={{
                  width: 11,
                  height: 11,
                  borderRadius: "50%",
                  backgroundColor:
                    index === items.length - 1 ? color : theme.mutedText,
                }}
              />
              <span style={{fontSize: 30}}>{item}</span>
            </div>
          );
        })}
      </div>
    </Panel>
  );
};

const NodeNetwork = ({layer}: {layer: StageLayer}) => {
  const frame = useCurrentFrame();
  const color = accentColor(layer.accent);
  const items = layer.items ?? [];
  const lineProgress = progress(frame, 10, 42);

  return (
    <Panel>
      <Label color={color}>{layer.title ?? "NETWORK"}</Label>
      <div
        style={{
          position: "relative",
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          gap: 18,
          minHeight: 224,
        }}
      >
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          style={{position: "absolute", inset: 0, width: "100%", height: "100%"}}
        >
          <path
            d="M 18 22 C 48 22, 52 78, 82 78 M 82 22 C 52 22, 48 78, 18 78"
            fill="none"
            stroke={color}
            strokeWidth="0.8"
            strokeDasharray="100"
            strokeDashoffset={100 * (1 - lineProgress)}
            opacity=".62"
          />
        </svg>
        {items.map((item, index) => {
          const itemProgress = progress(frame, index * 7, 15 + index * 7);
          return (
            <div
              key={item}
              style={{
                position: "relative",
                zIndex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: 92,
                borderRadius: 17,
                border: `1px solid ${
                  index === items.length - 1 ? color : theme.border
                }`,
                backgroundColor: theme.surfaceSoft,
                fontSize: 30,
                fontWeight: 680,
                opacity: itemProgress,
                scale: 0.9 + itemProgress * 0.1,
              }}
            >
              {item}
            </div>
          );
        })}
      </div>
    </Panel>
  );
};

const ProtectedCallout = ({layer}: {layer: StageLayer}) => (
  <Panel compact>
    <Label color={accentColor(layer.accent)}>
      {layer.title ?? "LOCAL CALLOUT"}
    </Label>
    <div style={{fontSize: 34, lineHeight: 1.34}}>{layer.body}</div>
  </Panel>
);

const AssetFrame = ({layer}: {layer: StageLayer}) => {
  if (!layer.assetId) return null;
  const isVideo = /\.(mp4|mov|webm)$/i.test(layer.assetId);

  return (
    <div
      style={{
        ...panelStyle,
        padding: 10,
        overflow: "hidden",
        width: "100%",
        aspectRatio: "16 / 9",
      }}
    >
      {isVideo ? (
        <Video
          src={staticFile(layer.assetId)}
          muted
          objectFit="cover"
          style={{
            width: "100%",
            height: "100%",
            borderRadius: 14,
          }}
        />
      ) : (
        <Img
          src={staticFile(layer.assetId)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            borderRadius: 14,
          }}
        />
      )}
    </div>
  );
};

export const VisualBlock = ({layer}: {layer: StageLayer}) => {
  if (layer.kind === "text") return <TextBlock layer={layer} />;
  if (layer.kind === "metric-gauge") return <MetricGauge layer={layer} />;
  if (layer.kind === "data-stack") return <DataStack layer={layer} />;
  if (layer.kind === "node-network") return <NodeNetwork layer={layer} />;
  if (layer.kind === "protected-callout")
    return <ProtectedCallout layer={layer} />;
  if (layer.kind === "asset-frame") return <AssetFrame layer={layer} />;
  if (layer.kind === "hyperframes-overlay")
    return <HyperFramesOverlay assetId={layer.assetId} />;
  return null;
};
