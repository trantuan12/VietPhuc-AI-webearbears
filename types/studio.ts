import { TargetVisual, EvaluationResult } from "./culture";

export type ViewAngle = "front" | "side" | "back";

export interface OutfitConfig {
  colors: {
    body: string;
    collar: string;
    pants?: string;
    inner?: string;
    belt?: string;
  };
  accessories: string[];
  motifs?: string[];
  stickers?: string[];
  pattern?: string;
}

export type VisualState = Record<TargetVisual, EvaluationResult>;
