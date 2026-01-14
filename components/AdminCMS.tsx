
import React, { useState, useEffect } from 'react';
import { Piece, SiteContent, FitCheck } from '../types';
import { 
  auth, 
  saveSiteContent, 
  createPiece, 
  updatePieceData, 
  removePiece 
} from '../services/firebaseService';
import { signInWithEmailAndPassword, onAuthStateChanged, signOut, User } from 'firebase/auth';
import { uploadToCloudinary } from '../services/cloudinaryService';
import AICurator from './AICurator';

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
  const [activeTab, setActiveTab] = useState<'content' | 'pieces' | 'fitchecks' | 'lab'>('content');
  const [isUploading, setIsUploading] = useState<Record<string, boolean>>({});
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
      material: 'Archive Material',
      condition: 'Mint',
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

  const handleMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>, callback: (url: string) => void, id: string) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    setIsUploading(prev => ({ ...prev, [id]: true }));
    try {
      const url = await uploadToCloudinary(files[0] as File);
      callback(url);
    } catch (err) {
      alert("Upload failed. Check console for details.");
    } finally {
      setIsUploading(prev => ({ ...prev, [id]: false }));
    }
  };

  const handleAddFitCheck = () => {
    const newFitChecks = [...(content.fitChecks || []), {
      id: Math.random().toString(36).substr(2, 9),
      videoUrl: '',
      title: 'New Study Entry',
      description: ''
    }];
    onUpdateContent({ ...content, fitChecks: newFitChecks });
  };

  const handleRemoveFitCheck = (id: string) => {
    const newFitChecks = content.fitChecks?.filter(f => f.id !== id) || [];
    onUpdateContent({ ...content, fitChecks: newFitChecks });
  };

  const handleFitCheckUpdate = (id: string, field: keyof FitCheck, value: any) => {
    const newFitChecks = content.fitChecks?.map(f => f.id === id ? { ...f, [field]: value } : f) || [];
    onUpdateContent({ ...content, fitChecks: newFitChecks });
  };

  const isVideo = (url?: string) => {
    if (!url) return false;
    return url.match(/\.(mp4|webm|ogg|mov)$|video/i);
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="text-[9px] font-mono text-white/20 hover:text-white uppercase tracking-[0.5em] transition-all py-3 flex items-center gap-4"
      >
        ACCESS_CONTROL_NODE
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] bg-[#020202] text-white flex flex-col p-6 md:p-12 overflow-hidden font-mono transition-all">
      <div className="noise opacity-10"></div>
      
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
              className="px-6 py-3 border border-red-600/30 text-red-600 text-[10px] uppercase tracking-widest font-black hover:bg-red-600 hover:text-white transition-all shadow-lg"
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
             <div className="text-5xl mb-6">🔒</div>
             <p className="text-xs text-white/40 uppercase tracking-[0.6em] font-black">Authorized Personnel Only.</p>
             {error && <p className="text-red-600 text-[10px] uppercase font-black bg-red-600/10 p-4 border border-red-600/20">{error}</p>}
          </div>
          <form onSubmit={handleLogin} className="w-full space-y-6">
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-neutral-900/50 border border-white/10 px-6 py-4 text-xs focus:outline-none focus:border-white/30 transition-all"
              placeholder="IDENT_ID"
              required
            />
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-neutral-900/50 border border-white/10 px-6 py-4 text-xs focus:outline-none focus:border-white/30 transition-all"
              placeholder="AUTH_PHRASE"
              required
            />
            <button type="submit" className="w-full bg-red-600 text-white px-6 py-5 text-xs font-black hover:bg-red-500 transition-all uppercase tracking-[0.8em]">UNLOCK</button>
          </form>
        </div>
      ) : (
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex gap-8 md:gap-12 mb-10 border-b border-white/5 overflow-x-auto no-scrollbar">
            {['content', 'pieces', 'fitchecks', 'lab'].map((tab) => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`pb-5 text-[11px] tracking-[0.6em] uppercase transition-all font-black whitespace-nowrap ${activeTab === tab ? 'text-white border-b-2 border-red-600' : 'text-white/20 hover:text-white/40'}`}
              >
                {tab === 'content' ? 'SYSTEM_METADATA' : tab === 'pieces' ? 'ARTIFACT_CATALOG' : tab === 'fitchecks' ? 'FIT_STUDIES' : 'MORPH_LAB'}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto no-scrollbar space-y-16 pb-32 pr-4">
            {activeTab === 'content' ? (
              <div className="max-w-4xl space-y-12 animate-in fade-in duration-700">
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
                    <label className="text-[10px] text-white/30 uppercase tracking-widest font-black">Hero Background Media</label>
                    <div className="flex items-center gap-6">
                      <div className="w-24 aspect-video bg-neutral-900 border border-white/10 overflow-hidden relative">
                        {isUploading['hero'] ? (
                          <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
                            <div className="w-4 h-4 border border-white border-t-transparent animate-spin rounded-full" />
                          </div>
                        ) : isVideo(content.heroMediaUrl) ? (
                          <video src={content.heroMediaUrl} className="w-full h-full object-cover" muted />
                        ) : (
                          <img src={content.heroMediaUrl} className="w-full h-full object-cover" alt="Hero Preview" />
                        )}
                      </div>
                      <label className="px-8 py-4 bg-white text-black text-[10px] font-black uppercase tracking-widest cursor-pointer hover:bg-neutral-200 transition-all">
                        {isUploading['hero'] ? 'UPLOADING...' : 'CHANGE_MEDIA'}
                        <input type="file" accept="image/*,video/*" className="hidden" onChange={(e) => handleMediaUpload(e, (url) => onUpdateContent({...content, heroMediaUrl: url}), 'hero')} />
                      </label>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] text-white/30 uppercase tracking-widest font-black">Archive Thesis Statement</label>
                  <textarea 
                    className="w-full bg-white/5 border border-white/10 p-5 text-sm h-32 focus:border-white/40 transition-all resize-none"
                    value={content.heroSubTitle}
                    onChange={(e) => onUpdateContent({ ...content, heroSubTitle: e.target.value })}
                  />
                </div>
                <button 
                  onClick={async () => { await saveSiteContent(content); alert("Archived successfully."); }}
                  className="bg-red-600 text-white px-12 py-5 text-[10px] font-black uppercase tracking-[0.5em] hover:bg-red-500 shadow-xl"
                >
                  SAVE_METADATA
                </button>
              </div>
            ) : activeTab === 'pieces' ? (
              <div className="space-y-12 animate-in fade-in duration-700">
                <button 
                  onClick={handleAddPiece}
                  className="w-full border border-dashed border-white/10 py-12 text-white/20 hover:text-white hover:border-white/30 transition-all uppercase text-[10px] tracking-[0.8em] font-black"
                >
                  + INITIALIZE_ARTIFACT_RECORD
                </button>
                <div className="grid grid-cols-1 gap-12">
                  {pieces.map((piece) => (
                    <div key={piece.id} className="glass-panel p-10 space-y-8">
                       <div className="flex justify-between items-center border-b border-white/5 pb-6">
                        <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">RECORD_ID: {piece.id.substring(0,8)}</span>
                        <button onClick={() => handleDeletePiece(piece.id)} className="text-[10px] text-red-600 uppercase font-black px-4 py-2 hover:bg-red-600 hover:text-white transition-all">PURGE</button>
                      </div>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        <div className="space-y-6">
                           <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[8px] uppercase text-white/20 font-black">Code</label>
                                <input className="w-full bg-black/40 border border-white/5 p-4 text-xs font-bold" value={piece.code} onChange={(e) => handlePieceFieldUpdate(piece.id, 'code', e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[8px] uppercase text-white/20 font-black">Era</label>
                                <input className="w-full bg-black/40 border border-white/5 p-4 text-xs font-bold" value={piece.era} onChange={(e) => handlePieceFieldUpdate(piece.id, 'era', e.target.value)} />
                            </div>
                           </div>
                           <div className="space-y-2">
                                <label className="text-[8px] uppercase text-white/20 font-black">Morphology Description</label>
                                <textarea className="w-full bg-black/40 border border-white/5 p-4 text-xs h-32 resize-none" value={piece.description} onChange={(e) => handlePieceFieldUpdate(piece.id, 'description', e.target.value)} />
                           </div>
                        </div>
                        <div className="space-y-6">
                           <div className="space-y-2">
                             <label className="text-[8px] uppercase text-white/20 font-black">Primary Asset (Image/Video)</label>
                             <div className="flex gap-8 items-end">
                                <div className="w-32 aspect-[3/4] bg-neutral-900 border border-white/10 relative overflow-hidden shrink-0">
                                   {isUploading[piece.id] ? (
                                     <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
                                       <div className="w-6 h-6 border border-white border-t-transparent animate-spin rounded-full" />
                                     </div>
                                   ) : isVideo(piece.imageUrl) ? (
                                      <video src={piece.imageUrl} className="w-full h-full object-cover" muted />
                                   ) : (
                                      <img src={piece.imageUrl} className="w-full h-full object-cover" />
                                   )}
                                </div>
                                <label className="px-6 py-4 border border-white/10 text-[9px] uppercase font-black hover:bg-white hover:text-black transition-all cursor-pointer">
                                  {isUploading[piece.id] ? 'UPLOADING...' : 'REPLACE_ASSET'}
                                  <input type="file" accept="image/*,video/*" className="hidden" onChange={(e) => handleMediaUpload(e, (url) => handlePieceFieldUpdate(piece.id, 'imageUrl', url), piece.id)} />
                                </label>
                             </div>
                           </div>
                           <div className="space-y-2">
                              <label className="text-[8px] uppercase text-white/20 font-black">Status Configuration</label>
                              <select 
                                value={piece.status} 
                                onChange={(e) => handlePieceFieldUpdate(piece.id, 'status', e.target.value)}
                                className="w-full bg-black/40 border border-white/5 p-4 text-xs font-black uppercase tracking-widest text-white/60"
                              >
                                {['ARCHIVED', 'ACTIVE', 'WORN', 'RELEASED', 'STUDY'].map(s => <option key={s} value={s}>{s}</option>)}
                              </select>
                           </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : activeTab === 'fitchecks' ? (
              <div className="space-y-12 animate-in fade-in duration-700">
                <button 
                  onClick={handleAddFitCheck}
                  className="w-full border border-dashed border-white/10 py-12 text-white/20 hover:text-white hover:border-white/30 transition-all uppercase text-[10px] tracking-[0.8em] font-black"
                >
                  + INITIALIZE_FIT_STUDY
                </button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  {content.fitChecks?.map((f) => (
                    <div key={f.id} className="glass-panel p-8 space-y-6">
                      <div className="flex justify-between border-b border-white/5 pb-4">
                        <span className="text-[10px] text-white/30 uppercase font-black tracking-widest">STUDY_NODE: {f.id}</span>
                        <button onClick={() => handleRemoveFitCheck(f.id)} className="text-red-600 text-[10px] uppercase font-black tracking-widest">PURGE</button>
                      </div>
                      <div className="space-y-6">
                        <div className="space-y-2">
                           <label className="text-[8px] uppercase text-white/20 font-black">Study Heading</label>
                           <input className="w-full bg-black/40 border border-white/5 p-4 text-xs font-bold" value={f.title} onChange={(e) => handleFitCheckUpdate(f.id, 'title', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[8px] uppercase text-white/20 font-black">Motion Asset (Video/Image)</label>
                           <div className="flex gap-6 items-center">
                              <div className="w-20 aspect-[9/16] bg-black border border-white/10 relative overflow-hidden">
                                 {isUploading[f.id] ? (
                                   <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
                                      <div className="w-4 h-4 border border-white border-t-transparent animate-spin rounded-full" />
                                   </div>
                                 ) : isVideo(f.videoUrl) ? (
                                    <video src={f.videoUrl} className="w-full h-full object-cover" muted />
                                 ) : (
                                    <img src={f.videoUrl} className="w-full h-full object-cover" />
                                 )}
                              </div>
                              <label className="flex-1 px-6 py-4 bg-white/5 border border-white/10 text-[9px] uppercase font-black text-center hover:bg-white hover:text-black cursor-pointer transition-all">
                                {isUploading[f.id] ? 'UPLOADING...' : 'LOAD_ASSET'}
                                <input type="file" accept="video/*,image/*" className="hidden" onChange={(e) => handleMediaUpload(e, (url) => handleFitCheckUpdate(f.id, 'videoUrl', url), f.id)} />
                              </label>
                           </div>
                        </div>
                        <div className="space-y-2">
                           <label className="text-[8px] uppercase text-white/20 font-black">Analysis Meta</label>
                           <textarea className="w-full bg-black/40 border border-white/5 p-4 text-xs h-24 resize-none" value={f.description} onChange={(e) => handleFitCheckUpdate(f.id, 'description', e.target.value)} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <button 
                  onClick={async () => { await saveSiteContent(content); alert("Synchronized."); }}
                  className="bg-red-600 text-white px-12 py-5 text-[10px] font-black uppercase tracking-[0.5em] hover:bg-red-500 shadow-xl"
                >
                  PUSH_FIT_UPDATES
                </button>
              </div>
            ) : (
              <div className="animate-in fade-in duration-700">
                 <AICurator />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCMS;
