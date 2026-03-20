import { Request, Response } from "express";
import User from "../models/User";
import { generateToken } from "../utils/jwt";
import { verifyGoogleToken } from "../config/google";

/**
 * Handle Google OAuth callback
 * Validates Google ID token, creates/updates user, returns JWT
 */
export const googleCallback = async (req: Request, res: Response): Promise<void> => {
  const { idToken, credential } = req.body;
  const token = idToken || credential;

  if (!token) {
    res.status(400).json({ message: "ID token is required" });
    return;
  }

  try {
    // 1. Verify Google token signature
    const googleUser = await verifyGoogleToken(token);

    // 2. Check if user exists by googleId or email
    let user = await User.findOne({
      $or: [
        { googleId: googleUser.googleId },
        { email: googleUser.email },
      ],
    });

    if (user) {
      // 3a. Existing user - update googleId if missing
      if (!user.googleId) {
        user.googleId = googleUser.googleId;
        user.googleEmail = googleUser.email;
        user.authProvider = "google";
        await user.save();
      }

      // Check if user is verified
      if (!user.isVerified) {
        res.status(403).json({
          message: "Account not verified. Please wait for admin approval.",
          code: "ACCOUNT_NOT_VERIFIED",
        });
        return;
      }
    } else {
      // 3b. New user - create with OAuth
      const userCount = await User.countDocuments({});
      const isFirstUser = userCount === 0;

      // Handle missing lastName - use email prefix or "User"
      const email = googleUser.email || "user@example.com";
      const lastName = googleUser.lastName || email.split("@")[0] || "User";

      user = new User({
        email: email,
        googleId: googleUser.googleId,
        googleEmail: email,
        firstName: googleUser.firstName || "User",
        lastName: lastName,
        role: isFirstUser ? "admin" : "shifty",
        authProvider: "google",
        // OAuth users require email verification
        isVerified: false,
        termsAccepted: true,
        privacyPolicyAccepted: true,
        agreementAcceptedAt: new Date(),
      });

      await user.save();

      // TODO: Send verification email to user
      // For now, auto-verify OAuth users (Google already verified email)
      user.isVerified = true;
      await user.save();
    }

    // 4. Generate JWT token
    const jwtToken = generateToken({
      id: (user._id as any).toString(),
      email: user.email,
      role: user.role,
    });

    // 5. Return token and user data
    res.status(200).json({
      token: jwtToken,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: user.fullName,
        role: user.role,
        authProvider: user.authProvider,
      },
    });
  } catch (error: any) {
    console.error("❌ Google OAuth callback error:", error);

    // Handle specific error types
    if (error.message.includes("Token used too early")) {
      res.status(401).json({ message: "Google token used too early" });
      return;
    }

    if (error.message.includes("Token used too late")) {
      res.status(401).json({ message: "Google token expired" });
      return;
    }

    if (error.message.includes("Invalid token")) {
      res.status(401).json({ message: "Invalid Google token" });
      return;
    }

    res.status(500).json({ message: "OAuth authentication failed", error: error.message });
  }
};

/**
 * Get public Google OAuth configuration
 * Returns the Google Client ID for frontend
 */
export const getGoogleConfig = async (req: Request, res: Response): Promise<void> => {
  try {
    const clientId = process.env.GOOGLE_CLIENT_ID;

    if (!clientId) {
      res.status(500).json({ message: "Google OAuth not configured" });
      return;
    }

    res.status(200).json({
      clientId,
    });
  } catch (error) {
    console.error("❌ Error fetching Google config:", error);
    res.status(500).json({ message: "Failed to fetch Google configuration" });
  }
};
