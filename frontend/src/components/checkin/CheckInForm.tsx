import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle2, User, Mail, Phone, ArrowRight } from "lucide-react";
import CheckInService from "@/services/CheckInService";
import { seatService } from "@/services/SeatService";
import { fetchAllUsersAdmin } from "@/services/AdminService";
import { useToast } from "@/context/ToastContext";
import {
  getPricingForSeatType,
  formatPrice,
  formatDuration,
  type PricingOption,
} from "@/config/pricingConfig";
import { SEAT_TYPES, getAllSeatTypes, type SeatTypeKey } from "@/config/seatTypesConfig";
import type { ICheckInRequest, ICheckInResponse } from "@/interfaces/requests/ICheckInRequest";
import type { ISeat } from "@/interfaces/models/ISeat";
import type { IUser } from "@/interfaces/models/IUser";
import Loader from "@/components/ui/loader";

type CheckInType = "guest" | "registered";

interface CheckInFormProps {
  onSuccess?: (response: ICheckInResponse) => void;
  processedBy?: string;
}

/**
 * Unified Check-In Form Component
 * Supports both guest and registered user check-ins
 * Uses centralized pricing configuration from pricingConfig.ts
 * Styled with consistent design patterns from existing components
 */
export const CheckInForm: React.FC<CheckInFormProps> = ({
  onSuccess,
  processedBy = "System",
}) => {
  const { showToast } = useToast();

  // Form state
  const [checkInType, setCheckInType] = useState<CheckInType>("guest");
  const [selectedSeatType, setSelectedSeatType] = useState<SeatTypeKey>("regular");
  const [selectedSeat, setSelectedSeat] = useState<ISeat | null>(null);
  const [selectedPricingOption, setSelectedPricingOption] = useState<PricingOption | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<"pending" | "paid" | "refunded">("paid");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const [userSearchQuery, setUserSearchQuery] = useState("");

  // Data state
  const [seats, setSeats] = useState<ISeat[]>([]);
  const [allUsers, setAllUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  // Fetch seats and users on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch seats
        const allSeats = await seatService.getAllSeats();
        // Filter only available seats (exclude occupied, reserved, maintenance)
        const availableSeats = allSeats.filter((s) => s.status === "available");
        setSeats(availableSeats);

        // Fetch users
        const users = await fetchAllUsersAdmin();
        setAllUsers(users || []);
      } catch (error) {
        showToast("Error loading data", "error");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [showToast]);

  // Filter users based on search query and role (only "shifty" users)
  const filteredUsers = allUsers.filter((user) => {
    // Only show users with "shifty" role
    if (user.role !== "shifty") {
      return false;
    }

    const query = userSearchQuery.toLowerCase();
    return (
      user.fullName?.toLowerCase().includes(query) ||
      user.email?.toLowerCase().includes(query)
    );
  });

  // Get pricing options for selected seat type
  const pricingOptions = getPricingForSeatType(selectedSeatType);
  const seatTypeConfig = SEAT_TYPES[selectedSeatType];

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!selectedPricingOption) {
      showToast("Please select a pricing option", "error");
      return;
    }

    if (checkInType === "guest") {
      if (!email && !phoneNumber) {
        showToast("Guest check-in requires email or phone number", "error");
        return;
      }
    } else {
      if (!selectedUser) {
        showToast("Please select a registered user", "error");
        return;
      }
    }

    setShowConfirmation(true);
  };

  // Handle confirmation
  const handleConfirm = async () => {
    if (!selectedPricingOption) {
      return;
    }

    try {
      setSubmitting(true);

      // Find a seat of the selected type (for demo, use first available)
      const seatOfType = seats.find((s) => s.seatType === selectedSeatType);
      if (!seatOfType) {
        showToast("No seats available for selected type", "error");
        setSubmitting(false);
        return;
      }

      // Find the pricing option index
      const pricingIndex = pricingOptions.findIndex(
        (opt) => opt.duration === selectedPricingOption.duration && opt.price === selectedPricingOption.price
      );

      const checkInData: ICheckInRequest = {
        checkInType,
        seatId: String(seatOfType._id || seatOfType.id || seatOfType.seatId || ""),
        pricingOptionId: pricingIndex,
        paymentStatus,
        processedBy,
        ...(checkInType === "guest" && {
          email: email || undefined,
          phoneNumber: phoneNumber || undefined,
        }),
        ...(checkInType === "registered" && {
          userId: selectedUser?.id,
        }),
      };

      const response = await CheckInService.checkIn(checkInData);

      showToast(
        `Check-in successful! ${checkInType === "guest" ? `Guest ID: ${response.guestId}` : `User: ${response.userName}`}`,
        "success"
      );

      // Reset form
      setCheckInType("guest");
      setSelectedSeat(null);
      setSelectedPricingOption(null);
      setEmail("");
      setPhoneNumber("");
      setSelectedUser(null);
      setShowConfirmation(false);

      if (onSuccess) {
        onSuccess(response);
      }
    } catch (error: any) {
      // Handle specific error types
      let errorMessage = "Error during check-in. Please try again.";

      if (error.response?.status === 409) {
        // Conflict: Seat occupancy or user double booking
        const data = error.response?.data;
        if (data?.checkInType === "registered" && data?.existingSeatId) {
          // User already has an active check-in
          errorMessage = `Cannot proceed: This user already has an active check-in. Please check them out first before checking in again.`;
        } else {
          // Seat is occupied by another user/guest
          const occupiedBy = data?.checkInType === "guest"
            ? `Guest ${data?.existingCheckInId}`
            : "another user";
          errorMessage = `Cannot proceed with payment: Seat is already occupied by ${occupiedBy}. Please select a different seat.`;
        }
      } else if (error.response?.status === 400) {
        // Bad request - validation error
        errorMessage = error.response?.data?.message || "Invalid check-in data. Please verify all fields.";
      } else if (error.response?.status === 404) {
        // Not found
        errorMessage = "Seat or user not found. Please refresh and try again.";
      } else if (error.response?.status === 500) {
        // Server error
        errorMessage = "Server error occurred. Please try again later.";
      } else if (error.message?.includes("Network")) {
        // Network error
        errorMessage = "Network error. Please check your connection and try again.";
      }

      showToast(errorMessage, "error");
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="flex items-center justify-center py-12">
          <Loader variant="spinner" size="lg" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg border-muted">
      <CardHeader className="border-b">
        <CardTitle className="text-3xl font-bold tracking-tight">Check-In</CardTitle>
        <p className="text-muted-foreground text-sm mt-2">
          {checkInType === "guest" ? "Register a walk-in guest" : "Check in a registered member"}
        </p>
      </CardHeader>

      <CardContent className="pt-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Check-In Type Selection */}
          <div className="space-y-4">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">
              Check-In Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: "guest", label: "Guest (Walk-in)", icon: User },
                { value: "registered", label: "Registered User", icon: User },
              ].map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => {
                    setCheckInType(value as CheckInType);
                    if (value === "guest") {
                      setSelectedUser(null);
                    } else {
                      setEmail("");
                      setPhoneNumber("");
                    }
                  }}
                  className={`p-4 rounded-lg border-2 transition-all flex items-center gap-3 ${
                    checkInType === value
                      ? "border-primary bg-primary/5"
                      : "border-muted hover:border-primary/50"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Seat Type Selection */}
          <div className="space-y-4">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">
              Seat Type
            </label>
            <div className="grid grid-cols-3 gap-3">
              {getAllSeatTypes().map((seatType) => (
                <button
                  key={seatType.key}
                  type="button"
                  onClick={() => {
                    setSelectedSeatType(seatType.key);
                    setSelectedSeat(null);
                    setSelectedPricingOption(null);
                  }}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    selectedSeatType === seatType.key
                      ? "border-primary bg-primary/5"
                      : "border-muted hover:border-primary/50"
                  }`}
                >
                  <div className="font-semibold text-foreground">{seatType.displayName}</div>
                  <div className="text-xs text-muted-foreground mt-1">{seatType.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Seat Selection */}
          <div className="space-y-4">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">
              Select Seat
            </label>
            <select
              value={String(selectedSeat?._id || selectedSeat?.id || selectedSeat?.seatId || "")}
              onChange={(e) => {
                const seat = seats.find((s) => String(s._id || s.id || s.seatId) === e.target.value);
                setSelectedSeat(seat || null);
                setSelectedPricingOption(null);
              }}
              className="w-full h-11 px-4 py-2 border border-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all bg-background"
              disabled={loading}
            >
              <option value="">Choose a seat...</option>
              {seats
                .filter((seat) => seat.seatType === selectedSeatType)
                .map((seat) => (
                  <option key={String(seat._id || seat.id || seat.seatId)} value={String(seat._id || seat.id || seat.seatId)}>
                    {seat.displayLabel} - {seat.zoneType}
                  </option>
                ))}
            </select>
          </div>

          {/* Pricing Options */}
          {selectedSeat && pricingOptions.length > 0 && (
            <div className="space-y-4">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">
                Duration & Price
              </label>
              <div className="grid grid-cols-2 gap-3">
                {pricingOptions.map((option) => (
                  <button
                    key={`${option.duration}-${option.price}`}
                    type="button"
                    onClick={() => setSelectedPricingOption(option)}
                    disabled={!option.isActive}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      selectedPricingOption?.duration === option.duration &&
                      selectedPricingOption?.price === option.price
                        ? "border-primary bg-primary/5"
                        : "border-muted hover:border-primary/50"
                    } ${!option.isActive ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    <div className="font-semibold text-foreground">{option.label}</div>
                    <div className="text-xs text-muted-foreground mt-1">{formatDuration(option.duration)}</div>
                    <div className="text-sm font-semibold text-primary mt-2">{formatPrice(option.price)}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Guest-Specific Fields */}
          {checkInType === "guest" && (
            <div className="space-y-4 p-4 bg-muted/50 rounded-lg border border-muted">
              <h3 className="font-semibold text-foreground text-sm">Guest Information (Optional)</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">
                    Email
                  </label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="guest@example.com"
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">
                    Phone Number
                  </label>
                  <Input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="h-11"
                  />
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                At least email or phone is required for receipts
              </p>
            </div>
          )}

          {/* Registered User Selection */}
          {checkInType === "registered" && (
            <div className="space-y-4">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">
                Select User
              </label>
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search user by name or email..."
                  value={userSearchQuery}
                  onChange={(e) => {
                    setUserSearchQuery(e.target.value);
                    setShowUserDropdown(true);
                  }}
                  onFocus={() => setShowUserDropdown(true)}
                  className="h-11"
                />

                {/* User Dropdown List */}
                {showUserDropdown && userSearchQuery && filteredUsers.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-background border border-muted rounded-lg shadow-lg z-10 max-h-64 overflow-y-auto">
                    {filteredUsers.map((user) => (
                      <button
                        key={user.id}
                        type="button"
                        onClick={() => {
                          setSelectedUser(user);
                          setUserSearchQuery(user.fullName || "");
                          setShowUserDropdown(false);
                        }}
                        className="w-full text-left px-4 py-3 hover:bg-muted border-b border-muted last:border-b-0 transition"
                      >
                        <p className="font-semibold text-foreground">{user.fullName}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                        {user.membershipStatus && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Membership: {user.membershipStatus}
                          </p>
                        )}
                      </button>
                    ))}
                  </div>
                )}

                {/* No Results Message */}
                {showUserDropdown && userSearchQuery && filteredUsers.length === 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-background border border-muted rounded-lg shadow-lg z-10 p-4">
                    <p className="text-sm text-muted-foreground text-center">No users found</p>
                  </div>
                )}
              </div>

              {/* Selected User Display */}
              {selectedUser && (
                <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-foreground">{selectedUser.fullName}</p>
                      <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
                      {selectedUser.membershipStatus && (
                        <p className="text-sm text-muted-foreground mt-1">
                          Membership: {selectedUser.membershipStatus}
                        </p>
                      )}
                    </div>
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedUser(null);
                      setUserSearchQuery("");
                    }}
                    className="text-xs text-primary hover:text-primary/80 font-medium underline"
                  >
                    Clear selection
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Payment Status */}
          <div className="space-y-4">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">
              Payment Status
            </label>
            <select
              value={paymentStatus}
              onChange={(e) => setPaymentStatus(e.target.value as "pending" | "paid" | "refunded")}
              className="w-full h-11 px-4 py-2 border border-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all bg-background"
            >
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>

          {/* Summary */}
          {selectedSeat && selectedPricingOption && (
            <div className="p-4 bg-muted/50 rounded-lg border border-muted space-y-3">
              <h3 className="font-semibold text-foreground text-sm">Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Seat Type:</span>
                  <span className="font-medium text-foreground">{seatTypeConfig.displayName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Seat:</span>
                  <span className="font-medium text-foreground">{selectedSeat.displayLabel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Duration:</span>
                  <span className="font-medium text-foreground">{selectedPricingOption.label} ({formatDuration(selectedPricingOption.duration)})</span>
                </div>
                <div className="flex justify-between border-t border-muted pt-3 mt-3">
                  <span className="text-muted-foreground font-semibold">Total Charge:</span>
                  <span className="font-semibold text-primary text-base">{formatPrice(selectedPricingOption.price)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={submitting || loading}
            className="w-full h-12 text-base font-semibold shadow-lg shadow-primary/20"
          >
            {submitting ? (
              <span className="flex items-center gap-2">
                <Loader variant="spinner" size="sm" color="white" />
                Processing...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                Proceed to Confirmation
                <ArrowRight className="h-4 w-4" />
              </span>
            )}
          </Button>
        </form>

        {/* Confirmation Modal */}
        {showConfirmation && selectedSeat && selectedPricingOption && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md shadow-xl">
              <CardHeader className="border-b">
                <CardTitle className="text-2xl">Confirm Check-In</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4 mb-6">
                  {checkInType === "guest" ? (
                    <>
                      <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                        <User className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                        <div>
                          <p className="text-xs text-muted-foreground uppercase font-semibold">Guest ID</p>
                          <p className="font-medium text-foreground">Auto-generated</p>
                        </div>
                      </div>
                      {email && (
                        <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                          <Mail className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                          <div>
                            <p className="text-xs text-muted-foreground uppercase font-semibold">Email</p>
                            <p className="font-medium text-foreground">{email}</p>
                          </div>
                        </div>
                      )}
                      {phoneNumber && (
                        <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                          <Phone className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                          <div>
                            <p className="text-xs text-muted-foreground uppercase font-semibold">Phone</p>
                            <p className="font-medium text-foreground">{phoneNumber}</p>
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                      <User className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                      <div>
                        <p className="text-xs text-muted-foreground uppercase font-semibold">User</p>
                        <p className="font-medium text-foreground">{selectedUser?.fullName}</p>
                      </div>
                    </div>
                  )}

                  <div className="border-t border-muted pt-4 space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Seat Type:</span>
                      <span className="font-medium text-foreground">{seatTypeConfig.displayName}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Seat:</span>
                      <span className="font-medium text-foreground">{selectedSeat.displayLabel}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Duration:</span>
                      <span className="font-medium text-foreground">{selectedPricingOption.label}</span>
                    </div>
                    <div className="flex justify-between text-sm border-t border-muted pt-3 mt-3">
                      <span className="text-muted-foreground font-semibold">Charge:</span>
                      <span className="font-semibold text-primary text-base">{formatPrice(selectedPricingOption.price)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    type="button"
                    onClick={() => setShowConfirmation(false)}
                    disabled={submitting}
                    variant="outline"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    onClick={handleConfirm}
                    disabled={submitting}
                    className="flex-1"
                  >
                    {submitting ? (
                      <span className="flex items-center gap-2">
                        <Loader variant="spinner" size="sm" color="white" />
                        Processing
                      </span>
                    ) : (
                      "Confirm"
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CheckInForm;
