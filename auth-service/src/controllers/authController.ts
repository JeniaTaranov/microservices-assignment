import { Request, Response } from "express";
import { CREDENTIALS } from "../config";
import {generateToken, verifyToken} from "../utils/jwt";
import {StatusCodes} from "http-status-codes";

export const login  = async (req: Request, res: Response) => {
    try {
        const {username, password} = req.body;
        if (username === CREDENTIALS.username && password === CREDENTIALS.password) {
            const token = generateToken(CREDENTIALS.id);
            res.status(StatusCodes.OK).json({token});
            return;
        }
        res.status(StatusCodes.UNAUTHORIZED).json({message: 'Invalid credentials'});
    } catch (err) {
        console.error('Error in login handler:', err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Something went wrong' });
    }
};

export const verify = async (req: Request, res: Response) => {
    const { token } = req.body;
    const decoded = verifyToken(token);
    if (!decoded) {
        res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Invalid or expired token' });
        return;
    }
    res.status(StatusCodes.OK).json({ user: decoded });
}