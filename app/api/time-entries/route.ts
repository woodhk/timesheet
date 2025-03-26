import { createClient } from '@supabase/supabase-js';
import { cookies, headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { Database } from '@/types/supabase';

// Create a Supabase client for the current request
async function createClientForServer() {
  const headersList = headers();
  
  // Use the authorization header from the request
  const authHeader = headersList.get('Authorization');
  
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
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session) {
      console.error('Session error or no session:', { sessionError });
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { data, error } = await supabase
      .from('time_entries')
      .select('*, tasks(name, category)')
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
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session) {
      console.error('Session error or no session:', { sessionError });
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { task_id, duration_seconds, started_at, ended_at } = await request.json();
    
    if (!task_id || !duration_seconds || !started_at || !ended_at) {
      return NextResponse.json(
        { error: 'Task ID, duration, start time, and end time are required' },
        { status: 400 }
      );
    }
    
    // First verify the task belongs to the user
    const { data: task, error: taskError } = await supabase
      .from('tasks')
      .select('*')
      .eq('id', task_id)
      .eq('user_id', session.user.id)
      .single();
    
    if (taskError) {
      console.error('Task verification error:', taskError.message);
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }
    
    // Add time entry
    const { data: timeEntry, error } = await supabase
      .from('time_entries')
      .insert([
        {
          task_id,
          user_id: session.user.id,
          duration_seconds,
          started_at,
          ended_at,
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();
    
    if (error) {
      console.error('Time entry error:', error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    // Update task's hours_spent
    const hoursToAdd = duration_seconds / 3600; // Convert seconds to hours
    
    const { error: updateError } = await supabase
      .from('tasks')
      .update({
        hours_spent: task.hours_spent + hoursToAdd,
        updated_at: new Date().toISOString(),
      })
      .eq('id', task_id);
    
    if (updateError) {
      console.error('Task update error:', updateError.message);
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }
    
    return NextResponse.json(timeEntry);
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 