const User  = require('../models/UserModel');
const { generateToken } = require('../helpers/jwtUtils'); // JWT helper
const {  comparePassword } = require('../helpers/bcryptUtils'); // Bcrypt helper

require('dotenv').config();



// Get all users
const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        res.status(200).json(users);
    } catch (error) {
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
        res.status(200).json(user);
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
  const { email, password, name, address, profilePicture, roleID } = req.body;

  try {
 
      // Create the new user with the hashed password
      const newUser = await User.create({
          name,
          email,
          password: password,
          address,
          profilePicture,
          roleID,
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
    // Check if both email and password are provided
    if (!email || !password) {
      return res.status(400).json({
        message: 'Email and password are required.',
      });
    }

    // Check if email is already registered (you can also modify this logic depending on your requirement)
    const user = await User.findOne({
      where: { email },
      attributes: ['userID', 'password', 'name'], // Include userID
    });
    // If the user is not found (email doesn't exist)
    if (!user) {
      return res.status(404).json({
        message: 'User not found. Please check your email and try again.',
      });
    }

    // If email exists, verify the password
    const isPasswordMatch = await comparePassword(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        message: 'Invalid credentials. Please check your password and try again.',
      });
    }

    // Generate a token
    console.log(user.userID)
    const token = generateToken(user.userID);

    // Respond with success
    return res.status(200).json({
      message: 'Login successful',
      token,user
    });
  } catch (err) {
    // Handle unexpected server errors
    return res.status(500).json({
      message: 'An unexpected error occurred. Please try again later.',
      error: err.message,
    });
  }
};




module.exports = { getAllUsers,getUserById,createUser,updateUser,deleteUser,
 login };
