import { GoogleGenAI } from "@google/genai";
import { GEMINI_MODEL_POOL, GEMINI_TIMEOUT_MS } from "./constants";

export interface GeminiCallParams {
  systemInstruction: string;
  userContent: string;
  responseSchema: any;
  preferredModel?: string;
}

export interface GeminiCallResult {
  data: any;
  rawText: string;
  modelUsed: string;
}

// Theo dõi model đang hoạt động hiện tại trong pool
let currentModelIndex = 0;

// Bộ nhớ đệm cooldown: model -> timestamp hết hạn cooldown
const modelCooldownMap = new Map<string, number>();
const COOLDOWN_DURATION_MS = 60 * 1000; // 60s cooldown khi bị chạm rate-limit (429) hoặc quá tải (503)

export function getActiveGeminiModel(): string {
  return GEMINI_MODEL_POOL[currentModelIndex] || GEMINI_MODEL_POOL[0];
}

export function getAllAvailableModels(): readonly string[] {
  return GEMINI_MODEL_POOL;
}

export async function callGeminiAPI(params: GeminiCallParams): Promise<GeminiCallResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    const err = new Error("MISSING_GEMINI_API_KEY: Vui lòng cấu hình GEMINI_API_KEY trong file .env hoặc AI Studio Secrets");
    (err as any).aiStatus = "error";
    throw err;
  }

  const ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });

  const now = Date.now();
  // Sắp xếp thứ tự thử: bắt đầu từ currentModelIndex hoặc preferredModel, duyệt qua toàn bộ GEMINI_MODEL_POOL
  let startIndex = currentModelIndex;
  if (params.preferredModel) {
    const prefIdx = GEMINI_MODEL_POOL.indexOf(params.preferredModel as any);
    if (prefIdx !== -1) startIndex = prefIdx;
  }

  const orderedModels: string[] = [];
  // 1. Các model chưa bị cooldown
  for (let i = 0; i < GEMINI_MODEL_POOL.length; i++) {
    const idx = (startIndex + i) % GEMINI_MODEL_POOL.length;
    const model = GEMINI_MODEL_POOL[idx];
    const cooldownExpires = modelCooldownMap.get(model) || 0;
    if (cooldownExpires <= now) {
      orderedModels.push(model);
    }
  }

  // 2. Nếu tất cả đều đang cooldown, vẫn thử lại tất cả theo thứ tự pool
  if (orderedModels.length === 0) {
    for (let i = 0; i < GEMINI_MODEL_POOL.length; i++) {
      const idx = (startIndex + i) % GEMINI_MODEL_POOL.length;
      orderedModels.push(GEMINI_MODEL_POOL[idx]);
    }
  }

  let lastError: any = null;
  const attemptsLog: string[] = [];

  for (const modelToTry of orderedModels) {
    const abortController = new AbortController();
    let timer: NodeJS.Timeout | undefined;

    const timeoutPromise = new Promise<never>((_, reject) => {
      timer = setTimeout(() => {
        abortController.abort();
        const err = new Error("GEMINI_TIMEOUT");
        (err as any).isTimeout = true;
        (err as any).aiStatus = "timeout";
        reject(err);
      }, GEMINI_TIMEOUT_MS);
    });

    const callPromise = (async () => {
      const response = await ai.models.generateContent({
        model: modelToTry,
        contents: params.userContent,
        config: {
          systemInstruction: params.systemInstruction,
          responseMimeType: "application/json",
          responseSchema: params.responseSchema,
          temperature: 0.2,
          abortSignal: abortController.signal,
        },
      });
      return response;
    })();

    try {
      const response: any = await Promise.race([callPromise, timeoutPromise]);
      if (timer) clearTimeout(timer);

      const text = response?.text;
      if (!text || typeof text !== "string" || !text.trim()) {
        throw new Error("EMPTY_GEMINI_RESPONSE");
      }

      const trimmed = text.trim();
      let parsed: any;
      try {
        parsed = JSON.parse(trimmed.replace(/^```json\s*/i, "").replace(/```$/i, "").trim());
      } catch (parseErr) {
        throw new Error("INVALID_JSON_RESPONSE");
      }

      // Thành công! Cập nhật currentModelIndex sang model này để các request kế tiếp sử dụng ngay
      const successfulIndex = GEMINI_MODEL_POOL.indexOf(modelToTry as any);
      if (successfulIndex !== -1) {
        currentModelIndex = successfulIndex;
      }
      modelCooldownMap.delete(modelToTry);

      if (attemptsLog.length > 0) {
        console.log(`[AI Auto-Switch Thành Công] Đã tự động đổi sang model "${modelToTry}" sau khi các model trước chạm giới hạn.`);
      }

      return {
        data: parsed,
        rawText: trimmed,
        modelUsed: modelToTry,
      };
    } catch (err: any) {
      if (timer) clearTimeout(timer);
      lastError = err;
      const errMsg = err?.message || String(err);
      attemptsLog.push(`${modelToTry}: ${errMsg}`);

      console.warn(
        `[AI Auto-Switch] Model "${modelToTry}" chạm giới hạn/gặp lỗi (${errMsg}). Tự động đổi sang model tiếp theo trong pool...`
      );

      // Đưa model vào cooldown 60s
      modelCooldownMap.set(modelToTry, Date.now() + COOLDOWN_DURATION_MS);
      // Xoay currentModelIndex sang model tiếp theo
      currentModelIndex = (currentModelIndex + 1) % GEMINI_MODEL_POOL.length;
    }
  }

  // Nếu tất cả model trong pool đều thất bại sau khi đã thử hết
  const errorDetails = attemptsLog.join(" | ");
  const friendlyMsg = `Tất cả các model AI trong gói miễn phí (${GEMINI_MODEL_POOL.join(", ")}) đều đã chạm giới hạn ngạch hoặc đang quá tải. Chi tiết: ${lastError?.message || errorDetails}`;
  const finalError = new Error(friendlyMsg);
  (finalError as any).aiStatus = lastError?.aiStatus || "error";
  (finalError as any).statusCode = 503;
  throw finalError;
}
