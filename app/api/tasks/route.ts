import { createClient } from '@supabase/supabase-js';
import { cookies, headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { Database } from '@/types/supabase';

// Create a Supabase client for the current request
async function createClientForServer() {
  const headersList = headers();
  
  // Use the authorization header from the request
  const authHeader = headersList.get('Authorization');
  
  // Create direct client with the ANON key
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
    {
      global: { 
        headers: { 
          Authorization: authHeader || '' 
        } 
      },
      auth: {
        persistSession: false,
      },
    }
  );
}

export async function GET() {
  try {
    const supabase = await createClientForServer();
    
    // Check session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session) {
      console.error('Session error or no session:', { sessionError });
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    console.log('Found user:', session.user.id);
    
    // Get tasks
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Database error:', error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClientForServer();
    
    // Check session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session) {
      console.error('Session error or no session:', { sessionError });
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { name, category } = await request.json();
    
    if (!name || !category) {
      return NextResponse.json({ error: 'Name and category are required' }, { status: 400 });
    }
    
    // Create task
    const { data, error } = await supabase
      .from('tasks')
      .insert([
        {
          user_id: session.user.id,
          name,
          category,
          hours_spent: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();
    
    if (error) {
      console.error('Database error:', error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 