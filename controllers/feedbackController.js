const Feedback = require('../models/feedbackModel'); // Adjust path as needed
const User = require('../models/UserModel'); // Adjust path as needed
// Create new feedback
const createFeedback = async (req, res) => {
  try {
    const { userID, feedbackContent } = req.body;
    // Check if user exists before saving feedback
    const user = await User.findByPk(userID);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    // Create feedback record
    const feedback = await Feedback.create({
      userID,
      feedbackContent
    });
    return res.status(201).json({
      success:true,
      message: 'Feedback submitted successfully',
      feedback
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Get feedback by user ID
const getFeedbackByUserID = async (req, res) => {
  try {
    const { userID } = req.params;
    // Fetch all feedback for a given user
    const feedback = await Feedback.findAll({
      where: { userID }
    });
    if (!feedback.length) {
      return res.status(404).json({ message: 'No feedback found for this user' });
    }
    return res.status(200).json({
      message: 'Feedback retrieved successfully',
      feedback
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};
// Get all feedback (admin view or for analytics)
const getAllFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findAll();
    if (!feedback.length) {
      return res.status(404).json({ message: 'No feedback found' });
    }
    return res.status(200).json({
      message: 'All feedback retrieved successfully',
      feedback
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Delete feedback by ID
const deleteFeedback = async (req, res) => {
  try {
    const { feedbackID } = req.params;
    // Find feedback by ID
    const feedback = await Feedback.findByPk(feedbackID);
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }
    // Delete the feedback record
    await feedback.destroy();
    return res.status(200).json({
      success:true,
      message: 'Feedback deleted successfully'
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};
module.exports = {
  createFeedback,
  getFeedbackByUserID,
  getAllFeedback,
  deleteFeedback  // Exporting deleteFeedback function
};
