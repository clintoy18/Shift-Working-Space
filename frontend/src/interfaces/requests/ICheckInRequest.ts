/**
 * Check-In Request/Response Interfaces
 * Unified for both guest and registered user check-ins
 */

export interface ICheckInRequest {
  checkInType: "guest" | "registered";
  seatId: string;
  pricingOptionId: number;
  paymentStatus: "pending" | "paid" | "refunded";
  userId?: string; // Required if checkInType is 'registered'
  email?: string; // Optional for guest receipts
  phoneNumber?: string; // Optional for guest follow-up
  processedBy?: string; // Cashier name/ID
}

export interface ICheckOutRequest {
  checkInId: string;
  paymentAmount?: number;
}

export interface ICheckInResponse {
  id: string;
  checkInType: "guest" | "registered";
  guestId?: string; // Auto-generated if guest (GUEST-001, GUEST-002, etc.)
  userId?: string; // Present if registered user
  userName?: string; // User name if registered
  seatId: string;
  checkInTime: string;
  seatCode: string;
  seatLabel: string;
  allocatedDurationMinutes: number;
  warningThresholdMinutes: number;
  pricingLabel: string;
  paymentAmount: number;
}

export interface ICheckOutResponse {
  id: string;
  checkOutTime: string;
  durationMinutes: number;
  allocatedDurationMinutes: number;
  baseAmount: number;
  extensionCharges: number;
  penaltyCharges: number;
  totalAmount: number;
}

export interface IExtensionRequest {
  checkInId: string;
  additionalMinutes: number;
  additionalAmount: number;
  appliedBy?: string;
}

export interface IExtensionResponse {
  id: string;
  newAllocatedDuration: number;
  newWarningTime: number;
  extensionRecord: {
    addedMinutes: number;
    addedAmount: number;
    appliedAt: string;
    appliedBy: string;
  };
}

export interface IPenaltyRequest {
  checkInId: string;
  penaltyAmount: number;
  reason: string;
  appliedBy?: string;
}

export interface IPenaltyResponse {
  id: string;
  totalPenalties: number;
  penaltyRecord: {
    amount: number;
    reason: string;
    appliedAt: string;
    appliedBy: string;
  };
}

export interface ICheckInFilters {
  type?: "guest" | "registered";
  seatId?: string;
  userId?: string;
  status?: "active" | "warning" | "overtime";
}

export interface ICheckInHistoryFilters {
  startDate?: string;
  endDate?: string;
  type?: "guest" | "registered";
  seatId?: string;
  userId?: string;
  page?: number;
  limit?: number;
}

// Legacy interfaces for backward compatibility
export interface IGetCheckInsQuery {
  userId?: string;
  seatId?: number;
  isActive?: boolean;
  startDate?: string;
  endDate?: string;
}