
import React from 'react';
import { ShirtIcon, TwitterIcon, GithubIcon, LinkedInIcon, GlobeIcon } from './icons';

interface HeaderProps {
  onHome?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onHome }) => {
  return (
    <header className="w-full py-5 px-6 md:px-12 bg-white/90 backdrop-blur-xl border-b border-gray-100 sticky top-0 z-50">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Brand */}
        <div 
          className="flex items-center gap-4 group cursor-pointer" 
          onClick={onHome}
        >
          <div className="bg-indigo-600 p-2.5 rounded-2xl group-hover:scale-110 group-hover:rotate-6 transition-all shadow-xl shadow-indigo-100">
            <ShirtIcon className="w-6 h-6 text-white" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-sans font-bold tracking-tight text-gray-900 leading-none">
              StyleAI <span className="text-indigo-600">Pro</span>
            </h1>
            <span className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mt-1.5">Professional Studio</span>
          </div>
        </div>
        
        {/* Navigation & Socials */}
        <div className="flex items-center gap-4 md:gap-8">
          <div className="hidden lg:flex items-center gap-6 border-r border-gray-100 pr-8">
            <SocialIcon href="https://x.com/RealNitinX" icon={<TwitterIcon className="w-5 h-5" />} title="X (Twitter)" />
            <SocialIcon href="https://github.com/nitinpal90" icon={<GithubIcon className="w-5 h-5" />} title="GitHub" />
            <SocialIcon href="https://www.linkedin.com/in/nitinpal1/" icon={<LinkedInIcon className="w-5 h-5" />} title="LinkedIn" />
            <SocialIcon href="https://bento.me/lynxnitin" icon={<GlobeIcon className="w-5 h-5" />} title="Personal Portfolio" />
          </div>
          
          <button 
            onClick={onHome}
            className="px-6 py-3 bg-gray-900 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-indigo-600 hover:shadow-2xl hover:shadow-indigo-200 transition-all active:scale-95"
          >
            Launch Hub
          </button>
        </div>
      </div>
    </header>
  );
};

const SocialIcon = ({ href, icon, title }: { href: string; icon: React.ReactNode; title: string }) => (
  <a 
    href={href} 
    target="_blank" 
    rel="noopener noreferrer"
    className="text-gray-400 hover:text-indigo-600 transition-all transform hover:scale-110 active:scale-90"
    title={title}
  >
    {icon}
  </a>
);

export default Header;
