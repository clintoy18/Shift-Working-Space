import express from 'express';
import { 
  getAllSeats, 
  getSeatsByZone, 
  getSeatByCode, 
  updateSeatStatus, 
  getAvailability 
} from '../controllers/seat.controller';
import { authenticate, checkRole } from "../middleware/auth.middleware";

const router = express.Router();

router.get('/', getAllSeats);
router.get('/availability', getAvailability);
router.get('/zone/:zoneType', getSeatsByZone);
router.get('/code/:seatCode', getSeatByCode);

// Protected route: Only Cashiers and Admins can manually change seat status
router.patch('/code/:seatCode/status', authenticate, checkRole('cashier', 'admin'), updateSeatStatus);

export default router;