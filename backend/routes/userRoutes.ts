import express from 'express';
import { getAllUsers, deleteUser } from '../controllers/userController';
import { verifyToken, verifyRole } from '../middleware/authMiddleware';

const router = express.Router();

// Routes pour récupérer tous les utilisateurs (admin only)
router.get('/users', verifyToken, verifyRole(['admin']), getAllUsers);

// Routes pour supprimer un utilisateur (admin only)
router.delete('/users/:userId', verifyToken, verifyRole(['admin']), deleteUser);

export default router;