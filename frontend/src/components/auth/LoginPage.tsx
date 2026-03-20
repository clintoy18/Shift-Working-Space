import React from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../../pages/AuthLayout";
import LoginForm from "../../components/auth/LoginForm";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { handleGoogleLogin } from "../../services/GoogleOAuthService";
import type { ILoginRequest } from "@interfaces";

interface ErrorResponse {
  response?: {
    data?: {
      message?: string;
    };
    status?: number;
  };
  message?: string;
}

interface LoginPageProps {
  googleClientId?: string | null;
}

const LoginPage: React.FC<LoginPageProps> = ({ googleClientId = null }) => {
  const { success, error, warning } = useToast();
  const navigate = useNavigate();
  const { handleLogin, handleFetchUser } = useAuth();
  const [isLoading, setIsLoading] = React.useState(false);

  const onLogin = async (credentials: ILoginRequest) => {
    setIsLoading(true);
    try {
      // credentials is now { email, password }
      await handleLogin(credentials);
      success("Welcome back to Shift");
      navigate("/dashboard", { replace: true });
    } catch (err: unknown) {
      const errorObj = err as ErrorResponse;
      // Pull the specific error from backend if it exists
      const errorMessage =
        errorObj.response?.data?.message || "Invalid email or password.";
      const status = errorObj.response?.status;

      // Display warning for rate limit (429) instead of error
      if (status === 429) {
        warning(errorMessage);
      } else {
        error(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const onGoogleLogin = async (accessToken: string) => {
    setIsLoading(true);
    try {
      // Send access token to backend for verification
      await handleGoogleLogin(accessToken);
      
      // Fetch user data to populate context
      await handleFetchUser();
      
      success("Welcome back to Shift");
      navigate("/dashboard", { replace: true });
    } catch (err: unknown) {
      const errorObj = err as ErrorResponse;
      const errorMessage =
        errorObj.message || "Google login failed. Please try again.";
      const status = errorObj.response?.status;

      if (status === 429) {
        warning(errorMessage);
      } else {
        error(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <LoginForm 
        onLogin={onLogin} 
        isLoading={isLoading}
        onGoogleLogin={onGoogleLogin}
        googleClientId={googleClientId}
      />
    </AuthLayout>
  );
};

export default LoginPage;
