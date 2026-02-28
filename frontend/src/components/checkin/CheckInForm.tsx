import React, { useState, useEffect } from "react";
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

type CheckInType = "guest" | "registered";

interface CheckInFormProps {
  onSuccess?: (response: ICheckInResponse) => void;
  processedBy?: string;
}

/**
 * Unified Check-In Form Component
 * Supports both guest and registered user check-ins
 * Uses centralized pricing configuration from pricingConfig.ts
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
    } catch (error) {
      showToast("Error during check-in", "error");
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-6">Check-In</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Check-In Type Selection */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-gray-700">
            Check-In Type
          </label>
          <div className="flex gap-4">
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                value="guest"
                checked={checkInType === "guest"}
                onChange={(e) => {
                  setCheckInType(e.target.value as CheckInType);
                  setSelectedUser(null);
                }}
                className="mr-2"
              />
              <span className="text-gray-700">Guest (Walk-in)</span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                value="registered"
                checked={checkInType === "registered"}
                onChange={(e) => {
                  setCheckInType(e.target.value as CheckInType);
                  setEmail("");
                  setPhoneNumber("");
                }}
                className="mr-2"
              />
              <span className="text-gray-700">Registered User</span>
            </label>
          </div>
        </div>

        {/* Seat Type Selection */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-gray-700">
            Seat Type *
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
                className={`p-4 border-2 rounded-lg transition ${
                  selectedSeatType === seatType.key
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              >
                <div className="font-semibold text-gray-900">{seatType.displayName}</div>
                <div className="text-xs text-gray-600 mt-1">{seatType.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Seat Selection */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-gray-700">
            Select Seat *
          </label>
          <select
            value={String(selectedSeat?._id || selectedSeat?.id || selectedSeat?.seatId || "")}
            onChange={(e) => {
              const seat = seats.find((s) => String(s._id || s.id || s.seatId) === e.target.value);
              setSelectedSeat(seat || null);
              setSelectedPricingOption(null);
            }}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-700">
              Duration & Price *
            </label>
            <div className="grid grid-cols-2 gap-3">
              {pricingOptions.map((option) => (
                <button
                  key={`${option.duration}-${option.price}`}
                  type="button"
                  onClick={() => setSelectedPricingOption(option)}
                  className={`p-3 border-2 rounded-lg transition ${
                    selectedPricingOption?.duration === option.duration &&
                    selectedPricingOption?.price === option.price
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                  disabled={!option.isActive}
                >
                  <div className="font-semibold text-gray-900">{option.label}</div>
                  <div className="text-sm text-gray-600">{formatDuration(option.duration)}</div>
                  <div className="text-sm font-semibold text-blue-600 mt-1">{formatPrice(option.price)}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Guest-Specific Fields */}
        {checkInType === "guest" && (
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-900">Guest Information (Optional)</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="guest@example.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <p className="text-xs text-gray-600">
              At least email or phone is required for receipts
            </p>
          </div>
        )}

        {/* Registered User Selection */}
        {checkInType === "registered" && (
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-700">
              Select User *
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search user by name or email..."
                value={userSearchQuery}
                onChange={(e) => {
                  setUserSearchQuery(e.target.value);
                  setShowUserDropdown(true);
                }}
                onFocus={() => setShowUserDropdown(true)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />

              {/* User Dropdown List */}
              {showUserDropdown && userSearchQuery && filteredUsers.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-64 overflow-y-auto">
                  {filteredUsers.map((user) => (
                    <button
                      key={user.id}
                      type="button"
                      onClick={() => {
                        setSelectedUser(user);
                        setUserSearchQuery(user.fullName || "");
                        setShowUserDropdown(false);
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-blue-50 border-b border-gray-200 last:border-b-0 transition"
                    >
                      <p className="font-semibold text-gray-900">{user.fullName}</p>
                      <p className="text-sm text-gray-600">{user.email}</p>
                      {user.membershipStatus && (
                        <p className="text-xs text-gray-500">
                          Membership: {user.membershipStatus}
                        </p>
                      )}
                    </button>
                  ))}
                </div>
              )}

              {/* No Results Message */}
              {showUserDropdown && userSearchQuery && filteredUsers.length === 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 p-4">
                  <p className="text-sm text-gray-600 text-center">No users found</p>
                </div>
              )}
            </div>

            {/* Selected User Display */}
            {selectedUser && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="font-semibold text-gray-900">{selectedUser.fullName}</p>
                <p className="text-sm text-gray-600">{selectedUser.email}</p>
                {selectedUser.membershipStatus && (
                  <p className="text-sm text-gray-600">
                    Membership: {selectedUser.membershipStatus}
                  </p>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedUser(null);
                    setUserSearchQuery("");
                  }}
                  className="mt-2 text-xs text-blue-600 hover:text-blue-800 underline"
                >
                  Clear selection
                </button>
              </div>
            )}
          </div>
        )}

        {/* Payment Status */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-gray-700">
            Payment Status
          </label>
          <select
            value={paymentStatus}
            onChange={(e) => setPaymentStatus(e.target.value as "pending" | "paid" | "refunded")}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="refunded">Refunded</option>
          </select>
        </div>

        {/* Summary */}
        {selectedSeat && selectedPricingOption && (
          <div className="p-4 bg-gray-50 rounded-lg space-y-2">
            <h3 className="font-semibold text-gray-900">Summary</h3>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Seat Type:</span>
              <span className="font-medium">{seatTypeConfig.displayName}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Seat:</span>
              <span className="font-medium">{selectedSeat.displayLabel}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Duration:</span>
              <span className="font-medium">{selectedPricingOption.label} ({formatDuration(selectedPricingOption.duration)})</span>
            </div>
            <div className="flex justify-between text-sm border-t border-gray-300 pt-2 mt-2">
              <span className="text-gray-600 font-semibold">Total Charge:</span>
              <span className="font-semibold text-blue-600">{formatPrice(selectedPricingOption.price)}</span>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={submitting || loading}
          className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition"
        >
          {submitting ? "Processing..." : "Proceed to Confirmation"}
        </button>
      </form>

      {/* Confirmation Modal */}
      {showConfirmation && selectedSeat && selectedPricingOption && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold mb-4">Confirm Check-In</h2>

            <div className="space-y-3 mb-6">
              {checkInType === "guest" ? (
                <>
                  <p className="text-gray-700">
                    <span className="font-semibold">Guest ID:</span> Auto-generated
                  </p>
                  {email && (
                    <p className="text-gray-700">
                      <span className="font-semibold">Email:</span> {email}
                    </p>
                  )}
                  {phoneNumber && (
                    <p className="text-gray-700">
                      <span className="font-semibold">Phone:</span> {phoneNumber}
                    </p>
                  )}
                </>
              ) : (
                <p className="text-gray-700">
                  <span className="font-semibold">User:</span> {selectedUser?.fullName}
                </p>
              )}

              <p className="text-gray-700">
                <span className="font-semibold">Seat Type:</span> {seatTypeConfig.displayName}
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">Seat:</span> {selectedSeat.displayLabel}
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">Duration:</span> {selectedPricingOption.label} ({formatDuration(selectedPricingOption.duration)})
              </p>
              <p className="text-gray-700 border-t border-gray-300 pt-3 mt-3">
                <span className="font-semibold">Charge:</span> <span className="text-blue-600 font-semibold">{formatPrice(selectedPricingOption.price)}</span>
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmation(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                disabled={submitting}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition"
              >
                {submitting ? "Processing..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckInForm;
