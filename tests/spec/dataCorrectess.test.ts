import dotenv from 'dotenv';
import { Pool } from 'pg';
import request from "supertest";
import {GATEWAY_URL, loginAndGetToken} from "./setup";

dotenv.config();

let pool: Pool;
let token: string;

beforeAll(async () => {
    pool = new Pool({
        connectionString: process.env.DATABASE_URL,
    })
    token = await loginAndGetToken();
});

describe('Data correctness via data base validation', () => {
    it('user id returned is the same as created in the db', async () => {
        const userName = 'Data correctness user';
        const userEmail = `dataCorrectness.${Date.now()}@example.com`
        const userRes = await request(GATEWAY_URL)
            .post('/users')
            .set('Authorization', `Bearer ${token}`)
            .send({ name: userName , email: userEmail });

        const userId = userRes.body.user_id;
        let dbQueryResult = await pool.query(
            `SELECT user_id FROM users WHERE email = ${userEmail}`);

        expect(userId).toBe(dbQueryResult);
    })
});