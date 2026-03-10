// controllers/adminController.ts
import { Request, Response } from "express";
import User from "../models/User";
import CheckIn from "../models/CheckIn";
import bcrypt from "bcryptjs";
import { isValidObjectId } from "mongoose";

// ─── Shared lookup helper ─────────────────────────────────────────────────────

const findActiveUser = (identifier: string) => {
  const query = isValidObjectId(identifier)
    ? { $or: [{ _id: identifier }, { email: identifier }], isDeleted: false }
    : { email: identifier, isDeleted: false };

  return User.findOne(query);
};

const escapeRegex = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// ─── CREATE USER ──────────────────────────────────────────────────────────────

export const createUser = async (req: Request, res: Response): Promise<void> => {
  const { email, password, firstName, lastName, middleName, role, membershipType, membershipStatus } = req.body;

  if (!email || !password || !firstName || !lastName || !role) {
    res.status(400).json({ message: "Required fields are missing." });
    return;
  }

  const validRoles = ["shifty", "cashier", "admin"];
  if (!validRoles.includes(role)) {
    res.status(400).json({ message: `Invalid role. Must be one of: ${validRoles.join(", ")}` });
    return;
  }

  try {
    const existing = await User.findOne({ email, isDeleted: false });
    if (existing) {
      res.status(400).json({ message: "A user with this email already exists." });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = new User({
      email,
      password: hashedPassword,
      firstName,
      middleName,
      lastName,
      role,
      membershipType:   membershipType   ?? "None",
      membershipStatus: membershipStatus ?? "Inactive",
      isVerified: true, // admin-created users skip verification
      isDeleted: false,
    });

    await newUser.save();

    res.status(200).json({
      userId: newUser.id,
      message: "User created successfully.",
    });
  } catch (err) {
    console.error("Error creating user:", err);
    res.status(500).json({ message: "An internal server error has occurred." });
  }
};

// ─── UPDATE USER ──────────────────────────────────────────────────────────────

export const updateUser = async (req: Request, res: Response): Promise<void> => {
  const userId = req.params.userId as string;
  const { firstName, middleName, lastName, role, password, membershipType, membershipStatus } = req.body;

  if (!userId || typeof userId !== 'string') {
    res.status(400).json({ message: "User ID is required." });
    return;
  }

  if (req.body.userId && req.body.userId !== userId) {
    res.status(400).json({ message: "User ID in route does not match User ID in request body." });
    return;
  }

  if (role) {
    const validRoles = ["shifty", "cashier", "admin"];
    if (!validRoles.includes(role)) {
      res.status(400).json({ message: `Invalid role. Must be one of: ${validRoles.join(", ")}` });
      return;
    }
  }

  try {
    const user = await findActiveUser(userId);

    if (!user) {
      res.status(404).json({ message: "User not found." });
      return;
    }

    if (firstName)              user.firstName        = firstName;
    if (middleName !== undefined) user.middleName      = middleName;
    if (lastName)               user.lastName         = lastName;
    if (role)                   user.role             = role;
    if (membershipType)         user.membershipType   = membershipType;
    if (membershipStatus)       user.membershipStatus = membershipStatus;

    if (password && password.trim() !== "") {
      user.password = await bcrypt.hash(password, 12);
    }

    await user.save();

    res.status(200).json({ message: "User updated successfully." });
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ message: "An internal server error has occurred." });
  }
};

// ─── DELETE USER (soft delete) ────────────────────────────────────────────────

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  const userId = req.params.userId as string;

  if (!userId || typeof userId !== 'string') {
    res.status(400).json({ message: "User ID is required." });
    return;
  }

  try {
    const user = await findActiveUser(userId);

    if (!user) {
      res.status(404).json({ message: "User not found." });
      return;
    }

    user.isDeleted = true;
    await user.save();

    res.status(200).json({ message: "User deleted successfully." });
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).json({ message: "An internal server error has occurred." });
  }
};

// ─── GET SINGLE USER ──────────────────────────────────────────────────────────

export const getUser = async (req: Request, res: Response): Promise<void> => {
  const userId = req.params.userId as string;

  if (!userId || typeof userId !== 'string') {
    res.status(400).json({ message: "User ID is required." });
    return;
  }

  try {
    const user = await findActiveUser(userId);

    if (!user) {
      res.status(404).json({ message: "User not found." });
      return;
    }

    res.status(200).json(user); // password auto-stripped by toJSON transform
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({ message: "An internal server error has occurred." });
  }
};

// ─── GET ALL USERS ────────────────────────────────────────────────────────────

export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.find({ isDeleted: false });
    res.status(200).json(users); // password auto-stripped by toJSON transform
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ message: "An internal server error has occurred." });
  }
};

// ─── GET USERS BY ROLE ────────────────────────────────────────────────────────

export const getUsersByRole = async (req: Request, res: Response): Promise<void> => {
  const { role } = req.query;

  if (!role) {
    res.status(400).json({ message: "Role query param is required." });
    return;
  }

  const validRoles = ["shifty", "cashier", "admin"];
  if (!validRoles.includes(role as string)) {
    res.status(400).json({ message: `Invalid role. Must be one of: ${validRoles.join(", ")}` });
    return;
  }

  try {
    const users = await User.find({ role, isDeleted: false });
    res.status(200).json(users);
  } catch (err) {
    console.error("Error fetching users by role:", err);
    res.status(500).json({ message: "An internal server error has occurred." });
  }
};

// ─── GET RECENT USERS ─────────────────────────────────────────────────────────

export const getRecentUsers = async (req: Request, res: Response): Promise<void> => {
  const count = parseInt(req.query.count as string) || 5;

  try {
    const users = await User.find({ isDeleted: false })
      .sort({ createdAt: -1 }) // mongoose timestamps field
      .limit(count);

    if (!users || users.length === 0) {
      res.status(404).json({ message: "No users found." });
      return;
    }

    res.status(200).json(users);
  } catch (err) {
    console.error("Error fetching recent users:", err);
    res.status(500).json({ message: "An internal server error has occurred." });
  }
};

// ─── DASHBOARD STATS ──────────────────────────────────────────────────────────

export const getDashboardStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const [total, admins, cashiers, shifties] = await Promise.all([
      User.countDocuments({ isDeleted: false }),
      User.countDocuments({ role: "admin",   isDeleted: false }),
      User.countDocuments({ role: "cashier", isDeleted: false }),
      User.countDocuments({ role: "shifty",  isDeleted: false }),
    ]);

    res.status(200).json({
      userStats: { total, admins, cashiers, shifties },
    });
  } catch (err) {
    console.error("Error fetching dashboard stats:", err);
    res.status(500).json({ message: "An internal server error has occurred." });
  }
};

// ─── SALES REPORT ────────────────────────────────────────────────────────────

export const getSalesReport = async (req: Request, res: Response): Promise<void> => {
  const { startDate, endDate, reportType, cashierId, cashierName, paymentStatus } = req.query;

  const filter: Record<string, unknown> = { isDeleted: false };

  let rangeStart: Date | undefined;
  let rangeEnd: Date | undefined;

  if (startDate) {
    const parsed = new Date(String(startDate));
    if (Number.isNaN(parsed.getTime())) {
      res.status(400).json({ message: "Invalid startDate." });
      return;
    }
    rangeStart = parsed;
  }

  if (endDate) {
    const parsed = new Date(String(endDate));
    if (Number.isNaN(parsed.getTime())) {
      res.status(400).json({ message: "Invalid endDate." });
      return;
    }
    parsed.setHours(23, 59, 59, 999);
    rangeEnd = parsed;
  }

  if (!rangeStart && !rangeEnd && reportType) {
    const now = new Date();
    const type = String(reportType).toLowerCase();

    if (type === "daily") {
      rangeStart = new Date(now);
      rangeStart.setHours(0, 0, 0, 0);
      rangeEnd = new Date(now);
      rangeEnd.setHours(23, 59, 59, 999);
    } else if (type === "weekly") {
      rangeEnd = new Date(now);
      rangeEnd.setHours(23, 59, 59, 999);
      rangeStart = new Date(now);
      rangeStart.setDate(rangeStart.getDate() - 6);
      rangeStart.setHours(0, 0, 0, 0);
    } else if (type === "monthly") {
      rangeStart = new Date(now.getFullYear(), now.getMonth(), 1);
      rangeStart.setHours(0, 0, 0, 0);
      rangeEnd = new Date(now);
      rangeEnd.setHours(23, 59, 59, 999);
    } else {
      res.status(400).json({ message: "Invalid reportType. Use daily, weekly, or monthly." });
      return;
    }
  }

  if (rangeStart || rangeEnd) {
    filter.checkInTime = {
      ...(rangeStart ? { $gte: rangeStart } : {}),
      ...(rangeEnd ? { $lte: rangeEnd } : {}),
    };
  }

  if (paymentStatus) {
    const allowedStatuses = ["pending", "paid", "refunded"];
    const status = String(paymentStatus).toLowerCase();
    if (!allowedStatuses.includes(status)) {
      res.status(400).json({ message: "Invalid paymentStatus." });
      return;
    }
    filter.paymentStatus = status;
  }

  const processedByOr: Record<string, unknown>[] = [];

  if (cashierId) {
    const cashierIdValue = String(cashierId).trim();
    if (cashierIdValue) {
      processedByOr.push({ processedBy: cashierIdValue });

      if (isValidObjectId(cashierIdValue)) {
        const cashier = await User.findOne({ _id: cashierIdValue, isDeleted: false });
        if (cashier?.fullName) {
          processedByOr.push({ processedBy: cashier.fullName });
        }
      }
    }
  }

  if (cashierName) {
    const cashierNameValue = String(cashierName).trim();
    if (cashierNameValue) {
      processedByOr.push({ processedBy: { $regex: escapeRegex(cashierNameValue), $options: "i" } });
    }
  }

  if (processedByOr.length > 0) {
    filter.$or = processedByOr;
  }

  try {
    const records = await CheckIn.find(filter)
      .sort({ checkInTime: -1 })
      .lean();

    res.status(200).json({
      count: records.length,
      records,
    });
  } catch (err) {
    console.error("Error fetching sales report:", err);
    res.status(500).json({ message: "An internal server error has occurred." });
  }
};