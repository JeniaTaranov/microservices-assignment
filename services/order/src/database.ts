import { Pool } from 'pg';
import dotenv from 'dotenv';
import {ORDERS_COLUMNS} from "./constants";

dotenv.config();

export class Database {
    private readonly pool: Pool;

    constructor() {
        this.pool = new Pool({
            connectionString: process.env.DATABASE_URL,
        });
    }

    public async initOrdersTable(): Promise<void> {
        await this.pool.query(`
            CREATE TABLE IF NOT EXISTS orders (
                ${ORDERS_COLUMNS.ID} SERIAL PRIMARY KEY,
                ${ORDERS_COLUMNS.USER_ID} INTEGER NOT NULL,
                ${ORDERS_COLUMNS.PRODUCT_NAME} VARCHAR(255) NOT NULL,
                ${ORDERS_COLUMNS.AMOUNT} INTEGER NOT NULL,
                ${ORDERS_COLUMNS.CREATED_AT} TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
        `);
    }

    public getPool(): Pool {
        return this.pool;
    }
}
