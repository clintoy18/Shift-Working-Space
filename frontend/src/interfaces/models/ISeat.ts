// src/interfaces/models/ISeat.ts
export type SeatType = 'Regular' | 'Premium' | 'VIP';
export type SeatStatus = 'Available' | 'Reserved' | 'Occupied' | 'Maintenance';

export interface ISeat {
    seatId: number;
    seatNumber: string;
    seatCode: string;
    displayLabel: string;
    seatType: SeatType;
    status: SeatStatus;     
    location: string;
    zoneType: string;
    hourlyRate: number;
    dailyRate: number;
    isActive: boolean;
    createdTime: string;
    updatedTime?: string;
    isDeleted: boolean;
}

export interface ISeatSummary {
    seatId: number;
    seatNumber: string;
    seatCode: string;
    displayLabel: string;
    status: SeatStatus;
    zoneType: string;
}