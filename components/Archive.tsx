
import React from 'react';
import FadeInSection from './FadeInSection';
import PieceCard from './PieceCard';
import { Piece } from '../types';

interface ArchiveProps {
  pieces: Piece[];
}

const Archive: React.FC<ArchiveProps> = ({ pieces }) => {
  return (
    <div className="min-h-screen bg-[#080808] pt-32 pb-24">
      <section className="px-8 md:px-24 mb-16 flex flex-col md:flex-row justify-between items-end gap-8">
        <FadeInSection>
          <div className="artifact-label text-red-600/60 mb-6">THE FULL STACK</div>
          <h1 className="text-5xl md:text-8xl serif-display italic font-light tracking-tight text-white">
            The Racks
          </h1>
        </FadeInSection>
        <FadeInSection delay={100}>
           <div className="text-[10px] font-mono text-white/20 uppercase tracking-widest border-b border-white/10 pb-2 mb-4 font-black">
            CATALOG_SYNC: {pieces.length} ARTIFACTS VALIDATED
          </div>
        </FadeInSection>
      </section>

      <section className="px-8 md:px-16 lg:px-24">
        <div className="archive-grid">
          {pieces.map((piece, idx) => (
            <FadeInSection key={piece.id} delay={idx % 3 * 50}>
              <PieceCard piece={piece} />
            </FadeInSection>
          ))}
          {pieces.length === 0 && (
            <div className="col-span-full py-32 text-center">
              <div className="artifact-label text-white/20 tracking-[0.8em]">AWAITING THE RE-UP // STANDBY</div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Archive;
