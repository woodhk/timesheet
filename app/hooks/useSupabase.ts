'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/app/lib/supabase';
import { useRouter } from 'next/navigation';
import { User, Session } from '@supabase/supabase-js';

interface UseSupabaseHook {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshSession: () => void;
}

export function useSupabase(): UseSupabaseHook {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session: authSession } } = await supabase.auth.getSession();
        setSession(authSession);
        setUser(authSession?.user ?? null);
        
        console.log('Initial session:', authSession ? 'present' : 'null');
      } catch (error) {
        console.error('Error getting session:', error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Set up auth listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        console.log('Auth state change:', event);
        setSession(newSession);
        setUser(newSession?.user ?? null);
        
        // Refresh router when session changes
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          router.refresh();
        }
        
        if (event === 'SIGNED_OUT') {
          router.push('/login');
          router.refresh();
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const refreshSession = () => {
    router.refresh();
  };

  return {
    user,
    session,
    loading,
    signOut,
    refreshSession,
  };
} 