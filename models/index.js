const sequelize = require('../db/db');  // Import sequelize instance
const Query = require('./queryModel');
const Response = require('./responseModel');

// Initialize Sequelize

// In the Query model
Query.hasMany(Response, { 
    foreignKey: 'queryid',
    as: 'response' // Alias here
  });
  
  // In the Response model
  Response.belongsTo(Query, { 
    foreignKey: 'queryid',
    as: 'query' // Alias here
  });
  
module.exports = { sequelize, Query, Response };
