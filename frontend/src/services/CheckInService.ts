import { api } from "@/lib/api";
import type {
  ICheckInRequest,
  ICheckOutRequest,
  ICheckInResponse,
  ICheckOutResponse,
  IExtensionRequest,
  IExtensionResponse,
  IPenaltyRequest,
  IPenaltyResponse,
  ICheckInFilters,
  ICheckInHistoryFilters,
} from "@/interfaces/requests/ICheckInRequest";
import type { ICheckIn } from "@/interfaces/models/ICheckIn";

const BASE_URL = "/checkin";

/**
 * Check-In Service
 * Handles all check-in/check-out operations for both guests and registered users
 */
export const CheckInService = {
  /**
   * Unified check-in for both guest and registered users
   */
  checkIn: async (data: ICheckInRequest): Promise<ICheckInResponse> => {
    try {
      const response = await api.post<ICheckInResponse>(`${BASE_URL}`, data);
      return response.data;
    } catch (error) {
      console.error("Error during check-in:", error);
      throw error;
    }
  },

  /**
   * Unified check-out for both guest and registered users
   */
  checkOut: async (data: ICheckOutRequest): Promise<ICheckOutResponse> => {
    try {
      const response = await api.post<ICheckOutResponse>(
        `${BASE_URL}/checkout`,
        data
      );
      return response.data;
    } catch (error) {
      console.error("Error during check-out:", error);
      throw error;
    }
  },

  /**
   * Get check-in details by checkInId (public endpoint)
   */
  getCheckInDetails: async (checkInId: string): Promise<ICheckIn> => {
    try {
      const response = await api.get<ICheckIn>(`${BASE_URL}/${checkInId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching check-in details:", error);
      throw error;
    }
  },

  /**
   * Get active check-ins (admin/cashier only)
   */
  getActiveCheckIns: async (filters?: ICheckInFilters): Promise<ICheckIn[]> => {
    try {
      const response = await api.get<ICheckIn[]>(`${BASE_URL}/active`, {
        params: filters,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching active check-ins:", error);
      throw error;
    }
  },

  /**
   * Get check-in history (admin/cashier only)
   */
  getCheckInHistory: async (
    filters: ICheckInHistoryFilters
  ): Promise<{ data: ICheckIn[]; pagination: any }> => {
    try {
      const response = await api.get<{ data: ICheckIn[]; pagination: any }>(
        `${BASE_URL}/history`,
        {
          params: filters,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching check-in history:", error);
      throw error;
    }
  },

  /**
   * Update check-in payment status (admin/cashier only)
   */
  updateCheckIn: async (
    checkInId: string,
    data: { paymentStatus?: string; paymentAmount?: number }
  ): Promise<ICheckIn> => {
    try {
      const response = await api.patch<ICheckIn>(
        `${BASE_URL}/${checkInId}`,
        data
      );
      return response.data;
    } catch (error) {
      console.error("Error updating check-in:", error);
      throw error;
    }
  },

  /**
   * Extend check-in duration (admin/cashier only)
   */
  extendCheckIn: async (
    data: IExtensionRequest
  ): Promise<IExtensionResponse> => {
    try {
      const { checkInId, ...payload } = data;
      const response = await api.post<IExtensionResponse>(
        `${BASE_URL}/${checkInId}/extend`,
        payload
      );
      return response.data;
    } catch (error) {
      console.error("Error extending check-in:", error);
      throw error;
    }
  },

  /**
   * Apply penalty charge (admin/cashier only)
   */
  applyPenalty: async (data: IPenaltyRequest): Promise<IPenaltyResponse> => {
    try {
      const { checkInId, ...payload } = data;
      const response = await api.post<IPenaltyResponse>(
        `${BASE_URL}/${checkInId}/penalty`,
        payload
      );
      return response.data;
    } catch (error) {
      console.error("Error applying penalty:", error);
      throw error;
    }
  },

  /**
   * Get timeout warnings (admin/cashier only)
   */
  getTimeoutWarnings: async (warningOnly?: boolean): Promise<ICheckIn[]> => {
    try {
      const response = await api.get<ICheckIn[]>(`${BASE_URL}/warnings`, {
        params: { warningOnly },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching timeout warnings:", error);
      throw error;
    }
  },
};

export default CheckInService;
