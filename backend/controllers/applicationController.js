const Application = require('../models/Application');
const Job = require('../models/Job');
const aiService = require('../services/aiService');

// @desc    Apply for a job
// @route   POST /api/applications
// @access  Private
const applyToJob = async (req, res) => {
  const { jobId, resumeUrl } = req.body;

  const alreadyApplied = await Application.findOne({
    job: jobId,
    applicant: req.user._id,
  });

  if (alreadyApplied) {
    return res.status(400).json({ message: 'You have already applied for this job' });
  }

  const application = new Application({
    job: jobId,
    applicant: req.user._id,
    resumeUrl,
  });

  const createdApplication = await application.save();
  res.status(201).json(createdApplication);
};

// @desc    Get user applications
// @route   GET /api/applications/my
// @access  Private
const getMyApplications = async (req, res) => {
  const applications = await Application.find({ applicant: req.user._id }).populate('job', 'title company location');
  res.json(applications);
};

// @desc    Get applications for a job (Recruiter view)
// @route   GET /api/applications/job/:id
// @access  Private/Recruiter
const getJobApplications = async (req, res) => {
  const applications = await Application.find({ job: req.params.id }).populate('applicant', 'name email');
  res.json(applications);
};

// @desc    Delete application
// @route   DELETE /api/applications/:id
// @access  Private
const deleteApplication = async (req, res) => {
  const application = await Application.findById(req.params.id);

  if (application) {
    if (application.applicant.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    await application.deleteOne();
    res.json({ message: 'Application removed' });
  } else {
    res.status(404).json({ message: 'Application not found' });
  }
};

// @desc    Update application status
// @route   PUT /api/applications/:id/status
// @access  Private/Recruiter
const updateApplicationStatus = async (req, res) => {
  const { status } = req.body;
  const application = await Application.findById(req.params.id).populate('job').populate('applicant', 'name email');

  if (application) {
    if (application.job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to update this application' });
    }
    application.status = status;
    await application.save();

    // Emit real-time notification to the applicant
    const io = req.app.get('io');
    if (io && application.applicant) {
      io.to(application.applicant._id.toString()).emit('notification', {
        title: 'Application Update',
        message: `Your application for ${application.job.title} is now ${status}`,
        type: 'info',
        createdAt: new Date()
      });
      
      // Send email notification
      const emailService = require('../services/emailService');
      if (application.applicant.email) {
        emailService.sendApplicationEmail(application.applicant.email, application.job.title, status);
      }
    }

    res.json(application);
  } else {
    res.status(404).json({ message: 'Application not found' });
  }
};

// @desc    Analyze resume with AI
// @route   POST /api/applications/analyze
// @access  Private/Recruiter
const analyzeResumeAI = async (req, res) => {
  try {
    const { resumeText, jobId } = req.body;
    
    if (!resumeText || !jobId) {
      return res.status(400).json({ message: 'Please provide resumeText and jobId' });
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    const analysis = await aiService.analyzeResume(resumeText, job.description);
    res.json(analysis);
  } catch (error) {
    res.status(500).json({ message: 'Error analyzing resume with AI' });
  }
};

module.exports = { applyToJob, getMyApplications, getJobApplications, deleteApplication, updateApplicationStatus, analyzeResumeAI };
