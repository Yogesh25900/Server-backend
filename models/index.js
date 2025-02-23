const sequelize = require('../db/db');  // Import sequelize instance
const Query = require('./queryModel');
const Response = require('./responseModel');

// const Task = require('./taskModel');
// const User = require('./UserModel');

// Initialize Sequelize

// In the Query model (One Query has One Response)
Query.hasOne(Response, { 
  foreignKey: 'queryid',  
  as: 'response'  // Singular since it's a one-to-one relationship
});

// In the Response model (Each Response belongs to One Query)
Response.belongsTo(Query, { 
  foreignKey: 'queryid', 
  as: 'query'  // Singular, since one response is linked to one query
});

module.exports = { sequelize, Query, Response };


// User.hasMany(Task, { foreignKey: 'userID', onDelete: 'CASCADE' });
// Task.belongsTo(User, { foreignKey: 'userID' });

// module.exports = { User, Task };
