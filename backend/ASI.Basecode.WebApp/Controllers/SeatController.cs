using ASI.Basecode.Data.Models;
using ASI.Basecode.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using static ASI.Basecode.Resources.Constants.Enums;

namespace ASI.Basecode.WebApp.Controllers
{
    [ApiController]
    [Route("api/seat")]
    public class SeatController : ControllerBase
    {
        private readonly ISeatService _seatService;

        public SeatController(ISeatService seatService)
        {
            _seatService = seatService;
        }

        /// <summary>
        /// Get all active seats with current status
        /// </summary>
        [HttpGet]
        [ProducesResponseType(typeof(List<Seat>), StatusCodes.Status200OK)]
        public IActionResult GetAllSeats()
        {
            var seats = _seatService.GetAllSeats().ToList();
            return Ok(seats);
        }

        /// <summary>
        /// Get seats by zone type (Island, Cubicle, Wall, etc.)
        /// </summary>
        [HttpGet("zone/{zoneType}")]
        [ProducesResponseType(typeof(List<Seat>), StatusCodes.Status200OK)]
        public IActionResult GetSeatsByZone(string zoneType)
        {
            var seats = _seatService.GetSeatsByZone(zoneType).ToList();
            return Ok(seats);
        }

        /// <summary>
        /// Get seat by frontend code (e.g., "isl-1-L-0")
        /// </summary>
        [HttpGet("code/{seatCode}")]
        [ProducesResponseType(typeof(Seat), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public IActionResult GetSeatByCode(string seatCode)
        {
            var seat = _seatService.GetSeatByCode(seatCode);
            if (seat == null)
                return NotFound(new { message = $"Seat with code '{seatCode}' not found" });

            return Ok(seat);
        }

        /// <summary>
        /// Update seat status by code
        /// </summary>
        [HttpPatch("code/{seatCode}/status")]
        [Authorize(Roles = "Cashier,Admin")]
        [ProducesResponseType(typeof(Seat), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public IActionResult UpdateSeatStatus(string seatCode, [FromBody] UpdateSeatStatusRequest request)
        {
            var seat = _seatService.UpdateSeatStatus(seatCode, request.Status);
            if (seat == null)
                return NotFound(new { message = $"Seat with code '{seatCode}' not found" });

            return Ok(seat);
        }

        /// <summary>
        /// Get available seats count by zone
        /// </summary>
        [HttpGet("availability")]
        [ProducesResponseType(typeof(Dictionary<string, int>), StatusCodes.Status200OK)]
        public IActionResult GetAvailability()
        {
            var availability = _seatService.GetAvailabilityByZone();
            return Ok(availability);
        }
    }

    public class UpdateSeatStatusRequest
    {
        public SeatStatus Status { get; set; }
    }
}