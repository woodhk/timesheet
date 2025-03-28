'use client';

import { useState, useEffect } from 'react';
import { use } from 'react';
import Header from '../../components/Header';
import JournalForm from '../../components/JournalForm';
import { useSupabase } from '../../hooks/useSupabase';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'next/navigation';
import { JournalEntry } from '../../data/journalQuestions';
import Link from 'next/link';

interface JournalEntryWithId extends Partial<JournalEntry> {
  id: string;
  entry_date: string;
  created_at: string;
  updated_at: string;
}

export default function EditJournalPage({ params }: { params: { date: string } }) {
  // Unwrap params
  const unwrappedParams = use(params);
  const dateParam = unwrappedParams.date;
  
  const [entry, setEntry] = useState<JournalEntryWithId | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, loading: authLoading } = useSupabase();
  const router = useRouter();
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push(`/login?returnUrl=/journal/${dateParam}`);
    }
  }, [user, authLoading, router, dateParam]);

  // Fetch the specific journal entry
  useEffect(() => {
    const fetchEntry = async () => {
      if (!user) return;
      
      setLoading(true);
      setError(null);
      
      try {
        // Handle "today" special case
        const entryDate = dateParam === 'today' 
          ? new Date().toISOString().split('T')[0]
          : dateParam;
        
        const { data, error: dbError } = await supabase
          .from('journal_entries')
          .select('*')
          .eq('user_id', user.id)
          .eq('entry_date', entryDate)
          .single();
        
        if (dbError) {
          if (dbError.code === 'PGRST116') { // No rows returned
            if (dateParam === 'today') {
              // Today's entry doesn't exist yet
              router.push('/journal');
            } else {
              throw new Error(`No journal entry found for ${entryDate}`);
            }
          } else {
            throw new Error(dbError.message);
          }
        } else {
          setEntry(data as JournalEntryWithId);
        }
      } catch (err: any) {
        console.error('Error fetching journal entry:', err);
        setError(err.message || 'Failed to fetch journal entry');
      } finally {
        setLoading(false);
      }
    };
    
    if (user) {
      fetchEntry();
    }
  }, [user, dateParam, router]);

  const handleAfterSubmit = () => {
    router.push('/journal');
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const options: Intl.DateTimeFormatOptions = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric'
      };
      return date.toLocaleDateString('en-US', options);
    } catch (err) {
      return dateString;
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="bg-red-50 p-6 rounded-lg shadow border-l-4 border-red-500">
            <h2 className="text-xl font-semibold text-red-800 mb-2">Error</h2>
            <p className="text-red-700 mb-4">{error}</p>
            <Link href="/journal" className="text-blue-600 hover:text-blue-800">
              Return to Journal
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link 
            href="/journal" 
            className="text-blue-600 hover:text-blue-800 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Journal
          </Link>
        </div>
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Edit Journal Entry</h1>
          {entry && (
            <h2 className="text-xl text-gray-600">{formatDate(entry.entry_date)}</h2>
          )}
        </div>
        
        {entry && (
          <JournalForm 
            existingEntry={entry} 
            afterSubmit={handleAfterSubmit}
          />
        )}
      </div>
    </main>
  );
} 