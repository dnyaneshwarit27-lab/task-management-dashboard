import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, CheckSquare, User } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();

  if (!user) return null;

  // Get initial character from user name for profile avatar
  const getAvatarChar = () => {
    return user.name ? user.name.charAt(0).toUpperCase() : <User size={16} />;
  };

  return (
    <nav className="navbar">
      <div className="container navbar-content">
        <div className="navbar-brand">
          <CheckSquare size={24} color="#6366f1" />
          <span>Spaciact</span>
        </div>
        <div className="navbar-user">
          <div className="user-info">
            <div className="user-avatar">{getAvatarChar()}</div>
            <span className="user-name">{user.name}</span>
          </div>
          <button onClick={logout} className="btn btn-icon" title="Log Out">
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
