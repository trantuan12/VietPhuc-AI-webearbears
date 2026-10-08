import { StylistRequestPayload, StylistApiResponse } from "../types/api";
import { handleRemix } from "./remixHandler";
import { handleRepair } from "./repairHandler";
import { RequestValidationError } from "./requestValidator";

export async function handleStylistRequest(
  payload: StylistRequestPayload
): Promise<StylistApiResponse> {
  if (!payload || typeof payload !== "object") {
    throw new RequestValidationError("Payload must be an object");
  }

  if (payload.action === "remix") {
    return await handleRemix(payload);
  } else if (payload.action === "repair") {
    return await handleRepair(payload);
  } else {
    throw new RequestValidationError(`Unsupported action: ${(payload as any).action}`);
  }
}

export async function stylistApi(
  payload: StylistRequestPayload
): Promise<StylistApiResponse> {
  // If running in browser, proxy through the backend server endpoint
  if (typeof window !== "undefined") {
    const response = await fetch("/api/stylist", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      let errData: any;
      try {
        errData = await response.json();
      } catch {
        // non-json response
      }
      const message = errData?.error || `HTTP ${response.status}: ${response.statusText}`;
      const error = new Error(message);
      (error as any).status = response.status;
      throw error;
    }

    const data: StylistApiResponse = await response.json();
    return data;
  }

  // If running on server or in test runtime
  return await handleStylistRequest(payload);
}
