import { Request, Response } from 'express';
import Info from '../models/infoModel';

export const getInfo = async (req: Request, res: Response) => {
   try {
     const info = await Info.find();
     res.json(info);
   } catch (error: any) {
     res.status(500).json({ message: error?.message || 'Une erreur est survenue' });
   }
 };
 
 export const createInfo = async (req: Request, res: Response) => {
   try {
     const newInfo = new Info(req.body);
     const savedInfo = await newInfo.save();
     res.status(201).json(savedInfo);
   } catch (error: any) {
     res.status(400).json({ message: error?.message || 'Une erreur est survenue' });
   }
 };