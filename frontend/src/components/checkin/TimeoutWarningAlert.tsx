import React, { useState, useEffect } from "react";
import { AlertCircle, Clock, AlertTriangle } from "lucide-react";
import type { ICheckIn } from "@/interfaces/models/ICheckIn";

interface TimeoutWarningAlertProps {
  checkIn: ICheckIn;
  onExtend?: () => void;
  onApplyPenalty?: () => void;
  onCheckOut?: () => void;
}

/**
 * Timeout Warning Alert Component
 * Real-time countdown timer with visual indicators
 */
export const TimeoutWarningAlert: React.FC<TimeoutWarningAlertProps> = ({
  checkIn,
  onExtend,
  onApplyPenalty,
  onCheckOut,
}) => {
  const [timeRemaining, setTimeRemaining] = useState(checkIn.timeRemainingMinutes || 0);

  // Update countdown every second
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const checkInTime = new Date(checkIn.checkInTime);
      const elapsedSeconds = Math.floor(
        (now.getTime() - checkInTime.getTime()) / 1000
      );
      const allocatedSeconds = checkIn.allocatedDurationMinutes * 60;
      const remainingSeconds = allocatedSeconds - elapsedSeconds;
      const remainingMinutes = Math.ceil(remainingSeconds / 60);

      setTimeRemaining(remainingMinutes);
    }, 1000);

    return () => clearInterval(interval);
  }, [checkIn]);

  // Determine alert level
  const isWarning = timeRemaining <= checkIn.warningThresholdMinutes && timeRemaining > 0;
  const isCritical = timeRemaining <= 0;

  // Get colors based on status
  const getAlertColor = () => {
    if (isCritical) return "bg-red-50 border-red-200";
    if (isWarning) return "bg-yellow-50 border-yellow-200";
    return "bg-green-50 border-green-200";
  };

  const getTextColor = () => {
    if (isCritical) return "text-red-900";
    if (isWarning) return "text-yellow-900";
    return "text-green-900";
  };

  const getTimerColor = () => {
    if (isCritical) return "text-red-600";
    if (isWarning) return "text-yellow-600";
    return "text-green-600";
  };

  const getIcon = () => {
    if (isCritical) return <AlertTriangle className="w-6 h-6 text-red-600" />;
    if (isWarning) return <AlertCircle className="w-6 h-6 text-yellow-600" />;
    return <Clock className="w-6 h-6 text-green-600" />;
  };

  const getStatusLabel = () => {
    if (isCritical) return "OVERTIME";
    if (isWarning) return "WARNING";
    return "ACTIVE";
  };

  // Get identifier
  const identifier =
    checkIn.checkInType === "guest"
      ? checkIn.guest?.guestId || "Unknown Guest"
      : checkIn.user?.fullName || "Unknown User";

  return (
    <div
      className={`border-2 rounded-lg p-6 ${getAlertColor()} ${getTextColor()} transition-all`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {getIcon()}
          <div>
            <h3 className="text-lg font-bold">{getStatusLabel()}</h3>
            <p className="text-sm opacity-75">{identifier}</p>
          </div>
        </div>
        <div className="text-right">
          <div className={`text-4xl font-bold ${getTimerColor()}`}>
            {Math.max(0, timeRemaining)}
          </div>
          <p className="text-sm opacity-75">minutes remaining</p>
        </div>
      </div>

      {/* Details */}
      <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
        <div>
          <p className="opacity-75">Seat</p>
          <p className="font-semibold">{checkIn.seat?.displayLabel}</p>
        </div>
        <div>
          <p className="opacity-75">Allocated Duration</p>
          <p className="font-semibold">{checkIn.allocatedDurationMinutes} min</p>
        </div>
        <div>
          <p className="opacity-75">Elapsed Time</p>
          <p className="font-semibold">
            {checkIn.elapsedMinutes || 0} min
          </p>
        </div>
        <div>
          <p className="opacity-75">Payment</p>
          <p className="font-semibold">${checkIn.paymentAmount.toFixed(2)}</p>
        </div>
      </div>

      {/* Extension History */}
      {checkIn.extensionHistory && checkIn.extensionHistory.length > 0 && (
        <div className="mb-6 p-3 bg-white bg-opacity-50 rounded">
          <p className="text-sm font-semibold mb-2">Extensions</p>
          <div className="space-y-1 text-xs">
            {checkIn.extensionHistory.map((ext, idx) => (
              <div key={idx} className="flex justify-between">
                <span>+{ext.addedMinutes} min</span>
                <span>${ext.addedAmount.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Penalty Charges */}
      {checkIn.penaltyCharges && checkIn.penaltyCharges.length > 0 && (
        <div className="mb-6 p-3 bg-white bg-opacity-50 rounded">
          <p className="text-sm font-semibold mb-2">Penalties</p>
          <div className="space-y-1 text-xs">
            {checkIn.penaltyCharges.map((penalty, idx) => (
              <div key={idx} className="flex justify-between">
                <span>{penalty.reason}</span>
                <span>${penalty.amount.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3">
        {!isCritical && onExtend && (
          <button
            onClick={onExtend}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium text-sm"
          >
            Extend Duration
          </button>
        )}

        {(isWarning || isCritical) && onApplyPenalty && (
          <button
            onClick={onApplyPenalty}
            className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition font-medium text-sm"
          >
            Apply Penalty
          </button>
        )}

        {onCheckOut && (
          <button
            onClick={onCheckOut}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium text-sm"
          >
            Check Out
          </button>
        )}
      </div>
    </div>
  );
};

export default TimeoutWarningAlert;
