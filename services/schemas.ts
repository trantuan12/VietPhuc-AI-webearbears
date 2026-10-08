import { Type } from "@google/genai";

export const REMIX_RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    interpreted_intent: {
      type: Type.OBJECT,
      properties: {
        vibe: { type: Type.STRING },
        palette_description: { type: Type.STRING },
        style_match: {
          type: Type.STRING,
          enum: ["strong", "moderate", "weak"],
        },
        callout_annotations: {
          type: Type.OBJECT,
          properties: {
            collar: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                subtitle: { type: Type.STRING },
              },
            },
            sleeves: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                subtitle: { type: Type.STRING },
              },
            },
            embroidery: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                subtitle: { type: Type.STRING },
              },
            },
            body: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                subtitle: { type: Type.STRING },
              },
            },
          },
        },
      },
      required: ["vibe", "palette_description", "style_match"],
    },
    outfit_config: {
      type: Type.OBJECT,
      properties: {
        colors: {
          type: Type.OBJECT,
          properties: {
            body: { type: Type.STRING },
            collar: { type: Type.STRING },
            pants: { type: Type.STRING },
            inner: { type: Type.STRING },
            belt: { type: Type.STRING },
          },
          required: ["body", "collar", "pants"],
        },
        accessories: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
        },
        motifs: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
        },
        stickers: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
        },
        pattern: {
          type: Type.STRING,
        },
      },
      required: ["colors", "accessories"],
    },
    evaluated_rule_ids: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
    semantic_findings: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          rule_id: { type: Type.STRING },
          result: {
            type: Type.STRING,
            enum: ["caution", "conflict"],
          },
          evidence_from_request: { type: Type.STRING },
          matched_criterion: {
            type: Type.STRING,
            enum: ["caution_when", "conflict_when"],
          },
        },
        required: ["rule_id", "result", "evidence_from_request", "matched_criterion"],
      },
    },
  },
  required: [
    "interpreted_intent",
    "outfit_config",
    "evaluated_rule_ids",
    "semantic_findings",
  ],
};

export const REPAIR_RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    replaced_item_id: { type: Type.STRING },
    selected_candidate_id: { type: Type.STRING },
    vibe_match: {
      type: Type.STRING,
      enum: ["strong", "moderate", "weak"],
    },
  },
  required: ["replaced_item_id", "selected_candidate_id", "vibe_match"],
};
