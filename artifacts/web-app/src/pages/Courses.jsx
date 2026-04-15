import React, { useState } from 'react';
import { useApp } from '../AppContext';
import CourseCard from '../components/CourseCard';

export default function Courses() {
  const { courses, searchQuery } = useApp();
  const [activeFilter, setActiveFilter] = useState('All');

  const filtered = courses.filter(c => {
    const matchCat = activeFilter === 'All' || c.category === activeFilter;
    const matchSearch = !searchQuery || c.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const CATEGORIES = ['All', 'Machine Learning', 'Deep Learning', 'Generative AI', 'Prompt Engineering'];

  return (
    <div className="courses-section">
      <div className="section-header-row" style={{ marginBottom: 60 }}>
        <h2 className="section-big-title">Browse <em>Curricula</em></h2>
      </div>

      <div className="filter-bar">
        {CATEGORIES.map(cat => (
          <button 
            key={cat} 
            className={`filter-pill ${activeFilter === cat ? 'active' : ''}`}
            onClick={() => setActiveFilter(cat)}
          >
            {cat.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="bespoke-grid">
        {filtered.map(c => <CourseCard key={c.id} course={c} />)}
      </div>
    </div>
  );
}
