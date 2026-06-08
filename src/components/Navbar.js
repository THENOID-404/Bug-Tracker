import React from 'react';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

export default function Navbar({ navigate }) {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <button className="navbar-brand" onClick={() => navigate('dashboard')}>
          <span className="navbar-icon">⬡</span>
          <span className="navbar-name">BugTracker</span>
          <span className="navbar-ver">v2.1.0</span>
        </button>

        <div className="navbar-center">
          <button className="navbar-link active" onClick={() => navigate('dashboard')}>
            ◈ Dashboard
          </button>
        </div>

        <div className="navbar-right">
          <button className="btn btn-primary btn-sm" onClick={() => navigate('new')}>
            + New Ticket
          </button>
          <div className="navbar-user">
            <div className={`avatar avatar-${user.id}`}>{user.avatar}</div>
            <div className="navbar-user-info">
              <span className="navbar-user-name">{user.name}</span>
              <span className="navbar-user-role">{user.role}</span>
            </div>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={logout} title="Logout">
            ⎋ Exit
          </button>
        </div>
      </div>
    </nav>
  );
}
