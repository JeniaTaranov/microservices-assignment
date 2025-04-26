import express from 'express';
import authRoutes from "./routes/authRoutes";

const app = express();
const PORT = process.env.PORT || 3003;

app.use(express.json());
app.use('/auth', authRoutes);

app.listen(PORT, () => console.log(`Auth service running on port ${PORT}`));