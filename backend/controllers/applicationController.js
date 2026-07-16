import Application from '../models/Application.js';
import Job from '../models/Job.js';
import User from '../models/User.js';
import { uploadToCloudinary } from '../services/cloudinaryService.js';
import { sendEmail } from '../services/emailService.js';
import logger from '../utils/logger.js';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdf = require('pdf-parse');
import { scoreResumeWithAI } from '../services/aiService.js';

export const applyJob = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const { coverLetter } = req.body;

    const job = await Job.findById(jobId).populate('createdBy', 'name email');
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    // Check if deadline passed
    if (new Date() > new Date(job.deadline)) {
      return res.status(400).json({ success: false, message: 'Application deadline has passed' });
    }

    const existingApplication = await Application.findOne({ user: req.user.id, job: jobId });
    if (existingApplication) {
      return res.status(400).json({ success: false, message: 'You have already applied for this job' });
    }

    let resumeUrl = req.user.resume;
    let resumeText = req.user.resumeText || '';

    // Seeker can upload a specific resume in this multipart request
    if (req.file) {
      const uploadResult = await uploadToCloudinary(req.file.buffer, 'resumes', 'raw');
      resumeUrl = uploadResult.secure_url;

      // Parse PDF to extract text for new resume upload
      try {
        const pdfData = await pdf(req.file.buffer);
        resumeText = pdfData.text || '';
      } catch (parseError) {
        logger.error(`PDF parsing failed during application: ${parseError.message}`);
      }
    }

    if (!resumeUrl) {
      return res.status(400).json({ success: false, message: 'Please upload a resume or add one to your profile' });
    }

    // Trigger AI Scoring
    const aiResult = await scoreResumeWithAI(resumeText, job);

    const application = await Application.create({
      user: req.user.id,
      job: jobId,
      resume: resumeUrl,
      coverLetter,
      aiScore: aiResult.score,
      aiFeedback: aiResult.feedback
    });

    // Notify recruiter via simulated email
    await sendEmail({
      email: job.createdBy.email,
      subject: `New Job Application: ${job.title}`,
      html: `<h3>Hello ${job.createdBy.name},</h3>
             <p>A candidate (${req.user.name}) has applied for your job opening: <strong>${job.title}</strong>.</p>
             <p>You can review their profile and resume in your dashboard.</p>`,
    });

    res.status(201).json({
      success: true,
      message: 'Applied to job successfully',
      application,
    });
  } catch (error) {
    next(error);
  }
};

export const getMyApplications = async (req, res, next) => {
  try {
    const applications = await Application.find({ user: req.user.id })
      .populate({
        path: 'job',
        select: 'title company location salaryMin salaryMax jobType deadline'
      })
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, applications });
  } catch (error) {
    next(error);
  }
};
