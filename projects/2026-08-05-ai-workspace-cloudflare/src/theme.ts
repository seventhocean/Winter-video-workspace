import type {CSSProperties} from "react";

export type StyleProfile = "editorial-neutral" | "clinical-tech";

export type ProgressivePalette = {
  background: string;
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

export const styleProfiles: Record<StyleProfile, ProgressivePalette> = {
  "editorial-neutral": {
    background: "#181613",
    surface: "rgba(35, 31, 27, 0.84)",
    surfaceSoft: "rgba(52, 46, 40, 0.64)",
    text: "#f7f1e8",
    mutedText: "#c9bfb2",
    accent: "#e6b96e",
    success: "#9acb9f",
    warning: "#e6b96e",
    danger: "#df8f7f",
    border: "rgba(247, 241, 232, 0.24)",
    shadow: "0 24px 80px rgba(0, 0, 0, 0.22)",
  },
  "clinical-tech": {
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
  },
};

/**
 * Legacy component tokens. Values are CSS variables so one Stage can select
 * its styleProfile without duplicating every visual component.
 */
export const theme = {
  background: "var(--stage-background, #181613)",
  surface: "var(--stage-surface, rgba(35, 31, 27, 0.84))",
  surfaceSoft: "var(--stage-surface-soft, rgba(52, 46, 40, 0.64))",
  text: "var(--stage-text, #f7f1e8)",
  mutedText: "var(--stage-muted-text, #c9bfb2)",
  accent: "var(--stage-accent, #e6b96e)",
  success: "var(--stage-success, #9acb9f)",
  warning: "var(--stage-warning, #e6b96e)",
  danger: "var(--stage-danger, #df8f7f)",
  border: "var(--stage-border, rgba(247, 241, 232, 0.24))",
  shadow: "var(--stage-shadow, 0 24px 80px rgba(0, 0, 0, 0.22))",
  displayFont:
    '"SF Pro Display", "PingFang SC", "Microsoft YaHei", system-ui, sans-serif',
  bodyFont:
    '"SF Pro Text", "PingFang SC", "Microsoft YaHei", system-ui, sans-serif',
  monoFont: 'Menlo, Monaco, "Courier New", monospace',
} as const;

const accentVariables = {
  accent: "var(--stage-accent, #e6b96e)",
  success: "var(--stage-success, #9acb9f)",
  warning: "var(--stage-warning, #e6b96e)",
  danger: "var(--stage-danger, #df8f7f)",
} as const;

export const accentColor = (
  accent: "accent" | "success" | "warning" | "danger" = "accent",
  profile?: StyleProfile,
) => (profile ? styleProfiles[profile][accent] : accentVariables[accent]);

export const progressivePalettes = styleProfiles;

export const getProgressivePalette = (
  profile: StyleProfile = "editorial-neutral",
) => progressivePalettes[profile];

export const styleVariables = (profile: StyleProfile): CSSProperties => {
  const palette = styleProfiles[profile];
  return {
    "--stage-background": palette.background,
    "--stage-surface": palette.surface,
    "--stage-surface-soft": palette.surfaceSoft,
    "--stage-text": palette.text,
    "--stage-muted-text": palette.mutedText,
    "--stage-accent": palette.accent,
    "--stage-success": palette.success,
    "--stage-warning": palette.warning,
    "--stage-danger": palette.danger,
    "--stage-border": palette.border,
    "--stage-shadow": palette.shadow,
  } as CSSProperties;
};

export const panelStyle: CSSProperties = {
  backgroundColor: theme.surface,
  border: `1px solid ${theme.border}`,
  boxShadow: theme.shadow,
  borderRadius: 24,
};
