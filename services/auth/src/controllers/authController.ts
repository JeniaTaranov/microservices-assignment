import { Request, Response } from "express";
import { CREDENTIALS } from "../config";
import { JWTProvider } from "../utils/jwt";
import {StatusCodes} from "http-status-codes";

export const login  =
    async (req: Request, res: Response) => {
        const { username, password } = req.body;
        if (username === CREDENTIALS.username && password === CREDENTIALS.password) {
            const jwtProvider: JWTProvider = new JWTProvider(username, password);
            const token = jwtProvider.generateToken(CREDENTIALS.id);
            res.status(StatusCodes.OK).json({token});
        }
        res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Invalid credentials' });
};