const request = require('supertest');
const express = require('express');
const taskRoutes = require('../routes/taskRoutes'); // The path to your routes
const app = express();

app.use(express.json());
app.use('/tasks', taskRoutes); // Use the task routes for this test

describe('Task Routes', () => {
  // Test POST create a task
  it('should create a new task', async () => {
    const newTask = { 
      taskname: 'Sample Task', 
      taskdescription: 'Test description', 
      status: 'Pending', 
      due_date: '2025-01-01',
      userID: 1
    };

    const res = await request(app)
      .post('/tasks/createtask') // Route to create a task
      .send(newTask);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('taskname', 'Sample Task');
    expect(res.body).toHaveProperty('status', 'Pending');
  });



  // Test POST get tasks for a user
  it('should get tasks for a user', async () => {
    const res = await request(app)
      .post('/tasks') // Assuming this route is to get tasks by user
      .send({ userID: 1 });

    expect(res.status).toBe(200);
    expect(res.body).toBeInstanceOf(Array); // Assuming it returns an array of tasks
  });
});


beforeAll(() => {
    global.console.log = jest.fn(); // Mock console.log
  });
  
  afterAll(() => {
    global.console.log.mockRestore(); // Restore after tests are done
  });
  