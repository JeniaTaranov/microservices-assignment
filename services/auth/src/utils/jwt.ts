import jwt, {JwtPayload, SignOptions } from 'jsonwebtoken';
import {JWT_SECRET} from "../config";

export class JWTProvider {
    private readonly secret: string;
    private readonly signOptions: SignOptions;

    constructor(secret: string, expiresIn: 60) { //expiresIn in seconds
        this.secret = secret;
        this.signOptions = { expiresIn };
    }

    generateToken(userId: string): string {
        const payload = { user_id: userId };
        return jwt.sign(payload, this.secret, this.signOptions);
    }

    verifyToken(token: string): JwtPayload | null {
        try {
            return jwt.verify(token, this.secret) as JwtPayload;
        } catch (err) {
            return null;
        }
    }
}