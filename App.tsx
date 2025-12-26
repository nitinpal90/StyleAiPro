
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import StartScreen from './components/StartScreen.tsx';
import Canvas from './components/Canvas.tsx';
import WardrobePanel from './components/WardrobeModal.tsx';
import Header from './components/Header.tsx';
import { generateVirtualTryOnImage, generatePoseVariation, generateModelImage } from './services/geminiService.ts';
import { WardrobeItem } from './types.ts';
import { defaultWardrobe } from './wardrobe.ts';
import Footer from './components/Footer.tsx';
import { getFriendlyErrorMessage } from './lib/utils.ts';
import { UploadCloudIcon, ShirtIcon, SparklesIcon, ChevronLeftIcon } from './components/icons.tsx';

const POSE_INSTRUCTIONS = [
  "Full frontal view, hands on hips",
  "Slightly turned, 3/4 view",
  "Side profile view",
  "Walking towards camera",
  "Leaning against a wall",
];

type AppMode = 'HUB' | 'PERSONA_STUDIO' | 'PRODUCT_STUDIO';

export default function App() {
  const [mode, setMode] = useState<AppMode>('HUB');
  const [modelImageUrl, setModelImageUrl] = useState<string | null>(null);
  const [displayImageUrl, setDisplayImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [currentPoseIndex, setCurrentPoseIndex] = useState(0);
  const [wardrobe, setWardrobe] = useState<WardrobeItem[]>(defaultWardrobe);

  /**
   * Resets the entire studio environment.
   * Clears errors and loading states to allow retrying after API issues.
   */
  const handleStartOver = () => {
    setMode('HUB');
    setModelImageUrl(null);
    setDisplayImageUrl(null);
    setIsLoading(false);
    setLoadingMessage('');
    setError(null);
    setCurrentPoseIndex(0);
  };

  const handlePersonaGenerated = (url: string | null) => {
    setModelImageUrl(url);
    setDisplayImageUrl(url);
    setError(null);
  };

  const handleGarmentSelect = useCallback(async (garmentFile: File, garmentInfo: WardrobeItem) => {
    if (!modelImageUrl || isLoading) return;

    setError(null);
    setIsLoading(true);
    setLoadingMessage(`Fitting ${garmentInfo.name}...`);

    try {
      const newImageUrl = await generateVirtualTryOnImage(modelImageUrl, garmentFile);
      setDisplayImageUrl(newImageUrl);
      
      setWardrobe(prev => {
        if (prev.find(item => item.id === garmentInfo.id)) return prev;
        return [...prev, garmentInfo];
      });
    } catch (err) {
      setError(getFriendlyErrorMessage(err, 'Style generation failed'));
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  }, [modelImageUrl, isLoading]);

  const handlePoseSelect = useCallback(async (newIndex: number) => {
    if (isLoading || !displayImageUrl || newIndex === currentPoseIndex) return;
    
    const poseInstruction = POSE_INSTRUCTIONS[newIndex];
    setError(null);
    setIsLoading(true);
    setLoadingMessage(`Re-posing model...`);
    
    const prevPoseIndex = currentPoseIndex;
    setCurrentPoseIndex(newIndex);

    try {
      const newImageUrl = await generatePoseVariation(displayImageUrl, poseInstruction);
      setDisplayImageUrl(newImageUrl);
    } catch (err) {
      setError(getFriendlyErrorMessage(err, 'Pose variation failed'));
      setCurrentPoseIndex(prevPoseIndex);
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  }, [displayImageUrl, isLoading, currentPoseIndex]);

  return (
    <div className="font-sans antialiased text-gray-900 bg-white min-h-screen flex flex-col selection:bg-indigo-600 selection:text-white">
      <Header onHome={handleStartOver} />
      
      <AnimatePresence mode="wait">
        {mode === 'HUB' && (
          <motion.div
            key="hub"
            className="w-full flex-grow flex items-center justify-center p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <StartScreen 
              onSelectPersona={() => setMode('PERSONA_STUDIO')} 
              onSelectProduct={() => setMode('PRODUCT_STUDIO')}
            />
          </motion.div>
        )}

        {mode === 'PERSONA_STUDIO' && (
          <motion.div
            key="persona"
            className="flex-grow flex flex-col"
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
          >
            <div className="max-w-7xl mx-auto w-full px-6 py-6 border-b border-gray-50 flex items-center justify-between">
              <button onClick={handleStartOver} className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-gray-900 transition-colors">
                <ChevronLeftIcon className="w-4 h-4" />
                Back to Hub
              </button>
              <span className="text-xs font-black uppercase tracking-[0.2em] text-indigo-600">Persona Studio</span>
            </div>
            <PersonaWorkflow 
              onGenerated={handlePersonaGenerated}
              displayImageUrl={displayImageUrl}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
              error={error}
              setError={setError}
              onGoToProduct={() => setMode('PRODUCT_STUDIO')}
            />
          </motion.div>
        )}

        {mode === 'PRODUCT_STUDIO' && (
          <motion.div
            key="product"
            className="flex-grow flex flex-col md:flex-row"
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
          >
            <main className="flex-grow relative flex flex-col md:flex-row bg-gray-50/50">
                <div className="w-full h-full flex items-center justify-center py-10 relative min-h-[70vh]">
                    <Canvas 
                      displayImageUrl={displayImageUrl}
                      onStartOver={handleStartOver}
                      isLoading={isLoading}
                      loadingMessage={loadingMessage}
                      onSelectPose={handlePoseSelect}
                      poseInstructions={POSE_INSTRUCTIONS}
                      currentPoseIndex={currentPoseIndex}
                      availablePoseKeys={POSE_INSTRUCTIONS}
                    />
                </div>
                
                <aside className="w-full md:w-[450px] bg-white border-t md:border-t-0 md:border-l border-gray-100 p-8 md:p-12 flex flex-col gap-12 overflow-y-auto">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-violet-50 rounded-full mb-6">
                          <span className="text-[9px] font-black text-violet-600 uppercase tracking-widest">Product Module</span>
                        </div>
                        <h2 className="text-4xl font-serif font-bold text-gray-900 mb-4">Fit Studio</h2>
                        <p className="text-gray-500 font-medium leading-relaxed">Overlay your brand garments onto a professional model with perfect physics.</p>
                    </div>

                    {!modelImageUrl ? (
                        <div className="space-y-6">
                            <label className="block p-14 border-2 border-dashed border-gray-100 rounded-[3rem] cursor-pointer hover:border-indigo-600 hover:bg-indigo-50/20 transition-all group">
                                <div className="flex flex-col items-center gap-6 text-center">
                                    <div className="p-5 bg-white rounded-3xl group-hover:scale-110 transition-transform shadow-xl shadow-indigo-50">
                                        <UploadCloudIcon className="w-10 h-10 text-indigo-600" />
                                    </div>
                                    <div className="space-y-1">
                                      <span className="text-xl font-bold text-gray-900 block">Upload Base Model</span>
                                      <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">JPG, PNG • 4K Support</p>
                                    </div>
                                </div>
                                <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                                    if (e.target.files?.[0]) {
                                        const url = URL.createObjectURL(e.target.files[0]);
                                        setModelImageUrl(url);
                                        setDisplayImageUrl(url);
                                        setError(null);
                                    }
                                }} />
                            </label>
                        </div>
                    ) : (
                        <WardrobePanel
                          onGarmentSelect={handleGarmentSelect}
                          activeGarmentIds={[]}
                          isLoading={isLoading}
                          wardrobe={wardrobe}
                        />
                    )}

                    {error && (
                        <div className="p-6 bg-red-50 text-red-600 rounded-3xl text-sm font-bold border border-red-100 shadow-xl shadow-red-100/20 whitespace-pre-line">
                            {error}
                        </div>
                    )}
                </aside>
            </main>
          </motion.div>
        )}
      </AnimatePresence>
      <Footer />
    </div>
  );
}

function PersonaWorkflow({ onGenerated, displayImageUrl, isLoading, setIsLoading, error, setError, onGoToProduct }: any) {
    const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.[0]) return;
        setIsLoading(true);
        setError(null);
        try {
            const url = await generateModelImage(e.target.files[0]);
            onGenerated(url);
        } catch (err) {
            setError(getFriendlyErrorMessage(err, 'Persona generation failed'));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto w-full py-20 px-6 flex flex-col items-center text-center">
            <h2 className="text-7xl font-serif font-bold text-gray-900 mb-6">Persona Studio</h2>
            <p className="text-xl text-gray-500 mb-16 max-w-2xl font-medium leading-relaxed">
              Transform standard portraits into studio-grade fashion photography while preserving recognizable facial features.
            </p>

            <div className="w-full aspect-[3/4] max-w-md bg-white p-3 rounded-[4rem] shadow-[0_32px_80px_-15px_rgba(0,0,0,0.1)] border border-gray-100 overflow-hidden relative group">
                {displayImageUrl ? (
                    <img src={displayImageUrl} className="w-full h-full object-cover rounded-[3.2rem]" alt="Persona Result" />
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 rounded-[3.2rem] border-2 border-dashed border-gray-100">
                        <label className="cursor-pointer flex flex-col items-center gap-6 group">
                            <div className="p-6 bg-white rounded-3xl shadow-xl shadow-indigo-100 group-hover:scale-110 transition-transform">
                              <UploadCloudIcon className="w-10 h-10 text-indigo-600" />
                            </div>
                            <div className="space-y-1">
                              <span className="font-bold text-gray-900 text-xl block">Upload Portrait</span>
                              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Unlimited Studio Use</span>
                            </div>
                            <input type="file" className="hidden" onChange={handleFile} />
                        </label>
                    </div>
                )}
                <AnimatePresence>
                  {isLoading && (
                      <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-white/80 backdrop-blur-md flex flex-col items-center justify-center z-50"
                      >
                          <div className="w-14 h-14 border-[5px] border-indigo-600 border-t-transparent rounded-full animate-spin" />
                          <span className="mt-6 font-black text-[10px] uppercase tracking-[0.2em] text-indigo-600">Simulating Studio Lights...</span>
                      </motion.div>
                  )}
                </AnimatePresence>
            </div>

            {displayImageUrl && !isLoading && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className="mt-16 flex flex-col sm:flex-row gap-6"
                >
                    <button onClick={onGoToProduct} className="px-12 py-5 bg-gray-900 text-white font-bold rounded-2xl shadow-2xl hover:bg-indigo-600 transition-all flex items-center gap-4 group">
                        <ShirtIcon className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                        Fit Clothes to this Model
                    </button>
                    <button onClick={() => onGenerated(null)} className="px-12 py-5 bg-white text-gray-400 font-bold rounded-2xl border border-gray-100 hover:text-gray-900 hover:bg-gray-50 transition-all">
                        Create New Persona
                    </button>
                </motion.div>
            )}
            
            {error && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-10 text-red-500 font-bold bg-red-50 px-6 py-3 rounded-2xl border border-red-100 whitespace-pre-line">
                {error}
              </motion.p>
            )}
        </div>
    );
}
