
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
      <div className="min-h-screen bg-[#080808] flex items-center justify-center">
        <div className="w-6 h-6 border border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  if (!piece) {
    return (
      <div className="min-h-screen bg-[#080808] flex flex-col items-center justify-center p-8 text-center space-y-8">
        <div className="artifact-label text-red-600">RECORD_NOT_FOUND</div>
        <Link to="/" className="artifact-label px-10 py-4 border border-white/10 hover:bg-white hover:text-black transition-all">RETURN TO COLLECTION</Link>
      </div>
    );
  }

  const allImages = [piece.imageUrl, ...(piece.additionalImages || [])];

  return (
    <div className="min-h-screen bg-[#080808] text-white selection:bg-white selection:text-black pb-48">
      {/* Dossier Header */}
      <nav className="fixed top-0 left-0 w-full z-50 p-8 md:p-12 flex justify-between items-center bg-gradient-to-b from-[#080808] to-transparent pointer-events-none">
        <Link to="/" className="text-2xl font-light tracking-[0.2em] uppercase pointer-events-auto hover:opacity-50 transition-all">RAWLINE</Link>
        <Link to="/" className="artifact-label pointer-events-auto hover:opacity-50 transition-all flex items-center gap-4">
          CLOSE <span>×</span>
        </Link>
      </nav>

      <div className="pt-40 md:pt-64 px-8 md:px-[10%] lg:px-[15%]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 lg:gap-40 items-start">
          
          {/* Visual Column */}
          <div className="space-y-12">
            <FadeInSection className="relative aspect-[3/4] overflow-hidden bg-[#111] shadow-2xl">
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
                      className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000"
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
                      className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000"
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </FadeInSection>

            <div className="grid grid-cols-6 gap-3">
              {allImages.map((img, i) => (
                <button 
                  key={i} 
                  onClick={() => setMainImage(img)}
                  className={`aspect-square transition-all duration-500 overflow-hidden border ${mainImage === img ? 'border-white' : 'border-white/5 opacity-40 hover:opacity-100'}`}
                >
                  {isVideo(img) ? (
                    <video src={img} className="w-full h-full object-cover grayscale" muted />
                  ) : (
                    <img src={getOptimizedUrl(img, 400)} className="w-full h-full object-cover grayscale" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Technical Info Column */}
          <div className="space-y-24">
            <FadeInSection className="space-y-12">
              <div className="space-y-4">
                <div className="artifact-label text-white/30 tracking-[0.5em]">REF NO: {piece.id.substring(0,8).toUpperCase()}</div>
                <h1 className="text-7xl md:text-9xl serif-display italic font-light tracking-tight leading-none">
                  {piece.code}
                </h1>
                <div className="flex flex-wrap gap-4 pt-4">
                  <span className="artifact-label text-[9px] px-4 py-2 bg-white/5 border border-white/10 text-white/60 uppercase">
                    ERA: {piece.era}
                  </span>
                  <span className="artifact-label text-[9px] px-4 py-2 border border-red-600/30 text-red-600 uppercase">
                    STATUS: {piece.status}
                  </span>
                </div>
              </div>

              <div className="pt-16 border-t border-white/5 grid grid-cols-2 gap-y-12 gap-x-8">
                {[
                  { label: "Fabrication", value: piece.material || 'Archive Blend' },
                  { label: "Provenance", value: piece.era },
                  { label: "Classification", value: piece.classification || 'Master Copy' },
                  { label: "Condition", value: piece.condition || 'Archival' }
                ].map((item, i) => (
                  <div key={i} className="space-y-2">
                    <span className="artifact-label text-[8px] text-white/20 block">{item.label}</span>
                    <span className="text-xl serif-display italic font-light text-white/80">{item.value}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-8 pt-16 border-t border-white/5">
                <span className="artifact-label text-[8px] text-red-600/40 block">TECHNICAL SUMMARY</span>
                <p className="text-2xl md:text-3xl serif-display italic font-light text-white/60 leading-snug">
                  {piece.description || "Archival record documenting the morphological significance of this artifact. Curated for its industrial hardware and textile integrity within the permanent collection."}
                </p>
              </div>

              <div className="pt-16 flex flex-col gap-4">
                <button onClick={() => window.print()} className="artifact-label w-full py-6 border border-white/10 hover:bg-white hover:text-black transition-all font-black">
                  GENERATE PDF RECORD
                </button>
                <div className="artifact-label text-[7px] text-center text-white/10 pt-4">AUTHENTICATED BY RAWLINE FOUNDRY ARCHIVE</div>
              </div>
            </FadeInSection>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PieceDetail;
