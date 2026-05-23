import React from 'react';
import { Pencil, Trash2, Calendar, CheckCircle2, Circle } from 'lucide-react';

const TaskCard = ({ task, onEdit, onDelete, onStatusToggle }) => {
  const { _id, title, description, status, priority, dueDate } = task;

  // Format the due date cleanly
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Determine if task is overdue (due date is in past and status is not completed)
  const isOverdue = () => {
    if (!dueDate || status === 'Completed') return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const taskDate = new Date(dueDate);
    return taskDate < today;
  };

  // Generate CSS class modifiers based on task status
  const getStatusClass = () => {
    switch (status) {
      case 'In Progress': return 'in-progress';
      case 'Completed': return 'completed';
      default: return 'pending';
    }
  };

  return (
    <div className={`task-card ${getStatusClass()}`}>
      <div className="task-card-header">
        <div className="task-card-badges">
          <span className={`badge badge-status-${status.toLowerCase().replace(' ', '')}`}>
            {status}
          </span>
          <span className={`badge badge-priority-${priority.toLowerCase()}`}>
            {priority}
          </span>
        </div>
        <div className="task-actions">
          <button
            onClick={() => onEdit(task)}
            className="btn-icon"
            style={{ padding: '0.35rem', borderRadius: '4px' }}
            title="Edit Task"
          >
            <Pencil size={14} />
          </button>
          <button
            onClick={() => onDelete(_id)}
            className="btn-icon"
            style={{ padding: '0.35rem', borderRadius: '4px', color: '#f87171', background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.1)' }}
            title="Delete Task"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      <div className="task-card-body">
        <h3 className="task-card-title">{title}</h3>
        {description && <p className="task-card-description">{description}</p>}
      </div>

      <div className="task-card-footer">
        <div className={`task-due-date ${isOverdue() ? 'overdue' : ''}`}>
          <Calendar size={14} />
          <span>{isOverdue() ? 'Overdue: ' : 'Due: '}{formatDate(dueDate)}</span>
        </div>

        <div
          className="task-card-status-toggle"
          onClick={() => onStatusToggle(task)}
          title={status === 'Completed' ? 'Mark as Pending' : 'Mark as Completed'}
        >
          {status === 'Completed' ? (
            <>
              <CheckCircle2 size={16} color="#34d399" />
              <span style={{ color: '#34d399', fontWeight: '500' }}>Done</span>
            </>
          ) : (
            <>
              <Circle size={16} color="var(--text-muted)" />
              <span>Complete</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
