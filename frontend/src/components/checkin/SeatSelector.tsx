import React from "react"
import { Check } from "lucide-react"
import type { ISeat } from "@/interfaces/models/ISeat"
import type { SeatTypeKey } from "@/config/seatTypesConfig"
import { SEAT_TYPES } from "@/config/seatTypesConfig"
import { cn } from "@/lib/utils"

interface SeatSelectorProps {
  seats: ISeat[]
  selectedSeat: ISeat | null
  onSelect: (seat: ISeat) => void
  seatType: SeatTypeKey
  disabled?: boolean
}

/**
 * SeatSelector Component
 * Displays available seats as a responsive grid of cards
 * Shows seat label, zone type, and visual feedback for selection
 */
export const SeatSelector: React.FC<SeatSelectorProps> = ({
  seats,
  selectedSeat,
  onSelect,
  seatType,
  disabled = false,
}) => {
  // Filter seats by selected seat type
  const filteredSeats = seats.filter((seat) => seat.seatType === seatType)

  if (filteredSeats.length === 0) {
    return (
      <div className="p-6 text-center bg-muted/30 rounded-lg border border-muted">
        <p className="text-sm text-muted-foreground">
          No seats available for this seat type
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
      {filteredSeats.map((seat) => {
        const isSelected =
          String(selectedSeat?._id || selectedSeat?.id || selectedSeat?.seatId) ===
          String(seat._id || seat.id || seat.seatId)

        return (
          <button
            key={String(seat._id || seat.id || seat.seatId)}
            type="button"
            onClick={() => onSelect(seat)}
            disabled={disabled}
            className={cn(
              "relative p-4 rounded-lg border-2 transition-all text-left",
              "hover:border-primary/50 disabled:opacity-50 disabled:cursor-not-allowed",
              isSelected
                ? "border-primary bg-primary/5 shadow-md"
                : "border-muted hover:bg-muted/30"
            )}
          >
            {/* Selected Indicator */}
            {isSelected && (
              <div className="absolute top-2 right-2">
                <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                  <Check className="w-3 h-3 text-primary-foreground" />
                </div>
              </div>
            )}

            {/* Seat Label */}
            <div className="font-semibold text-foreground text-sm">
              {seat.displayLabel}
            </div>

            {/* Zone Type */}
            <div className="text-xs text-muted-foreground mt-1">
              {seat.zoneType}
            </div>

            {/* Seat Type Badge */}
            <div className="mt-2 inline-block">
              <span className="text-xs font-medium px-2 py-1 bg-muted rounded">
                {SEAT_TYPES[seat.seatType]?.displayName || seat.seatType}
              </span>
            </div>
          </button>
        )
      })}
    </div>
  )
}

export default SeatSelector
