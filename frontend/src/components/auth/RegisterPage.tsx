import React from 'react';
import { useNavigate } from "react-router-dom";
import AuthLayout from "../../pages/AuthLayout";
import RegisterForm from "../../components/auth/RegisterForm";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import type { IRegisterRequest } from "@interfaces";

const RegisterPage: React.FC = () => {
  const { success, error } = useToast();
  const navigate = useNavigate();
  const { handleRegister } = useAuth();
  const [isLoading, setIsLoading] = React.useState(false);

  const onRegister = async (credentials: IRegisterRequest) => {
  setIsLoading(true);
  try {
    await handleRegister(credentials);
    success('Account created successfully! Welcome to Shift.');
    navigate("/dashboard");
  } catch (err: any) {
    // ✅ Extract actual backend error message
    const errorMsg = err.response?.data?.message || "Registration failed. Please try again.";
    error(errorMsg);
  } finally {
    setIsLoading(false);
  }
};
  return (
    <AuthLayout>
      <RegisterForm onRegister={onRegister} isLoading={isLoading} />
    </AuthLayout>
  );
};

export default RegisterPage;