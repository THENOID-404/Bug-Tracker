import React from 'react';
import { useAuth } from '../context/AuthContext';
import { formatDistanceToNow } from 'date-fns';
import './TicketCard.css';

export default function TicketCard({ ticket, onClick }) {
  const { allUsers } = useAuth();
  const assignee = ticket.assignee ? allUsers.find(u => u.id === ticket.assignee) : null;
  const reporter = allUsers.find(u => u.id === ticket.reporter);
  const timeAgo = formatDistanceToNow(new Date(ticket.updatedAt), { addSuffix: true });

  return (
    <div className="ticket-card" onClick={onClick}>
      <div className="ticket-card-left">
        <div className="ticket-card-header">
          <span className="ticket-id">{ticket.id}</span>
          <span className={`badge type-${ticket.type}`}>{ticket.type}</span>
          <span className={`badge priority-${ticket.priority}`}>
            {ticket.priority === 'critical' && '⚡ '}
            {ticket.priority}
          </span>
          <span className={`badge status-${ticket.status}`}>{ticket.status.replace('-', ' ')}</span>
        </div>
        <div className="ticket-title">{ticket.title}</div>
        <div className="ticket-meta">
          <span className="ticket-meta-item">
            {reporter && (
              <>
                <div className={`avatar avatar-${reporter.id}`} style={{ width: 16, height: 16, fontSize: 8 }}>{reporter.avatar}</div>
                {reporter.name}
              </>
            )}
          </span>
          <span className="ticket-meta-sep">·</span>
          <span className="ticket-meta-item">{timeAgo}</span>
          {ticket.comments.length > 0 && (
            <>
              <span className="ticket-meta-sep">·</span>
              <span className="ticket-meta-item">💬 {ticket.comments.length}</span>
            </>
          )}
          {ticket.codeSnippet && (
            <>
              <span className="ticket-meta-sep">·</span>
              <span className="ticket-meta-item">⟨/⟩ code</span>
            </>
          )}
        </div>
        {ticket.labels.length > 0 && (
          <div className="ticket-labels">
            {ticket.labels.map(l => <span key={l} className="label-chip">{l}</span>)}
          </div>
        )}
      </div>

      <div className="ticket-card-right">
        {assignee ? (
          <div className="ticket-assignee" title={`Assigned to ${assignee.name}`}>
            <div className={`avatar avatar-${assignee.id}`}>{assignee.avatar}</div>
          </div>
        ) : (
          <div className="ticket-unassigned" title="Unassigned">
            <div className="avatar unassigned-avatar">—</div>
          </div>
        )}
        <span className="ticket-arrow">›</span>
      </div>
    </div>
  );
}
