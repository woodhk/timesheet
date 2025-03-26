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
    } = await supabase.auth.getUser();
    
    return user;
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
}

export async function requireAuth() {
  const user = await getUser();
  
  if (!user) {
    redirect('/login');
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