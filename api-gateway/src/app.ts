import express from "express";
import userRoutes from "./routes/userRoutes";
import orderRoutes from "./routes/orderRoutes";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(express.json());

app.use('/', userRoutes);
app.use('/', orderRoutes);

export default app;