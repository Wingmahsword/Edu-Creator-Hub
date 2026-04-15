import React from 'react';
import { useApp } from '../AppContext';

const ACHIEVEMENTS = [
  { icon: '🏆', title: 'FIRST STEP', desc: 'Enrolled in your first course', unlocked: true },
  { icon: '🔥', title: 'LEARNING STREAK', desc: '7 days of continuous mastery', unlocked: true },
  { icon: '🎯', title: 'PROMPT MASTER', desc: '3 prompt engineering badges', unlocked: false },
  { icon: '🧠', title: 'ML ARCHITECT', desc: 'Completed ML Specialization', unlocked: false },
];

export default function Profile() {
  const { coins, enrolledCourses, followingCreators, likedReels } = useApp();
  const xp = coins * 3;
  const nextLevel = 2000;

  return (
    <div className="profile-section">
      <div className="profile-swiss">
        <div className="profile-ava-swiss">AT</div>
        <div>
          <h1 className="profile-name-swiss">Ayush Tripathi</h1>
          <div className="profile-handle-swiss">@ayush_builds / AI Architect</div>
          <p className="profile-bio-swiss">
            Exploring the boundaries of generative models and neural architectures. 
            Currently mastering Constitutional AI principles and RAG optimization.
          </p>
        </div>
        <div className="profile-stats-swiss">
          <div className="profile-stat-row">
            <div className="profile-stat-v">{enrolledCourses.length}</div>
            <div className="profile-stat-l">ENROLLED</div>
          </div>
          <div className="profile-stat-row">
            <div className="profile-stat-v">{coins}</div>
            <div className="profile-stat-l">EDUCOINS</div>
          </div>
          <div className="xp-row">
            <div className="xp-l">LEVEL 03 / {xp} XP</div>
            <div className="xp-track">
              <div className="xp-prog" style={{ width: `${(xp / nextLevel) * 100}%` }} />
            </div>
          </div>
        </div>
      </div>

      <div className="section-label">Achievements / 03</div>
      <div className="ach-grid">
        {ACHIEVEMENTS.map(a => (
          <div key={a.title} className={`ach-card ${a.unlocked ? 'unlocked' : ''}`}>
            <div className="ach-icon">{a.icon}</div>
            <div className="ach-title">{a.title}</div>
            <div className="ach-desc">{a.desc}</div>
            {a.unlocked && <div className="ach-unlocked-label">UNLOCKED</div>}
          </div>
        ))}
      </div>
    </div>
  );
}
