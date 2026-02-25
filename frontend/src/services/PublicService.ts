// src/services/PublicService.ts
import { publicApi } from "@/lib/api";

export interface ShiftyCountResponse {
  shiftyCount: number;
}

/**
 * Fetch count of users with shifty role
 * This endpoint is public and does not require authentication
 */
export const fetchShiftyCount = async (): Promise<number> => {
  try {
    const res = await publicApi.get("/shifty-count");
    return res.data.shiftyCount;
  } catch (err) {
    console.error("Failed to fetch shifty count:", err);
    // Return fallback data
    return 0;
  }
};
