import express from 'express';
import { 
  getDashboardAnalytics, 
  getAdminUsers, 
  getAdminJobs, 
  getAdminApplications, 
  updateApplicationStatus 
} from '../controllers/adminController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.get('/dashboard', protect, authorize('admin'), getDashboardAnalytics);
router.get('/users', protect, authorize('admin'), getAdminUsers);
router.get('/jobs', protect, authorize('admin'), getAdminJobs);
router.get('/applications', protect, authorize('admin'), getAdminApplications);
router.patch('/applications/:id/status', protect, authorize('admin'), updateApplicationStatus);

export default router;
