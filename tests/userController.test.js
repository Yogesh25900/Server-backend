const { getAllUsers, getUserById, createUser, login } = require('../controllers/userController');
const User = require('../models/UserModel');
const { generateToken } = require('../helpers/jwtUtils'); // JWT helper
const { comparePassword } = require('../helpers/bcryptUtils'); // Bcrypt helper

jest.mock('../models/UserModel', () => ({
  findAndCountAll: jest.fn(),
  findByPk: jest.fn(),
  findOne:jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  destroy: jest.fn(),
}));

jest.mock('../helpers/bcryptUtils', () => ({
  comparePassword: jest.fn(), // Consolidated mock for bcryptUtils
}));
jest.mock('../helpers/jwtUtils', () => ({
    generateToken: jest.fn(), // Consolidated mock for bcryptUtils
  }));


jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('hashedPassword123'),
}));

beforeAll(() => {
    global.console.log = jest.fn(); // Mock console.log
  });
  
  afterAll(() => {
    global.console.log.mockRestore(); // Restore after tests are done
  });
  
describe('User Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks before each test
  });

  it('should return all users with pagination', async () => {
    // Mocking the `findAndCountAll` method of the User model
    User.findAndCountAll.mockResolvedValue({
      rows: [{ userID: 1, name: 'John Doe', email: 'john@example.com' }],
      count: 1,
    });

    const req = { query: { page: 1, limit: 5 } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await getAllUsers(req, res);

    expect(User.findAndCountAll).toHaveBeenCalledWith({
      limit: 5,
      offset: 0,
      order: [['createdAt', 'DESC']],
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      users: [{ userID: 1, name: 'John Doe', email: 'john@example.com' }],
      totalUsers: 1,
    });
  });

  it('should return a user by ID', async () => {
    // Mocking the `findByPk` method of the User model
    User.findByPk.mockResolvedValue({ userID: 1, name: 'John Doe', email: 'john@example.com' });

    const req = { params: { id: 1 } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await getUserById(req, res);

    expect(User.findByPk).toHaveBeenCalledWith(1);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ userID: 1, name: 'John Doe', email: 'john@example.com' });
  });

  it('should create a new user', async () => {
    const newUser = {
      name: 'Jane Doe',
      email: 'jane@example.com',
      password: 'password123',
    };

    // Mocking the `create` method of the User model
    User.create.mockResolvedValue(newUser);

    const req = { body: newUser };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await createUser(req, res);

    expect(User.create).toHaveBeenCalledWith({
      name: 'Jane Doe',
      email: 'jane@example.com',
      password: 'password123',
      roleID: 1,
    });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: 'User created successfully',
      user: newUser,
    });
  });

  it('should login successfully and return a token', async () => {
    const req = {
      body: {
        email: 'test@example.com',
        password: 'password123',
      },
    };

    const mockUser = {
      userID: 1,
      password: 'hashedPassword123',
      name: 'Test User',
      roleID: 2,
    };

    const res = { 
      status: jest.fn().mockReturnThis(), 
      json: jest.fn(), 
      cookie: jest.fn() 
    };

    User.findOne.mockResolvedValue(mockUser);
    comparePassword.mockResolvedValue(true); // Simulate correct password
    generateToken.mockReturnValue('mocked_token');

    await login(req, res);

    expect(User.findOne).toHaveBeenCalledWith({
      where: { email: 'test@example.com' },
      attributes: ['userID', 'password', 'name', 'roleID'],
    });

    expect(comparePassword).toHaveBeenCalledWith('password123', 'hashedPassword123');
    expect(generateToken).toHaveBeenCalledWith(1);

    expect(res.cookie).toHaveBeenCalledWith('authToken', 'mocked_token', expect.objectContaining({
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      maxAge: 3600000,
    }));

    expect(res.cookie).toHaveBeenCalledWith('role', 2, expect.objectContaining({
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      maxAge: 3600000,
    }));

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Login successful', token: 'mocked_token', roleID: 2 });
  });





});
