const { DataTypes } = require('sequelize');
const { sequelize } = require('../db/db'); // Adjust path based on your structure
const User = require('./UserModel'); // Import User model

const Feedback = sequelize.define('Feedback', {
  feedbackID: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  userID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User, // References Users table
      key: 'userID'
    },
    onDelete: 'CASCADE' // Ensure feedback is deleted if the user is deleted
  },
  feedbackContent: {
    type: DataTypes.TEXT,
    allowNull: false, // Feedback content cannot be null
  },
  submittedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW // Automatically set the timestamp for feedback submission
  }
}, {
  tableName: 'feedbacks',
  timestamps: false // Set true if you want createdAt & updatedAt timestamps
});

module.exports = Feedback;
