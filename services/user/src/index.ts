import express from 'express';
import userRoutes from './routes/userRoutes';
import dotenv from 'dotenv';
import {Database} from "./database";

dotenv.config();

const app = express();
app.use(express.json());
app.use(userRoutes);

const db = new Database();

async function startServer() {
    await db.initUsersTable();
    console.log('Users table initialized');
    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
        console.log(`User Service running on port ${PORT}`);
    });
}

startServer();
