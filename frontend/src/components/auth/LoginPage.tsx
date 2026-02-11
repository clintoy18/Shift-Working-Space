import React from 'react';
import { useNavigate } from "react-router-dom";
import AuthLayout from "../../pages/AuthLayout";
import LoginForm from "../../components/auth/LoginForm";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import type { ILoginRequest } from "@interfaces";

const LoginPage: React.FC = () => {
  const { success, error } = useToast();
  const navigate = useNavigate();
  const { handleLogin } = useAuth();
  const [isLoading, setIsLoading] = React.useState(false);

  const onLogin = async (credentials: ILoginRequest) => {
    setIsLoading(true);
    try {
      await handleLogin(credentials);
      success('Welcome back to Shift');
      navigate("/dashboard", { replace: true });
    } catch (err) {
      error("Login failed. Please check your credentials.");
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