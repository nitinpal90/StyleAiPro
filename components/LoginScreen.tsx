
import React, { useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';

const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          }
        }
      });
      if (error) setError(error.message);
      else setError("Success! Please check your email for verification.");
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError(error.message);
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12 relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-gray-200/50 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-gray-200/50 rounded-full blur-3xl animate-pulse delay-700" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full space-y-8 bg-white p-10 rounded-[2.5rem] shadow-2xl border border-gray-100 z-10"
      >
        <div>
          <div className="w-16 h-16 bg-gray-900 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-10.429A9.99 9.99 0 0012 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878m4.562-10.878L22 12m-4.562-10.878A9.993 9.993 0 0122 12c0 4.991-3.657 9.128-8.438 9.878" />
            </svg>
          </div>
          <h2 className="text-center text-3xl font-serif font-bold text-gray-900 tracking-tight">
            StyleAI Pro
          </h2>
          <p className="mt-2 text-center text-sm text-gray-500 font-medium">
            {isSignUp ? "Join the future of fashion" : "Sign in to your fitting room"}
          </p>
        </div>

        {!isSupabaseConfigured && (
          <div className="p-3 text-[10px] bg-amber-50 border border-amber-100 text-amber-800 rounded-xl text-center font-bold uppercase tracking-widest">
            ⚠️ Operating in Demo/Guest Mode
          </div>
        )}

        <form className="mt-8 space-y-4" onSubmit={handleAuth}>
          <AnimatePresence mode='wait'>
            {isSignUp && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <input
                  type="text"
                  required
                  className="appearance-none relative block w-full px-4 py-4 border border-gray-200 placeholder-gray-400 text-gray-900 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all sm:text-sm bg-gray-50/50"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </motion.div>
            )}
          </AnimatePresence>
          
          <input
            type="email"
            required
            className="appearance-none relative block w-full px-4 py-4 border border-gray-200 placeholder-gray-400 text-gray-900 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all sm:text-sm bg-gray-50/50"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          
          <input
            type="password"
            required
            className="appearance-none relative block w-full px-4 py-4 border border-gray-200 placeholder-gray-400 text-gray-900 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all sm:text-sm bg-gray-50/50"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <p className={`text-xs mt-2 text-center font-bold ${error.includes('Success') ? 'text-green-600' : 'text-red-500'}`}>{error}</p>}

          <button
            type="submit"
            disabled={isLoading || !isSupabaseConfigured}
            className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-sm font-bold rounded-2xl text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 disabled:opacity-50 transition-all shadow-xl hover:shadow-2xl active:scale-[0.98]"
          >
            {isLoading ? "Please wait..." : (isSignUp ? "Create Account" : "Sign In")}
          </button>
          
          <div className="text-center mt-6">
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-xs font-bold text-gray-500 hover:text-gray-900 transition-colors uppercase tracking-widest"
            >
              {isSignUp ? "Already have an account? Sign In" : "New here? Create Account"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default LoginScreen;
