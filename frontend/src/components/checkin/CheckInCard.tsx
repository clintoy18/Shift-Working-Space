import React, { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  AlertCircle,
  Clock,
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  User,
  Mail,
  Phone,
} from "lucide-react"
import type { ICheckIn } from "@/interfaces/models/ICheckIn"
import { cn } from "@/lib/utils"

interface CheckInCardProps {
  checkIn: ICheckIn
  onCheckOut: (checkInId: string) => void
  loading?: boolean
}

/**
 * CheckInCard Component
 * Displays check-in information in card format for mobile/responsive view
 * Shows key info, status badge, time remaining, and expandable details
 */
export const CheckInCard: React.FC<CheckInCardProps> = ({
  checkIn,
  onCheckOut,
  loading = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(false)

  // Get identifier (guest ID or user name)
  const getIdentifier = () => {
    if (checkIn.checkInType === "guest") {
      return checkIn.guest?.guestId || "Unknown Guest"
    }
    if (checkIn.checkInType === "registered") {
      return checkIn.user?.fullName || "Unknown User"
    }
    return "Invalid Check-In"
  }

  // Get status icon and color
  const getStatusDisplay = () => {
    switch (checkIn.status) {
      case "active":
        return {
          icon: CheckCircle2,
          color: "text-green-600",
          bgColor: "bg-green-50",
          label: "Active",
        }
      case "warning":
        return {
          icon: AlertCircle,
          color: "text-yellow-600",
          bgColor: "bg-yellow-50",
          label: "Warning",
        }
      case "overtime":
        return {
          icon: AlertTriangle,
          color: "text-red-600",
          bgColor: "bg-red-50",
          label: "Overtime",
        }
      default:
        return {
          icon: Clock,
          color: "text-muted-foreground",
          bgColor: "bg-muted/30",
          label: "Unknown",
        }
    }
  }

  const statusDisplay = getStatusDisplay()
  const StatusIcon = statusDisplay.icon

  // Get time remaining color
  const getTimeRemainingColor = () => {
    if (checkIn.timeRemainingMinutes === undefined) return "text-muted-foreground"
    if (checkIn.timeRemainingMinutes <= 0) return "text-red-600"
    if (checkIn.timeRemainingMinutes <= 5) return "text-yellow-600"
    return "text-green-600"
  }

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        {/* Main Card Content */}
        <div className="p-4 space-y-3">
          {/* Header: Identifier + Status */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground uppercase font-semibold">
                {checkIn.checkInType === "guest" ? "Guest ID" : "User"}
              </p>
              <p className="font-semibold text-foreground truncate">
                {getIdentifier()}
              </p>
            </div>
            <div
              className={cn(
                "flex items-center gap-2 px-3 py-1 rounded-full whitespace-nowrap",
                statusDisplay.bgColor
              )}
            >
              <StatusIcon className={cn("w-4 h-4", statusDisplay.color)} />
              <span className={cn("text-xs font-semibold", statusDisplay.color)}>
                {statusDisplay.label}
              </span>
            </div>
          </div>

          {/* Seat Info */}
          <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
            <div>
              <p className="text-xs text-muted-foreground uppercase font-semibold">
                Seat
              </p>
              <p className="font-medium text-foreground">
                {checkIn.seat?.displayLabel || "Unknown"}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground uppercase font-semibold">
                Zone
              </p>
              <p className="font-medium text-foreground">
                {checkIn.seat?.zoneType || "-"}
              </p>
            </div>
          </div>

          {/* Time Remaining - Prominent */}
          <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
            <p className="text-xs text-muted-foreground uppercase font-semibold mb-1">
              Time Remaining
            </p>
            <p className={cn("text-2xl font-bold", getTimeRemainingColor())}>
              {checkIn.timeRemainingMinutes !== undefined
                ? `${Math.max(0, checkIn.timeRemainingMinutes)} min`
                : "-"}
            </p>
          </div>

          {/* Check-In Time */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Check-In Time:</span>
            <span className="font-medium text-foreground">
              {new Date(checkIn.checkInTime).toLocaleTimeString()}
            </span>
          </div>

          {/* Amount */}
          <div className="flex items-center justify-between text-sm border-t border-muted pt-3">
            <span className="text-muted-foreground">Amount:</span>
            <span className="font-semibold text-foreground">
              P{checkIn.paymentAmount.toFixed(2)}
            </span>
          </div>

          {/* Expandable Details */}
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full flex items-center justify-between text-sm text-primary hover:text-primary/80 transition py-2"
          >
            <span className="font-medium">
              {isExpanded ? "Hide" : "Show"} Details
            </span>
            {isExpanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>

          {/* Expanded Details */}
          {isExpanded && (
            <div className="space-y-3 pt-3 border-t border-muted">
              {/* Check-In Type */}
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Type:</span>
                <span className="font-medium text-foreground capitalize">
                  {checkIn.checkInType}
                </span>
              </div>

              {/* Guest Contact Info */}
              {checkIn.checkInType === "guest" && (
                <>
                  {checkIn.guest?.email && (
                    <div className="flex items-start gap-2 text-sm">
                      <Mail className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                      <div className="min-w-0">
                        <p className="text-muted-foreground">Email</p>
                        <p className="font-medium text-foreground break-all">
                          {checkIn.guest.email}
                        </p>
                      </div>
                    </div>
                  )}
                  {checkIn.guest?.phoneNumber && (
                    <div className="flex items-start gap-2 text-sm">
                      <Phone className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                      <div className="min-w-0">
                        <p className="text-muted-foreground">Phone</p>
                        <p className="font-medium text-foreground">
                          {checkIn.guest.phoneNumber}
                        </p>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* User Info */}
              {checkIn.checkInType === "registered" && checkIn.user && (
                <>
                  <div className="flex items-start gap-2 text-sm">
                    <User className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                    <div className="min-w-0">
                      <p className="text-muted-foreground">Email</p>
                      <p className="font-medium text-foreground break-all">
                        {checkIn.user.email}
                      </p>
                    </div>
                  </div>
                  {checkIn.user.membershipStatus && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Membership:</span>
                      <span className="font-medium text-foreground">
                        {checkIn.user.membershipStatus}
                      </span>
                    </div>
                  )}
                </>
              )}

              {/* Payment Status */}
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Payment Status:</span>
                <span className="font-medium text-foreground capitalize">
                  {checkIn.paymentStatus}
                </span>
              </div>

              {/* Processed By */}
              {checkIn.processedBy && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Processed By:</span>
                  <span className="font-medium text-foreground">
                    {checkIn.processedBy}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Check Out Button - Sticky at Bottom */}
        <div className="p-4 border-t border-muted bg-muted/20">
          <Button
            onClick={() => onCheckOut(checkIn.id)}
            disabled={loading}
            variant="outline"
            className="w-full"
          >
            Check Out
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default CheckInCard
