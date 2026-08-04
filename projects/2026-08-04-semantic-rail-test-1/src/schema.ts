export type Anchor =
  | "top-left"
  | "top-right"
  | "center-left"
  | "center"
  | "center-right"
  | "lower-left"
  | "lower-right"
  | "full";

export type LayerRole =
  | "context"
  | "primary"
  | "support"
  | "asset"
  | "ambient"
  | "subtitle";

export type LayerKind =
  | "text"
  | "metric-gauge"
  | "data-stack"
  | "node-network"
  | "protected-callout"
  | "asset-frame"
  | "hyperframes-overlay";

export type MotionMode = "static-emphasis" | "dynamic-support";

export type SemanticCueKind =
  | "text"
  | "icon"
  | "image"
  | "metric"
  | "diagram"
  | "steps"
  | "quote"
  | "thermometer"
  | "signal-flow"
  | "translation-wave"
  | "gps-route"
  | "database-write"
  | "cost-compare";

export type EditorialComposition =
  | "hero-stat"
  | "hero-title"
  | "flow"
  | "steps"
  | "quote"
  | "profile"
  | "media"
  | "bars";

export type SemanticCue = {
  id: string;
  kind: SemanticCueKind;
  at: number;
  stateAt?: number;
  exitAt?: number;
  title?: string;
  label?: string;
  body?: string;
  symbol?: string;
  assetId?: string;
  alt?: string;
  valueFrom?: number;
  valueTo?: number;
  unit?: string;
  nodes?: string[];
  from?: string;
  to?: string;
  accent?: "accent" | "success" | "warning" | "danger";
  composition?: EditorialComposition;
  eyebrow?: string;
  hero?: string;
  suffix?: string;
  secondary?: string;
  persist?: "none" | "label";
  tags?: string[];
  symbols?: string[];
};

export type StageLayer = {
  id: string;
  role: LayerRole;
  kind: LayerKind;
  anchor: Anchor;
  motionMode?: MotionMode;
  appearAt: number;
  emphasizeAt?: number;
  stateAt?: number;
  exitAt?: number;
  title?: string;
  body?: string;
  value?: number;
  unit?: string;
  items?: string[];
  assetId?: string;
  accent?: "accent" | "success" | "warning" | "danger";
  engine?: "remotion" | "hyperframes";
};

export type StageScene = {
  sceneId: string;
  start: number;
  duration: number;
  styleProfile: "clinical-tech";
  layoutProfile: string;
  stageTone?: "clinical-tech" | "editorial-neutral";
  stagePosition?: "left" | "right";
  engine: "remotion" | "hyperframes" | "hybrid";
  spatialAnchors: Anchor[];
  topology: string;
  stateChange: string;
  protectedRegions: string[];
  overlayBudget: number;
  layers: StageLayer[];
  semanticCues?: SemanticCue[];
  motionBeats?: Array<{
    at: number;
    phase: "establish" | "develop" | "transform" | "resolve";
    action: string;
  }>;
};

export type Timeline = {
  fps: number;
  duration: number;
  scenes: StageScene[];
};

export type StageKitProps = {
  sourceFile: string;
  debugSafeZones: boolean;
  timeline: Timeline;
};
