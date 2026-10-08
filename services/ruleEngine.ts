import { CulturalRule } from "../types/culture";
import { Finding } from "../types/ai";

export function runDeterministicRules(
  rules: CulturalRule[],
  eventId: string,
  accessories: string[]
): Finding[] {
  const findings: Finding[] = [];
  const deterministicRules = rules.filter((r) => r.evaluation_type === "deterministic");

  for (const rule of deterministicRules) {
    if (!rule.conditions) continue;

    const { applicable_events, forbidden_combinations } = rule.conditions;
    if (applicable_events && applicable_events.length > 0 && !applicable_events.includes(eventId)) {
      continue;
    }

    if (!forbidden_combinations) continue;

    for (const combo of forbidden_combinations) {
      const forbiddenItem = combo.item_ids.find((id) => accessories.includes(id));
      if (forbiddenItem) {
        findings.push({
          rule_id: rule.id,
          anchor_id: rule.anchor_id,
          result: "conflict",
          target_visual: rule.target_visual,
          evidence: forbiddenItem,
          explanation: combo.reason || rule.description,
          source_ids: rule.source_ids || [],
        });
      }
    }
  }

  return findings;
}
