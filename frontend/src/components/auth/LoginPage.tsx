import React from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../../pages/AuthLayout";
import LoginForm from "../../components/auth/LoginForm";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import type { ILoginRequest } from "@interfaces";

const LoginPage: React.FC = () => {
  const { success, error, warning } = useToast();
  const navigate = useNavigate();
  const { handleLogin } = useAuth();
  const [isLoading, setIsLoading] = React.useState(false);

  const onLogin = async (credentials: ILoginRequest) => {
    setIsLoading(true);
    try {
      // credentials is now { email, password }
      await handleLogin(credentials);
      success("Welcome back to Shift");
      navigate("/dashboard", { replace: true });
    } catch (err: any) {
      // Pull the specific error from backend if it exists
      const errorMessage =
        err.response?.data?.message || "Invalid email or password.";
      const status = err.response?.status;

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

  return (
    <AuthLayout
      title="Welcome back."
      subtitle="Enter your credentials to access your workspace."
    >
      <LoginForm onLogin={onLogin} isLoading={isLoading} />
    </AuthLayout>
  );
};

export default LoginPage;
