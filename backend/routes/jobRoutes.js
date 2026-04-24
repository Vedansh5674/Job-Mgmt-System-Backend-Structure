const express = require('express');
const router = express.Router();
const { getJobs, getJobById, createJob, deleteJob, toggleBookmark, getBookmarkedJobs, getRecruiterJobs, getJobRecommendationsAI } = require('../controllers/jobController');
const { protect, recruiter } = require('../middleware/authMiddleware');
const { cacheMiddleware } = require('../middleware/cacheMiddleware');

/**
 * @swagger
 * /jobs:
 *   get:
 *     summary: Get all jobs
 *     tags: [Jobs]
 *     parameters:
 *       - in: query
 *         name: keyword
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: List of jobs
 *   post:
 *     summary: Create a new job
 *     tags: [Jobs]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       201:
 *         description: Job created
 */
router.route('/').get(cacheMiddleware, getJobs).post(protect, recruiter, createJob);

/**
 * @swagger
 * /jobs/my:
 *   get:
 *     summary: Get recruiter's posted jobs
 *     tags: [Jobs]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: List of recruiter jobs
 */
router.route('/my').get(protect, recruiter, getRecruiterJobs);
router.route('/bookmarks').get(protect, getBookmarkedJobs);
router.route('/bookmark/:id').put(protect, toggleBookmark);

/**
 * @swagger
 * /jobs/recommendations/ai:
 *   post:
 *     summary: Get AI job recommendations based on skills
 *     tags: [Jobs, AI]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               skills: { type: array, items: { type: string } }
 *     responses:
 *       200:
 *         description: List of recommended jobs
 */
router.route('/recommendations/ai').post(protect, getJobRecommendationsAI);
router.route('/:id').get(getJobById).delete(protect, recruiter, deleteJob);

module.exports = router;
