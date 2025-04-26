import request from 'supertest';
import { loginAndGetToken, GATEWAY_URL, createdUserId } from './setup';
import {StatusCodes} from "http-status-codes";

let token: string;

beforeAll(async () => {
    token = await loginAndGetToken();
});

describe('User Service through Gateway', () => {
    it('should create a new user', async () => {
        const res = await request(GATEWAY_URL)
            .post('/users')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'John Doe',
                email: `john.${Date.now()}@example.com`
            });

        expect(res.statusCode).toBe(StatusCodes.OK);
        expect(res.body.user_id).toBeDefined();
    });

    it('should not create user without token', async () => {
        const res = await request(GATEWAY_URL)
            .post('/users')
            .send({ name: 'Unauthorized User', email: 'bad@example.com' });

        expect(res.statusCode).toBe(StatusCodes.UNAUTHORIZED);
    });
});