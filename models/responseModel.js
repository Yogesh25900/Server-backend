const { sequelize } = require('../db/db.js')
const { DataTypes } = require('sequelize')

    const Response = sequelize.define('Response', {
      responseid: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      queryid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'query',
          key: 'queryid',
        },
        onDelete: 'CASCADE',
      },
      responsetext: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      responsetime: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      },
   
    }, {
      tableName: 'response',
      timestamps: true,
      underscored: true,
    });
  
    Response.associate = (models) => {
      // Correct association: Response belongsTo Query
      Response.belongsTo(Query, {
        foreignKey: 'queryid',
        as: 'query' // Alias for the relationship
      });    };
    
  
module.exports = Response;
  