import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../models/User";
import { generateToken } from "../utils/jwt";

export const register = async (req: Request, res: Response): Promise<void> => {
  // ✅ 1. ADD 'role' HERE
  const { email, password, firstName, lastName, role } = req.body;

  if (!email || !password || !firstName || !lastName) {
    res.status(400).json({ message: "Required fields are missing" });
    return;
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: "Email already exists" });
      return;
    }

    const userCount = await User.countDocuments({});
    const isFirstUser = userCount === 0;

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = new User({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      role: isFirstUser ? "admin" : (role || "shifty"), 
      // isVerified: isFirstUser ? true : false commented out as of now
      isVerified: true
    });
    
    await newUser.save();
    res.status(201).json({ 
      message: isFirstUser ? "Admin created" : "User registered",
      user: newUser 
    });
  } catch (err) {
    console.error("REGISTRATION ERROR:", err); // ✅ Always log the error for debugging!
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
      id: (user._id as any).toString(),
      email: user.email,
      role: user.role,
    });
    res.status(200).json({
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getMe = async (req: Request, res: Response): Promise<void> => {
  try {
    // req.user.id comes from the decoded JWT in your authenticate middleware
    const user = await User.findById(req.user.id);

    if (!user || user.isDeleted) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json(user); // This returns the clean 'id', 'email', etc.
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};


export const updateMe = async (req: Request, res: Response): Promise<void> => {
  const { firstName, middleName, lastName, password } = req.body;

  try {
    const user = await User.findById(req.user.id);

    if (!user || user.isDeleted) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    if (firstName)              user.firstName  = firstName;
    if (middleName !== undefined) user.middleName = middleName;
    if (lastName)               user.lastName   = lastName;

    if (password && password.trim() !== "") {
      user.password = await bcrypt.hash(password, 12);
    }

    await user.save();

    res.status(200).json({
      message: "Profile updated successfully.",
      user,   // password auto-stripped by toJSON transform
    });
  } catch (err) {
    console.error("Update profile error:", err);
    res.status(500).json({ message: "Server error" });
  }
};