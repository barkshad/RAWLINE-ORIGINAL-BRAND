
import React, { useState, useEffect, useCallback } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import PieceCard from './components/PieceCard';
import AICurator from './components/AICurator';
import FadeInSection from './components/FadeInSection';
import AdminCMS from './components/AdminCMS';
import PieceDetail from './components/PieceDetail';
import { Piece, SiteContent } from './types';
import { getPieces, getSiteContent } from './services/firebaseService';

const DEFAULT_CONTENT: SiteContent = {
  heroTitle: "RAWLINE",
  heroSubTitle: "Identifying, collecting, and styling garments across time.",
  archiveStatementTitle: "THE RAW NOTION.",
  archiveStatementText1: "RAWLINE identifies, collects, styles, and archives vintage garments. Pieces are sourced across eras, documented, and preserved.",
  archiveStatementText2: "Some remain untouched. Some are styled into modern fits. Everything ends up on record.",
  footerTagline: "ESTABLISHED AS A LIVING RECORD OF STYLE"
};

const INITIAL_PIECES: Piece[] = [
  { id: '1', code: 'RL–ARCH–0001', era: '1990s', status: 'ARCHIVED', imageUrl: 'https://images.unsplash.com/photo-1520975916090-3105956dac38', material: 'Nylon / PVC', condition: 'Archive' },
  { id: '2', code: 'RL–ARCH–0002', era: 'Early 2000s', status: 'ACTIVE', imageUrl: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c', material: 'Raw Cotton', condition: 'Worn' },
  { id: '3', code: 'RL–ARCH–0003', era: '1990s', status: 'STUDY', imageUrl: 'https://images.unsplash.com/photo-1521335629791-ce4aec67dd47', material: 'Indigo Denim', condition: 'Reworked' },
  { id: '4', code: 'RL–ARCH–0004', era: 'Early 2000s', status: 'ACTIVE', imageUrl: 'https://images.unsplash.com/photo-1495385794356-15371f348c31', material: 'Polyester Mesh', condition: 'Archive' },
  { id: '5', code: 'RL–ARCH–0005', era: 'Late 1980s', status: 'ARCHIVED', imageUrl: 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3', material: 'Heavy Canvas', condition: 'Distressed' },
  { id: '6', code: 'RL–ARCH–0006', era: '1990s', status: 'RELEASED', imageUrl: 'https://images.unsplash.com/photo-1578681994506-b8f463449011', material: 'Synthetic Blend', condition: 'Clean' },
];

const MainLayout: React.FC<{ 
  scrolled: boolean; 
  syncError: string | null; 
  content: SiteContent; 
  pieces: Piece[]; 
  loadData: () => void;
  setContent: (c: SiteContent) => void;
}> = ({ scrolled, syncError, content, pieces, loadData, setContent }) => {
  return (
    <div className="min-h-screen bg-[#030303] text-white selection:bg-white selection:text-black font-sans overflow-x-hidden">
      {/* Global CRT Scanline Effect */}
      <div className="scanline z-[99] pointer-events-none fixed top-0 left-0 w-full h-full opacity-30" />

      {/* Sync Error Toast */}
      {syncError && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] bg-red-600 text-white px-6 py-3 rounded-none text-[10px] font-mono tracking-[0.4em] uppercase animate-bounce shadow-[0_0_30px_rgba(255,0,0,0.4)] border border-red-500/50 max-w-[90vw] text-center font-black">
          [!] SYNC_LINK_FAILURE: {syncError}
        </div>
      )}

      {/* Navigation */}
      <nav className={`fixed top-0 left-0 w-full z-50 px-6 md:px-16 lg:px-24 flex justify-between items-center transition-all duration-1000 ${scrolled ? 'bg-black/60 backdrop-blur-3xl py-6 md:py-8 border-b border-white/5' : 'bg-transparent py-10 md:py-16'}`}>
        <div className="flex items-center gap-6">
          <div className="text-3xl md:text-4xl font-serif font-bold italic tracking-tighter text-white">RAWLINE</div>
          <div className="hidden sm:block h-[1px] w-12 bg-white/10" />
        </div>
        
        <div className="hidden lg:flex gap-20 text-[10px] font-black uppercase tracking-[0.8em] text-white/20">
          <a href="#archive" className="hover:text-white hover:tracking-[1.2em] transition-all duration-700">ARCHIVE</a>
          <a href="#lab" className="hover:text-white hover:tracking-[1.2em] transition-all duration-700">STUDY</a>
          <a href="#philosophy" className="hover:text-white hover:tracking-[1.2em] transition-all duration-700">MANIFEST</a>
        </div>

        <div className="flex items-center gap-4 text-[9px] font-mono tracking-[0.4em] text-white/30 uppercase font-black">
          <span className="hidden xs:inline">{syncError ? 'OFFLINE' : 'LIVE_NODE'}</span>
          <div className={`w-2 h-2 rounded-full animate-pulse shadow-[0_0_15px] ${syncError ? 'bg-orange-500 shadow-orange-500/50' : 'bg-red-600 shadow-red-600/50'}`} />
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative min-h-screen flex flex-col justify-center px-6 sm:px-[12%] overflow-hidden bg-black pt-20">
        <div className="absolute inset-0 opacity-10 pointer-events-none overflow-hidden">
          <div className="absolute top-0 right-0 w-[80vw] h-[80vh] bg-gradient-radial from-red-600/20 to-transparent opacity-30 blur-[150px]" />
          <div className="absolute top-[20%] left-[65%] w-[1px] h-[70vh] bg-gradient-to-b from-transparent via-white/20 to-transparent rotate-12" />
        </div>

        <FadeInSection className="max-w-7xl z-10">
          <div className="mb-10 md:mb-20 flex items-center gap-6 md:gap-10 text-[11px] md:text-[13px] tracking-[0.8em] text-white/20 uppercase font-black">
            <span className="w-16 md:w-32 h-[1px] bg-white/10" /> MASTER_INDEX / v1.5
          </div>
          <h1 className="text-[clamp(4rem,22vw,18rem)] leading-[0.75] font-serif font-bold italic tracking-tighter mb-16 md:mb-24 text-white drop-shadow-2xl">
            {content.heroTitle}
          </h1>
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-32 items-start max-w-7xl">
            <div className="space-y-8 md:space-y-12">
                <p className="text-white text-2xl sm:text-4xl md:text-6xl max-w-3xl font-light tracking-tighter leading-[1.05] italic">
                    {content.heroSubTitle}
                </p>
                <div className="flex flex-wrap gap-8 md:gap-16 text-[10px] md:text-[11px] tracking-[0.5em] text-white/40 font-black uppercase border-t border-white/5 pt-10 md:pt-14">
                    <div className="flex items-center gap-4">
                       <span className="w-2 h-2 bg-red-600 animate-pulse" />
                       <span>{syncError ? 'CACHE_MODE' : 'CLOUD_STABLE'}</span>
                    </div>
                    <span>COVERAGE: 1950—PRESENT</span>
                </div>
            </div>
            <div className="flex flex-col gap-2 text-[9px] md:text-[11px] font-mono text-white/20 uppercase tracking-[0.6em] border border-white/5 p-8 md:p-12 glass-panel w-full lg:w-auto mt-10 lg:mt-0">
              <span className="text-red-600 mb-4 font-black">SYSTEM_SEQUENCE:</span>
              <span className="opacity-100 text-white/40">[01] ANALYZE_MORPHEME</span>
              <span className="opacity-80">[02] IDENTIFY_SILHOUETTE</span>
              <span className="opacity-60">[03] CATEGORIZE_HARDWARE</span>
              <span className="opacity-40">[04] ARCHIVE_RECORD</span>
            </div>
          </div>
        </FadeInSection>
        
        <div className="relative mt-20 lg:absolute lg:bottom-24 lg:left-[12%] group pb-16 lg:pb-0">
          <div className="flex items-center gap-8 md:gap-16">
            <div className="hidden sm:flex flex-col items-center gap-6">
                <span className="text-[10px] tracking-[1em] text-white/10 uppercase vertical-text font-black">DATA_STREAM</span>
                <div className="w-[1px] h-24 bg-gradient-to-t from-red-600/40 to-transparent group-hover:h-32 transition-all duration-1000" />
            </div>
            <p className="max-w-sm text-[11px] md:text-[13px] text-white/30 uppercase tracking-[0.2em] font-mono italic font-bold leading-loose">
              Every garment undergoes a high-fidelity scan for archival documentation. Sourcing the past to influence the future.
            </p>
          </div>
        </div>
      </header>

      {/* Manifest Section */}
      <section id="philosophy" className="py-48 sm:py-72 lg:py-96 px-6 sm:px-[12%] relative border-y border-white/5 bg-[#050505]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 lg:gap-40">
          <div className="lg:col-span-5 flex flex-col justify-between">
             <FadeInSection>
                <div className="flex items-center gap-6 mb-12">
                   <div className="w-4 h-4 bg-red-600 rounded-full animate-pulse" />
                   <h2 className="text-[11px] uppercase tracking-[1em] text-white/30 font-black">ARCHIVE_MANIFEST</h2>
                </div>
                <div className="text-7xl sm:text-9xl font-serif font-bold italic tracking-tighter leading-[0.75] text-white mb-12 lg:mb-0 drop-shadow-2xl">
                  {content.archiveStatementTitle}
                </div>
             </FadeInSection>
          </div>
          <div className="lg:col-span-7 space-y-16 lg:space-y-32 text-2xl sm:text-4xl md:text-6xl text-white/50 font-light leading-[1] tracking-tighter max-w-6xl">
            <FadeInSection delay={200}>
              <p>
                <span className="text-white font-serif italic font-black underline decoration-red-600/30 underline-offset-[12px]">RAWLINE</span> {content.archiveStatementText1.replace('RAWLINE', '')}
              </p>
            </FadeInSection>
            <FadeInSection delay={400}>
              <p className="text-white font-medium italic border-l border-white/10 pl-10 md:pl-20 py-4">
                {content.archiveStatementText2}
              </p>
            </FadeInSection>
            <FadeInSection delay={600}>
               <div className="text-[11px] md:text-[14px] font-mono tracking-[0.4em] text-red-600/60 font-black uppercase leading-loose">
                  [!] THIS IS NOT TREND FORECASTING. THIS IS OBSERVATION OVER TIME. DATA REVEALS ALL TRUTHS.
               </div>
            </FadeInSection>
          </div>
        </div>
      </section>

      {/* Archive Database */}
      <section id="archive" className="py-48 sm:py-72 lg:py-96 px-6 sm:px-[12%]">
        <FadeInSection className="mb-32 md:mb-64 flex flex-col lg:flex-row justify-between items-start lg:items-end gap-12 md:gap-24">
          <div className="space-y-6 md:space-y-8">
            <h2 className="text-6xl sm:text-8xl lg:text-[10rem] font-black tracking-tighter text-white uppercase leading-none italic">Archive_Index</h2>
            <div className="flex items-center gap-6 md:gap-10">
              <span className="w-12 md:w-24 h-[1px] bg-red-600/40" />
              <div className="text-[10px] md:text-[14px] tracking-[0.8em] text-white/30 uppercase font-black">
                {syncError ? 'DATABASE_OFFLINE_CACHE' : 'DATABASE_CLOUD_SYNC'} // {pieces.length} RECORDS_FOUND
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-4 font-mono text-[10px] text-white/40 font-black w-full lg:w-auto">
            {['SORT_ALL', 'ERA_FILTER', 'STATUS_CODE'].map(btn => (
              <button key={btn} className="flex-1 lg:flex-none border border-white/5 px-6 md:px-12 py-4 md:py-6 hover:text-black hover:bg-white transition-all cursor-none uppercase tracking-[0.4em] text-center whitespace-nowrap glass-panel">{btn}</button>
            ))}
          </div>
        </FadeInSection>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-24 md:gap-x-20 md:gap-y-40">
          {pieces.map((piece, idx) => (
            <FadeInSection key={piece.id} delay={idx % 3 * 100} className={idx % 3 === 1 ? 'lg:mt-32' : idx % 3 === 2 ? 'lg:mt-64' : ''}>
              <PieceCard piece={piece} />
            </FadeInSection>
          ))}
        </div>
      </section>

      {/* AI Laboratory */}
      <section id="lab" className="py-48 sm:py-72 lg:py-96 px-6 sm:px-[12%] relative overflow-hidden bg-[#030303] border-y border-white/5">
        <div className="absolute top-0 right-0 w-[60vw] h-[60vh] bg-red-600/[0.04] blur-[150px] rounded-full pointer-events-none" />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 lg:gap-48 items-start">
          <FadeInSection>
            <div className="flex items-center gap-6 mb-16">
               <div className="w-12 h-[1px] bg-red-600" />
               <h2 className="text-[11px] uppercase tracking-[1em] text-white/30 font-black">MORPHOLOGY_LAB</h2>
            </div>
            <h3 className="text-7xl sm:text-9xl lg:text-[12rem] font-serif font-bold italic tracking-tighter mb-16 md:mb-24 leading-[0.7] text-white">
              VIRTUAL<br /><span className="text-white/5 font-sans font-black italic">ANALYSIS.</span>
            </h3>
            <p className="text-white/40 text-2xl sm:text-3xl md:text-5xl leading-[1.1] mb-20 md:mb-32 font-light tracking-tighter max-w-2xl italic serif">
              Initiate a high-fidelity morphological scan. Our laboratory cross-references industrial silhouettes, era data, and hardware quality to determine archival integrity.
            </p>
            
            <div className="space-y-12 md:space-y-16">
               {[
                 { label: "Hardware Audit", desc: "Analysis of zippers, rivets, and functional fasteners" },
                 { label: "Pattern Recognition", desc: "Cross-referencing silhouette data via neural nodes" },
                 { label: "Archival Rank", desc: "Determining historical and industrial grade" }
               ].map((item, i) => (
                 <div key={i} className="flex gap-8 md:gap-12 group border-b border-white/5 pb-10 md:pb-14 last:border-0">
                   <span className="text-[12px] md:text-[14px] font-mono text-red-600 font-black tracking-widest">[0{i+1}]</span>
                   <div className="space-y-3">
                     <div className="text-xl md:text-3xl font-black tracking-[0.2em] text-white/80 uppercase group-hover:text-white transition-colors">{item.label}</div>
                     <div className="text-[10px] md:text-[12px] font-mono text-white/20 uppercase tracking-[0.4em] font-bold italic">{item.desc}</div>
                   </div>
                 </div>
               ))}
            </div>
          </FadeInSection>
          
          <FadeInSection delay={200} className="lg:sticky lg:top-48">
            <AICurator />
          </FadeInSection>
        </div>
      </section>

      {/* Marquee */}
      <div className="py-24 border-b border-white/5 bg-[#030303] overflow-hidden select-none">
        <div className="flex whitespace-nowrap animate-marquee opacity-10">
          {[1,2,3,4].map(i => (
            <div key={i} className="text-[25vw] lg:text-[20vw] font-serif font-bold italic text-white uppercase px-16 md:px-32 tracking-[-0.05em]">
              RAWLINE-RAWLINE-
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="py-48 sm:py-72 px-6 sm:px-[12%] border-t border-white/5 bg-[#010101]">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-24 lg:gap-48">
          <div className="space-y-12 md:space-y-20 text-left">
            <div className="text-6xl sm:text-8xl font-serif font-bold italic tracking-tighter text-white">RAWLINE</div>
            <div className="space-y-6 text-left">
              <p className="text-[11px] font-mono text-red-600 tracking-[0.8em] uppercase font-black">SYSTEM_INDEX // v1.5_STABLE</p>
              <p className="text-[10px] md:text-[11px] font-mono text-white/20 tracking-[0.4em] uppercase font-bold max-w-sm leading-relaxed">Dedicated to the preservation and analysis of industrial garments across history.</p>
              <div className="flex gap-4 pt-4">
                 <div className="w-3 h-3 rounded-full bg-red-600 animate-pulse shadow-[0_0_10px_rgba(255,0,0,0.4)]" />
                 <div className="w-3 h-3 bg-white/10 rounded-full" />
                 <div className="w-3 h-3 bg-white/10 rounded-full" />
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-24 md:gap-40 text-[11px] md:text-[13px] font-mono text-white/20 uppercase tracking-[0.6em] font-black w-full lg:w-auto">
            <div className="space-y-10">
              <span className="text-white block border-b border-white/5 pb-6">NAVIGATE</span>
              <a href="#" className="block hover:text-white transition-all hover:tracking-[1em]">INDEX</a>
              <a href="#lab" className="block hover:text-white transition-all hover:tracking-[1em]">STUDY</a>
            </div>
            <div className="space-y-10">
              <span className="text-white block border-b border-white/5 pb-6">NETWORK</span>
              <a href="#" className="block hover:text-white transition-all hover:tracking-[1em]">INSTAGRAM</a>
              <a href="#" className="block hover:text-white transition-all hover:tracking-[1em]">CLOUD_DUMP</a>
            </div>
            <div className="space-y-10">
              <span className="text-white block border-b border-white/5 pb-6">TERMINAL</span>
              <div className="block group">
                <AdminCMS 
                  content={content} 
                  onUpdateContent={setContent} 
                  pieces={pieces} 
                  onRefreshPieces={loadData} 
                />
              </div>
              <span className="block text-white/5 italic text-[10px] md:text-[11px] font-bold mt-4 uppercase tracking-widest">© {new Date().getFullYear()} RAWLINE_FOUNDRY. PROPRIETARY.</span>
            </div>
          </div>
        </div>
        
        <div className="mt-48 md:mt-72 flex flex-col md:flex-row justify-between items-start md:items-end border-t border-white/5 pt-16 md:pt-24 gap-12">
          <span className="text-[11px] md:text-[14px] font-mono text-white/40 uppercase tracking-[1em] font-black">{content.footerTagline}</span>
          <span className="text-[9px] md:text-[11px] font-mono text-white/10 uppercase tracking-[0.8em] italic font-bold">SECURE_ARCHIVE_NODE_ACTIVE</span>
        </div>
      </footer>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 40s linear infinite;
        }
      `}</style>
    </div>
  );
};

const App: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [content, setContent] = useState<SiteContent>(DEFAULT_CONTENT);
  const [pieces, setPieces] = useState<Piece[]>(INITIAL_PIECES);
  const [syncError, setSyncError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      setSyncError(null);
      const cloudContent = await getSiteContent();
      if (cloudContent) setContent(cloudContent);
      
      const cloudPieces = await getPieces();
      if (cloudPieces && cloudPieces.length > 0) {
        setPieces(cloudPieces);
      }
    } catch (error: any) {
      console.error("Data synchronization error:", error);
      if (error.code === 'permission-denied' || error.message?.includes('permission')) {
        setSyncError("ACCESS_RESTRICTED");
      } else {
        setSyncError(`LINK_FAILED_${error.code || 'NULL'}`);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener('scroll', handleScroll, { passive: true });
    loadData();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadData]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#030303] flex items-center justify-center font-mono p-4">
        <div className="flex flex-col items-center gap-10 text-center">
           <div className="w-20 h-20 border-4 border-red-600/20 border-t-red-600 rounded-full animate-spin shadow-[0_0_30px_rgba(255,0,0,0.2)]" />
           <div className="space-y-2">
             <div className="text-white text-2xl md:text-3xl font-black tracking-[1em] animate-pulse">RAWLINE</div>
             <div className="text-white/20 text-[10px] uppercase tracking-[0.8em] font-black">INITIALIZING_LOCAL_NODES...</div>
           </div>
        </div>
      </div>
    );
  }

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={
          <MainLayout 
            scrolled={scrolled} 
            syncError={syncError} 
            content={content} 
            pieces={pieces} 
            loadData={loadData}
            setContent={setContent}
          />
        } />
        <Route path="/artifact/:id" element={<PieceDetail />} />
      </Routes>
    </HashRouter>
  );
};

export default App;
