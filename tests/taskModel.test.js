const { DataTypes } = require('sequelize');
const sequelizeMock = require('sequelize-mock');
const mockDB = new sequelizeMock(); // Mocking the DB connection
const User = require('../models/UserModel'); // Assuming you have this model

// Mock User data for association
const mockUser = {
  userID: 1,
  name: 'Test User',
  email: 'testuser@example.com'
};

beforeAll(() => {
    global.console.log = jest.fn(); // Mock console.log
  });
  
  afterAll(() => {
    global.console.log.mockRestore(); // Restore after tests are done
  });
  
// Mock Task data for testing
const mockTask = {
  taskid: 1,
  userID: 1,
  taskname: 'Sample Task',
  taskdescription: 'This is a sample task description.',
  status: 'Pending',
  due_date: '2025-01-01'
};

describe('Task Model', () => {
  let TaskModel;

  beforeAll(() => {
    // Mock Sequelize model for Task
    TaskModel = mockDB.define('Task', {
      taskid: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      userID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'User', // References Users table
          key: 'userID'
        },
        onDelete: 'CASCADE'
      },
      taskname: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      taskdescription: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      status: {
        type: DataTypes.ENUM('Pending', 'In Progress', 'Completed'),
        allowNull: true,
        defaultValue: 'Pending'
      },
      due_date: {
        type: DataTypes.DATEONLY,
        allowNull: true
      }
    }, {
      tableName: 'tasks',
      timestamps: false
    });
  });

  test('should create a new task', async () => {
    // Mock the create method
    TaskModel.create = jest.fn().mockResolvedValue(mockTask);
    
    const newTask = await TaskModel.create(mockTask);
    
    expect(newTask).toHaveProperty('taskid', mockTask.taskid);
    expect(newTask).toHaveProperty('taskname', mockTask.taskname);
    expect(newTask).toHaveProperty('status', mockTask.status);
    expect(newTask).toHaveProperty('due_date', mockTask.due_date);
  });

  test('should find a task by taskid', async () => {
    // Mock the findOne method
    TaskModel.findOne = jest.fn().mockResolvedValue(mockTask);

    const task = await TaskModel.findOne({ where: { taskid: 1 } });
    
    expect(task).toHaveProperty('taskid', mockTask.taskid);
    expect(task).toHaveProperty('taskname', mockTask.taskname);
    expect(task).toHaveProperty('status', mockTask.status);
  });

  test('should return all tasks', async () => {
    // Mock the findAll method
    TaskModel.findAll = jest.fn().mockResolvedValue([mockTask]);

    const tasks = await TaskModel.findAll();
    
    expect(tasks).toHaveLength(1);
    expect(tasks[0]).toHaveProperty('taskid', mockTask.taskid);
  });

  test('should associate task with user', async () => {
    // Mock User association
    User.findOne = jest.fn().mockResolvedValue(mockUser);
    
    const user = await User.findOne({ where: { userID: 1 } });
    
    expect(user).toHaveProperty('userID', mockUser.userID);
    expect(user).toHaveProperty('email', mockUser.email);
  });

  test('should delete a task', async () => {
    // Mock the destroy method
    TaskModel.destroy = jest.fn().mockResolvedValue(1);

    const result = await TaskModel.destroy({ where: { taskid: 1 } });

    expect(result).toBe(1);
  });
});

