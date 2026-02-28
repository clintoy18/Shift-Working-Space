// src/interfaces/models/ISeat.ts
export type SeatType = 'Regular' | 'Premium' | 'VIP' | 'regular' | 'premium';
export type SeatStatus = 'available' | 'reserved' | 'occupied' | 'maintenance';

export interface IPricingOption {
    duration: number;
    label: string;
    price: number;
    isActive: boolean;
}

export interface ISeat {
    _id?: string;
    id?: string;
    seatId?: number;
    seatNumber: string;
    seatCode: string;
    displayLabel: string;
    seatType: SeatType;
    status: SeatStatus;
    location: string;
    zoneType: string;
    hourlyRate: number;
    dailyRate: number;
    pricingOptions?: IPricingOption[];
    isActive: boolean;
    createdTime?: string;
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