import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './config/db';
import authRoutes from './routes/authRoutes';
import roleRoutes from './routes/roleRoutes';
import infoRoutes from './routes/infoRoutes';
import infoCategoryRoutes from './routes/infoCategoryRoutes';
import userRoutes from './routes/userRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Connexion à MongoDB
connectDB(); 

// Middleware
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:3000', 
  credentials: true, 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'] 
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', roleRoutes);
app.use('/api/info', infoRoutes);
app.use('/api/info', infoCategoryRoutes);
app.use('/api', userRoutes);

app.listen(PORT, () => {
  console.log(`Le serveur tourne sur le port ${PORT} 🔥`);
});