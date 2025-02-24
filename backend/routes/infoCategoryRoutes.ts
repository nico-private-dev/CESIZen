import express from 'express';
import { getCategories, createCategory } from '../controllers/infoCategoryController';
import { verifyToken, verifyRole } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/categories', getCategories);
router.post('/categories', verifyToken, verifyRole(['admin']), createCategory);

export default router;