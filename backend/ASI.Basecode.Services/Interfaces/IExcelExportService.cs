using System;

namespace ASI.Basecode.Services.Interfaces
{
    public interface IExcelExportService
    {
        byte[] GenerateSampleUsersReport();
        byte[] GenerateSalesReport(string period, DateTime? referenceDate = null);
    }
}
