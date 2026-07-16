import Application from '../models/Application.js';
import Job from '../models/Job.js';
import User from '../models/User.js';
import { sendEmail } from '../services/emailService.js';
import logger from '../utils/logger.js';

export const getDashboardAnalytics = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Get all jobs created by this recruiter
    const myJobs = await Job.find({ createdBy: userId });
    const myJobIds = myJobs.map((job) => job._id);

    const totalApplications = await Application.countDocuments({ job: { $in: myJobIds } });
    const activeJobs = myJobs.length;
    const shortlistedCount = await Application.countDocuments({ 
      job: { $in: myJobIds }, 
      status: 'shortlisted' 
    });
    const hiredCount = await Application.countDocuments({ 
      job: { $in: myJobIds }, 
      status: 'hired' 
    });

    // Simulated application trends for charts
    const applicationsOverTime = await Application.aggregate([
      { $match: { job: { $in: myJobIds } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      { $limit: 30 }
    ]);

    // Simulated views by source
    const viewsBySource = [
      { source: 'Direct Link', percentage: 45 },
      { source: 'LinkedIn', percentage: 32 },
      { source: 'Job Boards', percentage: 15 },
      { source: 'Others', percentage: 8 },
    ];

    res.status(200).json({
      success: true,
      analytics: {
        totalApplications,
        activeJobs,
        shortlistedCount,
        hiredCount,
        applicationsOverTime,
        viewsBySource
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getAdminUsers = async (req, res, next) => {
  try {
    // Return all users for admin dashboard
    const users = await User.find({}).select('-password');
    res.status(200).json({ success: true, users });
  } catch (error) {
    next(error);
  }
};

export const getAdminJobs = async (req, res, next) => {
  try {
    const jobs = await Job.find({ createdBy: req.user.id });
    res.status(200).json({ success: true, jobs });
  } catch (error) {
    next(error);
  }
};

export const getAdminApplications = async (req, res, next) => {
  try {
    const { status } = req.query;
    const myJobs = await Job.find({ createdBy: req.user.id });
    const myJobIds = myJobs.map((job) => job._id);

    const query = { job: { $in: myJobIds } };
    
    if (status && ['pending', 'shortlisted', 'rejected', 'hired'].includes(status)) {
      query.status = status;
    }

    let apiQuery = Application.find(query);
    
    if (req.query.sort === 'aiScore') {
      apiQuery = apiQuery.sort({ aiScore: -1 });
    } else {
      apiQuery = apiQuery.sort({ createdAt: -1 });
    }

    const applications = await apiQuery
      .populate('user', 'name email phone profilePhoto skills')
      .populate('job', 'title location category');

    res.status(200).json({ success: true, applications });
  } catch (error) {
    next(error);
  }
};

export const updateApplicationStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    if (!['pending', 'shortlisted', 'rejected', 'hired'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status type' });
    }

    const application = await Application.findById(id)
      .populate('user', 'name email')
      .populate('job', 'title createdBy');

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    // Verify ownership of the job
    if (application.job.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to modify this application status' });
    }

    application.status = status;
    await application.save();

    // Send email notification to Seeker
    await sendEmail({
      email: application.user.email,
      subject: `Your application status update: ${application.job.title}`,
      html: `<h3>Hello ${application.user.name},</h3>
             <p>Your application status for the role <strong>${application.job.title}</strong> has been updated to: <strong>${status.toUpperCase()}</strong>.</p>
             <p>Log in to CareerPartner to see more details.</p>`,
    });

    res.status(200).json({ success: true, message: 'Application status updated', application });
  } catch (error) {
    next(error);
  }
};
