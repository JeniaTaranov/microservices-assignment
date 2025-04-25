import express from 'express';
import {createOrder, getOrderByUserId} from "../controllers/orderController";
import {Database} from "../database";

const router = express.Router();

const orderRoutes = (db: Database) => {
    router.post('/orders', createOrder(db));
    router.get('/orders/user/:userId', getOrderByUserId(db));

    return router;
};

export default router;