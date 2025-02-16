const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');

// Route to create new feedback
router.post('/createfeedback', feedbackController.createFeedback);

// Route to get feedback by user ID
router.get('/feedback/user/:userID', feedbackController.getFeedbackByUserID);

// Route to get all feedback (admin)
router.get('/feedback', feedbackController.getAllFeedback);

module.exports = router;
