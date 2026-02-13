export type SeatType = 'Regular' | 'Premium' | 'VIP';
export type SeatStatus = 'Available' | 'Reserved' | 'Occupied' | 'Maintenance';

export interface ISeat {
    SeatId: number;
    SeatNumber: string;       // "S-001"
    SeatCode: string;          // "isl-1-L-0"
    DisplayLabel: string;      // "R1"
    SeatType: SeatType;
    Status: SeatStatus;
    Location: string;          // "Floor 1, Central Area, Island Table 1, Left Side"
    ZoneType: string;          // "Island", "Cubicle", "Wall", "Regular Table"
    HourlyRate: number;
    DailyRate: number;
    IsActive: boolean;
    CreatedTime: string;
    UpdatedTime?: string;
    IsDeleted: boolean;
}

// Lightweight version for lists
export interface ISeatSummary {
    SeatId: number;
    SeatNumber: string;
    SeatCode: string;
    DisplayLabel: string;
    Status: SeatStatus;
    ZoneType: string;
}