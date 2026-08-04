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
  engine: "remotion" | "hyperframes" | "hybrid";
  spatialAnchors: Anchor[];
  topology: string;
  stateChange: string;
  protectedRegions: string[];
  overlayBudget: number;
  layers: StageLayer[];
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
