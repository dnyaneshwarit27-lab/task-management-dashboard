const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const usersFile = path.join(__dirname, '../data/users.json');
const tasksFile = path.join(__dirname, '../data/tasks.json');

// Ensure data folder and files exist
const ensureFilesExist = () => {
  const dir = path.join(__dirname, '../data');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
  if (!fs.existsSync(usersFile)) {
    fs.writeFileSync(usersFile, JSON.stringify([]));
  }
  if (!fs.existsSync(tasksFile)) {
    fs.writeFileSync(tasksFile, JSON.stringify([]));
  }
};

ensureFilesExist();

const readData = (file) => {
  try {
    const data = fs.readFileSync(file, 'utf8');
    return JSON.parse(data);
  } catch (e) {
    return [];
  }
};

const writeData = (file, data) => {
  fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
};

const mockDb = {
  // User Mock Actions
  findUserByEmail: async (email) => {
    const users = readData(usersFile);
    return users.find(u => u.email === email.toLowerCase());
  },
  
  findUserById: async (id) => {
    const users = readData(usersFile);
    const user = users.find(u => u._id === id);
    if (user) {
      // Exclude password field
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    }
    return null;
  },

  createUser: async (userData) => {
    const users = readData(usersFile);
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);
    
    const newUser = {
      _id: Date.now().toString(),
      name: userData.name,
      email: userData.email.toLowerCase(),
      password: hashedPassword,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    users.push(newUser);
    writeData(usersFile, users);
    return newUser;
  },

  // Task Mock Actions
  findTasks: async (userId, filters = {}) => {
    let tasks = readData(tasksFile).filter(t => t.user === userId);
    
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      tasks = tasks.filter(t => 
        t.title.toLowerCase().includes(searchLower) || 
        (t.description && t.description.toLowerCase().includes(searchLower))
      );
    }
    
    if (filters.status && filters.status !== 'All') {
      tasks = tasks.filter(t => t.status === filters.status);
    }
    
    if (filters.priority && filters.priority !== 'All') {
      tasks = tasks.filter(t => t.priority === filters.priority);
    }
    
    // Sort
    if (filters.sort === 'dueDateAsc') {
      tasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    } else if (filters.sort === 'dueDateDesc') {
      tasks.sort((a, b) => new Date(b.dueDate) - new Date(a.dueDate));
    } else if (filters.sort === 'oldest') {
      tasks.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else {
      // Default: newest first
      tasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    
    return tasks;
  },

  findTaskById: async (id) => {
    const tasks = readData(tasksFile);
    return tasks.find(t => t._id === id);
  },

  createTask: async (taskData) => {
    const tasks = readData(tasksFile);
    const newTask = {
      _id: Date.now().toString(),
      user: taskData.user,
      title: taskData.title,
      description: taskData.description || '',
      status: taskData.status || 'Pending',
      priority: taskData.priority || 'Medium',
      dueDate: new Date(taskData.dueDate).toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    tasks.push(newTask);
    writeData(tasksFile, tasks);
    return newTask;
  },

  updateTask: async (id, updatedFields) => {
    const tasks = readData(tasksFile);
    const index = tasks.findIndex(t => t._id === id);
    if (index === -1) return null;
    
    // Normalize field updates
    const updated = {
      ...tasks[index],
      updatedAt: new Date().toISOString()
    };
    if (updatedFields.title !== undefined) updated.title = updatedFields.title;
    if (updatedFields.description !== undefined) updated.description = updatedFields.description;
    if (updatedFields.status !== undefined) updated.status = updatedFields.status;
    if (updatedFields.priority !== undefined) updated.priority = updatedFields.priority;
    if (updatedFields.dueDate !== undefined) updated.dueDate = new Date(updatedFields.dueDate).toISOString();

    tasks[index] = updated;
    writeData(tasksFile, tasks);
    return tasks[index];
  },

  deleteTask: async (id) => {
    const tasks = readData(tasksFile);
    const filteredTasks = tasks.filter(t => t._id !== id);
    writeData(tasksFile, filteredTasks);
    return true;
  }
};

module.exports = mockDb;
