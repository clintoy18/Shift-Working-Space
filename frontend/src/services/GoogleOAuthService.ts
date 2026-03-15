import { api } from "@/lib/api";
import type { AxiosError } from "axios";

let cachedClientId: string | null = null;

interface GoogleConfig {
  clientId: string;
}

interface GoogleLoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    fullName: string;
    role: string;
    authProvider: string;
  };
}

/**
 * Fetch Google OAuth configuration from backend
 * Returns the Google Client ID needed for the OAuth button
 */
export const getGoogleConfig = async (): Promise<GoogleConfig> => {
  try {
    if (cachedClientId) {
      return { clientId: cachedClientId };
    }

    const response = await api.get<GoogleConfig>("/auth/google/config");
    cachedClientId = response.data.clientId;
    return response.data;
  } catch (error) {
    console.error("Failed to fetch Google OAuth config:", error);
    throw error;
  }
};

/**
 * Handle Google OAuth login
 * Sends the credential (JWT) to backend for verification and JWT generation
 * @param credential - The credential JWT from Google OAuth
 * @returns JWT token and user data
 */
export const handleGoogleLogin = async (credential: string): Promise<GoogleLoginResponse> => {
  try {
    const response = await api.post<GoogleLoginResponse>("/auth/google/callback", {
      credential,
    });

    // Store token in sessionStorage
    if (response.data.token) {
      sessionStorage.setItem("accessToken", response.data.token);
    }

    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    console.error("Google OAuth login failed:", error);
    
    // Extract error message from response
    const message = axiosError.response?.data?.message || "Google login failed";
    throw new Error(message);
  }
};

export default {
  getGoogleConfig,
  handleGoogleLogin,
};
