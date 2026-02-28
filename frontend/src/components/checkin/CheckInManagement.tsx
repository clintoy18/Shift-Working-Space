import React, { useState, useEffect } from "react";
import CheckInService from "@/services/CheckInService";
import { useToast } from "@/context/ToastContext";
import type { ICheckIn } from "@/interfaces/models/ICheckIn";

/**
 * Check-In Management Component
 * Admin/Cashier dashboard for managing active check-ins
 */
export const CheckInManagement: React.FC = () => {
  const { showToast } = useToast();

  const [activeCheckIns, setActiveCheckIns] = useState<ICheckIn[]>([]);
  const [loading, setLoading] = useState(false);
  const [filterType, setFilterType] = useState<"all" | "guest" | "registered">("all");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "warning" | "overtime">("all");

  // Fetch active check-ins
  const fetchActiveCheckIns = async () => {
    try {
      setLoading(true);
      const filters: any = {};

      if (filterType !== "all") {
        filters.type = filterType;
      }
      if (filterStatus !== "all") {
        filters.status = filterStatus;
      }

      const data = await CheckInService.getActiveCheckIns(filters);
      setActiveCheckIns(data);
    } catch (error) {
      showToast("Error loading check-ins", "error");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch on mount and set up auto-refresh
  useEffect(() => {
    fetchActiveCheckIns();

    const interval = setInterval(() => {
      fetchActiveCheckIns();
    }, 10000); // Refresh every 10 seconds

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [filterType, filterStatus]);

  // Handle check-out
  const handleCheckOut = async (checkInId: string) => {
    if (!window.confirm("Are you sure you want to check out this guest?")) {
      return;
    }

    try {
      await CheckInService.checkOut({ checkInId });
      showToast("Check-out successful", "success");
      fetchActiveCheckIns();
    } catch (error) {
      showToast("Error during check-out", "error");
      console.error(error);
    }
  };

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "warning":
        return "bg-yellow-100 text-yellow-800";
      case "overtime":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Get identifier (guest ID or user name)
  const getIdentifier = (checkIn: ICheckIn) => {
    if (checkIn.checkInType === "guest") {
      if (!checkIn.guest?.guestId) {
        console.warn("Guest check-in missing guest reference:", checkIn.id);
        return "Unknown Guest";
      }
      return checkIn.guest.guestId;
    }

    if (checkIn.checkInType === "registered") {
      if (!checkIn.user?.fullName) {
        console.warn("Registered check-in missing user reference:", checkIn.id);
        return "Unknown User";
      }
      return checkIn.user.fullName;
    }

    console.error("Invalid checkInType:", checkIn.checkInType);
    return "Invalid Check-In";
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Active Check-Ins</h1>
        <button
          onClick={fetchActiveCheckIns}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 bg-white p-4 rounded-lg shadow">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Type
          </label>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All</option>
            <option value="guest">Guest</option>
            <option value="registered">Registered</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="warning">Warning</option>
            <option value="overtime">Overtime</option>
          </select>
        </div>
      </div>

      {/* Check-Ins Table */}
      {loading ? (
        <div className="text-center py-8 text-gray-500">Loading...</div>
      ) : activeCheckIns.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No active check-ins</div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Identifier
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Seat
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Check-In Time
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Time Remaining
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {activeCheckIns.map((checkIn) => (
                <tr key={checkIn.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {getIdentifier(checkIn)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {checkIn.seat?.displayLabel}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(checkIn.checkInTime).toLocaleTimeString()}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">
                    {checkIn.timeRemainingMinutes !== undefined ? (
                      <span
                        className={
                          checkIn.timeRemainingMinutes <= 0
                            ? "text-red-600"
                            : checkIn.timeRemainingMinutes <= 5
                            ? "text-yellow-600"
                            : "text-green-600"
                        }
                      >
                        {Math.max(0, checkIn.timeRemainingMinutes)} min
                      </span>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        checkIn.status
                      )}`}
                    >
                      {checkIn.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    ${checkIn.paymentAmount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <button
                      onClick={() => handleCheckOut(checkIn.id)}
                      className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition text-xs"
                    >
                      Check Out
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CheckInManagement;
