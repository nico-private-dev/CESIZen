import { Request, Response } from 'express';
import Exercise from '../models/exerciseModel';

export const getExercises = async (req: Request, res: Response) => {
    try {
      const exercises = await Exercise.find();
      res.json(exercises);
    } catch (error: any) {
      res.status(500).json({ message: error?.message || 'Une erreur est survenue' });
    }
  };