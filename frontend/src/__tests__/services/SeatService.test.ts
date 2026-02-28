import { seatService } from '../../services/SeatService';
import { seat } from '../../lib/api';

jest.mock('../../lib/api');

describe('SeatService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllSeats', () => {
    it('should fetch all seats', async () => {
      const mockSeats = [
        { id: '1', seatCode: 'isl-1-L-0', status: 'available', zoneType: 'Island' },
        { id: '2', seatCode: 'isl-1-L-1', status: 'occupied', zoneType: 'Island' },
      ];

      (seat.get as jest.Mock).mockResolvedValue({
        data: mockSeats,
      });

      const result = await seatService.getAllSeats();

      expect(seat.get).toHaveBeenCalledWith('');
      expect(result).toEqual(mockSeats);
    });

    it('should handle error when fetching seats', async () => {
      const error = new Error('API Error');
      (seat.get as jest.Mock).mockRejectedValue(error);

      await expect(seatService.getAllSeats()).rejects.toThrow('API Error');
    });
  });

  describe('getSeatsByZone', () => {
    it('should fetch seats by zone type', async () => {
      const mockSeats = [
        { id: '1', seatCode: 'isl-1-L-0', zoneType: 'Island' },
        { id: '2', seatCode: 'isl-1-L-1', zoneType: 'Island' },
      ];

      (seat.get as jest.Mock).mockResolvedValue({
        data: mockSeats,
      });

      const result = await seatService.getSeatsByZone('Island');

      expect(seat.get).toHaveBeenCalledWith('/zone/Island');
      expect(result).toEqual(mockSeats);
    });

    it('should handle error when fetching seats by zone', async () => {
      const error = new Error('Zone not found');
      (seat.get as jest.Mock).mockRejectedValue(error);

      await expect(seatService.getSeatsByZone('NonExistent')).rejects.toThrow('Zone not found');
    });
  });

  describe('getSeatByCode', () => {
    it('should fetch seat by code', async () => {
      const mockSeat = {
        id: '1',
        seatCode: 'isl-1-L-0',
        status: 'available',
        zoneType: 'Island',
      };

      (seat.get as jest.Mock).mockResolvedValue({
        data: mockSeat,
      });

      const result = await seatService.getSeatByCode('isl-1-L-0');

      expect(seat.get).toHaveBeenCalledWith('/code/isl-1-L-0');
      expect(result).toEqual(mockSeat);
    });

    it('should handle error when fetching seat by code', async () => {
      const error = new Error('Seat not found');
      (seat.get as jest.Mock).mockRejectedValue(error);

      await expect(seatService.getSeatByCode('nonexistent')).rejects.toThrow('Seat not found');
    });
  });

  describe('getSeatById', () => {
    it('should fetch seat by ID', async () => {
      const mockSeat = {
        id: '1',
        seatCode: 'isl-1-L-0',
        status: 'available',
      };

      (seat.get as jest.Mock).mockResolvedValue({
        data: mockSeat,
      });

      const result = await seatService.getSeatById(1);

      expect(seat.get).toHaveBeenCalledWith('/1');
      expect(result).toEqual(mockSeat);
    });

    it('should handle error when fetching seat by ID', async () => {
      const error = new Error('Seat not found');
      (seat.get as jest.Mock).mockRejectedValue(error);

      await expect(seatService.getSeatById(999)).rejects.toThrow('Seat not found');
    });
  });

  describe('updateSeatStatus', () => {
    it('should update seat status', async () => {
      const mockSeat = {
        id: '1',
        seatCode: 'isl-1-L-0',
        status: 'occupied',
      };

      (seat.patch as jest.Mock).mockResolvedValue({
        data: mockSeat,
      });

      const result = await seatService.updateSeatStatus('isl-1-L-0', 'Occupied');

      expect(seat.patch).toHaveBeenCalledWith('/code/isl-1-L-0/status', { status: 'Occupied' });
      expect(result).toEqual(mockSeat);
    });

    it('should handle different status values', async () => {
      const statuses = ['Available', 'Reserved', 'Occupied', 'Maintenance'] as const;

      for (const status of statuses) {
        (seat.patch as jest.Mock).mockResolvedValue({
          data: { status },
        });

        await seatService.updateSeatStatus('isl-1-L-0', status);

        expect(seat.patch).toHaveBeenCalledWith('/code/isl-1-L-0/status', { status });
      }
    });

    it('should handle error when updating seat status', async () => {
      const error = new Error('Update failed');
      (seat.patch as jest.Mock).mockRejectedValue(error);

      await expect(seatService.updateSeatStatus('isl-1-L-0', 'Occupied')).rejects.toThrow(
        'Update failed'
      );
    });
  });

  describe('getAvailability', () => {
    it('should fetch seat availability by zone', async () => {
      const mockAvailability = {
        Island: 5,
        Cubicle: 3,
        Wall: 2,
      };

      (seat.get as jest.Mock).mockResolvedValue({
        data: mockAvailability,
      });

      const result = await seatService.getAvailability();

      expect(seat.get).toHaveBeenCalledWith('/availability');
      expect(result).toEqual(mockAvailability);
    });

    it('should handle error when fetching availability', async () => {
      const error = new Error('API Error');
      (seat.get as jest.Mock).mockRejectedValue(error);

      await expect(seatService.getAvailability()).rejects.toThrow('API Error');
    });
  });

  describe('createSeat', () => {
    it('should create new seat', async () => {
      const seatData = {
        seatCode: 'new-1-L-0',
        zoneType: 'Island',
        status: 'available',
      };

      const mockSeat = {
        id: '100',
        ...seatData,
      };

      (seat.post as jest.Mock).mockResolvedValue({
        data: mockSeat,
      });

      const result = await seatService.createSeat(seatData);

      expect(seat.post).toHaveBeenCalledWith('', seatData);
      expect(result).toEqual(mockSeat);
    });

    it('should handle error when creating seat', async () => {
      const seatData = {
        seatCode: 'new-1-L-0',
        zoneType: 'Island',
        status: 'available',
      };

      const error = new Error('Creation failed');
      (seat.post as jest.Mock).mockRejectedValue(error);

      await expect(seatService.createSeat(seatData)).rejects.toThrow('Creation failed');
    });
  });

  describe('updateSeat', () => {
    it('should update seat', async () => {
      const updateData = {
        status: 'maintenance',
      };

      const mockSeat = {
        id: '1',
        seatCode: 'isl-1-L-0',
        ...updateData,
      };

      (seat.put as jest.Mock).mockResolvedValue({
        data: mockSeat,
      });

      const result = await seatService.updateSeat(1, updateData);

      expect(seat.put).toHaveBeenCalledWith('/1', updateData);
      expect(result).toEqual(mockSeat);
    });

    it('should handle error when updating seat', async () => {
      const updateData = {
        status: 'maintenance',
      };

      const error = new Error('Update failed');
      (seat.put as jest.Mock).mockRejectedValue(error);

      await expect(seatService.updateSeat(1, updateData)).rejects.toThrow('Update failed');
    });
  });

  describe('deleteSeat', () => {
    it('should delete seat', async () => {
      (seat.delete as jest.Mock).mockResolvedValue({});

      await seatService.deleteSeat(1);

      expect(seat.delete).toHaveBeenCalledWith('/1');
    });

    it('should handle error when deleting seat', async () => {
      const error = new Error('Delete failed');
      (seat.delete as jest.Mock).mockRejectedValue(error);

      await expect(seatService.deleteSeat(1)).rejects.toThrow('Delete failed');
    });
  });

  describe('searchSeats', () => {
    it('should search seats with query parameters', async () => {
      const query = {
        zoneType: 'Island',
        status: 'available',
      };

      const mockSeats = [
        { id: '1', seatCode: 'isl-1-L-0', zoneType: 'Island', status: 'available' },
      ];

      (seat.get as jest.Mock).mockResolvedValue({
        data: mockSeats,
      });

      const result = await seatService.searchSeats(query);

      expect(seat.get).toHaveBeenCalledWith('', { params: query });
      expect(result).toEqual(mockSeats);
    });

    it('should handle error when searching seats', async () => {
      const query = {
        zoneType: 'Island',
      };

      const error = new Error('Search failed');
      (seat.get as jest.Mock).mockRejectedValue(error);

      await expect(seatService.searchSeats(query)).rejects.toThrow('Search failed');
    });
  });
});
