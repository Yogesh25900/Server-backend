const { sequelize } = require('../db/db.js')
const { DataTypes } = require('sequelize');
const { hashPassword } = require('../helpers/bcryptUtils.js');


const User = sequelize.define('Users', {
    userID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,  // Ensures email uniqueness
        validate: {
            isEmail: true,  // Ensures the value is a valid email
        },
    },

    mobileNumber: {
        type: DataTypes.STRING(15), // Mobile number column
        allowNull: true,  // Set to `false` if required
        unique: true,     // Ensure uniqueness
        validate: {
          isNumeric: true, // Ensures only numbers
          len: [10, 15]    // Restricts length (adjust as needed)
        }
      },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    address: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    profilePicture: {
        type: DataTypes.STRING,
        allowNull: true,
    },
  
    roleID: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    tableName: 'Users',
    timestamps:true
});


User.beforeCreate(async (user) => {
    user.password = await hashPassword(user.password);
  });
// Sync the database
User.beforeUpdate(async (user) => {
    user.password = await hashPassword(user.password);
  });

module.exports = User;
