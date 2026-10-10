export type ScoreDimension = "cultural_anchor" | "event_context" | "remix_compatibility";
export type RuleImportance = "critical" | "high" | "medium" | "low";
export type EvaluationType = "deterministic" | "semantic";
export type EvaluationResult = "safe" | "caution" | "conflict" | "unknown";
export type TargetVisual = "collar" | "torso" | "feet" | "head" | "bag";
export type RemixTier = "classic" | "fusion" | "genz" | "preserve" | "avant_garde";
export type InventoryCategory = "headwear" | "footwear" | "bag";

export interface Source {
  id: string;
  title: string;
  publisher: string;
  url: string;
  accessed_at: string;
  verified: boolean;
}

export interface CulturalAnchor {
  id: string;
  name: string;
  target_visual: TargetVisual;
  description: string;
  verified: boolean;
  source_ids: string[];
}

export interface ApprovedFact {
  id: string;
  text: string;
  verified: boolean;
  source_ids: string[];
}

export interface Garment {
  id: string;
  name: string;
  dynasty: string;
  original_visual_config: {
    colors: {
      body: string;
      collar: string;
    };
    default_accessories: string[];
  };
  anchors: CulturalAnchor[];
  educational_facts: ApprovedFact[];
  verified: boolean;
  source_ids: string[];
}

export interface ForbiddenCombination {
  category: InventoryCategory;
  item_ids: string[];
  reason: string;
}

export interface RuleConditions {
  applicable_events: string[];
  forbidden_combinations: ForbiddenCombination[];
}

export interface SemanticCriteria {
  caution_when: string;
  conflict_when: string;
}

export interface CulturalRule {
  id: string;
  garment_id: string;
  evaluation_type: EvaluationType;
  score_dimension: ScoreDimension;
  importance: RuleImportance;
  target_visual: TargetVisual;
  anchor_id?: string;
  penalties: {
    caution: number;
    conflict: number;
  };
  conditions?: RuleConditions;
  semantic_criteria?: SemanticCriteria;
  verified: boolean;
  source_ids: string[];
  description: string;
}

export interface EventData {
  id: string;
  name: string;
  description: string;
  allowed_remix_tiers: RemixTier[];
  tier_mismatch_penalty: number;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: InventoryCategory;
  vibes: string[];
  colors: string[];
  remix_tiers: RemixTier[];
  allowed_events: string[];
  tags: string[];
  asset_path: string;
}
