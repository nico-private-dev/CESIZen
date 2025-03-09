import express from 'express';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../controllers/infoCategoryController';
import { verifyToken, verifyRole } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/categories', getCategories);
router.post('/categories', verifyToken, verifyRole(['admin']), createCategory);
router.put('/categories/:id', verifyToken, verifyRole(['admin']), updateCategory);
router.delete('/categories/:id', verifyToken, verifyRole(['admin']), deleteCategory);

export default router;