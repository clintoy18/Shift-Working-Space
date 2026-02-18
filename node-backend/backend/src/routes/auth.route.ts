import express from "express";
import { login, register } from "../controllers/auth.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = express.Router();

// No more multer/privateUpload middleware needed here
router.post("/register", register);
router.post("/login", login);
router.get("/validate", authenticate, (req, res) => {
    res.json({ valid: true, user: req.user });
});

export default router;