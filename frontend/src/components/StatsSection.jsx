import React from 'react';
import { Layers, Clock, Play, CheckCircle } from 'lucide-react';

const StatsSection = ({ tasks = [] }) => {
  const total = tasks.length;
  const pending = tasks.filter((t) => t.status === 'Pending').length;
  const inProgress = tasks.filter((t) => t.status === 'In Progress').length;
  const completed = tasks.filter((t) => t.status === 'Completed').length;

  const completionPercentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  const stats = [
    {
      label: 'Total Tasks',
      value: total,
      icon: <Layers size={22} color="#818cf8" />,
      bg: 'rgba(99, 102, 241, 0.1)',
      border: 'rgba(99, 102, 241, 0.2)',
    },
    {
      label: 'Pending',
      value: pending,
      icon: <Clock size={22} color="#fb7185" />,
      bg: 'rgba(251, 113, 123, 0.1)',
      border: 'rgba(251, 113, 123, 0.2)',
    },
    {
      label: 'In Progress',
      value: inProgress,
      icon: <Play size={22} color="#fbbf24" />,
      bg: 'rgba(251, 191, 36, 0.1)',
      border: 'rgba(251, 191, 36, 0.2)',
    },
    {
      label: 'Completed',
      value: completed,
      icon: <CheckCircle size={22} color="#34d399" />,
      bg: 'rgba(52, 211, 153, 0.1)',
      border: 'rgba(52, 211, 153, 0.2)',
    },
  ];

  return (
    <div style={{ marginBottom: '2rem' }}>
      <div className="stats-grid">
        {stats.map((stat, idx) => (
          <div key={idx} className="stat-card">
            <div
              className="stat-icon-wrapper"
              style={{
                backgroundColor: stat.bg,
                border: `1px solid ${stat.border}`,
              }}
            >
              {stat.icon}
            </div>
            <div className="stat-info">
              <span className="stat-value">{stat.value}</span>
              <span className="stat-label">{stat.label}</span>
            </div>
          </div>
        ))}
      </div>

      {total > 0 && (
        <div style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-md)',
          padding: '1.25rem 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
            <span style={{ color: 'var(--text-secondary)', fontWeight: '500' }}>Overall Progress</span>
            <span style={{ color: '#818cf8', fontWeight: '600' }}>{completionPercentage}% Completed</span>
          </div>
          <div style={{
            width: '100%',
            height: '8px',
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: 'var(--radius-full)',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${completionPercentage}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #6366f1, #34d399)',
              borderRadius: 'var(--radius-full)',
              transition: 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
            }}></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatsSection;
