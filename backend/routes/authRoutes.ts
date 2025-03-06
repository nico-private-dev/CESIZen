import express from 'express';
import { signUp, signIn, getMe, refresh, logout, updateUsername } from '../controllers/authController';
import { verifyToken, verifyRole } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/register', signUp);
router.post('/login', signIn);
router.get('/mon-compte', verifyToken, getMe);
router.post('/refresh', refresh);
router.post('/logout', logout);
router.put('/update-username', verifyToken, updateUsername);
router.get('/admin', verifyToken, verifyRole(['admin']), (req, res) => {
  res.send('Admin Content');
});

export default router;