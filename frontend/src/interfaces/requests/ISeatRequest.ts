export interface ICreateSeatRequest {
    seatNumber: string;
    seatType: 'Regular' | 'Premium' | 'VIP';
    location: string;
    hourlyRate: number;
    dailyRate: number;
}

export interface IUpdateSeatRequest {
    seatNumber?: string;
    seatType?: 'Regular' | 'Premium' | 'VIP';
    location?: string;
    hourlyRate?: number;
    dailyRate?: number;
    isActive?: boolean;
}

export interface IUpdateSeatStatusRequest {
    status: 'Available' | 'Reserved' | 'Occupied' | 'Maintenance';
}

export interface IGetSeatsQuery {
    status?: string;
    seatType?: string;
    location?: string;
    isActive?: boolean;
}