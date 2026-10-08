import { Garment, EventData, InventoryItem, CulturalRule } from "../types/culture";
import { RemixRequestPayload, RepairRequestPayload } from "../types/api";
import { DEFAULT_GARMENT_ID } from "./constants";
import { runDeterministicRules } from "./ruleEngine";

export class RequestValidationError extends Error {
  public statusCode = 400;
  constructor(message: string) {
    super(message);
    this.name = "RequestValidationError";
  }
}

const VALID_REMIX_TIERS = ["classic", "fusion", "genz"];

export function validateRemixRequest(
  payload: any,
  garments: Garment[],
  events: EventData[]
): RemixRequestPayload {
  if (!payload || typeof payload !== "object") {
    throw new RequestValidationError("Payload must be an object");
  }

  if (payload.action !== "remix") {
    throw new RequestValidationError("Action must be 'remix'");
  }

  const garmentId = payload.base_garment_id || DEFAULT_GARMENT_ID;
  if (!garments.some((g) => g.id === garmentId)) {
    throw new RequestValidationError(`Invalid base_garment_id: ${garmentId}`);
  }

  if (!payload.event_id || !events.some((e) => e.id === payload.event_id)) {
    throw new RequestValidationError(`Invalid event_id: ${payload.event_id}`);
  }

  if (!payload.remix_tier || !VALID_REMIX_TIERS.includes(payload.remix_tier)) {
    throw new RequestValidationError(`Invalid remix_tier: ${payload.remix_tier}`);
  }

  if (typeof payload.user_prompt !== "string") {
    throw new RequestValidationError("user_prompt must be a string");
  }

  return {
    action: "remix",
    base_garment_id: garmentId,
    event_id: payload.event_id,
    remix_tier: payload.remix_tier,
    user_prompt: payload.user_prompt,
    current_colors: payload.current_colors,
  };
}

export function validateRepairRequest(
  payload: any,
  garments: Garment[],
  events: EventData[],
  inventory: InventoryItem[],
  deterministicRules: CulturalRule[]
): { payload: RepairRequestPayload; canonicalConflictItemId: string | null } {
  if (!payload || typeof payload !== "object") {
    throw new RequestValidationError("Payload must be an object");
  }

  if (payload.action !== "repair") {
    throw new RequestValidationError("Action must be 'repair'");
  }

  const garmentId = payload.base_garment_id || DEFAULT_GARMENT_ID;
  if (!garments.some((g) => g.id === garmentId)) {
    throw new RequestValidationError(`Invalid base_garment_id: ${garmentId}`);
  }

  if (!payload.event_id || !events.some((e) => e.id === payload.event_id)) {
    throw new RequestValidationError(`Invalid event_id: ${payload.event_id}`);
  }

  if (!payload.remix_tier || !VALID_REMIX_TIERS.includes(payload.remix_tier)) {
    throw new RequestValidationError(`Invalid remix_tier: ${payload.remix_tier}`);
  }

  if (!payload.current_config || !Array.isArray(payload.current_config.accessories)) {
    throw new RequestValidationError("current_config.accessories must be an array");
  }

  const validInventoryIds = new Set(inventory.map((i) => i.id));
  for (const accId of payload.current_config.accessories) {
    if (!validInventoryIds.has(accId)) {
      throw new RequestValidationError(`Invalid accessory id: ${accId}`);
    }
  }

  // Self-run rule engine on current config to find canonical conflict item
  const findings = runDeterministicRules(
    deterministicRules,
    payload.event_id,
    payload.current_config.accessories
  );
  const conflictFinding = findings.find((f) => f.result === "conflict");
  const canonicalConflictItemId = conflictFinding?.evidence || null;

  if (payload.conflict_item_id !== canonicalConflictItemId) {
    throw new RequestValidationError("CONFLICT_ITEM_MISMATCH");
  }

  return {
    payload: {
      action: "repair",
      base_garment_id: garmentId,
      event_id: payload.event_id,
      remix_tier: payload.remix_tier,
      conflict_item_id: payload.conflict_item_id,
      current_config: payload.current_config,
      semantic_snapshot: payload.semantic_snapshot ?? null,
    },
    canonicalConflictItemId,
  };
}
