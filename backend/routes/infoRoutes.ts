import express from 'express';
import { getInfo, createInfo } from '../controllers/infoController';
import { verifyToken, verifyRole } from '../middleware/authMiddleware';

const router = express.Router();

// Routes publiques
router.get('/articles', getInfo);

// Routes protégées (admin seulement)
router.post('/articles', verifyToken, verifyRole(['admin']), createInfo);

export default router;