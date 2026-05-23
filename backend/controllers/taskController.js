const Task = require('../models/Task');

// @desc    Get all user tasks
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;

    if (global.useMockDB) {
      const mockDb = require('../config/mockDb');
      const tasks = await mockDb.findTasks(userId.toString(), {
        search: req.query.search,
        status: req.query.status,
        priority: req.query.priority,
        sort: req.query.sort,
      });

      return res.status(200).json({
        success: true,
        count: tasks.length,
        data: tasks,
      });
    }

    const query = { user: userId };

    // Search query filter (checks title and description)
    if (req.query.search) {
      query.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } },
      ];
    }

    // Filter by status
    if (req.query.status && req.query.status !== 'All') {
      query.status = req.query.status;
    }

    // Filter by priority
    if (req.query.priority && req.query.priority !== 'All') {
      query.priority = req.query.priority;
    }

    // Sorting options
    let sortBy = { createdAt: -1 }; // Default sort: newest first
    if (req.query.sort) {
      if (req.query.sort === 'dueDateAsc') {
        sortBy = { dueDate: 1 };
      } else if (req.query.sort === 'dueDateDesc') {
        sortBy = { dueDate: -1 };
      } else if (req.query.sort === 'oldest') {
        sortBy = { createdAt: 1 };
      }
    }

    const tasks = await Task.find(query).sort(sortBy);

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks,
    });
  } catch (error) {
    console.error('Get Tasks Error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching tasks' });
  }
};

// @desc    Get a single task by ID
// @route   GET /api/tasks/:id
// @access  Private
const getTaskById = async (req, res) => {
  try {
    const userId = (req.user._id || req.user.id).toString();

    if (global.useMockDB) {
      const mockDb = require('../config/mockDb');
      const task = await mockDb.findTaskById(req.params.id);

      if (!task) {
        return res.status(404).json({ success: false, message: 'Task not found' });
      }

      // Check ownership
      if (task.user !== userId) {
        return res.status(401).json({ success: false, message: 'Not authorized to access this task' });
      }

      return res.status(200).json({
        success: true,
        data: task,
      });
    }

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    // Check ownership
    if (task.user.toString() !== userId) {
      return res.status(401).json({ success: false, message: 'Not authorized to access this task' });
    }

    res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error) {
    console.error('Get Task ID Error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }
    res.status(500).json({ success: false, message: 'Server error fetching task' });
  }
};

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res) => {
  const { title, description, status, priority, dueDate } = req.body;
  const userId = (req.user._id || req.user.id).toString();

  try {
    if (!title) {
      return res.status(400).json({ success: false, message: 'Please add a task title' });
    }

    if (!dueDate) {
      return res.status(400).json({ success: false, message: 'Please add a due date' });
    }

    if (global.useMockDB) {
      const mockDb = require('../config/mockDb');
      const task = await mockDb.createTask({
        user: userId,
        title,
        description,
        status,
        priority,
        dueDate,
      });

      return res.status(201).json({
        success: true,
        data: task,
      });
    }

    const task = await Task.create({
      user: userId,
      title,
      description,
      status,
      priority,
      dueDate,
    });

    res.status(201).json({
      success: true,
      data: task,
    });
  } catch (error) {
    console.error('Create Task Error:', error);
    res.status(500).json({ success: false, message: 'Server error creating task' });
  }
};

// @desc    Update an existing task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res) => {
  const { title, description, status, priority, dueDate } = req.body;
  const userId = (req.user._id || req.user.id).toString();

  try {
    if (global.useMockDB) {
      const mockDb = require('../config/mockDb');
      let task = await mockDb.findTaskById(req.params.id);

      if (!task) {
        return res.status(404).json({ success: false, message: 'Task not found' });
      }

      // Check ownership
      if (task.user !== userId) {
        return res.status(401).json({ success: false, message: 'Not authorized to modify this task' });
      }

      task = await mockDb.updateTask(req.params.id, {
        title,
        description,
        status,
        priority,
        dueDate,
      });

      return res.status(200).json({
        success: true,
        data: task,
      });
    }

    let task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    // Check ownership
    if (task.user.toString() !== userId) {
      return res.status(401).json({ success: false, message: 'Not authorized to modify this task' });
    }

    // Update fields
    const updatedFields = {
      title: title !== undefined ? title : task.title,
      description: description !== undefined ? description : task.description,
      status: status !== undefined ? status : task.status,
      priority: priority !== undefined ? priority : task.priority,
      dueDate: dueDate !== undefined ? dueDate : task.dueDate,
    };

    task = await Task.findByIdAndUpdate(req.params.id, updatedFields, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error) {
    console.error('Update Task Error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }
    res.status(500).json({ success: false, message: 'Server error updating task' });
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res) => {
  const userId = (req.user._id || req.user.id).toString();

  try {
    if (global.useMockDB) {
      const mockDb = require('../config/mockDb');
      const task = await mockDb.findTaskById(req.params.id);

      if (!task) {
        return res.status(404).json({ success: false, message: 'Task not found' });
      }

      // Check ownership
      if (task.user !== userId) {
        return res.status(401).json({ success: false, message: 'Not authorized to delete this task' });
      }

      await mockDb.deleteTask(req.params.id);

      return res.status(200).json({
        success: true,
        data: {},
        message: 'Task successfully removed',
      });
    }

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    // Check ownership
    if (task.user.toString() !== userId) {
      return res.status(401).json({ success: false, message: 'Not authorized to delete this task' });
    }

    await Task.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      data: {},
      message: 'Task successfully removed',
    });
  } catch (error) {
    console.error('Delete Task Error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }
    res.status(500).json({ success: false, message: 'Server error deleting task' });
  }
};

module.exports = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
};
