import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config';

export function generateToken(userId: string) {
    return jwt.sign({ user_id: userId }, JWT_SECRET, { expiresIn: '1h' });
}

export function verifyToken(token: string) {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (err) {
        return null;
    }
}