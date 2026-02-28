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
} from "../controllers/admin.controller";
import { authenticate, checkRole } from "../middleware/auth.middleware";
import { apiLimiter } from "../middleware/rateLimiter.middleware";

const router = express.Router();

// Apply rate limiting to all admin endpoints
router.use(apiLimiter);

const adminOnly = [authenticate, checkRole("admin")];
const adminOrCashier = [authenticate, checkRole("admin", "cashier")];

// ─── User Management ──────────────────────────────────────────────────────────
// Admin only - Create, Update, Delete
router.post  ("/user/create",         ...adminOnly, createUser);
router.put   ("/user/update/:userId", ...adminOnly, updateUser);
router.delete("/user/delete/:userId", ...adminOnly, deleteUser);

// Admin or Cashier - Read only (for check-in purposes)
router.get   ("/user/recent",         ...adminOrCashier, getRecentUsers);
router.get   ("/user/:userId",        ...adminOrCashier, getUser);
router.get   ("/user",                ...adminOrCashier, getAllUsers);

// ─── Filters & Stats ──────────────────────────────────────────────────────────
// Admin or Cashier - Get users by role (for check-in purposes)
router.get("/getUsersByRole", ...adminOrCashier, getUsersByRole);
// Admin only - Dashboard stats
router.get("/dashboard-stats", ...adminOnly, getDashboardStats);

export default router;