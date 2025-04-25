import express from 'express';
import {createOrder, getOrderById} from "../controllers/orderController";

const router = express.Router();
router.post('/orders', createOrder);
router.get('/orders/user/:userId', getOrderById);

export default router;