using ASI.Basecode.Data.Models;
using System.Linq;

namespace ASI.Basecode.Data.Interfaces
{
    public interface ISeatRepository
    {
        IQueryable<Seat> GetSeats();
        Seat GetSeat(int seatId);
        Seat GetSeatByCode(string seatCode);
        void AddSeat(Seat seat);
        void UpdateSeat(Seat seat);
        void DeleteSeat(int seatId);
    }
}