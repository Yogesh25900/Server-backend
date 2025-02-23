const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController'); // Ensure this path is correct

// Define routes
router.get('/total', userController.getTotalUsersCount); // Use userController.getTotalUsersCount

router.get('/', userController.getAllUsers); // Get all users
router.get('/:id', userController.getUserById); // Get user by ID
router.post('/signup', userController.createUser); // Create a new user
router.put('/:id', userController.updateUser); // Update a user by ID
router.delete('/deleteuser/:id', userController.deleteUser); // Delete a user by ID

// Assuming you're using Express, add this route
router.get('/getUserbyName/:name', userController.getUserByName);

router.post('/forgotPassword', userController.resetPassword);
// router.get('/details/:userId', userController.getUserDetails);
router.get('/user-details/:id',userController.getUserDetails);

router.post('/login', userController.login);
router.post('/logout', (req, res) => {
    // Clear the cookie by setting it to an expired date
    res.clearCookie('authToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Use 'true' in production if using HTTPS
      sameSite: 'Strict',
      path: '/', // Set to the appropriate path if needed
    });
  
    res.send({ message: 'Logged out successfully' });
  });
  

module.exports = router;
