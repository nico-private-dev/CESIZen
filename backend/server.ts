import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/swagger';
import connectDB from './config/db';
import authRoutes from './routes/authRoutes';
import roleRoutes from './routes/roleRoutes';
import infoRoutes from './routes/infoRoutes';
import infoCategoryRoutes from './routes/infoCategoryRoutes';
import userRoutes from './routes/userRoutes';
import exerciseRoutes from './routes/exerciseRoutes';

// Charger les variables d'environnement
dotenv.config();

// Création de l'application Express
const app = express();
const PORT = process.env.PORT || 5001;

// Connexion à MongoDB
connectDB(); 

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: ['http://localhost:3000', 'http://192.168.1.120:3000'], 
  credentials: true, 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'] 
}));

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'CESIZen API Documentation'
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', roleRoutes);
app.use('/api/info', infoRoutes);
app.use('/api/info', infoCategoryRoutes);
app.use('/api', userRoutes);
app.use('/api', exerciseRoutes);

// Vérification du port sur lequel tourne l'application
app.listen(PORT, () => {
  console.log(`Le serveur tourne sur le port ${PORT} 🔥`);
  console.log(`Documentation Swagger disponible sur http://localhost:${PORT}/api-docs`);
});