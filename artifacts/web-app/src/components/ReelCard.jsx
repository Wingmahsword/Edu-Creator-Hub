import React from 'react';
import { useApp } from '../AppContext';

export default function ReelCard({ reel }) {
  const { toggleLike } = useApp();

  return (
    <div className="reel-swiss" id={`reel-${reel.id}`}>
      <div className="reel-thumb-swiss">
         {reel.id === 'r1' ? '✍️' : reel.id === 'r2' ? '🧠' : reel.id === 'r3' ? '⚡' : reel.id === 'r4' ? '🚀' : '🔬'}
         <span className="reel-duration-swiss">{reel.duration}</span>
      </div>
      <div className="reel-body-swiss">
        <div className="reel-creator-swiss">{reel.creatorHandle}</div>
        <div className="reel-title-swiss">{reel.title}</div>
        <div className="reel-actions-swiss">
          <button 
            className={`reel-btn-swiss ${reel.liked ? 'liked' : ''}`}
            onClick={(e) => { e.stopPropagation(); toggleLike(reel.id); }}
          >
            {reel.liked ? '❤️' : '♡'} {(reel.likes / 1000).toFixed(1)}k
          </button>
          <button className="reel-btn-swiss">
            💬 {(reel.comments / 1000).toFixed(1)}k
          </button>
        </div>
      </div>
    </div>
  );
}
