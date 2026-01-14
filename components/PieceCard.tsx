
import React from 'react';
import { Piece } from '../types';
import { getOptimizedUrl } from '../services/cloudinaryService';

interface PieceCardProps {
  piece: Piece;
}

const PieceCard: React.FC<PieceCardProps> = ({ piece }) => {
  const optimizedImage = getOptimizedUrl(piece.imageUrl, 800);

  return (
    <div className="group relative bg-[#0a0a0a] border border-white/10 overflow-hidden transition-all duration-700 hover:border-white/30">
      {/* Structural Data Overlay */}
      <div className="absolute top-0 left-0 w-full z-20 flex justify-between p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
        <div className="text-[7px] font-mono text-white/90 bg-black/80 px-1.5 py-1 border border-white/10 uppercase tracking-tighter font-black">
          ARC-ID: {piece.id.substring(0,8).toUpperCase()}
        </div>
        <div className="text-[7px] font-mono text-white/90 bg-black/80 px-1.5 py-1 border border-white/10 uppercase tracking-tighter font-black">
          LOC: CLOUD_NODE_01
        </div>
      </div>

      <div className="relative aspect-[4/5] overflow-hidden">
        <img
          src={optimizedImage}
          alt={piece.code}
          loading="lazy"
          className="w-full h-full object-cover grayscale transition-all duration-1000 group-hover:grayscale-0 group-hover:scale-110 opacity-60 group-hover:opacity-100 filter contrast-125"
        />
        
        {/* Holographic Scanline Overlay */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
          <div className="scanline" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
        </div>

        {/* Catalog Tag */}
        <div className="absolute bottom-4 left-4 z-20 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
           <span className="text-[10px] font-mono text-white bg-white/20 backdrop-blur-md border border-white/30 px-3 py-1 tracking-[0.2em] font-black uppercase">
             {piece.code}
           </span>
        </div>
      </div>

      <div className="p-6 space-y-6 border-t border-white/10 relative bg-[#050505]">
        <div className="flex justify-between items-baseline">
          <h3 className="text-xl font-serif italic font-bold tracking-tight text-white">{piece.code}</h3>
          <div className={`text-[9px] font-mono px-2 py-0.5 border font-black ${
            piece.status === 'ARCHIVED' ? 'border-white/20 text-white/40' : 
            piece.status === 'ACTIVE' ? 'border-red-600 text-red-600' : 
            piece.status === 'WORN' ? 'border-white/60 text-white' :
            'border-white/30 text-white/50'
          } uppercase tracking-[0.2em]`}>
            {piece.status}
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-x-6 gap-y-4 border-t border-white/5 pt-4">
          <div className="space-y-1">
            <span className="block text-[7px] font-mono text-white/40 uppercase tracking-[0.4em] font-black">Era</span>
            <span className="block text-[11px] text-white/90 tracking-wider font-bold uppercase">{piece.era}</span>
          </div>
          <div className="space-y-1">
            <span className="block text-[7px] font-mono text-white/40 uppercase tracking-[0.4em] font-black">Material</span>
            <span className="block text-[11px] text-white/90 tracking-wider font-bold uppercase">{piece.material || "Industrial Fabric"}</span>
          </div>
          <div className="space-y-1">
            <span className="block text-[7px] font-mono text-white/40 uppercase tracking-[0.4em] font-black">Condition</span>
            <span className="block text-[11px] text-white/90 tracking-wider font-bold uppercase">{piece.condition || "As Recorded"}</span>
          </div>
          <div className="space-y-1">
            <span className="block text-[7px] font-mono text-white/40 uppercase tracking-[0.4em] font-black">Archive Grade</span>
            <span className="block text-[11px] text-white/90 tracking-wider font-bold uppercase">Class-A</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PieceCard;
