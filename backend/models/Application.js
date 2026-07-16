import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true, index: true },
  resume: { type: String, required: true }, // Resume URL (defaults to user's profile resume if not custom)
  coverLetter: { type: String },
  status: { 
    type: String, 
    enum: ['pending', 'shortlisted', 'rejected', 'hired'], 
    default: 'pending' 
  },
  aiScore: { type: Number },
  aiFeedback: { type: String },
  appliedAt: { type: Date, default: Date.now },
}, {
  timestamps: true
});

const Application = mongoose.model('Application', applicationSchema);
export default Application;
