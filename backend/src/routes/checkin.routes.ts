import express from "express";
import {
  checkIn,
  checkOut,
  getCheckInDetails,
  getActiveCheckIns,
  getCheckInHistory,
  updateCheckIn,
  extendCheckIn,
  applyPenalty,
  getTimeoutWarnings,
} from "../controllers/checkin.controller";
import { authenticate, checkRole } from "../middleware/auth.middleware";
import { apiLimiter } from "../middleware/rateLimiter.middleware";
import { detectBot, detectScrapingPattern } from "../middleware/botDetection.middleware";

const router = express.Router();

// Apply bot detection to all routes
router.use(detectBot);
router.use(detectScrapingPattern);

// --- Public Routes (rate-limited) ---
// Guest and registered user check-in
router.post("/", apiLimiter, checkIn);

// Guest and registered user check-out
router.post("/checkout", apiLimiter, checkOut);

// --- Protected Routes (auth + role required) ---
// IMPORTANT: Specific routes must come BEFORE generic /:checkInId route
// Get active check-ins (cashier, admin)
router.get(
  "/active",
  authenticate,
  checkRole("cashier", "admin"),
  getActiveCheckIns
);

// Get timeout warnings (cashier, admin)
router.get(
  "/warnings",
  authenticate,
  checkRole("cashier", "admin"),
  getTimeoutWarnings
);

// Get check-in history (cashier, admin)
router.get(
  "/history",
  authenticate,
  checkRole("cashier", "admin"),
  getCheckInHistory
);

// Update check-in (cashier, admin)
router.patch(
  "/:checkInId",
  authenticate,
  checkRole("cashier", "admin"),
  updateCheckIn
);

// Extend check-in duration (cashier, admin)
router.post(
  "/:checkInId/extend",
  authenticate,
  checkRole("cashier", "admin"),
  extendCheckIn
);

// Apply penalty charge (cashier, admin)
router.post(
  "/:checkInId/penalty",
  authenticate,
  checkRole("cashier", "admin"),
  applyPenalty
);

// Get check-in details (public - by checkInId)
// IMPORTANT: This must come LAST because it's a catch-all route
router.get("/:checkInId", apiLimiter, getCheckInDetails);

export default router;
