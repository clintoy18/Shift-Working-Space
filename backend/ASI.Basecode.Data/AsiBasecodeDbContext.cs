using Microsoft.EntityFrameworkCore;
using ASI.Basecode.Data.Models;
using System;
using System.Collections.Generic;
using static ASI.Basecode.Resources.Constants.Enums;  // ✅ ADD THIS

namespace ASI.Basecode.Data
{
    public partial class AsiBasecodeDBContext : DbContext
    {
        public AsiBasecodeDBContext(DbContextOptions<AsiBasecodeDBContext> options)
            : base(options)
        {
        }

        // DbSets
        public virtual DbSet<User> Users { get; set; } = null!;
        public virtual DbSet<Seat> Seats { get; set; } = null!;
        public virtual DbSet<Reservation> Reservations { get; set; } = null!;
        public virtual DbSet<CheckIn> CheckIns { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            ConfigureUser(modelBuilder);
            ConfigureSeat(modelBuilder);
            ConfigureReservation(modelBuilder);
            ConfigureCheckIn(modelBuilder);
            SeedData(modelBuilder);

            OnModelCreatingPartial(modelBuilder);
        }

        private void ConfigureUser(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>(entity =>
            {
                // Primary key
                entity.HasKey(u => u.UserId);

                // Properties
                entity.Property(u => u.UserId)
                    .IsRequired()
                    .HasMaxLength(50);

                entity.Property(u => u.Email)
                    .IsRequired()
                    .HasMaxLength(150);

                entity.Property(u => u.HashedPassword)
                    .IsRequired()
                    .HasMaxLength(255);

                entity.Property(u => u.FirstName)
                    .IsRequired()
                    .HasMaxLength(50);

                entity.Property(u => u.MiddleName)
                    .HasMaxLength(50);

                entity.Property(u => u.LastName)
                    .IsRequired()
                    .HasMaxLength(50);

                entity.Property(u => u.Role)
                    .IsRequired()
                    .HasConversion<string>();

                entity.Property(u => u.MembershipType)
                    .IsRequired()
                    .HasConversion<string>();

                entity.Property(u => u.MembershipStatus)
                    .IsRequired()
                    .HasConversion<string>();

                entity.Property(u => u.CreatedTime)
                    .IsRequired()
                    .HasDefaultValueSql("GETUTCDATE()");

                entity.Property(u => u.IsDeleted)
                    .IsRequired()
                    .HasDefaultValue(false);

                // Indexes
                entity.HasIndex(u => u.UserId)
                    .IsUnique();

                entity.HasIndex(u => u.Email)
                    .IsUnique();

                // Relationships
                entity.HasMany(u => u.Reservations)
                    .WithOne(r => r.User)
                    .HasForeignKey(r => r.UserId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasMany(u => u.CheckIns)
                    .WithOne(c => c.User)
                    .HasForeignKey(c => c.UserId)
                    .OnDelete(DeleteBehavior.Restrict);
            });
        }

        private void ConfigureSeat(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Seat>(entity =>
            {
                entity.HasKey(s => s.SeatId);

                entity.Property(s => s.SeatNumber)
                    .IsRequired()
                    .HasMaxLength(20);

                entity.Property(s => s.SeatCode)      // ✅ NEW
                    .IsRequired()
                    .HasMaxLength(50);

                entity.Property(s => s.ZoneType)      // ✅ NEW
                    .IsRequired()
                    .HasMaxLength(50);

                entity.Property(s => s.DisplayLabel)  // ✅ NEW
                    .IsRequired()
                    .HasMaxLength(10);

                entity.Property(s => s.SeatType)
                    .IsRequired()
                    .HasConversion<string>();

                entity.Property(s => s.Status)
                    .IsRequired()
                    .HasConversion<string>();

                entity.Property(s => s.Location)
                    .IsRequired()
                    .HasMaxLength(100);

                entity.Property(s => s.HourlyRate)
                    .IsRequired()
                    .HasPrecision(10, 2);

                entity.Property(s => s.DailyRate)
                    .IsRequired()
                    .HasPrecision(10, 2);

                entity.Property(s => s.IsActive)
                    .IsRequired()
                    .HasDefaultValue(true);

                entity.Property(s => s.CreatedTime)
                    .IsRequired()
                    .HasDefaultValueSql("GETUTCDATE()");

                entity.Property(s => s.IsDeleted)
                    .IsRequired()
                    .HasDefaultValue(false);

                // Indexes
                entity.HasIndex(s => s.SeatNumber).IsUnique();
                entity.HasIndex(s => s.SeatCode).IsUnique();  // ✅ NEW: Frontend ID lookup
                entity.HasIndex(s => s.Status);
                entity.HasIndex(s => s.ZoneType);             // ✅ NEW: Query by zone

                // Relationships (unchanged)
                entity.HasMany(s => s.Reservations)
                    .WithOne(r => r.Seat)
                    .HasForeignKey(r => r.SeatId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasMany(s => s.CheckIns)
                    .WithOne(c => c.Seat)
                    .HasForeignKey(c => c.SeatId)
                    .OnDelete(DeleteBehavior.Restrict);
            });
        }
        private void ConfigureReservation(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Reservation>(entity =>
            {
                // Primary key
                entity.HasKey(r => r.ReservationId);

                // Properties
                entity.Property(r => r.UserId)
                    .IsRequired()
                    .HasMaxLength(50);

                entity.Property(r => r.SeatId)
                    .IsRequired();

                entity.Property(r => r.ReservationDate)
                    .IsRequired()
                    .HasColumnType("date");

                entity.Property(r => r.StartTime)
                    .IsRequired();

                entity.Property(r => r.EndTime)
                    .IsRequired();

                entity.Property(r => r.Status)
                    .IsRequired()
                    .HasConversion<string>();

                entity.Property(r => r.CreatedTime)
                    .IsRequired()
                    .HasDefaultValueSql("GETUTCDATE()");

                entity.Property(r => r.IsDeleted)
                    .IsRequired()
                    .HasDefaultValue(false);

                // Indexes
                entity.HasIndex(r => new { r.UserId, r.ReservationDate });
                entity.HasIndex(r => new { r.SeatId, r.ReservationDate });
                entity.HasIndex(r => r.Status);
            });
        }

        private void ConfigureCheckIn(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<CheckIn>(entity =>
            {
                // Primary key
                entity.HasKey(c => c.CheckInId);

                // Properties
                entity.Property(c => c.UserId)
                    .IsRequired()
                    .HasMaxLength(50);

                entity.Property(c => c.SeatId)
                    .IsRequired();

                entity.Property(c => c.CheckInTime)
                    .IsRequired();

                entity.Property(c => c.ProcessedBy)
                    .IsRequired()
                    .HasMaxLength(50);

                entity.Property(c => c.PaymentStatus)
                    .IsRequired()
                    .HasConversion<string>();

                entity.Property(c => c.PaymentAmount)
                    .IsRequired()
                    .HasPrecision(10, 2)
                    .HasDefaultValue(0);

                entity.Property(c => c.CreatedTime)
                    .IsRequired()
                    .HasDefaultValueSql("GETUTCDATE()");

                entity.Property(c => c.IsDeleted)
                    .IsRequired()
                    .HasDefaultValue(false);

                // Indexes
                entity.HasIndex(c => c.UserId);
                entity.HasIndex(c => c.SeatId);
                entity.HasIndex(c => c.CheckInTime);
                entity.HasIndex(c => new { c.CheckInTime, c.CheckOutTime });

                // Relationships
                entity.HasOne(c => c.Reservation)
                    .WithMany()
                    .HasForeignKey(c => c.ReservationId)
                    .OnDelete(DeleteBehavior.SetNull);
            });
        }

        private void SeedData(ModelBuilder modelBuilder)
        {
            var seedDate = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc);
            var seats = new List<Seat>();

            // 1. ISLAND TABLES (4 tables × 4 seats = 16 seats) - OPEN AREA CENTER
            var islandSeats = new[]
            {
        // Table 1 (T-01)
        (1, "isl-1-L-0", "R1", "Left"),
        (2, "isl-1-L-1", "R2", "Left"),
        (3, "isl-1-R-0", "R3", "Right"),
        (4, "isl-1-R-1", "R4", "Right"),
        
        // Table 2 (T-02)
        (5, "isl-2-L-0", "R5", "Left"),
        (6, "isl-2-L-1", "R6", "Left"),
        (7, "isl-2-R-0", "R7", "Right"),
        (8, "isl-2-R-1", "R8", "Right"),
        
        // Table 3 (T-03)
        (9, "isl-3-L-0", "R9", "Left"),
        (10, "isl-3-L-1", "R10", "Left"),
        (11, "isl-3-R-0", "R11", "Right"),
        (12, "isl-3-R-1", "R12", "Right"),
        
        // Table 4 (T-04)
        (13, "isl-4-L-0", "R13", "Left"),
        (14, "isl-4-L-1", "R14", "Left"),
        (15, "isl-4-R-0", "R15", "Right"),
        (16, "isl-4-R-1", "R16", "Right"),
    };

            foreach (var (id, code, label, side) in islandSeats)
            {
                seats.Add(new Seat
                {
                    SeatId = id,
                    SeatNumber = $"S-{id:D3}",
                    SeatCode = code,
                    DisplayLabel = label,
                    SeatType = SeatType.Regular,
                    Status = SeatStatus.Available,
                    Location = $"Floor 1, Central Area, Island Table {(id - 1) / 4 + 1}, {side} Side",
                    ZoneType = "Island",
                    HourlyRate = 20,
                    DailyRate = 160,
                    IsActive = true,
                    CreatedTime = seedDate,
                    IsDeleted = false
                });
            }

            // 2. WALL SEATS (5 seats) - RIGHT SIDE WALL
            var wallSeats = new[]
            {
        (17, "wall-3-0", "R20"),
        (18, "wall-3-1", "R21"),
        (19, "wall-3-2", "R22"),
        (20, "wall-3-3", "R23"),
        (21, "wall-3-4", "R24"),
    };

            foreach (var (id, code, label) in wallSeats)
            {
                seats.Add(new Seat
                {
                    SeatId = id,
                    SeatNumber = $"S-{id:D3}",
                    SeatCode = code,
                    DisplayLabel = label,
                    SeatType = SeatType.Regular,
                    Status = SeatStatus.Available,
                    Location = $"Floor 1, East Wall, Position {id - 16}",
                    ZoneType = "Wall",
                    HourlyRate = 20,
                    DailyRate = 160,
                    IsActive = true,
                    CreatedTime = seedDate,
                    IsDeleted = false
                });
            }

            // 3. REGULAR TABLE (6 seats) - NORTH WING RIGHT
            var regularTableSeats = new[]
            {
        (22, "huddle-2-L-2", "R28", "Left"),
        (23, "huddle-2-L-1", "R29", "Left"),
        (24, "huddle-2-L-0", "R30", "Left"),
        (25, "huddle-2-R-2", "R25", "Right"),
        (26, "huddle-2-R-1", "R26", "Right"),
        (27, "huddle-2-R-0", "R27", "Right"),
    };

            foreach (var (id, code, label, side) in regularTableSeats)
            {
                seats.Add(new Seat
                {
                    SeatId = id,
                    SeatNumber = $"S-{id:D3}",
                    SeatCode = code,
                    DisplayLabel = label,
                    SeatType = SeatType.Regular,
                    Status = SeatStatus.Available,
                    Location = $"Floor 1, North Wing, Regular Table, {side} Side",
                    ZoneType = "Regular Table",
                    HourlyRate = 20,
                    DailyRate = 160,
                    IsActive = true,
                    CreatedTime = seedDate,
                    IsDeleted = false
                });
            }

            // 4. FOCUS CUBICLES (4 cubicles) - SOUTH WING PREMIUM
            var cubicleSeats = new[]
            {
        (28, "cube-0", "C1"),
        (29, "cube-1", "C2"),
        (30, "cube-2", "C3"),
        (31, "cube-3", "C4"),
    };

            foreach (var (id, code, label) in cubicleSeats)
            {
                seats.Add(new Seat
                {
                    SeatId = id,
                    SeatNumber = $"S-{id:D3}",
                    SeatCode = code,
                    DisplayLabel = label,
                    SeatType = SeatType.Premium,  // ✅ Premium for deep work
                    Status = SeatStatus.Available,
                    Location = $"Floor 1, South Wing, Focus Cubicle {id - 27}",
                    ZoneType = "Cubicle",
                    HourlyRate = 30,  // ✅ Higher rate for private space
                    DailyRate = 240,
                    IsActive = true,
                    CreatedTime = seedDate,
                    IsDeleted = false
                });
            }

            modelBuilder.Entity<Seat>().HasData(seats);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}