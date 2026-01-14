
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
import { uploadToCloudinary } from '../services/cloudinaryService';

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
  const [activeTab, setActiveTab] = useState<'content' | 'pieces'>('content');
  const [isUploading, setIsUploading] = useState<string | null>(null);
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
      setError(err.message || "Invalid credentials");
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  const handleAddPiece = async () => {
    const newPiece: Omit<Piece, 'id'> = {
      code: `RL-ARCH-${(pieces.length + 1).toString().padStart(4, '0')}`,
      era: '1990s',
      status: 'ARCHIVED',
      imageUrl: 'https://picsum.photos/800/1000',
      material: 'Nylon',
      condition: 'Archive',
      classification: 'Original Record',
      description: '',
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
    if (confirm("Delete this artifact from the cloud?")) {
      await removePiece(id);
      onRefreshPieces();
    }
  };

  const handleImageUpload = async (id: string, e: React.ChangeEvent<HTMLInputElement>, isGallery: boolean = false) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(`${id}-${isGallery ? 'gal' : 'main'}`);
      try {
        const url = await uploadToCloudinary(file);
        if (isGallery) {
          const currentPiece = pieces.find(p => p.id === id);
          const currentGallery = currentPiece?.additionalImages || [];
          await updatePieceData(id, { additionalImages: [...currentGallery, url] });
        } else {
          await updatePieceData(id, { imageUrl: url });
        }
        onRefreshPieces();
      } catch (err) {
        alert("Upload failed. Verify Cloudinary configuration.");
      } finally {
        setIsUploading(null);
      }
    }
  };

  const handleSaveContent = async () => {
    await saveSiteContent(content);
    alert("Site content synchronized with cloud.");
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="text-[10px] font-mono text-white/20 hover:text-white uppercase tracking-[0.4em] transition-all py-2"
      >
        [ SYSTEM_TERMINAL ]
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] bg-black text-white flex flex-col p-4 md:p-8 overflow-hidden font-mono">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-white/10 pb-4 md:pb-6 mb-4 md:mb-6 gap-4">
        <h2 className="text-lg md:text-xl font-black tracking-tighter">RAWLINE_CLOUD v1.2</h2>
        <div className="flex gap-4 w-full sm:w-auto">
          {user && <button onClick={handleLogout} className="text-[8px] md:text-[10px] uppercase tracking-widest text-white/40 hover:text-white transition-all">TERMINATE</button>}
          <button onClick={() => setIsOpen(false)} className="flex-1 sm:flex-none text-[10px] md:text-sm border border-white px-3 md:px-4 py-1.5 md:py-2 hover:bg-white hover:text-black transition-all">EXIT_SHELL</button>
        </div>
      </div>

      {!user ? (
        <div className="flex-1 flex flex-col items-center justify-center space-y-6">
          <div className="text-center space-y-2">
            <p className="text-xs md:text-sm text-white/40 uppercase tracking-widest">Authentication Required.</p>
            {error && <p className="text-red-500 text-[8px] md:text-[10px] uppercase font-bold tracking-widest">{error}</p>}
          </div>
          <form onSubmit={handleLogin} className="flex flex-col gap-3 md:gap-4 w-full max-w-xs md:max-w-sm">
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white/5 border border-white/10 px-4 py-3 text-xs md:text-sm focus:outline-none focus:border-white/40 transition-all"
              placeholder="OPERATOR_EMAIL"
              required
            />
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-white/5 border border-white/10 px-4 py-3 text-xs md:text-sm focus:outline-none focus:border-white/40 transition-all"
              placeholder="OPERATOR_KEY"
              required
            />
            <button type="submit" className="bg-white text-black px-6 py-3 text-[10px] md:text-xs font-black hover:bg-white/80 transition-all uppercase tracking-[0.2em]">INITIALIZE</button>
          </form>
        </div>
      ) : (
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex gap-4 md:gap-8 mb-6 md:mb-8 border-b border-white/5">
            <button 
              onClick={() => setActiveTab('content')}
              className={`pb-3 md:pb-4 text-[8px] md:text-[10px] tracking-widest uppercase transition-all ${activeTab === 'content' ? 'border-b-2 border-white font-bold' : 'text-white/30'}`}
            >
              METADATA
            </button>
            <button 
              onClick={() => setActiveTab('pieces')}
              className={`pb-3 md:pb-4 text-[8px] md:text-[10px] tracking-widest uppercase transition-all ${activeTab === 'pieces' ? 'border-b-2 border-white font-bold' : 'text-white/30'}`}
            >
              ARTIFACTS
            </button>
          </div>

          <div className="flex-1 overflow-y-auto no-scrollbar space-y-8 md:space-y-12 pb-32">
            {activeTab === 'content' ? (
              <div className="max-w-4xl space-y-6 md:space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                  <div className="space-y-2">
                    <label className="text-[8px] md:text-[10px] text-white/40 uppercase tracking-widest">Hero Title</label>
                    <input 
                      className="w-full bg-white/5 border border-white/10 p-3 md:p-4 text-xs md:text-sm focus:border-white/40 transition-all"
                      value={content.heroTitle}
                      onChange={(e) => onUpdateContent({ ...content, heroTitle: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[8px] md:text-[10px] text-white/40 uppercase tracking-widest">Statement Title</label>
                    <input 
                      className="w-full bg-white/5 border border-white/10 p-3 md:p-4 text-xs md:text-sm focus:border-white/40 transition-all"
                      value={content.archiveStatementTitle}
                      onChange={(e) => onUpdateContent({ ...content, archiveStatementTitle: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[8px] md:text-[10px] text-white/40 uppercase tracking-widest">Hero Subtitle</label>
                  <textarea 
                    className="w-full bg-white/5 border border-white/10 p-3 md:p-4 text-xs md:text-sm h-24 md:h-32 focus:border-white/40 transition-all"
                    value={content.heroSubTitle}
                    onChange={(e) => onUpdateContent({ ...content, heroSubTitle: e.target.value })}
                  />
                </div>
                <button 
                  onClick={handleSaveContent}
                  className="w-full md:w-auto bg-white text-black px-8 md:px-12 py-3 md:py-4 text-[10px] md:text-xs font-black uppercase tracking-[0.2em] hover:bg-white/90"
                >
                  SYNCHRONIZE_SITE
                </button>
              </div>
            ) : (
              <div className="space-y-6 md:space-y-8">
                <button 
                  onClick={handleAddPiece}
                  className="w-full border-2 border-dashed border-white/10 py-8 md:py-12 text-white/20 hover:text-white hover:border-white/30 transition-all uppercase text-[8px] md:text-[10px] tracking-widest bg-white/5"
                >
                  + CATALOG_NEW_ARTIFACT
                </button>
                <div className="grid grid-cols-1 gap-12">
                  {pieces.map((piece) => (
                    <div key={piece.id} className="border border-white/10 p-6 md:p-10 space-y-8 bg-white/5">
                      <div className="flex justify-between items-start border-b border-white/5 pb-6">
                        <div className="text-[10px] md:text-xs font-black tracking-widest uppercase">ID_ENTRY: {piece.id.substring(0,8)}</div>
                        <button onClick={() => handleDeletePiece(piece.id)} className="text-[9px] text-red-600 hover:text-red-400 font-black tracking-widest uppercase">PURGE_FROM_ARCHIVE</button>
                      </div>
                      
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        <div className="space-y-6">
                          <div className="grid grid-cols-2 gap-6">
                            <div className="flex flex-col gap-2">
                              <label className="text-[8px] uppercase text-white/30 tracking-widest">Code</label>
                              <input 
                                className="bg-white/5 border border-white/10 p-3 text-xs focus:border-white/40"
                                value={piece.code}
                                onChange={(e) => handlePieceFieldUpdate(piece.id, 'code', e.target.value)}
                              />
                            </div>
                            <div className="flex flex-col gap-2">
                              <label className="text-[8px] uppercase text-white/30 tracking-widest">Era</label>
                              <input 
                                className="bg-white/5 border border-white/10 p-3 text-xs focus:border-white/40"
                                value={piece.era}
                                onChange={(e) => handlePieceFieldUpdate(piece.id, 'era', e.target.value)}
                              />
                            </div>
                          </div>

                          <div className="flex flex-col gap-2">
                            <label className="text-[8px] uppercase text-white/30 tracking-widest">Technical Description</label>
                            <textarea 
                              className="bg-white/5 border border-white/10 p-3 text-xs h-32 focus:border-white/40 resize-none no-scrollbar"
                              value={piece.description}
                              onChange={(e) => handlePieceFieldUpdate(piece.id, 'description', e.target.value)}
                              placeholder="Enter full technical summary..."
                            />
                          </div>
                        </div>

                        <div className="space-y-6">
                           <div className="flex flex-col gap-2">
                              <label className="text-[8px] uppercase text-white/30 tracking-widest">Reference Image</label>
                              <div className="flex gap-4">
                                <div className="w-24 h-32 bg-black/40 border border-white/10 shrink-0">
                                  <img src={piece.imageUrl} className="w-full h-full object-cover grayscale" />
                                </div>
                                <div className="flex-1 flex flex-col justify-end">
                                   <input type="file" className="text-[10px] mb-2" onChange={(e) => handleImageUpload(piece.id, e, false)} />
                                   <p className="text-[8px] text-white/20 uppercase">Primary file asset</p>
                                </div>
                              </div>
                           </div>

                           <div className="space-y-2">
                              <label className="text-[8px] uppercase text-white/30 tracking-widest">Gallery Assets ({piece.additionalImages?.length || 0})</label>
                              <div className="grid grid-cols-4 gap-2">
                                {piece.additionalImages?.map((img, i) => (
                                  <div key={i} className="aspect-square bg-black/40 border border-white/10">
                                    <img src={img} className="w-full h-full object-cover grayscale opacity-60" />
                                  </div>
                                ))}
                                <label className="aspect-square border border-dashed border-white/20 flex items-center justify-center cursor-pointer hover:border-white/40 transition-colors">
                                   <input type="file" className="hidden" onChange={(e) => handleImageUpload(piece.id, e, true)} />
                                   <span className="text-xl">+</span>
                                </label>
                              </div>
                           </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCMS;
