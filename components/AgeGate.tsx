
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const AgeGate: React.FC = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const verified = localStorage.getItem('rawline_verified');
    if (!verified) setShow(true);
  }, []);

  const verify = () => {
    localStorage.setItem('rawline_verified', 'true');
    setShow(false);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[1000] bg-black flex items-center justify-center p-6 text-center backdrop-blur-xl"
        >
          <div className="max-w-md w-full space-y-8 p-12 bg-[#111] border border-white/10 shadow-2xl">
            <div className="text-3xl font-light tracking-[0.2em] uppercase text-white">RAWLINE</div>
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-white/90">AGE VERIFICATION</h2>
              <p className="text-sm text-white/40 leading-relaxed">
                You must be at least 21 years of age to enter this site. By clicking "I AM 21+", you represent that you are of legal age.
              </p>
            </div>
            <div className="flex flex-col gap-4">
              <button 
                onClick={verify}
                className="w-full bg-white text-black py-4 font-black uppercase tracking-widest text-[10px] hover:bg-neutral-200 transition-all"
              >
                I AM 21+
              </button>
              <a 
                href="https://www.google.com"
                className="text-[10px] text-white/20 uppercase tracking-widest hover:text-white transition-all"
              >
                EXIT
              </a>
            </div>
            <p className="text-[8px] text-white/10 uppercase tracking-widest">
              Please enjoy responsibly.
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AgeGate;
