import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

const DEMO_USERS = [
  { id: 'u1', name: 'Ravi More', email: 'ravi@dev.io', avatar: 'RM', role: 'Senior Dev' },
  { id: 'u2', name: 'Maya Patel', email: 'maya@dev.io', avatar: 'MP', role: 'Backend Dev' },
  { id: 'u3', name: 'Jordan Kim', email: 'jordan@dev.io', avatar: 'JK', role: 'Frontend Dev' },
  { id: 'u4', name: 'Sam Torres', email: 'sam@dev.io', avatar: 'ST', role: 'DevOps' },
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = (email) => {
    const found = DEMO_USERS.find(u => u.email === email);
    if (found) { setUser(found); return true; }
    return false;
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout, allUsers: DEMO_USERS }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
