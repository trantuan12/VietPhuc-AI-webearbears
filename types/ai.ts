import { EvaluationResult, TargetVisual } from "./culture";

export type StyleMatch = "strong" | "moderate" | "weak";

export interface CalloutItem {
  title: string;
  subtitle: string;
}

export interface CalloutAnnotations {
  collar?: CalloutItem;
  sleeves?: CalloutItem;
  embroidery?: CalloutItem;
  body?: CalloutItem;
}

export interface InterpretedIntent {
  vibe: string;
  palette_description: string;
  style_match: StyleMatch;
  editorial_story?: string;
  callout_annotations?: CalloutAnnotations;
}

export interface SemanticFindingOutput {
  rule_id: string;
  result: "caution" | "conflict";
  evidence_from_request: string;
  matched_criterion: "caution_when" | "conflict_when";
}

export interface RemixGeminiOutput {
  interpreted_intent: InterpretedIntent;
  outfit_config: {
    colors: {
      body: string;
      collar: string;
      pants?: string;
    };
    accessories: string[];
    motifs?: string[];
    stickers?: string[];
    pattern?: string;
  };
  evaluated_rule_ids: string[];
  semantic_findings: SemanticFindingOutput[];
}

export interface RepairGeminiOutput {
  replaced_item_id: string;
  selected_candidate_id: string;
  vibe_match: StyleMatch;
}

export interface Finding {
  rule_id: string;
  anchor_id?: string;
  result: EvaluationResult;
  target_visual: TargetVisual;
  evidence?: string;
  explanation: string;
  source_ids: string[];
}
