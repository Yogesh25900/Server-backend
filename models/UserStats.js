const { sequelize } = require('../db/db.js')
const { DataTypes } = require('sequelize');
const UserStats = sequelize.define('UserStats', {
    userCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
    timestamps: true,  // To track when stats are saved
  });
  
  module.exports = UserStats;
  