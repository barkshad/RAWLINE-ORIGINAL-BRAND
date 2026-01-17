
import React, { useState, useEffect, useCallback } from 'react';
import { HashRouter, Routes, Route, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Lenis from 'lenis';
import FadeInSection from './components/FadeInSection';
import PieceDetail from './components/PieceDetail';
import Philosophy from './components/Philosophy';
import Shop from './components/Shop';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import AgeGate from './components/AgeGate';
import ProductCard from './components/ProductCard';
import { Piece, SiteContent, CartItem } from './types';
import { getPieces, getSiteContent } from './services/firebaseService';
import { isVideoUrl } from './utils';

const DEFAULT_CONTENT: SiteContent = {
  heroTitle: "NYC'S PREMIER LICENSED CANNABIS",
  heroSubTitle: "Curated Flower, Edibles, and Concentrates delivered to your door. Lab-tested quality from local cultivators.",
  heroMediaUrl: "https://videos.pexels.com/video-files/3248357/3248357-hd_1920_1080_25fps.mp4",
  archiveStatementTitle: "THE STANDARD",
  archiveStatementText1: "RAWLINE is built on precision and transparency. Every product is CAUR-certified and lab-tested to ensure you receive only the highest quality results.",
  archiveStatementText2: "Whether you're a seasoned connoisseur or new to the culture, our curated selection is designed for safety, potency, and profile excellence.",
  footerTagline: "NYC Licensed | CAUR #0862 | Local Delivery",
  fitChecks: []
};

const HomePage: React.FC<{ content: SiteContent; pieces: Piece[]; onAddToCart: (p: Piece) => void }> = ({ content, pieces, onAddToCart }) => {
  return (
    <div className="min-h-screen bg-[#050705] text-[#f5f5f0]">
      {/* Hero */}
      <header className="relative h-[100vh] flex flex-col justify-center items-center text-center px-6 overflow-hidden bg-black">
        <div className="absolute inset-0 z-0 opacity-40">
          {isVideoUrl(content.heroMediaUrl) ? (
            <video autoPlay loop muted playsInline src={content.heroMediaUrl} className="w-full h-full object-cover" />
          ) : content.heroMediaUrl ? (
            <img src={content.heroMediaUrl} className="w-full h-full object-cover" alt="Hero" />
          ) : null}
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-[#050705]" />
        </div>

        <FadeInSection className="max-w-4xl z-10 space-y-10">
          <div className="artifact-label text-[#d4af37] font-black tracking-[0.5em] text-[10px]">
            NOW OPEN // LICENSED DISPENSARY
          </div>
          <h1 className="text-[clamp(2.5rem,8vw,6rem)] leading-[0.9] serif-display font-light italic tracking-tight text-white drop-shadow-2xl">
            {content.heroTitle}
          </h1>
          <p className="text-white/70 text-lg md:text-xl max-w-xl mx-auto font-light tracking-wide italic serif-display">
            {content.heroSubTitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
             <Link 
               to="/shop"
               className="bg-[#d4af37] text-black px-12 py-5 text-[10px] font-black uppercase tracking-[0.4em] hover:bg-white transition-all shadow-xl"
             >
               SHOP THE MENU
             </Link>
             <Link 
               to="/shop?cat=Flower"
               className="bg-white/5 border border-white/20 text-white px-12 py-5 text-[10px] font-black uppercase tracking-[0.4em] hover:bg-white hover:text-black transition-all backdrop-blur-md"
             >
               FLOWER ONLY
             </Link>
          </div>
        </FadeInSection>
      </header>
      
      {/* Shop by Category - Simple Visual Grid */}
      <section className="py-24 px-6 md:px-12 bg-[#050705]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="space-y-4">
               <span className="artifact-label text-[#d4af37]">DEPARTMENTS</span>
               <h2 className="text-4xl md:text-6xl serif-display italic font-light">Curated Selection</h2>
            </div>
            <p className="text-white/40 max-w-md text-sm italic serif-display">
              From locally grown small-batch flower to precision-dosed edibles, we source the finest licensed products in the state.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Flower', path: '/shop?cat=Flower', img: 'https://images.pexels.com/photos/7317926/pexels-photo-7317926.jpeg' },
              { label: 'Pre-Rolls', path: '/shop?cat=Pre-Rolls', img: 'https://images.pexels.com/photos/10363220/pexels-photo-10363220.jpeg' },
              { label: 'Edibles', path: '/shop?cat=Edibles', img: 'https://images.pexels.com/photos/332617/pexels-photo-332617.jpeg' },
              { label: 'Concentrates', path: '/shop?cat=Concentrates', img: 'https://images.pexels.com/photos/1614942/pexels-photo-1614942.jpeg' }
            ].map((cat) => (
              <Link key={cat.label} to={cat.path} className="group relative aspect-[4/5] overflow-hidden border border-white/5 rounded-sm">
                <img src={cat.img} className="w-full h-full object-cover opacity-40 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000 group-hover:scale-105" />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-all" />
                <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                    <span className="text-2xl serif-display italic font-light tracking-widest uppercase group-hover:scale-110 transition-transform">{cat.label}</span>
                    <div className="w-8 h-[1px] bg-[#d4af37] mt-4 scale-x-0 group-hover:scale-x-100 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Menu Items */}
      <section className="py-24 px-6 md:px-12 bg-[#080a08]">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-16 border-b border-white/5 pb-8">
             <div className="space-y-2">
                <h2 className="text-3xl md:text-5xl serif-display italic font-light">Staff Favorites</h2>
                <p className="text-[10px] text-[#d4af37] uppercase tracking-[0.3em] font-black">Highest Rated Strains</p>
             </div>
             <Link to="/shop" className="artifact-label text-white/40 hover:text-[#d4af37] transition-all flex items-center gap-4 group">
               FULL MENU <span className="group-hover:translate-x-2 transition-transform">→</span>
             </Link>
          </div>
          <div className="archive-grid">
             {pieces.slice(0, 4).map((p) => (
                <ProductCard key={p.id} product={p} onAddToCart={onAddToCart} />
             ))}
          </div>
        </div>
      </section>

      {/* Education & Values */}
      <section className="py-48 px-6 md:px-12 bg-[#050705] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-[#10b981]/5 blur-[120px] rounded-full pointer-events-none" />
          <div className="max-w-4xl mx-auto text-center space-y-12">
              <div className="artifact-label text-[#d4af37]">EDUCATION // THE LAB</div>
              <h2 className="text-5xl md:text-8xl serif-display italic font-light leading-tight">
                Know Your Profile.
              </h2>
              <p className="text-white/50 text-xl md:text-2xl max-w-2xl mx-auto italic serif-display leading-relaxed">
                Cannabis is more than THC. We prioritize full-spectrum education—understanding terpenes, cannabinoids, and how they interact with your unique biology.
              </p>
              <div className="pt-8">
                <Link to="/philosophy" className="inline-block py-6 px-16 border border-[#d4af37]/30 hover:bg-[#d4af37] hover:text-black uppercase text-[10px] tracking-widest font-black transition-all">
                   EXPLORE THE LEARN CENTER
                </Link>
              </div>
          </div>
      </section>

      {/* Delivery / Rewards Promo */}
      <section className="py-24 px-6 md:px-12 border-t border-white/5 bg-[#080a08]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
           <div className="p-12 bg-white/5 rounded-sm border border-white/5 space-y-6">
              <div className="artifact-label text-[#10b981]">LOCAL SERVICE</div>
              <h3 className="text-3xl serif-display italic font-light">Express Delivery</h3>
              <p className="text-white/40 text-sm">Serving Manhattan, Brooklyn, and Queens with licensed express delivery. 100% compliant, 100% discrete.</p>
              <button className="text-[10px] font-black uppercase tracking-widest text-[#10b981] hover:text-white transition-all">CHECK YOUR ZIP →</button>
           </div>
           <div className="p-12 bg-[#d4af37]/5 rounded-sm border border-[#d4af37]/10 space-y-6">
              <div className="artifact-label text-[#d4af37]">LOYALTY</div>
              <h3 className="text-3xl serif-display italic font-light">Join the Circle</h3>
              <p className="text-white/40 text-sm">Earn points on every purchase, get early access to limited strain drops, and receive exclusive member-only invites.</p>
              <button className="text-[10px] font-black uppercase tracking-widest text-[#d4af37] hover:text-white transition-all">START EARNING →</button>
           </div>
        </div>
      </section>
    </div>
  );
};

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [content, setContent] = useState<SiteContent>(DEFAULT_CONTENT);
  const [pieces, setPieces] = useState<Piece[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [syncError, setSyncError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      const [cloudContent, cloudPieces] = await Promise.all([getSiteContent(), getPieces()]);
      if (cloudContent) setContent(prev => ({ ...prev, ...cloudContent }));
      if (cloudPieces && cloudPieces.length > 0) setPieces(cloudPieces);
    } catch (error: any) {
      setSyncError(error.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const lenis = new Lenis({ duration: 1.2, smoothWheel: true });
    function raf(time: number) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
    loadData();
    return () => lenis.destroy();
  }, [loadData]);

  const handleAddToCart = (product: Piece) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) {
        return prev.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#050705] flex items-center justify-center font-mono">
        <div className="w-8 h-8 border border-white/20 border-t-[#d4af37] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <HashRouter>
      <ScrollToTop />
      <AgeGate />
      <div className="min-h-screen bg-[#050705] text-[#f5f5f0] selection:bg-[#d4af37] selection:text-black font-sans">
        <Navbar scrolled={false} syncError={syncError} cartCount={cart.reduce((a,b) => a + b.quantity, 0)} />
        
        <Routes>
          <Route path="/" element={<HomePage content={content} pieces={pieces} onAddToCart={handleAddToCart} />} />
          <Route path="/shop" element={<Shop pieces={pieces} onAddToCart={handleAddToCart} />} />
          <Route path="/deals" element={<Shop pieces={pieces.filter(p => p.status === 'LIMITED')} onAddToCart={handleAddToCart} />} />
          <Route path="/philosophy" element={<Philosophy content={content} />} />
          <Route path="/artifact/:id" element={<PieceDetail />} />
        </Routes>

        <Footer content={content} setContent={setContent} pieces={pieces} loadData={loadData} />
      </div>
    </HashRouter>
  );
};

export default App;
