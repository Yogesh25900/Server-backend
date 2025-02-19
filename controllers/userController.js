const User  = require('../models/UserModel');
const { generateToken } = require('../helpers/jwtUtils'); // JWT helper
const {  comparePassword } = require('../helpers/bcryptUtils'); // Bcrypt helper
const { Op } = require('sequelize');  // Import Op for Sequelize operators

require('dotenv').config();
const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 5 } = req.query; // Default to page 1, 5 users per page
    const offset = (page - 1) * limit;

    const { rows, count } = await User.findAndCountAll({
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']], // Order by `createdAt` in descending order
    });

    res.status(200).json({
      users: rows, // The actual users for the page
      totalUsers: count, // Total number of users for pagination calculation
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get a single user by ID
const getUserById = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Create a new user


// Update a user
const updateUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        await user.update(req.body);
        res.status(200).json("details upated successfully");
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete a user
const deleteUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        await user.destroy();
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};










// Utility to generate JWT token
const createUser = async (req, res) => {
  const { name,email, password } = req.body;

  try {
 
      // Create the new user with the hashed password
      const newUser = await User.create({
          name,
          email,
          password: password,
          
          roleID:1,
      });

      // Send success response
      res.status(201).json({
          message: 'User created successfully',
          user: newUser,
      });
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      // Extract and customize validation error messages
      const errors = error.errors.map((err) => {
          if (err.validatorKey === 'isEmail') {
              return 'Please provide a valid email address.';
          }
          return err.message; // Fallback for other validation errors
      });
      return res.status(400).json({ message: errors.join(', ') });
  }
      // Handle unique constraint errors for email
      if (error.name === 'SequelizeUniqueConstraintError') {
          return res.status(400).json({ message: 'Email already exists' });
      }

      // Handle other errors
      res.status(500).json({ error: error.message });
  }
};


// Login User
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await User.findOne({
      where: { email },
      attributes: ['userID', 'password', 'name'],
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found. Please check your email and try again.' });
    }

    const isPasswordMatch = await comparePassword(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ message: 'Invalid credentials. Please check your password and try again.' });
    }

    const token = generateToken(user.userID);

    res.cookie('authToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      maxAge: 3600000,
    });

    return res.status(200).json({ message: 'Login successful', token });
  } catch (err) {
    return res.status(500).json({ message: 'An unexpected error occurred.', error: err.message });
  }
};



// Get user details controller
const getUserDetails = async (req, res) => {
  try {
    const userId = req.params.id; // Access the userId from the token's decoded payload

    // Fetch user details from the database
    const user = await User.findOne({
      where: { userID: userId },
      attributes: ['userID', 'name', 'email', 'address', 'profilePicture','mobileNumber'], // Only fetch necessary fields
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Send user details as response
    res.status(200).json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

// Get a single user by name


const getUserByName = async (req, res) => {
  try {
    const { name } = req.params; // Get the name from the request parameters

    // Search for users by name (case-insensitive) or if the first letter matches
    const { rows, count } = await User.findAndCountAll({
      where: {
        [Op.or]: [
          // Match if the name starts with the given name (case-insensitive)
          { name: { [Op.iLike]: `%${name}%` } },
          // Match if the name starts with the first letter of the given name (case-insensitive)
          { name: { [Op.iLike]: `${name[0]}%` } }
        ]
      }
    });

    if (count === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return users and total user count
    res.status(200).json({
      users: rows, // The actual users matching the name query
      totalUsers: count, // Total number of users for pagination or further use
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};






module.exports = { getAllUsers,getUserById,createUser,updateUser,deleteUser,getUserDetails,getUserByName,
 login };
