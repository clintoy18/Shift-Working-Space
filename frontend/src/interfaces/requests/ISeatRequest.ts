export interface IGetSeatsQuery {
    status?: 'Available' | 'Reserved' | 'Occupied' | 'Maintenance';
    seatType?: 'Regular' | 'Premium' | 'VIP';
    zoneType?: string;
    location?: string;
    isActive?: boolean;
}

export interface ICreateSeatRequest {
    seatNumber: string;
    seatCode: string;
    displayLabel: string;
    seatType: 'Regular' | 'Premium' | 'VIP';
    location: string;
    zoneType: string;
    hourlyRate: number;
    dailyRate: number;
}

export interface IUpdateSeatRequest {
    seatNumber?: string;
    displayLabel?: string;
    seatType?: 'Regular' | 'Premium' | 'VIP';
    location?: string;
    zoneType?: string;
    hourlyRate?: number;
    dailyRate?: number;
    isActive?: boolean;
}

export interface IUpdateSeatStatusRequest {
    status: 'Available' | 'Reserved' | 'Occupied' | 'Maintenance';
}