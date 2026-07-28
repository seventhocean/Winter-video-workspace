import type {CSSProperties} from "react";

export const theme = {
  background: "#07121d",
  surface: "rgba(4, 17, 31, 0.88)",
  surfaceSoft: "rgba(10, 31, 49, 0.76)",
  text: "#f5f9ff",
  mutedText: "#afc0d2",
  accent: "#32aeff",
  success: "#42df86",
  warning: "#ffc34d",
  danger: "#ff6577",
  border: "rgba(127, 199, 255, 0.28)",
  shadow: "0 24px 80px rgba(0, 0, 0, 0.28)",
  displayFont:
    '"SF Pro Display", "PingFang SC", "Microsoft YaHei", system-ui, sans-serif',
  bodyFont:
    '"SF Pro Text", "PingFang SC", "Microsoft YaHei", system-ui, sans-serif',
  monoFont: 'Menlo, Monaco, "Courier New", monospace',
} as const;

export const accentColor = (
  accent: "accent" | "success" | "warning" | "danger" = "accent",
) => theme[accent];

export const panelStyle: CSSProperties = {
  backgroundColor: theme.surface,
  border: `1px solid ${theme.border}`,
  boxShadow: theme.shadow,
  borderRadius: 24,
};
