import React, { useState, useEffect } from "react";
import { AlertCircle, Clock, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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

  // Get text color based on status
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
    <Card className={`border-2 ${isCritical ? "bg-red-50 border-red-200" : isWarning ? "bg-yellow-50 border-yellow-200" : "bg-green-50 border-green-200"} transition-all`}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {getIcon()}
            <div>
              <CardTitle className={`text-lg ${getTextColor()}`}>
                {getStatusLabel()}
              </CardTitle>
              <p className={`text-sm ${getTextColor()} opacity-75`}>{identifier}</p>
            </div>
          </div>
          <div className="text-right">
            <div className={`text-4xl font-bold ${getTimerColor()}`}>
              {Math.max(0, timeRemaining)}
            </div>
            <p className={`text-sm ${getTextColor()} opacity-75`}>minutes remaining</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className={`text-xs font-bold uppercase tracking-wider ${getTextColor()} opacity-75 mb-1`}>
              Seat
            </p>
            <p className={`font-semibold ${getTextColor()}`}>{checkIn.seat?.displayLabel}</p>
          </div>
          <div>
            <p className={`text-xs font-bold uppercase tracking-wider ${getTextColor()} opacity-75 mb-1`}>
              Allocated Duration
            </p>
            <p className={`font-semibold ${getTextColor()}`}>{checkIn.allocatedDurationMinutes} min</p>
          </div>
          <div>
            <p className={`text-xs font-bold uppercase tracking-wider ${getTextColor()} opacity-75 mb-1`}>
              Elapsed Time
            </p>
            <p className={`font-semibold ${getTextColor()}`}>
              {checkIn.elapsedMinutes || 0} min
            </p>
          </div>
          <div>
            <p className={`text-xs font-bold uppercase tracking-wider ${getTextColor()} opacity-75 mb-1`}>
              Payment
            </p>
            <p className={`font-semibold ${getTextColor()}`}>${checkIn.paymentAmount.toFixed(2)}</p>
          </div>
        </div>

        {/* Extension History */}
        {checkIn.extensionHistory && checkIn.extensionHistory.length > 0 && (
          <div className={`p-3 rounded-lg ${isCritical ? "bg-red-100/50" : isWarning ? "bg-yellow-100/50" : "bg-green-100/50"}`}>
            <p className={`text-sm font-semibold mb-2 ${getTextColor()}`}>Extensions</p>
            <div className="space-y-1 text-xs">
              {checkIn.extensionHistory.map((ext, idx) => (
                <div key={idx} className={`flex justify-between ${getTextColor()}`}>
                  <span>+{ext.addedMinutes} min</span>
                  <span>${ext.addedAmount.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Penalty Charges */}
        {checkIn.penaltyCharges && checkIn.penaltyCharges.length > 0 && (
          <div className={`p-3 rounded-lg ${isCritical ? "bg-red-100/50" : isWarning ? "bg-yellow-100/50" : "bg-green-100/50"}`}>
            <p className={`text-sm font-semibold mb-2 ${getTextColor()}`}>Penalties</p>
            <div className="space-y-1 text-xs">
              {checkIn.penaltyCharges.map((penalty, idx) => (
                <div key={idx} className={`flex justify-between ${getTextColor()}`}>
                  <span>{penalty.reason}</span>
                  <span>${penalty.amount.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          {!isCritical && onExtend && (
            <Button
              onClick={onExtend}
              variant="outline"
              className="flex-1"
              size="sm"
            >
              Extend Duration
            </Button>
          )}

          {(isWarning || isCritical) && onApplyPenalty && (
            <Button
              onClick={onApplyPenalty}
              variant="outline"
              className="flex-1"
              size="sm"
            >
              Apply Penalty
            </Button>
          )}

          {onCheckOut && (
            <Button
              onClick={onCheckOut}
              variant="outline"
              className="flex-1"
              size="sm"
            >
              Check Out
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TimeoutWarningAlert;
