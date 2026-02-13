export interface IDashboardStats {
    // User stats
    totalUsers: number;
    activeMembers: number;
    newUsersToday: number;
    
    // Seat stats
    totalSeats: number;
    availableSeats: number;
    occupiedSeats: number;
    reservedSeats: number;
    
    // Activity stats
    todayCheckIns: number;
    todayReservations: number;
    activeCheckIns: number;
    
    // Revenue (if tracking)
    todayRevenue?: number;
    monthRevenue?: number;
}

// For charts/analytics
export interface ISeatUtilization {
    date: string;
    occupancyRate: number;        // Percentage
    totalCheckIns: number;
}

export interface IRevenueByDay {
    date: string;
    revenue: number;
}