
import React from 'react';
import FadeInSection from './FadeInSection';
import { SiteContent } from '../types';

interface PhilosophyProps {
  content: SiteContent;
}

const Philosophy: React.FC<PhilosophyProps> = ({ content }) => {
  return (
    <div className="min-h-screen bg-[#050705] pt-32 pb-24">
      <section className="px-8 md:px-24 mb-24">
        <FadeInSection>
          <div className="artifact-label text-[#d4af37] mb-6 font-black tracking-[0.5em]">LEARN_CENTER // KNOWLEDGE_BASE</div>
          <h1 className="text-5xl md:text-8xl serif-display italic font-light tracking-tight text-white mb-12">
            Elevate Your Understanding
          </h1>
        </FadeInSection>
      </section>

      <section className="px-8 md:px-24 border-y border-white/5 py-32 bg-[#080a08]">
        <div className="max-w-4xl mx-auto text-center space-y-20">
          <FadeInSection>
            <div className="artifact-label text-[#d4af37]/40 mb-8 uppercase tracking-[0.6em] font-black">OUR MISSION</div>
            <h3 className="text-3xl md:text-5xl serif-display italic leading-tight font-light text-white/90">
              "We believe that safe, high-quality cannabis is a fundamental standard."
            </h3>
          </FadeInSection>
          <FadeInSection delay={300}>
            <p className="text-xl md:text-2xl font-light text-white/40 max-w-2xl mx-auto italic serif-display leading-relaxed">
              At RAWLINE, our goal is to bridge the gap between premium cultivation and consumer education. Every product on our menu is selected for its safety, efficacy, and consistency.
            </p>
          </FadeInSection>
        </div>
      </section>

      <section className="px-8 md:px-24 py-32 grid grid-cols-1 md:grid-cols-2 gap-24 items-center">
        <FadeInSection>
           <div className="aspect-[4/5] bg-[#111] border border-white/5 relative overflow-hidden group shadow-2xl rounded-sm">
              <img src="https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" className="w-full h-full object-cover grayscale opacity-40 group-hover:opacity-100 transition-opacity duration-1000" alt="Laboratory reference" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-8 left-8">
                 <div className="artifact-label text-[#d4af37] font-black tracking-[0.5em]">LAB_CERTIFIED</div>
              </div>
           </div>
        </FadeInSection>
        <div className="space-y-12">
           <FadeInSection delay={200}>
              <h4 className="text-4xl serif-display italic text-white font-light">The Science of Selection.</h4>
              <p className="text-white/40 mt-6 leading-loose font-light italic serif-display">
                 Our testing protocols go beyond state requirements. We analyze terpene concentrations and minor cannabinoid presence to ensure each strain delivers a specific, repeatable effect.
              </p>
           </FadeInSection>
           <FadeInSection delay={300}>
              <h4 className="text-4xl serif-display italic text-white font-light">Community First.</h4>
              <p className="text-white/40 mt-6 leading-loose font-light italic serif-display">
                 Licensed cannabis means community investment. By shopping with licensed dispensaries, you support local jobs, tax revenue for education, and social equity programs that repair the harms of the past.
              </p>
           </FadeInSection>
        </div>
      </section>

      {/* Consumption Guide */}
      <section className="px-8 md:px-24 py-32 border-t border-white/5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            { title: "Inhalation", desc: "Fast-acting effects, perfect for immediate relief. Best for experienced consumers managing peak symptoms." },
            { title: "Ingestion", desc: "Long-lasting, full-body effects. Edibles take longer to activate but provide deep, sustained comfort." },
            { title: "Topical", desc: "Localized relief without psychoactive effects. Ideal for targeted muscle recovery and skin soothing." }
          ].map((item, i) => (
            <FadeInSection key={i} delay={i * 100} className="space-y-4">
               <span className="text-[#d4af37] font-mono text-[10px] uppercase font-black tracking-widest">METHOD_0{i+1}</span>
               <h5 className="text-2xl serif-display italic text-white">{item.title}</h5>
               <p className="text-sm text-white/30 leading-relaxed italic">{item.desc}</p>
            </FadeInSection>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Philosophy;
