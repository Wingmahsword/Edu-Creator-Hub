import React from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../AppContext';
import CourseCard from '../components/CourseCard';
import ReelCard from '../components/ReelCard';

// Animation Variants
const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.6, -0.05, 0.01, 0.99] } }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.12
    }
  }
};

export default function Home() {
  const { courses, reels } = useApp();

  return (
    <motion.div 
      initial="initial" 
      animate="animate" 
      exit={{ opacity: 0 }}
      className="page-wrapper bg-[var(--bg)] min-h-screen pt-[var(--nav-h)] overflow-x-hidden"
    >
      {/* Hero Section */}
      <section className="py-20 px-6 sm:px-12 lg:px-20 relative min-h-[85vh] flex items-center">
        <div className="w-full max-w-[1400px] mx-auto relative z-10">
          <motion.div variants={staggerContainer} className="flex flex-col items-center justify-center text-center">
            
            <motion.div 
              variants={fadeInUp}
              className="flex items-center gap-4 text-[10px] font-bold tracking-[0.4em] uppercase text-[var(--black)] mb-12 opacity-60"
            >
              <span className="w-8 h-[1px] bg-[var(--black)]"></span>
              PREMIUM AI RESEARCH LABS
              <span className="w-8 h-[1px] bg-[var(--black)]"></span>
            </motion.div>

            {/* Clean Hero Text - ZERO Overlap */}
            <motion.div 
              variants={fadeInUp} 
              className="relative cursor-default select-none mb-16"
            >
              <div className="clash tracking-[-0.08em] leading-[0.8] relative z-10 flex flex-col gap-2">
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="text-[clamp(60px,12vw,180px)] font-bold text-black"
                >
                  EVOLVE.
                </motion.div>
                <div className="text-[clamp(50px,10vw,140px)] font-bold text-black/80">
                  DEPLOY.
                </div>
                <div className="text-[clamp(40px,8vw,100px)] font-bold text-[var(--gray-b)]">
                  MASTER AI.
                </div>
              </div>
            </motion.div>

            <motion.p 
              variants={fadeInUp}
              className="text-[17px] sm:text-[19px] text-[var(--gray-a)] max-w-[700px] font-medium leading-[1.7] mb-16 px-4"
            >
              The definitive ecosystem for high-fidelity AI engineering. Strip away the abstractions. Build raw performance.
            </motion.p>

            <motion.div variants={fadeInUp} className="flex flex-wrap justify-center gap-8 items-center mb-24">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="ripple px-14 py-6 bg-[var(--black)] text-white font-bold text-[13px] tracking-[0.2em] flex items-center gap-4 shadow-2xl"
              >
                <iconify-icon icon="lucide:arrow-right-circle" class="text-[20px]"></iconify-icon>
                CURRICULUM
              </motion.button>
              <motion.a 
                href="#playground"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-14 py-6 border border-[var(--black)] font-bold text-[13px] tracking-[0.2em] hover:bg-[var(--black)] hover:text-white transition-all text-center"
              >
                PLAYGROUND
              </motion.a>
            </motion.div>

            <motion.div 
              variants={fadeInUp}
              className="grid grid-cols-1 sm:grid-cols-3 gap-12 sm:gap-24 w-full max-w-[1100px] pt-16 border-t border-[var(--black)]/10"
            >
              {[
                { val: '1.2M', label: 'NODES ACTIVE' },
                { val: '4.98', label: 'UPTIME SCORE' },
                { val: '0ms', label: 'INF. LATENCY' }
              ].map((stat, i) => (
                <div key={i} className="flex flex-col items-center sm:items-start">
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 * i }}
                    className="clash text-[52px] font-bold tracking-[-0.05em] leading-none"
                  >
                    {stat.val}
                  </motion.div>
                  <div className="text-[10px] font-bold tracking-[0.3em] uppercase text-[var(--gray-b)] mt-3">
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Philosophy Section - Animated Cards */}
      <section className="py-40 px-6 sm:px-12 lg:px-20 max-w-[1400px] mx-auto bg">
        <motion.div 
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="section-title mb-24"
        >
          Philosophy
        </motion.div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {[
            { tag: '01', title: 'PRECISION', desc: 'Production-grade architectures require absolute precision in weight logic and deployment.' },
            { tag: '02', title: 'SKEPTICISM', desc: 'Trust no prompt. We teach advanced evaluation frameworks for true reliability.' },
            { tag: '03', title: 'VELOCITY', desc: 'Ship transformers at lightspeed. Performance optimized scaffolding for elite teams.' }
          ].map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
              whileHover={{ y: -12, rotate: -1 }}
              className="neo-depth p-14 bg-white border border-black/[0.03] group cursor-default"
            >
              <div className="clash text-[22px] font-bold mb-8 flex items-center gap-5">
                <span className="w-12 h-12 bg-black text-white flex items-center justify-center text-[20px] group-hover:rotate-12 transition-transform">
                  {item.tag}
                </span>
                {item.title}
              </div>
              <p className="text-[16px] text-[var(--gray-a)] leading-[1.8] font-medium">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Courses Section - Staggered Reveal */}
      <section className="px-6 sm:px-12 lg:px-20 py-40 bg-black text-white" id="courses">
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="section-title mb-24 text-white/90"
        >
          Courses
        </motion.div>
        <motion.div 
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12"
        >
          {courses.slice(0, 3).map(course => (
            <motion.div 
              key={course.id} 
              variants={fadeInUp}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              whileDrag={{ scale: 0.95, opacity: 0.8 }}
            >
              <CourseCard course={course} />
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Reels - Interactive Drag Grid */}
      <section className="px-6 sm:px-12 lg:px-20 py-40" id="reels">
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="section-title mb-24"
        >
          Research
        </motion.div>
        <motion.div 
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8"
        >
          {reels.slice(0, 5).map(r => (
            <motion.div 
              key={r.id} 
              variants={fadeInUp}
              whileTap={{ scale: 0.9, rotate: -2 }}
            >
              <ReelCard reel={r} />
            </motion.div>
          ))}
        </motion.div>
      </section>
    </motion.div>
  );
}
