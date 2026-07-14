import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  location: { type: String, required: true },
  salaryMin: { type: Number, required: true },
  salaryMax: { type: Number, required: true },
  experience: { type: String, required: true }, // e.g. '1-3 years', 'Entry Level'
  category: { type: String, required: true }, // e.g. 'Engineering', 'Design'
  jobType: { 
    type: String, 
    required: true,
    enum: ['Full Time', 'Part Time', 'Contract', 'Internship', 'Remote']
  },
  vacancy: { type: Number, required: true },
  description: { type: String, required: true },
  requirements: [{ type: String }],
  benefits: [{ type: String }],
  deadline: { type: Date, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
}, {
  timestamps: true
});

const Job = mongoose.model('Job', jobSchema);
export default Job;
