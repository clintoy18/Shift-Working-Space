import express from 'express';
import {
  getAllSeats,
  getSeatsByZone,
  getSeatByCode,
  updateSeatStatus,
  getAvailability
} from '../controllers/seat.controller';
import { authenticate, checkRole } from "../middleware/auth.middleware";
import { apiLimiter } from "../middleware/rateLimiter.middleware";
import { detectBot, detectScrapingPattern } from "../middleware/botDetection.middleware";

const router = express.Router();

// Apply bot detection and scraping pattern detection (NO RATE LIMITING on seat endpoints)
// This allows users to see seats freely while still catching bots
router.use(detectBot);             // Block obvious bots (curl, wget, python, etc.)
router.use(detectScrapingPattern);  // Detect aggressive scraping patterns

router.get('/', getAllSeats);
router.get('/availability', getAvailability);
router.get('/zone/:zoneType', getSeatsByZone);
router.get('/code/:seatCode', getSeatByCode);

// Protected route: Only Cashiers and Admins can manually change seat status
router.patch('/code/:seatCode/status', authenticate, checkRole('cashier', 'admin'), updateSeatStatus);

export default router;