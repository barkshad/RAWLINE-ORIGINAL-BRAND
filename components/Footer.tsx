
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
    <footer className="py-32 px-8 md:px-16 border-t border-white/5 bg-black text-white">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-24 items-start">
        <div className="space-y-8">
          <div className="text-2xl font-light tracking-[0.2em] uppercase">RAWLINE</div>
          <p className="artifact-label text-white/20 leading-loose">Built from vintage.<br/>Still standing.</p>
        </div>
        
        <div className="space-y-8 md:col-span-2 grid grid-cols-2 md:grid-cols-3 gap-12">
          <div className="space-y-6">
            <span className="artifact-label text-white/40 block">INDEX</span>
            <div className="flex flex-col gap-4 text-[10px] uppercase tracking-widest text-white/30">
              <Link to="/archive" className="hover:text-white transition-all">Archive</Link>
              <Link to="/fits" className="hover:text-white transition-all">Fits</Link>
              <Link to="/philosophy" className="hover:text-white transition-all">Philosophy</Link>
            </div>
          </div>
          <div className="space-y-6">
            <span className="artifact-label text-white/40 block">SOCIAL</span>
            <div className="flex flex-col gap-4 text-[10px] uppercase tracking-widest text-white/30">
              <a href="#" className="hover:text-white transition-all">Instagram</a>
              <a href="#" className="hover:text-white transition-all">TikTok</a>
            </div>
          </div>
          <div className="space-y-6">
            <span className="artifact-label text-white/40 block">MANAGEMENT</span>
            <AdminCMS content={content} onUpdateContent={setContent} pieces={pieces} onRefreshPieces={loadData} />
          </div>
        </div>
      </div>
      
      <div className="mt-32 pt-16 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
        <span className="artifact-label text-white/10">{content.footerTagline}</span>
        <span className="artifact-label text-white/10">© {new Date().getFullYear()} RAWLINE ARCHIVE</span>
      </div>
    </footer>
  );
};

export default Footer;
