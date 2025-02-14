const { DataTypes } = require('sequelize');
const {sequelize} = require('../db/db'); // Adjust path based on your structure
const User = require('./UserModel'); // Import User model

const Task = sequelize.define('Task', {
  taskid: {
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
    onDelete: 'CASCADE'
  },
  taskname: {
    type: DataTypes.STRING,
    allowNull: false, // Ensure task_name cannot be null
  },
  taskdescription: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('Pending', 'In Progress', 'Completed'),
    allowNull: true,
    defaultValue: 'Pending'
  },
  due_date: {
    type: DataTypes.DATEONLY,
    allowNull: true
  }
}, {
  tableName: 'tasks',
  timestamps: false // Set true if you want createdAt & updatedAt
});

module.exports = Task;
