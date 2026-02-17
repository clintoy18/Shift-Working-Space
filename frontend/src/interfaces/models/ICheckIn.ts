import type { IUser } from './IUser';
import type { ISeat } from './ISeat';
import type { IReservation } from './IReservation';

export type PaymentStatus = 'Paid' | 'Pending' | 'Free';

export interface ICheckIn {
    CheckInId: number;
    UserId: string;
    SeatId: number;
    ReservationId?: number;       // C# int? → TS number | undefined
    CheckInTime: string;          // C# DateTime → JS string
    CheckOutTime?: string;        // C# DateTime? → JS string
    DurationMinutes?: number;     // C# int? → TS number | undefined
    ProcessedBy: string;
    PaymentStatus: PaymentStatus;
    PaymentAmount: number;
    CreatedTime: string;
    IsDeleted: boolean;
    
    // Navigation properties
    User?: IUser;
    Seat?: ISeat;
    Reservation?: IReservation;
}