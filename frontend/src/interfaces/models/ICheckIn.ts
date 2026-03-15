import type { IUser } from './IUser';
import type { ISeat } from './ISeat';
import type { IReservation } from './IReservation';

export type PaymentStatus = 'pending' | 'paid' | 'refunded';
export type CheckInType = 'guest' | 'registered';
export type CheckInStatus = 'active' | 'warning' | 'overtime' | 'completed';

export interface IExtensionRecord {
  addedMinutes: number;
  addedAmount: number;
  appliedAt: string;
  appliedBy: string;
}

export interface IPenaltyRecord {
  amount: number;
  reason: string;
  appliedAt: string;
  appliedBy: string;
}

export interface ICheckIn {
  // New unified fields
  id?: string;
  checkInId?: string;
  checkInType: CheckInType;
  user?: IUser;
  guest?: {
    id: string;
    guestId: string;
    email?: string;
    phoneNumber?: string;
  };
  seat: ISeat;
  reservation?: IReservation;
  checkInTime: string;
  checkOutTime?: string;
  durationMinutes?: number;
  processedBy: string;
  paymentStatus: PaymentStatus;
  paymentAmount: number;
  allocatedDurationMinutes: number;
  warningThresholdMinutes: number;
  status: CheckInStatus;
  extensionHistory: IExtensionRecord[];
  penaltyCharges: IPenaltyRecord[];
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;

  // Computed fields (not from DB)
  elapsedMinutes?: number;
  timeRemainingMinutes?: number;
  urgency?: 'critical' | 'warning';

  // Legacy fields for backward compatibility
  CheckInId?: number;
  UserId?: string;
  SeatId?: number;
  ReservationId?: number;
  CheckInTime?: string;
  CheckOutTime?: string;
  DurationMinutes?: number;
  ProcessedBy?: string;
  PaymentStatus?: PaymentStatus;
  PaymentAmount?: number;
  CreatedTime?: string;
  IsDeleted?: boolean;
  User?: IUser;
  Seat?: ISeat;
  Reservation?: IReservation;
}