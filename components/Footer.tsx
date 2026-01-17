
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
    <footer className="py-32 px-8 md:px-16 border-t border-white/5 bg-[#050705] text-[#f5f5f0]">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-24 items-start max-w-7xl mx-auto">
        <div className="space-y-8">
          <div className="text-2xl font-light tracking-[0.2em] uppercase">RAWLINE</div>
          <p className="artifact-label text-white/20 leading-loose">Licensed Adult-Use Cannabis Dispensary.<br/>Delivering quality to NYC.</p>
          <div className="space-y-2">
            <span className="text-[10px] text-white/20 uppercase tracking-widest block font-black">LICENSES</span>
            <span className="text-[9px] text-[#d4af37] uppercase tracking-widest block font-black">CAUR #0862-A | NYC DIST #08</span>
          </div>
        </div>
        
        <div className="space-y-8 md:col-span-2 grid grid-cols-2 md:grid-cols-3 gap-12">
          <div className="space-y-6">
            <span className="artifact-label text-white/40 block font-black">DEPARTMENTS</span>
            <div className="flex flex-col gap-4 text-[10px] uppercase tracking-widest text-white/30 font-black">
              <Link to="/shop" className="hover:text-white transition-all">Shop All</Link>
              <Link to="/shop?cat=Flower" className="hover:text-white transition-all">Flower</Link>
              <Link to="/shop?cat=Edibles" className="hover:text-white transition-all">Edibles</Link>
              <Link to="/deals" className="hover:text-[#d4af37] transition-all">Today's Deals</Link>
            </div>
          </div>
          <div className="space-y-6">
            <span className="artifact-label text-white/40 block font-black">RESOURCES</span>
            <div className="flex flex-col gap-4 text-[10px] uppercase tracking-widest text-white/30 font-black">
              <Link to="/philosophy" className="hover:text-white transition-all">Learning Center</Link>
              <a href="#" className="hover:text-white transition-all">Delivery Zone</a>
              <a href="#" className="hover:text-white transition-all">Member Rewards</a>
            </div>
          </div>
          <div className="space-y-6">
            <span className="artifact-label text-white/40 block font-black">SYSTEM</span>
            <AdminCMS content={content} onUpdateContent={setContent} pieces={pieces} onRefreshPieces={loadData} />
          </div>
        </div>
      </div>
      
      <div className="mt-32 pt-16 border-t border-white/5 max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
        <div className="space-y-4 max-w-xl">
          <span className="artifact-label text-white/10 font-black tracking-[0.4em] block">{content.footerTagline}</span>
          <p className="text-[9px] text-white/10 leading-relaxed uppercase tracking-widest italic">
            Disclaimer: Cannabis products are for use only by adults 21 years of age and older. Keep out of reach of children. There may be health risks associated with consumption of this product. Cannabis can impair concentration, coordination, and judgment. Do not operate a vehicle or machinery under the influence of cannabis.
          </p>
        </div>
        <span className="artifact-label text-white/10 font-black tracking-[0.2em] whitespace-nowrap">© {new Date().getFullYear()} RAWLINE NY // ALL RIGHTS RESERVED</span>
      </div>
    </footer>
  );
};

export default Footer;
