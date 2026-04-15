import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../AppContext';

const SUGGESTED_PROMPTS = [
  'What is gradient descent?',
  'Explain transformers',
  'Prompt techniques',
  'RAG vs fine-tuning',
];

function MessageBubble({ msg }) {
  if (msg.role === 'thinking') {
    return (
      <div className="chat-msg">
        <div className="chat-ava">AI</div>
        <div className="thinking-dots">
          <span /><span /><span />
        </div>
      </div>
    );
  }
  const isUser = msg.role === 'user';
  return (
    <div className={`chat-msg${isUser ? ' user' : ''}`}>
      <div className="chat-ava">{isUser ? 'AT' : 'AI'}</div>
      <div className={`chat-bubble ${isUser ? 'chat-bubble-user' : 'chat-bubble-ai'}`}>
        {msg.content}
      </div>
    </div>
  );
}

export default function Playground() {
  const { messages, sendMessage } = useApp();
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || sending) return;
    const text = input.trim();
    setInput('');
    setSending(true);
    await sendMessage(text);
    setSending(false);
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="playground-section">
      <div className="playground-container">
        <div className="playground-topbar">
          <div className="pg-dot pg-dot-green" />
          <div className="pg-label">EDUHUB AI PLAYGROUND<span className="pg-sub">/ v1.0.4</span></div>
          <div className="pg-status">SYSTEMS NOMINAL</div>
        </div>
        
        <div className="playground-body">
          <aside className="pg-sidebar">
            <div className="pg-sidebar-label">ACTIVE SESSIONS</div>
            <div className="pg-session active">
              <div className="pg-session-name">Prompt Sandbox</div>
              <div className="pg-session-type">Neural Chat</div>
            </div>
            <button className="pg-new">+ NEW SESSION</button>
          </aside>
          
          <div className="chat-area">
            <div className="chat-msgs">
              {messages.map((msg, i) => <MessageBubble key={i} msg={msg} />)}
              <div ref={chatEndRef} />
            </div>

            <div className="pg-suggested">
              {SUGGESTED_PROMPTS.map(p => (
                <button key={p} className="pg-chip" onClick={() => setInput(p)}>{p}</button>
              ))}
            </div>

            <div className="chat-input-wrap">
              <textarea
                className="chat-ta"
                placeholder="INPUT COMMAND OR QUERY..."
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKey}
                rows={1}
              />
              <button className="chat-send" onClick={handleSend} disabled={!input.trim() || sending}>
                {sending ? '...' : '→'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
