const Task = require('../models/taskModel');
const User = require('../models/UserModel');

// ✅ Get all tasks for a specific user
const getTasksByUser = async (req, res) => {
  const { userID } = req.body;
  
  try {
    const tasks = await Task.findAll({ where: { userID } });
    res.status(200).json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
};

// ✅ Create a new task
const createTask = async (req, res) => {
  const { userID, taskname,taskdescription, status, due_date } = req.body;

  try {
    const userExists = await User.findByPk(userID);
    if (!userExists) {
      return res.status(404).json({ error: "User not found" });
    }

    const task = await Task.create({ userID,taskname, taskdescription, status, due_date });
    res.status(201).json(task);
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ error: "Failed to create task" });
  }
};

const updateTask = async (req, res) => {
  try {
    // Find the task by taskid
    const task = await Task.findByPk(req.params.taskid);

    // If the task doesn't exist, return a 404 error
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Validate incoming data if needed (for example: taskname, due_date, status)
    const { taskname, taskdescription, status, due_date } = req.body;

    // Prepare the update object, only including fields that are provided
    const updatedFields = {};

    if (taskname) updatedFields.taskname = taskname;
    if (taskdescription) updatedFields.taskdescription = taskdescription;
    if (status) updatedFields.status = status;
    if (due_date) {
      // Ensure the date format is correct (assuming `due_date` should be in 'yyyy-mm-dd' format)
      if (isNaN(Date.parse(due_date))) {
        return res.status(400).json({ error: 'Invalid date format for due_date' });
      }
      updatedFields.due_date = due_date;
    }

    // If no fields are provided to update, return a 400 error
    if (Object.keys(updatedFields).length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    // Update the task with the new details from req.body
    await task.update(updatedFields);

    // Respond with the updated task or success message
    res.status(200).json({ message: 'Task updated successfully', task });

  } catch (error) {
    // Log the error for debugging purposes
    console.error('Error updating task:', error);

    // If there's an error, send a 500 response with a generic error message
    res.status(500).json({ error: 'Failed to update task' });
  }
};



// ✅ Delete a task
const deleteTask = async (req, res) => {
  const { taskid } = req.params;

  try {
    const task = await Task.findByPk(taskid);
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    await task.destroy();
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ error: "Failed to delete task" });
  }
};




// In taskController.js

const createTaskforApi = async (userID,taskname, taskdescription,status, due_date ) => {
    try {
      const userExists = await User.findByPk(userID);
      if (!userExists) {
        return null;  // Return null if user is not found
      }
  
      const task = await Task.create({ userID,taskname, taskdescription, status, due_date });
      return task;  // Return the created task object
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };
  
  module.exports = {
    getTasksByUser,
    createTask,
    updateTask,
    deleteTask,createTaskforApi
  };
    