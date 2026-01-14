
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
    setLogs(prev => [...prev.slice(-10), `[${new Date().toLocaleTimeString()}] ${msg}`]);
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
        addLog(`STREAM_READY`);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!input && !selectedImage) return;
    setLoading(true);
    setResult(null);
    setLogs([]);
    
    addLog("INIT: CURATOR_v3.1");
    addLog("LINK: GEMINI_FLASH_0925");
    
    const steps = [
      "DECRYPT_BYTE_STREAM",
      "MAPPING_INITIALIZED",
      "ISOLATING_VECTORS",
      "ARCHIVE_CROSSREF",
      "VIABILITY_CHECK"
    ];

    let stepIdx = 0;
    const interval = setInterval(() => {
      if (stepIdx < steps.length) {
        addLog(steps[stepIdx]);
        stepIdx++;
      } else {
        clearInterval(interval);
      }
    }, 400);

    try {
      const data = await analyzeVintageStyle(input || "AUTOSCAN:RECOGNITION", selectedImage || undefined);
      clearInterval(interval);
      addLog("COMPLETE: LOG_GEN");
      setResult(data);
    } catch (err) {
      clearInterval(interval);
      addLog("CRITICAL: PARSE_ERROR");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative border border-[#dcd7cb] bg-[#f4f1ea] p-0.5 shadow-md w-full max-w-full overflow-hidden">
      {/* Technical corner accents */}
      <div className="absolute -top-[1px] -left-[1px] w-3 h-3 md:w-4 md:h-4 border-t border-l border-[#1c1c1c]/30" />
      <div className="absolute -bottom-[1px] -right-[1px] w-3 h-3 md:w-4 md:h-4 border-b border-r border-[#1c1c1c]/30" />

      <div className="p-4 sm:p-6 md:p-8 space-y-6 md:space-y-10">
        <header className="flex justify-between items-start">
          <div className="space-y-1">
            <h2 className="text-[7px] md:text-[9px] font-mono tracking-[0.3em] md:tracking-[0.4em] text-[#1c1c1c]/50 uppercase font-black">Identifier</h2>
            <div className="text-lg md:text-xl font-black tracking-tighter text-[#1c1c1c]">LAB_NODE_01</div>
          </div>
          <div className="flex flex-col items-end gap-1">
             <div className="text-[6px] md:text-[7px] font-mono text-[#1c1c1c]/40 uppercase font-bold">Sec: Grade_A</div>
             <div className="flex gap-1">
               <div className="w-1 md:w-1.5 h-1 md:h-1.5 bg-[#8b0000] rounded-full animate-pulse" />
               <div className="w-1 md:w-1.5 h-1 md:h-1.5 bg-[#1c1c1c]/10 rounded-full" />
               <div className="w-1 md:w-1.5 h-1 md:h-1.5 bg-[#1c1c1c]/10 rounded-full" />
             </div>
          </div>
        </header>

        <div className="space-y-6 md:space-y-8">
          <div className="space-y-2">
            <label className="text-[7px] md:text-[8px] font-mono uppercase tracking-[0.2em] md:tracking-[0.3em] text-[#1c1c1c]/60 block px-1 font-black">Input_Buffer</label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full bg-[#ece9df] border border-[#dcd7cb] p-3 md:p-5 text-xs md:text-sm text-[#1c1c1c] focus:outline-none focus:border-[#1c1c1c]/40 transition-all h-24 md:h-32 font-mono leading-relaxed resize-none no-scrollbar placeholder:text-[#1c1c1c]/20"
              placeholder="// ENTER_PROMPT..."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
            <div className="space-y-2">
              <label className="text-[7px] md:text-[8px] font-mono uppercase tracking-[0.2em] md:tracking-[0.3em] text-[#1c1c1c]/60 block px-1 font-black">Visual_Stream</label>
              <div className="flex gap-2 h-14 md:h-16">
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="lab-file" />
                <label 
                  htmlFor="lab-file" 
                  className="flex-1 border border-[#dcd7cb] px-4 md:px-6 flex items-center justify-center text-[8px] md:text-[10px] uppercase font-black tracking-[0.2em] md:tracking-[0.3em] hover:bg-[#1c1c1c] hover:text-[#f4f1ea] transition-all cursor-none bg-[#ece9df] text-[#1c1c1c] text-center"
                >
                  {selectedImage ? "REPLACE" : "CAPTURE"}
                </label>
                {selectedImage && (
                  <div className="w-14 md:w-16 h-14 md:h-16 border border-[#dcd7cb] grayscale shadow-inner shrink-0">
                    <img src={selectedImage} alt="ref" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex flex-col justify-end">
              <button
                onClick={handleAnalyze}
                disabled={loading || (!input && !selectedImage)}
                className="w-full bg-[#1c1c1c] text-[#f4f1ea] h-14 md:h-16 text-[9px] md:text-[10px] uppercase tracking-[0.3em] md:tracking-[0.5em] font-black disabled:opacity-30 hover:bg-[#333] transition-all cursor-none shadow-lg"
              >
                {loading ? "PARSING..." : "RUN_ANALYSIS"}
              </button>
            </div>
          </div>
        </div>

        {/* Terminal Log */}
        <div 
          ref={logContainerRef}
          className="bg-[#ece9df] border border-[#dcd7cb] p-3 md:p-4 h-32 md:h-40 overflow-y-auto font-mono text-[8px] md:text-[9px] text-[#1c1c1c]/70 leading-loose no-scrollbar font-bold"
        >
          {logs.length === 0 && <span className="opacity-60">&gt; SYSTEM_IDLE: AWAITING_INPUT</span>}
          {logs.map((log, i) => (
            <div key={i} className="animate-in fade-in slide-in-from-left-1 duration-300">
              <span className="text-[#8b0000]">{log.split(' ')[0]}</span> {log.split(' ').slice(1).join(' ')}
            </div>
          ))}
        </div>

        {result && (
          <div className="space-y-6 md:space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000 border-t border-[#dcd7cb] pt-6 md:pt-10">
            <div className="grid grid-cols-2 gap-4 md:gap-8">
              <div className="space-y-1 md:space-y-2">
                <span className="text-[6px] md:text-[7px] font-mono text-[#1c1c1c]/60 uppercase tracking-[0.3em] md:tracking-[0.4em] font-black">Era_Slot</span>
                <div className="text-xl md:text-2xl font-black italic tracking-tighter text-[#1c1c1c] truncate">{result.era}</div>
              </div>
              <div className="space-y-1 md:space-y-2">
                <span className="text-[6px] md:text-[7px] font-mono text-[#1c1c1c]/60 uppercase tracking-[0.3em] md:tracking-[0.4em] font-black">Grade</span>
                <div className="text-xl md:text-2xl font-mono font-bold text-[#1c1c1c] tracking-tighter">{result.rawlineScore}%</div>
              </div>
            </div>

            <div className="space-y-2 md:space-y-3">
              <span className="text-[6px] md:text-[7px] font-mono text-[#1c1c1c]/60 uppercase tracking-[0.3em] md:tracking-[0.4em] font-black">Morphology</span>
              <p className="text-[12px] md:text-[14px] text-[#1c1c1c] leading-relaxed font-medium">
                {result.styleNotes}
              </p>
            </div>

            <div className="bg-[#1c1c1c]/5 border-l-3 md:border-l-4 border-[#8b0000] p-4 md:p-6 space-y-2 md:space-y-3">
              <span className="text-[6px] md:text-[7px] font-mono text-[#1c1c1c]/70 uppercase tracking-[0.4em] md:tracking-[0.5em] font-black">Rework_Directive</span>
              <p className="text-[11px] md:text-[13px] text-[#1c1c1c] italic font-mono leading-relaxed font-bold">
                // {result.reworkSuggestion}
              </p>
            </div>

            <div className="relative h-1 w-full bg-[#1c1c1c]/10">
               <div 
                 className="absolute top-0 left-0 h-full bg-[#8b0000] transition-all duration-[2000ms] ease-out"
                 style={{ width: `${result.rawlineScore}%` }}
               />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AICurator;
