import React, { useState } from 'react';
import { useTickets } from '../context/TicketContext';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { formatDistanceToNow, format } from 'date-fns';
import './TicketDetail.css';

const STATUSES = ['open', 'in-progress', 'resolved', 'closed'];
const PRIORITIES = ['critical', 'high', 'medium', 'low'];

export default function TicketDetail({ ticketId, navigate }) {
  const { getTicket, updateTicket, addComment, deleteTicket } = useTickets();
  const { user, allUsers } = useAuth();
  const ticket = getTicket(ticketId);

  const [commentText, setCommentText] = useState('');
  const [commentCode, setCommentCode] = useState('');
  const [showCodeField, setShowCodeField] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({});

  if (!ticket) return (
    <div className="detail-notfound">
      <p>Ticket not found.</p>
      <button className="btn btn-ghost" onClick={() => navigate('dashboard')}>← Back</button>
    </div>
  );

  const reporter = allUsers.find(u => u.id === ticket.reporter);
  const assignee = ticket.assignee ? allUsers.find(u => u.id === ticket.assignee) : null;

  const handleComment = () => {
    if (!commentText.trim()) return;
    addComment(ticketId, user.id, commentText.trim(), commentCode.trim());
    setCommentText(''); setCommentCode(''); setShowCodeField(false);
  };

  const handleDelete = () => {
    if (window.confirm(`Delete ${ticket.id}? This cannot be undone.`)) {
      deleteTicket(ticketId);
      navigate('dashboard');
    }
  };

  const startEdit = () => {
    setEditData({
      title: ticket.title,
      description: ticket.description,
      status: ticket.status,
      priority: ticket.priority,
      type: ticket.type,
      assignee: ticket.assignee || '',
      labels: ticket.labels.join(', '),
      codeSnippet: ticket.codeSnippet || '',
    });
    setEditing(true);
  };

  const saveEdit = () => {
    updateTicket(ticketId, {
      ...editData,
      labels: editData.labels.split(',').map(l => l.trim()).filter(Boolean),
      assignee: editData.assignee || null,
    });
    setEditing(false);
  };

  return (
    <div className="detail-page">
      <Navbar navigate={navigate} />
      <div className="detail-body">
        <div className="detail-breadcrumb">
          <button className="breadcrumb-btn" onClick={() => navigate('dashboard')}>← Dashboard</button>
          <span className="breadcrumb-sep">/</span>
          <span className="breadcrumb-id">{ticket.id}</span>
        </div>

        <div className="detail-layout">
          {/* Main */}
          <div className="detail-main">
            {editing ? (
              <div className="edit-form fade-in">
                <h2 className="section-heading">Edit Ticket</h2>
                <div className="form-field">
                  <label>Title</label>
                  <input value={editData.title} onChange={e => setEditData(p => ({...p, title: e.target.value}))} />
                </div>
                <div className="form-field">
                  <label>Description</label>
                  <textarea rows={5} value={editData.description} onChange={e => setEditData(p => ({...p, description: e.target.value}))} />
                </div>
                <div className="form-row">
                  <div className="form-field">
                    <label>Status</label>
                    <select value={editData.status} onChange={e => setEditData(p => ({...p, status: e.target.value}))}>
                      {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="form-field">
                    <label>Priority</label>
                    <select value={editData.priority} onChange={e => setEditData(p => ({...p, priority: e.target.value}))}>
                      {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                  <div className="form-field">
                    <label>Type</label>
                    <select value={editData.type} onChange={e => setEditData(p => ({...p, type: e.target.value}))}>
                      {['bug','feature','task'].map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                </div>
                <div className="form-field">
                  <label>Assignee</label>
                  <select value={editData.assignee} onChange={e => setEditData(p => ({...p, assignee: e.target.value}))}>
                    <option value="">Unassigned</option>
                    {allUsers.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                  </select>
                </div>
                <div className="form-field">
                  <label>Labels (comma-separated)</label>
                  <input value={editData.labels} onChange={e => setEditData(p => ({...p, labels: e.target.value}))} />
                </div>
                <div className="form-field">
                  <label>Code Snippet</label>
                  <textarea rows={4} value={editData.codeSnippet} onChange={e => setEditData(p => ({...p, codeSnippet: e.target.value}))} placeholder="Paste relevant code..." style={{fontFamily: 'var(--font-mono)', fontSize: 12}} />
                </div>
                <div className="edit-actions">
                  <button className="btn btn-primary" onClick={saveEdit}>Save Changes</button>
                  <button className="btn btn-ghost" onClick={() => setEditing(false)}>Cancel</button>
                </div>
              </div>
            ) : (
              <div className="detail-content fade-in">
                <div className="detail-header">
                  <div className="detail-badges">
                    <span className={`badge type-${ticket.type}`}>{ticket.type}</span>
                    <span className={`badge priority-${ticket.priority}`}>{ticket.priority}</span>
                    <span className={`badge status-${ticket.status}`}>{ticket.status.replace('-', ' ')}</span>
                  </div>
                  <div className="detail-actions">
                    <button className="btn btn-ghost btn-sm" onClick={startEdit}>✎ Edit</button>
                    <button className="btn btn-danger btn-sm" onClick={handleDelete}>⌫ Delete</button>
                  </div>
                </div>

                <h1 className="detail-title">{ticket.title}</h1>
                <p className="detail-description">{ticket.description}</p>

                {ticket.codeSnippet && (
                  <div className="detail-code-section">
                    <div className="code-header">
                      <span className="code-label">⟨/⟩ Code Snippet</span>
                    </div>
                    <pre>{ticket.codeSnippet}</pre>
                  </div>
                )}
              </div>
            )}

            {/* Comments */}
            <div className="comments-section">
              <h3 className="section-heading">
                Discussion
                <span className="comment-count">{ticket.comments.length}</span>
              </h3>

              {ticket.comments.length === 0 && (
                <div className="no-comments">No comments yet. Start the discussion.</div>
              )}

              {ticket.comments.map(comment => {
                const author = allUsers.find(u => u.id === comment.userId);
                return (
                  <div key={comment.id} className="comment fade-in">
                    <div className={`avatar avatar-lg avatar-${author?.id}`}>{author?.avatar}</div>
                    <div className="comment-body">
                      <div className="comment-header">
                        <span className="comment-author">{author?.name}</span>
                        <span className="comment-role">{author?.role}</span>
                        <span className="comment-time">
                          {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                        </span>
                      </div>
                      <p className="comment-text">{comment.text}</p>
                      {comment.codeSnippet && <pre className="comment-code">{comment.codeSnippet}</pre>}
                    </div>
                  </div>
                );
              })}

              {/* New comment */}
              <div className="new-comment">
                <div className={`avatar avatar-lg avatar-${user.id}`}>{user.avatar}</div>
                <div className="new-comment-form">
                  <textarea
                    placeholder="Add a comment, investigation notes, or fix details..."
                    value={commentText}
                    onChange={e => setCommentText(e.target.value)}
                    rows={3}
                  />
                  {showCodeField && (
                    <textarea
                      placeholder="// Paste code snippet here..."
                      value={commentCode}
                      onChange={e => setCommentCode(e.target.value)}
                      rows={3}
                      style={{ fontFamily: 'var(--font-mono)', fontSize: 12, marginTop: 8 }}
                    />
                  )}
                  <div className="new-comment-actions">
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={() => setShowCodeField(!showCodeField)}
                    >
                      ⟨/⟩ {showCodeField ? 'Remove Code' : 'Add Code'}
                    </button>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={handleComment}
                      disabled={!commentText.trim()}
                    >
                      Comment
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="detail-sidebar">
            <div className="sidebar-card">
              <div className="sidebar-section">
                <div className="sidebar-label">Status</div>
                <select
                  className="sidebar-select"
                  value={ticket.status}
                  onChange={e => updateTicket(ticketId, { status: e.target.value })}
                >
                  {STATUSES.map(s => <option key={s} value={s}>{s.replace('-', ' ')}</option>)}
                </select>
              </div>

              <div className="sidebar-section">
                <div className="sidebar-label">Priority</div>
                <select
                  className="sidebar-select"
                  value={ticket.priority}
                  onChange={e => updateTicket(ticketId, { priority: e.target.value })}
                >
                  {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>

              <div className="sidebar-section">
                <div className="sidebar-label">Assignee</div>
                <select
                  className="sidebar-select"
                  value={ticket.assignee || ''}
                  onChange={e => updateTicket(ticketId, { assignee: e.target.value || null })}
                >
                  <option value="">Unassigned</option>
                  {allUsers.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                </select>
              </div>

              <div className="sidebar-divider"></div>

              <div className="sidebar-section">
                <div className="sidebar-label">Reporter</div>
                <div className="sidebar-user">
                  {reporter && (
                    <>
                      <div className={`avatar avatar-${reporter.id}`}>{reporter.avatar}</div>
                      <span>{reporter.name}</span>
                    </>
                  )}
                </div>
              </div>

              {assignee && (
                <div className="sidebar-section">
                  <div className="sidebar-label">Assigned To</div>
                  <div className="sidebar-user">
                    <div className={`avatar avatar-${assignee.id}`}>{assignee.avatar}</div>
                    <span>{assignee.name}</span>
                  </div>
                </div>
              )}

              <div className="sidebar-divider"></div>

              <div className="sidebar-section">
                <div className="sidebar-label">Created</div>
                <div className="sidebar-date">{format(new Date(ticket.createdAt), 'MMM d, yyyy HH:mm')}</div>
              </div>
              <div className="sidebar-section">
                <div className="sidebar-label">Updated</div>
                <div className="sidebar-date">{formatDistanceToNow(new Date(ticket.updatedAt), { addSuffix: true })}</div>
              </div>

              {ticket.labels.length > 0 && (
                <>
                  <div className="sidebar-divider"></div>
                  <div className="sidebar-section">
                    <div className="sidebar-label">Labels</div>
                    <div className="sidebar-labels">
                      {ticket.labels.map(l => <span key={l} className="label-chip">{l}</span>)}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
