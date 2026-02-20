import React, { useState, useEffect } from "react";
import TextInputField from "../common/TextInputField";
import Button from "../common/Button";
import { User, FileText, Lock, Edit3, Save, X, Shield } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { updateSelf } from "@services";
import { type IUser } from "@interfaces";
import { useToast } from "../../context/ToastContext";

const ProfileForm = () => {
  const { user, handleFetchUser } = useAuth(); // ✅ Added handleFetchUser to refresh state
  const { success, error, info } = useToast();

  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    middleName: user?.middleName || "",
    lastName: user?.lastName || "",
    role: user?.role || "",
    email: user?.email || "",
    password: "",
    confirmPassword: "",
  });

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // ✅ Keep form in sync if user context updates elsewhere
  useEffect(() => {
    if (user && !isEditing) {
      setFormData((prev) => ({
        ...prev,
        firstName: user.firstName,
        middleName: user.middleName || "",
        lastName: user.lastName,
        role: user.role,
        email: user.email,
      }));
    }
  }, [user, isEditing]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleEdit = () => {
    setIsEditing(true);
    info("You can now edit your profile information");
  };

  const handleCancel = () => {
    setFormData({
      firstName: user?.firstName || "",
      middleName: user?.middleName || "",
      lastName: user?.lastName || "",
      role: user?.role || "",
      email: user?.email || "",
      password: "",
      confirmPassword: ""
    });
    setIsEditing(false);
    setPasswordError(null);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password && formData.password !== formData.confirmPassword) {
      setPasswordError("Passwords do not match.");
      error("Passwords do not match. Please check and try again.");
      return;
    }
    
    setPasswordError(null);
    setLoading(true);
    
    try {
      if (!user) throw new Error("User session not found.");

      const userData: IUser = {
        id: user.id,
        firstName: formData.firstName,
        middleName: formData.middleName,
        lastName: formData.lastName,
        fullName: `${formData.firstName} ${formData.lastName}`,
        role: user.role,
        email: user.email,
        membershipType: user.membershipType, 
        membershipStatus: user.membershipStatus,
        isDeleted: user.isDeleted,
        isVerified: user.isVerified,
        createdAt: user.createdAt
      };
      
      await updateSelf(
        userData,
        formData.password || undefined,
        formData.confirmPassword || undefined
      );
      
      // ✅ Refresh the global user state so the UI updates everywhere
      await handleFetchUser();
      
      setIsEditing(false);
      setFormData(prev => ({ ...prev, password: "", confirmPassword: "" }));
      success("Profile updated successfully!");
      
    } catch (err) {
      console.error('User update error:', err);
      const errorMessage = err instanceof Error 
        ? err.message 
        : "Failed to update profile. Please try again.";
      error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const displayFullName = [formData.firstName, formData.middleName, formData.lastName]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Sidebar - Profile Overview */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm sticky top-6">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <User className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-heading font-semibold text-slate-800 mb-1">
                {displayFullName || "Loading..."}
              </h3>
              
              <div className="inline-flex items-center gap-1.5 bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
                <Shield className="w-3 h-3 text-orange-600" />
                <span className="text-xs font-medium text-orange-700 capitalize">{formData.role}</span>
              </div>
              
              <div className="mt-6 p-4 bg-orange-50 rounded-lg border border-orange-200">
                <div className="flex items-center gap-2 text-sm text-orange-700">
                  <Lock className="w-4 h-4" />
                  <span className="text-left text-xs">Your information is secure and encrypted</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Content - Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleUpdate} className="space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-heading font-semibold text-slate-800">Personal Information</h3>
                  <p className="text-sm text-slate-600 mt-1">Update your name and contact details</p>
                </div>
                {!isEditing && (
                  <Button
                    onClick={handleEdit}
                    type="button"
                    label="Edit Profile"
                    icon={<Edit3 className="w-4 h-4" />}
                    className="bg-slate-800 text-white hover:bg-slate-700 px-4 py-2.5"
                  />
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <TextInputField
                  id="firstName"
                  label="First Name"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="First name"
                  disabled={!isEditing}
                  icon={<User className="w-4 h-4" />}
                />
                <TextInputField
                  id="middleName"
                  label="Middle Name"
                  value={formData.middleName}
                  onChange={handleInputChange}
                  placeholder="Optional"
                  disabled={!isEditing}
                  icon={<User className="w-4 h-4" />}
                />
                <TextInputField
                  id="lastName"
                  label="Last Name"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Last name"
                  disabled={!isEditing}
                  icon={<User className="w-4 h-4" />}
                />
              </div>

              <TextInputField
                id="email"
                label="Email Address"
                value={formData.email}
                onChange={handleInputChange}
                disabled={true} // Email should generally be read-only for security
                icon={<FileText className="w-4 h-4" />}
              />
            </div>

            {isEditing && (
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm animate-in fade-in slide-in-from-top-4 duration-300">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-1.5 h-6 bg-orange-500 rounded-full"></div>
                  <div>
                    <h3 className="text-lg font-heading font-semibold text-slate-800">Security Settings</h3>
                    <p className="text-sm text-slate-600 mt-1">Leave blank to keep your current password</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <TextInputField
                    id="password"
                    label="New Password"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    icon={<Lock className="w-4 h-4" />}
                  />
                  <TextInputField
                    id="confirmPassword"
                    label="Confirm Password"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    icon={<Lock className="w-4 h-4" />}
                  />
                </div>
                {passwordError && <p className="text-xs text-red-500 mt-2 ml-1">{passwordError}</p>}
              </div>
            )}

            {isEditing && (
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button
                  onClick={handleCancel}
                  type="button"
                  label="Cancel"
                  variant="outline"
                  icon={<X className="w-4 h-4" />}
                  className="flex-1 py-3 border-slate-300 text-slate-700 hover:bg-slate-50"
                  disabled={loading}
                />
                <Button
                  type="submit"
                  label={loading ? "Saving..." : "Save Changes"}
                  icon={loading ? null : <Save className="w-4 h-4" />}
                  className="flex-1 py-3 bg-orange-600 text-white hover:bg-orange-700 shadow-lg"
                  disabled={loading}
                />
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileForm;