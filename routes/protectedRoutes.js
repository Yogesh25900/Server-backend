const express = require('express');
const { verifyToken } = require('../middlewares/authMiddleware');
const userController = require('../controllers/userController'); // Ensure this path is correct

const router = express.Router();

// Apply the middleware to all protected routes
router.get('/verify-token', verifyToken);
// Dashboard route, protected by token verification

module.exports = router;
