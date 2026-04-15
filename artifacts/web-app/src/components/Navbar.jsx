import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const { scrollY } = useScroll();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);

  // Animate nav background and border based on scroll
  const navBackground = useTransform(
    scrollY,
    [0, 50],
    ['rgba(245, 245, 245, 0)', 'rgba(255, 255, 255, 0.85)']
  );
  const navBorder = useTransform(
    scrollY,
    [0, 50],
    ['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0.05)']
  );
  const navBackdropBlur = useTransform(
    scrollY,
    [0, 50],
    ['blur(0px)', 'blur(24px)']
  );

  useEffect(() => {
    return scrollY.onChange((latest) => {
      setIsScrolled(latest > 20);
    });
  }, [scrollY]);

  return (
    <motion.header 
      style={{ 
        backgroundColor: navBackground, 
        borderBottomColor: navBorder,
        backdropFilter: navBackdropBlur,
        WebkitBackdropFilter: navBackdropBlur
      }}
      className="fixed top-0 left-0 right-0 z-[500] h-[90px] border-b flex items-center justify-between px-6 sm:px-12 lg:px-20 transition-all duration-300"
    >
      <Link to="/">
        <motion.div 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="clash text-[28px] font-bold tracking-[-0.05em] text-black flex items-center gap-1"
        >
          EDUHUB<motion.div 
            animate={{ opacity: [1, 0, 1] }} 
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-4 h-[3px] bg-[var(--gray-b)] mb-1"
          />
        </motion.div>
      </Link>
      
      <div className="hidden md:flex items-center gap-12">
        {['Courses', 'Reels', 'Playground'].map((item) => {
          const path = `/${item.toLowerCase()}`;
          const isActive = location.pathname === path;
          
          return (
            <Link 
              key={item}
              to={path}
              className="relative group py-2"
            >
              <span className={`text-[12px] font-bold tracking-[0.2em] uppercase transition-colors ${isActive ? 'text-black' : 'text-[var(--gray-a)] group-hover:text-black'}`}>
                {item}
              </span>
              {isActive && (
                <motion.div 
                  layoutId="nav-indicator"
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-black"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <motion.div 
                className="absolute bottom-0 left-0 h-[2px] bg-black/20 w-0 group-hover:w-full transition-all duration-300"
              />
            </Link>
          );
        })}
      </div>

      <div className="flex items-center gap-8">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="hidden sm:flex items-center gap-3 bg-black/5 px-4 py-2 rounded-full"
        >
          <span className="text-[10px] font-bold text-[var(--gray-a)] uppercase tracking-widest">Balance</span>
          <span className="clash font-bold text-[14px]">100 EC</span>
        </motion.div>
        
        <motion.button 
          whileHover={{ scale: 1.05, backgroundColor: "#fff", color: "#000" }}
          whileTap={{ scale: 0.95 }}
          className="px-8 py-3 bg-[var(--black)] text-white text-[11px] font-bold tracking-[0.2em] border-2 border-[var(--black)] transition-colors shadow-lg"
        >
          JOIN NOW
        </motion.button>
      </div>
    </motion.header>
  );
}
