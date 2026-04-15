import React from 'react';
import { useApp } from '../AppContext';

const THUMB_EMOJIS = { ml: '🧠', dl: '🔬', llm: '💬', prompt: '✍️', ethics: '⚖️', apps: '🚀' };

export default function CourseCard({ course }) {
  const { enrollCourse } = useApp();

  return (
    <div className="bespoke-card" id={`course-${course.id}`} onClick={() => enrollCourse(course.id)}>
      <div className="bespoke-icon-box">
        {THUMB_EMOJIS[course.thumbnail] || '📖'}
      </div>
      <div className="bespoke-partner">{course.partner}</div>
      <div className="bespoke-title">{course.title}</div>
      <div className="bespoke-body">
        {course.description.length > 100 ? course.description.slice(0, 100) + '...' : course.description}
      </div>
      <div className="bespoke-meta">
        <span className="level-tag">{course.level}</span>
        <span>⏱️ {course.duration}</span>
      </div>
      <div className="bespoke-cta">
        <div className="bespoke-cta-text">{course.enrolled ? 'CONTINUE' : 'ENROLL'}</div>
        <div className="bespoke-coins">🪙 +{course.rewardCoins}</div>
        <div className="bespoke-arrow">→</div>
      </div>
    </div>
  );
}
