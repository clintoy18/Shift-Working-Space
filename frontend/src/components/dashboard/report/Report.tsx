import { useEffect, useState, type FormEvent } from "react";
import ReportForm, { type ReportFilters } from "./ReportForm";
import type { IUser } from "@interfaces/models/IUser";
import { fetchSalesReport, getUsersByRoleAdmin } from "@services/AdminService";
import { exportSalesReportToExcel, type SalesReportRecord } from "@/utils/reportExport";

type SalesReportResponse = {
	count?: number;
	records?: SalesReportRecord[];
};

const Report = () => {
	const [cashiers, setCashiers] = useState<IUser[]>([]);
	const [filters, setFilters] = useState<ReportFilters>({
		reportType: "daily",
		startDate: "",
		endDate: "",
		cashierId: "",
	});
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [reportCount, setReportCount] = useState<number | null>(null);

	useEffect(() => {
		let isActive = true;

		const loadCashiers = async () => {
			try {
				const data = await getUsersByRoleAdmin("cashier");
				if (isActive) {
					setCashiers(Array.isArray(data) ? data : []);
				}
			} catch (err) {
				console.error("Failed to load cashiers:", err);
				if (isActive) {
					setError("Failed to load cashiers.");
				}
			}
		};

		loadCashiers();

		return () => {
			isActive = false;
		};
	}, []);

	const handleFilterChange = (next: Partial<ReportFilters>) => {
		setFilters((current) => ({ ...current, ...next }));
	};

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setError(null);
		setIsLoading(true);

		try {
			const params = {
				reportType: filters.reportType,
				startDate: filters.startDate || undefined,
				endDate: filters.endDate || undefined,
				cashierId: filters.cashierId || undefined,
			};

			const data = (await fetchSalesReport(params)) as SalesReportResponse;
			const records = Array.isArray(data?.records) ? data.records : [];

			exportSalesReportToExcel(records, {
				reportType: filters.reportType,
				startDate: filters.startDate || undefined,
				endDate: filters.endDate || undefined,
				cashierLabel: cashiers.find((cashier) => cashier.id === filters.cashierId)?.fullName,
			});

			setReportCount(typeof data?.count === "number" ? data.count : records.length);
		} catch (err) {
			console.error("Failed to generate report:", err);
			setError("Failed to generate report.");
			setReportCount(null);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
			<div className="mb-8">
				<h2 className="text-2xl font-heading font-semibold text-slate-800 mb-2">
					Sales Report
				</h2>
				<p className="text-sm text-slate-600">
					Generate daily, weekly, or monthly sales summaries.
				</p>
			</div>
			<ReportForm
				filters={filters}
				cashiers={cashiers}
				isLoading={isLoading}
				onSubmit={handleSubmit}
				onChange={handleFilterChange}
			/>
			{error && (
				<p className="mt-4 text-sm text-red-600">{error}</p>
			)}
			{!error && reportCount !== null && (
				<p className="mt-4 text-sm text-slate-600">
					Found {reportCount} record{reportCount === 1 ? "" : "s"}.
				</p>
			)}
		</div>
	);
};

export default Report;