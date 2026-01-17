
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

  const categories = ['All', 'Flower', 'Pre-Rolls', 'Vapes', 'Edibles', 'Concentrates', 'Topicals', 'Seeds'];
  const strains = ['All', 'Indica', 'Sativa', 'Hybrid', 'High CBD'];

  const filtered = useMemo(() => {
    return pieces.filter(p => {
      const matchCat = activeCategory === 'All' || p.classification === activeCategory;
      const matchStrain = activeStrain === 'All' || p.era === activeStrain;
      return matchCat && matchStrain;
    });
  }, [pieces, activeCategory, activeStrain]);

  return (
    <div className="min-h-screen bg-white pb-24">
      <div className="bg-neutral-100 py-12 px-6 md:px-12 mb-12 border-b border-neutral-200">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold display-font text-neutral-900 mb-4">
            {activeCategory === 'All' ? 'All Collections' : activeCategory}
          </h1>
          <p className="text-neutral-500 max-w-2xl">
            Browse our curated selection of legal cannabis products. Filter by category or plant type to find exactly what you need.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row gap-12">
        {/* Sidebar Filters */}
        <aside className="w-full md:w-64 flex-shrink-0 space-y-8">
          <div>
            <h3 className="font-bold text-sm uppercase tracking-widest mb-4 text-neutral-900 border-b border-neutral-200 pb-2">Collections</h3>
            <div className="space-y-2">
              {categories.map(c => (
                <button 
                  key={c}
                  onClick={() => setActiveCategory(c)}
                  className={`block w-full text-left text-sm ${activeCategory === c ? 'font-bold text-[#b91c1c]' : 'text-neutral-600 hover:text-neutral-900'}`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-bold text-sm uppercase tracking-widest mb-4 text-neutral-900 border-b border-neutral-200 pb-2">Plant Type</h3>
            <div className="space-y-2">
              {strains.map(s => (
                <button 
                  key={s}
                  onClick={() => setActiveStrain(s)}
                  className={`block w-full text-left text-sm ${activeStrain === s ? 'font-bold text-[#b91c1c]' : 'text-neutral-600 hover:text-neutral-900'}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((product, idx) => (
              <FadeInSection key={product.id} delay={idx % 4 * 50}>
                <ProductCard product={product} onAddToCart={onAddToCart} />
              </FadeInSection>
            ))}
          </div>
          {filtered.length === 0 && (
            <div className="py-24 text-center border rounded-sm bg-neutral-50">
              <p className="text-neutral-400 font-bold uppercase tracking-widest text-sm">No products found matching your criteria</p>
              <button onClick={() => { setActiveCategory('All'); setActiveStrain('All'); }} className="mt-4 text-[#b91c1c] text-sm font-bold underline">Clear Filters</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Shop;
