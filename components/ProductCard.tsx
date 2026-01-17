
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
  return (
    <div className="group flex flex-col h-full border border-neutral-200 bg-white hover:shadow-lg transition-all rounded-sm overflow-hidden">
      <Link to={`/artifact/${product.id}`} className="relative aspect-square bg-neutral-100 overflow-hidden block">
        {product.status === 'NEW' && (
          <span className="absolute top-2 left-2 bg-neutral-900 text-white text-[10px] font-bold px-2 py-1 uppercase tracking-widest z-10">New</span>
        )}
        {product.status === 'LIMITED' && (
          <span className="absolute top-2 left-2 bg-[#b91c1c] text-white text-[10px] font-bold px-2 py-1 uppercase tracking-widest z-10">Sale</span>
        )}
        
        <img
          src={getOptimizedUrl(product.imageUrl, 600)}
          alt={product.code}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />
      </Link>

      <div className="p-4 flex flex-col flex-1 gap-2">
        <div className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
          {product.era} • {product.classification || 'Cannabis'}
        </div>
        
        <Link to={`/artifact/${product.id}`} className="block">
          <h3 className="font-bold text-neutral-900 text-sm leading-tight group-hover:text-[#b91c1c] transition-colors uppercase">
            {product.code}
          </h3>
        </Link>
        
        <div className="mt-auto pt-2 flex items-center justify-between border-t border-neutral-100">
          <div className="flex flex-col">
             <span className="text-lg font-bold text-neutral-900">${product.price || 45}</span>
             <span className="text-[10px] text-neutral-400 font-medium">THC {product.material || 0}%</span>
          </div>
          <button 
            onClick={(e) => {
              e.preventDefault();
              onAddToCart?.(product);
            }}
            className="bg-neutral-900 text-white w-8 h-8 flex items-center justify-center rounded-sm hover:bg-[#b91c1c] transition-colors"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
