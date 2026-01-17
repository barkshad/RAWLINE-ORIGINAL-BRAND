
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

  const menuItems = [
    { label: 'Shop All', path: '/shop' },
    { label: 'Flower', path: '/shop?cat=Flower' },
    { label: 'Pre-Rolls', path: '/shop?cat=Pre-Rolls' },
    { label: 'Vapes', path: '/shop?cat=Vapes' },
    { label: 'Edibles', path: '/shop?cat=Edibles' },
    { label: 'Learn', path: '/philosophy' }
  ];

  return (
    <>
      <nav className="sticky top-0 left-0 w-full z-[100] bg-white border-b border-neutral-200">
        {/* Top Bar */}
        <div className="bg-neutral-900 text-white text-[10px] py-2 px-6 text-center font-bold tracking-widest uppercase">
          Free Delivery on orders over $150 | Legal Age 19+
        </div>

        {/* Main Nav */}
        <div className="px-6 md:px-12 py-4 flex justify-between items-center">
          <div className="flex items-center gap-12">
            <Link to="/" onClick={() => setIsOpen(false)}>
              <div className="text-2xl font-bold tracking-tight uppercase display-font text-neutral-900">RAWLINE</div>
            </Link>
            
            <div className="hidden lg:flex gap-8 text-sm font-medium text-neutral-600">
              {menuItems.map((item) => (
                <Link 
                  key={item.label}
                  to={item.path}
                  className={`hover:text-neutral-900 transition-colors uppercase tracking-wide text-xs font-bold ${location.pathname + location.search === item.path ? 'text-neutral-900' : ''}`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <Link to="/cart" className="relative group flex items-center gap-2">
              <span className="text-xs font-bold uppercase hidden md:block">Cart</span>
              <div className="relative">
                <svg className="w-5 h-5 text-neutral-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#b91c1c] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </div>
            </Link>

            <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden p-2">
              <div className="w-6 h-0.5 bg-neutral-900 mb-1.5"></div>
              <div className="w-6 h-0.5 bg-neutral-900 mb-1.5"></div>
              <div className="w-6 h-0.5 bg-neutral-900"></div>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="fixed top-[105px] left-0 w-full bg-white border-b border-neutral-200 overflow-hidden z-[90]"
          >
            <div className="p-6 flex flex-col gap-4">
              {menuItems.map((item) => (
                <Link 
                  key={item.label}
                  to={item.path} 
                  onClick={() => setIsOpen(false)} 
                  className="text-lg font-bold uppercase tracking-wide text-neutral-800 hover:text-[#b91c1c]"
                >
                  {item.label}
                </Link>
              ))}
              <div className="border-t border-neutral-100 pt-4 mt-2">
                <Link to="/deals" onClick={() => setIsOpen(false)} className="block text-[#b91c1c] font-bold uppercase text-sm">Sale Items</Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
