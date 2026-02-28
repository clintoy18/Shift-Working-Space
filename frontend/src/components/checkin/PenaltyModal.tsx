import React, { useState } from "react";
import CheckInService from "@/services/CheckInService";
import { useToast } from "@/context/ToastContext";
import type { ICheckIn } from "@/interfaces/models/ICheckIn";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertTriangle, X } from "lucide-react";

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
    } catch (error: any) {
      let errorMessage = "Error applying penalty. Please try again.";

      if (error.response?.status === 404) {
        errorMessage = "Check-in record not found. It may have been completed.";
      } else if (error.response?.status === 400) {
        errorMessage = error.response?.data?.message || "Invalid penalty amount. Please verify the amount.";
      } else if (error.response?.status === 409) {
        errorMessage = "Cannot apply penalty: Check-in has already been completed or checked out.";
      } else if (error.response?.status === 500) {
        errorMessage = "Server error occurred. Please try again later.";
      }

      showToast(errorMessage, "error");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const autoCalculated = autoCalculatePenalty();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="max-w-md w-full mx-4 shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-2xl flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            Apply Penalty
          </CardTitle>
          <button
            onClick={onClose}
            disabled={loading}
            className="text-muted-foreground hover:text-foreground transition"
          >
            <X className="w-5 h-5" />
          </button>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Current Info */}
          <div className="p-4 bg-muted rounded-lg space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Guest/User:</span>
              <span className="font-semibold text-foreground">
                {checkIn.checkInType === "guest"
                  ? checkIn.guest?.guestId
                  : checkIn.user?.fullName}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Seat:</span>
              <span className="font-semibold text-foreground">{checkIn.seat?.displayLabel}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Hourly Rate:</span>
              <span className="font-semibold text-foreground">${hourlyRate.toFixed(2)}/hr</span>
            </div>
            {overtimeMinutes > 0 && (
              <div className="flex justify-between text-sm border-t border-muted pt-3 mt-3">
                <span className="text-red-600 font-semibold">Overtime:</span>
                <span className="font-semibold text-red-600">
                  {overtimeMinutes} minutes
                </span>
              </div>
            )}
          </div>

          {/* Reason Selection */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
              Reason for Penalty
            </label>
            <div className="space-y-2">
              {presetReasons.map((r) => (
                <label key={r} className="flex items-center cursor-pointer group">
                  <input
                    type="radio"
                    value={r}
                    checked={reason === r}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-4 h-4 mr-3 cursor-pointer"
                  />
                  <span className="text-sm text-foreground group-hover:text-primary transition">
                    {r}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Penalty Amount */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
              Penalty Amount ($)
            </label>
            <Input
              type="number"
              min="0"
              step="0.01"
              value={penaltyAmount}
              onChange={(e) => setPenaltyAmount(e.target.value)}
              placeholder="0.00"
            />
            {autoCalculated > 0 && (
              <button
                type="button"
                onClick={() => setPenaltyAmount(autoCalculated.toFixed(2))}
                className="mt-2 text-sm text-primary hover:text-primary/80 font-medium transition"
              >
                Auto-calculate: ${autoCalculated.toFixed(2)} (based on overtime)
              </button>
            )}
          </div>

          {/* Summary */}
          {penaltyAmount && parseFloat(penaltyAmount) > 0 && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-foreground">Reason:</span>
                <span className="font-semibold text-foreground">{reason}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-foreground">Penalty Amount:</span>
                <span className="font-semibold text-red-600">
                  ${parseFloat(penaltyAmount).toFixed(2)}
                </span>
              </div>
              {checkIn.penaltyCharges && checkIn.penaltyCharges.length > 0 && (
                <div className="flex justify-between text-sm pt-2 border-t border-red-200">
                  <span className="text-foreground font-semibold">Total Penalties:</span>
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
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm font-semibold text-foreground mb-3">
                Previous Penalties
              </p>
              <div className="space-y-2 text-xs">
                {checkIn.penaltyCharges.map((penalty, idx) => (
                  <div key={idx} className="flex justify-between">
                    <div>
                      <p className="font-medium text-foreground">{penalty.reason}</p>
                      <p className="text-muted-foreground">
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
          <div className="flex gap-3 pt-2">
            <Button
              onClick={onClose}
              disabled={loading}
              variant="outline"
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={loading || !penaltyAmount || parseFloat(penaltyAmount) <= 0}
              className="flex-1 gap-2"
            >
              <AlertTriangle className="w-4 h-4" />
              {loading ? "Processing..." : "Apply Penalty"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PenaltyModal;
