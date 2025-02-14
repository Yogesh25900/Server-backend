const express = require('express');
const { sequelize } = require('./db/db'); // Correctly import sequelize
const chatHistoryRoutes = require('./routes/chatHistoryRoutes');
const userRoutes = require('./routes/UserRoutes');
const cors = require('cors'); // Import CORS for cross-origin resource sharing
const { protect } = require('./middlewares/authMiddleware'); // Import authentication middleware
require('dotenv').config(); // Load environment variables from .env file
const protectedRoutes = require('./routes/protectedRoutes'); // Import auth routes
const cookieParser = require('cookie-parser');
const path = require('path');
const uploadRoute = require('./routes/uploadRoute'); // Import the upload route
const currencyRoutes = require('./routes/currencyRoutes'); // Import the currency');

// Use the currency routes
const taskRoutes = require('./routes/taskRoutes');
const weatherRoutes = require('./routes/weatherRoutes');
const app = express();
const PORT = 3000;
app.use(cookieParser()); // This enables `req.cookies`

// Middleware

app.use(
  cors({
    origin: 'http://localhost:5173', // Replace with your frontend URL
    credentials: true,
  })
);app.use(express.json()); // Middleware for parsing JSON

app.use("/api/weather", weatherRoutes); // Weather API route


app.use('/api/currency', currencyRoutes);

// Use routes
app.use('/api/chat-history', chatHistoryRoutes); // Use chat history routes
app.use('/api/users', userRoutes); // Use user routes

// Test DB connection and sync models
app.use('/auth', protectedRoutes);



app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api', uploadRoute); // All upload endpoints will be under '/api'

app.use('/api/tasks', taskRoutes);


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
