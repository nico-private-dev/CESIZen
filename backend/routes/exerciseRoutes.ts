import express from 'express';
import { getExercises, getExerciseById, createExercise, updateExercise, deleteExercise } from '../controllers/exerciseController';
import { verifyToken, verifyRole } from '../middleware/authMiddleware';

const router = express.Router();

// Routes pour tous les users
router.get('/exercice-respiration', getExercises);
router.get('/exercice-respiration/:id', getExerciseById);

// Routes protégées (admin seulement) + permet de créer, mettre à jour et supprimer des exercices
router.post('/exercice-respiration', verifyToken, verifyRole(['admin']), createExercise);
router.put('/exercice-respiration/:id', verifyToken, verifyRole(['admin']), updateExercise);
router.delete('/exercice-respiration/:id', verifyToken, verifyRole(['admin']), deleteExercise);

export default router;