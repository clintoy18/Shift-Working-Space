using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using ASI.Basecode.Data;
using ASI.Basecode.Data.Models;
using ASI.Basecode.Services.Interfaces;
using ClosedXML.Excel;
using Microsoft.EntityFrameworkCore;
using static ASI.Basecode.Resources.Constants.Enums;

namespace ASI.Basecode.Services.Services
{
    public class ExcelExportService : IExcelExportService
    {
        private readonly AsiBasecodeDBContext _dbContext;

        public ExcelExportService(AsiBasecodeDBContext dbContext)
        {
            _dbContext = dbContext;
        }

        public byte[] GenerateSampleUsersReport()
        {
            var rows = new List<(string UserId, string Name, string Role, DateTime CreatedOn)>
            {
                ("ADM-25-0001-001", "Admin User", "Admin", DateTime.UtcNow.AddDays(-10)),
                ("CSH-25-0002-002", "Cashier User", "Cashier", DateTime.UtcNow.AddDays(-5)),
                ("SHFT-25-0003-003", "Shifty User", "Shifty", DateTime.UtcNow.AddDays(-2))
            };

            using var workbook = new XLWorkbook();
            var worksheet = workbook.Worksheets.Add("Users");

            worksheet.Cell(1, 1).Value = "User ID";
            worksheet.Cell(1, 2).Value = "Name";
            worksheet.Cell(1, 3).Value = "Role";
            worksheet.Cell(1, 4).Value = "Created On";

            for (var i = 0; i < rows.Count; i++)
            {
                var rowIndex = i + 2;
                worksheet.Cell(rowIndex, 1).Value = rows[i].UserId;
                worksheet.Cell(rowIndex, 2).Value = rows[i].Name;
                worksheet.Cell(rowIndex, 3).Value = rows[i].Role;
                worksheet.Cell(rowIndex, 4).Value = rows[i].CreatedOn;
                worksheet.Cell(rowIndex, 4).Style.DateFormat.Format = "yyyy-MM-dd";
            }

            worksheet.Columns().AdjustToContents();

            using var stream = new System.IO.MemoryStream();
            workbook.SaveAs(stream);
            return stream.ToArray();
        }

        public byte[] GenerateSalesReport(string period, DateTime? referenceDate = null)
        {
            var (startDate, endDate, normalizedPeriod) = GetReportRange(period, referenceDate);

            var checkIns = _dbContext.CheckIns
                .AsNoTracking()
                .Where(c => !c.IsDeleted
                    && c.PaymentStatus == PaymentStatus.Paid
                    && c.CreatedTime >= startDate
                    && c.CreatedTime < endDate)
                .OrderBy(c => c.CreatedTime)
                .ToList();

            using var workbook = new XLWorkbook();
            var summarySheet = workbook.Worksheets.Add("Sales Summary");
            var detailSheet = workbook.Worksheets.Add("Sales Detail");

            BuildSummarySheet(summarySheet, normalizedPeriod, startDate, endDate, checkIns);
            BuildDetailSheet(detailSheet, checkIns);

            using var stream = new System.IO.MemoryStream();
            workbook.SaveAs(stream);
            return stream.ToArray();
        }

        private static (DateTime StartDate, DateTime EndDate, string Period) GetReportRange(
            string period,
            DateTime? referenceDate)
        {
            var pivot = referenceDate?.Date ?? DateTime.UtcNow.Date;
            var normalized = (period ?? string.Empty).Trim().ToLowerInvariant();

            return normalized switch
            {
                "daily" or "day" => (pivot, pivot.AddDays(1), "Daily"),
                "weekly" or "week" => (StartOfWeek(pivot), StartOfWeek(pivot).AddDays(7), "Weekly"),
                "monthly" or "month" => (new DateTime(pivot.Year, pivot.Month, 1),
                    new DateTime(pivot.Year, pivot.Month, 1).AddMonths(1), "Monthly"),
                _ => (pivot, pivot.AddDays(1), "Daily")
            };
        }

        private static DateTime StartOfWeek(DateTime date)
        {
            const DayOfWeek weekStart = DayOfWeek.Monday;
            var diff = (7 + (date.DayOfWeek - weekStart)) % 7;
            return date.AddDays(-1 * diff).Date;
        }

        private static void BuildSummarySheet(
            IXLWorksheet sheet,
            string period,
            DateTime startDate,
            DateTime endDate,
            List<CheckIn> checkIns)
        {
            sheet.Cell(1, 1).Value = "Sales Report";
            sheet.Cell(2, 1).Value = "Period";
            sheet.Cell(2, 2).Value = period;
            sheet.Cell(3, 1).Value = "Start Date";
            sheet.Cell(3, 2).Value = startDate.ToString("yyyy-MM-dd", CultureInfo.InvariantCulture);
            sheet.Cell(4, 1).Value = "End Date";
            sheet.Cell(4, 2).Value = endDate.AddDays(-1).ToString("yyyy-MM-dd", CultureInfo.InvariantCulture);

            var totalSales = checkIns.Sum(c => c.PaymentAmount);
            var totalTransactions = checkIns.Count;
            var averageSale = totalTransactions == 0 ? 0 : totalSales / totalTransactions;

            sheet.Cell(6, 1).Value = "Total Transactions";
            sheet.Cell(6, 2).Value = totalTransactions;
            sheet.Cell(7, 1).Value = "Total Sales";
            sheet.Cell(7, 2).Value = totalSales;
            sheet.Cell(8, 1).Value = "Average Sale";
            sheet.Cell(8, 2).Value = averageSale;

            sheet.Range(1, 1, 1, 2).Merge().Style.Font.SetBold().Font.SetFontSize(14);
            sheet.Range(2, 1, 8, 1).Style.Font.SetBold();
            sheet.Range(7, 2, 8, 2).Style.NumberFormat.Format = "#,##0.00";

            sheet.Cell(10, 1).Value = "Date";
            sheet.Cell(10, 2).Value = "Transactions";
            sheet.Cell(10, 3).Value = "Total Sales";
            sheet.Range(10, 1, 10, 3).Style.Font.SetBold();

            var grouped = checkIns
                .GroupBy(c => c.CreatedTime.Date)
                .OrderBy(g => g.Key)
                .ToList();

            var row = 11;
            foreach (var group in grouped)
            {
                sheet.Cell(row, 1).Value = group.Key.ToString("yyyy-MM-dd", CultureInfo.InvariantCulture);
                sheet.Cell(row, 2).Value = group.Count();
                sheet.Cell(row, 3).Value = group.Sum(c => c.PaymentAmount);
                sheet.Cell(row, 3).Style.NumberFormat.Format = "#,##0.00";
                row++;
            }

            sheet.Columns().AdjustToContents();
        }

        private static void BuildDetailSheet(IXLWorksheet sheet, List<CheckIn> checkIns)
        {
            sheet.Cell(1, 1).Value = "Check-In ID";
            sheet.Cell(1, 2).Value = "User ID";
            sheet.Cell(1, 3).Value = "Seat ID";
            sheet.Cell(1, 4).Value = "Check-In Time";
            sheet.Cell(1, 5).Value = "Check-Out Time";
            sheet.Cell(1, 6).Value = "Payment Status";
            sheet.Cell(1, 7).Value = "Payment Amount";
            sheet.Cell(1, 8).Value = "Created Time";

            sheet.Range(1, 1, 1, 8).Style.Font.SetBold();

            var row = 2;
            foreach (var checkIn in checkIns)
            {
                sheet.Cell(row, 1).Value = checkIn.CheckInId;
                sheet.Cell(row, 2).Value = checkIn.UserId;
                sheet.Cell(row, 3).Value = checkIn.SeatId;
                sheet.Cell(row, 4).Value = checkIn.CheckInTime;
                sheet.Cell(row, 5).Value = checkIn.CheckOutTime;
                sheet.Cell(row, 6).Value = checkIn.PaymentStatus.ToString();
                sheet.Cell(row, 7).Value = checkIn.PaymentAmount;
                sheet.Cell(row, 8).Value = checkIn.CreatedTime;

                sheet.Cell(row, 4).Style.DateFormat.Format = "yyyy-MM-dd HH:mm";
                sheet.Cell(row, 5).Style.DateFormat.Format = "yyyy-MM-dd HH:mm";
                sheet.Cell(row, 7).Style.NumberFormat.Format = "#,##0.00";
                sheet.Cell(row, 8).Style.DateFormat.Format = "yyyy-MM-dd HH:mm";
                row++;
            }

            sheet.Columns().AdjustToContents();
        }
    }
}
