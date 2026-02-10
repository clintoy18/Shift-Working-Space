import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, ArrowLeft, ShieldCheck, Loader2 } from "lucide-react";

const LoginForm = ({ onLogin, isLoading = false, error = null }) => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin({ userId, password });
  };

  return (
    <Card className="w-full max-w-md shadow-lg border-muted mx-auto">
      <CardContent className="p-8">
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="inline-flex h-12 w-12 bg-primary rounded-xl items-center justify-center mb-4 shadow-lg shadow-primary/20">
            <ShieldCheck className="text-primary-foreground h-7 w-7" />
          </div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Welcome back</h1>
          <p className="text-muted-foreground mt-2 text-sm">Please enter your details to sign in</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* User ID Field */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">
              User ID
            </label>
            <Input
              id="userId"
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="Enter your user ID"
              required
              className="h-11 focus-visible:ring-primary transition-all"
            />
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <div className="flex justify-between items-center px-1">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Password
              </label>
              <button type="button" className="text-xs text-primary hover:underline font-medium">
                Forgot password?
              </button>
            </div>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="h-11 focus-visible:ring-primary transition-all"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex gap-2 items-start animate-in fade-in zoom-in duration-200">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700 font-medium">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-6 text-base transition-all active:scale-[0.98] shadow-lg shadow-primary/20"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Signing in...
              </span>
            ) : "Sign In"}
          </Button>
        </form>

        {/* Footer Navigation */}
        <div className="mt-8 pt-6 border-t border-muted">
          <button
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