export type SeatType = 'Regular' | 'Premium' | 'VIP';
export type SeatStatus = 'Available' | 'Reserved' | 'Occupied' | 'Maintenance';

export interface ISeat {
    SeatId: number;
    SeatNumber: string;
    SeatType: SeatType;
    Status: SeatStatus;
    Location: string;
    HourlyRate: number;
    DailyRate: number;
    IsActive: boolean;
    CreatedTime: string;
    UpdatedTime?: string;
    IsDeleted: boolean;
}