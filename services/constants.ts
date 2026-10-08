export const DEFAULT_GARMENT_ID = "garment_nhatbinh_01";
export const DEFAULT_EVENT_ID = "event_grad";
export const DEFAULT_REMIX_TIER = "fusion" as const;
export const HEX_COLOR_REGEX = /^#[0-9A-Fa-f]{6}$/;

// Danh sách các model trong gói Free API của người dùng được sắp xếp theo thứ tự ưu tiên
// (Ưu tiên các model quota cao: 500 RPD & tốc độ phản hồi nhanh < 1.5s trước)
export const GEMINI_MODEL_POOL = [
  "gemini-3.5-flash-lite", // RPM: 15, RPD: 500 (~1.3s) - Ưu tiên hàng đầu cho studio mượt mà
  "gemini-3.1-flash-lite", // RPM: 15, RPD: 500 (~1.4s) - Dự phòng dung lượng lớn
  "gemini-flash-lite-latest", // Alias Flash Lite mới nhất (~0.9s)
  "gemini-3.5-flash", // RPM: 5, RPD: 20 (~1.7s)
  "gemini-3.8-flash", // RPM: 5, RPD: 20 - Chất lượng thẩm định cao cấp
  "gemini-3.7-flash", // RPM: 5, RPD: 20 - Suy luận nâng cao
  "gemini-3.6-flash", // RPM: 5, RPD: 20
  "gemini-3-flash-preview", // RPM: 5, RPD: 20
  "gemini-flash-latest", // Alias Flash chung
] as const;

export const GEMINI_MODEL =
  (typeof process !== "undefined" && process?.env?.GEMINI_MODEL) ||
  GEMINI_MODEL_POOL[0];
export const GEMINI_TIMEOUT_MS = 12000;

export const DEV_ALLOW_UNVERIFIED_DATA: boolean = false;

export function normalizeText(t: string | undefined | null): string {
  if (!t) return "";
  return t.toLowerCase().replace(/\s+/g, " ").trim();
}

export function isValidHexColor(c: string | undefined | null): boolean {
  if (!c || typeof c !== "string") return false;
  return HEX_COLOR_REGEX.test(c);
}

export function sanitizeHexColor(c: string | undefined | null, fallback = "#1E3A8A"): string {
  if (isValidHexColor(c)) {
    return (c as string).toUpperCase();
  }
  return fallback.toUpperCase();
}
