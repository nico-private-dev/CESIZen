import express from 'express';
import { getAllUsers, deleteUser } from '../controllers/userController';
import { verifyToken, verifyRole } from '../middleware/authMiddleware';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Utilisateurs
 *   description: API pour gérer les utilisateurs (admin uniquement)
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Récupère la liste de tous les utilisateurs
 *     tags: [Utilisateurs]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Liste des utilisateurs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       401:
 *         description: Non autorisé
 *       403:
 *         description: Accès refusé (rôle insuffisant)
 *       500:
 *         description: Erreur serveur
 */
// Routes pour récupérer tous les utilisateurs (admin only)
router.get('/users', verifyToken, verifyRole(['admin']), getAllUsers);

/**
 * @swagger
 * /users/{userId}:
 *   delete:
 *     summary: Supprime un utilisateur
 *     tags: [Utilisateurs]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de l'utilisateur à supprimer
 *     responses:
 *       200:
 *         description: Utilisateur supprimé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       401:
 *         description: Non autorisé
 *       403:
 *         description: Accès refusé (rôle insuffisant)
 *       404:
 *         description: Utilisateur non trouvé
 *       500:
 *         description: Erreur serveur
 */
// Routes pour supprimer un utilisateur (admin only)
router.delete('/users/:userId', verifyToken, verifyRole(['admin']), deleteUser);

export default router;