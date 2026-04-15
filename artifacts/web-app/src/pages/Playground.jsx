import React from 'react';
import { motion } from 'framer-motion';

export default function Playground() {
  const [isThinking, setIsThinking] = React.useState(true);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="page-wrapper pt-[var(--nav-h)] bg-[var(--black)] text-white min-h-screen"
    >
      <section className="px-6 sm:px-12 lg:px-20 py-32 overflow-hidden">
        <div className="max-w-[1400px] mx-auto">
          <motion.div 
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "circOut" }}
            className="clash text-[clamp(48px,12vw,160px)] font-bold tracking-[-0.07em] leading-[0.8] mb-20 text-white opacity-90 uppercase"
          >
            Playground
          </motion.div>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="lg:col-span-4 flex flex-col justify-center"
            >
              <h3 className="clash text-[32px] font-bold mb-8 leading-tight uppercase">DEPLOY AGENTS<br/>IN SECONDS.</h3>
              <p className="text-[16px] text-white/50 leading-relaxed mb-10">Our terminal allows you to test logic gates, tool-use protocols, and RAG retrieval accuracy in a real-time sandbox environment.</p>
              
              <div className="space-y-4">
                <button className="w-full py-4 px-6 border border-white/20 hover:border-white hover:bg-white hover:text-black text-[12px] font-bold tracking-[0.2em] transition-all text-left flex justify-between items-center group">
                  LOAD AGENT_V4
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                </button>
                <button className="w-full py-4 px-6 border border-white/20 hover:border-white hover:bg-white hover:text-black text-[12px] font-bold tracking-[0.2em] transition-all text-left flex justify-between items-center group">
                  TEST TOOL_BOX
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                </button>
              </div>
            </motion.div>

            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="lg:col-span-8"
            >
              {/* Dark Terminal */}
              <div className="rounded-xl bg-[#080808] border border-white/10 shadow-2xl overflow-hidden neo-depth" style={{ boxShadow: '0 40px 100px rgba(0,0,0,0.8)' }}>
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-[#111]">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
                    <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
                    <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
                  </div>
                  <div className="text-[10px] font-bold tracking-widest text-white/30 uppercase">root@eduhub:~/agent_v4</div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-white/40 uppercase font-bold tracking-tighter">UTF-8</span>
                  </div>
                </div>
                <div className="p-8 mono text-[13px] leading-relaxed text-[#00ff41]/90">
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ staggerChildren: 0.2 }}
                  >
                    <div className="mb-4 text-white/40">// Initializing neural weight matrix...</div>
                    <div className="flex gap-3 mb-2">
                      <span className="text-white/30">$</span>
                      <span>python3 deploy_agent.py --model=eduhub-large-v2</span>
                    </div>
                    <div className="text-white">{'>'} Loading embeddings: [####################] 100%</div>
                    <div className="text-white mt-1">{'>'} Establishing secure websocket: CONNECTED</div>
                    
                    <div className="mt-8 border-l-2 border-[#00ff41]/30 pl-4 py-2">
                      <div className="flex items-center gap-3">
                        <span className="text-[11px] font-bold text-[#00ff41]">STATUS:</span>
                        <div className="flex items-center gap-1">
                          <motion.span 
                            animate={{ scale: [1, 1.5, 1], opacity: [0.4, 1, 0.4] }}
                            transition={{ repeat: Infinity, duration: 1 }}
                            className="w-1.5 h-1.5 rounded-full bg-[#00ff41]"
                          ></motion.span>
                          <span className="text-[11px] uppercase tracking-widest animate-pulse">THINKING_PROMPT_REASONING...</span>
                        </div>
                      </div>
                      <div className="mt-4 opacity-50">
                        ANALYZING REPO STRUCTURE...<br/>
                        IDENTIFYING LATENT VULNERABILITIES...<br/>
                        SYNTHESIZING OPTIMAL TEST SUITE...
                      </div>
                    </div>

                    <div className="mt-8 flex gap-4">
                      <button 
                        onClick={() => setIsThinking(!isThinking)}
                        className="px-6 py-2 bg-[#00ff41] text-black font-bold text-[11px] hover:brightness-110 transition-all uppercase"
                      >
                        {isThinking ? 'HALT' : 'EXECUTE'}
                      </button>
                      <button className="px-6 py-2 border border-[#00ff41] text-[#00ff41] font-bold text-[11px] hover:bg-[#00ff41]/10 transition-all uppercase">
                        Clear Logs
                      </button>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </motion.div>
  );
}
