
import React from 'react';
import { ShirtIcon, UserIcon, TwitterIcon, GithubIcon } from './icons';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { motion } from 'framer-motion';

interface HeaderProps {
  user?: any;
}

const Header: React.FC<HeaderProps> = ({ user }) => {
  const handleLogout = async () => {
    await supabase.auth.signOut();
    if (!isSupabaseConfigured) window.location.reload();
  };

  const fullName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Member';

  return (
    <header className="w-full py-4 px-6 md:px-10 bg-white border-b border-gray-100">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Brand */}
        <div 
          className="flex items-center gap-4 group cursor-pointer" 
          onClick={() => window.location.reload()}
        >
          <div className="bg-gray-900 p-2.5 rounded-2xl group-hover:rotate-12 transition-all shadow-xl shadow-gray-200">
            <ShirtIcon className="w-6 h-6 text-white" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-2xl font-serif font-bold tracking-tight text-gray-900 leading-none">
              StyleAI <span className="text-gray-400 font-sans font-medium text-lg">Pro</span>
            </h1>
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mt-1.5">Virtual Fitting Room</span>
          </div>
        </div>
        
        {/* Navigation & User */}
        <div className="flex items-center gap-4 md:gap-8">
          <nav className="hidden md:flex items-center gap-4">
            <a 
              href="https://x.com/RealNitinX" 
              target="_blank" 
              className="flex items-center gap-2 px-4 py-2 text-xs font-black text-gray-900 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all border border-gray-100 shadow-sm uppercase tracking-widest"
            >
              <TwitterIcon className="w-4 h-4 text-sky-500" />
              <span>@RealNitinX</span>
            </a>
            <a 
              href="https://github.com/nitinpal90" 
              target="_blank" 
              className="flex items-center gap-2 px-4 py-2 text-xs font-black text-gray-900 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all border border-gray-100 shadow-sm uppercase tracking-widest"
            >
              <GithubIcon className="w-4 h-4" />
              <span>GitHub</span>
            </a>
          </nav>
          
          {user && (
            <div className="flex items-center gap-4 pl-4 md:pl-8 border-l border-gray-100">
              <div className="flex items-center gap-3 bg-white p-1 pr-4 rounded-2xl border border-gray-100 shadow-sm">
                <div className="w-9 h-9 bg-gray-50 rounded-xl flex items-center justify-center border border-gray-100 overflow-hidden">
                  {user.user_metadata?.avatar_url ? (
                    <img src={user.user_metadata.avatar_url} className="w-full h-full object-cover" />
                  ) : (
                    <UserIcon className="w-5 h-5 text-gray-400" />
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-gray-900 leading-tight">
                    {fullName}
                  </span>
                  <span className="text-[9px] text-green-500 font-black uppercase tracking-[0.1em] flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                    Online
                  </span>
                </div>
              </div>
              
              <button 
                onClick={handleLogout}
                className="hidden sm:block text-[11px] font-black text-gray-400 hover:text-red-500 bg-white hover:bg-red-50 rounded-xl px-4 py-2.5 transition-all border border-gray-100 uppercase tracking-widest"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
