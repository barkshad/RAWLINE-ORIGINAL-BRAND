
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
      classification: 'Original Record'
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

  const handleImageUpload = async (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(id);
      try {
        const url = await uploadToCloudinary(file);
        await updatePieceData(id, { imageUrl: url });
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
        className="text-[10px] font-mono text-white/20 hover:text-white uppercase tracking-[0.4em] transition-all"
      >
        [ SYSTEM_TERMINAL ]
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] bg-black text-white flex flex-col p-8 overflow-hidden font-mono">
      <div className="flex justify-between items-center border-b border-white/10 pb-6 mb-6">
        <h2 className="text-xl font-black tracking-tighter">RAWLINE_CLOUD_CORE v1.1</h2>
        <div className="flex gap-4">
          {user && <button onClick={handleLogout} className="text-[10px] uppercase tracking-widest text-white/40 hover:text-white transition-all">TERMINATE_SESSION</button>}
          <button onClick={() => setIsOpen(false)} className="text-sm border border-white px-4 py-2 hover:bg-white hover:text-black transition-all">EXIT</button>
        </div>
      </div>

      {!user ? (
        <div className="flex-1 flex flex-col items-center justify-center space-y-6">
          <div className="text-center space-y-2">
            <p className="text-sm text-white/40 uppercase tracking-widest">Authentication Required.</p>
            {error && <p className="text-red-500 text-[10px] uppercase font-bold tracking-widest">{error}</p>}
          </div>
          <form onSubmit={handleLogin} className="flex flex-col gap-4 w-full max-w-sm">
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white/5 border border-white/10 px-4 py-3 text-sm focus:outline-none focus:border-white/40 transition-all"
              placeholder="OPERATOR_EMAIL"
              required
            />
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-white/5 border border-white/10 px-4 py-3 text-sm focus:outline-none focus:border-white/40 transition-all"
              placeholder="OPERATOR_KEY"
              required
            />
            <button type="submit" className="bg-white text-black px-6 py-3 text-xs font-black hover:bg-white/80 transition-all uppercase tracking-[0.2em]">INITIALIZE_ACCESS</button>
          </form>
        </div>
      ) : (
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex gap-8 mb-8 border-b border-white/5">
            <button 
              onClick={() => setActiveTab('content')}
              className={`pb-4 text-[10px] tracking-widest uppercase transition-all ${activeTab === 'content' ? 'border-b-2 border-white font-bold' : 'text-white/30'}`}
            >
              METADATA_EDITS
            </button>
            <button 
              onClick={() => setActiveTab('pieces')}
              className={`pb-4 text-[10px] tracking-widest uppercase transition-all ${activeTab === 'pieces' ? 'border-b-2 border-white font-bold' : 'text-white/30'}`}
            >
              ARTIFACT_DATABASE
            </button>
          </div>

          <div className="flex-1 overflow-y-auto no-scrollbar space-y-12">
            {activeTab === 'content' ? (
              <div className="max-w-4xl space-y-8 pb-20">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] text-white/40 uppercase tracking-widest">Hero Title</label>
                    <input 
                      className="w-full bg-white/5 border border-white/10 p-4 text-sm focus:border-white/40 transition-all"
                      value={content.heroTitle}
                      onChange={(e) => onUpdateContent({ ...content, heroTitle: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] text-white/40 uppercase tracking-widest">Archive Statement Title</label>
                    <input 
                      className="w-full bg-white/5 border border-white/10 p-4 text-sm focus:border-white/40 transition-all"
                      value={content.archiveStatementTitle}
                      onChange={(e) => onUpdateContent({ ...content, archiveStatementTitle: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] text-white/40 uppercase tracking-widest">Hero Subtitle</label>
                  <textarea 
                    className="w-full bg-white/5 border border-white/10 p-4 text-sm h-32 focus:border-white/40 transition-all"
                    value={content.heroSubTitle}
                    onChange={(e) => onUpdateContent({ ...content, heroSubTitle: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] text-white/40 uppercase tracking-widest">Footer Tagline</label>
                  <input 
                    className="w-full bg-white/5 border border-white/10 p-4 text-sm focus:border-white/40 transition-all font-bold"
                    value={content.footerTagline}
                    onChange={(e) => onUpdateContent({ ...content, footerTagline: e.target.value })}
                  />
                </div>
                <button 
                  onClick={handleSaveContent}
                  className="bg-white text-black px-12 py-4 text-xs font-black uppercase tracking-[0.2em] hover:bg-white/90"
                >
                  SYNCHRONIZE_SITE_METADATA
                </button>
              </div>
            ) : (
              <div className="space-y-8 pb-32">
                <button 
                  onClick={handleAddPiece}
                  className="w-full border-2 border-dashed border-white/10 py-12 text-white/20 hover:text-white hover:border-white/30 transition-all uppercase text-[10px] tracking-widest bg-white/5"
                >
                  + CATALOG_NEW_ARTIFACT
                </button>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {pieces.map((piece) => (
                    <div key={piece.id} className="border border-white/10 p-6 space-y-4 bg-white/5 relative group">
                      <div className="flex justify-between items-start">
                        <div className="text-[9px] font-bold tracking-widest uppercase">ID: {piece.id.substring(0,8)}</div>
                        <button onClick={() => handleDeletePiece(piece.id)} className="text-[9px] text-red-500 hover:text-red-400 transition-colors uppercase font-black tracking-widest">PURGE</button>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex flex-col gap-1">
                          <label className="text-[8px] uppercase text-white/30 tracking-widest">Catalog Code</label>
                          <input 
                            className="bg-white/5 border border-white/10 p-2 text-xs focus:border-white/40"
                            value={piece.code}
                            onChange={(e) => handlePieceFieldUpdate(piece.id, 'code', e.target.value)}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="flex flex-col gap-1">
                            <label className="text-[8px] uppercase text-white/30 tracking-widest">Era</label>
                            <input 
                              className="bg-white/5 border border-white/10 p-2 text-xs focus:border-white/40"
                              value={piece.era}
                              onChange={(e) => handlePieceFieldUpdate(piece.id, 'era', e.target.value)}
                            />
                          </div>
                          <div className="flex flex-col gap-1">
                            <label className="text-[8px] uppercase text-white/30 tracking-widest">Status</label>
                            <select 
                              className="bg-white/5 border border-white/10 p-2 text-xs focus:border-white/40 appearance-none"
                              value={piece.status}
                              onChange={(e) => handlePieceFieldUpdate(piece.id, 'status', e.target.value as any)}
                            >
                              <option value="ARCHIVED">ARCHIVED</option>
                              <option value="ACTIVE">ACTIVE</option>
                              <option value="WORN">WORN</option>
                              <option value="RELEASED">RELEASED</option>
                              <option value="STUDY">STUDY</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[8px] uppercase text-white/30 tracking-widest">Cloud Asset</label>
                        <div className="flex gap-4 items-center">
                          <div className="relative w-16 h-20 bg-black/40 border border-white/10 overflow-hidden">
                            <img src={piece.imageUrl} className="w-full h-full object-cover grayscale opacity-60" />
                            {isUploading === piece.id && (
                              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                              </div>
                            )}
                          </div>
                          <input 
                            type="file" 
                            accept="image/*"
                            className="text-[9px] cursor-pointer"
                            onChange={(e) => handleImageUpload(piece.id, e)}
                          />
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
