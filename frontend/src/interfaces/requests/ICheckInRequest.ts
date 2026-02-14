export interface ICheckInRequest {
    userId: string;
    seatId: number;
    reservationId?: number;       // Optional - for walk-ins
    paymentStatus: 'Paid' | 'Pending' | 'Free';
    paymentAmount?: number;
}

export interface ICheckOutRequest {
    checkInId: number;
    paymentAmount?: number;
}

export interface IGetCheckInsQuery {
    userId?: string;
    seatId?: number;
    isActive?: boolean;
    startDate?: string;
    endDate?: string;
}