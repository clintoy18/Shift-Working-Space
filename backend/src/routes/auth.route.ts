import express from "express";
import { login, register, getMe, updateMe } from "../controllers/auth.controller";
import { authenticate } from "../middleware/auth.middleware";
import { authLimiter, apiLimiter } from "../middleware/rateLimiter.middleware";

const router = express.Router();

// Apply rate limiting to authentication endpoints
router.post("/register", authLimiter, register);
router.post("/login", authLimiter, login);

// Apply general API rate limiting to authenticated endpoints
router.get("/me", authenticate, apiLimiter, getMe);
router.put("/me/update", authenticate, apiLimiter, updateMe);
router.get("/validate", authenticate, apiLimiter, (req, res) => {
    res.json({ valid: true, user: req.user });
});

export default router;