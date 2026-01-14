import React, { useState, useEffect, useCallback } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { motion, useScroll, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import Lenis from 'lenis';
import PieceCard from './components/PieceCard';
import FadeInSection from './components/FadeInSection';
import AdminCMS from './components/AdminCMS';
import PieceDetail from './components/PieceDetail';
import { Piece, SiteContent } from './types';
import { getPieces, getSiteContent } from './services/firebaseService';

const DEFAULT_CONTENT: SiteContent = {
  heroTitle: "V I N T A G E",
  heroSubTitle: "A curated archival study of industrial silhouettes and material history.",
  archiveStatementTitle: "CURATED SELECTION",
  archiveStatementText1: "RAWLINE focuses on the intersection of function and form. Each artifact is selected for its construction integrity and historical significance.",
  archiveStatementText2: "Archiving the past to inform the silhouettes of the future.",
  footerTagline: "RAWLINE — PERMANENT ARCHIVE COLLECTION"
};

const MainLayout: React.FC<{ 
  scrolled: boolean; 
  syncError: string | null; 
  content: SiteContent; 
  pieces: Piece[]; 
  loadData: () => void;
  setContent: (c: SiteContent) => void;
}> = ({ scrolled, syncError, content, pieces, loadData, setContent }) => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  return (
    <div className="min-h-screen bg-[#080808] text-white selection:bg-white selection:text-black font-sans">
      <motion.div className="fixed top-0 left-0 right-0 h-[1px] bg-white/20 z-[101] origin-[0%]" style={{ scaleX }} />

      {/* Simplified Navigation inspired by Oscar & Patch */}
      <nav className={`fixed top-0 left-0 w-full z-50 px-8 md:px-16 flex justify-between items-center transition-all duration-700 ${scrolled ? 'bg-[#080808]/90 backdrop-blur-xl py-6 border-b border-white/5' : 'bg-transparent py-12'}`}>
        <div className="flex items-center gap-10">
          <motion.div 
            whileHover={{ opacity: 0.6 }}
            className="text-2xl md:text-3xl font-light tracking-[0.2em] uppercase cursor-none"
          >
            RAWLINE
          </motion.div>
        </div>
        
        <div className="hidden md:flex gap-16 text-[10px] font-medium uppercase tracking-[0.3em] text-white/40">
          {['ARCHIVE', 'MANIFEST', 'CONTACT'].map((item) => (
            <motion.a 
              key={item}
              href={`#${item.toLowerCase()}`}
              whileHover={{ color: '#fff', letterSpacing: '0.4em' }}
              className="transition-all duration-500"
            >
              {item}
            </motion.a>
          ))}
        </div>

        <div className="flex items-center gap-4 text-[9px] font-mono tracking-[0.2em] text-white/20 uppercase">
          <div className={`w-1.5 h-1.5 rounded-full ${syncError ? 'bg-orange-500' : 'bg-white/40'}`} />
        </div>
      </nav>

      {/* Hero: Simplified, Oscar & Patch style */}
      <header className="relative h-[90vh] flex flex-col justify-center items-center text-center px-6 overflow-hidden">
        <FadeInSection className="max-w-4xl z-10 space-y-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="artifact-label text-white/20"
          >
            THE ARCHIVAL COLLECTION
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            className="text-[clamp(3rem,12vw,10rem)] leading-[0.9] serif-display font-light italic tracking-tight text-white"
          >
            {content.heroTitle}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-white/40 text-lg md:text-xl max-w-2xl mx-auto font-light tracking-wide italic serif-display"
          >
            {content.heroSubTitle}
          </motion.p>
        </FadeInSection>
        
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="absolute bottom-16 left-1/2 -translate-x-1/2"
        >
          <div className="w-[1px] h-12 bg-white/10" />
        </motion.div>
      </header>

      {/* Curated Grid Section */}
      <section id="archive" className="py-24 md:py-48 px-8 md:px-16 lg:px-24">
        <FadeInSection className="mb-24 flex flex-col md:flex-row justify-between items-end gap-10">
          <div className="space-y-4">
            <div className="artifact-label text-red-600/60">COLLECTION_INDEX</div>
            <h2 className="text-4xl md:text-6xl serif-display italic font-light tracking-tight">{content.archiveStatementTitle}</h2>
          </div>
          <div className="text-[10px] font-mono text-white/20 uppercase tracking-widest border-b border-white/10 pb-2">
            STABLE_NODE: {pieces.length} ARTIFACTS
          </div>
        </FadeInSection>

        <div className="archive-grid">
          {pieces.map((piece, idx) => (
            <FadeInSection key={piece.id} delay={idx % 3 * 50}>
              <PieceCard piece={piece} />
            </FadeInSection>
          ))}
        </div>
      </section>

      {/* Manifesto / Statement */}
      <section id="manifest" className="py-48 px-8 md:px-24 bg-[#0a0a0a] border-y border-white/5">
        <div className="max-w-5xl mx-auto text-center space-y-20">
          <FadeInSection>
            <div className="artifact-label text-white/20 mb-8">THE PHILOSOPHY</div>
            <h3 className="text-4xl md:text-7xl serif-display italic leading-tight font-light text-white/90">
              "{content.archiveStatementText1}"
            </h3>
          </FadeInSection>
          <FadeInSection delay={300}>
            <p className="text-xl md:text-2xl font-light text-white/40 max-w-2xl mx-auto italic serif-display">
              {content.archiveStatementText2}
            </p>
          </FadeInSection>
        </div>
      </section>

      {/* Minimal Footer */}
      <footer className="py-32 px-8 md:px-16 border-t border-white/5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-24 items-start">
          <div className="space-y-8">
            <div className="text-2xl font-light tracking-[0.2em] uppercase">RAWLINE</div>
            <p className="artifact-label text-white/20 leading-loose">Established as a permanent archive for industrial garment history.</p>
          </div>
          
          <div className="space-y-8 md:col-span-2 grid grid-cols-2 md:grid-cols-3 gap-12">
            <div className="space-y-6">
              <span className="artifact-label text-white/40 block">LINKS</span>
              <div className="flex flex-col gap-4 text-[10px] uppercase tracking-widest text-white/30">
                <a href="#" className="hover:text-white transition-all">Archive</a>
                <a href="#" className="hover:text-white transition-all">Manifest</a>
              </div>
            </div>
            <div className="space-y-6">
              <span className="artifact-label text-white/40 block">SOCIAL</span>
              <div className="flex flex-col gap-4 text-[10px] uppercase tracking-widest text-white/30">
                <a href="#" className="hover:text-white transition-all">Instagram</a>
                <a href="#" className="hover:text-white transition-all">Dossier</a>
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
          <span className="artifact-label text-white/10">© {new Date().getFullYear()} RAWLINE FOUNDRY</span>
        </div>
      </footer>
    </div>
  );
};

const App: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [content, setContent] = useState<SiteContent>(DEFAULT_CONTENT);
  const [pieces, setPieces] = useState<Piece[]>([]);
  const [syncError, setSyncError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      const [cloudContent, cloudPieces] = await Promise.all([getSiteContent(), getPieces()]);
      if (cloudContent) setContent(cloudContent);
      if (cloudPieces && cloudPieces.length > 0) setPieces(cloudPieces);
    } catch (error: any) {
      setSyncError(error.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const lenis = new Lenis({ duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true });
    function raf(time: number) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
    const handleScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', handleScroll, { passive: true });
    loadData();
    return () => { window.removeEventListener('scroll', handleScroll); lenis.destroy(); };
  }, [loadData]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#080808] flex items-center justify-center font-mono">
        <div className="w-8 h-8 border border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<MainLayout scrolled={scrolled} syncError={syncError} content={content} pieces={pieces} loadData={loadData} setContent={setContent} />} />
        <Route path="/artifact/:id" element={<PieceDetail />} />
      </Routes>
    </HashRouter>
  );
};

export default App;