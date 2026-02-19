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

const router = express.Router();

const adminOnly = [authenticate, checkRole("admin")];

// ─── User Management ──────────────────────────────────────────────────────────
router.post  ("/user/create",         ...adminOnly, createUser);
router.put   ("/user/update/:userId", ...adminOnly, updateUser);
router.delete("/user/delete/:userId", ...adminOnly, deleteUser);
router.get   ("/user/recent",         ...adminOnly, getRecentUsers);  
router.get   ("/user/:userId",        ...adminOnly, getUser);
router.get   ("/user",                ...adminOnly, getAllUsers);

// ─── Filters & Stats ──────────────────────────────────────────────────────────
router.get("/getUsersByRole",  ...adminOnly, getUsersByRole);
router.get("/dashboard-stats",  getDashboardStats);

export default router;