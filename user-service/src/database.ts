import { Pool } from 'pg';
import dotenv from 'dotenv';
import {USERS_COLUMNS} from "./constants";

dotenv.config();

export class Database {
    private readonly pool: Pool;

    constructor() {
        this.pool = new Pool({
            connectionString: process.env.DATABASE_URL,
        });
    }

    public async initUsersTable(): Promise<void> {
        await this.pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                ${USERS_COLUMNS.USER_ID} SERIAL PRIMARY KEY, 
                ${USERS_COLUMNS.NAME} VARCHAR(100) NOT NULL, 
                ${USERS_COLUMNS.EMAIL} VARCHAR(100) UNIQUE NOT NULL, 
                ${USERS_COLUMNS.CREATED_AT} TIMESTAMP DEFAULT CURRENT_TIMESTAMP);
            `);
    }

    public getPool(): Pool {
        return this.pool;
    }
}