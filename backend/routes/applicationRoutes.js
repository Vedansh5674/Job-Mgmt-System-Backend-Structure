const express = require('express');
const router = express.Router();
const { applyToJob, getMyApplications, getJobApplications, deleteApplication, updateApplicationStatus, analyzeResumeAI } = require('../controllers/applicationController');
const { protect, recruiter } = require('../middleware/authMiddleware');

router.post('/', protect, applyToJob);
router.get('/my', protect, getMyApplications);
router.get('/job/:id', protect, recruiter, getJobApplications);
router.put('/:id/status', protect, recruiter, updateApplicationStatus);
router.delete('/:id', protect, deleteApplication);
router.post('/analyze', protect, recruiter, analyzeResumeAI);

module.exports = router;
