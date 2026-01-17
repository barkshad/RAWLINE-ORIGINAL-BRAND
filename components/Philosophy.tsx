
import React from 'react';
import FadeInSection from './FadeInSection';
import { SiteContent } from '../types';

interface PhilosophyProps {
  content: SiteContent;
}

const Philosophy: React.FC<PhilosophyProps> = ({ content }) => {
  return (
    <div className="min-h-screen bg-white">
      <div className="bg-neutral-900 text-white py-24 px-6 md:px-12">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h1 className="text-5xl md:text-7xl font-bold display-font">Cannabis 101</h1>
          <p className="text-lg text-neutral-300 max-w-2xl mx-auto">
            Everything you need to know about consuming cannabis safely and responsibly.
          </p>
        </div>
      </div>

      <section className="py-20 px-6 md:px-12 max-w-5xl mx-auto space-y-20">
        
        <FadeInSection>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold display-font text-neutral-900">The Basics</h2>
              <p className="text-neutral-600 leading-relaxed">
                Cannabis contains hundreds of chemical compounds. The most well-known are cannabinoids, such as THC (Tetrahydrocannabinol) and CBD (Cannabidiol). THC is the primary psychoactive compound, while CBD is non-intoxicating and often used for potential therapeutic benefits.
              </p>
            </div>
            <div className="bg-neutral-100 p-8 rounded-sm border border-neutral-200">
              <h3 className="font-bold text-lg mb-4">Key Terms</h3>
              <ul className="space-y-3 text-sm text-neutral-700">
                <li className="flex gap-3"><strong className="w-16">THC:</strong> Responsible for the "high" sensation.</li>
                <li className="flex gap-3"><strong className="w-16">CBD:</strong> Non-intoxicating, calming properties.</li>
                <li className="flex gap-3"><strong className="w-16">Terpenes:</strong> Aromatic oils that flavor varieties.</li>
              </ul>
            </div>
          </div>
        </FadeInSection>

        <FadeInSection className="border-t border-neutral-200 pt-20">
           <h2 className="text-3xl font-bold display-font text-neutral-900 mb-10 text-center">Plant Types</h2>
           <div className="grid md:grid-cols-3 gap-8">
              {[
                { title: 'Sativa', desc: 'Typically associated with uplifting, cerebral effects. Often preferred for daytime use.' },
                { title: 'Indica', desc: 'Often associated with relaxing, full-body effects. Commonly used in the evening.' },
                { title: 'Hybrid', desc: 'A balance of Sativa and Indica genetics, offering a mix of effects.' }
              ].map(type => (
                <div key={type.title} className="bg-neutral-50 p-8 border border-neutral-200 rounded-sm">
                   <h3 className="text-xl font-bold mb-3 uppercase tracking-wide text-[#b91c1c]">{type.title}</h3>
                   <p className="text-neutral-600 text-sm leading-relaxed">{type.desc}</p>
                </div>
              ))}
           </div>
        </FadeInSection>

        <FadeInSection className="border-t border-neutral-200 pt-20">
           <div className="bg-neutral-900 text-white p-12 rounded-sm text-center space-y-8">
              <h2 className="text-3xl font-bold display-font">Responsible Use</h2>
              <div className="grid md:grid-cols-3 gap-8 text-left">
                 <div className="space-y-2">
                    <h4 className="font-bold text-[#b91c1c] uppercase tracking-widest text-sm">Start Low, Go Slow</h4>
                    <p className="text-neutral-400 text-sm">If you are new to cannabis, start with a low amount of THC and wait to see how it affects you.</p>
                 </div>
                 <div className="space-y-2">
                    <h4 className="font-bold text-[#b91c1c] uppercase tracking-widest text-sm">Storage</h4>
                    <p className="text-neutral-400 text-sm">Keep cannabis products locked up and out of reach of children and pets.</p>
                 </div>
                 <div className="space-y-2">
                    <h4 className="font-bold text-[#b91c1c] uppercase tracking-widest text-sm">Don't Drive</h4>
                    <p className="text-neutral-400 text-sm">It is illegal and dangerous to drive under the influence of cannabis.</p>
                 </div>
              </div>
           </div>
        </FadeInSection>

      </section>
    </div>
  );
};

export default Philosophy;
