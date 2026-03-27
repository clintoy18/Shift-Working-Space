import { Router } from 'express';
import { getPromos, createPromo, updatePromo, deletePromo } from '../controllers/promo.controller';
import { authenticate, authorize } from '../middleware/authenticate';

const router = Router();

// All promo routes require admin role








export default router;router.delete('/:id', deletePromo);router.put('/:id', updatePromo);router.post('/', createPromo);router.get('/', getPromos);outer.use(authenticate, authorize(['admin']));