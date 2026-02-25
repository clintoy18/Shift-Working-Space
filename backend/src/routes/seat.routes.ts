import express from 'express';
import {
  getAllSeats,
  getSeatsByZone,
  getSeatByCode,
  updateSeatStatus,
  getAvailability
} from '../controllers/seat.controller';
import { authenticate, checkRole } from "../middleware/auth.middleware";
import { seatLimiter } from "../middleware/rateLimiter.middleware";
import { detectBot, detectScrapingPattern } from "../middleware/botDetection.middleware";

const router = express.Router();

// Apply strict rate limiting and bot detection to all public seat endpoints
router.use(seatLimiter);           // 5 requests per 15 min
router.use(detectBot);             // Block obvious bots
router.use(detectScrapingPattern);  // Detect scraping patterns

router.get('/', getAllSeats);
router.get('/availability', getAvailability);
router.get('/zone/:zoneType', getSeatsByZone);
router.get('/code/:seatCode', getSeatByCode);

// Protected route: Only Cashiers and Admins can manually change seat status
router.patch('/code/:seatCode/status', authenticate, checkRole('cashier', 'admin'), updateSeatStatus);

export default router;