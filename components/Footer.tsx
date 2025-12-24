
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const REMIX_SUGGESTIONS = [
  "Style Tip: Upload a full-body photo for the most realistic fitting.",
  "New: Download your creations without any limitations.",
  "Idea: Create a seasonal lookbook with your custom model.",
  "Check: Our AI preserves your body shape and unique features.",
  "Tip: Use high-quality garment photos for better results.",
];

interface FooterProps {
  isOnDressingScreen?: boolean;
}

const Footer: React.FC<FooterProps> = ({ isOnDressingScreen = false }) => {
  const [suggestionIndex, setSuggestionIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSuggestionIndex((prevIndex) => (prevIndex + 1) % REMIX_SUGGESTIONS.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <footer className={`w-full bg-white border-t border-gray-100 p-3 mt-auto ${isOnDressingScreen ? 'hidden sm:block' : ''}`}>
      <div className="mx-auto flex flex-col items-center justify-center text-xs text-gray-400 max-w-7xl px-4">
        <div className="h-4 flex items-center justify-center overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.p
                key={suggestionIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
                className="text-center font-medium tracking-wide"
              >
                {REMIX_SUGGESTIONS[suggestionIndex]}
              </motion.p>
            </AnimatePresence>
        </div>
        <p className="mt-1 text-[10px] uppercase font-black tracking-widest opacity-30">StyleAI Pro Engine</p>
      </div>
    </footer>
  );
};

export default Footer;
