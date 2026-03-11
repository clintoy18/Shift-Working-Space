import express from "express";
import {
  createUser,
  updateUser,
  deleteUser,
  getUser,
  getAllUsers,
  getUsersByRole,
  getRecentUsers,
  getDashboardStats,
  getSalesReport,
} from "../controllers/admin.controller";
import { authenticate, checkRole } from "../middleware/auth.middleware";
import { apiLimiter } from "../middleware/rateLimiter.middleware";

const router = express.Router();

// Apply rate limiting to all admin endpoints
router.use(apiLimiter);

const adminOnly = [authenticate, checkRole("admin")];

// ─── User Management ──────────────────────────────────────────────────────────
router.post  ("/user/create",         ...adminOnly, createUser);
router.put   ("/user/update/:userId", ...adminOnly, updateUser);
router.delete("/user/delete/:userId", ...adminOnly, deleteUser);
router.get   ("/user/recent",         ...adminOnly, getRecentUsers);  
router.get   ("/user/:userId",        ...adminOnly, getUser);
router.get   ("/user",                ...adminOnly, getAllUsers);

// ─── Filters & Stats ──────────────────────────────────────────────────────────
router.get("/getUsersByRole", ...adminOnly, getUsersByRole);
router.get("/dashboard-stats", ...adminOnly, getDashboardStats);
router.get("/reports/sales", ...adminOnly, getSalesReport);

export default router;