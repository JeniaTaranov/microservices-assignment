import dotenv from 'dotenv';
import { Pool } from 'pg';
import request from "supertest";
import {GATEWAY_URL, loginAndGetToken} from "./setup";
import {StatusCodes} from "http-status-codes";

dotenv.config();

let pool: Pool;
let token: string;
let userName: string;
let userEmail: string;
let userId: number;

beforeAll(async () => {
    pool = new Pool({
        connectionString: process.env.DATABASE_URL,
    })
    token = await loginAndGetToken();
});

beforeEach(async() => {
    userName = 'Data correctness user';
    userEmail = `dataCorrectness.${Date.now()}@example.com`
    const userRes = await request(GATEWAY_URL)
        .post('/users')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: userName , email: userEmail });

    userId = userRes.body.user_id;
})

describe('Data correctness via data base validation', () => {
    it('verify user creation', async () => {
        const dbQueryResult = await pool.query(
            `SELECT * FROM users WHERE email = '${userEmail}'`);

        expect(dbQueryResult.rows.length).toBe(1);
        const returnedRow = dbQueryResult.rows[0];
        expect(userId).toBe(returnedRow.user_id);
        expect(returnedRow.name).toBe(userName);
    });

    it('verify order creation for a user', async () => {
        const product_name = 'Beatles Album';
        const product_amount = 6;
        const res = await request(GATEWAY_URL)
            .post('/orders')
            .set('Authorization', `Bearer ${token}`)
            .send({
                user_id: userId,
                product_name: product_name,
                amount: product_amount
            });

        let orderId = res.body.id;
        const dbQueryResult = await pool.query(`SELECT * FROM orders WHERE id = ${orderId}`);
        expect(dbQueryResult.rows.length).toBe(1);
        const returnedRow = dbQueryResult.rows[0];
        expect(returnedRow.user_id).toBe(userId);
        expect(returnedRow.product_name).toBe(product_name);
        expect(returnedRow.amount).toBe(product_amount);
    });

    it('verify retrieval of user\'s order data', async () => {
        const product_name = 'Magic wand';
        const product_amount = 1;
        await request(GATEWAY_URL)
            .post('/orders')
            .set('Authorization', `Bearer ${token}`)
            .send({
                user_id: userId,
                product_name: product_name,
                amount: product_amount
            });
        const res = await request(GATEWAY_URL)
            .get(`/orders/user/${userId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.status).toBe(StatusCodes.OK);

        const dbQueryResult = await pool.query(`SELECT * FROM orders WHERE id = ${res.body.id}`);
        expect(dbQueryResult.rows.length).toBe(1);
        const returnedRow = dbQueryResult.rows[0];
        expect(res.body.user_id).toBe(returnedRow.user_id);
        expect(res.body.product_name).toBe(returnedRow.product_name);
        expect(res.body.amount).toBe(returnedRow.amount);
    })
});