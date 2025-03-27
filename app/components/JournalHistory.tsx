'use client';

import { useState } from 'react';
import Link from 'next/link';
import { journalQuestions } from '../data/journalQuestions';

type JournalHistoryProps = {
  entries: Array<{
    id: string;
    entry_date: string;
    [key: string]: any;
  }>;
};

export default function JournalHistory({ entries }: JournalHistoryProps) {
  const [expandedEntry, setExpandedEntry] = useState<string | null>(null);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric'
    };
    return date.toLocaleDateString('en-US', options);
  };

  const toggleExpand = (id: string) => {
    if (expandedEntry === id) {
      setExpandedEntry(null);
    } else {
      setExpandedEntry(id);
    }
  };

  if (!entries || entries.length === 0) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-md text-center">
        <p className="text-gray-600">You haven't created any journal entries yet.</p>
        <Link 
          href="/journal/new" 
          className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Create Your First Entry
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Journal History</h2>

      {entries.map((entry) => (
        <div key={entry.id} className="bg-white rounded-lg shadow-md overflow-hidden">
          <div 
            className="p-4 cursor-pointer flex justify-between items-center bg-gray-50 hover:bg-gray-100"
            onClick={() => toggleExpand(entry.id)}
          >
            <h3 className="text-lg font-medium text-gray-800">
              {formatDate(entry.entry_date)}
            </h3>
            <button className="text-gray-500" type="button">
              {expandedEntry === entry.id ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 15l-6-6-6 6"/>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 9l6 6 6-6"/>
                </svg>
              )}
            </button>
          </div>
          
          {expandedEntry === entry.id && (
            <div className="p-4 border-t border-gray-200">
              <div className="space-y-4">
                {journalQuestions.map((question) => (
                  <div key={question.id} className="pb-4 border-b border-gray-100 last:border-0">
                    <h4 className="font-medium text-gray-700 mb-1">{question.question}</h4>
                    <p className="text-gray-600 whitespace-pre-line">
                      {entry[question.field] || <em className="text-gray-400">No response</em>}
                    </p>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 flex justify-end">
                <Link 
                  href={`/journal/${entry.entry_date}`}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Edit Entry
                </Link>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
} 