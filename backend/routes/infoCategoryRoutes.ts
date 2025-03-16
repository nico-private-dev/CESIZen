import express from 'express';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../controllers/infoCategoryController';
import { verifyToken, verifyRole } from '../middleware/authMiddleware';

const router = express.Router();

// Routes pour tous les users
router.get('/categories', getCategories);

// Routes protégées (admin seulement) + permet de créer, mettre à jour et supprimer des catégories
router.post('/categories', verifyToken, verifyRole(['admin']), createCategory);
router.put('/categories/:id', verifyToken, verifyRole(['admin']), updateCategory);
router.delete('/categories/:id', verifyToken, verifyRole(['admin']), deleteCategory);

export default router;