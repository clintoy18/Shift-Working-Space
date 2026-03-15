import express from "express";
import { login, register, getMe, updateMe } from "../controllers/auth.controller";
import { googleCallback, getGoogleConfig } from "../controllers/oauth.controller";
import { authenticate } from "../middleware/auth.middleware";
import { authLimiter, apiLimiter } from "../middleware/rateLimiter.middleware";

const router = express.Router();

// Email/Password Authentication
router.post("/register", authLimiter, register);
router.post("/login", authLimiter, login);

// Google OAuth
router.post("/google/callback", authLimiter, googleCallback);
router.get("/google/config", getGoogleConfig);

// User endpoints (authenticated)
router.get("/me", authenticate, apiLimiter, getMe);
router.put("/me/update", authenticate, apiLimiter, updateMe);
router.get("/validate", authenticate, apiLimiter, (req, res) => {
    res.json({ valid: true, user: req.user });
});

export default router;
