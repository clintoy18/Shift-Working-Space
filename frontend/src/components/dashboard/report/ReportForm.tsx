import type { FormEvent } from "react";
import type { IUser } from "@interfaces/models/IUser";


export type ReportFilters = {
  reportType: "daily" | "weekly" | "monthly";
  startDate: string;
  endDate: string;
  processedBy: string;
};

type ReportFormProps = {
  filters: ReportFilters;
  cashiers: IUser[];
  isLoading: boolean;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onChange: (next: Partial<ReportFilters>) => void;
};

const ReportForm = ({ filters, cashiers, isLoading, onSubmit, onChange }: ReportFormProps) => {
  return (
    <form className="space-y-6" onSubmit={onSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700">Report Type</label>
          <select
            className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-primary focus:outline-none"
            value={filters.reportType}
            onChange={(event) => onChange({ reportType: event.target.value as ReportFilters["reportType"] })}
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700">Start Date</label>
          <input
            type="date"
            className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-primary focus:outline-none"
            value={filters.startDate}
            onChange={(event) => onChange({ startDate: event.target.value })}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700">End Date</label>
          <input
            type="date"
            className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-primary focus:outline-none"
            value={filters.endDate}
            onChange={(event) => onChange({ endDate: event.target.value })}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700">Processed By</label>
          <select
            className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-primary focus:outline-none"
            value={filters.processedBy}
            onChange={(event) => onChange({ processedBy: event.target.value })}
          >
            <option value="">All</option>
            {cashiers.map((cashier) => (
              <option key={cashier.id} value={cashier.fullName}>
                {cashier.fullName}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 flex-wrap">
        <p className="text-xs text-slate-500">
          Choose a date range to generate the sales report. You can export the result from the dashboard.
        </p>
        <button
          type="submit"
          className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary/90 disabled:opacity-60"
          disabled={isLoading}
        >
          {isLoading ? "Generating..." : "Generate Report"}
        </button>
      </div>
    </form>
  );
};

export default ReportForm;