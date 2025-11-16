import express from 'express';
import { getPublicKey, subscribe } from '../controllers/pushController.js';

const router = express.Router();

router.get('/public-key', getPublicKey);
router.post('/subscribe', subscribe);

export default router;
