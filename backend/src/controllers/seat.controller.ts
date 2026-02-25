import { Request, Response } from 'express';
import Seat from '../models/Seat';
import { escapeRegex } from '../utils/validation';

// Simple in-memory cache (use Redis in production)
const seatCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Get cached data or fetch from DB
 */
const getCachedData = async (key: string, fetchFn: () => Promise<any>) => {
  const cached = seatCache.get(key);
  const now = Date.now();

  if (cached && now - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  const data = await fetchFn();
  seatCache.set(key, { data, timestamp: now });
  return data;
};

/**
 * @desc Get all active seats with pagination
 * @route GET /api/seat?page=1&limit=20
 */
export const getAllSeats = async (req: Request, res: Response) => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string) || 20)); // Max 50 per page
    const skip = (page - 1) * limit;

    const cacheKey = `seats_page_${page}_limit_${limit}`;

    const result = await getCachedData(cacheKey, async () => {
      const [seats, total] = await Promise.all([
        Seat.find({ isDeleted: false, isActive: true })
          .skip(skip)
          .limit(limit)
          .lean(),
        Seat.countDocuments({ isDeleted: false, isActive: true })
      ]);

      return {
        seats,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
          hasMore: page < Math.ceil(total / limit)
        }
      };
    });

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Error fetching seats", error });
  }
};

/**
 * @desc Get seats by zone type (Island, Cubicle, Wall, etc.)
 * @route GET /api/seat/zone/:zoneType
 */
export const getSeatsByZone = async (req: Request, res: Response) => {
  try {
    const zoneType = req.params.zoneType as string;

    // Validate input
    if (!zoneType || typeof zoneType !== 'string' || zoneType.trim().length === 0) {
      res.status(400).json({ message: "Zone type is required" });
      return;
    }

    // Escape regex special characters to prevent injection
    const escapedZoneType = escapeRegex(zoneType);

    // case-insensitive search using Regex
    const seats = await Seat.find({
      zoneType: { $regex: new RegExp(`^${escapedZoneType}$`, 'i') },
      isDeleted: false
    });
    res.status(200).json(seats);
  } catch (error) {
    console.error("Error fetching seats by zone:", error);
    res.status(500).json({ message: "Error fetching seats by zone" });
  }
};

/**
 * @desc Get seat by frontend code (e.g., "isl-1-L-0")
 * @route GET /api/seat/code/:seatCode
 */
export const getSeatByCode = async (req: Request, res: Response) => {
  try {
    const seatCode = req.params.seatCode as string;

    // Validate input
    if (!seatCode || typeof seatCode !== 'string' || seatCode.trim().length === 0) {
      res.status(400).json({ message: "Seat code is required" });
      return;
    }

    // Escape regex special characters to prevent injection
    const escapedSeatCode = escapeRegex(seatCode);

    const seat = await Seat.findOne({
      seatCode: { $regex: new RegExp(`^${escapedSeatCode}$`, 'i') },
      isDeleted: false
    });

    if (!seat) {
      return res.status(404).json({ message: "Seat not found" });
    }

    res.status(200).json(seat);
  } catch (error) {
    console.error("Error fetching seat:", error);
    res.status(500).json({ message: "Error fetching seat" });
  }
};

/**
 * @desc Update seat status by code (Admin/Cashier only)
 * @route PATCH /api/seat/code/:seatCode/status
 */
export const updateSeatStatus = async (req: Request, res: Response) => {
  try {
    const seatCode = req.params.seatCode as string;
    const { status } = req.body;

    // Validate inputs
    if (!seatCode || typeof seatCode !== 'string' || seatCode.trim().length === 0) {
      res.status(400).json({ message: "Seat code is required" });
      return;
    }

    if (!status || typeof status !== 'string' || status.trim().length === 0) {
      res.status(400).json({ message: "Status is required" });
      return;
    }

    // Escape regex special characters to prevent injection
    const escapedSeatCode = escapeRegex(seatCode);

    const seat = await Seat.findOneAndUpdate(
      { seatCode: { $regex: new RegExp(`^${escapedSeatCode}$`, 'i') }, isDeleted: false },
      { status: status },
      { new: true } // Returns the updated document
    );

    if (!seat) {
      return res.status(404).json({ message: "Seat not found" });
    }

    res.status(200).json(seat);
  } catch (error) {
    console.error("Error updating seat status:", error);
    res.status(500).json({ message: "Error updating seat status" });
  }
};

/**
 * @desc Get available seats count by zone
 * @route GET /api/seat/availability
 */
export const getAvailability = async (req: Request, res: Response) => {
  try {
    const availability = await Seat.aggregate([
      { $match: { status: 'available', isDeleted: false, isActive: true } },
      { $group: { _id: "$zoneType", count: { $sum: 1 } } }
    ]);

    // Format the aggregation result to match your previous C# Dictionary<string, int>
    const formattedResult = availability.reduce((acc: any, curr) => {
      acc[curr._id] = curr.count;
      return acc;
    }, {});

    res.status(200).json(formattedResult);
  } catch (error) {
    res.status(500).json({ message: "Error fetching availability", error });
  }
};