import React from 'react';
import { useApp } from '../AppContext';
import CreatorCard from '../components/CreatorCard';

export default function Creators() {
  const { creators } = useApp();

  return (
    <div className="section-wrapper">
      <div className="section-header-row" style={{ marginBottom: 60 }}>
        <h2 className="section-big-title">Elite <em>Partners</em></h2>
      </div>

      <div className="creators-list">
        {creators.map((c, i) => <CreatorCard key={c.id} creator={c} index={i} />)}
      </div>
    </div>
  );
}
