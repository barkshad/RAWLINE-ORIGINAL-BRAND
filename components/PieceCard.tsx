
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Piece } from '../types';
import { getOptimizedUrl } from '../services/cloudinaryService';

interface PieceCardProps {
  piece: Piece;
}

const PieceCard: React.FC<PieceCardProps> = ({ piece }) => {
  const isVideo = (url?: string) => {
    if (!url) return false;
    return url.match(/\.(mp4|webm|ogg|mov)$|video/i);
  };

  return (
    <Link to={`/artifact/${piece.id}`} className="group block">
      <div className="relative aspect-[3/4] overflow-hidden bg-[#111] transition-all duration-700">
        {/* Archival Status Tag */}
        <div className="absolute top-6 left-6 z-20">
          <div className="artifact-label text-[8px] bg-black/40 backdrop-blur-md px-3 py-1.5 border border-white/10 text-white/60">
            {piece.status}
          </div>
        </div>

        {/* Hover Shine Effect */}
        <div className="absolute inset-0 z-10 bg-gradient-to-tr from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />

        {isVideo(piece.imageUrl) ? (
          <video 
            src={piece.imageUrl} 
            className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000"
            muted
            loop
            autoPlay
            playsInline
          />
        ) : (
          <motion.img
            whileHover={{ scale: 1.04 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            src={getOptimizedUrl(piece.imageUrl, 1000)}
            alt={piece.code}
            className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000"
          />
        )}

        {/* Bottom Metadata Shadow */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        
        <div className="absolute bottom-8 left-8 z-20 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-700">
          <div className="flex items-center gap-4">
            <div className="w-10 h-[1px] bg-white/40" />
            <span className="artifact-label text-[9px] text-white">VIEW RECORD</span>
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-between items-start gap-4">
        <div className="space-y-1">
          <h3 className="text-xl serif-display italic font-light tracking-tight text-white/90 group-hover:text-white transition-colors">
            {piece.code}
          </h3>
          <p className="artifact-label text-[9px] text-white/20">MATERIAL: {piece.material || 'NOT_SPECIFIED'}</p>
        </div>
        <div className="text-right">
          <span className="artifact-label text-[9px] text-white/30 block mb-1">ORIGIN</span>
          <span className="text-[10px] font-medium text-white/60 uppercase tracking-widest">{piece.era}</span>
        </div>
      </div>
    </Link>
  );
};

export default PieceCard;
