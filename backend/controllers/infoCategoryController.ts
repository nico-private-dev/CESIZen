import { Request, Response } from 'express';
import InfoCategory from '../models/infoCategoryModel';
import Info from '../models/infoModel';

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

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    
    // Vérifier si la catégorie existe
    const category = await InfoCategory.findById(id);
    if (!category) {
      return res.status(404).json({ message: 'Catégorie non trouvée' });
    }
    
    // Mettre à jour la catégorie
    const updatedCategory = await InfoCategory.findByIdAndUpdate(
      id, 
      { name, description }, 
      { new: true, runValidators: true }
    );
    
    res.json(updatedCategory);
  } catch (error: any) {
    res.status(400).json({ message: error?.message || 'Une erreur est survenue lors de la mise à jour' });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Vérifier si la catégorie existe
    const category = await InfoCategory.findById(id);
    if (!category) {
      return res.status(404).json({ message: 'Catégorie non trouvée' });
    }
    
    // Vérifier si des articles utilisent cette catégorie
    const articlesWithCategory = await Info.countDocuments({ category: id });
    if (articlesWithCategory > 0) {
      return res.status(400).json({ 
        message: 'Impossible de supprimer cette catégorie car elle est utilisée par des articles',
        articlesCount: articlesWithCategory
      });
    }
    
    // Supprimer la catégorie
    await InfoCategory.findByIdAndDelete(id);
    
    res.status(200).json({ message: 'Catégorie supprimée avec succès' });
  } catch (error: any) {
    res.status(500).json({ message: error?.message || 'Une erreur est survenue lors de la suppression' });
  }
};