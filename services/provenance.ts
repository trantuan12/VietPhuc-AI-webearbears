import sourcesData from "../data/sources.json" with { type: "json" };
import { Source, CulturalAnchor, ApprovedFact, CulturalRule } from "../types/culture";
import { DEV_ALLOW_UNVERIFIED_DATA } from "./constants";

const sources: Source[] = sourcesData as Source[];
const verifiedSourceIds = new Set(
  sources.filter((s) => s.verified === true).map((s) => s.id)
);

export function isVerifiedCulturalObject(obj: {
  verified?: boolean;
  source_ids?: string[];
}): boolean {
  if (DEV_ALLOW_UNVERIFIED_DATA === true) {
    return true;
  }
  if (obj.verified !== true) {
    return false;
  }
  if (obj.source_ids !== undefined) {
    if (!Array.isArray(obj.source_ids) || obj.source_ids.length === 0) {
      return false;
    }
    for (const srcId of obj.source_ids) {
      if (!verifiedSourceIds.has(srcId)) {
        return false;
      }
    }
  }
  return true;
}

export function filterVerifiedAnchors(anchors: CulturalAnchor[]): CulturalAnchor[] {
  return anchors.filter((a) => isVerifiedCulturalObject(a));
}

export function filterVerifiedFacts(facts: ApprovedFact[]): ApprovedFact[] {
  return facts.filter((f) => isVerifiedCulturalObject(f));
}

export function filterVerifiedRules(rules: CulturalRule[], garmentId: string): CulturalRule[] {
  return rules.filter(
    (r) => r.garment_id === garmentId && isVerifiedCulturalObject(r)
  );
}
