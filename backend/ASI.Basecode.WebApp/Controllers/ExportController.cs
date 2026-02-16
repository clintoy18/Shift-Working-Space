using ASI.Basecode.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;

namespace ASI.Basecode.WebApp.Controllers
{
    [ApiController]
    [AllowAnonymous]
    [Route("api/export")]
    public class ExportController : ControllerBase
    {
        private readonly IExcelExportService _excelExportService;

        public ExportController(IExcelExportService excelExportService)
        {
            _excelExportService = excelExportService;
        }

        [HttpGet("users-sample")]
        [ProducesResponseType(typeof(FileContentResult), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public IActionResult ExportUsersSample()
        {
            try
            {
                var fileBytes = _excelExportService.GenerateSampleUsersReport();
                return File(
                    fileBytes,
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                    "users-sample.xlsx");
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Failed to generate Excel file.", error = ex.Message });
            }
        }

        [HttpGet("sales")]
        [AllowAnonymous]
        [ProducesResponseType(typeof(FileContentResult), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public IActionResult ExportSalesReport([FromQuery] string period = "daily", [FromQuery] DateTime? date = null)
        {
            try
            {
                var fileBytes = _excelExportService.GenerateSalesReport(period, date);
                var safePeriod = string.IsNullOrWhiteSpace(period) ? "daily" : period.Trim().ToLowerInvariant();
                var fileName = $"sales-{safePeriod}-{(date ?? DateTime.UtcNow).ToString("yyyyMMdd")}.xlsx";

                return File(
                    fileBytes,
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                    fileName);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Failed to generate sales report.", error = ex.Message });
            }
        }
    }
}
