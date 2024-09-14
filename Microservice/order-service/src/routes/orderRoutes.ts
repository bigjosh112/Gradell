import { Router } from 'express';
import { createOrder, getOrders, getOrder, updateOrder } from '../controllers/orderController';

const router = Router();

router.post('/create', createOrder);
router.get('/', getOrders);
router.get('/:id', getOrder);
router.put('/:id', updateOrder);

export default router;