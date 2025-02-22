import express from 'express';
import { getInfo, createInfo } from '../controllers/infoController';

const router = express.Router();

router.get('/', getInfo);
router.post('/', createInfo);

export default router;