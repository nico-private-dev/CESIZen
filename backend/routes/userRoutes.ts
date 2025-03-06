import express from 'express';
import { getAllUsers } from '../controllers/userController';
import { verifyToken, verifyRole } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/users', verifyToken, verifyRole(['admin']), getAllUsers);

export default router;