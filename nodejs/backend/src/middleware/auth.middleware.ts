import { Request, Response, NextFunction, RequestHandler } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";

export const authenticate: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;    // This should now represent your 'userId' string
      email: string;
      role: string;
    };

    // ✅ FIX: Query by 'userId' (string) instead of MongoDB '_id' (ObjectId)
    // Also include 'isDeleted' check to match your new entity
    const user = await User.findOne({ userId: payload.id }).select(
      "isVerified role email isDeleted"
    );

    if (!user || user.isDeleted) {
      res.status(401).json({ message: "User not found or account deactivated" });
      return;
    }

    if (!user.isVerified) {
      res.status(403).json({
        message: "Account not verified. Access denied.",
        code: "ACCOUNT_NOT_VERIFIED",
      });
      return;
    }

    // Attach the payload to the request for use in 'checkRole'
    req.user = payload;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
    return;
  }
};

// This stays mostly the same but now works with "shifty", "cashier", "admin"
export const checkRole = (...allowedRoles: ("shifty" | "cashier" | "admin")[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized. Please login." });
    }

    if (!allowedRoles.includes(req.user.role as any)) {
      return res.status(403).json({
        message: "Access denied. You do not have permission to access this resource.",
      });
    }

    next();
  };
};