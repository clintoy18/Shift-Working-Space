#nullable enable
using System;
using System.Collections.Generic;
using static ASI.Basecode.Resources.Constants.Enums;

namespace ASI.Basecode.Data.Models
{
  
        public class Seat
        {
            public int SeatId { get; set; }
            public string SeatNumber { get; set; } = string.Empty;  // "S-001"
            public string SeatCode { get; set; } = string.Empty;     // ✅ NEW: "isl-1-L-0" (for frontend mapping)
            public SeatType SeatType { get; set; }
            public SeatStatus Status { get; set; }
            public string Location { get; set; } = string.Empty;     // "Floor 1, Zone A"
            public string ZoneType { get; set; } = string.Empty;     // ✅ NEW: "Island", "Cubicle", "Conference", "Wall"
            public string DisplayLabel { get; set; } = string.Empty; // ✅ NEW: "R1", "R2" (as shown in UI)
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