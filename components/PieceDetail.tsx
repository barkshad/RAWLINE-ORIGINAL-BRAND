
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Piece } from '../types';
import { getPieces } from '../services/firebaseService';
import { getOptimizedUrl } from '../services/cloudinaryService';
import FadeInSection from './FadeInSection';

const PieceDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [piece, setPiece] = useState<Piece | null>(null);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState<string>('');

  const isVideo = (url?: string) => {
    if (!url) return false;
    return url.match(/\.(mp4|webm|ogg|mov)$|video/i);
  };

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
      <div className="min-h-screen bg-[#050705] flex items-center justify-center">
        <div className="w-6 h-6 border border-white/20 border-t-[#d4af37] rounded-full animate-spin" />
      </div>
    );
  }

  if (!piece) {
    return (
      <div className="min-h-screen bg-[#050705] flex flex-col items-center justify-center p-8 text-center space-y-8">
        <div className="artifact-label text-red-600">PRODUCT_NOT_FOUND</div>
        <Link to="/shop" className="artifact-label px-10 py-4 border border-white/10 hover:bg-white hover:text-black transition-all">RETURN TO MENU</Link>
      </div>
    );
  }

  const allImages = [piece.imageUrl, ...(piece.additionalImages || [])];

  return (
    <div className="min-h-screen bg-[#050705] text-[#f5f5f0] selection:bg-[#d4af37] selection:text-black pb-48">
      {/* Product Header */}
      <nav className="fixed top-0 left-0 w-full z-50 p-6 md:p-12 flex justify-between items-center bg-gradient-to-b from-black to-transparent pointer-events-none">
        <Link to="/" className="text-xl font-light tracking-[0.2em] uppercase pointer-events-auto hover:opacity-50 transition-all">RAWLINE</Link>
        <Link to="/shop" className="artifact-label pointer-events-auto hover:opacity-50 transition-all flex items-center gap-4">
          BACK TO MENU <span>×</span>
        </Link>
      </nav>

      <div className="pt-32 md:pt-48 px-6 md:px-[8%] lg:px-[12%]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 lg:gap-32 items-start">
          
          {/* Visual Column */}
          <div className="space-y-8">
            <FadeInSection className="relative aspect-square overflow-hidden bg-[#111] shadow-2xl rounded-sm">
              <AnimatePresence mode="wait">
                <motion.div
                  key={mainImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8 }}
                  className="w-full h-full"
                >
                  {isVideo(mainImage) ? (
                    <video 
                      src={mainImage} 
                      className="w-full h-full object-cover"
                      controls
                      autoPlay
                      muted
                      loop
                      playsInline
                    />
                  ) : (
                    <img 
                      src={getOptimizedUrl(mainImage, 1800)} 
                      alt={piece.code} 
                      className="w-full h-full object-cover"
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </FadeInSection>

            <div className="grid grid-cols-5 gap-3">
              {allImages.map((img, i) => (
                <button 
                  key={i} 
                  onClick={() => setMainImage(img)}
                  className={`aspect-square transition-all duration-500 overflow-hidden border rounded-sm ${mainImage === img ? 'border-[#d4af37]' : 'border-white/5 opacity-40 hover:opacity-100'}`}
                >
                  <img src={getOptimizedUrl(img, 400)} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Data Column */}
          <div className="space-y-16">
            <FadeInSection className="space-y-10">
              <div className="space-y-4">
                <div className="artifact-label text-emerald-500 tracking-[0.5em] font-black">CERTIFIED_FLOWER // {piece.era}</div>
                <h1 className="text-6xl md:text-8xl serif-display italic font-light tracking-tight leading-none text-white">
                  {piece.code}
                </h1>
                <div className="flex flex-wrap gap-4 pt-4">
                  <span className="artifact-label text-[9px] px-6 py-2 bg-white/5 border border-white/10 text-white/60 uppercase font-black">
                    THC: {piece.material || '0'}%
                  </span>
                  <span className="artifact-label text-[9px] px-6 py-2 bg-[#d4af37]/10 border border-[#d4af37]/30 text-[#d4af37] uppercase font-black">
                    {piece.status}
                  </span>
                </div>
              </div>

              <div className="pt-12 border-t border-white/5 grid grid-cols-2 gap-y-10 gap-x-8">
                {[
                  { label: "Strain Class", value: piece.era },
                  { label: "Category", value: piece.classification || 'Select' },
                  { label: "Price", value: `$${piece.price || 50}.00` },
                  { label: "CBD Content", value: `${piece.condition || '0'}%` }
                ].map((item, i) => (
                  <div key={i} className="space-y-1">
                    <span className="artifact-label text-[8px] text-white/20 block font-black">{item.label}</span>
                    <span className="text-2xl serif-display italic font-light text-white/80">{item.value}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-6 pt-12 border-t border-white/5">
                <span className="artifact-label text-[8px] text-[#d4af37] block font-black">SENSORY_PROFILE & ANALYSIS</span>
                <p className="text-xl md:text-2xl serif-display italic font-light text-white/50 leading-relaxed">
                  {piece.description || "A curated high-terpene strain documented for its complex aroma and balanced physiological effects. Lab-verified and compliant with state retail standards."}
                </p>
              </div>

              <div className="pt-12 space-y-4">
                <button className="bg-[#d4af37] text-black w-full py-6 text-[11px] font-black uppercase tracking-[0.4em] hover:bg-white transition-all shadow-xl">
                  ADD TO CART — ${piece.price || 50}
                </button>
                <div className="flex items-center justify-center gap-3 py-4 text-[9px] text-white/20 uppercase tracking-widest font-black italic">
                   <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                   Available for Same Day Delivery
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
