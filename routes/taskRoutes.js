const express = require('express');
const { getTasksByUser, createTask, updateTask, deleteTask } = require('../controllers/taskController');

const router = express.Router();

router.post('/', getTasksByUser);   // Get tasks for a specific user
router.post('/createtask', createTask);             // Create a task
router.put('/updatetask/:taskid', updateTask);       // Update a task
router.delete('/deletetask/:taskid', deleteTask);    // Delete a task

module.exports = router;
