import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

export class Database {
    private pool: Pool;

    constructor() {
        this.pool = new Pool({
            connectionString: process.env.DATABASE_URL,
        });
    }

    public async initUsersTable(): Promise<void> {
        await this.pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY, 
                name VARCHAR(100) NOT NULL, 
                email VARCHAR(100) UNIQUE NOT NULL, 
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);
            `);
    }

    public getPool(): Pool {
        return this.pool;
    }
}
