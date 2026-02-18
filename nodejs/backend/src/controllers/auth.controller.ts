import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../models/User";
import { generateToken } from "../utils/jwt";

export const register = async (req: Request, res: Response): Promise<void> => {
  const { userId, email, password, firstName, middleName, lastName, role } = req.body;

  if (!userId || !email || !password || !firstName || !lastName) {
    res.status(400).json({ message: "Required fields are missing" });
    return;
  }

  try {
    const existingUser = await User.findOne({ $or: [{ email }, { userId }] });
    if (existingUser) {
      res.status(400).json({ message: "User ID or Email already exists" });
      return;
    }

    // 1. Check if this is the first user in the system
    const userCount = await User.countDocuments({});
    const isFirstUser = userCount === 0;

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = new User({
      userId,
      email,
      password: hashedPassword,
      firstName,
      middleName,
      lastName,
      // 2. If first user, force 'admin' and auto-verify
      role: isFirstUser ? "admin" : (role || "shifty"),
      isVerified: isFirstUser ? true : false 
    });
    
    await newUser.save();

    const successMessage = isFirstUser 
      ? "First user registered as Admin and auto-verified." 
      : "User registered successfully. Pending approval.";

    res.status(201).json({ message: successMessage });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ message: "Registration failed" });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: "Email and password are required" });
    return;
  }

  try {
    // 1. Find user (Ensure they aren't soft-deleted)
    const user = await User.findOne({ email, isDeleted: false });

    if (!user) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }

    // 2. Check Verification status
    if (!user.isVerified) {
      res.status(403).json({
        message: "Account not verified. Please wait for admin approval.",
        code: "ACCOUNT_NOT_VERIFIED",
      });
      return;
    }

    // 3. Verify password
    const match = await bcrypt.compare(password, user.password!);
    if (!match) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }

    // 4. Generate token with the 20-char userId
    const token = generateToken({
      id: user.userId, 
      email: user.email,
      role: user.role,
    });

    res.status(200).json({ 
        token, 
        user: {
            userId: user.userId,
            fullName: user.fullName, 
            role: user.role
        } 
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};