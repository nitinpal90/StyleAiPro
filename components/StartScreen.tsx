
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import { motion } from 'framer-motion';
import { InfinityIcon, DownloadIcon, SparklesIcon, ShirtIcon, UserCircleIcon } from './icons';

interface StartScreenProps {
  onSelectPersona: () => void;
  onSelectProduct: () => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onSelectPersona, onSelectProduct }) => {
  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col items-center py-10">
      {/* Premium Badge */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="inline-flex items-center gap-3 px-5 py-2 bg-white border border-gray-100 shadow-xl shadow-gray-100/50 rounded-full mb-12"
      >
        <span className="w-2.5 h-2.5 bg-indigo-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
        <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Unlimited Studio Production</span>
      </motion.div>

      {/* Hero Heading */}
      <motion.h1 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="text-7xl md:text-[10rem] font-sans font-black text-gray-900 tracking-tighter leading-[0.85] max-w-6xl text-center mb-12"
      >
        Product Vision <br/>
        <span className="text-transparent bg-clip-text bg-gradient-to-br from-indigo-600 via-violet-600 to-indigo-800">Perfected.</span>
      </motion.h1>

      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-xl text-gray-500 max-w-3xl font-medium leading-relaxed text-center mb-24 px-6"
      >
        Choose a specialized module to transform your content. Professional photography, realistic fabric physics, and unlimited variations in one suite.
      </motion.p>

      {/* Interactive Studio Modules */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full max-w-5xl mb-40 px-6">
        <StudioCard 
          icon={<UserCircleIcon className="w-9 h-9 text-indigo-600" />}
          title="Persona Studio"
          description="Transform casual user portraits into professional studio-grade fashion models while maintaining facial recognition."
          onClick={onSelectPersona}
          accent="indigo"
          delay={0.4}
        />
        <StudioCard 
          icon={<ShirtIcon className="w-9 h-9 text-violet-600" />}
          title="Fit Studio"
          description="Take professional model assets and integrate brand garments with hyper-realistic drape, texture, and lighting."
          onClick={onSelectProduct}
          accent="violet"
          delay={0.5}
        />
      </div>

      {/* Feature Highlighting Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-16 w-full max-w-6xl pb-20">
        <FeatureCard 
          icon={<InfinityIcon className="w-6 h-6 text-indigo-500" />}
          title="Infinite Assets"
          description="No caps on generation. Create your entire lookbook or seasonal campaign in a single professional session."
        />
        <FeatureCard 
          icon={<DownloadIcon className="w-6 h-6 text-violet-500" />}
          title="Ultra HD Export"
          description="Every asset is processed and exported in professional resolution, ready for immediate e-commerce listing."
        />
        <FeatureCard 
          icon={<SparklesIcon className="w-6 h-6 text-pink-500" />}
          title="Physics Precision"
          description="Neural fitting ensures your garments retain exact colors, branding, patterns, and authentic fabric drape."
        />
      </div>
    </div>
  );
};

const StudioCard = ({ icon, title, description, onClick, accent, delay }: any) => (
  <motion.button 
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    onClick={onClick}
    className={`group relative p-14 bg-white rounded-[4rem] border border-gray-100 text-left hover:shadow-[0_64px_128px_-32px_rgba(0,0,0,0.1)] transition-all overflow-hidden active:scale-[0.97] h-full flex flex-col border-b-8 border-b-${accent}-500/0 hover:border-b-${accent}-500`}
  >
    {/* Decorative Background Blob */}
    <div className={`absolute -top-20 -right-20 w-64 h-64 bg-${accent}-50 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10`} />

    <div className={`bg-${accent}-50 w-20 h-20 rounded-[2rem] flex items-center justify-center mb-12 group-hover:scale-110 group-hover:rotate-6 group-hover:bg-${accent}-100 transition-all duration-500 shadow-xl shadow-${accent}-100/20`}>
      {icon}
    </div>
    
    <h3 className="text-4xl font-serif font-bold text-gray-900 mb-6 group-hover:text-indigo-600 transition-colors">{title}</h3>
    <p className="text-gray-500 font-medium leading-relaxed mb-12 text-lg flex-grow">{description}</p>
    
    <div className={`inline-flex items-center gap-5 font-black text-[10px] uppercase tracking-[0.3em] text-${accent}-600`}>
      Enter Studio
      <div className={`w-10 h-10 rounded-2xl bg-${accent}-600 text-white flex items-center justify-center group-hover:translate-x-4 transition-transform shadow-2xl shadow-${accent}-300`}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-5 h-5"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>
      </div>
    </div>
  </motion.button>
);

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
  <div className="bg-white p-12 rounded-[3.5rem] border border-gray-50 text-left hover:border-indigo-100 hover:shadow-2xl hover:shadow-gray-100 transition-all duration-500 group">
    <div className="bg-gray-50 w-16 h-16 rounded-3xl flex items-center justify-center mb-10 group-hover:scale-110 group-hover:bg-indigo-50 transition-all">
      {icon}
    </div>
    <h3 className="text-2xl font-black text-gray-900 mb-5 tracking-tight">{title}</h3>
    <p className="text-gray-500 font-medium leading-relaxed text-sm opacity-80 group-hover:opacity-100 transition-opacity">{description}</p>
  </div>
);

export default StartScreen;
