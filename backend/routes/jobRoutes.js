import express from 'express';
import { getJobs, getJobById, createJob, updateJob, deleteJob } from '../controllers/jobController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';
import { validateBody } from '../middleware/validationMiddleware.js';
import { jobSchema } from '../utils/validation.js';

const router = express.Router();

router.get('/', getJobs);
router.get('/:id', getJobById);
router.post('/', protect, authorize('admin'), validateBody(jobSchema), createJob);
router.put('/:id', protect, authorize('admin'), validateBody(jobSchema.partial()), updateJob);
router.delete('/:id', protect, authorize('admin'), deleteJob);

export default router;
