
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
        <div className="text-white text-[10px] uppercase tracking-[0.8em] animate-pulse">DECRYPTING_RECORD...</div>
      </div>
    );
  }

  if (!piece) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center font-mono p-4 gap-6">
        <div className="text-white text-[10px] uppercase tracking-[0.4em]">ERROR: RECORD_NOT_FOUND</div>
        <Link to="/" className="text-white border border-white/20 px-6 py-2 text-[8px] uppercase tracking-widest hover:bg-white hover:text-black transition-all cursor-none">RETURN_TO_INDEX</Link>
      </div>
    );
  }

  const allImages = [piece.imageUrl, ...(piece.additionalImages || [])];

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black font-sans pb-32">
      <div className="scanline z-[99] pointer-events-none fixed top-0 left-0 w-full h-full opacity-30" />
      
      {/* Navigation Header */}
      <nav className="fixed top-0 left-0 w-full z-50 p-6 md:p-12 flex justify-between items-center bg-black/80 backdrop-blur-md border-b border-white/5">
        <Link to="/" className="text-2xl md:text-3xl font-serif font-bold italic tracking-tighter hover:opacity-70 transition-opacity">RAWLINE</Link>
        <Link to="/" className="text-[8px] md:text-[10px] font-mono tracking-[0.3em] text-white/40 uppercase hover:text-white transition-all">
          [ BACK_TO_ARCHIVE ]
        </Link>
      </nav>

      <div className="pt-32 md:pt-48 px-6 sm:px-[10%]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
          
          {/* Visual Assets Column */}
          <div className="lg:col-span-7 space-y-8">
            <FadeInSection className="relative aspect-[4/5] overflow-hidden border border-white/10 group">
              <div className="absolute top-4 left-4 z-20 text-[7px] font-mono bg-black/60 px-2 py-1 border border-white/20 uppercase tracking-widest font-black">
                MASTER_REFERENCE: {piece.code}
              </div>
              <img 
                src={getOptimizedUrl(mainImage, 1600)} 
                alt={piece.code} 
                className="w-full h-full object-cover grayscale transition-all duration-1000 group-hover:grayscale-0"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
            </FadeInSection>

            {/* Gallery Strip */}
            <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
              {allImages.map((img, i) => (
                <button 
                  key={i} 
                  onClick={() => setMainImage(img)}
                  className={`aspect-square border transition-all overflow-hidden cursor-none ${mainImage === img ? 'border-red-600 scale-95' : 'border-white/10 opacity-40 hover:opacity-100'}`}
                >
                  <img src={getOptimizedUrl(img, 300)} className="w-full h-full object-cover grayscale" />
                </button>
              ))}
            </div>
          </div>

          {/* Metadata Column */}
          <div className="lg:col-span-5 space-y-12">
            <FadeInSection delay={100} className="space-y-4">
              <div className="flex items-center gap-4 text-[9px] tracking-[0.5em] text-white/30 uppercase font-black">
                <span className="w-12 h-[1px] bg-white/10" /> ARTIFACT_RECORD
              </div>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold italic tracking-tighter leading-[0.8] text-white">
                {piece.code}
              </h1>
              <div className="flex gap-4">
                <span className="text-[10px] font-mono px-3 py-1 border border-red-600/30 text-red-600 uppercase tracking-widest font-black">
                  STATUS: {piece.status}
                </span>
                <span className="text-[10px] font-mono px-3 py-1 border border-white/10 text-white/40 uppercase tracking-widest font-bold">
                  ERA: {piece.era}
                </span>
              </div>
            </FadeInSection>

            <FadeInSection delay={200} className="space-y-6 md:space-y-10 border-t border-white/5 pt-10">
              <div className="grid grid-cols-2 gap-x-8 gap-y-10">
                <div className="space-y-2">
                  <span className="block text-[8px] font-mono text-white/30 uppercase tracking-[0.4em] font-black">Composition</span>
                  <span className="block text-sm md:text-lg text-white/80 font-medium tracking-tight uppercase">{piece.material || 'N/A'}</span>
                </div>
                <div className="space-y-2">
                  <span className="block text-[8px] font-mono text-white/30 uppercase tracking-[0.4em] font-black">Condition</span>
                  <span className="block text-sm md:text-lg text-white/80 font-medium tracking-tight uppercase">{piece.condition || 'N/A'}</span>
                </div>
                <div className="space-y-2">
                  <span className="block text-[8px] font-mono text-white/30 uppercase tracking-[0.4em] font-black">Classification</span>
                  <span className="block text-sm md:text-lg text-white/80 font-medium tracking-tight uppercase">{piece.classification || 'Original Archive'}</span>
                </div>
                <div className="space-y-2">
                  <span className="block text-[8px] font-mono text-white/30 uppercase tracking-[0.4em] font-black">Archive_Slot</span>
                  <span className="block text-sm md:text-lg text-white/80 font-medium tracking-tight uppercase">{id?.slice(-8).toUpperCase()}</span>
                </div>
              </div>

              <div className="space-y-4 pt-4">
                <span className="block text-[8px] font-mono text-white/30 uppercase tracking-[0.4em] font-black">Technical_Analysis</span>
                <p className="text-base md:text-lg text-white/60 leading-relaxed font-light tracking-tight max-w-xl">
                  {piece.description || "The piece exhibits structural characteristics typical of industrial silhouettes from this era. Materials are chosen for durability and functional longevity. Minimal branding allows the construction to dictate the aesthetic value."}
                </p>
              </div>

              <div className="p-8 bg-white/[0.02] border border-white/5 space-y-4">
                 <div className="flex justify-between items-center text-[8px] font-mono uppercase tracking-widest text-white/20">
                    <span>ARCHIVE_GRADE: A</span>
                    <span className="text-red-600 font-black tracking-[0.3em]">PASSED_AUDIT</span>
                 </div>
                 <div className="h-1 w-full bg-white/5">
                    <div className="h-full bg-red-600 w-[94%] animate-pulse" />
                 </div>
              </div>
            </FadeInSection>

            <FadeInSection delay={300} className="pt-10">
               <button onClick={() => window.print()} className="w-full h-16 border border-white/10 hover:bg-white hover:text-black transition-all text-[10px] font-mono uppercase tracking-[0.5em] font-black cursor-none">
                 PRINT_RECORD_MANIFEST
               </button>
            </FadeInSection>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PieceDetail;
