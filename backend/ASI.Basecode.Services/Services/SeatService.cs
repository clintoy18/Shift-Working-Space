#nullable enable

using ASI.Basecode.Data.Interfaces;
using ASI.Basecode.Data.Models;
using ASI.Basecode.Data.Repositories;
using ASI.Basecode.Services.Interfaces;
using ASI.Basecode.Services.Manager;
using ASI.Basecode.Services.ServiceModels;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using static ASI.Basecode.Resources.Constants.Enums;

namespace ASI.Basecode.Services.Services
{
    public class SeatService : ISeatService
    {
        private readonly ISeatRepository _seatRepository;

        public SeatService(ISeatRepository seatRepository)
        {
            _seatRepository = seatRepository;
        }

        public IQueryable<Seat> GetAllSeats()
        {
            return _seatRepository.GetSeats();
        }

        public IQueryable<Seat> GetSeatsByZone(string zoneType)
        {
            return _seatRepository.GetSeats()
                .Where(s => s.ZoneType.ToLower() == zoneType.ToLower());
        }

        public Seat GetSeatByCode(string seatCode)
        {
            return _seatRepository.GetSeats()
                .FirstOrDefault(s => s.SeatCode.ToLower() == seatCode.ToLower());
        }

        public Seat UpdateSeatStatus(string seatCode, SeatStatus status)
        {
            var seat = GetSeatByCode(seatCode);
            if (seat == null) return null;

            seat.Status = status;
            seat.UpdatedTime = DateTime.UtcNow;
            _seatRepository.UpdateSeat(seat);

            return seat;
        }

        public Dictionary<string, int> GetAvailabilityByZone()
        {
            return _seatRepository.GetSeats()
                .Where(s => s.Status == SeatStatus.Available)
                .GroupBy(s => s.ZoneType)
                .ToDictionary(g => g.Key, g => g.Count());
        }
    }
}