import React, { useState, useEffect, useContext } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FormLabel } from "@/components/ui/form-label"
import { User, Mail, Phone } from "lucide-react"
import CheckInService from "@/services/CheckInService"
import { seatService } from "@/services/SeatService"
import { fetchAllUsersAdmin } from "@/services/AdminService"
import { useToast } from "@/context/ToastContext"
import { AuthContext } from "@/context/AuthContext"
import {
  getPricingForSeatType,
  formatPrice,
  formatDuration,
  type PricingOption,
} from "@/config/pricingConfig"
import { SEAT_TYPES, getAllSeatTypes, type SeatTypeKey } from "@/config/seatTypesConfig"
import type { ICheckInRequest, ICheckInResponse } from "@/interfaces/requests/ICheckInRequest"
import type { ISeat } from "@/interfaces/models/ISeat"
import type { IUser } from "@/interfaces/models/IUser"
import Loader from "@/components/ui/loader"
import SeatSelector from "./SeatSelector"
import UserSearchDropdown from "./UserSearchDropdown"
import WizardSteps from "./WizardSteps"

type CheckInType = "guest" | "registered"

interface CheckInFormProps {
  onSuccess?: (response: ICheckInResponse) => void
  processedBy?: string
}

/**
 * Unified Check-In Form Component - Multi-Step Wizard
 * Supports both guest and registered user check-ins
 * Organized into 5 steps with progress indicator
 */


const CheckInForm: React.FC<CheckInFormProps> = ({
  onSuccess,
  processedBy = "System",
}) => {
  const { user } = useContext(AuthContext) || {};
  const { showToast } = useToast()

  // Wizard state
  const [currentStep, setCurrentStep] = useState(0)

  // Form state
  const [checkInType, setCheckInType] = useState<CheckInType>("guest")
  const [selectedSeatType, setSelectedSeatType] = useState<SeatTypeKey>("regular")
  const [selectedSeat, setSelectedSeat] = useState<ISeat | null>(null)
  const [selectedPricingOption, setSelectedPricingOption] = useState<PricingOption | null>(null)
  const [paymentStatus] = useState<"pending" | "paid" | "refunded">("paid")
  const [email, setEmail] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null)

  // Data state
  const [seats, setSeats] = useState<ISeat[]>([])
  const [allUsers, setAllUsers] = useState<IUser[]>([])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)

  // Fetch seats and users on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        // Fetch seats
        const allSeats = await seatService.getAllSeats()
        const availableSeats = allSeats.filter((s) => s.status === "available")
        setSeats(availableSeats)

        // Fetch users
        const users = await fetchAllUsersAdmin()
        setAllUsers(users || [])
      } catch (error) {
        showToast("Error loading data", "error")
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [showToast])

  // Get pricing options for selected seat type
  const pricingOptions = getPricingForSeatType(selectedSeatType)
  const seatTypeConfig = SEAT_TYPES[selectedSeatType]

  // Wizard steps definition
  const wizardSteps = [
    {
      id: "check-in-type",
      label: "Check-In Type",
      description: "Choose between guest or registered user",
    },
    {
      id: "seat-type",
      label: "Seat Type",
      description: "Select the type of seat",
    },
    {
      id: "seat-selection",
      label: "Select Seat",
      description: "Choose an available seat",
    },
    {
      id: "pricing",
      label: "Duration & Price",
      description: "Select duration and review pricing",
    },
    {
      id: "review",
      label: "Review & Confirm",
      description: "Review details and confirm check-in",
    },
  ]

  // Step validation
  const isStepValid = () => {
    switch (currentStep) {
      case 0: // Check-In Type
        return true
      case 1: // Seat Type
        return true
      case 2: // Seat Selection
        return selectedSeat !== null
      case 3: // Pricing
        return selectedPricingOption !== null
      case 4: // Review
        if (checkInType === "guest") {
          return email || phoneNumber
        } else {
          return selectedUser !== null
        }
      default:
        return false
    }
  }

  // Handle next step
  const handleNext = () => {
    if (isStepValid() && currentStep < wizardSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  // Handle back step
  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!selectedPricingOption) {
      showToast("Please select a pricing option", "error")
      return
    }

    if (checkInType === "guest") {
      if (!email && !phoneNumber) {
        showToast("Guest check-in requires email or phone number", "error")
        return
      }
    } else {
      if (!selectedUser) {
        showToast("Please select a registered user", "error")
        return
      }
    }

    setShowConfirmation(true)
  }

  // Handle confirmation
  const handleConfirm = async () => {
    if (!selectedPricingOption) {
      return
    }

    try {
      setSubmitting(true)

      // Find a seat of the selected type
      const seatOfType = seats.find((s) => s.seatType === selectedSeatType)
      if (!seatOfType) {
        showToast("No seats available for selected type", "error")
        setSubmitting(false)
        return
      }

      // Find the pricing option index
      const pricingIndex = pricingOptions.findIndex(
        (opt) => opt.duration === selectedPricingOption.duration && opt.price === selectedPricingOption.price
      )

      const checkInData: ICheckInRequest = {
        checkInType,
        seatId: String(seatOfType._id || seatOfType.id || seatOfType.seatId || ""),
        pricingOptionId: pricingIndex,
        paymentStatus,
        processedBy: user?.fullName || processedBy || "System",
        ...(checkInType === "registered" && {
          userId: selectedUser?.id,
        }),
      }

      const response = await CheckInService.checkIn(checkInData)

      showToast(
        `Check-in successful! ${checkInType === "guest" ? `Guest ID: ${response.guestId}` : `User: ${response.userName}`}`,
        "success"
      )

      // Reset form
      setCurrentStep(0)
      setCheckInType("guest")
      setSelectedSeat(null)
      setSelectedPricingOption(null)
      setEmail("")
      setPhoneNumber("")
      setSelectedUser(null)
      setShowConfirmation(false)

      if (onSuccess) {
        onSuccess(response)
      }
    } catch (error) {
      let errorMessage = "Error during check-in. Please try again."
      const err = error as unknown as { response?: { status: number; data?: { message?: string; existingSeatId?: string; existingCheckInType?: string; checkInType?: string; existingCheckInId?: string } }; message?: string }

      if (err.response?.status === 409) {
        const data = err.response?.data
        if (data?.existingSeatId || data?.existingCheckInType === "registered") {
          errorMessage = `⚠️ User already checked in! This user has an active check-in. Please check them out first before checking in again.`
        } else {
          const occupiedBy = data?.checkInType === "guest"
            ? `Guest ${data?.existingCheckInId}`
            : "another user"
          errorMessage = `❌ Seat unavailable: Already occupied by ${occupiedBy}. Please select a different seat.`
        }
      } else if (err.response?.status === 400) {
        errorMessage = err.response?.data?.message || "Invalid check-in data. Please verify all fields."
      } else if (err.response?.status === 404) {
        errorMessage = "Seat or user not found. Please refresh and try again."
      } else if (err.response?.status === 500) {
        errorMessage = "Server error occurred. Please try again later."
      } else if (err.message?.includes("Network")) {
        errorMessage = "Network error. Please check your connection and try again."
      }

      showToast(errorMessage, "error")
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <Card className="w-full">
        <CardContent className="flex items-center justify-center py-12">
          <Loader variant="spinner" size="lg" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full shadow-lg border-muted">
      <CardHeader className="border-b">
        <CardTitle className="text-3xl font-bold tracking-tight">Check-In</CardTitle>
        <p className="text-muted-foreground text-sm mt-2">
          {checkInType === "guest" ? "Register a walk-in guest" : "Check in a registered member"}
        </p>
      </CardHeader>

      <CardContent className="pt-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Step 1: Check-In Type */}
          {currentStep === 0 && (
            <div className="space-y-6">
              <FormLabel>Check-In Type</FormLabel>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { value: "guest", label: "Guest (Walk-in)", icon: User },
                  { value: "registered", label: "Registered User", icon: User },
                ].map(({ value, label, icon: Icon }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => {
                      setCheckInType(value as CheckInType)
                      if (value === "guest") {
                        setSelectedUser(null)
                      } else {
                        setEmail("")
                        setPhoneNumber("")
                      }
                    }}
                    className={`p-6 rounded-lg border-2 transition-all flex items-center gap-4 ${
                      checkInType === value
                        ? "border-primary bg-primary/5 shadow-md"
                        : "border-muted hover:border-primary/50 hover:bg-muted/30"
                    }`}
                  >
                    <Icon className="h-6 w-6 flex-shrink-0" />
                    <div className="text-left">
                      <div className="font-semibold text-foreground">{label}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {value === "guest" ? "No account needed" : "Requires membership"}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Seat Type */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <FormLabel>Seat Type</FormLabel>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {getAllSeatTypes().map((seatType) => (
                  <button
                    key={seatType.key}
                    type="button"
                    onClick={() => {
                      setSelectedSeatType(seatType.key)
                      setSelectedSeat(null)
                      setSelectedPricingOption(null)
                    }}
                    className={`p-6 rounded-lg border-2 transition-all text-left ${
                      selectedSeatType === seatType.key
                        ? "border-primary bg-primary/5 shadow-md"
                        : "border-muted hover:border-primary/50 hover:bg-muted/30"
                    }`}
                  >
                    <div className="font-semibold text-foreground text-base">
                      {seatType.displayName}
                    </div>
                    <div className="text-sm text-muted-foreground mt-2">
                      {seatType.description}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Seat Selection */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <FormLabel>Select Seat</FormLabel>
              <SeatSelector
                seats={seats}
                selectedSeat={selectedSeat}
                onSelect={(seat) => {
                  setSelectedSeat(seat)
                  setSelectedPricingOption(null)
                }}
                seatType={selectedSeatType}
                disabled={loading}
              />
            </div>
          )}

          {/* Step 4: Pricing */}
          {currentStep === 3 && selectedSeat && (
            <div className="space-y-6">
              <FormLabel>Duration & Price</FormLabel>
              {pricingOptions.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {pricingOptions.map((option) => (
                    <button
                      key={`${option.duration}-${option.price}`}
                      type="button"
                      onClick={() => setSelectedPricingOption(option)}
                      disabled={!option.isActive}
                      className={`p-6 rounded-lg border-2 transition-all text-left ${
                        selectedPricingOption?.duration === option.duration &&
                        selectedPricingOption?.price === option.price
                          ? "border-primary bg-primary/5 shadow-md"
                          : "border-muted hover:border-primary/50 hover:bg-muted/30"
                      } ${!option.isActive ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      <div className="font-semibold text-foreground text-base">
                        {option.label}
                      </div>
                      <div className="text-sm text-muted-foreground mt-2">
                        {formatDuration(option.duration)}
                      </div>
                      <div className="text-lg font-bold text-primary mt-3">
                        {formatPrice(option.price)}
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center bg-muted/30 rounded-lg border border-muted">
                  <p className="text-sm text-muted-foreground">
                    No pricing options available for this seat type
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Step 5: Review & Confirm */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <FormLabel>Review & Confirm</FormLabel>

              {/* Summary Card */}
              <div className="space-y-4 p-6 bg-muted/50 rounded-lg border border-muted">
                <h3 className="font-semibold text-foreground text-base">Check-In Summary</h3>

                {/* Check-In Type Info */}
                <div className="space-y-3 pb-4 border-b border-muted">
                  {checkInType === "guest" ? (
                    <>
                      <div className="flex items-center gap-3 p-3 bg-background rounded-lg">
                        <User className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                        <div>
                          <p className="text-xs text-muted-foreground uppercase font-semibold">
                            Guest ID
                          </p>
                          <p className="font-medium text-foreground">Auto-generated</p>
                        </div>
                      </div>
                      {email && (
                        <div className="flex items-center gap-3 p-3 bg-background rounded-lg">
                          <Mail className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                          <div>
                            <p className="text-xs text-muted-foreground uppercase font-semibold">
                              Email
                            </p>
                            <p className="font-medium text-foreground break-all">{email}</p>
                          </div>
                        </div>
                      )}
                      {phoneNumber && (
                        <div className="flex items-center gap-3 p-3 bg-background rounded-lg">
                          <Phone className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                          <div>
                            <p className="text-xs text-muted-foreground uppercase font-semibold">
                              Phone
                            </p>
                            <p className="font-medium text-foreground">{phoneNumber}</p>
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="flex items-center gap-3 p-3 bg-background rounded-lg">
                      <User className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                      <div>
                        <p className="text-xs text-muted-foreground uppercase font-semibold">
                          User
                        </p>
                        <p className="font-medium text-foreground">{selectedUser?.fullName}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Seat & Pricing Info */}
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Seat Type:</span>
                    <span className="font-medium text-foreground">
                      {seatTypeConfig.displayName}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Seat:</span>
                    <span className="font-medium text-foreground">
                      {selectedSeat?.displayLabel}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Duration:</span>
                    <span className="font-medium text-foreground">
                      {selectedPricingOption?.label} ({formatDuration(selectedPricingOption?.duration || 0)})
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Payment Status:</span>
                    <span className="font-medium text-foreground capitalize">
                      {paymentStatus}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm border-t border-muted pt-3 mt-3">
                    <span className="text-muted-foreground font-semibold">Total Charge:</span>
                    <span className="font-bold text-primary text-base">
                      {formatPrice(selectedPricingOption?.price || 0)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Guest/User Info Section */}
              {checkInType === "guest" && (
                <div className="space-y-4 p-6 bg-muted/50 rounded-lg border border-muted">
                  <h3 className="font-semibold text-foreground text-base">Guest Information</h3>
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <FormLabel>Email (Optional)</FormLabel>
                      <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="guest@example.com"
                        className="h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <FormLabel>Phone Number (Optional)</FormLabel>
                      <Input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="+1 (555) 000-0000"
                        className="h-11"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      At least email or phone is required for receipts
                    </p>
                  </div>
                </div>
              )}

              {checkInType === "registered" && (
                <div className="space-y-4 p-6 bg-muted/50 rounded-lg border border-muted">
                  <h3 className="font-semibold text-foreground text-base">User Information</h3>
                  <UserSearchDropdown
                    users={allUsers}
                    selectedUser={selectedUser}
                    onSelect={setSelectedUser}
                    onClear={() => setSelectedUser(null)}
                  />
                </div>
              )}
            </div>
          )}

          {/* Wizard Navigation */}
          <WizardSteps
            steps={wizardSteps}
            currentStep={currentStep}
            onNext={handleNext}
            onBack={handleBack}
            onSubmit={() => {
              const event = new Event('submit', { bubbles: true, cancelable: true })
              handleSubmit(event as unknown as React.FormEvent<HTMLFormElement>)
            }}
            isNextDisabled={!isStepValid()}
            isSubmitDisabled={!isStepValid() || submitting}
            loading={submitting}
          />
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
                          <p className="text-xs text-muted-foreground uppercase font-semibold">
                            Guest ID
                          </p>
                          <p className="font-medium text-foreground">Auto-generated</p>
                        </div>
                      </div>
                      {email && (
                        <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                          <Mail className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                          <div>
                            <p className="text-xs text-muted-foreground uppercase font-semibold">
                              Email
                            </p>
                            <p className="font-medium text-foreground">{email}</p>
                          </div>
                        </div>
                      )}
                      {phoneNumber && (
                        <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                          <Phone className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                          <div>
                            <p className="text-xs text-muted-foreground uppercase font-semibold">
                              Phone
                            </p>
                            <p className="font-medium text-foreground">{phoneNumber}</p>
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                      <User className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                      <div>
                        <p className="text-xs text-muted-foreground uppercase font-semibold">
                          User
                        </p>
                        <p className="font-medium text-foreground">{selectedUser?.fullName}</p>
                      </div>
                    </div>
                  )}

                  <div className="border-t border-muted pt-4 space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Seat Type:</span>
                      <span className="font-medium text-foreground">
                        {seatTypeConfig.displayName}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Seat:</span>
                      <span className="font-medium text-foreground">
                        {selectedSeat.displayLabel}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Duration:</span>
                      <span className="font-medium text-foreground">
                        {selectedPricingOption.label}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm border-t border-muted pt-3 mt-3">
                      <span className="text-muted-foreground font-semibold">Charge:</span>
                      <span className="font-semibold text-primary text-base">
                        {formatPrice(selectedPricingOption.price)}
                      </span>
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
  )
}

export default CheckInForm
