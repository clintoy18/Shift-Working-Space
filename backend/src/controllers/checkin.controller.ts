import { Request, Response } from "express";
import CheckIn, { ICheckIn } from "../models/CheckIn";
import Guest from "../models/Guest";
import Seat from "../models/Seat";
import User from "../models/User";
import Reservation from "../models/Reservation";
import { escapeRegex } from "../utils/validation";

// Pricing configuration (centralized)
const PRICING_CONFIG: Record<string, Array<{ duration: number; label: string; price: number; isActive: boolean }>> = {
  regular: [
    { duration: 120, label: "Nomad", price: 145, isActive: true },
    { duration: 240, label: "Quick Shift", price: 250, isActive: true },
    { duration: 480, label: "Pro (Day Pass)", price: 450, isActive: true },
  ],
  cubicle: [
    { duration: 60, label: "Focus (1 Hour)", price: 175, isActive: true },
    { duration: 240, label: "Focus (4 Hours)", price: 600, isActive: true },
    { duration: 480, label: "Focus (Full Day)", price: 1000, isActive: true },
  ],
  "meeting-room": [
    { duration: 60, label: "Power Huddle (1 Hour)", price: 270, isActive: true },
    { duration: 120, label: "Power Huddle (2 Hours)", price: 500, isActive: true },
    { duration: 60, label: "Conference (1 Hour)", price: 420, isActive: true },
    { duration: 240, label: "Conference (4 Hours)", price: 1400, isActive: true },
  ],
};

/**
 * @desc Unified check-in endpoint for both guest and registered users
 * @route POST /api/checkin
 * @access Public (rate-limited)
 */
export const checkIn = async (req: Request, res: Response) => {
  try {
    const {
      checkInType,
      seatId,
      pricingOptionId,
      paymentStatus,
      userId,
      email,
      phoneNumber,
      processedBy,
    } = req.body;

    // Validation
    if (!checkInType || !["guest", "registered"].includes(checkInType)) {
      return res
        .status(400)
        .json({ message: "Invalid checkInType. Must be 'guest' or 'registered'" });
    }

    if (!seatId) {
      return res.status(400).json({ message: "seatId is required" });
    }

    if (!paymentStatus || !["pending", "paid", "refunded"].includes(paymentStatus)) {
      return res
        .status(400)
        .json({
          message: "Invalid paymentStatus. Must be 'pending', 'paid', or 'refunded'",
        });
    }

    // Fetch seat
    const seat = await Seat.findById(seatId);
    if (!seat) {
      return res.status(404).json({ message: "Seat not found" });
    }

    // Check if there's an existing active check-in on this seat
    const existingCheckIn = await CheckIn.findOne({
      seat: seatId,
      status: { $in: ["active", "warning", "overtime"] },
      isDeleted: false,
    });

    // If there's an existing active check-in, reject the new check-in
    if (existingCheckIn) {
      const identifier =
        existingCheckIn.checkInType === "guest"
          ? `Guest ${existingCheckIn.guest}`
          : `User ${existingCheckIn.user}`;

      return res.status(409).json({
        message: `Seat is currently occupied. ${identifier} is still checked in.`,
        existingCheckInId: (existingCheckIn._id as any).toString(),
        existingCheckInType: existingCheckIn.checkInType,
        checkInTime: existingCheckIn.checkInTime,
        status: existingCheckIn.status,
      });
    }

    // Check if user already has an active check-in (prevent double booking for registered users)
    if (checkInType === "registered" && userId) {
      const userActiveCheckIn = await CheckIn.findOne({
        user: userId,
        status: { $in: ["active", "warning", "overtime"] },
        isDeleted: false,
      });

      if (userActiveCheckIn) {
        return res.status(409).json({
          message: `User already has an active check-in on seat ${userActiveCheckIn.seat}. Please check out first before checking in again.`,
          existingCheckInId: (userActiveCheckIn._id as any).toString(),
          existingCheckInType: "registered",
          checkInTime: userActiveCheckIn.checkInTime,
          status: userActiveCheckIn.status,
          existingSeatId: userActiveCheckIn.seat,
        });
      }
    }

    // Check if seat is available
    if (seat.status !== "available") {
      return res
        .status(400)
        .json({ message: `Seat is not available. Current status: ${seat.status}` });
    }

    // Find pricing option from centralized config
    let allocatedDurationMinutes = 0;
    let paymentAmount = 0;
    let pricingLabel = "";

    // Map seat type to pricing tier (direct mapping)
    const pricingTier = seat.seatType || "regular";
    const pricingOptions = PRICING_CONFIG[pricingTier] || [];

    if (pricingOptionId !== undefined && pricingOptionId !== null) {
      const pricingOption = pricingOptions[pricingOptionId];
      if (!pricingOption || !pricingOption.isActive) {
        return res.status(400).json({
          message: "Invalid or inactive pricing option",
          availableOptions: pricingOptions.length,
          requestedIndex: pricingOptionId
        });
      }
      allocatedDurationMinutes = pricingOption.duration;
      paymentAmount = pricingOption.price;
      pricingLabel = pricingOption.label;
    } else {
      return res.status(400).json({ message: "pricingOptionId is required" });
    }

    let guestId: string | undefined;
    let userId_: string | undefined;
    let userName: string | undefined;

    // Handle guest check-in
    if (checkInType === "guest") {
      if (!email && !phoneNumber) {
        return res
          .status(400)
          .json({
            message: "Guest check-in requires at least email or phoneNumber",
          });
      }

      // Create guest record
      const guest = new Guest({
        email: email || undefined,
        phoneNumber: phoneNumber || undefined,
      });
      await guest.save();
      guestId = guest.guestId;
    }

    // Handle registered user check-in
    if (checkInType === "registered") {
      if (!userId) {
        return res.status(400).json({ message: "userId is required for registered check-in" });
      }

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      userId_ = userId;
      userName = user.fullName;
    }

    // Create check-in record
    let guestObjectId: string | undefined;
    if (checkInType === "guest") {
      const guestRecord = await Guest.findOne({ guestId });
      if (guestRecord) {
        guestObjectId = (guestRecord._id as any).toString();
      }
    }

    const checkInRecord = new CheckIn({
      user: checkInType === "registered" ? userId_ : undefined,
      guest: guestObjectId,
      checkInType,
      seat: seatId,
      checkInTime: new Date(),
      processedBy: processedBy || "System",
      paymentStatus,
      paymentAmount,
      allocatedDurationMinutes,
      warningThresholdMinutes: 5,
      status: "active",
      extensionHistory: [],
      penaltyCharges: [],
    });

    await checkInRecord.save();

    // Update seat status to occupied
    seat.status = "occupied";
    await seat.save();

    // Return response
    res.status(201).json({
      id: (checkInRecord._id as any).toString(),
      checkInType,
      guestId: guestId || undefined,
      userId: userId_ || undefined,
      userName: userName || undefined,
      seatId: (seat._id as any).toString(),
      seatCode: seat.seatCode,
      seatLabel: seat.displayLabel,
      checkInTime: checkInRecord.checkInTime,
      allocatedDurationMinutes,
      warningThresholdMinutes: checkInRecord.warningThresholdMinutes,
      pricingLabel,
      paymentAmount,
    });
  } catch (error) {
    console.error("Error during check-in:", error);
    res.status(500).json({ message: "Error during check-in", error });
  }
};

/**
 * @desc Unified check-out endpoint
 * @route POST /api/checkin/checkout
 * @access Public (rate-limited)
 */
export const checkOut = async (req: Request, res: Response) => {
  try {
    const { checkInId, paymentAmount } = req.body;

    if (!checkInId) {
      return res.status(400).json({ message: "checkInId is required" });
    }

    const checkInRecord = await CheckIn.findById(checkInId).populate("seat");
    if (!checkInRecord) {
      return res.status(404).json({ message: "Check-in record not found" });
    }

    if (checkInRecord.status === "completed") {
      return res.status(400).json({ message: "Check-in already completed" });
    }

    // Calculate duration
    const checkOutTime = new Date();
    const durationMinutes = Math.floor(
      (checkOutTime.getTime() - checkInRecord.checkInTime.getTime()) / 60000
    );

    // Calculate total charges
    let totalAmount = checkInRecord.paymentAmount;

    // Add extension charges
    const extensionTotal = checkInRecord.extensionHistory.reduce(
      (sum, ext) => sum + ext.addedAmount,
      0
    );
    totalAmount += extensionTotal;

    // Add penalty charges
    const penaltyTotal = checkInRecord.penaltyCharges.reduce(
      (sum, penalty) => sum + penalty.amount,
      0
    );
    totalAmount += penaltyTotal;

    // Update check-in record
    checkInRecord.checkOutTime = checkOutTime;
    checkInRecord.durationMinutes = durationMinutes;
    checkInRecord.paymentAmount = totalAmount;
    checkInRecord.status = "completed";
    await checkInRecord.save();

    // Update seat status back to available
    const seat = checkInRecord.seat as any;
    seat.status = "available";
    await seat.save();

    res.status(200).json({
      id: (checkInRecord._id as any).toString(),
      checkOutTime,
      durationMinutes,
      allocatedDurationMinutes: checkInRecord.allocatedDurationMinutes,
      baseAmount: checkInRecord.paymentAmount - extensionTotal - penaltyTotal,
      extensionCharges: extensionTotal,
      penaltyCharges: penaltyTotal,
      totalAmount,
    });
  } catch (error) {
    console.error("Error during check-out:", error);
    res.status(500).json({ message: "Error during check-out", error });
  }
};

/**
 * @desc Get check-in details (public endpoint)
 * @route GET /api/checkin/:checkInId
 * @access Public
 */
export const getCheckInDetails = async (req: Request, res: Response) => {
  try {
    const { checkInId } = req.params;

    const checkInRecord = await CheckIn.findById(checkInId)
      .populate("user", "firstName lastName email")
      .populate("guest")
      .populate("seat", "seatCode displayLabel zoneType");

    if (!checkInRecord) {
      return res.status(404).json({ message: "Check-in record not found" });
    }

    // Calculate time remaining
    const now = new Date();
    const checkInTime = checkInRecord.checkInTime;
    const elapsedMinutes = Math.floor((now.getTime() - checkInTime.getTime()) / 60000);
    const timeRemainingMinutes = checkInRecord.allocatedDurationMinutes - elapsedMinutes;

    res.status(200).json({
      ...checkInRecord.toJSON(),
      elapsedMinutes,
      timeRemainingMinutes,
    });
  } catch (error) {
    console.error("Error fetching check-in details:", error);
    res.status(500).json({ message: "Error fetching check-in details", error });
  }
};

/**
 * @desc Get active check-ins (admin/cashier only)
 * @route GET /api/checkin/active
 * @access Protected (cashier, admin)
 */
export const getActiveCheckIns = async (req: Request, res: Response) => {
  try {
    const { type, seatId, userId, status } = req.query;

    const filter: any = {
      isDeleted: false,
      status: { $in: ["active", "warning", "overtime"] },
    };

    if (type && ["guest", "registered"].includes(type as string)) {
      filter.checkInType = type;
    }

    if (seatId) {
      filter.seat = seatId;
    }

    if (userId) {
      filter.user = userId;
    }

    if (status && ["active", "warning", "overtime"].includes(status as string)) {
      filter.status = status;
    }

    const checkIns = await CheckIn.find(filter)
      .populate("user", "firstName lastName email")
      .populate("guest")
      .populate("seat", "seatCode displayLabel zoneType")
      .sort({ checkInTime: -1 });

    // Calculate time remaining for each check-in and update status if needed
    const now = new Date();
    const enrichedCheckIns = await Promise.all(
      checkIns.map(async (checkIn) => {
        const elapsedMinutes = Math.floor(
          (now.getTime() - checkIn.checkInTime.getTime()) / 60000
        );
        const timeRemainingMinutes = checkIn.allocatedDurationMinutes - elapsedMinutes;

        // Determine new status based on time remaining
        let newStatus = checkIn.status;

        if (timeRemainingMinutes <= 0) {
          // Time exceeded - overtime
          newStatus = "overtime";
        } else if (
          timeRemainingMinutes <= checkIn.warningThresholdMinutes &&
          checkIn.status === "active"
        ) {
          // Time running out - warning
          newStatus = "warning";
        }

        // Update status in database if changed
        if (newStatus !== checkIn.status) {
          await CheckIn.findByIdAndUpdate(checkIn._id, { status: newStatus });

          // Also update seat status based on check-in status
          const seatId = checkIn.seat;
          if (newStatus === "completed") {
            // If check-in is completed, mark seat as available
            await Seat.findByIdAndUpdate(seatId, { status: "available" });
          } else if (newStatus === "warning") {
            // If check-in is in warning, keep seat as occupied but could add visual indicator
            await Seat.findByIdAndUpdate(seatId, { status: "occupied" });
          } else if (newStatus === "overtime") {
            // If check-in is overtime, mark seat as occupied (critical)
            await Seat.findByIdAndUpdate(seatId, { status: "occupied" });
          }
        }

        return {
          ...checkIn.toJSON(),
          status: newStatus, // Return updated status
          elapsedMinutes,
          timeRemainingMinutes,
        };
      })
    );

    res.status(200).json(enrichedCheckIns);
  } catch (error) {
    console.error("Error fetching active check-ins:", error);
    res.status(500).json({ message: "Error fetching active check-ins", error });
  }
};

/**
 * @desc Get check-in history (admin/cashier only)
 * @route GET /api/checkin/history
 * @access Protected (cashier, admin)
 */
export const getCheckInHistory = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate, type, seatId, userId, page = 1, limit = 50 } = req.query;

    const filter: any = { isDeleted: false, status: "completed" };

    if (startDate || endDate) {
      filter.checkInTime = {};
      if (startDate) {
        filter.checkInTime.$gte = new Date(startDate as string);
      }
      if (endDate) {
        filter.checkInTime.$lte = new Date(endDate as string);
      }
    }

    if (type && ["guest", "registered"].includes(type as string)) {
      filter.checkInType = type;
    }

    if (seatId) {
      filter.seat = seatId;
    }

    if (userId) {
      filter.user = userId;
    }

    const pageNum = parseInt(page as string, 10) || 1;
    const limitNum = parseInt(limit as string, 10) || 50;
    const skip = (pageNum - 1) * limitNum;

    const checkIns = await CheckIn.find(filter)
      .populate("user", "firstName lastName email")
      .populate("guest")
      .populate("seat", "seatCode displayLabel zoneType")
      .sort({ checkInTime: -1 })
      .skip(skip)
      .limit(limitNum);

    const total = await CheckIn.countDocuments(filter);

    res.status(200).json({
      data: checkIns,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error("Error fetching check-in history:", error);
    res.status(500).json({ message: "Error fetching check-in history", error });
  }
};

/**
 * @desc Update check-in (admin/cashier only)
 * @route PATCH /api/checkin/:checkInId
 * @access Protected (cashier, admin)
 */
export const updateCheckIn = async (req: Request, res: Response) => {
  try {
    const { checkInId } = req.params;
    const { paymentStatus, paymentAmount } = req.body;

    const checkInRecord = await CheckIn.findById(checkInId);
    if (!checkInRecord) {
      return res.status(404).json({ message: "Check-in record not found" });
    }

    if (paymentStatus && ["pending", "paid", "refunded"].includes(paymentStatus)) {
      checkInRecord.paymentStatus = paymentStatus;
    }

    if (paymentAmount !== undefined && paymentAmount >= 0) {
      checkInRecord.paymentAmount = paymentAmount;
    }

    await checkInRecord.save();

    res.status(200).json(checkInRecord);
  } catch (error) {
    console.error("Error updating check-in:", error);
    res.status(500).json({ message: "Error updating check-in", error });
  }
};

/**
 * @desc Extend check-in duration (admin/cashier only)
 * @route POST /api/checkin/:checkInId/extend
 * @access Protected (cashier, admin)
 */
export const extendCheckIn = async (req: Request, res: Response) => {
  try {
    const { checkInId } = req.params;
    const { additionalMinutes, additionalAmount, appliedBy } = req.body;

    if (!additionalMinutes || additionalMinutes <= 0) {
      return res.status(400).json({ message: "additionalMinutes must be positive" });
    }

    if (additionalAmount === undefined || additionalAmount < 0) {
      return res.status(400).json({ message: "additionalAmount must be non-negative" });
    }

    const checkInRecord = await CheckIn.findById(checkInId);
    if (!checkInRecord) {
      return res.status(404).json({ message: "Check-in record not found" });
    }

    if (checkInRecord.status === "completed") {
      return res.status(400).json({ message: "Cannot extend a completed check-in" });
    }

    // Add extension record
    checkInRecord.extensionHistory.push({
      addedMinutes: additionalMinutes,
      addedAmount: additionalAmount,
      appliedAt: new Date(),
      appliedBy: appliedBy || "System",
    });

    // Update allocated duration
    checkInRecord.allocatedDurationMinutes += additionalMinutes;

    // Update status back to active if it was warning
    if (checkInRecord.status === "warning") {
      checkInRecord.status = "active";
    }

    await checkInRecord.save();

    // Update seat status to occupied (extension means guest is still using it)
    await Seat.findByIdAndUpdate(checkInRecord.seat, { status: "occupied" });

    res.status(200).json({
      id: (checkInRecord._id as any).toString(),
      newAllocatedDuration: checkInRecord.allocatedDurationMinutes,
      newWarningTime: checkInRecord.allocatedDurationMinutes - checkInRecord.warningThresholdMinutes,
      extensionRecord: checkInRecord.extensionHistory[checkInRecord.extensionHistory.length - 1],
    });
  } catch (error) {
    console.error("Error extending check-in:", error);
    res.status(500).json({ message: "Error extending check-in", error });
  }
};

/**
 * @desc Apply penalty charge (admin/cashier only)
 * @route POST /api/checkin/:checkInId/penalty
 * @access Protected (cashier, admin)
 */
export const applyPenalty = async (req: Request, res: Response) => {
  try {
    const { checkInId } = req.params;
    const { penaltyAmount, reason, appliedBy } = req.body;

    if (!penaltyAmount || penaltyAmount <= 0) {
      return res.status(400).json({ message: "penaltyAmount must be positive" });
    }

    if (!reason || typeof reason !== "string" || reason.trim().length === 0) {
      return res.status(400).json({ message: "reason is required" });
    }

    const checkInRecord = await CheckIn.findById(checkInId);
    if (!checkInRecord) {
      return res.status(404).json({ message: "Check-in record not found" });
    }

    // Add penalty record
    checkInRecord.penaltyCharges.push({
      amount: penaltyAmount,
      reason: reason.trim(),
      appliedAt: new Date(),
      appliedBy: appliedBy || "System",
    });

    await checkInRecord.save();

    // Update seat status to occupied (penalty means guest is still using it)
    await Seat.findByIdAndUpdate(checkInRecord.seat, { status: "occupied" });

    const totalPenalties = checkInRecord.penaltyCharges.reduce(
      (sum, penalty) => sum + penalty.amount,
      0
    );

    res.status(200).json({
      id: (checkInRecord._id as any).toString(),
      totalPenalties,
      penaltyRecord: checkInRecord.penaltyCharges[checkInRecord.penaltyCharges.length - 1],
    });
  } catch (error) {
    console.error("Error applying penalty:", error);
    res.status(500).json({ message: "Error applying penalty", error });
  }
};

/**
 * @desc Get check-in timeout warnings (admin/cashier only)
 * @route GET /api/checkin/warnings
 * @access Protected (cashier, admin)
 */
export const getTimeoutWarnings = async (req: Request, res: Response) => {
  try {
    const { warningOnly } = req.query;

    const filter: any = {
      isDeleted: false,
      status: { $in: ["warning", "overtime"] },
    };

    if (warningOnly === "true") {
      filter.status = "warning";
    }

    const checkIns = await CheckIn.find(filter)
      .populate("user", "firstName lastName email")
      .populate("guest")
      .populate("seat", "seatCode displayLabel zoneType")
      .sort({ checkInTime: 1 }); // Oldest first (most urgent)

    // Calculate time remaining for each check-in
    const now = new Date();
    const enrichedCheckIns = checkIns.map((checkIn) => {
      const elapsedMinutes = Math.floor(
        (now.getTime() - checkIn.checkInTime.getTime()) / 60000
      );
      const timeRemainingMinutes = checkIn.allocatedDurationMinutes - elapsedMinutes;

      return {
        ...checkIn.toJSON(),
        elapsedMinutes,
        timeRemainingMinutes,
        urgency: timeRemainingMinutes <= 0 ? "critical" : "warning",
      };
    });

    res.status(200).json(enrichedCheckIns);
  } catch (error) {
    console.error("Error fetching timeout warnings:", error);
    res.status(500).json({ message: "Error fetching timeout warnings", error });
  }
};
