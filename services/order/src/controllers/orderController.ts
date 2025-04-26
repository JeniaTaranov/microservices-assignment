import { Request, Response } from 'express';
import { Database } from '../database';
import { NewOrder, Order } from '../models/order';
import { StatusCodes } from 'http-status-codes';
import {ORDERS_COLUMNS} from "../constants";
import {producer} from "../kafka";

export const createOrder = (db: Database) => async (req: Request, res: Response) => {
    const newOrder: NewOrder = req.body;
    try {
        const userId = newOrder.user_id;
        const productName = newOrder.product_name;
        const amount = newOrder.amount;
        const result = await db.getPool().query<Order>(
            `INSERT INTO orders (
             ${ORDERS_COLUMNS.USER_ID}, 
             ${ORDERS_COLUMNS.PRODUCT_NAME}, 
             ${ORDERS_COLUMNS.AMOUNT}, 
             ${ORDERS_COLUMNS.CREATED_AT}
             ) VALUES ($1, $2, $3, NOW()) RETURNING *`,
            [userId, productName, amount]
        );

        await producer.send({
            topic: 'orders-log',
            messages: [{ value: JSON.stringify({ userId, productName, amount })}],
        });

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

        if (!result.rows && result.rows === 0) {
            res.status(StatusCodes.NOT_FOUND).json({ error: 'Order not found' });
            return;
        }
        const order: Order = result.rows[0];
        res.status(StatusCodes.OK).json(order);
    } catch (err) {
        console.error(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error: 'Failed to get order'});
    }
};