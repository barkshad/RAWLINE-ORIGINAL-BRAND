
import React from 'react';
import FadeInSection from './FadeInSection';
import { SiteContent } from '../types';

interface PhilosophyProps {
  content: SiteContent;
}

const Philosophy: React.FC<PhilosophyProps> = ({ content }) => {
  return (
    <div className="min-h-screen bg-[#080808] pt-32 pb-24">
      <section className="px-8 md:px-24 mb-24">
        <FadeInSection>
          <div className="artifact-label text-red-600/60 mb-6 font-black tracking-[0.5em]">RAWLINE_ARCHIVE // MANIFESTO</div>
          <h1 className="text-5xl md:text-8xl serif-display italic font-light tracking-tight text-white mb-12">
            The Code
          </h1>
        </FadeInSection>
      </section>

      <section className="px-8 md:px-24 border-y border-white/5 py-32 bg-[#0a0a0a]">
        <div className="max-w-4xl mx-auto text-center space-y-20">
          <FadeInSection>
            <div className="artifact-label text-white/20 mb-8 uppercase tracking-[0.6em] font-black">{content.archiveStatementTitle}</div>
            <h3 className="text-3xl md:text-5xl serif-display italic leading-tight font-light text-white/90">
              "{content.archiveStatementText1}"
            </h3>
          </FadeInSection>
          <FadeInSection delay={300}>
            <p className="text-xl md:text-2xl font-light text-white/40 max-w-2xl mx-auto italic serif-display leading-relaxed">
              {content.archiveStatementText2}
            </p>
          </FadeInSection>
          <FadeInSection delay={500}>
             <div className="w-[1px] h-24 bg-gradient-to-b from-white/20 to-transparent mx-auto" />
          </FadeInSection>
        </div>
      </section>

      <section className="px-8 md:px-24 py-32 grid grid-cols-1 md:grid-cols-2 gap-24 items-center">
        <FadeInSection>
           <div className="aspect-[4/5] bg-[#111] border border-white/5 relative overflow-hidden group shadow-2xl">
              <img src="https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" className="w-full h-full object-cover grayscale opacity-40 group-hover:opacity-100 transition-opacity duration-1000" alt="Culture reference" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-8 left-8">
                 <div className="artifact-label text-white font-black tracking-[0.5em]">REAL_PRESSURE</div>
              </div>
           </div>
        </FadeInSection>
        <div className="space-y-12">
           <FadeInSection delay={200}>
              <h4 className="text-4xl serif-display italic text-white font-light">History doesn't fold.</h4>
              <p className="text-white/40 mt-6 leading-loose font-light italic serif-display">
                 Fast fashion is a fluke. We preserve the history that actually hit the pavement. Every tear, every fade, every repair is a mark of authenticity. If it ain't lived, we don't want it. That's why we focus on that heavy-duty construction integrity. Real world testing only.
              </p>
           </FadeInSection>
           <FadeInSection delay={300}>
              <h4 className="text-4xl serif-display italic text-white font-light">Curated for the block.</h4>
              <p className="text-white/40 mt-6 leading-loose font-light italic serif-display">
                 A curated study of the silhouettes and material heritage that actually paved the way. We dig through the noise to find the signals that still resonate in the streets today. Real history for the block. Pressure is applied on every pick.
              </p>
           </FadeInSection>
        </div>
      </section>
    </div>
  );
};

export default Philosophy;
