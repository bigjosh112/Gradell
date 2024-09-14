import { Router } from 'express';
import { processPayment, getPayment } from '../controllers/paymentController';

const router = Router();

router.post('/process', processPayment);
router.get('/:id', getPayment);

export default router;