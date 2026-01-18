
import React, { useState, useEffect } from 'react';
import { Piece, SiteContent } from '../types';
import { 
  auth, 
  saveSiteContent, 
  createPiece, 
  updatePieceData, 
  removePiece 
} from '../services/firebaseService';
import { signInWithEmailAndPassword, onAuthStateChanged, signOut, User } from 'firebase/auth';
import { uploadToCloudinary, getOptimizedUrl } from '../services/cloudinaryService';
import { isVideoUrl, getUnitLabel } from '../utils';

interface AdminCMSProps {
  content: SiteContent;
  onUpdateContent: (newContent: SiteContent) => void;
  pieces: Piece[];
  onRefreshPieces: () => void;
}

const AdminCMS: React.FC<AdminCMSProps> = ({ content, onUpdateContent, pieces, onRefreshPieces }) => {
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'content'>('products');
  const [isUploading, setIsUploading] = useState<Record<string, boolean>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsubscribe();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      setError("Invalid login credentials.");
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  const handleAddPiece = async () => {
    const newPiece: Omit<Piece, 'id'> = {
      code: `New Product`,
      era: 'Hybrid',
      status: 'NEW',
      imageUrl: 'https://images.pexels.com/photos/7317926/pexels-photo-7317926.jpeg',
      material: '20', // THC %
      condition: '0', // CBD %
      classification: 'Flower',
      description: '',
      price: 100,
      weight: 3.5,
      additionalImages: []
    };
    await createPiece(newPiece);
    onRefreshPieces();
  };

  const handlePieceFieldUpdate = async (id: string, field: keyof Piece, value: any) => {
    await updatePieceData(id, { [field]: value });
    onRefreshPieces();
  };

  const handleDeletePiece = async (id: string) => {
    if (confirm("Are you sure you want to delete this product? This action cannot be undone.")) {
      await removePiece(id);
      onRefreshPieces();
    }
  };

  const handleMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>, callback: (url: string) => void, id: string) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    setIsUploading(prev => ({ ...prev, [id]: true }));
    try {
      const url = await uploadToCloudinary(files[0] as File);
      callback(url);
    } catch (err) {
      alert("Upload failed.");
    } finally {
      setIsUploading(prev => ({ ...prev, [id]: false }));
    }
  };

  const handleRemoveCarouselItem = (idx: number) => {
    const newUrls = [...(content.heroCarouselUrls || [])];
    newUrls.splice(idx, 1);
    onUpdateContent({ ...content, heroCarouselUrls: newUrls });
  };

  const handleSaveGlobalContent = async () => {
    setIsSaving(true);
    try {
      await saveSiteContent(content);
      alert("Site settings saved successfully.");
    } catch (err) {
      alert("Failed to save settings.");
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="text-xs font-bold uppercase tracking-widest text-neutral-500 hover:text-[#b91c1c] transition-colors flex items-center gap-2"
      >
        <span className="w-2 h-2 rounded-full bg-neutral-300"></span>
        Staff Login
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] bg-gray-50 flex flex-col font-sans text-neutral-900 overflow-hidden">
      
      {/* Header */}
      <header className="bg-white border-b border-gray-200 h-16 px-6 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold uppercase tracking-wide text-neutral-900 display-font">Retail Manager</h2>
          {user && <span className="px-2 py-1 bg-green-100 text-green-800 text-[10px] font-bold uppercase tracking-widest rounded-sm">Online</span>}
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => setIsOpen(false)} className="text-sm font-bold text-neutral-500 hover:text-neutral-900 uppercase tracking-wide">Close</button>
          {user && (
            <button onClick={handleLogout} className="text-sm font-bold text-[#b91c1c] hover:text-red-800 uppercase tracking-wide">Log Out</button>
          )}
        </div>
      </header>

      {!user ? (
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="bg-white p-10 border border-gray-200 rounded-sm shadow-sm max-w-sm w-full space-y-6">
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-bold display-font">Staff Access</h3>
              <p className="text-neutral-500 text-sm">Please sign in to manage inventory.</p>
            </div>
            
            {error && <div className="bg-red-50 text-[#b91c1c] p-3 text-sm rounded-sm text-center font-medium">{error}</div>}
            
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-widest text-neutral-500">Email ID</label>
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  className="w-full bg-gray-50 border border-gray-200 p-3 text-sm focus:outline-none focus:border-neutral-400 transition-colors rounded-sm"
                  required 
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-widest text-neutral-500">Password</label>
                <input 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  className="w-full bg-gray-50 border border-gray-200 p-3 text-sm focus:outline-none focus:border-neutral-400 transition-colors rounded-sm"
                  required 
                />
              </div>
              <button type="submit" className="w-full bg-[#1a1a1a] text-white py-4 font-bold uppercase tracking-widest text-xs hover:bg-neutral-800 transition-colors rounded-sm mt-4">
                Access Dashboard
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar */}
          <aside className="w-64 bg-white border-r border-gray-200 flex-col hidden md:flex">
            <nav className="p-6 space-y-2">
              <button 
                onClick={() => setActiveTab('products')} 
                className={`w-full text-left px-4 py-3 rounded-sm text-sm font-bold uppercase tracking-widest transition-colors ${activeTab === 'products' ? 'bg-gray-100 text-[#b91c1c]' : 'text-neutral-500 hover:bg-gray-50 hover:text-neutral-900'}`}
              >
                Inventory
              </button>
              <button 
                onClick={() => setActiveTab('content')} 
                className={`w-full text-left px-4 py-3 rounded-sm text-sm font-bold uppercase tracking-widest transition-colors ${activeTab === 'content' ? 'bg-gray-100 text-[#b91c1c]' : 'text-neutral-500 hover:bg-gray-50 hover:text-neutral-900'}`}
              >
                Site Content
              </button>
            </nav>
            <div className="mt-auto p-6 border-t border-gray-200">
               <div className="text-xs text-neutral-400">
                  <p><strong>System Status:</strong> Operational</p>
                  <p className="mt-1">v2.4.0 Retail Build</p>
               </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 overflow-y-auto bg-gray-50 p-6 md:p-12">
            <div className="max-w-5xl mx-auto">
              
              {/* Mobile Tab Nav */}
              <div className="md:hidden flex gap-2 mb-8 overflow-x-auto pb-2">
                 <button onClick={() => setActiveTab('products')} className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest whitespace-nowrap ${activeTab === 'products' ? 'bg-neutral-900 text-white' : 'bg-white text-neutral-900 border'}`}>Inventory</button>
                 <button onClick={() => setActiveTab('content')} className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest whitespace-nowrap ${activeTab === 'content' ? 'bg-neutral-900 text-white' : 'bg-white text-neutral-900 border'}`}>Site Content</button>
              </div>

              {activeTab === 'content' ? (
                <div className="space-y-8">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold display-font">Storefront Metadata</h2>
                    <button 
                      onClick={handleSaveGlobalContent}
                      disabled={isSaving}
                      className="bg-[#1a1a1a] text-white px-6 py-3 font-bold uppercase tracking-widest text-xs rounded-sm hover:bg-neutral-800 disabled:opacity-50"
                    >
                      {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>

                  <div className="bg-white p-8 rounded-sm border border-gray-200 shadow-sm space-y-8">
                    <h3 className="font-bold text-sm uppercase tracking-widest border-b border-gray-100 pb-2 mb-4">Homepage Hero</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-neutral-500 uppercase">Headline</label>
                        <input className="w-full bg-gray-50 border border-gray-200 p-3 rounded-sm text-sm" value={content.heroTitle} onChange={(e) => onUpdateContent({ ...content, heroTitle: e.target.value })} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-neutral-500 uppercase">Sub-Headline</label>
                        <input className="w-full bg-gray-50 border border-gray-200 p-3 rounded-sm text-sm" value={content.heroSubTitle} onChange={(e) => onUpdateContent({ ...content, heroSubTitle: e.target.value })} />
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <label className="text-xs font-bold text-neutral-500 uppercase">Hero Carousel Media</label>
                        <div className="relative">
                          <label className="bg-[#b91c1c] text-white px-4 py-2 text-[10px] font-bold uppercase tracking-widest rounded-sm cursor-pointer hover:bg-red-800 transition-colors">
                            + Add New Media
                            <input 
                              type="file" 
                              accept="image/*,video/*" 
                              className="hidden" 
                              onChange={(e) => handleMediaUpload(e, (url) => {
                                const current = content.heroCarouselUrls || [];
                                onUpdateContent({ ...content, heroCarouselUrls: [...current, url] });
                              }, 'carousel-add')} 
                            />
                          </label>
                          {isUploading['carousel-add'] && (
                            <div className="absolute -left-8 top-1">
                               <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 pt-4">
                        {(content.heroCarouselUrls || []).map((url, idx) => (
                          <div key={idx} className="relative aspect-video group bg-neutral-100 border border-neutral-200 rounded-sm overflow-hidden">
                             {isVideoUrl(url) ? (
                               <video src={url} className="w-full h-full object-cover" muted />
                             ) : (
                               <img src={url} className="w-full h-full object-cover" alt={`Carousel ${idx}`} />
                             )}
                             <button 
                               onClick={() => handleRemoveCarouselItem(idx)}
                               className="absolute top-1 right-1 bg-red-600 text-white w-5 h-5 flex items-center justify-center rounded-sm opacity-0 group-hover:opacity-100 transition-opacity text-[10px]"
                             >
                               ×
                             </button>
                             <div className="absolute bottom-1 left-1 bg-black/60 text-white text-[8px] px-1 py-0.5 rounded-sm">
                               {idx + 1}
                             </div>
                          </div>
                        ))}
                        {(!content.heroCarouselUrls || content.heroCarouselUrls.length === 0) && (
                          <div className="col-span-full py-12 text-center bg-neutral-50 border border-dashed border-neutral-200 text-neutral-400 text-[10px] font-bold uppercase tracking-widest">
                             No items in carousel.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-8">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold display-font">Product Inventory</h2>
                    <button 
                      onClick={handleAddPiece}
                      className="bg-[#b91c1c] text-white px-6 py-3 font-bold uppercase tracking-widest text-xs rounded-sm hover:bg-red-800"
                    >
                      + Add New Product
                    </button>
                  </div>

                  <div className="space-y-4">
                    {pieces.map((piece) => {
                      const unit = getUnitLabel(piece.classification);
                      return (
                      <div key={piece.id} className="bg-white border border-gray-200 rounded-sm shadow-sm p-6 hover:shadow-md transition-shadow">
                        <div className="flex flex-col lg:flex-row gap-8">
                          
                          {/* Image Section */}
                          <div className="w-full lg:w-48 flex-shrink-0">
                            <div className="aspect-square bg-gray-100 rounded-sm overflow-hidden border border-gray-200 relative group">
                               {isUploading[piece.id] ? (
                                 <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10">
                                   <div className="w-6 h-6 border-2 border-[#b91c1c] border-t-transparent rounded-full animate-spin"></div>
                                 </div>
                               ) : (
                                 <img src={piece.imageUrl} className="w-full h-full object-cover" />
                               )}
                               
                               <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity">
                                 <span className="text-white text-[10px] font-bold uppercase tracking-widest">Change Image</span>
                                 <input type="file" accept="image/*" className="hidden" onChange={(e) => handleMediaUpload(e, (url) => handlePieceFieldUpdate(piece.id, 'imageUrl', url), piece.id)} />
                               </label>
                            </div>
                            <button onClick={() => handleDeletePiece(piece.id)} className="w-full mt-3 text-red-600 text-[10px] font-bold uppercase tracking-widest hover:bg-red-50 py-2 rounded-sm transition-colors">Delete Product</button>
                          </div>

                          {/* Details Section */}
                          <div className="flex-1 space-y-6">
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                               <div className="space-y-1">
                                  <label className="text-[10px] font-bold text-neutral-400 uppercase">Product Name</label>
                                  <input className="w-full bg-gray-50 border border-gray-200 p-2.5 rounded-sm text-sm font-bold" value={piece.code} onChange={(e) => handlePieceFieldUpdate(piece.id, 'code', e.target.value)} />
                               </div>
                               <div className="space-y-1">
                                  <label className="text-[10px] font-bold text-neutral-400 uppercase">Inventory Status</label>
                                  <select value={piece.status} onChange={(e) => handlePieceFieldUpdate(piece.id, 'status', e.target.value)} className="w-full bg-gray-50 border border-gray-200 p-2.5 rounded-sm text-xs font-bold uppercase">
                                    {['IN STOCK', 'OUT OF STOCK', 'LIMITED', 'NEW'].map(s => <option key={s} value={s}>{s}</option>)}
                                  </select>
                               </div>
                             </div>

                             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="space-y-1">
                                  <label className="text-[10px] font-bold text-neutral-400 uppercase">Category</label>
                                  <select className="w-full bg-gray-50 border border-gray-200 p-2 rounded-sm text-xs" value={piece.classification} onChange={(e) => handlePieceFieldUpdate(piece.id, 'classification', e.target.value)}>
                                    {['Flower', 'Pre-Rolls', 'Edibles', 'Concentrates', 'Vapes', 'Topicals'].map(c => <option key={c} value={c}>{c}</option>)}
                                  </select>
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[10px] font-bold text-neutral-400 uppercase">Plant Type</label>
                                  <select className="w-full bg-gray-50 border border-gray-200 p-2 rounded-sm text-xs" value={piece.era} onChange={(e) => handlePieceFieldUpdate(piece.id, 'era', e.target.value)}>
                                    {['Indica', 'Sativa', 'Hybrid', 'High CBD'].map(s => <option key={s} value={s}>{s}</option>)}
                                  </select>
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[10px] font-bold text-neutral-400 uppercase">THC %</label>
                                  <input type="number" className="w-full bg-gray-50 border border-gray-200 p-2 rounded-sm text-xs" value={piece.material} onChange={(e) => handlePieceFieldUpdate(piece.id, 'material', e.target.value)} />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[10px] font-bold text-neutral-400 uppercase">Qty / Amount ({unit})</label>
                                  <input type="number" step="0.1" className="w-full bg-gray-50 border border-gray-200 p-2 rounded-sm text-xs" value={piece.weight || (piece.classification === 'Flower' ? 3.5 : 1)} onChange={(e) => handlePieceFieldUpdate(piece.id, 'weight', parseFloat(e.target.value))} />
                                </div>
                             </div>

                             <div className="space-y-1">
                                <label className="text-[10px] font-bold text-neutral-400 uppercase">Price per {unit} (Ksh)</label>
                                <input type="number" className="w-full bg-gray-50 border border-gray-200 p-2 rounded-sm text-xs" value={piece.price || (piece.classification === 'Vapes' ? 900 : 100)} onChange={(e) => handlePieceFieldUpdate(piece.id, 'price', parseInt(e.target.value))} />
                             </div>

                             <div className="space-y-1">
                                <label className="text-[10px] font-bold text-neutral-400 uppercase">Description</label>
                                <textarea className="w-full bg-gray-50 border border-gray-200 p-3 rounded-sm text-sm h-20 resize-none" value={piece.description} onChange={(e) => handlePieceFieldUpdate(piece.id, 'description', e.target.value)} />
                             </div>
                          </div>
                        </div>
                      </div>
                    )})}
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      )}
    </div>
  );
};

export default AdminCMS;
