import { Request, Response } from 'express';
import Seat from '../models/Seat';

/**
 * @desc Get all active seats with current status
 * @route GET /api/seat
 */
export const getAllSeats = async (req: Request, res: Response) => {
  try {
    const seats = await Seat.find({ isDeleted: false, isActive: true });
    res.status(200).json(seats);
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
    const { zoneType } = req.params;
    // case-insensitive search using Regex
    const seats = await Seat.find({ 
      zoneType: { $regex: new RegExp(`^${zoneType}$`, 'i') },
      isDeleted: false 
    });
    res.status(200).json(seats);
  } catch (error) {
    res.status(500).json({ message: "Error fetching seats by zone", error });
  }
};

/**
 * @desc Get seat by frontend code (e.g., "isl-1-L-0")
 * @route GET /api/seat/code/:seatCode
 */
export const getSeatByCode = async (req: Request, res: Response) => {
  try {
    const { seatCode } = req.params;
    const seat = await Seat.findOne({ 
      seatCode: { $regex: new RegExp(`^${seatCode}$`, 'i') },
      isDeleted: false 
    });

    if (!seat) {
      return res.status(404).json({ message: `Seat with code '${seatCode}' not found` });
    }

    res.status(200).json(seat);
  } catch (error) {
    res.status(500).json({ message: "Error fetching seat", error });
  }
};

/**
 * @desc Update seat status by code (Admin/Cashier only)
 * @route PATCH /api/seat/code/:seatCode/status
 */
export const updateSeatStatus = async (req: Request, res: Response) => {
  try {
    const { seatCode } = req.params;
    const { status } = req.body;

    const seat = await Seat.findOneAndUpdate(
      { seatCode: { $regex: new RegExp(`^${seatCode}$`, 'i') }, isDeleted: false },
      { status: status },
      { new: true } // Returns the updated document
    );

    if (!seat) {
      return res.status(404).json({ message: `Seat with code '${seatCode}' not found` });
    }

    res.status(200).json(seat);
  } catch (error) {
    res.status(500).json({ message: "Error updating seat status", error });
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