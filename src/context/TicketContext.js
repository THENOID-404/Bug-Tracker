import React, { createContext, useContext, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

const TicketContext = createContext();

const INITIAL_TICKETS = [
  {
    id: 'TKT-001',
    title: 'Auth token expires too early on mobile clients',
    description: 'Users on mobile are being logged out after ~10 minutes of inactivity. The token TTL seems to be ignored on the mobile API path. Reproducible on iOS Safari and Android Chrome.',
    status: 'in-progress',
    priority: 'critical',
    type: 'bug',
    assignee: 'u2',
    reporter: 'u1',
    labels: ['auth', 'mobile', 'api'],
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 3600000).toISOString(),
    comments: [
      { id: 'c1', userId: 'u1', text: 'Confirmed on my end. Looks like the refresh token endpoint is returning 401.', createdAt: new Date(Date.now() - 86400000 * 2).toISOString() },
      { id: 'c2', userId: 'u2', text: 'Found the issue — mobile middleware was stripping the Authorization header. Fix in progress.', createdAt: new Date(Date.now() - 3600000).toISOString() },
    ],
    codeSnippet: `// middleware/auth.js - Bug is here
const token = req.headers['x-auth-token']; // Should be Authorization header
// Should be: req.headers['authorization']?.split(' ')[1]`,
  },
  {
    id: 'TKT-002',
    title: 'Dashboard chart renders blank on Firefox 119+',
    description: 'The analytics chart on the main dashboard shows blank/white after upgrading Firefox to v119. Works fine in Chrome and Safari. Possibly a Canvas API issue.',
    status: 'open',
    priority: 'high',
    type: 'bug',
    assignee: 'u3',
    reporter: 'u3',
    labels: ['ui', 'browser-compat', 'charts'],
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    updatedAt: new Date(Date.now() - 7200000).toISOString(),
    comments: [
      { id: 'c3', userId: 'u3', text: 'Reproduced. The issue seems related to the OffscreenCanvas polyfill.', createdAt: new Date(Date.now() - 7200000).toISOString() },
    ],
    codeSnippet: '',
  },
  {
    id: 'TKT-003',
    title: 'Add dark mode toggle to settings page',
    description: 'Users have been requesting a dark mode option. Need to implement a theme toggle in the settings panel that persists across sessions via localStorage.',
    status: 'open',
    priority: 'medium',
    type: 'feature',
    assignee: null,
    reporter: 'u1',
    labels: ['ui', 'ux', 'settings'],
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    comments: [],
    codeSnippet: '',
  },
  {
    id: 'TKT-004',
    title: 'DB connection pool exhausted under load',
    description: 'Under concurrent load tests (~500 req/s), the Postgres connection pool maxes out and new requests hang. Pool size is currently set to 10. Need to investigate optimal pool sizing and add connection queuing.',
    status: 'resolved',
    priority: 'critical',
    type: 'bug',
    assignee: 'u4',
    reporter: 'u2',
    labels: ['database', 'performance', 'infra'],
    createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    comments: [
      { id: 'c4', userId: 'u4', text: 'Increased pool size to 50 and added PgBouncer. Tested at 1k req/s — stable.', createdAt: new Date(Date.now() - 86400000).toISOString() },
    ],
    codeSnippet: `# docker-compose.yml fix
environment:
  DB_POOL_SIZE: 50  # Was 10
  DB_POOL_TIMEOUT: 30`,
  },
  {
    id: 'TKT-005',
    title: 'CI pipeline fails intermittently on test:unit step',
    description: 'The GitHub Actions CI pipeline fails about 20% of the time on the unit test step with a timeout error. Flaky tests suspected in the UserService test suite. Needs investigation.',
    status: 'open',
    priority: 'low',
    type: 'task',
    assignee: 'u1',
    reporter: 'u4',
    labels: ['ci', 'testing', 'devops'],
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    comments: [],
    codeSnippet: '',
  },
];

export function TicketProvider({ children }) {
  const [tickets, setTickets] = useState(INITIAL_TICKETS);

  const addTicket = (ticket) => {
    const id = `TKT-${String(tickets.length + 1).padStart(3, '0')}`;
    const newTicket = {
      ...ticket,
      id,
      comments: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setTickets(prev => [newTicket, ...prev]);
    return id;
  };

  const updateTicket = (id, updates) => {
    setTickets(prev => prev.map(t =>
      t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t
    ));
  };

  const deleteTicket = (id) => {
    setTickets(prev => prev.filter(t => t.id !== id));
  };

  const addComment = (ticketId, userId, text, codeSnippet = '') => {
    const comment = {
      id: uuidv4(),
      userId,
      text,
      codeSnippet,
      createdAt: new Date().toISOString(),
    };
    setTickets(prev => prev.map(t =>
      t.id === ticketId
        ? { ...t, comments: [...t.comments, comment], updatedAt: new Date().toISOString() }
        : t
    ));
  };

  const getTicket = (id) => tickets.find(t => t.id === id);

  return (
    <TicketContext.Provider value={{ tickets, addTicket, updateTicket, deleteTicket, addComment, getTicket }}>
      {children}
    </TicketContext.Provider>
  );
}

export const useTickets = () => useContext(TicketContext);
