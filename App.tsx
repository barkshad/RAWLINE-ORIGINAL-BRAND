
import React, { useState, useEffect, useCallback } from 'react';
import { HashRouter, Routes, Route, Link } from 'react-router-dom';
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion';
import Lenis from 'lenis';
import FadeInSection from './components/FadeInSection';
import PieceDetail from './components/PieceDetail';
import Philosophy from './components/Philosophy';
import Fits from './components/Fits';
import Archive from './components/Archive';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PieceCard from './components/PieceCard';
import { Piece, SiteContent } from './types';
import { getPieces, getSiteContent } from './services/firebaseService';
import { isVideoUrl } from './utils';

const DEFAULT_CONTENT: SiteContent = {
  heroTitle: "RAWLINE FASHION ARCHIVE",
  heroSubTitle: "Old clothes. Real history.\nStill hitting.",
  heroMediaUrl: "https://videos.pexels.com/video-files/3248357/3248357-hd_1920_1080_25fps.mp4",
  archiveStatementTitle: "THE PHILOSOPHY",
  archiveStatementText1: "RAWLINE ain’t start as a brand. It started with paying attention. Digging through racks, finding the same cuts that kept showing up. Stuff that been outside. That’s when it clicked — some clothes don’t fall off. They just level up.",
  archiveStatementText2: "This ain’t random thrifting, gng. This is intention. RAWLINE is a fashion archive in motion — built from vintage, worn forward. You feel me.",
  footerTagline: "Built from vintage. Still standing.",
  fitChecks: []
};

const HomePage: React.FC<{ content: SiteContent; pieces: Piece[] }> = ({ content, pieces }) => {
  return (
    <div className="min-h-screen bg-[#080808] text-white font-sans">
      {/* Hero with Media Background */}
      <header className="relative h-screen flex flex-col justify-center items-center text-center px-6 overflow-hidden bg-black">
        <div className="absolute inset-0 z-0 opacity-80">
          <AnimatePresence mode="wait">
            <motion.div
              key={content.heroMediaUrl}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2 }}
              className="w-full h-full"
            >
              {isVideoUrl(content.heroMediaUrl) ? (
                <video 
                  key={content.heroMediaUrl}
                  autoPlay 
                  loop 
                  muted 
                  playsInline 
                  src={content.heroMediaUrl}
                  className="w-full h-full object-cover" 
                />
              ) : content.heroMediaUrl ? (
                <img 
                  src={content.heroMediaUrl} 
                  className="w-full h-full object-cover" 
                  alt="Hero Background" 
                />
              ) : null}
            </motion.div>
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-black" />
        </div>

        <FadeInSection className="max-w-5xl z-10 space-y-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="artifact-label text-white/40 tracking-[0.4em]"
          >
            EST. 2024
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            className="text-[clamp(3rem,10vw,8rem)] leading-[0.9] serif-display font-light italic tracking-tight text-white drop-shadow-2xl"
          >
            {content.heroTitle}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto font-light tracking-wide italic serif-display whitespace-pre-line"
          >
            {content.heroSubTitle}
          </motion.p>
          <motion.div
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ delay: 1.2 }}
          >
             <Link 
               to="/archive"
               className="inline-block mt-8 text-[10px] uppercase tracking-[0.4em] font-black border border-white/20 px-8 py-4 hover:bg-white hover:text-black transition-all"
             >
               ENTER ARCHIVE
             </Link>
          </motion.div>
        </FadeInSection>
        
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="absolute bottom-16 left-1/2 -translate-x-1/2 z-10"
        >
          <div className="w-[1px] h-12 bg-white/40" />
        </motion.div>
      </header>
      
      {/* Featured Pieces */}
      <section className="py-32 px-8 md:px-16">
         <div className="flex justify-between items-end mb-16">
            <h2 className="text-3xl md:text-5xl serif-display italic font-light">Latest Drops</h2>
            <Link to="/archive" className="artifact-label text-white/40 hover:text-white transition-all">VIEW ALL</Link>
         </div>
         <div className="archive-grid">
            {pieces.slice(0, 3).map((piece, idx) => (
              <FadeInSection key={piece.id} delay={idx * 100}>
                 <PieceCard piece={piece} />
              </FadeInSection>
            ))}
         </div>
      </section>

      {/* Featured Motion */}
      {content.fitChecks && content.fitChecks.length > 0 && (
        <section className="py-32 px-8 md:px-16 bg-[#0a0a0a] border-y border-white/5">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-24 items-center">
              <div className="space-y-8">
                 <div className="artifact-label text-red-600">IN MOTION</div>
                 <h2 className="text-4xl md:text-6xl serif-display italic font-light leading-none">
                    "Clothes aren't meant to be still."
                 </h2>
                 <p className="text-white/40 font-light max-w-md">
                   See how the garments interact with movement, light, and posture. The RAWLINE Fit Check is an essential part of the archival process.
                 </p>
                 <Link to="/fits" className="inline-block artifact-label border-b border-white/20 pb-1 hover:text-red-600 hover:border-red-600 transition-all">
                    WATCH ALL STUDIES
                 </Link>
              </div>
              <div className="aspect-[9/16] md:aspect-video bg-black overflow-hidden relative group">
                 {isVideoUrl(content.fitChecks[0].videoUrl) ? (
                    <video 
                      src={content.fitChecks[0].videoUrl} 
                      className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all duration-700"
                      muted
                      loop
                      autoPlay
                      playsInline
                    />
                 ) : (
                    <img 
                      src={content.fitChecks[0].videoUrl} 
                      className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all duration-700" 
                    />
                 )}
              </div>
           </div>
        </section>
      )}
    </div>
  );
};

const MainLayout: React.FC<{ 
  children: React.ReactNode;
  scrolled: boolean; 
  syncError: string | null; 
  content: SiteContent; 
  pieces: Piece[]; 
  loadData: () => void;
  setContent: (c: SiteContent) => void;
}> = ({ children, scrolled, syncError, content, pieces, loadData, setContent }) => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  return (
    <div className="min-h-screen bg-[#080808] text-white selection:bg-white selection:text-black font-sans">
      <motion.div className="fixed top-0 left-0 right-0 h-[1px] bg-white/20 z-[101] origin-[0%]" style={{ scaleX }} />
      <Navbar scrolled={scrolled} syncError={syncError} />
      
      {children}

      <Footer content={content} setContent={setContent} pieces={pieces} loadData={loadData} />
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
      if (cloudContent) setContent(prev => ({ ...prev, ...cloudContent }));
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
      <MainLayout scrolled={scrolled} syncError={syncError} content={content} pieces={pieces} loadData={loadData} setContent={setContent}>
        <Routes>
          <Route path="/" element={<HomePage content={content} pieces={pieces} />} />
          <Route path="/archive" element={<Archive pieces={pieces} />} />
          <Route path="/fits" element={<Fits content={content} />} />
          <Route path="/philosophy" element={<Philosophy content={content} />} />
          <Route path="/artifact/:id" element={<PieceDetail />} />
        </Routes>
      </MainLayout>
    </HashRouter>
  );
};

export default App;
