
import React from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';

interface NavbarProps {
  scrolled: boolean;
  syncError: string | null;
}

const Navbar: React.FC<NavbarProps> = ({ scrolled, syncError }) => {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 px-8 md:px-16 flex justify-between items-center transition-all duration-700 ${scrolled || !isHome ? 'bg-[#080808]/90 backdrop-blur-xl py-6 border-b border-white/5' : 'bg-transparent py-12'}`}>
      <div className="flex items-center gap-10">
        <Link to="/">
          <motion.div 
            whileHover={{ opacity: 0.6 }}
            className="text-2xl md:text-3xl font-light tracking-[0.2em] uppercase cursor-none"
          >
            RAWLINE
          </motion.div>
        </Link>
      </div>
      
      <div className="hidden md:flex gap-16 text-[10px] font-medium uppercase tracking-[0.3em] text-white/40">
        {[
          { label: 'ARCHIVE', path: '/archive' },
          { label: 'FITS', path: '/fits' },
          { label: 'PHILOSOPHY', path: '/philosophy' }
        ].map((item) => (
          <Link 
            key={item.label}
            to={item.path}
            className={`transition-all duration-500 hover:text-white hover:tracking-[0.4em] ${location.pathname === item.path ? 'text-white' : ''}`}
          >
            {item.label}
          </Link>
        ))}
      </div>

      <div className="flex items-center gap-4 text-[9px] font-mono tracking-[0.2em] text-white/20 uppercase">
        <div className={`w-1.5 h-1.5 rounded-full ${syncError ? 'bg-orange-500' : 'bg-white/40'}`} />
        <span className="hidden md:inline">{syncError ? 'OFFLINE' : 'LIVE'}</span>
      </div>
    </nav>
  );
};

export default Navbar;
