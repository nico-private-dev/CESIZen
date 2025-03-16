import express from 'express';
import RoleModel from '../models/roleModels';

const router = express.Router();

// Routes pour la création d'un rôle
router.post('/roles', async (req, res) => {
  const { name } = req.body;

  try {
    const role = new RoleModel({ name });
    await role.save();
    res.status(201).json(role);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la création du rôle', error });
  }
});

// Routes pour la suppression d'un rôle
router.delete('/roles/:name', async (req, res) => {
  const { name } = req.params;

  try {
    const role = await RoleModel.findOneAndDelete({ name });
    if (!role) {
      return res.status(404).json({ message: 'Rôle non trouvé' });
    }
    res.status(200).json({ message: 'Rôle supprimé' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression du rôle', error });
  }
});

export default router;