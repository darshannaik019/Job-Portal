import Job from '../models/Job.js';
import logger from '../utils/logger.js';

export const getJobs = async (req, res, next) => {
  try {
    const { 
      search, 
      location, 
      category, 
      jobType, 
      experience, 
      salaryMin, 
      page = 1, 
      limit = 10 
    } = req.query;

    const query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    if (category) {
      query.category = category;
    }

    if (jobType) {
      query.jobType = jobType;
    }

    if (experience) {
      query.experience = experience;
    }

    if (salaryMin) {
      query.salaryMin = { $gte: Number(salaryMin) };
    }

    const skipIndex = (page - 1) * limit;
    const totalJobs = await Job.countDocuments(query);
    const jobs = await Job.find(query)
      .populate('createdBy', 'name email company')
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip(skipIndex);

    res.status(200).json({
      success: true,
      jobs,
      pagination: {
        totalJobs,
        currentPage: Number(page),
        totalPages: Math.ceil(totalJobs / limit),
        limit: Number(limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getJobById = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id).populate('createdBy', 'name email phone');
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }
    res.status(200).json({ success: true, job });
  } catch (error) {
    next(error);
  }
};

export const createJob = async (req, res, next) => {
  try {
    const jobData = {
      ...req.body,
      createdBy: req.user.id
    };

    const job = await Job.create(jobData);
    res.status(201).json({ success: true, message: 'Job created successfully', job });
  } catch (error) {
    next(error);
  }
};

export const updateJob = async (req, res, next) => {
  try {
    let job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    // Check ownership
    if (job.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to update this job' });
    }

    job = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({ success: true, message: 'Job updated successfully', job });
  } catch (error) {
    next(error);
  }
};

export const deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    if (job.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this job' });
    }

    await job.deleteOne();
    res.status(200).json({ success: true, message: 'Job deleted successfully' });
  } catch (error) {
    next(error);
  }
};
