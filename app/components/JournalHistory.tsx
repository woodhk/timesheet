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
      <div className="p-10 bg-white rounded-lg shadow-md text-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
        </svg>
        <h3 className="text-xl font-medium text-gray-700 mb-3">No Journal Entries Yet</h3>
        <p className="text-gray-600 mb-6">Start your journaling practice by creating your first entry.</p>
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