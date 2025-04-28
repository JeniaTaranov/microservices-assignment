import request from 'supertest';
import { loginAndGetToken, GATEWAY_URL } from './setup';
import {StatusCodes} from "http-status-codes";

let token: string;
let userId: string;

beforeAll(async () => {
    token = await loginAndGetToken();

    const userRes = await request(GATEWAY_URL)
        .post('/users')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Order Test User', email: `ordertest.${Date.now()}@example.com` });

    userId = userRes.body.user_id;
});

describe('Order Service through Gateway', () => {
    it('should create an order for a user', async () => {
        const res = await request(GATEWAY_URL)
            .post('/orders')
            .set('Authorization', `Bearer ${token}`)
            .send({
                user_id: userId,
                product_name: 'Skoda Octavia',
                amount: 3
            });

        expect(res.statusCode).toBe(StatusCodes.OK);
    });

    it('should fetch orders for a user', async () => {
        await request(GATEWAY_URL)
            .post('/orders')
            .set('Authorization', `Bearer ${token}`)
            .send({
                user_id: userId,
                product_name: 'Pillow',
                amount: 5
            });

        const res = await request(GATEWAY_URL)
            .get(`/orders/user/${userId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(StatusCodes.OK);
    });

    it('should not create order without token', async () => {
        const res = await request(GATEWAY_URL)
            .post('/orders')
            .send({ user_id: userId, product_name: 'Unauthorized Item', amount: 8});

        expect(res.statusCode).toBe(StatusCodes.UNAUTHORIZED);
    });

    it('should not create an order without product name', async () => {
        const res = await request(GATEWAY_URL)
            .post('/orders')
            .set('Authorization', `Bearer ${token}`)
            .send({
                user_id: userId,
                amount: 3
            });

        expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
    });

    it('should not create an order for non-existing id', async () => {
        const invalidUserId = 9999999;

        const res = await request(GATEWAY_URL)
            .post('/orders')
            .set('Authorization', `Bearer ${token}`)
            .send({
                user_id: invalidUserId,
                product_name: 'Lego',
                amount: 3
            });

        expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
    })
});