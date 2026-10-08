import { CulturalRule, InventoryItem, RemixTier } from "../types/culture";
import { runDeterministicRules } from "./ruleEngine";

export function generateRepairCandidates(
  conflictItemId: string,
  eventId: string,
  remixTier: RemixTier,
  deterministicRules: CulturalRule[],
  currentAccessories: string[],
  inventory: InventoryItem[]
): string[] {
  const conflictItem = inventory.find((i) => i.id === conflictItemId);
  if (!conflictItem) {
    return [];
  }

  const category = conflictItem.category;
  const candidates: string[] = [];

  for (const item of inventory) {
    if (item.id === conflictItemId) continue;
    if (item.category !== category) continue;
    if (!item.allowed_events.includes(eventId)) continue;
    if (!item.remix_tiers.includes(remixTier)) continue;

    const testAccessories = currentAccessories.map((id) =>
      id === conflictItemId ? item.id : id
    );

    const testFindings = runDeterministicRules(deterministicRules, eventId, testAccessories);
    const hasConflict = testFindings.some((f) => f.result === "conflict");
    if (!hasConflict) {
      candidates.push(item.id);
    }
  }

  return candidates;
}
