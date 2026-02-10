import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, ArrowLeft, UserCircle, Loader2 } from "lucide-react";
import type { IRegisterRequest } from '@interfaces';

const RegisterForm = ({
  onRegister,
  isLoading = false,
  error = null
}: {
  onRegister: (credentials: IRegisterRequest) => Promise<void>,
  isLoading?: boolean,
  error?: string
}) => {
  const [formData, setFormData] = useState<IRegisterRequest>({
    firstName: '',
    middleName: '',
    lastName: '',
    password: '',
    confirmPassword: '',
  });

  const [formErrors, setFormErrors] = useState<Partial<IRegisterRequest>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
    if (formErrors[id as keyof IRegisterRequest]) {
      setFormErrors(prev => ({ ...prev, [id]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const errors: Partial<IRegisterRequest> = {};
    if (!formData.firstName.trim()) errors.firstName = 'Required';
    if (!formData.lastName.trim()) errors.lastName = 'Required';
    if (!formData.password) {
      errors.password = 'Required';
    } else if (formData.password.length < 6) {
      errors.password = 'Min 6 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords must match';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      await onRegister(formData);
    }
  };
  return (
    <Card className="w-full max-w-xl  shadow-2xl bg-card/50 backdrop-blur-md mx-auto">
      <CardContent className="p-8">
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="inline-flex h-12 w-12 bg-primary rounded-xl items-center justify-center mb-4 shadow-lg shadow-primary/20">
            <UserCircle className="text-primary-foreground h-8 w-8" />
          </div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Create Account</h1>
          <p className="text-muted-foreground mt-2 text-sm">Join Shift and start your journey</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Personal Info Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary/80 ml-1">
              <span className="w-8 h-[1px] bg-primary/30"></span>
              Personal Information
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground ml-1">First Name</label>
                <Input 
                  id="firstName" 
                  value={formData.firstName} 
                  onChange={handleInputChange} 
                  placeholder="John" 
                  className={`h-11 bg-background/50 focus:ring-2 focus:ring-primary/20 transition-all ${formErrors.firstName ? "border-destructive ring-destructive/20" : "border-muted-foreground/20"}`} 
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground ml-1">Middle Name</label>
                <Input 
                  id="middleName" 
                  value={formData.middleName} 
                  onChange={handleInputChange} 
                  placeholder="Optional" 
                  className="h-11 bg-background/50 border-muted-foreground/20 focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground ml-1">Last Name</label>
                <Input 
                  id="lastName" 
                  value={formData.lastName} 
                  onChange={handleInputChange} 
                  placeholder="Smith" 
                  className={`h-11 bg-background/50 focus:ring-2 focus:ring-primary/20 transition-all ${formErrors.lastName ? "border-destructive ring-destructive/20" : "border-muted-foreground/20"}`} 
                />
              </div>
            </div>
          </div>

          {/* Security Section */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground ml-1">Password</label>
                <Input 
                  id="password" 
                  type="password" 
                  value={formData.password} 
                  onChange={handleInputChange} 
                  placeholder="••••••••" 
                  className={`h-11 bg-background/50 focus:ring-2 focus:ring-primary/20 transition-all ${formErrors.password ? "border-destructive" : "border-muted-foreground/20"}`} 
                />
                {formErrors.password && <p className="text-[10px] text-destructive font-medium ml-1">{formErrors.password}</p>}
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground ml-1">Confirm Password</label>
                <Input 
                  id="confirmPassword" 
                  type="password" 
                  value={formData.confirmPassword} 
                  onChange={handleInputChange} 
                  placeholder="••••••••" 
                  className={`h-11 bg-background/50 focus:ring-2 focus:ring-primary/20 transition-all ${formErrors.confirmPassword ? "border-destructive" : "border-muted-foreground/20"}`} 
                />
                {formErrors.confirmPassword && <p className="text-[10px] text-destructive font-medium ml-1">{formErrors.confirmPassword}</p>}
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-4 flex gap-3 items-center animate-in slide-in-from-top-2 duration-300">
              <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0" />
              <p className="text-sm text-destructive font-medium">{error}</p>
            </div>
          )}

          <Button 
            type="submit" 
            disabled={isLoading}
            className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-base shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Creating account...
              </span>
            ) : 'Create account'}
          </Button>
        </form>

        {/* Footer */}
        <button
          type="button"
          className="w-full mt-8 py-2 flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-all group"
        >
          <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
          <span>Already have an account? <span className="text-primary font-semibold">Sign in</span></span>
        </button>
      </CardContent>
    </Card>
  );
};

export default RegisterForm;