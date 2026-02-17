#nullable enable
using System;
using static ASI.Basecode.Resources.Constants.Enums;

namespace ASI.Basecode.Data.Models
{
    public class CheckIn
    {
        public int CheckInId { get; set; }
        public string UserId { get; set; } = string.Empty;
        public int SeatId { get; set; }
        public int? ReservationId { get; set; }
        public DateTime CheckInTime { get; set; }
        public DateTime? CheckOutTime { get; set; }
        public int? DurationMinutes { get; set; }
        public string ProcessedBy { get; set; } = string.Empty;
        public PaymentStatus PaymentStatus { get; set; }
        public decimal PaymentAmount { get; set; }
        public DateTime CreatedTime { get; set; } = DateTime.UtcNow;
        public bool IsDeleted { get; set; }

        public User User { get; set; } = null!;
        public Seat Seat { get; set; } = null!;
        public Reservation? Reservation { get; set; }
    }
}