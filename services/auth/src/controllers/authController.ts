import { Request, Response } from "express";
import { CREDENTIALS } from "../config";
import {generateToken, verifyToken} from "../utils/jwt";
import {StatusCodes} from "http-status-codes";

export const login  =
    async (req: Request, res: Response) => {
        const { username, password } = req.body;
        if (username === CREDENTIALS.username && password === CREDENTIALS.password) {
            const token = generateToken(CREDENTIALS.id);
            res.status(StatusCodes.OK).json({token});
        }
        res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Invalid credentials' });
};

export const verify = async (req: Request, res: Response) => {
    const { token } = req.body;
    const decoded = verifyToken(token);
    if (!decoded) {
        res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Invalid or expired token' });
    }
    res.status(StatusCodes.OK).json({ user: decoded });
}