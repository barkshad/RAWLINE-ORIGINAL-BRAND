
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
      addLog(`SIGNAL_RECEIVED: ${file.name.toUpperCase()}`);
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        addLog(`IMAGE_STREAM_READY_FOR_PARSE`);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!input && !selectedImage) return;
    setLoading(true);
    setResult(null);
    setLogs([]);
    
    addLog("CORE_INIT: RAWLINE_CURATOR_v3.0");
    addLog("HANDSHAKE: GEMINI_FLASH_NODE_ESTABLISHED");
    
    const steps = [
      "DECRYPTING_BYTE_STREAM",
      "MORPHOLOGICAL_MAPPING_INITIALIZED",
      "ISOLATING_SILHOUETTE_VECTORS",
      "CROSS_REFERENCING_ARCHIVE_DATABANK",
      "DETERMINING_REWORK_VIABILITY"
    ];

    let stepIdx = 0;
    const interval = setInterval(() => {
      if (stepIdx < steps.length) {
        addLog(steps[stepIdx]);
        stepIdx++;
      } else {
        clearInterval(interval);
      }
    }, 600);

    try {
      const data = await analyzeVintageStyle(input || "AUTOSCAN:PIECE_RECOGNITION", selectedImage || undefined);
      clearInterval(interval);
      addLog("SUCCESS: ANALYSIS_LOG_GENERATED");
      setResult(data);
    } catch (err) {
      clearInterval(interval);
      addLog("CRITICAL_FAILURE: PARSE_ERROR_EXISTS");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative border border-[#dcd7cb] bg-[#f4f1ea] p-0.5 shadow-md">
      {/* Technical corner accents */}
      <div className="absolute -top-[1px] -left-[1px] w-4 h-4 border-t border-l border-[#1c1c1c]/30" />
      <div className="absolute -bottom-[1px] -right-[1px] w-4 h-4 border-b border-r border-[#1c1c1c]/30" />

      <div className="p-8 space-y-10">
        <header className="flex justify-between items-start">
          <div className="space-y-1">
            <h2 className="text-[9px] font-mono tracking-[0.4em] text-[#1c1c1c]/50 uppercase font-black">Module_Identifier</h2>
            <div className="text-xl font-black tracking-tighter text-[#1c1c1c]">LABORATORY_01</div>
          </div>
          <div className="flex flex-col items-end gap-1">
             <div className="text-[7px] font-mono text-[#1c1c1c]/40 uppercase font-bold">Security: Grade A</div>
             <div className="flex gap-1.5">
               <div className="w-1.5 h-1.5 bg-[#8b0000] rounded-full animate-pulse" />
               <div className="w-1.5 h-1.5 bg-[#1c1c1c]/20 rounded-full" />
               <div className="w-1.5 h-1.5 bg-[#1c1c1c]/20 rounded-full" />
             </div>
          </div>
        </header>

        <div className="space-y-8">
          <div className="space-y-2">
            <label className="text-[8px] font-mono uppercase tracking-[0.3em] text-[#1c1c1c]/60 block px-1 font-black">Command_Input</label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full bg-[#ece9df] border border-[#dcd7cb] p-5 text-sm text-[#1c1c1c] focus:outline-none focus:border-[#1c1c1c]/40 transition-all h-32 font-mono leading-relaxed resize-none no-scrollbar placeholder:text-[#1c1c1c]/20"
              placeholder="// ENTER_DATA_PROMPT_HERE..."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="text-[8px] font-mono uppercase tracking-[0.3em] text-[#1c1c1c]/60 block px-1 font-black">Visual_Reference</label>
              <div className="flex gap-3 h-16">
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="lab-file" />
                <label 
                  htmlFor="lab-file" 
                  className="flex-1 border border-[#dcd7cb] px-6 flex items-center justify-center text-[10px] uppercase font-black tracking-[0.3em] hover:bg-[#1c1c1c] hover:text-[#f4f1ea] transition-all cursor-none bg-[#ece9df] text-[#1c1c1c]"
                >
                  {selectedImage ? "REPLACE" : "CAPTURE"}
                </label>
                {selectedImage && (
                  <div className="w-16 h-16 border border-[#dcd7cb] grayscale shadow-inner">
                    <img src={selectedImage} alt="ref" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex flex-col justify-end">
              <button
                onClick={handleAnalyze}
                disabled={loading || (!input && !selectedImage)}
                className="w-full bg-[#1c1c1c] text-[#f4f1ea] h-16 text-[10px] uppercase tracking-[0.5em] font-black disabled:opacity-30 hover:bg-[#333] transition-all cursor-none shadow-lg"
              >
                {loading ? "PROCESSING..." : "RUN_ANALYSIS"}
              </button>
            </div>
          </div>
        </div>

        {/* Terminal Log */}
        <div 
          ref={logContainerRef}
          className="bg-[#ece9df] border border-[#dcd7cb] p-4 h-40 overflow-y-auto font-mono text-[9px] text-[#1c1c1c]/70 leading-loose no-scrollbar font-bold"
        >
          {logs.length === 0 && <span className="opacity-60">&gt; SYSTEM_IDLE: AWAITING_INPUT_SEQUENCE</span>}
          {logs.map((log, i) => (
            <div key={i} className="animate-in fade-in slide-in-from-left-2 duration-300">
              <span className="text-[#8b0000]">{log.split(' ')[0]}</span> {log.split(' ').slice(1).join(' ')}
            </div>
          ))}
        </div>

        {result && (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-1000 border-t border-[#dcd7cb] pt-10">
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-2">
                <span className="text-[7px] font-mono text-[#1c1c1c]/60 uppercase tracking-[0.4em] font-black">Chronological_Slot</span>
                <div className="text-2xl font-black italic tracking-tighter text-[#1c1c1c]">{result.era}</div>
              </div>
              <div className="space-y-2">
                <span className="text-[7px] font-mono text-[#1c1c1c]/60 uppercase tracking-[0.4em] font-black">Archive_Fit_Grade</span>
                <div className="text-2xl font-mono font-bold text-[#1c1c1c] tracking-tighter">{result.rawlineScore}%</div>
              </div>
            </div>

            <div className="space-y-3">
              <span className="text-[7px] font-mono text-[#1c1c1c]/60 uppercase tracking-[0.4em] font-black">Technical_Morphology</span>
              <p className="text-[14px] text-[#1c1c1c] leading-relaxed font-medium">
                {result.styleNotes}
              </p>
            </div>

            <div className="bg-[#1c1c1c]/5 border-l-4 border-[#8b0000] p-6 space-y-3">
              <span className="text-[7px] font-mono text-[#1c1c1c]/70 uppercase tracking-[0.5em] font-black">Rework_Directive_Log</span>
              <p className="text-[13px] text-[#1c1c1c] italic font-mono leading-relaxed font-bold">
                // {result.reworkSuggestion}
              </p>
            </div>

            <div className="relative h-1 w-full bg-[#1c1c1c]/10">
               <div 
                 className="absolute top-0 left-0 h-full bg-[#8b0000] transition-all duration-[2500ms] ease-out shadow-[0_0_10px_rgba(139,0,0,0.3)]"
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
