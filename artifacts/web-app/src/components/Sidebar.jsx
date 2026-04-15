import React from 'react';
import { useApp } from '../AppContext';

const NAV_ITEMS = [
  { id: 'home',       icon: '🏠', label: 'Home' },
  { id: 'courses',    icon: '📚', label: 'Courses' },
  { id: 'reels',      icon: '🎬', label: 'AI Reels' },
  { id: 'creators',   icon: '👥', label: 'Creators' },
  { id: 'playground', icon: '🤖', label: 'Playground', badge: 'AI' },
  { id: 'profile',    icon: '👤', label: 'Profile' },
];

export default function Sidebar({ activePage, setActivePage }) {
  const { coins } = useApp();
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-mark">
          <div className="logo-icon">E</div>
          <div className="logo-text"><span>EduHub</span></div>
        </div>
      </div>

      <nav className="sidebar-nav">
        {NAV_ITEMS.map(item => (
          <div
            key={item.id}
            id={`nav-${item.id}`}
            className={`nav-item${activePage === item.id ? ' active' : ''}`}
            onClick={() => setActivePage(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span>{item.label}</span>
            {item.badge && <span className="nav-badge">{item.badge}</span>}
          </div>
        ))}
      </nav>

      <div className="sidebar-coins">
        <span className="coins-icon">🪙</span>
        <div>
          <div className="coins-value">{coins.toLocaleString()}</div>
          <div className="coins-label">EduCoins</div>
        </div>
      </div>
    </aside>
  );
}
