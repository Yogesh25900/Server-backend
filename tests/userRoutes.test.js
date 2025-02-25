const request = require('supertest');
const app = require('../server'); // Make sure this is the entry point to your Express app
const User = require('../models/UserModel');

// Mocking the database methods used in the routes
jest.mock('../models/UserModel', () => ({
  findAndCountAll: jest.fn(),
  findByPk: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  destroy: jest.fn(),
  count: jest.fn(),
  findOne: jest.fn(),
}));
beforeAll(() => {
    global.console.log = jest.fn(); // Mock console.log
  });
  
  afterAll(() => {
    global.console.log.mockRestore(); // Restore after tests are done
  });
  

describe('User Routes', () => {
   

  it('should return all users', async () => {
    const mockUsers = [
      { userID: 1, name: 'John Doe', email: 'john@example.com' },
      { userID: 2, name: 'Jane Doe', email: 'jane@example.com' },
    ];

    User.findAndCountAll.mockResolvedValue({ rows: mockUsers, count: 2 });

    const res = await request(app).get('/api/users/');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ users: mockUsers, totalUsers: 2 });
  });

  it('should return a user by ID', async () => {
    const mockUser = { userID: 1, name: 'John Doe', email: 'john@example.com' };

    User.findByPk.mockResolvedValue(mockUser);

    const res = await request(app).get('/api/users/1');

    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockUser);
  });

  it('should create a new user', async () => {
    const newUser = {
      name: 'Jane Doe',
      email: 'jane@example.com',
      password: 'password123',
    };

    User.create.mockResolvedValue(newUser);

    const res = await request(app)
      .post('/api/users/signup')
      .send(newUser);

    expect(res.status).toBe(201);
    expect(res.body.message).toBe('User created successfully');
  });


  
  it('should logout successfully', async () => {
    const res = await request(app).post('/api/users/logout');

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Logged out successfully');
  });
});
