import express from "express";
import { getShiftyCount } from "../controllers/public.controller";
// import { apiLimiter } from "../middleware/rateLimiter.middleware";

const router = express.Router();

// Apply rate limiting to all public endpoints
// router.use(apiLimiter);

// ─── Public Endpoints (NO AUTHENTICATION REQUIRED) ────────────────────────────

// Get count of users with shifty role
router.get("/shifty-count", getShiftyCount);

export default router;
