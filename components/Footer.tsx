
import React from 'react';
import { Link } from 'react-router-dom';
import AdminCMS from './AdminCMS';
import { SiteContent, Piece } from '../types';

interface FooterProps {
  content: SiteContent;
  setContent: (c: SiteContent) => void;
  pieces: Piece[];
  loadData: () => void;
}

const Footer: React.FC<FooterProps> = ({ content, setContent, pieces, loadData }) => {
  return (
    <footer className="bg-neutral-100 border-t border-neutral-200 pt-20 pb-12 px-6 md:px-12 text-neutral-900">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        <div className="space-y-4">
           <h3 className="font-bold uppercase tracking-widest text-sm text-[#b91c1c]">Shop</h3>
           <ul className="space-y-2 text-sm text-neutral-600">
             <li><Link to="/shop" className="hover:text-neutral-900">All Collections</Link></li>
             <li><Link to="/shop?cat=Flower" className="hover:text-neutral-900">Dried Flower</Link></li>
             <li><Link to="/shop?cat=Edibles" className="hover:text-neutral-900">Edibles</Link></li>
             <li><Link to="/shop?cat=Vapes" className="hover:text-neutral-900">Vapes</Link></li>
           </ul>
        </div>
        <div className="space-y-4">
           <h3 className="font-bold uppercase tracking-widest text-sm text-[#b91c1c]">Reach Out</h3>
           <ul className="space-y-2 text-sm text-neutral-600 font-bold uppercase tracking-tighter">
             <li><a href="https://wa.me/254700000000" className="hover:text-green-600">WhatsApp</a></li>
             <li><a href="https://instagram.com/rawline" className="hover:text-pink-600">Instagram</a></li>
             <li><a href="tel:+254700000000" className="hover:text-neutral-900">Call Now</a></li>
             <li><a href="#" className="hover:text-blue-500">Telegram</a></li>
           </ul>
        </div>
        <div className="space-y-4">
           <h3 className="font-bold uppercase tracking-widest text-sm text-[#b91c1c]">Support</h3>
           <ul className="space-y-2 text-sm text-neutral-600">
             <li><a href="#" className="hover:text-neutral-900">FAQ</a></li>
             <li><a href="#" className="hover:text-neutral-900">Contact Us</a></li>
             <li><a href="#" className="hover:text-neutral-900">Safe Use Guide</a></li>
           </ul>
        </div>
        <div className="space-y-4">
           <h3 className="font-bold uppercase tracking-widest text-sm text-[#b91c1c]">Admin</h3>
           <div className="text-sm">
             <AdminCMS content={content} onUpdateContent={setContent} pieces={pieces} onRefreshPieces={loadData} />
           </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto border-t border-neutral-200 pt-12 flex flex-col md:flex-row justify-between items-center gap-6">
         <div className="text-xs text-neutral-500 max-w-2xl">
            <strong>WARNING:</strong> Consumption of cannabis impairs your ability to drive and operate machinery. Please consume responsibly. Keep out of reach of children. Delivery only to individuals 19+.
         </div>
         <div className="text-xs font-bold uppercase tracking-widest text-neutral-900">
            © {new Date().getFullYear()} RAWLINE Retailer
         </div>
      </div>
    </footer>
  );
};

export default Footer;
