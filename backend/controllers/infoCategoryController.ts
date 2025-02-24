import { Request, Response } from 'express';
import InfoCategory from '../models/infoCategoryModel';

export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await InfoCategory.find().sort({ name: 1 });
    res.json(categories);
  } catch (error: any) {
    res.status(500).json({ message: error?.message || 'Une erreur est survenue' });
  }
};

export const createCategory = async (req: Request, res: Response) => {
  try {
    const newCategory = new InfoCategory(req.body);
    const savedCategory = await newCategory.save();
    res.status(201).json(savedCategory);
  } catch (error: any) {
    res.status(400).json({ message: error?.message || 'Une erreur est survenue' });
  }
};