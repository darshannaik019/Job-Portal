import express from 'express';
import { getConversations, getMessageHistory } from '../controllers/messageController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/conversations', protect, getConversations);
router.get('/history/:otherUserId', protect, getMessageHistory);

export default router;
