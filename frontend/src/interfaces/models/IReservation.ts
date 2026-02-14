import type { IUser } from './IUser';
import type { ISeat } from './ISeat';

export type ReservationStatus = 'Pending' | 'Confirmed' | 'Cancelled' | 'Completed';

export interface IReservation {
    ReservationId: number;
    UserId: string;
    SeatId: number;
    ReservationDate: string;      // ⚠️ C# DateTime → JS string (ISO)
    StartTime: string;            // ⚠️ C# TimeSpan → JS string "14:00:00"
    EndTime: string;              // ⚠️ C# TimeSpan → JS string "16:00:00"
    Status: ReservationStatus;
    CheckInTime?: string;         // C# DateTime? → JS string
    CheckOutTime?: string;        // C# DateTime? → JS string
    CreatedTime: string;
    CancelledTime?: string;
    IsDeleted: boolean;
    
    // Navigation properties (populated by backend with Include())
    User?: IUser;
    Seat?: ISeat;
}