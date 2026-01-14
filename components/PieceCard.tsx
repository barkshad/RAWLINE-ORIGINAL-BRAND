
import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Piece } from '../types';
import { getOptimizedUrl } from '../services/cloudinaryService';

interface PieceCardProps {
  piece: Piece;
}

const PieceCard: React.FC<PieceCardProps> = ({ piece }) => {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;
    setTilt({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => setTilt({ x: 0, y: 0 });

  return (
    <Link 
      to={`/artifact/${piece.id}`} 
      className="block perspective-1000"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div 
        ref={cardRef}
        style={{
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          transition: 'transform 0.1s ease-out'
        }}
        className="group relative bg-[#0a0a0a] border border-white/5 overflow-hidden transition-all duration-700 hover:border-white/20 shadow-2xl tilt-card"
      >
        {/* Holographic Shine Overlay */}
        <div 
          className="absolute inset-0 z-20 pointer-events-none holographic-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-[holographic_3s_infinite_linear]" 
        />

        {/* Structural Metadata (Glass Layer) */}
        <div className="absolute top-0 left-0 w-full z-30 flex justify-between p-4 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-[-10px] group-hover:translate-y-0">
          <div className="text-[7px] font-mono text-white/90 bg-black/60 backdrop-blur-md px-2 py-1.5 border border-white/10 uppercase tracking-[0.2em] font-black">
            ARTIFACT_{piece.id.substring(0,6).toUpperCase()}
          </div>
          <div className="text-[7px] font-mono text-white/90 bg-black/60 backdrop-blur-md px-2 py-1.5 border border-white/10 uppercase tracking-[0.2em] font-black">
            STATUS: {piece.status}
          </div>
        </div>

        <div className="relative aspect-[4/5] overflow-hidden bg-neutral-900">
          {/* Chromatic Aberration Simulation Layers */}
          <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-10 transition-opacity duration-300 z-10">
            <img src={getOptimizedUrl(piece.imageUrl, 800)} className="absolute inset-0 w-full h-full object-cover mix-blend-screen scale-[1.02] translate-x-[2px] blur-[1px] hue-rotate-[90deg]" />
            <img src={getOptimizedUrl(piece.imageUrl, 800)} className="absolute inset-0 w-full h-full object-cover mix-blend-screen scale-[1.02] translate-x-[-2px] blur-[1px] hue-rotate-[-90deg]" />
          </div>

          <img
            src={getOptimizedUrl(piece.imageUrl, 800)}
            alt={piece.code}
            className="w-full h-full object-cover grayscale transition-all duration-1000 group-hover:grayscale-0 group-hover:scale-105 opacity-40 group-hover:opacity-100"
          />
          
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />

          {/* View Indicator */}
          <div className="absolute bottom-6 left-6 z-30 opacity-0 group-hover:opacity-100 translate-x-[-20px] group-hover:translate-x-0 transition-all duration-700">
             <div className="flex items-center gap-3">
               <div className="w-8 h-[1px] bg-red-600" />
               <span className="text-[9px] font-mono text-white uppercase tracking-[0.5em] font-black">OPEN_RECORD</span>
             </div>
          </div>
        </div>

        <div className="p-8 space-y-6 bg-black relative z-20">
          <div className="flex justify-between items-end">
            <div className="space-y-1">
              <span className="text-[8px] font-mono text-red-600/60 uppercase tracking-[0.4em] font-black">Designation</span>
              <h3 className="text-3xl font-serif italic font-bold tracking-tighter text-white leading-none">
                {piece.code}
              </h3>
            </div>
            <div className="text-right">
              <span className="text-[8px] font-mono text-white/20 uppercase tracking-[0.4em] font-black block">Origin</span>
              <span className="text-[10px] text-white/60 tracking-widest font-bold uppercase">{piece.era}</span>
            </div>
          </div>
          
          <div className="flex gap-2 h-1.5 w-full bg-white/5">
             <div className="h-full bg-red-600/40 w-1/3" />
             <div className="h-full bg-white/10 w-1/4" />
             <div className="h-full bg-white/10 w-1/12" />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PieceCard;
