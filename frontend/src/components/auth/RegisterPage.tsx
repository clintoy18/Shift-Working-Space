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
      success('Account created! Please sign in.');
      navigate("/login");
    } catch (err) {
      error("Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout 
      title="Create your workspace." 
      subtitle="Join the Shift community and start collaborating today."
    >
      <RegisterForm onRegister={onRegister} isLoading={isLoading} />
    </AuthLayout>
  );
};

export default RegisterPage;