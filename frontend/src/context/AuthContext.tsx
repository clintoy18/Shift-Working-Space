import { createContext, useContext, useState, useEffect } from "react";
import {
  loginUser,
  logoutUser,
  isAccessTokenInSession,
  registerStudent,
  fetchUser,
} from "@services";
import type { IAuthContext, ILoginRequest, IRegisterRequest, IUser } from "@interfaces";

type TNullableUser = IUser | null;

export const AuthContext = createContext<IAuthContext | undefined>(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState<TNullableUser>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // ✅ Updated to match Node.js/Mongoose camelCase fields
  const handleFetchUser = async () => {
  try {
    const data = await fetchUser();
    
    const transformedUser: IUser = {
      id: data.id || data._id,
      email: data.email,
      firstName: data.firstName,
      middleName: data.middleName,
      lastName: data.lastName,
      fullName: data.fullName,
      role: data.role,             // 'admin' | 'shifty' | 'cashier'
      membershipType: data.membershipType || 'None',
      membershipStatus: data.membershipStatus || 'Inactive',
      isVerified: data.isVerified,
      isDeleted: data.isDeleted,
      termsAccepted: data.termsAccepted ?? false,
      privacyPolicyAccepted: data.privacyPolicyAccepted ?? false,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };

    setUser(transformedUser);
    return transformedUser;
  } catch (error) {
    console.error("Failed to fetch user:", error);
    setUser(null);
    return null;
  }
};

  const handleLogin = async (credentials: ILoginRequest) => {
    try {
      // 1. Login sets the token in session/cookies via AuthService
      const response = await loginUser(credentials);
      
      // 2. We can either use the user data returned directly from login 
      // or fetch fresh data. Let's fetch to be safe.
      await handleFetchUser();
      
      return response; // Return full response so LoginPage can see the role for navigation
    } catch (error) {
      console.error("Failed to login user: ", error);
      throw error;
    }
  };

  const handleRegister = async (credentials: IRegisterRequest) => {
    try {
      //  returns the full user object and token
      const data = await registerStudent(credentials);

      // Store token if provided
      if (data.token) {
        sessionStorage.setItem('accessToken', data.token);
      }

      // Fetch user data to populate context
      await handleFetchUser();

      // Return the internal ID (Node uses _id)
      return data.user?.id || data.user?._id;
    } catch (error: any) {
      console.error("Failed to register user:", error);
      const message = error.response?.data?.message || "Registration failed";
      throw new Error(message);
    }
  };

  const handleLogout = () => {
    logoutUser();
    setUser(null);
  };

  useEffect(() => {
    const checkAuth = async () => {
      const isToken = isAccessTokenInSession();
      if (isToken) {
        await handleFetchUser();
      } else {
        setUser(null);
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const contextValue: IAuthContext = {
    handleFetchUser,
    handleLogin,
    handleLogout,
    handleRegister,
    user,
    isLoading,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = (): IAuthContext => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};