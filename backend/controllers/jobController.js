const Job = require('../models/Job');
const User = require('../models/User');
const aiService = require('../services/aiService');

// @desc    Get all jobs
// @route   GET /api/jobs
// @access  Public
const getJobs = async (req, res) => {
  try {
    const { keyword, location, type, minSalary, skills } = req.query;
    let query = {};

    if (keyword) {
      query.$or = [
        { title: { $regex: keyword, $options: 'i' } },
        { company: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } },
      ];
    }

    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    if (type && type !== 'All') {
      query.type = type;
    }

    if (minSalary) {
      // Assuming salary is stored as a string like "$100k", this might need adjustment 
      // if we want numeric comparison. For now, we'll try to match or do a simple check.
      // If we want real numeric filtering, we'd need to store salary as a number.
      // Given the current schema, let's just do a simple regex or exact match if possible,
      // but usually advanced search implies range. I'll implement a basic regex for now.
      query.salary = { $regex: minSalary, $options: 'i' };
    }

    if (skills) {
      const skillsArray = skills.split(',').map(s => s.trim());
      query.skills = { $all: skillsArray };
    }

    const jobs = await Job.find(query).populate('postedBy', 'name email');
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get job by ID
// @route   GET /api/jobs/:id
// @access  Public
const getJobById = async (req, res) => {
  const job = await Job.findById(req.params.id).populate('postedBy', 'name email');

  if (job) {
    res.json(job);
  } else {
    res.status(404).json({ message: 'Job not found' });
  }
};

// @desc    Create a job
// @route   POST /api/jobs
// @access  Private/Recruiter
const createJob = async (req, res) => {
  const { title, company, location, description, salary, type, skills } = req.query.skills ? req.query : req.body;
  // Note: Handling both query and body for flexibility, but usually body.
  // Actually, I'll stick to req.body.
  const { title: t, company: c, location: l, description: d, salary: s, type: ty, skills: sk } = req.body;

  const job = new Job({
    title: t,
    company: c,
    location: l,
    description: d,
    salary: s,
    type: ty,
    skills: sk,
    postedBy: req.user._id,
  });

  const createdJob = await job.save();
  res.status(201).json(createdJob);
};

// @desc    Delete a job
// @route   DELETE /api/jobs/:id
// @access  Private/Recruiter
const deleteJob = async (req, res) => {
  const job = await Job.findById(req.params.id);

  if (job) {
    if (job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'User not authorized to delete this job' });
    }
    await job.deleteOne();
    res.json({ message: 'Job removed' });
  } else {
    res.status(404).json({ message: 'Job not found' });
  }
};

// @desc    Toggle Bookmark job
// @route   PUT /api/jobs/bookmark/:id
// @access  Private
const toggleBookmark = async (req, res) => {
  const user = await User.findById(req.user._id);
  const jobId = req.params.id;

  if (user.bookmarks.includes(jobId)) {
    user.bookmarks = user.bookmarks.filter((id) => id.toString() !== jobId);
  } else {
    user.bookmarks.push(jobId);
  }

  await user.save();
  res.json(user.bookmarks);
};

// @desc    Get bookmarked jobs
// @route   GET /api/jobs/bookmarks
// @access  Private
const getBookmarkedJobs = async (req, res) => {
  const user = await User.findById(req.user._id).populate('bookmarks');
  res.json(user.bookmarks);
};

// @desc    Get jobs posted by recruiter
// @route   GET /api/jobs/my
// @access  Private/Recruiter
const getRecruiterJobs = async (req, res) => {
  const jobs = await Job.find({ postedBy: req.user._id });
  res.json(jobs);
};

// @desc    Get AI job recommendations
// @route   POST /api/jobs/recommendations/ai
// @access  Private
const getJobRecommendationsAI = async (req, res) => {
  try {
    const { skills } = req.body;
    if (!skills || !Array.isArray(skills)) {
      return res.status(400).json({ message: 'Please provide an array of skills' });
    }

    const allJobs = await Job.find({}).select('_id title description skills');
    
    if (allJobs.length === 0) {
      return res.json([]);
    }

    const recommendedIds = await aiService.getJobRecommendations(skills, allJobs);
    
    const recommendedJobs = await Job.find({ _id: { $in: recommendedIds } }).populate('postedBy', 'name email');
    res.json(recommendedJobs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching AI recommendations' });
  }
};

module.exports = { getJobs, getJobById, createJob, deleteJob, toggleBookmark, getBookmarkedJobs, getRecruiterJobs, getJobRecommendationsAI };
