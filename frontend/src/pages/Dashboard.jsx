import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import StatsSection from '../components/StatsSection';
import TaskCard from '../components/TaskCard';
import TaskFormModal from '../components/TaskFormModal';
import { Plus, Search, Calendar, FolderHeart } from 'lucide-react';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Search & Filter state
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('All');
  const [priority, setPriority] = useState('All');
  const [sort, setSort] = useState('newest');

  // Modal control states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);

  // Fetch tasks callback
  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      // Build query string
      const params = new URLSearchParams();
      if (search.trim()) params.append('search', search);
      if (status !== 'All') params.append('status', status);
      if (priority !== 'All') params.append('priority', priority);
      if (sort) params.append('sort', sort);

      const res = await axios.get(`/api/tasks?${params.toString()}`);
      if (res.data.success) {
        setTasks(res.data.data);
      }
    } catch (err) {
      console.error('Fetch tasks error:', err);
      setError(err.response?.data?.message || 'Could not fetch tasks');
    } finally {
      setLoading(false);
    }
  }, [search, status, priority, sort]);

  // Trigger fetch when parameters change
  useEffect(() => {
    // Add brief debounce for search keyup
    const delayDebounceFn = setTimeout(() => {
      fetchTasks();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [fetchTasks]);

  // Open modal in create mode
  const handleOpenCreateModal = () => {
    setTaskToEdit(null);
    setIsModalOpen(true);
  };

  // Open modal in edit mode
  const handleOpenEditModal = (task) => {
    setTaskToEdit(task);
    setIsModalOpen(true);
  };

  // Create or Update task handler
  const handleFormSubmit = async (payload) => {
    try {
      if (taskToEdit) {
        // Edit Mode
        const res = await axios.put(`/api/tasks/${taskToEdit._id}`, payload);
        if (res.data.success) {
          setIsModalOpen(false);
          fetchTasks();
        }
      } else {
        // Create Mode
        const res = await axios.post('/api/tasks', payload);
        if (res.data.success) {
          setIsModalOpen(false);
          fetchTasks();
        }
      }
    } catch (err) {
      console.error('Submit task error:', err);
      alert(err.response?.data?.message || 'Failed to save task');
    }
  };

  // Delete task handler
  const handleDeleteTask = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        const res = await axios.delete(`/api/tasks/${id}`);
        if (res.data.success) {
          fetchTasks();
        }
      } catch (err) {
        console.error('Delete task error:', err);
        alert(err.response?.data?.message || 'Failed to delete task');
      }
    }
  };

  // Status toggle handler (Complete / Uncomplete quick action)
  const handleStatusToggle = async (task) => {
    try {
      const nextStatus = task.status === 'Completed' ? 'Pending' : 'Completed';
      const res = await axios.put(`/api/tasks/${task._id}`, { status: nextStatus });
      if (res.data.success) {
        fetchTasks();
      }
    } catch (err) {
      console.error('Toggle status error:', err);
      alert(err.response?.data?.message || 'Failed to update status');
    }
  };

  return (
    <div className="dashboard-content">
      <div className="container">
        {/* Dashboard Header */}
        <div className="dashboard-header">
          <div className="dashboard-title">
            <h1>Task Management</h1>
            <p>Welcome! Streamline your daily checklist and stay organized.</p>
          </div>
          <button className="btn btn-primary" onClick={handleOpenCreateModal} style={{ width: 'auto' }}>
            <Plus size={18} />
            <span>Add Task</span>
          </button>
        </div>

        {/* Stats Section */}
        <StatsSection tasks={tasks} />

        {/* Filters Controls */}
        <div className="filter-bar">
          <div className="search-wrapper">
            <Search className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Search tasks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <div className="filter-select-wrapper">
              <span className="filter-label">Status</span>
              <select
                className="filter-select"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="All">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <div className="filter-select-wrapper">
              <span className="filter-label">Priority</span>
              <select
                className="filter-select"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="All">All Priorities</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            <div className="filter-select-wrapper">
              <span className="filter-label">Sort</span>
              <select
                className="filter-select"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
              >
                <option value="newest">Newest Created</option>
                <option value="oldest">Oldest Created</option>
                <option value="dueDateAsc">Due Date: Ascending</option>
                <option value="dueDateDesc">Due Date: Descending</option>
              </select>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {error && <div className="alert alert-danger">{error}</div>}

        {/* Tasks Grid or Empty State */}
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '5rem 0' }}>
            <div style={{
              width: '40px',
              height: '40px',
              border: '4px solid rgba(255, 255, 255, 0.1)',
              borderTop: '4px solid #6366f1',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}></div>
          </div>
        ) : tasks.length > 0 ? (
          <div className="tasks-grid">
            {tasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onEdit={handleOpenEditModal}
                onDelete={handleDeleteTask}
                onStatusToggle={handleStatusToggle}
              />
            ))}
          </div>
        ) : (
          <div className="no-tasks">
            <FolderHeart className="no-tasks-icon" />
            <div>
              <h3>No Tasks Found</h3>
              <p style={{ fontSize: '0.9rem', marginTop: '0.25rem' }}>
                Try modifying your search or filter keywords, or add a new task.
              </p>
            </div>
            <button className="btn btn-primary" onClick={handleOpenCreateModal} style={{ width: 'auto', marginTop: '0.5rem' }}>
              <Plus size={16} />
              <span>Add Your First Task</span>
            </button>
          </div>
        )}
      </div>

      {/* Task Modal form */}
      <TaskFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
        taskToEdit={taskToEdit}
      />
    </div>
  );
};

export default Dashboard;
