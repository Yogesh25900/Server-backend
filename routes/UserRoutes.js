const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController'); // Ensure this path is correct
const { protect } = require('../middlewares/authMiddleware');

// Define routes
router.get('/', userController.getAllUsers); // Get all users
router.get('/:id', userController.getUserById); // Get user by ID
router.post('/signup', userController.createUser); // Create a new user
router.put('/:id', userController.updateUser); // Update a user by ID
router.delete('/:id', userController.deleteUser); // Delete a user by ID

router.post('/login', userController.login);



module.exports = router;
