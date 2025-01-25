const express = require('express');
const User = require('../models/UserModel');
const { protect } = require('../middlewares/authMiddleware'); // Protect middleware

const router = express.Router();


// Get user profile (protected route)
router.get('/fetch-profile', protect, async (req, res) => {
  try {
    const userId = req.user.id; // `req.user` contains the decoded token with the user ID

    //by id we will fetch the user details
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    return res.status(200).json({
      user
    });
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
