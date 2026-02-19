export interface IUserStatistics {
  total:    number;
  admins:   number;
  cashiers: number;
  shifties: number;
}

export interface IDashboardStats {
  userStats: IUserStatistics;

  // Seat stats
  totalSeats:      number;
  availableSeats:  number;
  occupiedSeats:   number;
  reservedSeats:   number;

  // Activity stats
  todayCheckIns:      number;
  todayReservations:  number;
  activeCheckIns:     number;
  activeMembers:      number;
  newUsersToday:      number;

  // Revenue
  todayRevenue?:  number;
  monthRevenue?:  number;
}