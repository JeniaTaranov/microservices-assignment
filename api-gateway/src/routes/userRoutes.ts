import express from "express";
import { createUser, getUser } from "../services/userService";
import authMiddleware from "../middleware/authMiddleware";

const router = express.Router();

router.post('/users', authMiddleware, async (req, res) => {
    try {
        const response = await createUser(req.body);
        res.json(response.data);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/users/:id', authMiddleware, async (req, res) => {
    try {
        const response = await getUser(req.params.id);
        res.json(response.data);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

export default router;