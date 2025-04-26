import {Request, Response, NextFunction} from "express";
import {StatusCodes} from "http-status-codes";
import {verifyToken} from "../utils/jwt";

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader){
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Token required' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    if (!decoded){
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Invalid or expired token' });
    }

    (req as any).user = decoded;
    next();
}