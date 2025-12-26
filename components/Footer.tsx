
import React from 'react';
import { ShirtIcon, TwitterIcon, GithubIcon, LinkedInIcon, GlobeIcon } from './icons';

interface FooterProps {
  isOnDressingScreen?: boolean;
}

const Footer: React.FC<FooterProps> = ({ isOnDressingScreen = false }) => {
  return (
    <footer className={`w-full bg-white border-t border-gray-50 pt-24 pb-12 px-6 ${isOnDressingScreen ? 'hidden' : ''}`}>
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        {/* Brand Block */}
        <div className="flex flex-col items-center gap-5 mb-16">
          <div className="bg-indigo-50 p-4 rounded-[2rem] shadow-inner">
            <ShirtIcon className="w-8 h-8 text-indigo-600" />
          </div>
          <div className="text-center">
            <h2 className="text-3xl font-serif font-bold text-gray-900 tracking-tight">StyleAI <span className="text-indigo-600">Pro</span></h2>
            <p className="text-gray-400 text-sm font-medium mt-3 max-w-sm mx-auto leading-relaxed">
              Empowering professional creators with high-fidelity AI product photography modules.
            </p>
          </div>
        </div>

        {/* Social Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 mb-20">
          <SocialLink href="https://x.com/RealNitinX" icon={<TwitterIcon className="w-5 h-5"/>} label="Twitter / X" />
          <SocialLink href="https://github.com/nitinpal90" icon={<GithubIcon className="w-5 h-5"/>} label="GitHub Repo" />
          <SocialLink href="https://www.linkedin.com/in/nitinpal1/" icon={<LinkedInIcon className="w-5 h-5"/>} label="LinkedIn Pro" />
          <SocialLink href="https://bento.me/lynxnitin" icon={<GlobeIcon className="w-5 h-5"/>} label="Personal Portfolio" />
        </div>

        {/* Bottom Bar */}
        <div className="pt-10 border-t border-gray-50 w-full flex flex-col md:flex-row items-center justify-between gap-6">
          <span className="text-gray-300 font-black text-[9px] uppercase tracking-[0.3em]">
            © 2024 StyleAI Pro • Professional Grade
          </span>
          <div className="flex items-center gap-6">
             <span className="text-gray-300 font-bold text-[9px] uppercase tracking-widest">Built for Unlimited Usage</span>
             <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
          </div>
        </div>
      </div>
    </footer>
  );
};

const SocialLink = ({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) => (
  <a 
    href={href} 
    target="_blank" 
    rel="noopener noreferrer"
    className="flex items-center gap-4 text-gray-500 hover:text-indigo-600 transition-all group px-4 py-2 rounded-2xl hover:bg-indigo-50/50"
  >
    <div className="p-3 bg-gray-50 rounded-2xl group-hover:bg-indigo-100/50 group-hover:scale-110 transition-all">
      {icon}
    </div>
    <span className="font-bold text-sm tracking-tight whitespace-nowrap">{label}</span>
  </a>
);

export default Footer;
