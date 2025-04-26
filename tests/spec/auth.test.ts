import request from 'supertest';
import { AUTH_SERVICE_URL } from './setup';
import {StatusCodes} from "http-status-codes";

describe('Auth Service', () => {
    it('should login with valid credentials', async () => {
        const res = await request(AUTH_SERVICE_URL)
            .post('/auth/login')
            .send({username: 'admin', password: 'password'});

        expect(res.statusCode).toBe(StatusCodes.OK);
        expect(res.body.token).toBeDefined();
    });

    it('should reject login with invalid credentials', async () => {
        const res = await request(AUTH_SERVICE_URL)
            .post('/auth/login')
            .send({ username: 'wrong', password: 'wrong' });

        expect(res.statusCode).toBe(StatusCodes.UNAUTHORIZED);
    });
});