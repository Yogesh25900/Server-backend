require('dotenv').config(); // Load environment variables
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME, // Database name
  process.env.DB_USER, // Username
  process.env.DB_PASSWORD, // Password
  {
    host: process.env.DB_HOST, // Host
    port: process.env.DB_PORT, // Port
    dialect: 'postgres', // Specify the database dialect
    logging: false, // Disable SQL query logging (optional)
  }
);

module.exports = sequelize;
