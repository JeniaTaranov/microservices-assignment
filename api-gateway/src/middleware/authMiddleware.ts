import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import {StatusCodes} from "http-status-codes";

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        res.status(StatusCodes.UNAUTHORIZED).json({ message: "No token provided" });
        return;
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!);
        (req as any).user = decoded;
        next();
    } catch (error) {
        res.status(StatusCodes.FORBIDDEN).json({ message: "Invalid token" });
    }
};

export default authMiddleware;
