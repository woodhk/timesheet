'use client';

import { useState, useEffect } from 'react';
import Header from '../components/Header';
import JournalHistory from '../components/JournalHistory';
import JournalForm from '../components/JournalForm';
import FloatingActionButton from '../components/FloatingActionButton';
import { useSupabase } from '../hooks/useSupabase';
import { useJournalEntries } from '../hooks/useJournalEntries';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Toaster, toast } from 'sonner';

export default function JournalPage() {
  const [showNewEntryForm, setShowNewEntryForm] = useState(false);
  const { user, loading: authLoading } = useSupabase();
  const { entries, todayEntry, loading: entriesLoading, error: entriesError, fetchEntries } = useJournalEntries();
  const router = useRouter();
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?returnUrl=/journal');
    }
  }, [user, authLoading, router]);

  const formatDate = () => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric'
    };
    return new Date().toLocaleDateString('en-US', options);
  };

  const handleAfterSubmit = () => {
    setShowNewEntryForm(false);
    fetchEntries();
    toast.success("Journal entry saved successfully!");
  };

  const handleNewEntryClick = () => {
    if (todayEntry) {
      // If an entry exists for today, show a toast notification
      toast.warning("You already have a journal entry for today", {
        description: "You can edit your existing entry instead.",
        action: {
          label: "Edit Entry",
          onClick: () => setShowNewEntryForm(true)
        },
        duration: 5000
      });
    } else {
      // If no entry exists, show the form
      setShowNewEntryForm(true);
    }
  };

  if (authLoading) {
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
  
  // Show journal form if user explicitly clicked to show it
  const showForm = showNewEntryForm;

  return (
    <main className="min-h-screen bg-gray-50">
      <Header />
      <Toaster position="top-center" />
      <div className="container mx-auto px-4 py-8 pb-20">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Daily Journal</h1>
          
          {showForm ? (
            <button 
              onClick={() => setShowNewEntryForm(false)} 
              className="text-blue-600 hover:text-blue-800 flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Back to journal history
            </button>
          ) : (
            <button 
              onClick={handleNewEntryClick}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 inline-block"
            >
              New Journal Entry
            </button>
          )}
        </div>

        {!showForm && (
          <div className="mb-10 p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">About Daily Journaling</h2>
            <div className="prose max-w-none">
              <p>
                Take a few minutes at the end of each day to reflect on your experiences. 
                This daily practice helps you build self-awareness, track your growth, 
                and make intentional choices for tomorrow.
              </p>
              <ul className="mt-4 space-y-2">
                <li><strong>Be honest with yourself</strong> - The more authentic your responses, the more valuable the insights.</li>
                <li><strong>No judgment</strong> - Your journal is a safe space for reflection, not self-criticism.</li>
                <li><strong>Consistency matters</strong> - Try to make this a daily ritual, even if your entries are brief.</li>
                <li><strong>Review periodically</strong> - Look back at past entries to identify patterns and track your growth.</li>
              </ul>
            </div>
          </div>
        )}

        {showForm ? (
          <JournalForm 
            existingEntry={todayEntry || undefined} 
            afterSubmit={handleAfterSubmit}
          />
        ) : entriesLoading ? (
          <div className="flex justify-center py-12">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : entriesError ? (
          <div className="bg-red-50 text-red-700 p-4 rounded-md">
            {entriesError}
          </div>
        ) : (
          <>
            <div className="flex justify-end mb-4">
              {todayEntry ? (
                <button 
                  onClick={() => setShowNewEntryForm(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 inline-block"
                >
                  Edit Today's Entry
                </button>
              ) : null}
            </div>
            <JournalHistory entries={entries} />
          </>
        )}
      </div>
      
      {!showForm && (
        <FloatingActionButton 
          onClick={handleNewEntryClick}
          label="New Entry"
        />
      )}
    </main>
  );
} 