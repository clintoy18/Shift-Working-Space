import React, { useState } from "react";
import CheckInService from "@/services/CheckInService";
import { useToast } from "@/context/ToastContext";
import type { ICheckIn } from "@/interfaces/models/ICheckIn";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Clock, X } from "lucide-react";

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
    } catch (error: any) {
      let errorMessage = "Error extending check-in. Please try again.";

      if (error.response?.status === 404) {
        errorMessage = "Check-in record not found. It may have been completed.";
      } else if (error.response?.status === 400) {
        errorMessage = error.response?.data?.message || "Invalid extension duration. Please verify the amount.";
      } else if (error.response?.status === 409) {
        errorMessage = "Cannot extend: Check-in has already been completed or checked out.";
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

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="max-w-md w-full mx-4 shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-2xl">Extend Duration</CardTitle>
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
          </div>

          {/* Preset Options */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
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
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-muted hover:border-primary/50 text-foreground"
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
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
              Or Enter Custom Duration (minutes)
            </label>
            <Input
              type="number"
              min="1"
              value={customMinutes}
              onChange={(e) => {
                setCustomMinutes(e.target.value);
                setSelectedMinutes(null);
              }}
              placeholder="e.g., 45"
            />
          </div>

          {/* Summary */}
          {displayMinutes > 0 && (
            <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-foreground">Additional Duration:</span>
                <span className="font-semibold text-foreground">{displayMinutes} minutes</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-foreground">Additional Charge:</span>
                <span className="font-semibold text-primary">
                  +${additionalAmount.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-sm pt-2 border-t border-primary/20">
                <span className="text-foreground font-semibold">New Total Duration:</span>
                <span className="font-bold text-foreground">
                  {checkIn.allocatedDurationMinutes + displayMinutes} minutes
                </span>
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
              disabled={loading || !displayMinutes || displayMinutes <= 0}
              className="flex-1 gap-2"
            >
              <Clock className="w-4 h-4" />
              {loading ? "Processing..." : "Confirm Extension"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExtensionModal;
