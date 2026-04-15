import React from 'react';
import { useApp } from '../AppContext';

export default function Toast() {
  const { toasts } = useApp();
  if (!toasts.length) return null;
  return (
    <div className="toast-wrap">
      {toasts.map(t => (
        <div key={t.id} className="toast-swiss">
          <span className="toast-swiss-icon">{t.icon}</span>
          <span>{t.text}</span>
        </div>
      ))}
    </div>
  );
}
