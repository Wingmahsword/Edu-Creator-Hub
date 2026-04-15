import React, { useState } from 'react';
import { AppProvider, useApp } from './AppContext';
import Home from './pages/Home';
import Courses from './pages/Courses';
import Reels from './pages/Reels';
import Creators from './pages/Creators';
import Playground from './pages/Playground';
import Profile from './pages/Profile';
import Toast from './components/Toast';

const PAGES = {
  home: Home,
  courses: Courses,
  reels: Reels,
  creators: Creators,
  playground: Playground,
  profile: Profile,
};

function Navigation({ activePage, setActivePage }) {
  const { coins } = useApp();
  
  return (
    <nav className="nav">
      <div className="nav-logo" onClick={() => setActivePage('home')}>
        EDUHUB<span>.</span>
      </div>
      <div className="nav-links">
        <button className={`nav-link ${activePage === 'home' ? 'active' : ''}`} onClick={() => setActivePage('home')}>Home</button>
        <button className={`nav-link ${activePage === 'courses' ? 'active' : ''}`} onClick={() => setActivePage('courses')}>Courses</button>
        <button className={`nav-link ${activePage === 'reels' ? 'active' : ''}`} onClick={() => setActivePage('reels')}>Reels</button>
        <button className={`nav-link ${activePage === 'creators' ? 'active' : ''}`} onClick={() => setActivePage('creators')}>Creators</button>
        <button className={`nav-link ${activePage === 'playground' ? 'active' : ''}`} onClick={() => setActivePage('playground')}>Playground</button>
      </div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div className="nav-coin">
          EDUCOINS <strong>{coins.toLocaleString()}</strong>
        </div>
        <button className={`nav-contact ${activePage === 'profile' ? 'active' : ''}`} onClick={() => setActivePage('profile')}>PROFILE</button>
      </div>
    </nav>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div>
          <div className="footer-logo">EDUHUB.</div>
          <p className="footer-tagline">The editorial AI learning platform. World-class courses designed with precision.</p>
        </div>
        <div>
          <div className="footer-col-title">LEARN</div>
          <div className="footer-links">
            <span className="footer-link">Machine Learning</span>
            <span className="footer-link">Deep Learning</span>
            <span className="footer-link">Prompt Engineering</span>
          </div>
        </div>
        <div>
          <div className="footer-col-title">COMPANY</div>
          <div className="footer-links">
            <span className="footer-link">About</span>
            <span className="footer-link">Principles</span>
            <span className="footer-link">Contact</span>
          </div>
        </div>
        <div>
          <div className="footer-col-title">SOCIAL</div>
          <div className="footer-links">
            <span className="footer-link">X / Twitter</span>
            <span className="footer-link">Instagram</span>
            <span className="footer-link">LinkedIn</span>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="footer-copy">© 2024 EDUHUB — ALL RIGHTS RESERVED</div>
        <div className="footer-coins">SECURE COIN SYSTEM ALPHA 0.2</div>
      </div>
    </footer>
  );
}

export default function App() {
  const [activePage, setActivePage] = useState('home');
  const Page = PAGES[activePage] || Home;

  return (
    <AppProvider>
      <div className="page-wrapper">
        <Navigation activePage={activePage} setActivePage={setActivePage} />
        <main className="animate-fade-up">
          <Page />
        </main>
        <Footer />
      </div>
      <Toast />
    </AppProvider>
  );
}
