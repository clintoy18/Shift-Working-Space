import { seat } from "../lib/api";
import type { ISeat } from '../interfaces/models/ISeat';
import type { 
    IGetSeatsQuery, 
    ICreateSeatRequest, 
    IUpdateSeatRequest, 
} from  '../interfaces/requests/ISeatRequest';
export const seatService = {
    /**
     * Get all active seats with current status
     * @returns Promise<ISeat[]>
     */
    getAllSeats: async (): Promise<ISeat[]> => {
        try {
            const response = await seat.get<ISeat[]>('');
            return response.data;
        } catch (error: any) {
            console.error('Error fetching all seats:', error);
            throw error;
        }
    },

    /**
     * Get seats by zone type (Island, Cubicle, Wall, etc.)
     * @param zoneType - Zone type to filter by
     * @returns Promise<ISeat[]>
     */
    getSeatsByZone: async (zoneType: string): Promise<ISeat[]> => {
        try {
            const response = await seat.get<ISeat[]>(`/zone/${zoneType}`);
            return response.data;
        } catch (error: any) {
            console.error(`Error fetching seats for zone ${zoneType}:`, error);
            throw error;
        }
    },

    /**
     * Get seat by frontend code (e.g., "isl-1-L-0")
     * @param seatCode - Frontend seat identifier
     * @returns Promise<ISeat>
     */
    getSeatByCode: async (seatCode: string): Promise<ISeat> => {
        try {
            const response = await seat.get<ISeat>(`/code/${seatCode}`);
            return response.data;
        } catch (error: any) {
            console.error(`Error fetching seat ${seatCode}:`, error);
            throw error;
        }
    },

    /**
     * Get seat by ID
     * @param seatId - Seat ID
     * @returns Promise<ISeat>
     */
    getSeatById: async (seatId: number): Promise<ISeat> => {
        try {
            const response = await seat.get<ISeat>(`/${seatId}`);
            return response.data;
        } catch (error: any) {
            console.error(`Error fetching seat ID ${seatId}:`, error);
            throw error;
        }
    },

    /**
     * Update seat status by code
     * @param seatCode - Frontend seat identifier
     * @param status - New status (Available, Occupied, Reserved, Maintenance)
     * @returns Promise<ISeat>
     */
    updateSeatStatus: async (seatCode: string, status: 'Available' | 'Reserved' | 'Occupied' | 'Maintenance'): Promise<ISeat> => {
        try {
            const response = await seat.patch<ISeat>(`/code/${seatCode}/status`, { status });
            return response.data;
        } catch (error: any) {
            console.error(`Error updating seat ${seatCode} status:`, error);
            throw error;
        }
    },

    /**
     * Get seat availability count by zone
     * @returns Promise<Record<string, number>>
     */
    getAvailability: async (): Promise<Record<string, number>> => {
        try {
            const response = await seat.get<Record<string, number>>('/availability');
            return response.data;
        } catch (error: any) {
            console.error('Error fetching seat availability:', error);
            throw error;
        }
    },

    /**
     * Create new seat (Admin only)
     * @param data - Seat creation data
     * @returns Promise<ISeat>
     */
    createSeat: async (data: ICreateSeatRequest): Promise<ISeat> => {
        try {
            const response = await seat.post<ISeat>('', data);
            return response.data;
        } catch (error: any) {
            console.error('Error creating seat:', error);
            throw error;
        }
    },

    /**
     * Update seat (Admin only)
     * @param seatId - Seat ID to update
     * @param data - Updated seat data
     * @returns Promise<ISeat>
     */
    updateSeat: async (seatId: number, data: IUpdateSeatRequest): Promise<ISeat> => {
        try {
            const response = await seat.put<ISeat>(`/${seatId}`, data);
            return response.data;
        } catch (error: any) {
            console.error(`Error updating seat ${seatId}:`, error);
            throw error;
        }
    },

    /**
     * Delete seat (Admin only)
     * @param seatId - Seat ID to delete
     * @returns Promise<void>
     */
    deleteSeat: async (seatId: number): Promise<void> => {
        try {
            await seat.delete(`/${seatId}`);
        } catch (error: any) {
            console.error(`Error deleting seat ${seatId}:`, error);
            throw error;
        }
    },

    /**
     * Search seats with filters
     * @param query - Query parameters
     * @returns Promise<ISeat[]>
     */
    searchSeats: async (query: IGetSeatsQuery): Promise<ISeat[]> => {
        try {
            const response = await seat.get<ISeat[]>('', { params: query });
            return response.data;
        } catch (error: any) {
            console.error('Error searching seats:', error);
            throw error;
        }
    },
};