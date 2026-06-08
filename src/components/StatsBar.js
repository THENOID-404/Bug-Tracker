import React from 'react';
import './StatsBar.css';

export default function StatsBar({ tickets }) {
  const open = tickets.filter(t => t.status === 'open').length;
  const inProgress = tickets.filter(t => t.status === 'in-progress').length;
  const resolved = tickets.filter(t => t.status === 'resolved').length;
  const critical = tickets.filter(t => t.priority === 'critical' && t.status !== 'resolved' && t.status !== 'closed').length;

  return (
    <div className="stats-bar">
      <div className="stats-inner">
        <div className="stat-item">
          <span className="stat-value">{tickets.length}</span>
          <span className="stat-label">Total</span>
        </div>
        <div className="stat-divider"></div>
        <div className="stat-item">
          <span className="stat-value accent">{open}</span>
          <span className="stat-label">Open</span>
        </div>
        <div className="stat-divider"></div>
        <div className="stat-item">
          <span className="stat-value purple">{inProgress}</span>
          <span className="stat-label">In Progress</span>
        </div>
        <div className="stat-divider"></div>
        <div className="stat-item">
          <span className="stat-value green">{resolved}</span>
          <span className="stat-label">Resolved</span>
        </div>
        <div className="stat-divider"></div>
        <div className="stat-item">
          <span className={`stat-value ${critical > 0 ? 'red' : ''}`}>{critical}</span>
          <span className="stat-label">Critical</span>
        </div>

        <div className="stats-bar-chart">
          {tickets.length > 0 && (
            <>
              <div className="bar-seg open" style={{ width: `${(open / tickets.length) * 100}%` }} title={`Open: ${open}`}></div>
              <div className="bar-seg in-progress" style={{ width: `${(inProgress / tickets.length) * 100}%` }} title={`In Progress: ${inProgress}`}></div>
              <div className="bar-seg resolved" style={{ width: `${(resolved / tickets.length) * 100}%` }} title={`Resolved: ${resolved}`}></div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
