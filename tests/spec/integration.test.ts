import request from 'supertest';
import { loginAndGetToken, GATEWAY_URL } from './setup';
import {StatusCodes} from "http-status-codes";

let token: string;
let userId: string;

beforeAll(async () => {
    token = await loginAndGetToken();
});

describe('Full System Integration Flow', () => {
    it('should create a user, create order, and fetch data correctly', async () => {
        // Create a new user
        const userRes = await request(GATEWAY_URL)
            .post('/users')
            .set('Authorization', `Bearer ${token}`)
            .send({ name: 'Full Flow User', email: `fullflow.${Date.now()}@example.com` });

        expect(userRes.statusCode).toBe(StatusCodes.OK);
        userId = userRes.body.user_id;

        // Create an order
        const orderRes = await request(GATEWAY_URL)
            .post('/orders')
            .set('Authorization', `Bearer ${token}`)
            .send({ user_id: userId, product_name: 'MacBook Air', amount: 11 });

        expect(orderRes.statusCode).toBe(StatusCodes.OK);

        // Fetch the user
        const getUserRes = await request(GATEWAY_URL)
            .get(`/users/${userId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(getUserRes.statusCode).toBe(StatusCodes.OK);
        expect(getUserRes.body.name).toBe('Full Flow User');

        // Fetch orders
        const getOrdersRes = await request(GATEWAY_URL)
            .get(`/orders/user/${userId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(getOrdersRes.statusCode).toBe(StatusCodes.OK);
        expect(getOrdersRes.body).toHaveProperty('id');
        expect(getOrdersRes.body).toHaveProperty('user_id');
        expect(getOrdersRes.body).toHaveProperty('product_name');
        expect(getOrdersRes.body).toHaveProperty('amount');
        expect(getOrdersRes.body).toHaveProperty('created_at');
        expect(typeof getOrdersRes.body.id).toBe('number');
        expect(typeof getOrdersRes.body.user_id).toBe('number');
        expect(typeof getOrdersRes.body.product_name).toBe('string');
        expect(typeof getOrdersRes.body.amount).toBe('number');
        expect(typeof getOrdersRes.body.created_at).toBe('string');
    });
});