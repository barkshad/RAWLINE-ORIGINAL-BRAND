
import React, { useState, useEffect, useCallback } from 'react';
import PieceCard from './components/PieceCard';
import AICurator from './components/AICurator';
import FadeInSection from './components/FadeInSection';
import AdminCMS from './components/AdminCMS';
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
        setSyncError("Access Blocked: Update Firestore Rules.");
      } else {
        setSyncError(`Link Failed: ${error.code || 'Offline'}`);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll, { passive: true });
    loadData();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadData]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center font-mono p-4">
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="text-white text-xl md:text-2xl font-bold tracking-[0.5em] md:tracking-[1em] animate-pulse">RAWLINE</div>
          <div className="text-white/20 text-[9px] uppercase tracking-[0.4em]">Establishing_Cloud_Link...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black font-sans overflow-x-hidden">
      {/* Global CRT Scanline Effect */}
      <div className="scanline z-[99] pointer-events-none fixed top-0 left-0 w-full h-full opacity-30" />

      {/* Sync Error Toast */}
      {syncError && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] bg-red-600/90 text-white px-4 py-2 rounded-md text-[8px] md:text-[10px] font-mono tracking-widest uppercase animate-bounce shadow-2xl border border-white/20 max-w-[90vw] text-center">
          [!] {syncError}
        </div>
      )}

      {/* Navigation */}
      <nav className={`fixed top-0 left-0 w-full z-50 p-4 md:p-8 lg:p-12 flex justify-between items-center transition-all duration-700 ${scrolled ? 'bg-black/80 backdrop-blur-xl py-4 md:py-6 border-b border-white/5' : 'bg-transparent'}`}>
        <div className="flex items-center gap-3 md:gap-5">
          <div className="text-2xl md:text-4xl font-serif font-bold italic tracking-[-0.05em] text-white">RAWLINE</div>
          <div className="hidden sm:block h-[1px] w-8 md:w-12 bg-white/10" />
        </div>
        
        <div className="hidden lg:flex gap-16 text-[9px] font-bold uppercase tracking-[0.6em] text-white/30">
          <a href="#archive" className="hover:text-white transition-all duration-700 hover:tracking-[1em]">ARCHIVE</a>
          <a href="#lab" className="hover:text-white transition-all duration-700 hover:tracking-[1em]">STUDIES</a>
          <a href="#social" className="hover:text-white transition-all duration-700 hover:tracking-[1em]">RELEASED</a>
        </div>

        <div className="flex items-center gap-3 md:gap-4 text-[7px] md:text-[8px] font-mono tracking-widest text-white/30 uppercase font-black">
          <span className="hidden xs:inline">{syncError ? 'OFFLINE_MODE' : 'CORE_READY'}</span>
          <div className={`w-1.5 h-1.5 rounded-full animate-pulse shadow-[0_0_8px] ${syncError ? 'bg-orange-500 shadow-orange-500' : 'bg-red-600 shadow-red-600'}`} />
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative min-h-[90vh] md:min-h-screen flex flex-col justify-center px-6 sm:px-[10%] overflow-hidden bg-black pt-20">
        <div className="absolute inset-0 opacity-10 pointer-events-none overflow-hidden">
          <div className="absolute top-[20%] left-[60%] w-[1px] h-[60vh] bg-gradient-to-b from-transparent via-white/40 to-transparent rotate-12" />
          <div className="absolute bottom-[20%] left-[20%] w-[1px] h-[40vh] bg-gradient-to-t from-transparent via-white/40 to-transparent -rotate-12" />
        </div>

        <FadeInSection className="max-w-7xl z-10">
          <div className="mb-6 md:mb-12 flex items-center gap-4 md:gap-8 text-[9px] md:text-[11px] tracking-[0.5em] md:tracking-[0.8em] text-white/30 uppercase font-black">
            <span className="w-12 md:w-24 h-[1px] bg-white/10" /> VINTAGE ARCHIVE / SYSTEM_NODE
          </div>
          <h1 className="text-[clamp(3rem,18vw,14rem)] leading-[0.8] font-serif font-bold italic tracking-[-0.05em] mb-10 md:mb-16 text-white break-words">
            {content.heroTitle}
          </h1>
          <div className="flex flex-col lg:flex-row gap-10 lg:gap-20 items-baseline max-w-6xl">
            <div className="space-y-6 md:space-y-8">
                <p className="text-white text-lg sm:text-2xl md:text-5xl max-w-2xl font-light tracking-tight leading-[1.2] md:leading-[1.1]">
                    {content.heroSubTitle}
                </p>
                <div className="flex flex-wrap gap-6 md:gap-12 text-[8px] md:text-[10px] tracking-[0.2em] md:tracking-[0.3em] text-white/60 font-bold uppercase border-t border-white/10 pt-6 md:pt-8">
                    <span>DB: {syncError ? 'LOCAL_STORAGE' : 'ACTIVE_LINK'}</span>
                    <span>COV: 1950—PRESENT</span>
                </div>
            </div>
            <div className="flex flex-col gap-1 text-[8px] md:text-[9px] font-mono text-white/30 uppercase tracking-[0.3em] md:tracking-[0.5em] border border-white/5 p-4 md:p-6 bg-white/[0.01] w-full lg:w-auto">
              <span className="text-white/50 mb-1 md:mb-2 font-bold uppercase">Sequence:</span>
              <span>[1] SCAN_ARTIFACT</span>
              <span>[2] PARSE_DATA</span>
              <span>[3] STYLE_FIT</span>
              <span>[4] PERSIST_RECORD</span>
            </div>
          </div>
        </FadeInSection>
        
        <div className="relative mt-20 lg:absolute lg:bottom-20 lg:left-[10%] group pb-10 lg:pb-0">
          <div className="flex items-center gap-6 md:gap-12">
            <div className="hidden sm:flex flex-col items-center gap-4">
                <span className="text-[8px] md:text-[9px] tracking-[0.4em] md:tracking-[0.6em] text-white/30 uppercase vertical-text font-black">SCROLL_ENTRY</span>
                <div className="w-[1px] h-16 md:h-24 bg-gradient-to-t from-white/20 to-transparent group-hover:h-32 transition-all duration-700" />
            </div>
            <p className="max-w-xs text-[9px] md:text-[11px] text-white/40 uppercase tracking-[0.15em] md:tracking-[0.2em] font-mono italic font-medium leading-relaxed">
              Every artifact is identified and archived into the cloud. A living record of style evolution.
            </p>
          </div>
        </div>
      </header>

      {/* Archive Statement Section */}
      <section id="philosophy" className="py-24 sm:py-48 lg:py-72 px-6 sm:px-[10%] relative border-y border-white/5 bg-[#080808]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-32">
          <div className="lg:col-span-5 flex flex-col justify-between">
             <FadeInSection>
                <h2 className="text-[9px] uppercase tracking-[0.5em] md:tracking-[0.8em] text-white/20 font-black mb-8 md:mb-16 underline decoration-red-600 decoration-4 underline-offset-8">ARCHIVE STATEMENT</h2>
                <div className="text-5xl sm:text-7xl lg:text-9xl font-serif font-bold italic tracking-tighter leading-[0.8] text-white mb-8 lg:mb-12">
                  {content.archiveStatementTitle}
                </div>
                <div className="text-[8px] font-mono text-white/40 uppercase tracking-[0.3em] mt-auto font-black italic hidden lg:block">System_Ready: 2024_EST</div>
             </FadeInSection>
          </div>
          <div className="lg:col-span-7 space-y-12 lg:space-y-20 text-xl sm:text-2xl md:text-4xl text-white/60 font-light leading-[1.2] lg:leading-[1.1] tracking-tighter max-w-5xl">
            <FadeInSection delay={100}>
              <p>
                <span className="text-white font-serif italic font-black">RAWLINE</span> {content.archiveStatementText1.replace('RAWLINE', '')}
              </p>
            </FadeInSection>
            <FadeInSection delay={200}>
              <p className="text-white/80 font-medium italic">
                {content.archiveStatementText2}
              </p>
            </FadeInSection>
            <FadeInSection delay={300}>
              <div className="border-l-2 border-red-600/30 pl-6 lg:pl-12 py-2 lg:py-4">
                <p className="italic font-mono text-[10px] sm:text-[13px] tracking-tight text-white/40 leading-relaxed uppercase font-bold">
                  "THIS IS NOT TREND FORECASTING. THIS IS OBSERVATION OVER TIME. IF YOU FEEL IT — YOU ALREADY KNOW."
                </p>
              </div>
            </FadeInSection>
          </div>
        </div>
      </section>

      {/* Archive Database */}
      <section id="archive" className="py-24 sm:py-48 lg:py-72 px-6 sm:px-[10%]">
        <FadeInSection className="mb-20 md:mb-40 flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10 md:gap-16">
          <div className="space-y-4 md:space-y-6">
            <h2 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tighter text-white uppercase">Archive_Index</h2>
            <div className="flex items-center gap-4 md:gap-6">
              <span className="w-8 md:w-16 h-[1px] bg-white/10" />
              <div className="text-[9px] md:text-[12px] tracking-[0.4em] md:tracking-[0.6em] text-white/30 uppercase font-black">
                {syncError ? 'DB_LOCAL' : 'DB_SYNCED'} // {pieces.length} RECORDS
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-4 font-mono text-[9px] text-white/60 font-bold w-full lg:w-auto">
            {['ALL', 'ERA', 'STATUS'].map(btn => (
              <button key={btn} className="flex-1 lg:flex-none border border-white/10 px-4 md:px-8 py-3 md:py-4 hover:text-black hover:bg-white transition-all cursor-none uppercase tracking-widest text-center whitespace-nowrap">{btn}</button>
            ))}
          </div>
        </FadeInSection>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16 md:gap-x-12 md:gap-y-24">
          {pieces.map((piece, idx) => (
            <FadeInSection key={piece.id} delay={idx % 3 * 100} className={idx % 3 === 1 ? 'lg:mt-16' : idx % 3 === 2 ? 'lg:mt-32' : ''}>
              <PieceCard piece={piece} />
            </FadeInSection>
          ))}
        </div>
      </section>

      {/* AI Laboratory */}
      <section id="lab" className="py-24 sm:py-48 lg:py-72 px-6 sm:px-[10%] relative overflow-hidden bg-black border-y border-white/5">
        <div className="absolute top-0 right-0 w-[50vw] h-[50vh] bg-red-600/[0.03] blur-[150px] rounded-full pointer-events-none" />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 lg:gap-40 items-start">
          <FadeInSection>
            <h2 className="text-[9px] uppercase tracking-[0.5em] md:tracking-[0.8em] text-white/30 font-black mb-10 md:mb-20 underline decoration-red-600 decoration-4 underline-offset-8">ARCHIVE LAB / SCAN</h2>
            <h3 className="text-5xl sm:text-7xl lg:text-9xl font-serif font-bold italic tracking-tighter mb-10 md:mb-20 leading-[0.8] text-white">
              VIRTUAL<br /><span className="text-white/10 font-sans font-black italic">MORPHOLOGY.</span>
            </h3>
            <p className="text-white/50 text-lg sm:text-2xl md:text-3xl leading-snug mb-10 md:mb-20 font-light tracking-tighter max-w-xl italic">
              Initiate a morphological scan to determine archival integrity. Our node cross-references hardware, era, and silhouette.
            </p>
            
            <div className="space-y-8 md:space-y-12">
               {[
                 { label: "Hardware Audit", desc: "Industrial zippers, buttons, and fasteners" },
                 { label: "Morphology scan", desc: "Identifying era via silhouette and weave structure" },
                 { label: "Archive Grade", desc: "Technical determination of archival rank" }
               ].map((item, i) => (
                 <div key={i} className="flex gap-6 md:gap-10 group border-b border-white/5 pb-6 md:pb-8 last:border-0">
                   <span className="text-[10px] md:text-[12px] font-mono text-red-600 group-hover:text-red-500 transition-colors font-black">0{i+1}</span>
                   <div className="space-y-1 md:space-y-2">
                     <div className="text-sm md:text-lg font-bold tracking-widest text-white/80 uppercase">{item.label}</div>
                     <div className="text-[9px] md:text-[11px] font-mono text-white/30 uppercase tracking-[0.15em] md:tracking-[0.2em]">{item.desc}</div>
                   </div>
                 </div>
               ))}
            </div>
          </FadeInSection>
          
          <FadeInSection delay={200} className="lg:sticky lg:top-40">
            <AICurator />
          </FadeInSection>
        </div>
      </section>

      {/* Industrial Marquee */}
      <div className="py-16 sm:py-32 border-b border-white/5 bg-black overflow-hidden select-none">
        <div className="flex whitespace-nowrap animate-marquee opacity-20">
          {[1,2,3,4].map(i => (
            <div key={i} className="text-[20vw] lg:text-[14vw] font-serif font-bold italic text-white uppercase px-10 md:px-24 tracking-[-0.05em]">
              RAWLINE-RAWLINE-
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="py-24 sm:py-48 px-6 sm:px-[10%] border-t border-white/5 bg-[#050505]">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-16 lg:gap-40">
          <div className="space-y-8 md:space-y-12 text-left">
            <div className="text-5xl sm:text-7xl font-serif font-bold italic tracking-[-0.05em] text-white">RAWLINE</div>
            <div className="space-y-3 md:space-y-4 text-left">
              <p className="text-[9px] md:text-[10px] font-mono text-white/60 tracking-[0.3em] md:tracking-[0.5em] uppercase font-black">VINTAGE ARCHIVE // {syncError ? 'CACHE' : 'CLOUD'}</p>
              <p className="text-[9px] md:text-[10px] font-mono text-white/40 tracking-[0.3em] md:tracking-[0.5em] uppercase font-bold max-w-xs">Sourcing the past to influence the future.</p>
              <div className="flex gap-4 pt-2 md:pt-4">
                 <div className={`w-2 h-2 rounded-full animate-pulse ${syncError ? 'bg-orange-500' : 'bg-green-500'}`} />
                 <div className="w-2 h-2 bg-red-600 rounded-full" />
                 <div className="w-2 h-2 bg-blue-600 rounded-full" />
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-16 md:gap-32 text-[10px] md:text-[11px] font-mono text-white/40 uppercase tracking-[0.3em] md:tracking-[0.4em] font-bold w-full lg:w-auto">
            <div className="space-y-6 md:space-y-8">
              <span className="text-white block border-b border-white/5 pb-4 md:pb-6 font-black tracking-[0.2em]">DIRECT</span>
              <a href="#" className="block hover:text-white transition-colors">INDEX</a>
              <a href="#lab" className="block hover:text-white transition-colors">STUDIES</a>
            </div>
            <div className="space-y-6 md:space-y-8">
              <span className="text-white block border-b border-white/5 pb-4 md:pb-6 font-black tracking-[0.2em]">CONNECT</span>
              <a href="#" className="block hover:text-white transition-colors">INSTAGRAM</a>
              <a href="#" className="block hover:text-white transition-colors">RELEASED</a>
            </div>
            <div className="space-y-6 md:space-y-8">
              <span className="text-white block border-b border-white/5 pb-4 md:pb-6 font-black tracking-[0.2em]">TERMINAL</span>
              <div className="block text-white/60 underline decoration-white/10 font-black">
                <AdminCMS 
                  content={content} 
                  onUpdateContent={setContent} 
                  pieces={pieces} 
                  onRefreshPieces={loadData} 
                />
              </div>
              <span className="block italic text-[9px] md:text-[10px] font-bold mt-2">© {new Date().getFullYear()} RAWLINE FOUNDRY</span>
            </div>
          </div>
        </div>
        
        <div className="mt-24 md:mt-48 flex flex-col md:flex-row justify-between items-start md:items-end border-t border-white/5 pt-10 md:pt-16 gap-6">
          <span className="text-[9px] md:text-[11px] font-mono text-white/70 uppercase tracking-[0.3em] md:tracking-[0.5em] font-black">{content.footerTagline}</span>
          <span className="text-[8px] md:text-[9px] font-mono text-white/40 uppercase tracking-[0.4em] md:tracking-[0.6em] italic font-bold">ENCRYPTED_ARCHIVE_NODE_CONNECTED</span>
        </div>
      </footer>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        @media (max-width: 640px) {
          .animate-marquee {
            animation-duration: 20s;
          }
        }
      `}</style>
    </div>
  );
};

export default App;
