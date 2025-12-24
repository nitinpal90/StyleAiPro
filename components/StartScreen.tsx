
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloudIcon, CheckCircleIcon } from './icons';
import { Compare } from './ui/compare';
import { generateModelImage } from '../services/geminiService';
import Spinner from './Spinner';
import { getFriendlyErrorMessage } from '../lib/utils';

interface StartScreenProps {
  onModelFinalized: (modelUrl: string) => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onModelFinalized }) => {
  const [userImageUrl, setUserImageUrl] = useState<string | null>(null);
  const [generatedModelUrl, setGeneratedModelUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = useCallback(async (file: File) => {
    // Check supported types explicitly for better user feedback
    const supportedTypes = ['image/png', 'image/jpeg', 'image/webp', 'image/heic', 'image/heif'];
    if (!supportedTypes.includes(file.type)) {
        setError(`File type '${file.type}' is not supported. Please use a format like PNG, JPEG, or WEBP.`);
        return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
        const dataUrl = e.target?.result as string;
        setUserImageUrl(dataUrl);
        setIsGenerating(true);
        setGeneratedModelUrl(null);
        setError(null);
        try {
            const result = await generateModelImage(file);
            setGeneratedModelUrl(result);
        } catch (err) {
            setError(getFriendlyErrorMessage(err, 'Failed to call the Gemini API. Please try again.'));
            setUserImageUrl(null);
        } finally {
            setIsGenerating(false);
        }
    };
    reader.readAsDataURL(file);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const reset = () => {
    setUserImageUrl(null);
    setGeneratedModelUrl(null);
    setIsGenerating(false);
    setError(null);
  };

  return (
    <AnimatePresence mode="wait">
      {!userImageUrl ? (
        <motion.div
          key="uploader"
          className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 items-center gap-16 md:gap-24"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
        >
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-full border border-gray-100 mb-8">
              <span className="w-2 h-2 bg-indigo-500 rounded-full animate-ping" />
              <span className="text-[10px] font-black text-gray-900 uppercase tracking-widest">Next-Gen AI Try-On</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-serif font-bold text-gray-900 leading-[0.9] tracking-tighter">
              The Studio <br/>
              <span className="text-gray-300 italic">for you.</span>
            </h1>
            <p className="mt-8 text-xl text-gray-500 leading-relaxed max-w-lg mx-auto lg:mx-0 font-medium">
              Transform any photo into a professional AI model. Try on garments instantly with perfect physics and lighting.
            </p>
            <div className="mt-12 flex flex-col items-center lg:items-start gap-6">
              <label htmlFor="image-upload-start" className="relative group overflow-hidden px-12 py-5 text-xl font-black text-white bg-gray-900 rounded-[2rem] cursor-pointer shadow-2xl shadow-gray-200 transition-all hover:scale-105 active:scale-95">
                <span className="relative z-10 flex items-center">
                  <UploadCloudIcon className="w-6 h-6 mr-3" />
                  Create Digital Twin
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </label>
              <input id="image-upload-start" type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
              <div className="flex items-center gap-4 text-gray-400 text-[11px] font-bold uppercase tracking-widest">
                <span>Fast Processing</span>
                <span className="w-1 h-1 bg-gray-200 rounded-full" />
                <span>Unlimited Tries</span>
              </div>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }} 
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-red-50 border border-red-100 p-4 rounded-2xl max-w-md"
                >
                  <p className="text-red-600 text-xs font-bold leading-relaxed">{error}</p>
                </motion.div>
              )}
            </div>
          </div>
          
          <div className="relative group">
            <div className="absolute -inset-10 bg-indigo-50 rounded-full blur-[100px] opacity-50 group-hover:opacity-100 transition-opacity" />
            <div className="relative p-3 bg-white rounded-[3rem] shadow-2xl border border-gray-100 overflow-hidden transform rotate-2 group-hover:rotate-0 transition-transform duration-700">
                <Compare
                  firstImage="https://storage.googleapis.com/gemini-95-icons/asr-tryon.jpg"
                  secondImage="https://storage.googleapis.com/gemini-95-icons/asr-tryon-model.png"
                  slideMode="drag"
                  className="w-full max-w-md aspect-[3/4.5] rounded-[2.2rem]"
                />
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          key="compare-view"
          className="w-full max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-center gap-20"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.1 }}
        >
          <div className="lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left">
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-gray-900 tracking-tighter">
              Reality, <br/>
              <span className="text-indigo-500">Enhanced.</span>
            </h1>
            <p className="mt-6 text-xl text-gray-500 font-medium">
              We've mapped your body features to a digital model. You can now use this twin to try on any outfit seamlessly.
            </p>
            
            <AnimatePresence mode="wait">
              {isGenerating ? (
                <motion.div 
                  key="loading"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center gap-5 mt-12 px-8 py-5 bg-gray-50 rounded-3xl border border-gray-100 shadow-xl shadow-gray-100"
                >
                  <Spinner />
                  <div className="flex flex-col">
                    <span className="text-lg font-black text-gray-900 leading-none">Mapping Physics</span>
                    <span className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-2">Almost ready...</span>
                  </div>
                </motion.div>
              ) : error ? (
                <motion.div 
                  key="error"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-12 p-8 bg-red-50 rounded-[2.5rem] border border-red-100 text-center lg:text-left"
                >
                  <p className="font-black text-red-600 uppercase tracking-widest text-sm mb-2">Process Interrupted</p>
                  <p className="text-red-500 font-medium mb-6">{error}</p>
                  <button onClick={reset} className="px-8 py-3 bg-red-600 text-white font-black rounded-2xl hover:bg-red-700 transition-all text-sm uppercase tracking-widest">
                    Try Again
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col sm:flex-row items-center gap-4 mt-12 w-full"
                >
                  <button 
                    onClick={() => onModelFinalized(generatedModelUrl!)}
                    className="w-full sm:w-auto px-12 py-5 text-xl font-black text-white bg-indigo-600 rounded-[2rem] hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 active:scale-95 flex items-center justify-center gap-3"
                  >
                    Enter Studio
                    <CheckCircleIcon className="w-6 h-6" />
                  </button>
                  <button 
                    onClick={reset}
                    className="w-full sm:w-auto px-12 py-5 text-lg font-black text-gray-400 hover:text-gray-900 bg-gray-50 rounded-[2rem] hover:bg-gray-100 transition-all uppercase tracking-widest"
                  >
                    Change Base
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <div className="lg:w-1/2 flex justify-center">
            <div className={`p-3 bg-white rounded-[3.5rem] shadow-2xl border border-gray-100 overflow-hidden ${isGenerating ? 'animate-pulse scale-95 opacity-60' : 'hover:scale-105'} transition-all duration-1000`}>
              <Compare
                firstImage={userImageUrl!}
                secondImage={generatedModelUrl ?? userImageUrl!}
                slideMode="drag"
                className="w-[320px] h-[480px] sm:w-[400px] sm:h-[600px] lg:w-[480px] lg:h-[720px] rounded-[2.5rem]"
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StartScreen;
