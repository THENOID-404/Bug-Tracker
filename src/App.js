import React, { useState } from 'react';
import { TicketProvider } from './context/TicketContext';
import { AuthProvider } from './context/AuthContext';
import Dashboard from './pages/Dashboard';
import TicketDetail from './pages/TicketDetail';
import NewTicket from './pages/NewTicket';
import Login from './pages/Login';
import { useAuth } from './context/AuthContext';
import './App.css';

function AppRoutes() {
  const { user } = useAuth();
  const [view, setView] = useState('dashboard'); // dashboard | new | detail
  const [selectedTicketId, setSelectedTicketId] = useState(null);

  if (!user) return <Login />;

  const navigate = (page, ticketId = null) => {
    setView(page);
    setSelectedTicketId(ticketId);
  };

  return (
    <div className="app">
      {view === 'dashboard' && <Dashboard navigate={navigate} />}
      {view === 'new' && <NewTicket navigate={navigate} />}
      {view === 'detail' && <TicketDetail ticketId={selectedTicketId} navigate={navigate} />}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <TicketProvider>
        <AppRoutes />
      </TicketProvider>
    </AuthProvider>
  );
}

export default App;
