const express = require('express');
const { verifyToken } = require('../middlewares/authMiddleware');

const router = express.Router();

// Apply the middleware to all protected routes
router.get('/verify-token', verifyToken);

module.exports = router;
