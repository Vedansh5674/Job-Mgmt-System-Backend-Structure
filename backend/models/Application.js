const mongoose = require('mongoose');

const applicationSchema = mongoose.Schema(
  {
    job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
    applicant: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    resumeUrl: { type: String, required: true },
    status: { type: String, enum: ['Pending', 'Reviewed', 'Accepted', 'Rejected'], default: 'Pending' },
  },
  { timestamps: true }
);

const Application = mongoose.model('Application', applicationSchema);
module.exports = Application;
