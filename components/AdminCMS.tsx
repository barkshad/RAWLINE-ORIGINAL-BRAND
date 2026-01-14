
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
    if (confirm("Permanently purge this record?")) {
      await removePiece(id);
      onRefreshPieces();
    }
  };

  const handleRemoveGalleryImage = async (id: string, index: number) => {
    const currentPiece = pieces.find(p => p.id === id);
    if (currentPiece && currentPiece.additionalImages) {
      const newGallery = currentPiece.additionalImages.filter((_, i) => i !== index);
      await updatePieceData(id, { additionalImages: newGallery });
      onRefreshPieces();
    }
  };

  const handleImageUpload = async (id: string, e: React.ChangeEvent<HTMLInputElement>, isGallery: boolean = false) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(`${id}-${isGallery ? 'gal' : 'main'}`);
    try {
      if (isGallery) {
        const uploadPromises = (Array.from(files) as File[]).map(file => uploadToCloudinary(file));
        const urls = await Promise.all(uploadPromises);
        const currentPiece = pieces.find(p => p.id === id);
        const currentGallery = currentPiece?.additionalImages || [];
        await updatePieceData(id, { additionalImages: [...currentGallery, ...urls] });
      } else {
        const url = await uploadToCloudinary(files[0] as File);
        await updatePieceData(id, { imageUrl: url });
      }
      onRefreshPieces();
    } catch (err) {
      alert("Upload failed. Verify Cloudinary configuration.");
    } finally {
      setIsUploading(null);
    }
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="text-[9px] font-mono text-white/20 hover:text-red-600 uppercase tracking-[0.5em] transition-all py-3 group flex items-center gap-4"
      >
        <span className="w-8 h-[1px] bg-white/10 group-hover:bg-red-600/40 group-hover:w-16 transition-all" /> 
        ACCESS_CONTROL_NODE
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] bg-[#020202] text-white flex flex-col p-6 md:p-12 overflow-hidden font-mono transition-all">
      <div className="noise opacity-10"></div>
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-white/5 pb-8 mb-10 gap-6">
        <div className="space-y-2">
          <h2 className="text-2xl md:text-3xl font-black tracking-tighter italic">FOUNDRY_CONTROLLER</h2>
          <div className="flex items-center gap-3">
             <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
             <span className="text-[10px] text-white/30 uppercase tracking-[0.4em]">Node: {user ? 'ROOT_ACCESS' : 'LOCKED'}</span>
          </div>
        </div>
        <div className="flex gap-4 w-full sm:w-auto">
          {user && (
            <button 
              onClick={handleLogout} 
              className="px-6 py-3 border border-red-600/30 text-red-600 text-[10px] uppercase tracking-widest font-black hover:bg-red-600 hover:text-white transition-all shadow-[0_0_20px_rgba(255,0,0,0.1)]"
            >
              TERMINATE_SESSION
            </button>
          )}
          <button 
            onClick={() => setIsOpen(false)} 
            className="flex-1 sm:flex-none px-6 py-3 bg-white text-black text-[10px] uppercase tracking-widest font-black hover:bg-neutral-200 transition-all cursor-none"
          >
            DISCONNECT
          </button>
        </div>
      </div>

      {!user ? (
        <div className="flex-1 flex flex-col items-center justify-center space-y-12 max-w-md mx-auto w-full">
          <div className="text-center space-y-4">
             <div className="text-5xl mb-6">🔑</div>
             <p className="text-xs text-white/40 uppercase tracking-[0.6em] font-black">Authorized Personnel Only.</p>
             {error && <p className="text-red-600 text-[10px] uppercase font-black bg-red-600/10 p-4 border border-red-600/20">{error}</p>}
          </div>
          <form onSubmit={handleLogin} className="w-full space-y-6">
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-neutral-900/50 border border-white/10 px-6 py-4 text-xs focus:outline-none focus:border-white/30 transition-all placeholder:text-white/10"
              placeholder="IDENT_ID"
              required
            />
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-neutral-900/50 border border-white/10 px-6 py-4 text-xs focus:outline-none focus:border-white/30 transition-all placeholder:text-white/10"
              placeholder="AUTH_PHRASE"
              required
            />
            <button type="submit" className="w-full bg-red-600 text-white px-6 py-5 text-xs font-black hover:bg-red-500 transition-all uppercase tracking-[0.8em] shadow-lg">UNLOCK</button>
          </form>
        </div>
      ) : (
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex gap-12 mb-10 border-b border-white/5">
            {['content', 'pieces'].map((tab) => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`pb-5 text-[11px] tracking-[0.6em] uppercase transition-all font-black ${activeTab === tab ? 'text-white border-b-2 border-red-600' : 'text-white/20 hover:text-white/40'}`}
              >
                {tab === 'content' ? 'SYSTEM_METADATA' : 'ARTIFACT_CATALOG'}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto no-scrollbar space-y-16 pb-32 pr-4">
            {activeTab === 'content' ? (
              <div className="max-w-4xl space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-4">
                    <label className="text-[10px] text-white/30 uppercase tracking-widest font-black">Hero Title</label>
                    <input 
                      className="w-full bg-white/5 border border-white/10 p-5 text-sm focus:border-white/40 transition-all"
                      value={content.heroTitle}
                      onChange={(e) => onUpdateContent({ ...content, heroTitle: e.target.value })}
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] text-white/30 uppercase tracking-widest font-black">Statement Subhead</label>
                    <input 
                      className="w-full bg-white/5 border border-white/10 p-5 text-sm focus:border-white/40 transition-all"
                      value={content.archiveStatementTitle}
                      onChange={(e) => onUpdateContent({ ...content, archiveStatementTitle: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] text-white/30 uppercase tracking-widest font-black">Archive Thesis</label>
                  <textarea 
                    className="w-full bg-white/5 border border-white/10 p-5 text-sm h-40 focus:border-white/40 transition-all resize-none"
                    value={content.heroSubTitle}
                    onChange={(e) => onUpdateContent({ ...content, heroSubTitle: e.target.value })}
                  />
                </div>
                <button 
                  onClick={async () => { await saveSiteContent(content); alert("Synchronized."); }}
                  className="bg-white text-black px-12 py-5 text-[10px] font-black uppercase tracking-[0.5em] hover:bg-neutral-200 shadow-xl"
                >
                  PUSH_TO_GLOBAL_PRODUCTION
                </button>
              </div>
            ) : (
              <div className="space-y-12 animate-in fade-in duration-700">
                <button 
                  onClick={handleAddPiece}
                  className="w-full border-2 border-dashed border-white/5 py-20 text-white/20 hover:text-white hover:border-white/20 transition-all uppercase text-[10px] tracking-[0.8em] bg-white/[0.02] font-black"
                >
                  + INITIALIZE_NEW_RECORD
                </button>
                <div className="grid grid-cols-1 gap-12">
                  {pieces.map((piece) => (
                    <div key={piece.id} className="glass-panel p-10 space-y-10 relative group">
                      <div className="flex justify-between items-center border-b border-white/5 pb-8">
                        <div className="flex items-center gap-4">
                           <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                           <div className="text-[11px] font-black tracking-[0.3em] uppercase italic text-white/80">RECORD: {piece.id.substring(0,8)}</div>
                        </div>
                        <button onClick={() => handleDeletePiece(piece.id)} className="text-[10px] text-red-600 hover:bg-red-600 hover:text-white px-4 py-2 border border-red-600/30 font-black tracking-widest uppercase transition-all">PURGE</button>
                      </div>
                      
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                        <div className="space-y-10">
                          <div className="grid grid-cols-2 gap-8">
                            <div className="space-y-3">
                              <label className="text-[8px] uppercase text-white/20 tracking-[0.5em] font-black">DESIGNATION_CODE</label>
                              <input 
                                className="w-full bg-black border border-white/10 p-4 text-xs font-bold focus:border-red-600/40"
                                value={piece.code}
                                onChange={(e) => handlePieceFieldUpdate(piece.id, 'code', e.target.value)}
                              />
                            </div>
                            <div className="space-y-3">
                              <label className="text-[8px] uppercase text-white/20 tracking-[0.5em] font-black">ERA_SLOT</label>
                              <input 
                                className="w-full bg-black border border-white/10 p-4 text-xs font-bold focus:border-red-600/40"
                                value={piece.era}
                                onChange={(e) => handlePieceFieldUpdate(piece.id, 'era', e.target.value)}
                              />
                            </div>
                          </div>

                          <div className="space-y-3">
                            <label className="text-[8px] uppercase text-white/20 tracking-[0.5em] font-black">TECHNICAL_MANIFEST</label>
                            <textarea 
                              className="w-full bg-black border border-white/10 p-5 text-xs h-48 focus:border-red-600/40 resize-none no-scrollbar font-medium leading-relaxed"
                              value={piece.description}
                              onChange={(e) => handlePieceFieldUpdate(piece.id, 'description', e.target.value)}
                              placeholder="// ENTER_ARTIFACT_INTEL..."
                            />
                          </div>
                        </div>

                        <div className="space-y-10">
                           <div className="space-y-4">
                              <label className="text-[8px] uppercase text-white/20 tracking-[0.5em] font-black">PRIMARY_DATA_ASSET</label>
                              <div className="flex gap-8 items-end">
                                <div className="w-32 h-44 bg-neutral-900 border border-white/10 shrink-0 relative overflow-hidden group/img">
                                  <img src={piece.imageUrl} className="w-full h-full object-cover grayscale opacity-60 group-hover/img:opacity-100 transition-opacity" />
                                  {isUploading === `${piece.id}-main` && (
                                    <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
                                      <div className="w-6 h-6 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                                    </div>
                                  )}
                                </div>
                                <div className="flex-1 space-y-4">
                                   <input 
                                     type="file" 
                                     className="text-[10px] w-full file:bg-white file:text-black file:border-0 file:text-[9px] file:px-4 file:py-2 file:font-black file:uppercase file:cursor-pointer" 
                                     onChange={(e) => handleImageUpload(piece.id, e, false)} 
                                   />
                                   <p className="text-[8px] text-white/20 uppercase tracking-[0.4em] font-bold">Recommended: 1600x2000 Archive Format</p>
                                </div>
                              </div>
                           </div>

                           <div className="space-y-4">
                              <label className="text-[8px] uppercase text-white/20 tracking-[0.5em] font-black">MORPHOLOGY_GALLERY ({piece.additionalImages?.length || 0})</label>
                              <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                                {piece.additionalImages?.map((img, i) => (
                                  <div key={i} className="group/gal relative aspect-square bg-neutral-900 border border-white/5 overflow-hidden">
                                    <img src={img} className="w-full h-full object-cover grayscale opacity-40 group-hover/gal:opacity-100 group-hover/gal:scale-110 transition-all duration-700" />
                                    <button 
                                      onClick={() => handleRemoveGalleryImage(piece.id, i)}
                                      className="absolute top-0 right-0 p-1.5 bg-red-600 text-white opacity-0 group-hover/gal:opacity-100 transition-opacity shadow-lg"
                                    >
                                      <span className="text-[10px] font-black">×</span>
                                    </button>
                                  </div>
                                ))}
                                <label className="relative aspect-square border-2 border-dashed border-white/5 flex items-center justify-center cursor-pointer hover:bg-white/[0.03] hover:border-white/20 transition-all group/add">
                                   <input 
                                     type="file" 
                                     multiple 
                                     className="hidden" 
                                     onChange={(e) => handleImageUpload(piece.id, e, true)} 
                                   />
                                   {isUploading === `${piece.id}-gal` ? (
                                      <div className="w-5 h-5 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                                   ) : (
                                      <span className="text-2xl font-light text-white/10 group-hover/add:text-white/40">+</span>
                                   )}
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
