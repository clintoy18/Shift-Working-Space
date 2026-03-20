import { OAuth2Client } from "google-auth-library";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

if (!GOOGLE_CLIENT_ID) {
  console.warn("⚠️  GOOGLE_CLIENT_ID not set in environment variables");
}

// Initialize Google OAuth2 client
const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

/**
 * Verify Google ID token and extract user information
 * @param idToken - The ID token from Google OAuth
 * @returns User info (email, name, picture) or null if invalid
 */
export const verifyGoogleToken = async (idToken: string) => {
  try {
    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    
    if (!payload) {
      throw new Error("Invalid token payload");
    }

    return {
      googleId: payload.sub, // Google's unique user ID
      email: payload.email,
      firstName: payload.given_name || "User",
      lastName: payload.family_name || "",
      picture: payload.picture,
      emailVerified: payload.email_verified,
    };
  } catch (error) {
    console.error("❌ Google token verification failed:", error);
    throw error;
  }
};

export default {
  googleClient,
  verifyGoogleToken,
};
