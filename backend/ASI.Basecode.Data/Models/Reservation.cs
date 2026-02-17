#nullable enable
using System;
using static ASI.Basecode.Resources.Constants.Enums;

namespace ASI.Basecode.Data.Models
{
    public class Reservation
    {
        public int ReservationId { get; set; }
        public string UserId { get; set; } = string.Empty;
        public int SeatId { get; set; }
        public DateTime ReservationDate { get; set; }
        public TimeSpan StartTime { get; set; }
        public TimeSpan EndTime { get; set; }
        public ReservationStatus Status { get; set; }
        public DateTime? CheckInTime { get; set; }
        public DateTime? CheckOutTime { get; set; }
        public DateTime CreatedTime { get; set; } = DateTime.UtcNow;
        public DateTime? CancelledTime { get; set; }
        public bool IsDeleted { get; set; }

        public User User { get; set; } = null!;
        public Seat Seat { get; set; } = null!;
    }
}