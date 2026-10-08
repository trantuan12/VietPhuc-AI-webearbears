import { CulturalAnchor, ApprovedFact, EvaluationResult, RemixTier } from "./culture";
import { OutfitConfig, VisualState } from "./studio";
import { InterpretedIntent, SemanticFindingOutput, Finding, StyleMatch } from "./ai";

export interface SemanticSnapshot {
  original_prompt: string;
  evaluated_rule_ids: string[];
  semantic_findings: SemanticFindingOutput[];
}

export interface RemixRequestPayload {
  action: "remix";
  base_garment_id?: string;
  event_id: string;
  remix_tier: RemixTier;
  user_prompt: string;
  current_colors?: OutfitConfig["colors"];
}

export interface RepairRequestPayload {
  action: "repair";
  base_garment_id?: string;
  event_id: string;
  remix_tier: RemixTier;
  conflict_item_id: string;
  current_config: OutfitConfig;
  semantic_snapshot?: SemanticSnapshot | null;
}

export type StylistRequestPayload = RemixRequestPayload | RepairRequestPayload;

export interface CulturalScoreData {
  total: number | null;
  breakdown: {
    cultural_anchor: number;
    event_context: number;
    remix_compatibility: number;
  };
  status: EvaluationResult;
  is_complete: boolean;
  score_complete: boolean;
  semantic_analysis_complete: boolean;
}

export interface LastRepairInfo {
  status: "repaired";
  replaced_item_id: string;
  selected_candidate_id: string;
  vibe_match: StyleMatch;
}

export interface RepairDataResponse {
  can_repair: boolean;
  conflict_item_id?: string | null;
  reason?: string | null;
  repair_reason?: string | null;
  candidates?: string[];
  last_repair_info?: LastRepairInfo | null;
}

export interface StylistApiResponse {
  execution_status: {
    ai_status: "ok" | "timeout" | "error";
    model_used?: string;
    score_complete: boolean;
    semantic_analysis_complete: boolean;
  };
  error_message?: string;
  interpreted_intent: InterpretedIntent | null;
  outfit_config: OutfitConfig;
  cultural_evaluation: {
    score: CulturalScoreData;
    findings: Finding[];
  };
  visual_state: VisualState;
  repair_data: RepairDataResponse;
  cultural_content: {
    anchors: CulturalAnchor[];
    educational_facts: ApprovedFact[];
  };
  semantic_snapshot: SemanticSnapshot | null;
}
