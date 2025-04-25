import { Request, Response } from 'express';
import { NewUser, User } from '../models/user';
import { StatusCodes } from 'http-status-codes';
import {Database} from "../database";
import {USERS_COLUMNS} from "../constants";

export const createUser = (db: Database) => async (req: Request, res: Response) => {
    const newUser: NewUser = req.body;

    try {
        const result = await db.getPool().query<User>(
            `INSERT INTO users (
                   ${USERS_COLUMNS.NAME}, 
                   ${USERS_COLUMNS.EMAIL}
            ) VALUES ($1, $2) RETURNING *`,
            [newUser.name, newUser.email]
        );
        const createdUser: User = result.rows[0];
        res.status(StatusCodes.CREATED).json(createdUser);
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

        // TODO: emit MQ event user.created here

        if (result.rows.length === 0) {
            res.status(StatusCodes.NOT_FOUND).json({ error: 'User not found' });
        }
        const user: User = result.rows[0];
        return res.json(user);
    } catch (err) {
        console.error(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error: 'Failed to get user'});
    }
};
