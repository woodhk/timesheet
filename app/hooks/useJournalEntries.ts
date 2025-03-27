'use client';

import { useState, useEffect } from 'react';
import { useSupabase } from './useSupabase';
import { supabase } from '../lib/supabase';
import { JournalEntry } from '../data/journalQuestions';

interface JournalEntryWithId extends Partial<JournalEntry> {
  id: string;
  entry_date: string;
  created_at: string;
  updated_at: string;
}

interface UseJournalEntriesResult {
  entries: JournalEntryWithId[];
  todayEntry: JournalEntryWithId | null;
  loading: boolean;
  error: string | null;
  fetchEntries: () => Promise<void>;
}

export function useJournalEntries(): UseJournalEntriesResult {
  const [entries, setEntries] = useState<JournalEntryWithId[]>([]);
  const [todayEntry, setTodayEntry] = useState<JournalEntryWithId | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useSupabase();

  const fetchEntries = async () => {
    if (!user) {
      setEntries([]);
      setTodayEntry(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Get today's date in YYYY-MM-DD format
      const today = new Date().toISOString().split('T')[0];
      
      // Fetch all journal entries
      const { data, error: dbError } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('entry_date', { ascending: false });
      
      if (dbError) throw new Error(dbError.message);
      
      // Convert to our format
      const journalEntries = data as JournalEntryWithId[];
      setEntries(journalEntries);
      
      // Find today's entry if it exists
      const todaysEntry = journalEntries.find(entry => entry.entry_date === today) || null;
      setTodayEntry(todaysEntry);
      
    } catch (err: any) {
      setError(err.message || 'An error occurred while fetching journal entries');
      console.error('Error fetching journal entries:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchEntries();
    }
  }, [user]);

  return {
    entries,
    todayEntry,
    loading,
    error,
    fetchEntries
  };
} 