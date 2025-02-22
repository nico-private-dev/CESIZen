import express from 'express';
import RoleModel from '../models/roleModels';

const router = express.Router();

router.post('/roles', async (req, res) => {
  const { name } = req.body;

  try {
    const role = new RoleModel({ name });
    await role.save();
    console.log('Role created:', role); // Log pour vérifier la création du rôle
    res.status(201).json(role);
  } catch (error) {
    console.error('Error creating role:', error); // Log pour vérifier les erreurs
    res.status(500).json({ message: 'Error creating role', error });
  }
});

router.delete('/roles/:name', async (req, res) => {
  const { name } = req.params;

  try {
    const role = await RoleModel.findOneAndDelete({ name });
    if (!role) {
      return res.status(404).json({ message: 'Role not found' });
    }
    res.status(200).json({ message: 'Role deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting role', error });
  }
});

export default router;