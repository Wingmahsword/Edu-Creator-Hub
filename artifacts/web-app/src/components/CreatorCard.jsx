import React from 'react';
import { useApp } from '../AppContext';

export default function CreatorCard({ creator, index }) {
  const { toggleFollow } = useApp();
  
  return (
    <div className="creator-row" id={`creator-${creator.id}`} onClick={() => toggleFollow(creator.id)}>
      <div className="creator-num">{(index + 1).toString().padStart(2, '0')}</div>
      <div className="creator-ava-swiss">{creator.avatar}</div>
      <div className="creator-info">
        <div className="creator-name-swiss">
          {creator.name} {creator.verified && <span className="creator-verified-swiss">✓</span>}
        </div>
        <div className="creator-specialty-swiss">{creator.specialty}</div>
      </div>
      <div className="creator-stat-swiss">
        <div className="creator-followers-swiss">{(creator.followers / 1000).toFixed(0)}K</div>
        <div className="creator-followers-label">FOLLOWERS</div>
      </div>
      <div style={{ marginLeft: 32 }}>
        <button className={`follow-swiss ${creator.following ? 'following' : ''}`}>
          {creator.following ? 'FOLLOWING' : 'FOLLOW'}
        </button>
      </div>
    </div>
  );
}
