import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

const DEMO_USERS = [
  { id: 'u1', name: 'Ravi More', email: 'ravi@dev.io', avatar: 'RM', role: 'Senior Dev' },
  { id: 'u2', name: 'Radha Thakrey', email: 'radha@dev.io', avatar: 'RT', role: 'Backend Dev' },
  { id: 'u3', name: 'Mahesh Gouda', email: 'mahesh@dev.io', avatar: 'MG', role: 'Frontend Dev' },
  { id: 'u4', name: 'Sam patric', email: 'sam@dev.io', avatar: 'SP', role: 'DevOps Engineer' },
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
