import express from 'express';
import RoleModel from '../models/roleModels';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Role:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         _id:
 *           type: string
 *           description: L'ID auto-généré du rôle
 *         name:
 *           type: string
 *           description: Le nom du rôle (ex. admin, user)
 *       example:
 *         _id: 60d21b4667d0d8992e610c86
 *         name: admin
 */

/**
 * @swagger
 * tags:
 *   name: Rôles
 *   description: API pour gérer les rôles utilisateur
 */

/**
 * @swagger
 * /roles:
 *   post:
 *     summary: Crée un nouveau rôle
 *     tags: [Rôles]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nom du rôle
 *     responses:
 *       201:
 *         description: Rôle créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Role'
 *       500:
 *         description: Erreur serveur
 */
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

/**
 * @swagger
 * /roles/{name}:
 *   delete:
 *     summary: Supprime un rôle par son nom
 *     tags: [Rôles]
 *     parameters:
 *       - in: path
 *         name: name
 *         schema:
 *           type: string
 *         required: true
 *         description: Nom du rôle à supprimer
 *     responses:
 *       200:
 *         description: Rôle supprimé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Rôle non trouvé
 *       500:
 *         description: Erreur serveur
 */
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