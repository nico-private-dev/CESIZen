import express from 'express';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../controllers/infoCategoryController';
import { verifyToken, verifyRole } from '../middleware/authMiddleware';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     InfoCategory:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         _id:
 *           type: string
 *           description: L'ID auto-généré de la catégorie
 *         name:
 *           type: string
 *           description: Le nom de la catégorie
 *         description:
 *           type: string
 *           description: La description de la catégorie
 *       example:
 *         _id: 60d21b4667d0d8992e610c86
 *         name: Bien-être
 *         description: Articles sur le bien-être et la santé mentale
 */

/**
 * @swagger
 * tags:
 *   name: Catégories d'articles
 *   description: API pour gérer les catégories d'articles
 */

/**
 * @swagger
 * /info/categories:
 *   get:
 *     summary: Récupère la liste de toutes les catégories
 *     tags: [Catégories d'articles]
 *     responses:
 *       200:
 *         description: Liste des catégories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/InfoCategory'
 *       500:
 *         description: Erreur serveur
 */
// Routes pour tous les users
router.get('/categories', getCategories);

/**
 * @swagger
 * /info/categories:
 *   post:
 *     summary: Crée une nouvelle catégorie
 *     tags: [Catégories d'articles]
 *     security:
 *       - cookieAuth: []
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
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Catégorie créée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InfoCategory'
 *       400:
 *         description: Données invalides ou nom de catégorie déjà utilisé
 *       401:
 *         description: Non autorisé
 *       500:
 *         description: Erreur serveur
 */
// Routes protégées (admin seulement) + permet de créer, mettre à jour et supprimer des catégories
router.post('/categories', verifyToken, verifyRole(['admin']), createCategory);

/**
 * @swagger
 * /info/categories/{id}:
 *   put:
 *     summary: Met à jour une catégorie existante
 *     tags: [Catégories d'articles]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la catégorie
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Catégorie mise à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InfoCategory'
 *       400:
 *         description: Données invalides ou nom de catégorie déjà utilisé
 *       401:
 *         description: Non autorisé
 *       404:
 *         description: Catégorie non trouvée
 *       500:
 *         description: Erreur serveur
 */
router.put('/categories/:id', verifyToken, verifyRole(['admin']), updateCategory);

/**
 * @swagger
 * /info/categories/{id}:
 *   delete:
 *     summary: Supprime une catégorie
 *     tags: [Catégories d'articles]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la catégorie
 *     responses:
 *       200:
 *         description: Catégorie supprimée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       401:
 *         description: Non autorisé
 *       404:
 *         description: Catégorie non trouvée
 *       500:
 *         description: Erreur serveur
 */
router.delete('/categories/:id', verifyToken, verifyRole(['admin']), deleteCategory);

export default router;