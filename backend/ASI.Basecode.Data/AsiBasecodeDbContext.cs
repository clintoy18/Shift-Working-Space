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
                // Primary key
                entity.HasKey(s => s.SeatId);

                // Properties
                entity.Property(s => s.SeatNumber)
                    .IsRequired()
                    .HasMaxLength(20);

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
                entity.HasIndex(s => s.SeatNumber)
                    .IsUnique();

                entity.HasIndex(s => s.Status);

                // Relationships
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
            // ✅ Use static DateTime values instead of DateTime.UtcNow
            var seedDate = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc);

            // Seed Seats (20 seats)
            var seats = new List<Seat>();
            for (int i = 1; i <= 20; i++)
            {
                seats.Add(new Seat
                {
                    SeatId = i,
                    SeatNumber = $"S-{i:D3}",
                    SeatType = i <= 5 ? SeatType.VIP : i <= 15 ? SeatType.Premium : SeatType.Regular,
                    Status = SeatStatus.Available,
                    Location = $"Floor 1, Zone {(char)('A' + (i - 1) / 5)}",
                    HourlyRate = i <= 5 ? 50 : i <= 15 ? 30 : 20,
                    DailyRate = i <= 5 ? 400 : i <= 15 ? 240 : 160,
                    IsActive = true,
                    CreatedTime = seedDate,  // ✅ Static value
                    IsDeleted = false
                });
            }

            modelBuilder.Entity<Seat>().HasData(seats);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}