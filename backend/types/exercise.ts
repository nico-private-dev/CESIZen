import { Document } from 'mongoose';

// Interface pour l'exercice
export interface IExercise extends Document {
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
}