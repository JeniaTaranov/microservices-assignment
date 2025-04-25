import { Request, Response } from 'express';
import { Database } from '../database';
import { NewOrder, Order } from '../models/order';
import { StatusCodes } from 'http-status-codes';
import {ORDERS_COLUMNS} from "../constants";

export const createOrder = (db: Database) => async (req: Request, res: Response) => {
    const newOrder: NewOrder = req.body;

    try {
        const result = await db.getPool().query<Order>(
            `INSERT INTO orders ( +
             ${ORDERS_COLUMNS.USER_ID}, 
             ${ORDERS_COLUMNS.PRODUCT_NAME}, 
             ${ORDERS_COLUMNS.AMOUNT}, 
             ${ORDERS_COLUMNS.CREATED_AT}
             ) VALUES ($1, $2, $3, NOW()) RETURNING *`,
            [newOrder.userId, newOrder.product, newOrder.quantity]
        );

        // TODO: emit MQ event order.created here

        const createdOrder: Order = result.rows[0];
        res.status(StatusCodes.CREATED).json(createdOrder);
    } catch (err) {
        console.error(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error: 'Failed to create order'});
    }
};

export const getOrderByUserId = (db: Database) =>async (req: Request, res: Response) => {
    const userId = parseInt(req.params.userId);

    try {
        const result = await db.getPool().query<Order>(
            `SELECT * FROM orders WHERE ${ORDERS_COLUMNS.USER_ID} = $1`,
            [userId]
        );
        if (result.rows.length === 0) {
            res.status(StatusCodes.NOT_FOUND).json({ error: 'Order not found' });
        }
        const order: Order = result.rows[0];
        res.json(order);
    } catch (err) {
        console.error(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error: 'Failed to get order'});
    }
};