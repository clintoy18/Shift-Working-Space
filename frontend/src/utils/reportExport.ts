import * as XLSX from "xlsx";

export type SalesReportRecord = {
  checkInTime?: string | Date;
  checkOutTime?: string | Date;
  durationMinutes?: number;
  processedBy?: string;
  paymentStatus?: string;
  paymentAmount?: number;
  seat?:
    | { displayLabel?: string; seatNumber?: string; seatCode?: string }
    | string
    | null;
  user?: { fullName?: string; email?: string } | string | null;
};

export type SalesReportExportFilters = {
  reportType?: string;
  startDate?: string;
  endDate?: string;
  cashierLabel?: string;
};

const formatDate = (value?: string | Date | null) => {
  if (!value) return "";
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString();
};

const resolveSeatLabel = (seat: SalesReportRecord["seat"]) => {
  if (!seat) return "";
  if (typeof seat === "string") return seat;
  return seat.displayLabel || seat.seatNumber || seat.seatCode || "";
};

const resolveUserLabel = (user: SalesReportRecord["user"]) => {
  if (!user) return "";
  if (typeof user === "string") return user;
  return user.fullName || user.email || "";
};

const buildFileName = (filters: SalesReportExportFilters) => {
  const parts = ["sales-report"];

  if (filters.reportType) {
    parts.push(filters.reportType.toLowerCase());
  }

  if (filters.startDate || filters.endDate) {
    parts.push(filters.startDate || "start");
    parts.push(filters.endDate || "end");
  }

  if (filters.cashierLabel) {
    parts.push(filters.cashierLabel.replace(/\s+/g, "-"));
  }

  return `${parts.join("-")}.xlsx`;
};

export const exportSalesReportToExcel = (
  records: SalesReportRecord[],
  filters: SalesReportExportFilters,
) => {
  const rows = records.map((record, index) => ({
    "No": index + 1,
    "Check In": formatDate(record.checkInTime),
    "Check Out": formatDate(record.checkOutTime),
    "Duration (min)": record.durationMinutes ?? "",
    "Payment Status": record.paymentStatus ?? "",
    "Payment Amount": record.paymentAmount ?? "",
    "Processed By": record.processedBy ?? "",
    "Seat": resolveSeatLabel(record.seat),
    "User": resolveUserLabel(record.user),
  }));

  const worksheet = XLSX.utils.json_to_sheet(rows, { skipHeader: false });
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sales Report");

  XLSX.writeFile(workbook, buildFileName(filters));
};