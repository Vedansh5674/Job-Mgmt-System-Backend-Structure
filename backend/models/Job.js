const mongoose = require('mongoose');

const jobSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String, required: true },
    description: { type: String, required: true },
    salary: { type: String },
    type: { type: String, enum: ['Full-time', 'Part-time', 'Remote', 'Internship'], default: 'Full-time' },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    skills: { type: [String], default: [] },
  },
  { timestamps: true }
);

// Indexes for faster search queries
jobSchema.index({ title: 'text', company: 'text', description: 'text' });
jobSchema.index({ location: 1 });
jobSchema.index({ skills: 1 });
jobSchema.index({ type: 1 });

const Job = mongoose.model('Job', jobSchema);
module.exports = Job;
