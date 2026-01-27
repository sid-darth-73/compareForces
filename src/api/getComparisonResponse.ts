import type {
  StreamUpdatePayload,
  StreamCompletePayload,
} from "../types/comparisonType.ts";
import { API_BASE_URL } from "./config.ts";

interface StreamOptions {
  user1_handle: string;
  user2_handle: string;
  onUpdate: (data: StreamUpdatePayload) => void;
  onComplete: (data: StreamCompletePayload) => void;
  onError: (error: string) => void;
}

export async function streamComparisonResponse({
  user1_handle,
  user2_handle,
  onUpdate,
  onComplete,
  onError,
}: StreamOptions): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/compare/stream`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user1_handle, user2_handle }),
    });

    if (!response.ok || !response.body) {
      throw new Error("Failed to establish stream");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      // Decode the chunk and append to buffer
      buffer += decoder.decode(value, { stream: true });

      // Split by double newline (SSE-style delimiter)
      const parts = buffer.split("\n\n");

      // Keep the last part in buffer if it's incomplete
      buffer = parts.pop() || "";

      for (const part of parts) {
        const trimmed = part.trim();
        if (!trimmed) continue;

        if (trimmed.startsWith("data:")) {
          try {
            const jsonStr = trimmed.replace(/^data:\s*/, "").trim();
            if (!jsonStr) continue;

            const data = JSON.parse(jsonStr);

            if (data.type === "update") {
              onUpdate(data);
            } else if (data.type === "complete") {
              onComplete(data);
              // Once we receive a complete payload we can safely stop reading.
              return;
            }
          } catch (e) {
            console.error("Error parsing stream chunk", e);
          }
        }
      }
    }
  } catch (err: unknown) {
    console.error("Stream error:", err);
    const message =
      err instanceof Error ? err.message : "Connection lost during comparison.";
    onError(message);
  }
}