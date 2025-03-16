import { Request, Response } from 'express';
import Info from '../models/infoModel';

// Récuperer des articles
export const getInfo = async (req: Request, res: Response) => {
  try {
    // Récupération des articles avec leurs catégories
    const info = await Info.find()
      .populate('category')
      .sort({ createdAt: -1 });
    res.json(info);
  } catch (error: any) {
    res.status(500).json({ message: error?.message || 'Une erreur est survenue' });
  }
};

// Récuperer un article particulier (ById)
export const getInfoById = async (req: Request, res: Response) => {
  try {
    
    // Récupération de l'article avec sa catégorie
    const info = await Info.findById(req.params.id).populate('category');
    if (!info) {
      return res.status(404).json({ message: 'Article non trouvé' });
    }
    res.json(info);
  } catch (error: any) {
    res.status(500).json({ message: error?.message || 'Une erreur est survenue' });
  }
};

// Créer un article
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

// Mettre à jour un article
export const updateInfo = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Mise à jour de l'article
    const updatedInfo = await Info.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    ).populate('category');
    
    if (!updatedInfo) {
      return res.status(404).json({ message: 'Article non trouvé' });
    }
    
    res.json(updatedInfo);
  } catch (error: any) {
    res.status(400).json({ message: error?.message || 'Une erreur est survenue lors de la mise à jour' });
  }
};

// Supprimer un article
export const deleteInfo = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Suppression de l'article
    const deletedInfo = await Info.findByIdAndDelete(id);
    
    if (!deletedInfo) {
      return res.status(404).json({ message: 'Article non trouvé' });
    }
    
    res.json({ message: 'Article supprimé avec succès' });
  } catch (error: any) {
    res.status(500).json({ message: error?.message || 'Une erreur est survenue lors de la suppression' });
  }
};