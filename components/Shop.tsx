
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
    <div className="min-h-screen bg-[#080808] pt-32 pb-24">
      <header className="px-6 md:px-12 mb-16 space-y-8">
        <div className="space-y-4">
          <div className="artifact-label text-emerald-500 font-black tracking-[0.5em]">LIVE_INVENTORY</div>
          <h1 className="text-5xl md:text-8xl serif-display italic font-light tracking-tight text-white">
            The Menu
          </h1>
        </div>

        {/* Simplified Filters */}
        <div className="flex flex-col gap-6 pt-8 border-t border-white/5">
          <div className="space-y-3">
             <div className="text-[9px] text-white/20 uppercase tracking-widest font-black">Categories</div>
             <div className="flex flex-wrap gap-2">
                {categories.map(c => (
                  <button 
                    key={c}
                    onClick={() => setActiveCategory(c)}
                    className={`px-6 py-2 text-[10px] font-black uppercase tracking-widest border transition-all ${activeCategory === c ? 'bg-white text-black border-white' : 'bg-transparent text-white/40 border-white/10 hover:border-white/30'}`}
                  >
                    {c}
                  </button>
                ))}
             </div>
          </div>
          <div className="space-y-3">
             <div className="text-[9px] text-white/20 uppercase tracking-widest font-black">Strain Type</div>
             <div className="flex flex-wrap gap-2">
                {strains.map(s => (
                  <button 
                    key={s}
                    onClick={() => setActiveStrain(s)}
                    className={`px-6 py-2 text-[10px] font-black uppercase tracking-widest border transition-all ${activeStrain === s ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-transparent text-white/40 border-white/10 hover:border-white/30'}`}
                  >
                    {s}
                  </button>
                ))}
             </div>
          </div>
        </div>
      </header>

      <section className="px-6 md:px-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {filtered.map((product, idx) => (
            <FadeInSection key={product.id} delay={idx % 4 * 50}>
              <ProductCard product={product} onAddToCart={onAddToCart} />
            </FadeInSection>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full py-48 text-center border border-dashed border-white/10">
              <div className="artifact-label text-white/20 tracking-[0.8em]">AWAITING RESTOCK // NO_RESULTS</div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Shop;
