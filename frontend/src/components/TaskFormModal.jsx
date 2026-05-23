import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const TaskFormModal = ({ isOpen, onClose, onSubmit, taskToEdit = null }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('Pending');
  const [priority, setPriority] = useState('Medium');
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState('');

  // Pre-fill form values if editing
  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title || '');
      setDescription(taskToEdit.description || '');
      setStatus(taskToEdit.status || 'Pending');
      setPriority(taskToEdit.priority || 'Medium');
      // Format date to YYYY-MM-DD for date input
      if (taskToEdit.dueDate) {
        const date = new Date(taskToEdit.dueDate);
        const formattedDate = date.toISOString().split('T')[0];
        setDueDate(formattedDate);
      } else {
        setDueDate('');
      }
    } else {
      // Reset form values if adding new task
      setTitle('');
      setDescription('');
      setStatus('Pending');
      setPriority('Medium');
      setDueDate('');
    }
    setError('');
  }, [taskToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Field Validations
    if (!title.trim()) {
      setError('Task title is required');
      return;
    }
    if (!dueDate) {
      setError('Due date is required');
      return;
    }

    const taskPayload = {
      title: title.trim(),
      description: description.trim(),
      status,
      priority,
      dueDate,
    };

    onSubmit(taskPayload);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{taskToEdit ? 'Edit Task' : 'Create New Task'}</h2>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && <div className="alert alert-danger">{error}</div>}

            <div className="form-group">
              <label className="form-label">Title</label>
              <input
                type="text"
                className="form-input"
                style={{ paddingLeft: '1rem' }}
                placeholder="Enter task title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                className="form-input"
                style={{ paddingLeft: '1rem', minHeight: '100px', resize: 'vertical' }}
                placeholder="Enter task description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Status</label>
                <select
                  className="filter-select"
                  style={{ width: '100%' }}
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Priority</label>
                <select
                  className="filter-select"
                  style={{ width: '100%' }}
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Due Date</label>
              <input
                type="date"
                className="form-input"
                style={{ paddingLeft: '1rem' }}
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" style={{ width: 'auto' }} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" style={{ width: 'auto' }}>
              {taskToEdit ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskFormModal;
