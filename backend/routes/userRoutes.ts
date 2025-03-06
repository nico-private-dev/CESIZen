import express from 'express';
import { getAllUsers, deleteUser } from '../controllers/userController';
import { verifyToken, verifyRole } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/users', verifyToken, verifyRole(['admin']), getAllUsers);

router.delete('/users/:userId', verifyToken, verifyRole(['admin']), deleteUser);

export default router;