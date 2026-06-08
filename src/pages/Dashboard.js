import React, { useState, useMemo } from 'react';
import { useTickets } from '../context/TicketContext';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import TicketCard from '../components/TicketCard';
import StatsBar from '../components/StatsBar';
import './Dashboard.css';

const STATUSES = ['all', 'open', 'in-progress', 'resolved', 'closed'];
const PRIORITIES = ['all', 'critical', 'high', 'medium', 'low'];
const TYPES = ['all', 'bug', 'feature', 'task'];

export default function Dashboard({ navigate }) {
  const { tickets } = useTickets();
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [assigneeFilter, setAssigneeFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  const filtered = useMemo(() => {
    let result = [...tickets];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(t =>
        t.title.toLowerCase().includes(q) ||
        t.id.toLowerCase().includes(q) ||
        t.labels.some(l => l.includes(q))
      );
    }
    if (statusFilter !== 'all') result = result.filter(t => t.status === statusFilter);
    if (priorityFilter !== 'all') result = result.filter(t => t.priority === priorityFilter);
    if (typeFilter !== 'all') result = result.filter(t => t.type === typeFilter);
    if (assigneeFilter === 'me') result = result.filter(t => t.assignee === user.id);
    if (assigneeFilter === 'unassigned') result = result.filter(t => !t.assignee);

    result.sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
      if (sortBy === 'priority') {
        const order = { critical: 0, high: 1, medium: 2, low: 3 };
        return order[a.priority] - order[b.priority];
      }
      if (sortBy === 'updated') return new Date(b.updatedAt) - new Date(a.updatedAt);
      return 0;
    });
    return result;
  }, [tickets, search, statusFilter, priorityFilter, typeFilter, assigneeFilter, sortBy, user.id]);

  const clearFilters = () => {
    setSearch(''); setStatusFilter('all'); setPriorityFilter('all');
    setTypeFilter('all'); setAssigneeFilter('all'); setSortBy('newest');
  };

  const hasFilters = search || statusFilter !== 'all' || priorityFilter !== 'all' ||
    typeFilter !== 'all' || assigneeFilter !== 'all';

  return (
    <div className="dashboard">
      <Navbar navigate={navigate} />
      <StatsBar tickets={tickets} />

      <div className="dashboard-body">
        <div className="toolbar">
          <div className="toolbar-left">
            <div className="search-wrap">
              <span className="search-icon">⌕</span>
              <input
                className="search-input"
                placeholder="Search tickets, IDs, labels..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              {search && (
                <button className="search-clear" onClick={() => setSearch('')}>×</button>
              )}
            </div>

            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="filter-select">
              {STATUSES.map(s => <option key={s} value={s}>{s === 'all' ? 'All Status' : s.charAt(0).toUpperCase() + s.slice(1).replace('-', ' ')}</option>)}
            </select>

            <select value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)} className="filter-select">
              {PRIORITIES.map(p => <option key={p} value={p}>{p === 'all' ? 'All Priority' : p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
            </select>

            <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="filter-select">
              {TYPES.map(t => <option key={t} value={t}>{t === 'all' ? 'All Types' : t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
            </select>

            <select value={assigneeFilter} onChange={e => setAssigneeFilter(e.target.value)} className="filter-select">
              <option value="all">All Assignees</option>
              <option value="me">Assigned to Me</option>
              <option value="unassigned">Unassigned</option>
            </select>

            {hasFilters && (
              <button className="btn btn-ghost btn-sm" onClick={clearFilters}>Clear</button>
            )}
          </div>

          <div className="toolbar-right">
            <span className="ticket-count">{filtered.length} ticket{filtered.length !== 1 ? 's' : ''}</span>
            <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="filter-select">
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="priority">By priority</option>
              <option value="updated">Recently updated</option>
            </select>
            <button className="btn btn-primary btn-sm" onClick={() => navigate('new')}>
              + New Ticket
            </button>
          </div>
        </div>

        <div className="tickets-list">
          {filtered.length === 0 ? (
            <div className="empty-state fade-in">
              <div className="empty-icon">◎</div>
              <div className="empty-text">No tickets match your filters</div>
              <button className="btn btn-ghost btn-sm" onClick={clearFilters}>Clear filters</button>
            </div>
          ) : (
            filtered.map((ticket, i) => (
              <div key={ticket.id} style={{ animationDelay: `${i * 0.03}s` }} className="fade-in">
                <TicketCard ticket={ticket} onClick={() => navigate('detail', ticket.id)} />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
