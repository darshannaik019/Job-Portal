import express from 'express';
import { applyJob, getMyApplications } from '../controllers/applicationController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.post('/:jobId', protect, authorize('user'), upload.single('resume'), applyJob);
router.get('/my', protect, authorize('user'), getMyApplications);

export default router;
