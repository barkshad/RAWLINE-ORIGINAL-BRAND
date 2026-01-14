
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Piece } from '../types';
import { getPieces } from '../services/firebaseService';
import { getOptimizedUrl } from '../services/cloudinaryService';
import FadeInSection from './FadeInSection';

const PieceDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [piece, setPiece] = useState<Piece | null>(null);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState<string>('');

  useEffect(() => {
    const fetchPiece = async () => {
      const pieces = await getPieces();
      const found = pieces.find(p => p.id === id);
      if (found) {
        setPiece(found);
        setMainImage(found.imageUrl);
      }
      setLoading(false);
      window.scrollTo(0, 0);
    };
    fetchPiece();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center font-mono p-4">
        <div className="flex flex-col items-center gap-6">
           <div className="w-16 h-[1px] bg-red-600 animate-[holographic_1.5s_infinite_linear] bg-size-200" />
           <div className="text-white text-[10px] uppercase tracking-[1em] animate-pulse">EXTRACTING_MANIFEST...</div>
        </div>
      </div>
    );
  }

  if (!piece) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center font-mono p-4 gap-8">
        <div className="text-red-600 text-[12px] uppercase tracking-[0.6em] font-black">CRITICAL: RECORD_NOT_FOUND</div>
        <Link to="/" className="text-white border border-white/10 px-10 py-4 text-[10px] uppercase tracking-[0.4em] hover:bg-white hover:text-black transition-all cursor-none font-black">BACK_TO_ARCHIVE_CORE</Link>
      </div>
    );
  }

  const allImages = [piece.imageUrl, ...(piece.additionalImages || [])];

  return (
    <div className="min-h-screen bg-[#030303] text-white selection:bg-white selection:text-black font-sans pb-48">
      <div className="scanline z-[99] pointer-events-none fixed top-0 left-0 w-full h-full opacity-30" />
      <div className="vignette" />
      
      {/* Navigation Dossier Header */}
      <nav className="fixed top-0 left-0 w-full z-50 p-6 md:p-10 flex justify-between items-center glass-panel border-b-0">
        <div className="flex items-center gap-8">
           <Link to="/" className="text-3xl md:text-4xl font-serif font-bold italic tracking-tighter hover:opacity-50 transition-all duration-500">RAWLINE</Link>
           <div className="hidden sm:block w-[1px] h-8 bg-white/10" />
           <div className="hidden sm:block text-[9px] font-mono text-white/30 uppercase tracking-[0.5em] font-black">
              ARTIFACT_DOSSIER_v1.5
           </div>
        </div>
        <Link to="/" className="text-[9px] md:text-[11px] font-mono tracking-[0.4em] text-red-600 uppercase hover:tracking-[0.8em] transition-all font-black flex items-center gap-4">
          <span className="hidden xs:block">EXIT_TO_INDEX</span>
          <span className="text-lg">×</span>
        </Link>
      </nav>

      <div className="pt-40 md:pt-64 px-6 sm:px-[12%]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
          
          {/* Visual Column */}
          <div className="lg:col-span-7 space-y-12">
            <FadeInSection className="relative aspect-[4/5] overflow-hidden group shadow-2xl">
              <div className="absolute inset-0 z-20 pointer-events-none holographic-overlay opacity-30 animate-[holographic_8s_infinite_linear]" />
              <div className="absolute top-6 left-6 z-30 text-[9px] font-mono bg-black/80 backdrop-blur-md px-3 py-1.5 border border-white/10 uppercase tracking-[0.4em] font-black">
                REF_IMG: {piece.code}
              </div>
              <img 
                src={getOptimizedUrl(mainImage, 1600)} 
                alt={piece.code} 
                className="w-full h-full object-cover grayscale transition-all duration-1000 group-hover:grayscale-0 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent pointer-events-none opacity-60" />
            </FadeInSection>

            {/* Gallery Strip with physics-like spacing */}
            <div className="grid grid-cols-5 md:grid-cols-8 gap-4">
              {allImages.map((img, i) => (
                <button 
                  key={i} 
                  onClick={() => setMainImage(img)}
                  className={`aspect-square transition-all duration-700 overflow-hidden cursor-none border-2 ${mainImage === img ? 'border-red-600 scale-105 shadow-[0_0_15px_rgba(255,0,0,0.3)]' : 'border-white/5 opacity-30 hover:opacity-100'}`}
                >
                  <img src={getOptimizedUrl(img, 300)} className="w-full h-full object-cover grayscale" />
                </button>
              ))}
            </div>
          </div>

          {/* Metadata Column */}
          <div className="lg:col-span-5 space-y-16">
            <FadeInSection delay={200} className="space-y-8">
              <div className="flex items-center gap-6">
                <span className="w-16 h-[1px] bg-red-600 shadow-[0_0_10px_rgba(255,0,0,0.5)]" />
                <span className="text-[10px] tracking-[0.8em] text-white/30 uppercase font-black">TECHNICAL_MANIFEST</span>
              </div>
              
              <div className="space-y-4">
                <h1 className="text-7xl md:text-8xl lg:text-9xl font-serif font-bold italic tracking-tighter leading-none text-white drop-shadow-2xl">
                  {piece.code}
                </h1>
                <div className="flex flex-wrap gap-4">
                  <span className="text-[11px] font-mono px-4 py-1.5 glass-panel text-red-600 uppercase tracking-[0.4em] font-black">
                    STATUS: {piece.status}
                  </span>
                  <span className="text-[11px] font-mono px-4 py-1.5 glass-panel text-white/40 uppercase tracking-[0.4em] font-bold">
                    ERA: {piece.era}
                  </span>
                </div>
              </div>
            </FadeInSection>

            <FadeInSection delay={400} className="space-y-16 pt-16 border-t border-white/5">
              <div className="grid grid-cols-2 gap-x-12 gap-y-12">
                {[
                  { label: "Material Composition", value: piece.material || 'Archive Blend' },
                  { label: "Artifact Condition", value: piece.condition || 'A-Grade' },
                  { label: "Category Rank", value: piece.classification || 'Master Piece' },
                  { label: "Record Index", value: id?.slice(-8).toUpperCase() }
                ].map((item, i) => (
                  <div key={i} className="space-y-3">
                    <span className="block text-[9px] font-mono text-white/20 uppercase tracking-[0.5em] font-black">{item.label}</span>
                    <span className="block text-lg md:text-xl text-white font-black tracking-tight uppercase leading-tight italic">{item.value}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-6">
                <span className="block text-[10px] font-mono text-red-600/40 uppercase tracking-[0.6em] font-black underline decoration-red-600/20 underline-offset-8">ARCHIVAL_ANALYSIS</span>
                <p className="text-2xl md:text-3xl text-white/70 leading-[1.3] font-light tracking-tighter max-w-xl italic serif">
                  {piece.description || "System generated description: This artifact cross-references high-industrial silhouettes with textile innovations. Curated for the permanent collection due to its morphological purity and era-defining hardware accents."}
                </p>
              </div>

              <div className="glass-panel p-10 space-y-6 relative overflow-hidden group">
                 <div className="absolute top-0 left-0 w-full h-1 bg-red-600/20" />
                 <div className="absolute top-0 left-0 w-[94%] h-1 bg-red-600 shadow-[0_0_15px_rgba(255,0,0,0.5)]" />
                 
                 <div className="flex justify-between items-center text-[10px] font-mono uppercase tracking-[0.6em] text-white/30 font-black">
                    <span>ARCHIVE_GRADE: ALPHA</span>
                    <span className="text-red-600 animate-pulse">VERIFIED</span>
                 </div>
                 <div className="text-[11px] font-mono text-white/50 uppercase tracking-widest leading-relaxed">
                   Cross-referenced with internal database. No further study required. Ready for catalog release.
                 </div>
              </div>

              <div className="pt-10 flex flex-col gap-4">
                 <button onClick={() => window.print()} className="w-full h-20 border border-white/10 hover:border-red-600/50 hover:bg-red-600/5 transition-all text-[11px] font-mono uppercase tracking-[0.8em] font-black cursor-none group">
                    <span className="group-hover:text-red-600 transition-colors">GENERATE_PHYSICAL_RECORD</span>
                 </button>
                 <div className="text-[8px] font-mono text-center text-white/10 uppercase tracking-[0.5em] font-bold">
                    System_ID: RAWLINE_NODE_PRIMARY_LINK_STABLE
                 </div>
              </div>
            </FadeInSection>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PieceDetail;
