
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Piece } from '../types';
import { getPieces } from '../services/firebaseService';
import { getOptimizedUrl } from '../services/cloudinaryService';
import FadeInSection from './FadeInSection';

const PieceDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [piece, setPiece] = useState<Piece | null>(null);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState<string>('');

  useEffect(() => {
    const fetchPiece = async () => {
      const pieces = await getPieces();
      const found = pieces.find(p => p.id === id);
      if (found) {
        setPiece(found);
        setMainImage(found.imageUrl);
      }
      setLoading(false);
      window.scrollTo(0, 0);
    };
    fetchPiece();
  }, [id]);

  if (loading) return <div className="min-h-screen bg-white flex items-center justify-center">Loading...</div>;

  if (!piece) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8 text-center space-y-4">
        <div className="font-bold text-neutral-900">Product Not Found</div>
        <Link to="/shop" className="text-[#b91c1c] underline">Return to Shop</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-neutral-900 pb-24">
      {/* Breadcrumb */}
      <div className="bg-neutral-50 py-4 px-6 md:px-12 border-b border-neutral-200">
        <div className="max-w-7xl mx-auto text-xs uppercase tracking-widest font-bold text-neutral-500">
           <Link to="/" className="hover:text-neutral-900">Home</Link> / <Link to="/shop" className="hover:text-neutral-900">Shop</Link> / <span className="text-neutral-900">{piece.code}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-12 px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24">
          
          {/* Images */}
          <div className="space-y-4">
             <div className="aspect-square bg-neutral-100 rounded-sm overflow-hidden border border-neutral-200">
                <img src={getOptimizedUrl(mainImage, 1200)} className="w-full h-full object-cover" alt={piece.code} />
             </div>
             <div className="grid grid-cols-4 gap-2">
               {[piece.imageUrl, ...(piece.additionalImages || [])].map((img, i) => (
                 <button key={i} onClick={() => setMainImage(img)} className={`aspect-square border rounded-sm overflow-hidden ${mainImage === img ? 'border-neutral-900' : 'border-neutral-200 opacity-60'}`}>
                    <img src={getOptimizedUrl(img, 200)} className="w-full h-full object-cover" />
                 </button>
               ))}
             </div>
          </div>

          {/* Details */}
          <div className="space-y-8">
             <div>
                <span className="text-[#b91c1c] font-bold uppercase tracking-widest text-xs mb-2 block">{piece.classification || 'Cannabis'}</span>
                <h1 className="text-4xl font-bold display-font text-neutral-900 mb-2">{piece.code}</h1>
                <div className="text-2xl font-bold text-neutral-900">${piece.price || 45}.00</div>
             </div>

             <div className="bg-neutral-50 p-6 rounded-sm border border-neutral-200 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="block text-neutral-500 text-xs uppercase tracking-wide">THC</span>
                  <span className="font-bold text-lg">{piece.material || 0}%</span>
                </div>
                <div>
                  <span className="block text-neutral-500 text-xs uppercase tracking-wide">CBD</span>
                  <span className="font-bold text-lg">{piece.condition || 0}%</span>
                </div>
                <div>
                  <span className="block text-neutral-500 text-xs uppercase tracking-wide">Plant Type</span>
                  <span className="font-bold">{piece.era}</span>
                </div>
                <div>
                  <span className="block text-neutral-500 text-xs uppercase tracking-wide">Format</span>
                  <span className="font-bold">3.5g Dried Flower</span>
                </div>
             </div>

             <div>
                <h3 className="font-bold text-sm uppercase tracking-widest mb-2">Description</h3>
                <p className="text-neutral-600 leading-relaxed">
                   {piece.description || "A premium cannabis product curated for quality and potency. Grown in regulated facilities and tested for purity."}
                </p>
             </div>

             <button className="w-full bg-[#b91c1c] text-white py-4 font-bold uppercase tracking-widest text-sm hover:bg-red-800 transition-colors rounded-sm shadow-sm">
               Add to Cart
             </button>

             <div className="text-xs text-neutral-400 text-center">
                Free shipping on orders over $150. ID required at delivery.
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PieceDetail;
