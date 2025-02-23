const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');

// Route to create new feedback
router.post('/createfeedback', feedbackController.createFeedback);

// Route to get feedback by user ID
router.get('/get-feedback/user/:userID', feedbackController.getFeedbackByUserID);
router.delete('/delete-feedback/:feedbackID', feedbackController.deleteFeedback);

// Route to get all feedback (admin)
router.get('/get-all-feedback', feedbackController.getAllFeedback);

module.exports = router;
