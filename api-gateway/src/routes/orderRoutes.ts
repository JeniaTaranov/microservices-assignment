import express from "express";
import { createOrder, getOrdersByUserId } from "../services/orderService";
import authMiddleware from "../middleware/authMiddleware";
import {StatusCodes} from "http-status-codes";

const router = express.Router();

router.post('/orders', authMiddleware, async (req, res) => {
    const response = await createOrder(req.body);
    res.json(response.data);
});

router.get('/orders/user/:userId', authMiddleware, async (req, res) => {
    const response = await getOrdersByUserId(req.params.userId);
    res.json(response.data);
});

export default router;