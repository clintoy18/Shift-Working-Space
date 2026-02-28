import React, { useState } from "react";
import CheckInService from "@/services/CheckInService";
import { useToast } from "@/context/ToastContext";
import type { ICheckIn } from "@/interfaces/models/ICheckIn";

interface PenaltyModalProps {
  checkIn: ICheckIn;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (updatedCheckIn: ICheckIn) => void;
}

/**
 * Penalty Modal Component
 * Allows applying penalty charges for overtime or other violations
 */
export const PenaltyModal: React.FC<PenaltyModalProps> = ({
  checkIn,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { showToast } = useToast();

  const [penaltyAmount, setPenaltyAmount] = useState("");
  const [reason, setReason] = useState("Overtime");
  const [loading, setLoading] = useState(false);

  // Calculate overtime minutes
  const overtimeMinutes = Math.max(0, -(checkIn.timeRemainingMinutes || 0));

  // Calculate hourly rate
  const hourlyRate = checkIn.paymentAmount / (checkIn.allocatedDurationMinutes / 60);

  // Preset penalty options
  const presetReasons = ["Overtime", "Damage", "Late Checkout", "Other"];

  // Auto-calculate penalty based on overtime
  const autoCalculatePenalty = () => {
    if (overtimeMinutes > 0) {
      return (overtimeMinutes / 60) * hourlyRate;
    }
    return 0;
  };

  // Handle submit
  const handleSubmit = async () => {
    if (!penaltyAmount || parseFloat(penaltyAmount) <= 0) {
      showToast("Please enter a valid penalty amount", "error");
      return;
    }

    if (!reason || reason.trim().length === 0) {
      showToast("Please select or enter a reason", "error");
      return;
    }

    try {
      setLoading(true);

      const amount = parseFloat(penaltyAmount);

      await CheckInService.applyPenalty({
        checkInId: checkIn.id,
        penaltyAmount: amount,
        reason: reason.trim(),
        appliedBy: "Cashier",
      });

      showToast(
        `Penalty applied: $${amount.toFixed(2)} for ${reason}`,
        "success"
      );

      // Reset form
      setPenaltyAmount("");
      setReason("Overtime");

      if (onSuccess) {
        // Fetch updated check-in
        const updated = await CheckInService.getCheckInDetails(checkIn.id);
        onSuccess(updated);
      }

      onClose();
    } catch (error) {
      showToast("Error applying penalty", "error");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const autoCalculated = autoCalculatePenalty();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold mb-6">Apply Penalty Charge</h2>

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
          {overtimeMinutes > 0 && (
            <div className="flex justify-between text-sm border-t pt-2 mt-2">
              <span className="text-red-600 font-semibold">Overtime:</span>
              <span className="font-semibold text-red-600">
                {overtimeMinutes} minutes
              </span>
            </div>
          )}
        </div>

        {/* Reason Selection */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Reason for Penalty
          </label>
          <div className="space-y-2">
            {presetReasons.map((r) => (
              <label key={r} className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  value={r}
                  checked={reason === r}
                  onChange={(e) => setReason(e.target.value)}
                  className="mr-3"
                />
                <span className="text-gray-700">{r}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Penalty Amount */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Penalty Amount ($)
          </label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={penaltyAmount}
            onChange={(e) => setPenaltyAmount(e.target.value)}
            placeholder="0.00"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {autoCalculated > 0 && (
            <button
              type="button"
              onClick={() => setPenaltyAmount(autoCalculated.toFixed(2))}
              className="mt-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Auto-calculate: ${autoCalculated.toFixed(2)} (based on overtime)
            </button>
          )}
        </div>

        {/* Summary */}
        {penaltyAmount && parseFloat(penaltyAmount) > 0 && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex justify-between mb-2">
              <span className="text-gray-700">Reason:</span>
              <span className="font-semibold">{reason}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">Penalty Amount:</span>
              <span className="font-semibold text-red-600">
                ${parseFloat(penaltyAmount).toFixed(2)}
              </span>
            </div>
            {checkIn.penaltyCharges && checkIn.penaltyCharges.length > 0 && (
              <div className="flex justify-between mt-3 pt-3 border-t border-red-200">
                <span className="text-gray-700 font-semibold">Total Penalties:</span>
                <span className="font-bold text-red-600">
                  $
                  {(
                    checkIn.penaltyCharges.reduce((sum, p) => sum + p.amount, 0) +
                    parseFloat(penaltyAmount)
                  ).toFixed(2)}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Penalty History */}
        {checkIn.penaltyCharges && checkIn.penaltyCharges.length > 0 && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm font-semibold text-gray-900 mb-3">
              Previous Penalties
            </p>
            <div className="space-y-2 text-xs">
              {checkIn.penaltyCharges.map((penalty, idx) => (
                <div key={idx} className="flex justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{penalty.reason}</p>
                    <p className="text-gray-600">
                      {new Date(penalty.appliedAt).toLocaleTimeString()}
                    </p>
                  </div>
                  <p className="font-semibold text-red-600">
                    ${penalty.amount.toFixed(2)}
                  </p>
                </div>
              ))}
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
            disabled={loading || !penaltyAmount || parseFloat(penaltyAmount) <= 0}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 transition font-medium"
          >
            {loading ? "Processing..." : "Apply Penalty"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PenaltyModal;
