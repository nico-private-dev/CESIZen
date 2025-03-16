import { Response } from 'express';
import { IAuthRequest } from '../types/auth';
import Exercise from '../models/exerciseModel';

export const getExercises = async (req: IAuthRequest, res: Response) => {
    try {
      const exercises = await Exercise.find();
      res.json(exercises);
    } catch (error: any) {
      res.status(500).json({ message: error?.message || 'Une erreur est survenue' });
    }
  };

export const getExerciseById = async (req: IAuthRequest, res: Response) => {
  try {
    const exercise = await Exercise.findById(req.params.id);
    if (!exercise) {
      return res.status(404).json({ message: 'Exercice non trouvé' });
    }
    res.json(exercise);
  } catch (error: any) {
    res.status(500).json({ message: error?.message || 'Une erreur est survenue' });
  }
};

export const createExercise = async (req: IAuthRequest, res: Response) => {
  try {
    const { title, description, inspiration, apnee, expiration } = req.body;

    if (req.user?.role) {
      if (typeof req.user.role === 'object') {
      }
    }

    // Validation des données
    if (!title || !description || inspiration === undefined || apnee === undefined || expiration === undefined) {
      return res.status(400).json({ message: 'Tous les champs sont requis' });
    }

    const newExercise = new Exercise({
      title,
      description,
      inspiration,
      apnee,
      expiration
    });

    const savedExercise = await newExercise.save();
    res.status(201).json(savedExercise);
  } catch (error: any) {
    res.status(500).json({ message: error?.message || 'Une erreur est survenue lors de la création de l\'exercice' });
  }
};

export const updateExercise = async (req: IAuthRequest, res: Response) => {
  try {
    const { title, description, inspiration, apnee, expiration } = req.body;

    // Validation des données
    if (!title || !description || inspiration === undefined || apnee === undefined || expiration === undefined) {
      return res.status(400).json({ message: 'Tous les champs sont requis' });
    }

    const updatedExercise = await Exercise.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        inspiration,
        apnee,
        expiration
      },
      { new: true }
    );

    if (!updatedExercise) {
      return res.status(404).json({ message: 'Exercice non trouvé' });
    }

    res.json(updatedExercise);
  } catch (error: any) {
    res.status(500).json({ message: error?.message || 'Une erreur est survenue lors de la mise à jour de l\'exercice' });
  }
};

export const deleteExercise = async (req: IAuthRequest, res: Response) => {
  try {

    const deletedExercise = await Exercise.findByIdAndDelete(req.params.id);
    
    if (!deletedExercise) {
      return res.status(404).json({ message: 'Exercice non trouvé' });
    }

    res.json({ message: 'Exercice supprimé avec succès' });
  } catch (error: any) {
    res.status(500).json({ message: error?.message || 'Une erreur est survenue lors de la suppression de l\'exercice' });
  }
};