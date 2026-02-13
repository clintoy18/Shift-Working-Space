using ASI.Basecode.Data.EFCore;
using ASI.Basecode.Data.Interfaces;
using ASI.Basecode.Data.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;

namespace ASI.Basecode.Data.Repositories
{
    public class SeatRepository : BaseRepository<Seat>, ISeatRepository
    {
        public SeatRepository(IUnitOfWork unitOfWork) : base(unitOfWork)
        {
        }

        public IQueryable<Seat> GetSeats()
        {
            return GetDbSet<Seat>()
                .Where(s => !s.IsDeleted && s.IsActive);
        }

        public Seat GetSeat(int seatId)
        {
            return GetDbSet<Seat>()
                .FirstOrDefault(s => s.SeatId == seatId && !s.IsDeleted);
        }

        public Seat GetSeatByCode(string seatCode)
        {
            if (string.IsNullOrWhiteSpace(seatCode))
                return null;

            seatCode = seatCode.Trim();

            return GetDbSet<Seat>()
                .FirstOrDefault(s => s.SeatCode.ToLower() == seatCode.ToLower() && !s.IsDeleted);
        }

        public void AddSeat(Seat seat)
        {
            if (seat == null)
                throw new ArgumentNullException(nameof(seat));

            GetDbSet<Seat>().Add(seat);
            UnitOfWork.SaveChanges();
        }

        public void UpdateSeat(Seat seat)
        {
            if (seat == null)
                throw new ArgumentNullException(nameof(seat));

            GetDbSet<Seat>().Update(seat);
            UnitOfWork.SaveChanges();
        }

        public void DeleteSeat(int seatId)
        {
            var seat = GetSeat(seatId);
            if (seat != null)
            {
                seat.IsDeleted = true;
                UnitOfWork.SaveChanges();
            }
        }
    }
}