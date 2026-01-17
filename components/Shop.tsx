
import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import FadeInSection from './FadeInSection';
import ProductCard from './ProductCard';
import { Piece } from '../types';

interface ShopProps {
  pieces: Piece[];
  onAddToCart: (p: Piece) => void;
}

const Shop: React.FC<ShopProps> = ({ pieces, onAddToCart }) => {
  const [searchParams] = useSearchParams();
  const catParam = searchParams.get('cat');
  
  const [activeCategory, setActiveCategory] = useState<string>(catParam || 'All');
  const [activeStrain, setActiveStrain] = useState<string>('All');

  const categories = ['All', 'Flower', 'Pre-Rolls', 'Edibles', 'Vapes', 'Concentrates'];
  const strains = ['All', 'Indica', 'Sativa', 'Hybrid'];

  const filtered = useMemo(() => {
    return pieces.filter(p => {
      const matchCat = activeCategory === 'All' || p.classification === activeCategory;
      const matchStrain = activeStrain === 'All' || p.era === activeStrain;
      return matchCat && matchStrain;
    });
  }, [pieces, activeCategory, activeStrain]);

  return (
    <div className="min-h-screen bg-[#050705] pt-32 pb-24">
      <header className="px-6 md:px-12 mb-16 space-y-8 max-w-7xl mx-auto">
        <div className="space-y-4">
          <div className="artifact-label text-[#d4af37] font-black tracking-[0.5em]">MENU_RESERVATION_LIVE</div>
          <h1 className="text-5xl md:text-8xl serif-display italic font-light tracking-tight text-white">
            Current Rotation
          </h1>
        </div>

        {/* Simplified Filters */}
        <div className="flex flex-col gap-8 pt-12 border-t border-white/5">
          <div className="space-y-4">
             <div className="text-[9px] text-white/20 uppercase tracking-[0.4em] font-black">CATEGORIES</div>
             <div className="flex flex-wrap gap-2">
                {categories.map(c => (
                  <button 
                    key={c}
                    onClick={() => setActiveCategory(c)}
                    className={`px-8 py-3 text-[10px] font-black uppercase tracking-widest border transition-all rounded-full ${activeCategory === c ? 'bg-white text-black border-white' : 'bg-transparent text-white/40 border-white/10 hover:border-white/30'}`}
                  >
                    {c}
                  </button>
                ))}
             </div>
          </div>
          <div className="space-y-4">
             <div className="text-[9px] text-white/20 uppercase tracking-[0.4em] font-black">STRIAN_GENETICS</div>
             <div className="flex flex-wrap gap-2">
                {strains.map(s => (
                  <button 
                    key={s}
                    onClick={() => setActiveStrain(s)}
                    className={`px-8 py-3 text-[10px] font-black uppercase tracking-widest border transition-all rounded-full ${activeStrain === s ? 'bg-[#10b981]/20 text-[#10b981] border-[#10b981]' : 'bg-transparent text-white/40 border-white/10 hover:border-white/30'}`}
                  >
                    {s}
                  </button>
                ))}
             </div>
          </div>
        </div>
      </header>

      <section className="px-6 md:px-12 max-w-7xl mx-auto">
        <div className="archive-grid">
          {filtered.map((product, idx) => (
            <FadeInSection key={product.id} delay={idx % 4 * 50}>
              <ProductCard product={product} onAddToCart={onAddToCart} />
            </FadeInSection>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full py-48 text-center border border-dashed border-white/10 rounded-sm">
              <div className="artifact-label text-white/20 tracking-[0.8em]">AWAITING LAB RESULTS // NO_INVENTORY_MATCH</div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Shop;
