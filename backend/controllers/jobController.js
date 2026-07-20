import Job from '../models/Job.js';
import User from '../models/User.js';
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
      query.$text = { $search: search };
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

export const getJobRecommendations = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Fetch all active jobs (deadline not passed)
    const activeJobs = await Job.find({ deadline: { $gt: new Date() } })
      .populate('createdBy', 'name email company')
      .sort({ createdAt: -1 });

    const userSkills = user.skills || [];
    const resumeText = user.resumeText || '';

    const recommendations = activeJobs.map(job => {
      let matchScore = 50; // base score
      let matchedSkills = [];

      const jobRequirements = (job.requirements || []).map(r => r.toLowerCase());
      const jobDesc = job.description.toLowerCase();
      const jobTitle = job.title.toLowerCase();

      if (userSkills.length > 0) {
        let skillMatches = 0;
        userSkills.forEach(skill => {
          const lowerSkill = skill.toLowerCase();
          if (jobRequirements.some(req => req.includes(lowerSkill)) || jobDesc.includes(lowerSkill)) {
            skillMatches++;
            matchedSkills.push(skill);
          }
        });
        const skillRatio = skillMatches / Math.max(1, jobRequirements.length);
        matchScore += Math.round(skillRatio * 35);
      }

      if (resumeText) {
        const lowerResume = resumeText.toLowerCase();
        let keywordMatches = 0;
        jobRequirements.forEach(req => {
          if (lowerResume.includes(req.toLowerCase())) {
            keywordMatches++;
          }
        });
        if (jobTitle && lowerResume.includes(jobTitle)) {
          keywordMatches += 2;
        }
        const textRatio = keywordMatches / Math.max(1, jobRequirements.length + 2);
        matchScore += Math.round(textRatio * 15);
      }

      matchScore = Math.min(98, Math.max(30, matchScore));

      return {
        ...job.toObject(),
        matchScore,
        matchedSkills
      };
    });

    recommendations.sort((a, b) => b.matchScore - a.matchScore);

    res.status(200).json({
      success: true,
      jobs: recommendations.slice(0, 6)
    });
  } catch (error) {
    next(error);
  }
};

export const getCompanyList = async (req, res, next) => {
  try {
    const stats = await Job.aggregate([
      {
        $group: {
          _id: "$company",
          openJobs: { $sum: 1 },
          locations: { $addToSet: "$location" },
          categories: { $addToSet: "$category" },
          logoSeed: { $first: "$title" }
        }
      },
      {
        $project: {
          company: "$_id",
          openJobs: 1,
          locations: 1,
          categories: 1,
          logoSeed: 1,
          _id: 0
        }
      },
      { $sort: { openJobs: -1 } }
    ]);
    res.status(200).json({ success: true, companies: stats });
  } catch (error) {
    next(error);
  }
};

export const getSalaryStats = async (req, res, next) => {
  try {
    const stats = await Job.aggregate([
      {
        $group: {
          _id: "$category",
          avgMin: { $avg: "$salaryMin" },
          avgMax: { $avg: "$salaryMax" },
          jobCount: { $sum: 1 }
        }
      },
      {
        $project: {
          category: "$_id",
          avgMin: { $round: ["$avgMin", 0] },
          avgMax: { $round: ["$avgMax", 0] },
          jobCount: 1,
          _id: 0
        }
      },
      { $sort: { jobCount: -1 } }
    ]);
    res.status(200).json({ success: true, salaries: stats });
  } catch (error) {
    next(error);
  }
};
