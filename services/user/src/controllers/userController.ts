import { Request, Response } from 'express';
import { pool } from '../db';
import { NewUser, User } from '../models/user';
import { StatusCodes } from 'http-status-codes';

export const createUser = async (req: Request, res: Response) => {
    const newUser: NewUser = req.body;

    try {
        const result = await pool.query<User>(
            'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *',
            [newUser.name, newUser.email]
        );
        const createdUser: User = result.rows[0];
        res.status(StatusCodes.CREATED).json(createdUser);
    } catch (err) {
        console.error(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error: 'Failed to create user'});
    }
};

export const getUserById = async (req: Request, res: Response) => {
    try {
        const result = await pool.query<User>(
            'SELECT * FROM users WHERE id = $1',
            [req.params.id]
        );

        // TODO: emit MQ event user.created here

        if (result.rows.length === 0) {
            res.status(StatusCodes.NOT_FOUND);
        }
        const user: User = result.rows[0];
        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error: 'Failed to get user'});
    }
};