import { Request, Response } from 'express';
import Info from '../models/infoModel';

export const getInfo = async (req: Request, res: Response) => {
  try {
    const info = await Info.find()
      .populate('category')
      .sort({ createdAt: -1 });
    res.json(info);
  } catch (error: any) {
    res.status(500).json({ message: error?.message || 'Une erreur est survenue' });
  }
};

export const createInfo = async (req: Request, res: Response) => {
  try {
    const newInfo = new Info(req.body);
    const savedInfo = await newInfo.save();
    const populatedInfo = await Info.findById(savedInfo._id).populate('category');
    res.status(201).json(populatedInfo);
  } catch (error: any) {
    res.status(400).json({ message: error?.message || 'Une erreur est survenue' });
  }
};