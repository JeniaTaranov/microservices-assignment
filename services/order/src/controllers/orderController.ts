import { Request, Response } from 'express';
import { pool } from '../database';
import { NewOrder, Order } from '../models/order';
import { StatusCodes } from 'http-status-codes';

export const createOrder = async (req: Request, res: Response) => {
    const newOrder: NewOrder = req.body;

    try {
        const result = await pool.query<Order>(
            'INSERT INTO orders (userId, product, quantity, price, createdAt) VALUES ($1, $2, $3, $4, NOW()) RETURNING *',
            [newOrder.userId, newOrder.product, newOrder.quantity, newOrder.price]
        );

        // TODO: emit MQ event order.created here

        const createdOrder: Order = result.rows[0];
        res.status(StatusCodes.CREATED).json(createdOrder);
    } catch (err) {
        console.error(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error: 'Failed to create order'});
    }
};

export const getOrderById = async (req: Request, res: Response) => {
    const userId = parseInt(req.params.userId);

    try {
        const result = await pool.query<Order>(
            'SELECT * FROM orders WHERE userId = $1',
            [userId]
        );
        if (result.rows.length === 0) {
            res.status(StatusCodes.NOT_FOUND);
        }
        const order: Order = result.rows[0];
        res.json(order);
    } catch (err) {
        console.error(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error: 'Failed to get order'});
    }
};