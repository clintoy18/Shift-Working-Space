import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../models/User";
import { generateToken } from "../utils/jwt";
import { validatePassword, validateEmail, validateNameField } from "../utils/validation";

export const register = async (req: Request, res: Response): Promise<void> => {
  const { email, password, firstName, lastName, role } = req.body;

  // Validate required fields
  if (!email || !password || !firstName || !lastName) {
    res.status(400).json({ message: "Required fields are missing" });
    return;
  }

  // Validate email format
  const emailValidation = validateEmail(email);
  if (!emailValidation.valid) {
    res.status(400).json({ message: emailValidation.error });
    return;
  }

  // Validate password strength
  const passwordValidation = validatePassword(password);
  if (!passwordValidation.valid) {
    res.status(400).json({
      message: "Password does not meet requirements",
      errors: passwordValidation.errors,
    });
    return;
  }

  // Validate name fields
  const firstNameValidation = validateNameField(firstName, "First name");
  if (!firstNameValidation.valid) {
    res.status(400).json({ message: firstNameValidation.error });
    return;
  }

  const lastNameValidation = validateNameField(lastName, "Last name");
  if (!lastNameValidation.valid) {
    res.status(400).json({ message: lastNameValidation.error });
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
      isVerified: isFirstUser ? true : false, // First user auto-verified, others need approval
    });

    await newUser.save();
    res.status(201).json({
      message: isFirstUser ? "Admin created" : "User registered successfully",
      user: newUser,
    });
  } catch (err) {
    console.error("REGISTRATION ERROR:", err);
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

    // Validate name fields if provided
    if (firstName) {
      const validation = validateNameField(firstName, "First name");
      if (!validation.valid) {
        res.status(400).json({ message: validation.error });
        return;
      }
      user.firstName = firstName;
    }

    if (middleName !== undefined) {
      if (middleName && middleName.trim().length > 0) {
        const validation = validateNameField(middleName, "Middle name");
        if (!validation.valid) {
          res.status(400).json({ message: validation.error });
          return;
        }
      }
      user.middleName = middleName;
    }

    if (lastName) {
      const validation = validateNameField(lastName, "Last name");
      if (!validation.valid) {
        res.status(400).json({ message: validation.error });
        return;
      }
      user.lastName = lastName;
    }

    // Validate password if provided
    if (password && password.trim() !== "") {
      const passwordValidation = validatePassword(password);
      if (!passwordValidation.valid) {
        res.status(400).json({
          message: "Password does not meet requirements",
          errors: passwordValidation.errors,
        });
        return;
      }
      user.password = await bcrypt.hash(password, 12);
    }

    await user.save();

    res.status(200).json({
      message: "Profile updated successfully",
      user, // password auto-stripped by toJSON transform
    });
  } catch (err) {
    console.error("Update profile error:", err);
    res.status(500).json({ message: "Server error" });
  }
};