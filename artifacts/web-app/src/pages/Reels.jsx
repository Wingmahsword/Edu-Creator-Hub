import React from 'react';
import { useApp } from '../AppContext';
import ReelCard from '../components/ReelCard';

export default function Reels() {
  const { reels } = useApp();

  return (
    <div className="section-wrapper">
      <div className="section-header-row" style={{ marginBottom: 60 }}>
        <h2 className="section-big-title">Fluid <em>Knowledge</em></h2>
      </div>

      <div className="reels-swiss-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        {reels.map(r => <ReelCard key={r.id} reel={r} />)}
      </div>
    </div>
  );
}
