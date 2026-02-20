import express from "express";
import { login, register, getMe, updateMe } from "../controllers/auth.controller";
import { authenticate } from "../middleware/auth.middleware";
import { authLimiter } from "../middleware/rateLimiter.middleware";

const router = express.Router();

// Apply rate limiting to authentication endpoints
router.post("/register", authLimiter, register);
router.post("/login", authLimiter, login);

// This works now!
router.get("/me", authenticate, getMe);
router.put("/me/update", authenticate, updateMe);
router.get("/validate", authenticate, (req, res) => {
    res.json({ valid: true, user: req.user });
});

export default router;