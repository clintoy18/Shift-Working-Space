import React, { useState } from "react";
import CheckInService from "@/services/CheckInService";
import { useToast } from "@/context/ToastContext";
import type { ICheckIn } from "@/interfaces/models/ICheckIn";

interface ExtensionModalProps {
  checkIn: ICheckIn;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (updatedCheckIn: ICheckIn) => void;
}

/**
 * Extension Modal Component
 * Allows extending check-in duration with additional charges
 */
export const ExtensionModal: React.FC<ExtensionModalProps> = ({
  checkIn,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { showToast } = useToast();

  const [selectedMinutes, setSelectedMinutes] = useState<number | null>(null);
  const [customMinutes, setCustomMinutes] = useState("");
  const [loading, setLoading] = useState(false);

  // Calculate hourly rate
  const hourlyRate = checkIn.paymentAmount / (checkIn.allocatedDurationMinutes / 60);

  // Preset options
  const presetOptions = [
    { minutes: 15, label: "15 minutes" },
    { minutes: 30, label: "30 minutes" },
    { minutes: 60, label: "1 hour" },
  ];

  // Calculate additional amount
  const getAdditionalAmount = (minutes: number) => {
    return (minutes / 60) * hourlyRate;
  };

  // Get display minutes
  const displayMinutes = selectedMinutes !== null ? selectedMinutes : parseInt(customMinutes) || 0;
  const additionalAmount = displayMinutes > 0 ? getAdditionalAmount(displayMinutes) : 0;

  // Handle submit
  const handleSubmit = async () => {
    if (!displayMinutes || displayMinutes <= 0) {
      showToast("Please select or enter a valid duration", "error");
      return;
    }

    try {
      setLoading(true);

      await CheckInService.extendCheckIn({
        checkInId: checkIn.id,
        additionalMinutes: displayMinutes,
        additionalAmount,
        appliedBy: "Cashier",
      });

      showToast(
        `Extended by ${displayMinutes} minutes (+$${additionalAmount.toFixed(2)})`,
        "success"
      );

      // Reset form
      setSelectedMinutes(null);
      setCustomMinutes("");

      if (onSuccess) {
        // Fetch updated check-in
        const updated = await CheckInService.getCheckInDetails(checkIn.id);
        onSuccess(updated);
      }

      onClose();
    } catch (error) {
      showToast("Error extending check-in", "error");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold mb-6">Extend Duration</h2>

        {/* Current Info */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Guest/User:</span>
            <span className="font-medium">
              {checkIn.checkInType === "guest"
                ? checkIn.guest?.guestId
                : checkIn.user?.fullName}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Seat:</span>
            <span className="font-medium">{checkIn.seat?.displayLabel}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Hourly Rate:</span>
            <span className="font-medium">${hourlyRate.toFixed(2)}/hr</span>
          </div>
        </div>

        {/* Preset Options */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Select Duration
          </label>
          <div className="grid grid-cols-3 gap-2">
            {presetOptions.map((option) => (
              <button
                key={option.minutes}
                onClick={() => {
                  setSelectedMinutes(option.minutes);
                  setCustomMinutes("");
                }}
                className={`p-3 border-2 rounded-lg transition text-sm font-medium ${
                  selectedMinutes === option.minutes
                    ? "border-blue-500 bg-blue-50 text-blue-900"
                    : "border-gray-300 hover:border-gray-400 text-gray-700"
                }`}
              >
                <div>{option.label}</div>
                <div className="text-xs opacity-75">
                  +${getAdditionalAmount(option.minutes).toFixed(2)}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Custom Duration */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Or Enter Custom Duration (minutes)
          </label>
          <input
            type="number"
            min="1"
            value={customMinutes}
            onChange={(e) => {
              setCustomMinutes(e.target.value);
              setSelectedMinutes(null);
            }}
            placeholder="e.g., 45"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Summary */}
        {displayMinutes > 0 && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex justify-between mb-2">
              <span className="text-gray-700">Additional Duration:</span>
              <span className="font-semibold">{displayMinutes} minutes</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">Additional Charge:</span>
              <span className="font-semibold text-blue-600">
                +${additionalAmount.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between mt-3 pt-3 border-t border-blue-200">
              <span className="text-gray-700 font-semibold">New Total Duration:</span>
              <span className="font-bold">
                {checkIn.allocatedDurationMinutes + displayMinutes} minutes
              </span>
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition disabled:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || !displayMinutes || displayMinutes <= 0}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition font-medium"
          >
            {loading ? "Processing..." : "Confirm Extension"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExtensionModal;
