import DashboardLayout from "./components/layout/DashboardLayout";
import ProtectedRoute from "./components/routing/ProtectedRoute";
import GuestRoute from "./components/routing/GuestRoute";
import LandingPage from "./pages/LandingPage";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import LoginPage from "./components/auth/LoginPage";
import RegisterPage from "./components/auth/RegisterPage";
import CheckInForm from "./components/checkin/CheckInForm";
import CheckInManagement from "./components/checkin/CheckInManagement";

interface AppProps {
  googleClientId?: string | null;
}

export default function App({ googleClientId }: AppProps) {
  return (
    <ToastProvider> 
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route element={<GuestRoute />}>
              <Route path="/login" element={<LoginPage googleClientId={googleClientId} />} />
              <Route path="/register" element={<RegisterPage />} />
            </Route>
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<DashboardLayout />} />
              <Route path="/checkin" element={<CheckInForm />} />
              <Route path="/checkin/management" element={<CheckInManagement />} />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </ToastProvider>
  );
}