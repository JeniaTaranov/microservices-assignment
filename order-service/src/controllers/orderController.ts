import { Request, Response } from 'express';
import { Database } from '../database';
import { NewOrder, Order } from '../models/order';
import { StatusCodes } from 'http-status-codes';
import {ORDERS_COLUMNS} from "../constants";
import {producer} from "../kafka";

export const createOrder = (db: Database) => async (req: Request, res: Response) => {
    const newOrder: NewOrder = req.body;

    if (!newOrder?.user_id || !newOrder?.product_name || !newOrder?.amount) {
        res.status(StatusCodes.BAD_REQUEST).json({ error: 'Missing required fields: user_id, product_name, amount' });
        return;
    }

    try {
        const { user_id: userId, product_name: productName, amount } = newOrder;

        const userExistsResult = await db.getPool().query<Order>(
            `SELECT ${ORDERS_COLUMNS.USER_ID} FROM users WHERE ${ORDERS_COLUMNS.USER_ID} = $1`, [userId]
        )
        if (userExistsResult.rows.length == 0){
            res.status(StatusCodes.BAD_REQUEST).json({error: 'Failed to create order for non existing user'});
        }

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
            topic: 'orders.log',
            messages: [{ value: JSON.stringify({ userId, productName, amount })}],
        });

        const createdOrder: Order = result.rows[0];
        res.json(createdOrder);
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
        res.json(order);
    } catch (err) {
        console.error(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error: 'Failed to get order'});
    }
};