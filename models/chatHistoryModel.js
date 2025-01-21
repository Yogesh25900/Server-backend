const { sequelize } = require('../db/db.js')
const { DataTypes } = require('sequelize');


// Define the ChatHistory model
const ChatHistory = sequelize.define('ChatHistory', {
  user_query: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  assistant_reply: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
}, {
  tableName: 'chat_history',
  timestamps: true, // Adds createdAt and updatedAt fields
  createdAt: 'created_at', // Map createdAt to created_at in DB
  updatedAt: false, // Disable updatedAt if not required
});

module.exports = ChatHistory;
