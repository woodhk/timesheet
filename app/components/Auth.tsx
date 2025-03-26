'use client';

import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isSignUp) {
        // Sign up with email and password
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) throw error;
        
        if (data?.user) {
          // Create a profile entry
          const { error: profileError } = await supabase
            .from('profiles')
            .insert([
              {
                id: data.user.id,
                username: email.split('@')[0],
                full_name: '',
              },
            ]);

          if (profileError) throw profileError;
          setIsSignUp(false);
          alert('Sign up successful! Please check your email to verify your account.');
        }
      } else {
        // Sign in with email and password
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
        router.push('/');
        router.refresh();
      }
    } catch (err: Error | unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred during authentication');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-10">
          <motion.div
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ 
              type: "spring",
              stiffness: 260,
              damping: 20,
              duration: 0.6 
            }}
            className="inline-block"
          >
            {/* Logo updated with modern design */}
            <div className="w-16 h-16 bg-gradient-to-tr from-violet-600 to-indigo-600 rounded-2xl mx-auto mb-5 shadow-lg flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-white opacity-20 mix-blend-overlay"></div>
              <span className="text-white text-2xl font-bold relative z-10">P</span>
            </div>
          </motion.div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Productivity</h1>
          <p className="text-slate-500">Get more done, together.</p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="bg-white rounded-3xl shadow-xl p-8 relative overflow-hidden"
        >
          {/* Decorative top bar with gradient */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-600 to-indigo-600" />
          
          <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </h2>
          
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg"
            >
              <p className="text-sm">{error}</p>
            </motion.div>
          )}
          
          <form onSubmit={handleAuth} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3.5 border border-slate-200 rounded-xl text-slate-800 text-base
                           focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent
                           transition-all duration-200 ease-in-out bg-slate-50
                           placeholder-slate-400"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3.5 border border-slate-200 rounded-xl text-slate-800 text-base
                           focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent
                           transition-all duration-200 ease-in-out bg-slate-50
                           placeholder-slate-400"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white py-3.5 px-4 
                       rounded-xl font-medium text-base shadow-md
                       hover:shadow-lg
                       focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2
                       transition-all duration-200 ease-in-out
                       disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </div>
              ) : (
                isSignUp ? 'Create Account' : 'Sign In'
              )}
            </motion.button>
          </form>
          
          <div className="mt-8 text-center">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-violet-600 hover:text-indigo-800 text-sm font-medium transition-colors duration-200"
            >
              {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
} 