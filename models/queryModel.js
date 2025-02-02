const { sequelize } = require('../db/db.js')
const { DataTypes } = require('sequelize');
    const Query = sequelize.define('Query', {
      queryid: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      userid: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      querytext: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
     
    }, {
      tableName: 'query',
      timestamps: true,
      underscored: true,
    });
    Query.associate = (models) => {
        // Correct association: Query hasMany Responses
        Query.hasMany(Response, {
            foreignKey: 'queryid',
            as: 'response' // Alias for the relationship
          });      };
module.exports = Query;


  