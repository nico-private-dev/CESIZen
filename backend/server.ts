import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db';
import authRoutes from './routes/authRoutes';
import roleRoutes from './routes/roleRoutes';
import infoRoutes from './routes/infoRoutes';
import infoCategoryRoutes from './routes/infoCategoryRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Connexion à MongoDB
connectDB(); 

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', roleRoutes);
app.use('/api/info', infoRoutes);
app.use('/api/info', infoCategoryRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});