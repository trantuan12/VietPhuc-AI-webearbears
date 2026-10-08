import { useState, useRef, useEffect, useCallback } from "react";
import { RemixTier } from "../types/culture";
import { StylistApiResponse } from "../types/api";
import { stylistApi } from "../services/stylistApi";
import {
  DEFAULT_EVENT_ID,
  DEFAULT_GARMENT_ID,
  DEFAULT_REMIX_TIER,
} from "../services/constants";

export const ERROR_MESSAGES = {
  SEMANTIC_INCOMPLETE:
    "Phần kiểm tra ngữ nghĩa chưa hoàn tất. Các kiểm tra quy tắc tường minh vẫn được giữ nguyên.",
  REPAIR_FAILED:
    "Chưa tìm được phương án thay thế phù hợp. Bản phối của bạn chưa bị thay đổi.",
  NETWORK_ERROR:
    "Không thể kết nối tới hệ thống AI. Bản phối hiện tại vẫn được giữ nguyên.",
  BUSY_TIMEOUT: "AI đang tạm thời bận. Bạn có thể thử lại sau ít giây.",
};

export function getClientErrorMessage(err: any, action: "remix" | "repair"): string | null {
  if (!err) return null;
  if (err.name === "AbortError" || err.message === "AbortError") {
    return null;
  }

  // Nếu message đã là thông báo lỗi rõ ràng từ server / API handler
  if (
    err.message &&
    (err.message.includes("AI") ||
      err.message.includes("Lỗi") ||
      err.message.includes("lỗi") ||
      err.message.includes("Gemini") ||
      err.message.includes("503") ||
      err.message.includes("quá tải"))
  ) {
    return err.message;
  }

  const msg = (err.message || "").toLowerCase();

  if (
    msg.includes("timeout") ||
    msg.includes("503") ||
    msg.includes("504") ||
    msg.includes("429") ||
    msg.includes("busy") ||
    msg.includes("temporarily unavailable") ||
    msg.includes("overloaded")
  ) {
    return "Có lỗi xảy ra: AI Gemini đang quá tải hoặc tạm thời bận (503/Timeout). AI hiện không hoạt động, vui lòng thử lại sau ít giây!";
  }

  if (
    msg.includes("failed to fetch") ||
    msg.includes("networkerror") ||
    msg.includes("fetch failed") ||
    msg.includes("econnrefused") ||
    msg.includes("network")
  ) {
    return "Có lỗi xảy ra: Không thể kết nối tới máy chủ AI. AI hiện không hoạt động!";
  }

  if (msg.includes("semantic") || msg.includes("ngữ nghĩa")) {
    return ERROR_MESSAGES.SEMANTIC_INCOMPLETE;
  }

  if (err.message) {
    return `Có lỗi xảy ra: ${err.message}. AI hiện không hoạt động!`;
  }

  return action === "remix"
    ? "Có lỗi xảy ra từ AI. AI hiện không hoạt động!"
    : ERROR_MESSAGES.REPAIR_FAILED;
}

export function useStudio() {
  const [garmentId, setGarmentId] = useState<string>(DEFAULT_GARMENT_ID);
  const [eventId, setEventId] = useState<string>(DEFAULT_EVENT_ID);
  const [remixTier, setRemixTier] = useState<RemixTier>(DEFAULT_REMIX_TIER);
  const [prompt, setPrompt] = useState<string>("");
  const [pendingAction, setPendingAction] = useState<null | "remix" | "repair">(null);
  const [apiResponse, setApiResponse] = useState<StylistApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const requestIdRef = useRef<number>(0);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const handleRemixAction = useCallback(async (customPrompt?: string, currentColors?: any) => {
    if (pendingAction !== null) return; // Prevent double click

    const currentPrompt = typeof customPrompt === "string" ? customPrompt : prompt;
    setPendingAction("remix");

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    const currentReqId = ++requestIdRef.current;

    try {
      const response = await stylistApi({
        action: "remix",
        base_garment_id: garmentId,
        event_id: eventId,
        remix_tier: remixTier,
        user_prompt: currentPrompt,
        current_colors: currentColors,
      });

      // Ignore stale response
      if (currentReqId !== requestIdRef.current) {
        return;
      }

      setApiResponse(response);

      if (response.execution_status.ai_status !== "ok") {
        setError(response.error_message || "Có lỗi xảy ra: AI hiện không hoạt động!");
      } else {
        setError(null);
      }
    } catch (err: any) {
      if (currentReqId !== requestIdRef.current) {
        return;
      }
      const mappedError = getClientErrorMessage(err, "remix");
      if (mappedError) {
        setError(mappedError);
      }
      // apiResponse is kept intact on error!
    } finally {
      if (currentReqId === requestIdRef.current) {
        setPendingAction(null);
      }
    }
  }, [pendingAction, prompt, garmentId, eventId, remixTier]);

  const handleRepairAction = useCallback(async () => {
    if (pendingAction !== null) return;
    if (!apiResponse?.repair_data?.conflict_item_id) return;

    setPendingAction("repair");

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    const currentReqId = ++requestIdRef.current;

    try {
      const response = await stylistApi({
        action: "repair",
        base_garment_id: garmentId,
        event_id: eventId,
        remix_tier: remixTier,
        conflict_item_id: apiResponse.repair_data.conflict_item_id,
        current_config: apiResponse.outfit_config,
        semantic_snapshot: apiResponse.semantic_snapshot ?? null,
      });

      if (currentReqId !== requestIdRef.current) {
        return;
      }

      setApiResponse(response);

      if (response.execution_status.ai_status !== "ok") {
        setError(response.error_message || "Có lỗi xảy ra: AI hiện không hoạt động!");
      } else if (response.repair_data?.repair_reason === "repair_selection_failed") {
        setError(ERROR_MESSAGES.REPAIR_FAILED);
      } else {
        setError(null);
      }
    } catch (err: any) {
      if (currentReqId !== requestIdRef.current) {
        return;
      }
      const mappedError = getClientErrorMessage(err, "repair");
      if (mappedError) {
        setError(mappedError);
      }
      // apiResponse is kept intact on error!
    } finally {
      if (currentReqId === requestIdRef.current) {
        setPendingAction(null);
      }
    }
  }, [pendingAction, apiResponse, eventId, remixTier, garmentId]);

  // Note: App starts with apiResponse: null as specified in Section 9
  // (Điểm --/100, badge "Chưa đánh giá", Diff 0 Giữ nguyên, 0 Cảnh báo, 0 Xung đột, 3 Chưa kiểm tra)

  return {
    garmentId,
    setGarmentId,
    eventId,
    setEventId,
    remixTier,
    setRemixTier,
    prompt,
    setPrompt,
    pendingAction,
    apiResponse,
    error,
    setError,
    remix: handleRemixAction,
    repair: handleRepairAction,
  };
}
