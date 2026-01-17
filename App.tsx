
import React, { useState, useEffect, useCallback } from 'react';
import { HashRouter, Routes, Route, Link } from 'react-router-dom';
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

const DEFAULT_CONTENT: SiteContent = {
  heroTitle: "DISCOVER LEGAL CANNABIS",
  heroSubTitle: "Your trusted source for recreational cannabis. Safe, regulated, and responsibly sourced.",
  heroMediaUrl: "https://images.pexels.com/photos/1466335/pexels-photo-1466335.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  archiveStatementTitle: "RESPONSIBLE CONSUMPTION",
  archiveStatementText1: "Start low and go slow. Understanding how cannabis affects you is key to a positive experience.",
  archiveStatementText2: "All products sold are federally compliant and lab-tested for your safety.",
  footerTagline: "Licensed Retailer #0862",
  fitChecks: []
};

const HomePage: React.FC<{ content: SiteContent; pieces: Piece[]; onAddToCart: (p: Piece) => void }> = ({ content, pieces, onAddToCart }) => {
  return (
    <div className="min-h-screen bg-white text-neutral-900">
      {/* Hero */}
      <header className="relative h-[600px] flex flex-col justify-center items-center text-center px-6 bg-neutral-100 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={content.heroMediaUrl} className="w-full h-full object-cover opacity-90" alt="Hero" />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <div className="relative z-10 max-w-3xl space-y-6">
          <h1 className="text-5xl md:text-7xl font-bold text-white tracking-wide display-font">
            {content.heroTitle}
          </h1>
          <p className="text-white/90 text-lg md:text-xl max-w-xl mx-auto font-medium">
            {content.heroSubTitle}
          </p>
          <div className="pt-8">
             <Link 
               to="/shop"
               className="inline-block bg-[#b91c1c] text-white px-10 py-4 font-bold uppercase tracking-widest text-sm hover:bg-red-800 transition-colors rounded-sm"
             >
               Shop Collections
             </Link>
          </div>
        </div>
      </header>
      
      {/* Shop by Category */}
      <section className="py-20 px-6 md:px-12 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-10 text-center display-font tracking-wide text-neutral-800">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { label: 'Flower', path: '/shop?cat=Flower', icon: '🌿' },
            { label: 'Pre-Rolls', path: '/shop?cat=Pre-Rolls', icon: '🚬' },
            { label: 'Vapes', path: '/shop?cat=Vapes', icon: '💨' },
            { label: 'Edibles', path: '/shop?cat=Edibles', icon: '🍬' },
            { label: 'Extracts', path: '/shop?cat=Concentrates', icon: '💧' },
            { label: 'Topicals', path: '/shop?cat=Topicals', icon: '🧴' }
          ].map((cat) => (
            <Link key={cat.label} to={cat.path} className="flex flex-col items-center justify-center p-8 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 transition-all rounded-sm group">
               <span className="text-3xl mb-3 group-hover:scale-110 transition-transform">{cat.icon}</span>
               <span className="font-bold uppercase text-sm tracking-wide text-neutral-600 group-hover:text-neutral-900">{cat.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-20 px-6 md:px-12 bg-neutral-50 border-t border-neutral-200">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-10">
             <h2 className="text-3xl font-bold display-font tracking-wide text-neutral-800">New Arrivals</h2>
             <Link to="/shop" className="text-sm font-bold uppercase tracking-widest text-[#b91c1c] hover:underline">View All</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
             {pieces.slice(0, 4).map((p) => (
                <ProductCard key={p.id} product={p} onAddToCart={onAddToCart} />
             ))}
          </div>
        </div>
      </section>

      {/* Education Banner */}
      <section className="py-24 px-6 md:px-12 bg-neutral-900 text-white">
          <div className="max-w-4xl mx-auto text-center space-y-8">
              <h2 className="text-4xl md:text-5xl font-bold display-font tracking-wide">
                Learn About Cannabis
              </h2>
              <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
                Whether you're new to cannabis or looking to expand your knowledge, our guide covers everything from plant types to consumption methods.
              </p>
              <div className="pt-4">
                <Link to="/philosophy" className="inline-block border-2 border-white px-10 py-3 font-bold uppercase tracking-widest text-sm hover:bg-white hover:text-neutral-900 transition-all rounded-sm">
                   Visit Knowledge Hub
                </Link>
              </div>
          </div>
      </section>

      {/* Promo Grid */}
      <section className="py-20 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <div className="p-12 bg-neutral-100 border border-neutral-200 space-y-4 rounded-sm">
              <h3 className="text-2xl font-bold display-font">Click & Collect</h3>
              <p className="text-neutral-600">Order online and pick up at your nearest location in as little as 15 minutes.</p>
              <button className="text-sm font-bold uppercase text-[#b91c1c] tracking-widest mt-4 inline-block">Find a Store →</button>
           </div>
           <div className="p-12 bg-neutral-100 border border-neutral-200 space-y-4 rounded-sm">
              <h3 className="text-2xl font-bold display-font">Legal & Safe</h3>
              <p className="text-neutral-600">All products are tested for quality and safety. We promote responsible consumption.</p>
              <Link to="/philosophy" className="text-sm font-bold uppercase text-[#b91c1c] tracking-widest mt-4 inline-block">Read Safety Guide →</Link>
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

  const loadData = useCallback(async () => {
    try {
      const [cloudContent, cloudPieces] = await Promise.all([getSiteContent(), getPieces()]);
      if (cloudContent) setContent(prev => ({ ...prev, ...cloudContent }));
      if (cloudPieces && cloudPieces.length > 0) setPieces(cloudPieces);
    } catch (error) {
      console.error(error);
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
      <div className="min-h-screen bg-white flex items-center justify-center font-sans text-neutral-400">
        Loading Store...
      </div>
    );
  }

  return (
    <HashRouter>
      <ScrollToTop />
      <AgeGate />
      <div className="min-h-screen bg-white text-neutral-900 font-sans">
        <Navbar scrolled={false} syncError={null} cartCount={cart.reduce((a,b) => a + b.quantity, 0)} />
        
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
