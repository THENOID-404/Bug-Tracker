import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './Login.css';

export default function Login() {
  const { login, allUsers } = useAuth();
  const [error, setError] = useState('');

  const handleLogin = (email) => {
    const ok = login(email);
    if (!ok) setError('User not found');
  };

  return (
    <div className="login-page">
      <div className="login-bg">
        <div className="login-grid"></div>
      </div>
      <div className="login-card fade-in">
        <div className="login-logo">
          <span className="login-logo-icon">⬡</span>
          <span className="login-logo-text">BugTracker</span>
          <span className="login-logo-tag">v2.1.0</span>
        </div>
        <h1 className="login-title">Developer Portal</h1>
        <p className="login-sub">Select your profile to continue</p>

        <div className="login-users">
          {allUsers.map(user => (
            <button
              key={user.id}
              className="login-user-btn"
              onClick={() => handleLogin(user.email)}
            >
              <div className={`avatar avatar-lg avatar-${user.id}`}>{user.avatar}</div>
              <div className="login-user-info">
                <div className="login-user-name">{user.name}</div>
                <div className="login-user-role">{user.role}</div>
              </div>
              <span className="login-user-arrow">→</span>
            </button>
          ))}
        </div>

        {error && <div className="login-error">{error}</div>}

        <div className="login-footer">
          <span className="login-footer-dot"></span>
          Demo environment — no credentials required
        </div>
      </div>
    </div>
  );
}
