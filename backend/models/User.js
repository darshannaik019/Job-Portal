import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const educationSchema = new mongoose.Schema({
  degree: { type: String, required: true },
  school: { type: String, required: true },
  startYear: { type: String },
  endYear: { type: String },
});

const experienceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  startDate: { type: String },
  endDate: { type: String },
  description: { type: String },
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  clerkId: { type: String, unique: true, sparse: true },
  password: { type: String },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  phone: { type: String },
  skills: [{ type: String }],
  education: [educationSchema],
  experience: [experienceSchema],
  resume: { type: String }, // Cloudinary URL
  resumeText: { type: String }, // Parsed text from PDF
  profilePhoto: { type: String }, // Cloudinary URL
  savedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }],
}, {
  timestamps: true
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function (enteredPassword) {
  if (!this.password) return false;
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;
