export interface ICreateReservationRequest {
    seatId: number;
    reservationDate: string;      // "2025-02-15"
    startTime: string;            // "14:00"
    endTime: string;              // "16:00"
}

export interface IUpdateReservationRequest {
    reservationDate?: string;
    startTime?: string;
    endTime?: string;
    status?: 'Pending' | 'Confirmed' | 'Cancelled' | 'Completed';
}

export interface IGetReservationsQuery {
    userId?: string;
    seatId?: number;
    status?: string;
    startDate?: string;
    endDate?: string;
}

export interface ICancelReservationRequest {
    reason?: string;
}