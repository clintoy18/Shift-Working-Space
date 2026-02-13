#nullable enable
using System;
using System.Collections.Generic;
using static ASI.Basecode.Resources.Constants.Enums;

namespace ASI.Basecode.Data.Models
{
    public class Seat
    {
        public int SeatId { get; set; }
        public string SeatNumber { get; set; } = string.Empty;
        public SeatType SeatType { get; set; }
        public SeatStatus Status { get; set; }
        public string Location { get; set; } = string.Empty;
        public decimal HourlyRate { get; set; }
        public decimal DailyRate { get; set; }
        public bool IsActive { get; set; } = true;
        public DateTime CreatedTime { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedTime { get; set; }
        public bool IsDeleted { get; set; }

        public ICollection<Reservation> Reservations { get; set; } = new List<Reservation>();
        public ICollection<CheckIn> CheckIns { get; set; } = new List<CheckIn>();
    }
}