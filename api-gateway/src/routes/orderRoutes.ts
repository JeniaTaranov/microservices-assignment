import express from "express";
import { createOrder, getOrdersByUserId } from "../services/orderService";
import authMiddleware from "../middleware/authMiddleware";

const router = express.Router();

router.post('/orders', authMiddleware, async (req, res) => {
    try {
        const response = await createOrder(req.body);
        res.json(response.data);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/orders/user/:userId', authMiddleware, async (req, res) => {
    try {
        const response = await getOrdersByUserId(req.params.userId);
        res.json(response.data);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

export default router;