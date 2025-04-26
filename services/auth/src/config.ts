import dotenv from 'dotenv';
import {v4 as uuidv4} from 'uuid';

dotenv.config();

export const JWT_SECRET = process.env.JWT_SECRET!;
export const CREDENTIALS = {
    username: process.env.ADMIN_USERNAME!,
    password: process.env.ADMIN_PASSWORD!,
    id: uuidv4()!
};