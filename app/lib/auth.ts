'use server';

import { createServerClient } from './supabase-server';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export async function getUser() {
  const cookieStore = cookies();
  const supabase = createServerClient();
  
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    
    if (error) {
      console.error('Error getting user from Supabase:', error);
      return null;
    }
    
    if (user) {
      // Log some minimal information for debugging
      console.log('User authenticated:', { id: user.id, email: user.email?.substring(0, 3) + '...' });
    } else {
      console.log('No authenticated user found');
    }
    
    return user;
  } catch (error) {
    console.error('Exception getting user:', error);
    return null;
  }
}

export async function requireAuth(returnUrl?: string) {
  const user = await getUser();
  
  if (!user) {
    if (returnUrl) {
      redirect(`/login?returnUrl=${encodeURIComponent(returnUrl)}`);
    } else {
      redirect('/login');
    }
  }
  
  return user;
}

export async function getUserProfile() {
  const user = await getUser();
  
  if (!user) {
    return null;
  }
  
  const supabase = createServerClient();
  
  try {
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    
    return profile;
  } catch (error) {
    console.error('Error getting profile:', error);
    return null;
  }
} 