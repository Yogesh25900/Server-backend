const Task = require('../models/taskModel');  
const User = require('../models/UserModel');  
// d User model
const {createTask,updateTask,deleteTask} = require('../controllers/taskController'); // Mocked Task object
jest.mock('../models/taskModel', () => ({
  findAll: jest.fn(),
  create: jest.fn(),
  findByPk: jest.fn(),
  destroy: jest.fn(),
  update: jest.fn()

}));
jest.mock('../models/UserModel', () => ({
  findByPk: jest.fn(),
}));

describe('Task Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks before each test
  });

  beforeAll(() => {
    global.console.log = jest.fn(); // Mock console.log
  });
  
  afterAll(() => {
    global.console.log.mockRestore(); // Restore after tests are done
  });

  // Test POST create a task
  it('should create a new task', async () => {
    const mockTask = { 
    //   taskid: 1, 
      taskname: 'Sample Task', 
      taskdescription: 'Test description', 
      status: 'Pending', 
      due_date: '2025-01-01',
      userID: 1
    };

    const mockUser = { userID: 1, name: 'Test User', email: 'test@example.com' };

    // Mocking the Task.create and User.findByPk methods
    User.findByPk.mockResolvedValue(mockUser);
    Task.create.mockResolvedValue(mockTask);

    const req = { body: mockTask };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await createTask(req, res);  // Assuming createTask is your controller function

    expect(User.findByPk).toHaveBeenCalledWith(1);
    expect(Task.create).toHaveBeenCalledWith(mockTask);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(mockTask);
  });

  // Test PUT update a task
  it('should update a task', async () => {
    const mockTask = { 
      taskid: 1, 
      taskname: 'Initial Task', 
      taskdescription: 'Initial description', 
      status: 'Pending', 
      due_date: '2025-01-01',
      userID: 1,
      update: jest.fn() // Mocking the update method on the task instance
    };
  
    // Mocking the findByPk method to return the mockTask
    Task.findByPk.mockResolvedValue(mockTask);
  
    const updatedData = { 
      taskname: 'Updated Task', 
      taskdescription: 'Updated description', 
      status: 'Completed', 
      due_date: '2025-02-01' 
    };
  
    const req = { params: { taskid: 1 }, body: updatedData };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  
    await updateTask(req, res);  // Call the updateTask controller
  
    // Ensure that Task.findByPk was called with the correct taskid
    expect(Task.findByPk).toHaveBeenCalledWith(1);
  
    // Ensure that the update method was called on the mockTask with the updated data
    expect(mockTask.update).toHaveBeenCalledWith(updatedData);
  
    // Ensure the correct response status and message are sent
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Task updated successfully', task: mockTask });
  });
  

  // Test DELETE a task
  it('should delete a task', async () => {
    const mockTask = { 
      taskid: 1, 
      taskname: 'Task 1', 
      status: 'Pending', 
      userID: 1,
      destroy: jest.fn() // Mocking the destroy method on the task instance
    };
  
    // Mocking the findByPk method to return the mockTask
    Task.findByPk.mockResolvedValue(mockTask);
  
    const req = { params: { taskid: 1 } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  
    await deleteTask(req, res);  // Assuming deleteTask is your controller function
  
    expect(Task.findByPk).toHaveBeenCalledWith(1);
    expect(mockTask.destroy).toHaveBeenCalled(); // Checking if destroy is called on the task instance
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Task deleted successfully' });
  });
  
});
