
import React from 'react';
import FadeInSection from './FadeInSection';
import { SiteContent } from '../types';
import { isVideoUrl } from '../utils';

interface FitsProps {
  content: SiteContent;
}

const Fits: React.FC<FitsProps> = ({ content }) => {
  return (
    <div className="min-h-screen bg-[#050505] pt-32 pb-24">
       <section className="px-8 md:px-24 mb-24">
        <FadeInSection>
          <div className="artifact-label text-white/20 mb-6">STUDY_02 // MOTION</div>
          <h1 className="text-5xl md:text-8xl serif-display italic font-light tracking-tight text-white mb-12">
            Fit Check
          </h1>
          <p className="text-white/40 text-lg font-light max-w-lg italic serif-display border-l border-white/20 pl-6">
            "Vintage moves different. Old fabric. New posture. That's the balance."
          </p>
        </FadeInSection>
      </section>

      <section className="px-8 md:px-16 lg:px-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
          {content.fitChecks && content.fitChecks.length > 0 ? (
            content.fitChecks.map((check, idx) => (
              <FadeInSection key={check.id} delay={idx * 100}>
                <div className="space-y-6 group cursor-none">
                  <div className="relative aspect-[9/16] bg-black overflow-hidden border border-white/5 transition-all duration-700 group-hover:border-white/20">
                    {isVideoUrl(check.videoUrl) ? (
                      <video 
                        src={check.videoUrl} 
                        className="w-full h-full object-cover grayscale opacity-60 group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-1000"
                        muted
                        loop
                        autoPlay
                        playsInline
                      />
                    ) : (
                      <img 
                        src={check.videoUrl} 
                        className="w-full h-full object-cover grayscale opacity-60 group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-1000"
                        alt={check.title}
                      />
                    )}
                    <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="artifact-label text-[8px] text-white tracking-[0.5em]">PLAYING_STUDY</div>
                    </div>
                  </div>
                  <div className="space-y-2 border-t border-white/5 pt-4">
                    <h4 className="serif-display italic text-2xl font-light text-white/80">{check.title}</h4>
                    {check.description && <p className="artifact-label text-[9px] text-white/30 leading-relaxed">{check.description}</p>}
                  </div>
                </div>
              </FadeInSection>
            ))
          ) : (
            <div className="col-span-full py-24 text-center border border-dashed border-white/10 rounded-lg">
               <div className="artifact-label text-white/20">NO MOTION STUDIES RECORDED</div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Fits;
