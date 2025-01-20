const express = require('express');
const sequelize = require('./db/db');
const chatHistoryRoutes = require('./routes/chatHistoryRoutes');
const cors = require('cors'); // Import cors

const app = express();
const PORT = 3000;

app.use(cors()); // Enable CORS for all origins
app.use(express.json()); // Middleware for parsing JSON
app.use('/api/chat-history', chatHistoryRoutes); // Use chat history routes

// Test DB connection and sync models
async function connectToDatabase() {
  try {
    await sequelize.authenticate();
    console.log('Database connected!');
    await sequelize.sync(); // Sync all models
    console.log('Models synchronized!');
  } catch (error) {
    console.error('Error connecting to the database:', error);
  }
}

connectToDatabase();

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
