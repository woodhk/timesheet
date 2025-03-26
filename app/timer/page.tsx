'use client';

import { useState, useEffect } from 'react';
import Header from '../components/Header';
import Stopwatch from '../components/Stopwatch';
import { useTasks } from '../hooks/useTasks';
import { useSupabase } from '../hooks/useSupabase';
import { useRouter } from 'next/navigation';

export default function TimerPage() {
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const { tasks, loading, error } = useTasks();
  const { user, loading: authLoading } = useSupabase();
  const router = useRouter();
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  const selectedTaskData = selectedTask 
    ? tasks.find(task => task.id === selectedTask)
    : null;

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
    
  return (
    <main className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">Task Timer</h1>
        <p className="text-gray-600 mb-8">Select a task to track your time</p>
        
        {selectedTaskData ? (
          <>
            <div className="mb-6">
              <button 
                onClick={() => setSelectedTask(null)}
                className="text-blue-600 hover:text-blue-800 flex items-center"
                style={{ 
                  color: '#2563EB', 
                  display: 'flex', 
                  alignItems: 'center',
                  cursor: 'pointer',
                  fontWeight: 500
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor"
                  style={{ height: '20px', width: '20px', marginRight: '4px' }}
                >
                  <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Back to task selection
              </button>
            </div>
            <Stopwatch task={selectedTaskData} />
          </>
        ) : (
          <>
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : error ? (
              <div className="bg-red-50 text-red-700 p-4 rounded-md">
                {error}
              </div>
            ) : tasks.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 mb-4">You don't have any tasks yet.</p>
                <button
                  onClick={() => router.push('/')}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Create a Task
                </button>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
                style={{ 
                  display: 'grid', 
                  gap: '1rem',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))'
                }}
              >
                {tasks.map(task => (
                  <div 
                    key={task.id}
                    onClick={() => setSelectedTask(task.id)}
                    className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow border-2 border-transparent hover:border-blue-500"
                    style={{ 
                      backgroundColor: 'white',
                      borderRadius: '0.5rem',
                      padding: '1.5rem',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      cursor: 'pointer',
                      border: '2px solid transparent',
                      transition: 'all 0.2s ease',
                      marginBottom: '1rem'
                    }}
                  >
                    <div className="flex justify-between items-start mb-3"
                      style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'flex-start',
                        marginBottom: '0.75rem'
                      }}
                    >
                      <h3 className="text-lg font-medium text-gray-900"
                        style={{ fontSize: '1.125rem', fontWeight: 500, color: '#111827' }}
                      >{task.name}</h3>
                      <span className={`px-2 py-1 text-xs rounded-full text-white ${
                        task.category === 'developing' ? 'bg-blue-500' :
                        task.category === 'ui/ux' ? 'bg-purple-500' :
                        task.category === 'copywriting' ? 'bg-emerald-500' : 'bg-gray-500'
                      }`}
                        style={{ 
                          padding: '0.25rem 0.5rem',
                          fontSize: '0.75rem',
                          borderRadius: '9999px',
                          color: 'white',
                          backgroundColor: 
                            task.category === 'developing' ? '#3B82F6' :
                            task.category === 'ui/ux' ? '#8B5CF6' :
                            task.category === 'copywriting' ? '#10B981' : '#6B7280'
                        }}
                      >
                        {task.category}
                      </span>
                    </div>
                    <p className="text-gray-500 text-sm mb-3"
                      style={{ color: '#6B7280', fontSize: '0.875rem', marginBottom: '0.75rem' }}
                    >
                      Current progress: {task.hoursSpent.toFixed(1)} hours
                    </p>
                    <button className="w-full py-2 mt-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors text-sm"
                      style={{ 
                        width: '100%',
                        padding: '0.5rem 0',
                        marginTop: '0.5rem',
                        backgroundColor: '#DBEAFE',
                        color: '#1D4ED8',
                        borderRadius: '0.375rem',
                        fontSize: '0.875rem',
                        cursor: 'pointer',
                        transition: 'background-color 0.2s ease'
                      }}
                    >
                      Start Timer
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
} 