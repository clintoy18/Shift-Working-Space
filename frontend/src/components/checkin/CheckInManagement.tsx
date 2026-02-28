import React, { useState, useEffect } from "react";
import CheckInService from "@/services/CheckInService";
import { useToast } from "@/context/ToastContext";
import type { ICheckIn } from "@/interfaces/models/ICheckIn";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Clock, AlertTriangle, CheckCircle2, RefreshCw } from "lucide-react";

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
    } catch (error: any) {
      let errorMessage = "Error during check-out. Please try again.";

      if (error.response?.status === 404) {
        errorMessage = "Check-in record not found. It may have already been checked out.";
      } else if (error.response?.status === 400) {
        errorMessage = error.response?.data?.message || "Invalid check-out request.";
      } else if (error.response?.status === 409) {
        errorMessage = "Cannot check out: This check-in has already been completed.";
      } else if (error.response?.status === 500) {
        errorMessage = "Server error occurred. Please try again later.";
      }

      showToast(errorMessage, "error");
      console.error(error);
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

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle2 className="w-4 h-4 text-green-600" />;
      case "warning":
        return <AlertCircle className="w-4 h-4 text-yellow-600" />;
      case "overtime":
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="w-full space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Active Check-Ins</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage and monitor all active check-ins
          </p>
        </div>
        <Button
          onClick={fetchActiveCheckIns}
          variant="outline"
          className="gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </Button>
      </div>

      {/* Filters Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                Check-In Type
              </label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as any)}
                className="w-full h-11 px-3 border border-muted rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">All Types</option>
                <option value="guest">Guest</option>
                <option value="registered">Registered User</option>
              </select>
            </div>

            <div className="flex-1">
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                Status
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="w-full h-11 px-3 border border-muted rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="warning">Warning</option>
                <option value="overtime">Overtime</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Check-Ins List */}
      {loading ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center text-muted-foreground">
              <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>Loading check-ins...</p>
            </div>
          </CardContent>
        </Card>
      ) : activeCheckIns.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center text-muted-foreground">
              <CheckCircle2 className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No active check-ins at this time</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-muted bg-muted/50">
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Identifier
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Seat
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Check-In Time
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Time Remaining
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Amount
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-muted">
                  {activeCheckIns.map((checkIn) => (
                    <tr key={checkIn.id} className="hover:bg-muted/50 transition">
                      <td className="px-6 py-4 text-sm font-medium text-foreground">
                        {getIdentifier(checkIn)}
                      </td>
                      <td className="px-6 py-4 text-sm text-foreground">
                        {checkIn.seat?.displayLabel}
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {new Date(checkIn.checkInTime).toLocaleTimeString()}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold">
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
                        <div className="flex items-center gap-2">
                          {getStatusIcon(checkIn.status)}
                          <span className="capitalize text-xs font-semibold">
                            {checkIn.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-foreground">
                        ${checkIn.paymentAmount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <Button
                          onClick={() => handleCheckOut(checkIn.id)}
                          variant="outline"
                          size="sm"
                          className="text-xs"
                        >
                          Check Out
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CheckInManagement;
