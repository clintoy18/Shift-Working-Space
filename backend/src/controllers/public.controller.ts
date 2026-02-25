// controllers/publicController.ts
import { Request, Response } from "express";
import User from "../models/User";

// ─── GET SHIFTY USER COUNT (PUBLIC - NO AUTH REQUIRED) ────────────────────────

export const getShiftyCount = async (req: Request, res: Response): Promise<void> => {
  try {
    const shiftyCount = await User.countDocuments({ role: "shifty", isDeleted: false });

    res.status(200).json({
      shiftyCount,
    });
  } catch (err) {
    console.error("Error fetching shifty count:", err);
    res.status(500).json({ message: "An internal server error has occurred." });
  }
};
