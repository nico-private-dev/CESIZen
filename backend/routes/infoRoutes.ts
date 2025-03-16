import express from 'express';
import { getInfo, createInfo, getInfoById, updateInfo, deleteInfo } from '../controllers/infoController';
import { verifyToken, verifyRole } from '../middleware/authMiddleware';

const router = express.Router();

// Routes pour tous les users
router.get('/articles', getInfo);

// Route pour un article spécifique
router.get('/articles/:id', getInfoById);

// Routes protégées (admin seulement) + permet de créer, mettre à jour et supprimer des articles
router.post('/articles', verifyToken, verifyRole(['admin']), createInfo);
router.put('/articles/:id', verifyToken, verifyRole(['admin']), updateInfo);
router.delete('/articles/:id', verifyToken, verifyRole(['admin']), deleteInfo);

export default router;