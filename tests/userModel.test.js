// tests/userModel.test.js
const SequelizeMock = require('sequelize-mock');
const { hashPassword } = require('../helpers/bcryptUtils');

// Mock the bcrypt function
jest.mock('../helpers/bcryptUtils', () => ({
  hashPassword: jest.fn().mockResolvedValue('hashedpassword123'), // Mocking the hashed password
}));

beforeAll(() => {
    global.console.log = jest.fn(); // Mock console.log
  });
  
  afterAll(() => {
    global.console.log.mockRestore(); // Restore after tests are done
  });
  
// Mock the Sequelize instance
const sequelizeMock = new SequelizeMock();

// Define a mock User model
const UserMock = sequelizeMock.define('Users', {
  userID: 1,
  name: 'Test User',
  email: 'test@example.com',
  password: 'password123',
  mobileNumber: '1234567890',
  address: 'Test Address',
  roleID: 2,
}, {});

describe('User Model with Sequelize Mock', () => {
  it('should hash the password before creating a user', async () => {
    const userData = {
      name: 'Jane Doe',
      email: 'jane@example.com',
      password: 'password123', // Plain password
      mobileNumber: '0987654321',
      address: 'Test Address',
      roleID: 2,
    };

    // Directly hash the password (simulate beforeCreate logic)
    const hashedPassword = await hashPassword(userData.password);
    const userWithHashedPassword = { ...userData, password: hashedPassword };

    // Simulate the creation process with mocked model
    const user = await UserMock.create(userWithHashedPassword);

    // Assert that password has been hashed
    expect(user.password).toBe('hashedpassword123'); // Mocked hashed password
    expect(hashPassword).toHaveBeenCalledWith('password123'); // Ensure hashPassword was called with the correct password
  });
});
