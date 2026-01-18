
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
          Direct Order via WhatsApp or Phone | Legal Age 19+
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
          
          <div className="flex items-center gap-4">
            {/* Social Icons */}
            <div className="flex items-center gap-4 border-r border-neutral-200 pr-4 mr-2 hidden sm:flex">
               <a href="https://wa.me/254700000000" target="_blank" rel="noopener noreferrer" className="text-neutral-600 hover:text-green-500 transition-colors">
                 <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.246 2.248 3.484 5.232 3.484 8.412-.003 6.557-5.338 11.892-11.893 11.892-1.997-.001-3.951-.5-5.688-1.448l-6.309 1.656zm6.224-3.52c1.54.914 3.033 1.36 4.619 1.361 5.496.002 9.97-4.476 9.973-9.973 0-2.664-1.037-5.166-2.922-7.051-1.885-1.885-4.384-2.923-7.047-2.923-5.498 0-9.974 4.476-9.977 9.974-.001 1.758.465 3.472 1.346 4.978l-1.025 3.732 3.829-1.002zm11.366-6.31c-.312-.156-1.848-.912-2.134-1.015-.286-.104-.495-.156-.703.156-.208.312-.806 1.015-.988 1.223-.182.208-.364.234-.676.078-.312-.156-1.316-.484-2.508-1.548-.928-.827-1.554-1.849-1.736-2.16-.182-.312-.02-.481.136-.636.141-.14.312-.364.468-.547.156-.182.208-.312.312-.52.104-.208.052-.39-.026-.547-.078-.156-.703-1.693-.963-2.316-.252-.605-.51-.523-.703-.533-.182-.01-.39-.012-.598-.012s-.547.078-.833.39c-.286.312-1.093 1.067-1.093 2.602s1.119 3.018 1.275 3.227c.156.208 2.203 3.364 5.336 4.717.745.322 1.327.514 1.78.658.748.238 1.428.204 1.967.124.601-.089 1.848-.755 2.108-1.485.26-.73.26-1.354.182-1.485-.078-.131-.286-.208-.598-.364z"/></svg>
               </a>
               <a href="https://instagram.com/rawline" target="_blank" rel="noopener noreferrer" className="text-neutral-600 hover:text-pink-600 transition-colors">
                 <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
               </a>
            </div>

            <a href="tel:+254700000000" className="bg-neutral-900 text-white px-5 py-2.5 text-xs font-bold uppercase tracking-widest rounded-sm hover:bg-[#b91c1c] transition-colors hidden md:block">
              Call to Order
            </a>

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
              <div className="border-t border-neutral-100 pt-4 mt-2 space-y-4">
                <a href="tel:+254700000000" className="block text-center bg-neutral-900 text-white py-4 font-bold uppercase tracking-widest text-sm">Call to Order</a>
                <div className="flex justify-center gap-8 py-2">
                   <a href="#" className="text-neutral-900 font-bold uppercase text-xs">WhatsApp</a>
                   <a href="#" className="text-neutral-900 font-bold uppercase text-xs">Instagram</a>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
