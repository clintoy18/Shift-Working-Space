using ASI.Basecode.Data.Models;
using System.Collections.Generic;
using System.Linq;
using static ASI.Basecode.Resources.Constants.Enums;

namespace ASI.Basecode.Services.Interfaces
{
    public interface ISeatService
    {
        IQueryable<Seat> GetAllSeats();
        IQueryable<Seat> GetSeatsByZone(string zoneType);
        Seat GetSeatByCode(string seatCode);
        Seat UpdateSeatStatus(string seatCode, SeatStatus status);
        Dictionary<string, int> GetAvailabilityByZone();
    }
}