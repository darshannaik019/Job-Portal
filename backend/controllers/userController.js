import jwt from 'jsonwebtoken';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdf = require('pdf-parse');
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

    // Parse PDF to extract text
    let resumeText = '';
    try {
      const pdfData = await pdf(req.file.buffer);
      resumeText = pdfData.text || '';
    } catch (parseError) {
      logger.error(`PDF parsing failed during resume upload: ${parseError.message}`);
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { 
        resume: uploadResult.secure_url,
        resumeText: resumeText
      },
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

// Helper function to generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d',
  });
};

export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, role, phone } = req.body;

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    // Create user
    user = await User.create({
      name,
      email,
      password, // will be hashed by mongoose pre-save middleware
      role: role || 'user',
      phone,
    });

    const token = generateToken(user._id);

    // Set HTTPOnly cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      sameSite: 'lax',
    });

    res.status(201).json({
      success: true,
      token,
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

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = generateToken(user._id);

    // Set HTTPOnly cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      sameSite: 'lax',
    });

    res.status(200).json({
      success: true,
      token,
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

export const logoutUser = async (req, res, next) => {
  res.cookie('token', 'none', {
    httpOnly: true,
    expires: new Date(Date.now() + 10 * 1000),
    sameSite: 'lax',
  });
  res.status(200).json({ success: true, message: 'Logged out successfully' });
};
