import express from 'express';
import { getExercises } from '../controllers/exerciseController';

const router = express.Router();

router.get('/', getExercises);

export default router;