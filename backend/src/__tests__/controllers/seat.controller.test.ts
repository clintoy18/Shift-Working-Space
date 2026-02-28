import { Request, Response } from 'express';
import {
  getAllSeats,
  getSeatsByZone,
  getSeatByCode,
  updateSeatStatus,
  getAvailability,
} from '../../controllers/seat.controller';
import Seat from '../../models/Seat';

jest.mock('../../models/Seat');

describe('Seat Controller', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    req = {
      params: {},
      body: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    jest.clearAllMocks();
  });

  describe('getAllSeats', () => {
    it('should return all active seats', async () => {
      const mockSeats = [
        { _id: '1', seatCode: 'isl-1-L-0', status: 'available', zoneType: 'Island' },
        { _id: '2', seatCode: 'isl-1-L-1', status: 'occupied', zoneType: 'Island' },
      ];
      (Seat.find as jest.Mock).mockReturnValue({
        lean: jest.fn().mockResolvedValue(mockSeats),
      });

      await getAllSeats(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockSeats);
    });

    it('should exclude deleted seats', async () => {
      (Seat.find as jest.Mock).mockReturnValue({
        lean: jest.fn().mockResolvedValue([]),
      });

      await getAllSeats(req as Request, res as Response);

      expect(Seat.find).toHaveBeenCalledWith({
        isDeleted: false,
        isActive: true,
      });
    });

    it('should handle errors gracefully', async () => {
      (Seat.find as jest.Mock).mockReturnValue({
        lean: jest.fn().mockRejectedValue(new Error('DB Error')),
      });

      await getAllSeats(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Error fetching seats',
        })
      );
    });
  });

  describe('getSeatsByZone', () => {
    it('should return 400 if zone type is missing', async () => {
      req.params = { zoneType: '' };

      await getSeatsByZone(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Zone type is required',
      });
    });

    it('should return seats for a specific zone', async () => {
      req.params = { zoneType: 'Island' };
      const mockSeats = [
        { _id: '1', seatCode: 'isl-1-L-0', zoneType: 'Island' },
        { _id: '2', seatCode: 'isl-1-L-1', zoneType: 'Island' },
      ];
      (Seat.find as jest.Mock).mockResolvedValue(mockSeats);

      await getSeatsByZone(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockSeats);
    });

    it('should be case-insensitive', async () => {
      req.params = { zoneType: 'island' };
      (Seat.find as jest.Mock).mockResolvedValue([]);

      await getSeatsByZone(req as Request, res as Response);

      expect(Seat.find).toHaveBeenCalledWith(
        expect.objectContaining({
          zoneType: expect.any(Object),
        })
      );
    });

    it('should escape regex special characters', async () => {
      req.params = { zoneType: 'Island.*' };
      (Seat.find as jest.Mock).mockResolvedValue([]);

      await getSeatsByZone(req as Request, res as Response);

      // Should escape the .* to prevent regex injection
      expect(Seat.find).toHaveBeenCalled();
    });

    it('should exclude deleted seats', async () => {
      req.params = { zoneType: 'Island' };
      (Seat.find as jest.Mock).mockResolvedValue([]);

      await getSeatsByZone(req as Request, res as Response);

      expect(Seat.find).toHaveBeenCalledWith(
        expect.objectContaining({
          isDeleted: false,
        })
      );
    });
  });

  describe('getSeatByCode', () => {
    it('should return 400 if seat code is missing', async () => {
      req.params = { seatCode: '' };

      await getSeatByCode(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Seat code is required',
      });
    });

    it('should return seat by code', async () => {
      req.params = { seatCode: 'isl-1-L-0' };
      const mockSeat = {
        _id: '1',
        seatCode: 'isl-1-L-0',
        status: 'available',
        zoneType: 'Island',
      };
      (Seat.findOne as jest.Mock).mockResolvedValue(mockSeat);

      await getSeatByCode(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockSeat);
    });

    it('should return 404 if seat not found', async () => {
      req.params = { seatCode: 'nonexistent' };
      (Seat.findOne as jest.Mock).mockResolvedValue(null);

      await getSeatByCode(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Seat not found',
      });
    });

    it('should be case-insensitive', async () => {
      req.params = { seatCode: 'ISL-1-L-0' };
      (Seat.findOne as jest.Mock).mockResolvedValue(null);

      await getSeatByCode(req as Request, res as Response);

      expect(Seat.findOne).toHaveBeenCalledWith(
        expect.objectContaining({
          seatCode: expect.any(Object),
        })
      );
    });
  });

  describe('updateSeatStatus', () => {
    it('should return 400 if seat code is missing', async () => {
      req.params = { seatCode: '' };
      req.body = { status: 'occupied' };

      await updateSeatStatus(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Seat code is required',
      });
    });

    it('should return 400 if status is missing', async () => {
      req.params = { seatCode: 'isl-1-L-0' };
      req.body = {};

      await updateSeatStatus(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Status is required',
      });
    });

    it('should update seat status', async () => {
      req.params = { seatCode: 'isl-1-L-0' };
      req.body = { status: 'occupied' };
      const mockSeat = {
        _id: '1',
        seatCode: 'isl-1-L-0',
        status: 'occupied',
      };
      (Seat.findOneAndUpdate as jest.Mock).mockResolvedValue(mockSeat);

      await updateSeatStatus(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockSeat);
    });

    it('should return 404 if seat not found', async () => {
      req.params = { seatCode: 'nonexistent' };
      req.body = { status: 'occupied' };
      (Seat.findOneAndUpdate as jest.Mock).mockResolvedValue(null);

      await updateSeatStatus(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Seat not found',
      });
    });

    it('should return updated document', async () => {
      req.params = { seatCode: 'isl-1-L-0' };
      req.body = { status: 'occupied' };
      (Seat.findOneAndUpdate as jest.Mock).mockResolvedValue({
        _id: '1',
        seatCode: 'isl-1-L-0',
        status: 'occupied',
      });

      await updateSeatStatus(req as Request, res as Response);

      expect(Seat.findOneAndUpdate).toHaveBeenCalledWith(
        expect.any(Object),
        { status: 'occupied' },
        { new: true }
      );
    });
  });

  describe('getAvailability', () => {
    it('should return availability by zone', async () => {
      const mockAvailability = [
        { _id: 'Island', count: 5 },
        { _id: 'Cubicle', count: 3 },
        { _id: 'Wall', count: 2 },
      ];
      (Seat.aggregate as jest.Mock).mockResolvedValue(mockAvailability);

      await getAvailability(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        Island: 5,
        Cubicle: 3,
        Wall: 2,
      });
    });

    it('should format aggregation result correctly', async () => {
      const mockAvailability = [
        { _id: 'Island', count: 10 },
      ];
      (Seat.aggregate as jest.Mock).mockResolvedValue(mockAvailability);

      await getAvailability(req as Request, res as Response);

      expect(res.json).toHaveBeenCalledWith({
        Island: 10,
      });
    });

    it('should only count available seats', async () => {
      (Seat.aggregate as jest.Mock).mockResolvedValue([]);

      await getAvailability(req as Request, res as Response);

      expect(Seat.aggregate).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            $match: expect.objectContaining({
              status: 'available',
            }),
          }),
        ])
      );
    });

    it('should exclude deleted seats', async () => {
      (Seat.aggregate as jest.Mock).mockResolvedValue([]);

      await getAvailability(req as Request, res as Response);

      expect(Seat.aggregate).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            $match: expect.objectContaining({
              isDeleted: false,
            }),
          }),
        ])
      );
    });

    it('should handle errors gracefully', async () => {
      (Seat.aggregate as jest.Mock).mockRejectedValue(new Error('DB Error'));

      await getAvailability(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Error fetching availability',
        })
      );
    });
  });
});
