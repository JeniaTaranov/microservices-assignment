import { Request, Response } from 'express';
import { NewUser, User } from '../models/user';
import { StatusCodes } from 'http-status-codes';
import {Database} from "../database";
import {USERS_COLUMNS} from "../constants";
import {producer} from "../kafka";

export const createUser = (db: Database) =>
    async (req: Request, res: Response) => {
    const newUser: NewUser = req.body;
    if (!newUser?.name || !newUser?.email ) {
        res.status(StatusCodes.BAD_REQUEST).json({ error: 'Missing required fields: name, email' });
        return;
    }

    try {
        const { name: name, email: email} = newUser;
        const result = await db.getPool().query<User>(
            `INSERT INTO users (
                   ${USERS_COLUMNS.NAME}, 
                   ${USERS_COLUMNS.EMAIL}
            ) VALUES ($1, $2) RETURNING *`,
            [name, email]
        );

        await producer.send({
            topic: 'user-created',
            messages: [{ value: JSON.stringify({ name, email })}],
        });

        const createdUser: User = result.rows[0];
        res.json(createdUser);
    } catch (err) {
        console.error(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error: 'Failed to create user'});
    }
};

export const getUserById = (db: Database) =>
    async (req: Request, res: Response) => {
    try {
        const result = await db.getPool().query<User>(
            `SELECT * FROM users WHERE ${USERS_COLUMNS.USER_ID} = $1`,
            [req.params.id]
        );

        if (result.rows.length === 0) {
            res.status(StatusCodes.NOT_FOUND).json({ error: 'User not found' });
            return;
        }
        const user: User = result.rows[0];
        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error: 'Failed to get user'});
    }
};

export const getUsers = (db: Database) =>
    async (req: Request, res: Response) => {
    try {
        const result = await db.getPool().query<User>(
            `SELECT ${USERS_COLUMNS.USER_ID} FROM users`
        );

        res.json(result.rows)
    }catch (err) {
        console.error(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error: 'Failed to get users amount'});
    }
}
