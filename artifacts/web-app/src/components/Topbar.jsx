import React from 'react';
import { useApp } from '../AppContext';

export default function Topbar({ title }) {
  const { searchQuery, setSearchQuery } = useApp();
  return (
    <header className="topbar">
      <h1 className="topbar-title">{title}</h1>
      <div className="topbar-actions">
        <div className="search-bar">
          <span className="search-icon">🔍</span>
          <input
            id="global-search"
            type="text"
            placeholder="Search courses, reels, creators…"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="avatar-btn" title="My Profile">AT</div>
      </div>
    </header>
  );
}
