import express from 'express';
import { signUp, signIn, getMe } from '../controllers/authController';
import { verifyToken, verifyRole } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/register', signUp);
router.post('/login', signIn);
router.get('/me', verifyToken, getMe);
router.get('/admin', verifyToken, verifyRole(['admin']), (req, res) => {
  res.send('Admin Content');
});

export default router;