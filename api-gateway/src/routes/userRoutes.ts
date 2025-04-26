import express from "express";
import { createUser, getUser, getUsers } from "../services/userService";
import authMiddleware from "../middleware/authMiddleware";

const router = express.Router();

router.post('/users', authMiddleware, async (req, res) => {
    const response = await createUser(req.body);
    res.json(response.data);
});

router.get('/users/:id', authMiddleware, async (req, res) => {
    const response = await getUser(req.params.id);
    res.json(response.data);
});

router.get('/users/', authMiddleware, async (req, res) => {
    const response = await getUsers();
    res.json(response.data);
});

export default router;