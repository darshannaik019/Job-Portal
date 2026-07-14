import express from 'express';
import { getProfile, updateProfile, uploadResume, uploadPhoto, saveJob } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';
import { validateBody } from '../middleware/validationMiddleware.js';
import { profileUpdateSchema } from '../utils/validation.js';

const router = express.Router();

router.get('/profile', protect, getProfile);
router.put('/profile', protect, validateBody(profileUpdateSchema), updateProfile);
router.post('/upload-resume', protect, upload.single('resume'), uploadResume);
router.post('/upload-photo', protect, upload.single('photo'), uploadPhoto);
router.post('/save-job/:id', protect, saveJob);

export default router;
