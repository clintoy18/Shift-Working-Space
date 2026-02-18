import { createContext, useContext, useState, useEffect } from "react";
import {
  loginUser,
  logoutUser,
  isAccessTokenInSession,
  registerStudent,
  fetchUser,
} from "@services";
import type {
  IAuthContext,
  ILoginRequest,
  IRegisterRequest,
  IUser,
} from "@interfaces";

type TNullableUser = IUser | null;

export const AuthContext = createContext<IAuthContext | undefined>(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState<TNullableUser>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const handleFetchUser = async () => {
    try {
      const data = await fetchUser();

      // ✅ Since your IUser interface now matches the Backend JSON (camelCase),
      // we no longer need to manually map every field. Just pass the data!
      setUser(data);
      return data;
    } catch (error) {
      console.error("Failed to fetch user: ", error);
      setUser(null);
      return null;
    }
  };

  const handleLogin = async (credentials: ILoginRequest) => {
    try {
      const data = await loginUser(credentials);

      // 'data' is the object you showed me: { token, user: { id, fullName, role } }
      // We set the user state directly using the 'user' object from the response
      setUser(data.user);

      return data;
    } catch (error) {
      console.error("Failed to login user: ", error);
      throw error;
    }
  };

  const handleRegister = async (credentials: IRegisterRequest) => {
    try {
      const data = await registerStudent(credentials);

      // ✅ Return the 'id' (from the new MongoDB structure)
      return data.id;
    } catch (error: any) {
      console.error("Failed to register user:", error);
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error("Registration failed");
    }
  };

  const handleLogout = () => {
    logoutUser();
    setUser(null);
  };

  useEffect(() => {
    const checkAuth = async () => {
      if (isAccessTokenInSession()) {
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
