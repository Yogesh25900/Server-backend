const User  = require('../models/UserModel');
const { generateToken } = require('../helpers/jwtUtils'); // JWT helper
const { hashPassword, comparePassword } = require('../helpers/bcryptUtils'); // Bcrypt helper

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
    const { email, password, name, address, profilePicture, roleID } = req.body; // Destructure necessary fields from request body

    try {
        // Hash the password before saving it to the database

        // Create the new user with the hashed password
        const newUser = await User.create({
            name,

            email,
            password,
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
        // Handle errors
        res.status(400).json({ error: error.message });
    }
};


// Login User
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isPasswordMatch = await comparePassword(password, user.password); // Compare hashed password
    if (!isPasswordMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user.id);
    res.status(200).json({ message: 'Login successful', token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Middleware to protect routes (Authorization)
const protect = async (req, res, next) => {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }
  
    try {
      // Decode the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET); // Ensure JWT_SECRET is set
      req.user = decoded.user; // Attach user data to request object
      next(); // Call the next middleware or route handler
    } catch (err) {
      res.status(401).json({ message: 'Token is not valid' });
    }
  };



  const profile = async (req, res) => {
    try {
      const userId = req.user.id; // Assuming that the user ID is in the token payload
      const user = await User.findByPk(userId); // Fetch user details by ID (you can customize this logic)
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Send the user details
      res.status(200).json({
        id: user.userID ,
        name: user.name,
        email: user.email,
       
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  };
  

module.exports = { getAllUsers,getUserById,createUser,updateUser,deleteUser,
 login, protect,profile };
