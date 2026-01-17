
import React, { useState, useEffect, useCallback } from 'react';
import { HashRouter, Routes, Route, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Lenis from 'lenis';
import FadeInSection from './components/FadeInSection';
import PieceDetail from './components/PieceDetail';
import Philosophy from './components/Philosophy';
import Fits from './components/Fits';
import Shop from './components/Shop'; // Renamed from Archive
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import AgeGate from './components/AgeGate';
import { Piece, SiteContent, CartItem } from './types';
import { getPieces, getSiteContent } from './services/firebaseService';
import { isVideoUrl } from './utils';

const DEFAULT_CONTENT: SiteContent = {
  heroTitle: "PREMIUM CANNABIS. RAW AUTHENTICITY.",
  heroSubTitle: "Legal. Lab-tested. Delivered fast. We curate the strongest silhouettes in the industry.",
  heroMediaUrl: "https://videos.pexels.com/video-files/3248357/3248357-hd_1920_1080_25fps.mp4",
  archiveStatementTitle: "THE CODE",
  archiveStatementText1: "RAWLINE is where construction integrity meets the culture. We only stock products with heavy-duty testing and real history. If the quality ain't hitting, it ain't RAWLINE.",
  archiveStatementText2: "Built from the block, authenticated by the experts. No weak links in our rotation. You feel me.",
  footerTagline: "Elevated standard. Established outside.",
  fitChecks: []
};

const HomePage: React.FC<{ content: SiteContent; pieces: Piece[]; onAddToCart: (p: Piece) => void }> = ({ content, pieces, onAddToCart }) => {
  return (
    <div className="min-h-screen bg-[#080808] text-white">
      {/* Hero */}
      <header className="relative h-[90vh] flex flex-col justify-center items-center text-center px-6 overflow-hidden bg-black">
        <div className="absolute inset-0 z-0 opacity-50 grayscale-[0.5]">
          {isVideoUrl(content.heroMediaUrl) ? (
            <video autoPlay loop muted playsInline src={content.heroMediaUrl} className="w-full h-full object-cover" />
          ) : content.heroMediaUrl ? (
            <img src={content.heroMediaUrl} className="w-full h-full object-cover" alt="Hero" />
          ) : null}
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black" />
        </div>

        <FadeInSection className="max-w-4xl z-10 space-y-10">
          <div className="artifact-label text-emerald-500 font-black tracking-[0.5em] text-[8px]">
            LICENSED DISPENSARY // NYC_STRL_08
          </div>
          <h1 className="text-[clamp(2.5rem,8vw,6rem)] leading-[0.9] serif-display font-light italic tracking-tight text-white">
            {content.heroTitle}
          </h1>
          <p className="text-white/60 text-lg max-w-xl mx-auto font-light tracking-wide italic serif-display">
            {content.heroSubTitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
             <Link 
               to="/shop"
               className="bg-white text-black px-12 py-5 text-[10px] font-black uppercase tracking-[0.4em] hover:bg-neutral-200 transition-all"
             >
               SHOP FLOWER
             </Link>
             <Link 
               to="/shop?cat=Edibles"
               className="border border-white/20 text-white px-12 py-5 text-[10px] font-black uppercase tracking-[0.4em] hover:bg-white hover:text-black transition-all"
             >
               BROWSE EDIBLES
             </Link>
          </div>
        </FadeInSection>
      </header>
      
      {/* Quick Category Grid */}
      <section className="py-24 px-6 md:px-12 grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Flower', path: '/shop?cat=Flower', img: 'https://images.pexels.com/photos/7317926/pexels-photo-7317926.jpeg' },
          { label: 'Pre-Rolls', path: '/shop?cat=Pre-Rolls', img: 'https://images.pexels.com/photos/10363220/pexels-photo-10363220.jpeg' },
          { label: 'Edibles', path: '/shop?cat=Edibles', img: 'https://images.pexels.com/photos/332617/pexels-photo-332617.jpeg' },
          { label: 'Vapes', path: '/shop?cat=Vapes', img: 'https://images.pexels.com/photos/1614942/pexels-photo-1614942.jpeg' }
        ].map((cat) => (
          <Link key={cat.label} to={cat.path} className="group relative aspect-square overflow-hidden border border-white/5">
             <img src={cat.img} className="w-full h-full object-cover opacity-40 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 group-hover:scale-110" />
             <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xl serif-display italic font-light tracking-widest uppercase group-hover:scale-110 transition-transform">{cat.label}</span>
             </div>
          </Link>
        ))}
      </section>

      {/* Featured Drops */}
      <section className="py-24 px-6 md:px-12 bg-[#0a0a0a]">
        <div className="flex justify-between items-end mb-16 border-b border-white/5 pb-8">
           <div className="space-y-2">
              <h2 className="text-3xl md:text-5xl serif-display italic font-light">Fresh Selection</h2>
              <p className="text-[10px] text-white/30 uppercase tracking-[0.3em] font-black">Latest Lab-Tested Artifacts</p>
           </div>
           <Link to="/shop" className="artifact-label text-emerald-500 hover:text-white transition-all underline decoration-emerald-500/30 underline-offset-8">VIEW ALL</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
           {pieces.slice(0, 4).map((p) => (
              <ProductCard key={p.id} product={p} onAddToCart={onAddToCart} />
           ))}
        </div>
      </section>

      {/* Fast Motion Section */}
      <section className="py-32 px-6 md:px-24 border-y border-white/5 text-center space-y-8">
          <div className="artifact-label text-emerald-500">KNOWLEDGE_BASE</div>
          <h2 className="text-4xl md:text-6xl serif-display italic font-light max-w-2xl mx-auto leading-tight">
            "We don't just sell, we educate."
          </h2>
          <p className="text-white/40 max-w-lg mx-auto italic serif-display leading-relaxed">
            New to the culture? Our guides simplify the science. From terpenes to strain history, we give you the signal, not the noise.
          </p>
          <Link to="/philosophy" className="inline-block py-4 px-10 border border-white/10 hover:bg-white hover:text-black uppercase text-[10px] tracking-widest font-black transition-all">
             THE RAWLINE GUIDE
          </Link>
      </section>
    </div>
  );
};

// Reusable ProductCard defined in local scope for App.tsx if needed or imported
import ProductCard from './components/ProductCard';

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
    // Visual feedback would go here (e.g., toast)
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#080808] flex items-center justify-center font-mono">
        <div className="w-8 h-8 border border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <HashRouter>
      <ScrollToTop />
      <AgeGate />
      <div className="min-h-screen bg-[#080808] text-white selection:bg-emerald-600 selection:text-white font-sans">
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
