import express from 'express';
import orderRoutes from "./routes/orderRoutes";
import dotenv from 'dotenv';
import {Database} from "./database";

dotenv.config();

const app = express();
app.use(express.json());
app.use(orderRoutes);

const db = new Database();

async function startServer() {
    await db.initOrdersTable();
    console.log('Orders table initialized');

    const PORT = process.env.PORT || 3002;
    app.listen(PORT, () => {
        console.log(`Order Service running on port ${PORT}`);
    })
}

startServer();

