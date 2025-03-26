'use client';

import { useState, useEffect } from 'react';
import { Task } from '../types';
import { useSupabase } from './useSupabase';
import { supabase } from '../lib/supabase';

interface UseTasksResult {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  fetchTasks: () => Promise<void>;
}

export function useTasks(): UseTasksResult {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useSupabase();

  const fetchTasks = async () => {
    if (!user) {
      setTasks([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Use Supabase client directly instead of going through the API
      const { data, error: dbError } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (dbError) throw new Error(dbError.message);
      
      // Convert the Supabase format to our Task type
      const mappedTasks: Task[] = data.map((item: any) => ({
        id: item.id,
        name: item.name,
        category: item.category,
        hoursSpent: item.hours_spent,
        createdAt: item.created_at,
        updatedAt: item.updated_at
      }));
      
      setTasks(mappedTasks);
    } catch (err: any) {
      setError(err.message || 'An error occurred while fetching tasks');
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchTasks();
    }
  }, [user]);

  return {
    tasks,
    loading,
    error,
    fetchTasks
  };
} 