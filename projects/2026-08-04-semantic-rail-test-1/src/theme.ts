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

export type ProgressivePalette = {
  surface: string;
  surfaceSoft: string;
  text: string;
  mutedText: string;
  accent: string;
  success: string;
  warning: string;
  danger: string;
  border: string;
  shadow: string;
};

export const progressivePalettes: Record<
  "clinical-tech" | "editorial-neutral",
  ProgressivePalette
> = {
  "clinical-tech": {
    surface: theme.surface,
    surfaceSoft: theme.surfaceSoft,
    text: theme.text,
    mutedText: theme.mutedText,
    accent: theme.accent,
    success: theme.success,
    warning: theme.warning,
    danger: theme.danger,
    border: theme.border,
    shadow: theme.shadow,
  },
  "editorial-neutral": {
    surface: "rgba(24, 22, 20, 0.78)",
    surfaceSoft: "rgba(43, 39, 34, 0.62)",
    text: "#f7f1e8",
    mutedText: "#c9bfb2",
    accent: "#e6b96e",
    success: "#9acb9f",
    warning: "#e6b96e",
    danger: "#df8f7f",
    border: "rgba(247, 241, 232, 0.24)",
    shadow: "0 24px 80px rgba(0, 0, 0, 0.22)",
  },
};

export const getProgressivePalette = (
  tone: "clinical-tech" | "editorial-neutral" = "clinical-tech",
) => progressivePalettes[tone];
