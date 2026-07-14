import User from '../models/User.js';
import { uploadToCloudinary } from '../services/cloudinaryService.js';
import logger from '../utils/logger.js';

export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { name, phone, skills, education, experience } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (skills) user.skills = skills;
    if (education) user.education = education;
    if (experience) user.experience = experience;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        skills: user.skills,
        education: user.education,
        experience: user.experience,
        resume: user.resume,
        profilePhoto: user.profilePhoto,
        savedJobs: user.savedJobs,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const uploadResume = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a resume file' });
    }

    const uploadResult = await uploadToCloudinary(req.file.buffer, 'resumes', 'raw');
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { resume: uploadResult.secure_url },
      { new: true }
    ).select('-password');

    res.status(200).json({
      success: true,
      message: 'Resume uploaded successfully',
      resumeUrl: uploadResult.secure_url,
      user,
    });
  } catch (error) {
    next(error);
  }
};

export const uploadPhoto = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a photo file' });
    }

    const uploadResult = await uploadToCloudinary(req.file.buffer, 'profiles', 'image');
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { profilePhoto: uploadResult.secure_url },
      { new: true }
    ).select('-password');

    res.status(200).json({
      success: true,
      message: 'Profile photo uploaded successfully',
      photoUrl: uploadResult.secure_url,
      user,
    });
  } catch (error) {
    next(error);
  }
};

export const saveJob = async (req, res, next) => {
  try {
    const jobId = req.params.id;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const index = user.savedJobs.indexOf(jobId);
    let message = '';
    if (index === -1) {
      user.savedJobs.push(jobId);
      message = 'Job saved successfully';
    } else {
      user.savedJobs.splice(index, 1);
      message = 'Job removed from saved list';
    }

    await user.save();
    res.status(200).json({ success: true, message, savedJobs: user.savedJobs });
  } catch (error) {
    next(error);
  }
};
