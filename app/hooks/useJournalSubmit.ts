'use client';

import { useState } from 'react';
import { useSupabase } from './useSupabase';
import { supabase } from '../lib/supabase';
import { JournalEntry } from '../data/journalQuestions';
import { useRouter } from 'next/navigation';

interface UseJournalSubmitResult {
  submitEntry: (entry: Partial<JournalEntry>, existingEntryId?: string) => Promise<boolean>;
  loading: boolean;
  error: string | null;
}

export function useJournalSubmit(): UseJournalSubmitResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useSupabase();
  const router = useRouter();

  const submitEntry = async (entry: Partial<JournalEntry>, existingEntryId?: string): Promise<boolean> => {
    if (!user) {
      setError('You must be logged in to save a journal entry');
      return false;
    }

    setLoading(true);
    setError(null);
    
    try {
      const today = new Date().toISOString().split('T')[0];
      
      let result;
      
      if (existingEntryId) {
        // Update existing entry
        result = await supabase
          .from('journal_entries')
          .update({
            ...entry,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existingEntryId)
          .eq('user_id', user.id);
      } else {
        // Check if entry already exists for today
        const { data: existingEntry } = await supabase
          .from('journal_entries')
          .select('id')
          .eq('user_id', user.id)
          .eq('entry_date', today)
          .single();
          
        if (existingEntry) {
          // Update today's entry
          result = await supabase
            .from('journal_entries')
            .update({
              ...entry,
              updated_at: new Date().toISOString(),
            })
            .eq('id', existingEntry.id);
        } else {
          // Create new entry
          result = await supabase
            .from('journal_entries')
            .insert({
              user_id: user.id,
              entry_date: today,
              ...entry,
            });
        }
      }
      
      if (result.error) {
        throw new Error(result.error.message);
      }
      
      // Force a router refresh to update data
      router.refresh();
      return true;
      
    } catch (err: any) {
      console.error('Error submitting journal entry:', err);
      setError(err.message || 'Failed to save journal entry');
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  return {
    submitEntry,
    loading,
    error
  };
} 