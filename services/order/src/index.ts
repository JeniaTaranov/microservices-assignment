import express from 'express';
import orderRoutes from "./routes/orderRoutes";
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());
app.use(orderRoutes);

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
    console.log(`Order Service running on port ${PORT}`);
})