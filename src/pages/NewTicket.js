import React, { useState } from 'react';
import { useTickets } from '../context/TicketContext';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import './NewTicket.css';

export default function NewTicket({ navigate }) {
  const { addTicket } = useTickets();
  const { user, allUsers } = useAuth();
  const [form, setForm] = useState({
    title: '',
    description: '',
    priority: 'medium',
    type: 'bug',
    status: 'open',
    assignee: '',
    labels: '',
    codeSnippet: '',
  });
  const [errors, setErrors] = useState({});

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = 'Title is required';
    if (!form.description.trim()) e.description = 'Description is required';
    return e;
  };

  const handleSubmit = () => {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    const id = addTicket({
      ...form,
      labels: form.labels.split(',').map(l => l.trim()).filter(Boolean),
      assignee: form.assignee || null,
      reporter: user.id,
    });
    navigate('detail', id);
  };

  return (
    <div className="new-ticket-page">
      <Navbar navigate={navigate} />
      <div className="new-ticket-body">
        <div className="new-ticket-header">
          <button className="breadcrumb-btn" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: 12 }} onClick={() => navigate('dashboard')}>
            ← Back to Dashboard
          </button>
        </div>

        <div className="new-ticket-card fade-in">
          <h1 className="new-ticket-title">Create New Ticket</h1>
          <p className="new-ticket-sub">Report a bug, request a feature, or create a task.</p>

          <div className="nt-form">
            <div className="form-field">
              <label>Title *</label>
              <input
                value={form.title}
                onChange={e => set('title', e.target.value)}
                placeholder="Brief, descriptive title..."
                className={errors.title ? 'input-error' : ''}
              />
              {errors.title && <span className="field-error">{errors.title}</span>}
            </div>

            <div className="form-field">
              <label>Description *</label>
              <textarea
                rows={5}
                value={form.description}
                onChange={e => set('description', e.target.value)}
                placeholder="Describe the issue in detail — what happened, expected vs actual behavior, steps to reproduce..."
                className={errors.description ? 'input-error' : ''}
              />
              {errors.description && <span className="field-error">{errors.description}</span>}
            </div>

            <div className="nt-row">
              <div className="form-field">
                <label>Type</label>
                <select value={form.type} onChange={e => set('type', e.target.value)}>
                  <option value="bug">🐛 Bug</option>
                  <option value="feature">✨ Feature</option>
                  <option value="task">📋 Task</option>
                </select>
              </div>
              <div className="form-field">
                <label>Priority</label>
                <select value={form.priority} onChange={e => set('priority', e.target.value)}>
                  <option value="critical">⚡ Critical</option>
                  <option value="high">🔴 High</option>
                  <option value="medium">🟡 Medium</option>
                  <option value="low">🔵 Low</option>
                </select>
              </div>
              <div className="form-field">
                <label>Assignee</label>
                <select value={form.assignee} onChange={e => set('assignee', e.target.value)}>
                  <option value="">Unassigned</option>
                  {allUsers.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                </select>
              </div>
            </div>

            <div className="form-field">
              <label>Labels (comma-separated)</label>
              <input
                value={form.labels}
                onChange={e => set('labels', e.target.value)}
                placeholder="e.g. auth, mobile, api, ui"
              />
            </div>

            <div className="form-field">
              <label>Code Snippet (optional)</label>
              <textarea
                rows={4}
                value={form.codeSnippet}
                onChange={e => set('codeSnippet', e.target.value)}
                placeholder="// Paste relevant code, error logs, or stack traces..."
                style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}
              />
            </div>

            <div className="nt-actions">
              <button className="btn btn-primary" onClick={handleSubmit}>
                Create Ticket
              </button>
              <button className="btn btn-ghost" onClick={() => navigate('dashboard')}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
