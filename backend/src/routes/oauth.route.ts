import express from "express";
import { googleCallback, getGoogleConfig } from "../controllers/oauth.controller";
import { authLimiter } from "../middleware/rateLimiter.middleware";

const router = express.Router();

/**
 * POST /api/auth/google/callback
 * Handle Google OAuth token verification and user creation/login
 * Rate limited: 5 requests per 15 minutes
 */
router.post("/google/callback", authLimiter, googleCallback);

/**
 * GET /api/auth/google/config
 * Public endpoint - returns Google Client ID for frontend
 * No authentication required
 */
router.get("/google/config", getGoogleConfig);

export default router;
