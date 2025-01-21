const express = require('express');
const { sequelize } = require('./db/db'); // Correctly import sequelize
const chatHistoryRoutes = require('./routes/chatHistoryRoutes');
const userRoutes = require('./routes/UserRoutes');
const cors = require('cors'); // Import CORS for cross-origin resource sharing
const { protect } = require('./middlewares/authMiddleware'); // Import authentication middleware
require('dotenv').config(); // Load environment variables from .env file

const app = express();
const PORT = 3000;

// Middleware
app.use(cors()); // Enable CORS for all origins
app.use(express.json()); // Middleware for parsing JSON

// Use routes
app.use('/api/chat-history', chatHistoryRoutes); // Use chat history routes
app.use('/api/users', userRoutes); // Use user routes

// Test DB connection and sync models


// In server.js or an init file
sequelize.sync()
  .then(() => {
    console.log('Database synced successfully.');
  })
  .catch((error) => {
    console.error('Error syncing the database:', error);
  });

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
