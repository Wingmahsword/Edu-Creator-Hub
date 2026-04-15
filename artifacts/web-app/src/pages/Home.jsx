import React from 'react';
import { useApp } from '../AppContext';
import CourseCard from '../components/CourseCard';
import ReelCard from '../components/ReelCard';
import CreatorCard from '../components/CreatorCard';

export default function Home() {
  const { courses, reels, creators, hasClaimedWelcome, claimWelcomeBonus } = useApp();

  return (
    <div className="page-wrapper">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-eyebrow">The Editorial AI Platform</div>
        <div className="echo-stack">
          <span className="echo-bg echo-bg-4">LEARNING.</span>
          <span className="echo-bg echo-bg-3">LEARNING.</span>
          <span className="echo-bg echo-bg-2">LEARNING.</span>
          <span className="echo-bg echo-bg-1">LEARNING.</span>
          <h1 className="echo-word">LEARNING.</h1>
        </div>
        <p className="hero-subtitle">
          Master the complexities of artificial intelligence through a high-fidelity learning experience. 
          Bite-sized knowledge, world-class curricula.
        </p>
        <div className="hero-ctas">
          <button className="btn-primary">EXPLORE COURSES</button>
          <button className="btn-ghost">WATCH REELS</button>
        </div>
        
        <div className="hero-stats">
          <div>
            <div className="hero-stat-val">1.2M</div>
            <div className="hero-stat-label">Learners active</div>
          </div>
          <div>
            <div className="hero-stat-val">4.9</div>
            <div className="hero-stat-label">Average rating</div>
          </div>
          <div>
            <div className="hero-stat-val">24/7</div>
            <div className="hero-stat-label">AI tutor access</div>
          </div>
        </div>
      </section>

      {/* Welcome Section */}
      {!hasClaimedWelcome && (
        <section className="welcome-swiss">
           <div>
             <h3>WELCOME BONUS PENDING</h3>
             <p>Claim your 100 EduCoins and begin your certification journey today.</p>
           </div>
           <button className="welcome-claim-btn" onClick={claimWelcomeBonus}>CLAIM 100 🪙</button>
        </section>
      )}

      {/* Philosophy Section */}
      <section className="philosophy">
        <div className="section-hairline" />
        <h2 className="philosophy-quote">
          AI is the <em>architecture</em> of the next century. We build the <em>foundations</em>.
        </h2>
        <div className="philosophy-grid">
          <div className="philosophy-col">
            <h3>PRECISION</h3>
            <p>Curated learning paths that cut through the noise. No fluff, just the core architecture of machine intelligence.</p>
          </div>
          <div className="philosophy-col">
            <h3>SOCIAL</h3>
            <p>A decentralized community of creators sharing reels, insights, and edge-case breakthroughs in real-time.</p>
          </div>
          <div className="philosophy-col">
            <h3>EXPERIENCED</h3>
            <p>Content validated by researchers from Stanford, DeepMind, and Anthropic. The gold standard of AI education.</p>
          </div>
        </div>
      </section>

      {/* Showcase Grid */}
      <section className="showcase">
        <div className="section-label">Showcase / 01</div>
        <div className="showcase-grid">
          <div className="sc-card sc-large sc-fill-1">
            <div className="sc-emoji">🧠</div>
            <div className="sc-card-inner">
              <div className="sc-card-label">Neural Networks</div>
            </div>
          </div>
          <div className="sc-card sc-pill sc-fill-2">
            <div className="sc-emoji">⚡</div>
            <div className="sc-card-inner"></div>
            <div className="pill-overlay">
              <div className="pill-overlay-ring">
                <div className="pill-overlay-text">AI REELS<br/>FLOW</div>
              </div>
            </div>
          </div>
          <div className="sc-card sc-circle sc-fill-3">
             <div className="sc-emoji">🤖</div>
             <div className="sc-card-inner"></div>
          </div>
          <div className="sc-card sc-wide sc-fill-4">
             <div className="sc-emoji">🔬</div>
             <div className="sc-card-inner">
               <div className="sc-card-label">Prompt Master</div>
             </div>
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section className="courses-section">
        <div className="section-label">Featured Courses / 02</div>
        <div className="bespoke-grid">
          {courses.slice(0, 3).map(c => <CourseCard key={c.id} course={c} />)}
        </div>
      </section>

      {/* Reels Section */}
      <section className="section-wrapper">
        <div className="section-header-row">
          <h2 className="section-big-title">Swiss <em>Learning</em> Reels</h2>
          <button className="see-all-link">EXPLORE ALL →</button>
        </div>
        <div className="reels-swiss-grid">
          {reels.slice(0, 5).map(r => <ReelCard key={r.id} reel={r} />)}
        </div>
      </section>

      {/* Creators Section */}
      <section className="section-wrapper">
         <div className="section-header-row">
           <h2 className="section-big-title">Elite <em>Partners</em></h2>
           <button className="see-all-link">ALL CREATORS →</button>
         </div>
         <div className="creators-list">
           {creators.slice(0, 4).map((c, i) => <CreatorCard key={c.id} creator={c} index={i} />)}
         </div>
      </section>
    </div>
  );
}
