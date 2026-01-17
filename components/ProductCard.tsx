
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Piece } from '../types';
import { getOptimizedUrl } from '../services/cloudinaryService';

interface ProductCardProps {
  product: Piece;
  onAddToCart?: (p: Piece) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const getBadgeColor = (era: string) => {
    switch (era) {
      case 'Indica': return 'bg-purple-900/40 text-purple-300 border-purple-800/50';
      case 'Sativa': return 'bg-orange-900/40 text-orange-300 border-orange-800/50';
      case 'Hybrid': return 'bg-emerald-900/40 text-emerald-300 border-emerald-800/50';
      default: return 'bg-neutral-900/40 text-neutral-300 border-neutral-800/50';
    }
  };

  return (
    <div className="group space-y-4 bg-[#111]/30 p-4 border border-white/5 hover:border-white/10 transition-all">
      <Link to={`/artifact/${product.id}`} className="block relative aspect-square overflow-hidden bg-black">
        <div className="absolute top-3 left-3 z-20 flex gap-2">
          <div className={`text-[8px] font-bold px-2 py-1 border backdrop-blur-md uppercase tracking-widest ${getBadgeColor(product.era)}`}>
            {product.era}
          </div>
          {product.status === 'NEW' && (
             <div className="text-[8px] font-bold px-2 py-1 bg-white text-black border border-white uppercase tracking-widest">
                NEW
             </div>
          )}
        </div>

        <motion.img
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          src={getOptimizedUrl(product.imageUrl, 800)}
          alt={product.code}
          className="w-full h-full object-cover grayscale-[0.2] opacity-90 group-hover:opacity-100 transition-all duration-700"
        />
        
        <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
           <div className="text-[9px] text-white/60 uppercase font-black tracking-widest">View Details</div>
        </div>
      </Link>

      <div className="space-y-3">
        <div className="flex justify-between items-start">
          <div className="space-y-1 flex-1 pr-4">
            <h3 className="text-sm font-bold text-white/90 truncate uppercase tracking-tight">
              {product.code}
            </h3>
            <div className="flex items-center gap-4 text-[9px] text-white/30 uppercase tracking-widest font-black">
              <span>{product.material || '--'}% THC</span>
              <span className="w-1 h-1 rounded-full bg-white/10" />
              <span>{product.classification || 'Flower'}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm font-bold text-emerald-500">${product.price || 45}</div>
          </div>
        </div>

        <button 
          onClick={(e) => {
            e.preventDefault();
            onAddToCart?.(product);
          }}
          className="w-full py-3 bg-white/5 border border-white/10 text-white text-[9px] font-black uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all flex items-center justify-center gap-3"
        >
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          ADD TO CART
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
