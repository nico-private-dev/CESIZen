import express from 'express';
import { getExercises, getExerciseById, createExercise, updateExercise, deleteExercise } from '../controllers/exerciseController';
import { verifyToken, verifyRole } from '../middleware/authMiddleware';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Exercise:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - inspiration
 *         - apnee
 *         - expiration
 *       properties:
 *         _id:
 *           type: string
 *           description: L'ID auto-généré de l'exercice
 *         title:
 *           type: string
 *           description: Le titre de l'exercice
 *         description:
 *           type: string
 *           description: La description détaillée de l'exercice
 *         inspiration:
 *           type: number
 *           description: Durée d'inspiration en secondes
 *         apnee:
 *           type: number
 *           description: Durée d'apnée en secondes
 *         expiration:
 *           type: number
 *           description: Durée d'expiration en secondes
 *       example:
 *         _id: 60d21b4667d0d8992e610c85
 *         title: Respiration carrée
 *         description: Technique de respiration pour la relaxation
 *         inspiration: 4
 *         apnee: 4
 *         expiration: 4
 */

/**
 * @swagger
 * tags:
 *   name: Exercices
 *   description: API pour gérer les exercices de respiration
 */

/**
 * @swagger
 * /exercice-respiration:
 *   get:
 *     summary: Récupère la liste de tous les exercices
 *     tags: [Exercices]
 *     responses:
 *       200:
 *         description: Liste des exercices
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Exercise'
 *       500:
 *         description: Erreur serveur
 */
router.get('/exercice-respiration', getExercises);

/**
 * @swagger
 * /exercice-respiration/{id}:
 *   get:
 *     summary: Récupère un exercice par son ID
 *     tags: [Exercices]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de l'exercice
 *     responses:
 *       200:
 *         description: Détails de l'exercice
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Exercise'
 *       404:
 *         description: Exercice non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.get('/exercice-respiration/:id', getExerciseById);

/**
 * @swagger
 * /exercice-respiration:
 *   post:
 *     summary: Crée un nouvel exercice
 *     tags: [Exercices]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - inspiration
 *               - apnee
 *               - expiration
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               inspiration:
 *                 type: number
 *               apnee:
 *                 type: number
 *               expiration:
 *                 type: number
 *     responses:
 *       201:
 *         description: Exercice créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Exercise'
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Non autorisé
 *       500:
 *         description: Erreur serveur
 */
router.post('/exercice-respiration', verifyToken, verifyRole(['admin']), createExercise);

/**
 * @swagger
 * /exercice-respiration/{id}:
 *   put:
 *     summary: Met à jour un exercice existant
 *     tags: [Exercices]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de l'exercice
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - inspiration
 *               - apnee
 *               - expiration
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               inspiration:
 *                 type: number
 *               apnee:
 *                 type: number
 *               expiration:
 *                 type: number
 *     responses:
 *       200:
 *         description: Exercice mis à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Exercise'
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Non autorisé
 *       404:
 *         description: Exercice non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.put('/exercice-respiration/:id', verifyToken, verifyRole(['admin']), updateExercise);

/**
 * @swagger
 * /exercice-respiration/{id}:
 *   delete:
 *     summary: Supprime un exercice
 *     tags: [Exercices]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de l'exercice
 *     responses:
 *       200:
 *         description: Exercice supprimé avec succès
 *       401:
 *         description: Non autorisé
 *       404:
 *         description: Exercice non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.delete('/exercice-respiration/:id', verifyToken, verifyRole(['admin']), deleteExercise);

export default router;