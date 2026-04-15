import React from 'react';
import { motion } from 'framer-motion';

const footerVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.8, 
      ease: [0.22, 1, 0.36, 1],
      staggerChildren: 0.1
    }
  }
};

const childVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

export default function Footer() {
  return (
    <motion.footer 
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={footerVariants}
      className="bg-[var(--bg-white)] border-t border-[var(--black)]/5 pt-32 pb-16 px-6 sm:px-12 lg:px-20 relative z-40 overflow-hidden"
    >
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8 mb-24">
          <motion.div variants={childVariants} className="lg:col-span-5">
            <div className="flex items-center gap-2 mb-8">
              <div className="clash text-[48px] font-bold tracking-[-0.05em] text-black leading-none">
                EDUHUB
              </div>
              <motion.div 
                animate={{ opacity: [1, 0, 1] }} 
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-5 h-[4px] bg-[var(--black)] mt-2"
              />
            </div>
            <p className="text-[var(--gray-a)] text-[16px] max-w-[400px] leading-[1.8] font-medium">
              The premier institute for high-fidelity AI engineering. 
              Strip away the abstractions. Build raw performance.
            </p>
          </motion.div>
          
          <motion.div variants={childVariants} className="lg:col-span-3 lg:col-start-7">
            <div className="text-[11px] font-bold tracking-[0.3em] uppercase text-[var(--gray-b)] mb-8">Platform</div>
            <div className="flex flex-col gap-5">
              {['Curriculum', 'Playground', 'Research Labs', 'Enterprise'].map(link => (
                <motion.a 
                  key={link}
                  href={`#${link.toLowerCase().replace(' ', '-')}`}
                  whileHover={{ x: 5, color: "var(--black)" }}
                  className="text-[14px] font-bold text-[var(--gray-a)] transition-colors inline-block w-fit"
                >
                  {link}
                </motion.a>
              ))}
            </div>
          </motion.div>

          <motion.div variants={childVariants} className="lg:col-span-3">
            <div className="text-[11px] font-bold tracking-[0.3em] uppercase text-[var(--gray-b)] mb-8">Connect</div>
            <div className="flex flex-col gap-5">
              {['Twitter / X', 'GitHub', 'LinkedIn', 'Discord'].map(link => (
                <motion.a 
                  key={link}
                  href="#"
                  whileHover={{ x: 5, color: "var(--black)" }}
                  className="text-[14px] font-bold text-[var(--gray-a)] transition-colors inline-block w-fit"
                >
                  {link}
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div 
          variants={childVariants}
          className="pt-10 border-t border-[var(--black)]/10 flex flex-col md:flex-row justify-between items-center gap-6"
        >
          <div className="text-[10px] font-bold tracking-[0.2em] text-[var(--gray-b)] uppercase bg-black/5 px-4 py-2 rounded-full">
            © 2024 EDUHUB INTERNATIONAL AG. GENEVA.
          </div>
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-[11px] font-bold tracking-[0.2em] text-[var(--gray-a)] uppercase">
            <motion.a whileHover={{ color: "var(--black)" }} href="#" className="transition-colors">Privacy Policy</motion.a>
            <motion.a whileHover={{ color: "var(--black)" }} href="#" className="transition-colors">Terms of Service</motion.a>
            <motion.a whileHover={{ color: "var(--black)" }} href="#" className="transition-colors">AI Ethics</motion.a>
          </div>
        </motion.div>
      </div>
    </motion.footer>
  );
}
