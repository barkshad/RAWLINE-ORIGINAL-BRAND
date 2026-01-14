
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';

interface NavbarProps {
  scrolled: boolean;
  syncError: string | null;
}

const Navbar: React.FC<NavbarProps> = ({ scrolled, syncError }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  const menuItems = [
    { label: 'HOME', path: '/' },
    { label: 'THE STACK', path: '/archive' },
    { label: 'MOTION', path: '/fits' },
    { label: 'THE CODE', path: '/philosophy' }
  ];

  return (
    <>
      <nav className={`fixed top-0 left-0 w-full z-[100] px-8 md:px-16 flex justify-between items-center transition-all duration-700 ${scrolled || !isHome || isOpen ? 'bg-[#080808]/90 backdrop-blur-xl py-6 border-b border-white/5' : 'bg-transparent py-12'}`}>
        <div className="flex items-center gap-10">
          <Link to="/" onClick={() => setIsOpen(false)}>
            <motion.div 
              whileHover={{ opacity: 0.6 }}
              className="text-2xl md:text-3xl font-light tracking-[0.2em] uppercase cursor-none"
            >
              RAWLINE
            </motion.div>
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-16 text-[10px] font-medium uppercase tracking-[0.3em] text-white/40 items-center">
          {menuItems.slice(1).map((item) => (
            <Link 
              key={item.label}
              to={item.path}
              className={`transition-all duration-500 hover:text-white hover:tracking-[0.4em] ${location.pathname === item.path ? 'text-white' : ''}`}
            >
              {item.label}
            </Link>
          ))}
          <div className="w-[1px] h-4 bg-white/10 mx-2" />
          <div className="flex items-center gap-4 text-[9px] font-mono tracking-[0.2em] text-white/20 uppercase">
            <div className={`w-1.5 h-1.5 rounded-full ${syncError ? 'bg-orange-500' : 'bg-white/40'}`} />
            <span className="font-black tracking-[0.4em]">{syncError ? 'OFFLINE' : 'LIVE_FEED'}</span>
          </div>
        </div>

        {/* Mobile Toggle (Three Lines) */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="flex flex-col gap-1.5 z-[110] group"
        >
          <motion.div 
            animate={isOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
            className="w-8 h-[1px] bg-white group-hover:bg-red-600 transition-colors" 
          />
          <motion.div 
            animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
            className="w-8 h-[1px] bg-white/60 group-hover:bg-red-600 transition-colors" 
          />
          <motion.div 
            animate={isOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
            className="w-8 h-[1px] bg-white group-hover:bg-red-600 transition-colors" 
          />
        </button>
      </nav>

      {/* Fullscreen Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[90] bg-[#080808] flex flex-col justify-center px-12 md:px-32"
          >
            <div className="noise opacity-10"></div>
            <div className="space-y-12 relative z-10">
              <div className="artifact-label text-red-600/60 mb-8">NAVIGATION_INDEX</div>
              {menuItems.map((item, idx) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + idx * 0.1 }}
                >
                  <Link 
                    to={item.path} 
                    onClick={() => setIsOpen(false)}
                    className="block group"
                  >
                    <div className="flex items-baseline gap-6">
                      <span className="text-[10px] font-mono text-white/20 group-hover:text-red-600 transition-colors">0{idx + 1}</span>
                      <h2 className={`text-6xl md:text-8xl serif-display italic font-light tracking-tighter transition-all duration-700 group-hover:pl-8 group-hover:text-red-600 ${location.pathname === item.path ? 'text-white' : 'text-white/40'}`}>
                        {item.label}
                      </h2>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>

            <div className="absolute bottom-16 left-12 md:left-32 flex gap-12 text-[10px] font-black uppercase tracking-[0.4em] text-white/20">
              <a href="#" className="hover:text-white">Instagram</a>
              <a href="#" className="hover:text-white">TikTok</a>
              <a href="#" className="hover:text-white">Archive_V1.5</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
