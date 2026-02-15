// src/services/StatsService.ts
import { stats } from "@/lib/api";

export const fetchStats = async () => {
  try {
    const res = await stats.get("/"); 
    return res.data; // { totalSeats, totalMembers }
  } catch (err) {
    console.error("Stats API failed, using fallback", err);

    return {
      totalSeats: 120,
      totalMembers: 500,
    };
  }
};