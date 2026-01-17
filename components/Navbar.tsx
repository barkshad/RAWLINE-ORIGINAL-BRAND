
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';

interface NavbarProps {
  scrolled: boolean;
  syncError: string | null;
  cartCount: number;
}

const Navbar: React.FC<NavbarProps> = ({ scrolled, syncError, cartCount }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  const menuItems = [
    { label: 'SHOP ALL', path: '/shop' },
    { label: 'FLOWER', path: '/shop?cat=Flower' },
    { label: 'EDIBLES', path: '/shop?cat=Edibles' },
    { label: 'DEALS', path: '/deals' },
    { label: 'LEARN', path: '/philosophy' }
  ];

  return (
    <>
      <nav className={`fixed top-0 left-0 w-full z-[100] px-6 md:px-12 flex justify-between items-center transition-all duration-500 ${scrolled || !isHome || isOpen ? 'bg-black/95 backdrop-blur-md py-4 border-b border-white/5' : 'bg-transparent py-8'}`}>
        <div className="flex items-center gap-8">
          <Link to="/" onClick={() => setIsOpen(false)}>
            <div className="text-xl md:text-2xl font-light tracking-[0.2em] uppercase">RAWLINE</div>
          </Link>
          
          <div className="hidden lg:flex gap-8 text-[9px] font-bold uppercase tracking-[0.2em] text-white/40">
            {menuItems.map((item) => (
              <Link 
                key={item.label}
                to={item.path}
                className={`hover:text-white transition-all ${location.pathname + location.search === item.path ? 'text-white' : ''}`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="hidden sm:flex items-center gap-3 text-[9px] font-mono text-white/20 uppercase tracking-widest">
            <div className={`w-1.5 h-1.5 rounded-full ${syncError ? 'bg-red-500' : 'bg-emerald-500'}`} />
            <span>{syncError ? 'OFFLINE' : 'LOCAL STORE OPEN'}</span>
          </div>

          <Link to="/cart" className="relative group">
            <svg className="w-5 h-5 text-white/60 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-emerald-600 text-white text-[8px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>

          <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden flex flex-col gap-1.5 group">
            <motion.div animate={isOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }} className="w-6 h-[1.5px] bg-white" />
            <motion.div animate={isOpen ? { opacity: 0 } : { opacity: 1 }} className="w-6 h-[1.5px] bg-white/60" />
            <motion.div animate={isOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }} className="w-6 h-[1.5px] bg-white" />
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-[90] bg-black pt-24 px-8"
          >
            <div className="flex flex-col gap-8">
              {menuItems.map((item, idx) => (
                <motion.div 
                  key={item.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Link to={item.path} onClick={() => setIsOpen(false)} className="text-4xl font-light tracking-tight text-white/80 hover:text-white serif-display italic">
                    {item.label}
                  </Link>
                </motion.div>
              ))}
              <div className="pt-12 border-t border-white/5 space-y-4">
                 <div className="text-[9px] text-white/20 uppercase tracking-widest font-black">Quick Links</div>
                 <Link to="/philosophy" onClick={() => setIsOpen(false)} className="block text-white/40 uppercase tracking-widest text-xs">Knowledge Base</Link>
                 <Link to="/deals" onClick={() => setIsOpen(false)} className="block text-emerald-500 uppercase tracking-widest text-xs">Today's Deals</Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
