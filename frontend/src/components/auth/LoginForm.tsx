import { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, ArrowLeft, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Loader from "@/components/ui/loader";
import PasswordInput from "./PasswordInput";

interface LoginFormProps {
  onLogin: (credentials: { email: string; password: string }) => void;
  isLoading?: boolean;
  error?: string | null;
  onGoogleLogin: (idToken: string) => Promise<void>;
  googleClientId?: string | null;
}

const LoginForm = ({ onLogin, isLoading = false, error = null, onGoogleLogin, googleClientId }: LoginFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [googleLoading, setGoogleLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onLogin({ email, password });
  };

  return (
    <Card className="w-full max-w-md shadow-lg border-muted mx-auto">
      <CardContent className="p-8">
        <div className="mb-10 text-center">
          <div className="inline-flex h-12 w-12 bg-primary rounded-xl items-center justify-center mb-4 shadow-lg shadow-primary/20">
            <ShieldCheck className="text-primary-foreground h-7 w-7" />
          </div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">
            Welcome back
          </h1>
          <p className="text-muted-foreground mt-2 text-sm">
            Please enter your details to sign in
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">
              Email Address
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              required
              className="h-11 focus-visible:ring-primary transition-all"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center px-1">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Password
              </label>
              <button
                type="button"
                className="text-xs text-primary hover:underline font-medium"
              >
                Forgot password?
              </button>
            </div>
            <PasswordInput
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="focus-visible:ring-primary"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex gap-2 items-start animate-in fade-in zoom-in duration-200">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700 font-medium">{error}</p>
            </div>
          )}

          <Button
            type="submit"
            disabled={isLoading || googleLoading}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-6 text-base transition-all active:scale-[0.98] shadow-lg shadow-primary/20"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <Loader variant="spinner" size="sm" color="white" />
                Signing in...
              </span>
            ) : (
              "Sign In"
            )}
          </Button>
        </form>

        {/* Divider */}
        <div className="mt-8 flex items-center gap-3">
          <div className="flex-1 h-px bg-muted"></div>
          <span className="text-xs text-muted-foreground font-medium">Or continue with</span>
          <div className="flex-1 h-px bg-muted"></div>
        </div>

        {/* Google Sign-In Button */}
        <div className="flex justify-center mt-4">
          {googleClientId ? (
            <GoogleLogin
              onSuccess={async (credentialResponse) => {
                try {
                  setGoogleLoading(true);
                  if (credentialResponse.credential) {
                    await onGoogleLogin(credentialResponse.credential);
                  }
                } catch (err) {
                  console.error("Google login error:", err);
                } finally {
                  setGoogleLoading(false);
                }
              }}
              onError={() => {
                console.error("Google login failed");
              }}
              text="signin_with"
              size="large"
              width="100"
            />
          ) : (
            <div className="text-sm text-slate-500 bg-slate-100 border border-slate-200 rounded-lg px-4 py-2">
              Google Sign-in not configured. Use email/password login.
            </div>
          )}
        </div>

        <div className="mt-8 pt-6 border-t border-muted">
          <button
            onClick={() => navigate("/")}
            type="button"
            className="group flex items-center justify-center w-full gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to landing page
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default LoginForm;
