
import React, { useState, useEffect, useRef } from 'react';
import { analyzeVintageStyle } from '../services/geminiService';
import { AnalysisResult } from '../types';

const AICurator: React.FC = () => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const logContainerRef = useRef<HTMLDivElement>(null);

  const addLog = (msg: string) => {
    setLogs(prev => [...prev.slice(-12), `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      addLog(`SIGNAL_IN: ${file.name.toUpperCase()}`);
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        addLog(`LOCAL_BUF: BUFFER_READY`);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!input && !selectedImage) return;
    setLoading(true);
    setResult(null);
    setLogs([]);
    
    addLog("INIT: VIRTUAL_MORPH_v4.0");
    addLog("CORE: GEMINI_FLASH_AUTO");
    
    const steps = [
      "DECRYPT_BYTE_STREAM...",
      "ISOLATING_SILHOUETTE_VECTORS",
      "HARDWARE_RECOGNITION_INIT",
      "ARCHIVE_CROSS_REFERENCE_SYNC",
      "PARSING_INDUSTRIAL_VALUES",
      "CALCULATING_MORPHOLOGY_RANK"
    ];

    let stepIdx = 0;
    const interval = setInterval(() => {
      if (stepIdx < steps.length) {
        addLog(steps[stepIdx]);
        stepIdx++;
      }
    }, 450);

    try {
      const data = await analyzeVintageStyle(input || "AUTOSCAN:RECOGNITION", selectedImage || undefined);
      clearInterval(interval);
      addLog("SUCCESS: ANALYSIS_COMPLETE");
      setResult(data);
    } catch (err) {
      clearInterval(interval);
      addLog("CRITICAL: PARSE_LINK_FAIL");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative glass-panel group">
      {/* Glow Backlight */}
      <div className="absolute -inset-px bg-gradient-to-br from-red-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 blur-xl pointer-events-none" />

      <div className="p-8 md:p-12 space-y-10 relative z-10">
        <header className="flex justify-between items-start">
          <div className="space-y-2">
             <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse shadow-[0_0_10px_rgba(255,0,0,0.5)]" />
                <h2 className="text-[10px] font-mono tracking-[0.4em] text-white/40 uppercase font-black">Morphology Node</h2>
             </div>
             <div className="text-3xl font-black tracking-tighter text-white italic">LAB_01</div>
          </div>
          <div className="text-right font-mono">
             <div className="text-[7px] text-white/30 uppercase tracking-[0.4em] mb-1 font-black">Process_Status</div>
             <div className="text-[10px] text-red-600 font-bold uppercase tracking-widest">{loading ? "BUSY" : "IDLE"}</div>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-8">
          <div className="space-y-3">
            <div className="flex justify-between items-center px-1">
               <label className="text-[8px] font-mono uppercase tracking-[0.3em] text-white/50 font-black">Artifact_Prompt</label>
               <span className="text-[7px] font-mono text-white/20">CHAR_LIMIT: 400</span>
            </div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full bg-black/40 border border-white/5 p-6 text-sm text-white focus:outline-none focus:border-red-600/30 transition-all h-32 font-mono leading-relaxed resize-none placeholder:text-white/10 backdrop-blur-md"
              placeholder="[!] TYPE_ARTIFACT_OBSERVATIONS..."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="text-[8px] font-mono uppercase tracking-[0.3em] text-white/50 block px-1 font-black">Visual_Buffer</label>
              <div className="flex gap-3 h-20">
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="lab-file" />
                <label 
                  htmlFor="lab-file" 
                  className="flex-1 glass-panel flex items-center justify-center text-[10px] uppercase font-black tracking-[0.3em] hover:bg-white hover:text-black transition-all cursor-none text-center"
                >
                  {selectedImage ? "SWAP_SOURCE" : "LOAD_ASSET"}
                </label>
                {selectedImage && (
                  <div className="w-20 h-20 border border-white/10 grayscale shrink-0 relative overflow-hidden">
                    <img src={selectedImage} alt="ref" className="w-full h-full object-cover scale-110" />
                    <div className="absolute inset-0 bg-red-600/10 mix-blend-overlay" />
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex flex-col justify-end">
              <button
                onClick={handleAnalyze}
                disabled={loading || (!input && !selectedImage)}
                className="w-full bg-white text-black h-20 text-[11px] uppercase tracking-[0.6em] font-black disabled:opacity-20 hover:bg-red-600 hover:text-white transition-all cursor-none shadow-2xl relative overflow-hidden group/btn"
              >
                <span className="relative z-10">{loading ? "SCANNING..." : "RUN_STUDY"}</span>
                <div className="absolute inset-0 bg-black translate-x-[-100%] group-hover/btn:translate-x-0 transition-transform duration-500" />
              </button>
            </div>
          </div>
        </div>

        {/* Console Log */}
        <div 
          ref={logContainerRef}
          className="bg-black/60 border border-white/5 p-6 h-48 overflow-y-auto font-mono text-[9px] text-white/50 leading-relaxed no-scrollbar shadow-inner"
        >
          {logs.length === 0 && <span className="opacity-20">&gt; SYSTEM_READY: AWAITING_BYTE_STREAM</span>}
          {logs.map((log, i) => (
            <div key={i} className="mb-1 border-l border-red-600/20 pl-4 py-0.5">
              <span className="text-red-600/60 font-black">{log.split(' ')[0]}</span> {log.split(' ').slice(1).join(' ')}
            </div>
          ))}
        </div>

        {result && (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 border-t border-white/5 pt-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-2">
                <span className="text-[8px] font-mono text-white/30 uppercase tracking-[0.5em] font-black">Morphology_Result</span>
                <div className="text-4xl font-serif font-bold italic tracking-tighter text-white">{result.era}</div>
              </div>
              <div className="space-y-2">
                <span className="text-[8px] font-mono text-white/30 uppercase tracking-[0.5em] font-black">Viability_Index</span>
                <div className="flex items-baseline gap-2">
                   <div className="text-4xl font-mono font-bold text-red-600">{result.rawlineScore}</div>
                   <div className="text-[10px] font-mono text-white/20 uppercase font-black">%_GRADE_A</div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <span className="text-[8px] font-mono text-white/30 uppercase tracking-[0.5em] font-black">Curator_Notes</span>
              <p className="text-xl text-white/70 leading-relaxed font-light tracking-tight italic">
                {result.styleNotes}
              </p>
            </div>

            <div className="p-8 bg-red-600/5 border-l-4 border-red-600 space-y-4 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/5 blur-3xl rounded-full" />
               <span className="text-[8px] font-mono text-red-600 uppercase tracking-[0.6em] font-black block">REWORK_DIRECTIVE_ENCRYPTED</span>
               <p className="text-sm md:text-base text-white/90 font-mono leading-relaxed font-bold tracking-tight">
                // {result.reworkSuggestion}
               </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AICurator;
