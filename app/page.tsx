'use client';

import { useEffect } from 'react';
import Header from './components/Header';
import TaskList from './components/TaskList';
import AddTaskForm from './components/AddTaskForm';
import { useTasks } from './hooks/useTasks';
import { useSupabase } from './hooks/useSupabase';
import { useRouter } from 'next/navigation';

export default function Home() {
  const { tasks, loading, error } = useTasks();
  const { user, loading: authLoading } = useSupabase();
  const router = useRouter();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

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
    <main 
      className="min-h-screen bg-gray-50"
      style={{
        minHeight: '100vh',
        backgroundColor: '#F9FAFB'
      }}
    >
      <Header />
      <div 
        className="container mx-auto px-4 py-8"
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '2rem 1rem'
        }}
      >
        <div className="flex justify-between items-center mb-6"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.5rem'
          }}
        >
          <div>
            <h1 
              className="text-3xl font-bold mb-2"
              style={{
                fontSize: '1.875rem',
                fontWeight: 700,
                marginBottom: '0.5rem'
              }}
            >
              Dashboard
            </h1>
            <p 
              className="text-gray-600"
              style={{
                color: '#4B5563'
              }}
            >
              Track your progress towards mastery (10,000 hours)
            </p>
          </div>
          <AddTaskForm />
        </div>
        
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-700 p-4 rounded-md">
            {error}
          </div>
        ) : (
          <TaskList tasks={tasks} />
        )}
        
        <div 
          className="mt-12 bg-white rounded-lg shadow-md p-6"
          style={{
            marginTop: '3rem',
            backgroundColor: 'white',
            borderRadius: '0.5rem',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            padding: '1.5rem'
          }}
        >
          <h2 
            className="text-xl font-semibold mb-4"
            style={{
              fontSize: '1.25rem',
              fontWeight: 600,
              marginBottom: '1rem'
            }}
          >
            Quick Stats
          </h2>
          <div 
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '1rem'
            }}
          >
            <div 
              className="bg-blue-50 p-4 rounded-lg border border-blue-100"
              style={{
                backgroundColor: '#EFF6FF',
                padding: '1rem',
                borderRadius: '0.5rem',
                border: '1px solid #DBEAFE'
              }}
            >
              <p 
                className="text-blue-800 text-sm font-medium"
                style={{
                  color: '#1E40AF',
                  fontSize: '0.875rem',
                  fontWeight: 500
                }}
              >
                Total Tasks
              </p>
              <p 
                className="text-2xl font-bold"
                style={{
                  fontSize: '1.5rem',
                  fontWeight: 700
                }}
              >
                {tasks.length}
              </p>
            </div>
            <div 
              className="bg-purple-50 p-4 rounded-lg border border-purple-100"
              style={{
                backgroundColor: '#F5F3FF',
                padding: '1rem',
                borderRadius: '0.5rem',
                border: '1px solid #EDE9FE'
              }}
            >
              <p 
                className="text-purple-800 text-sm font-medium"
                style={{
                  color: '#5B21B6',
                  fontSize: '0.875rem',
                  fontWeight: 500
                }}
              >
                Total Hours
              </p>
              <p 
                className="text-2xl font-bold"
                style={{
                  fontSize: '1.5rem',
                  fontWeight: 700
                }}
              >
                {tasks.reduce((sum, task) => sum + task.hoursSpent, 0).toFixed(1)}
              </p>
            </div>
            <div 
              className="bg-emerald-50 p-4 rounded-lg border border-emerald-100"
              style={{
                backgroundColor: '#ECFDF5',
                padding: '1rem',
                borderRadius: '0.5rem',
                border: '1px solid #D1FAE5'
              }}
            >
              <p 
                className="text-emerald-800 text-sm font-medium"
                style={{
                  color: '#065F46',
                  fontSize: '0.875rem',
                  fontWeight: 500
                }}
              >
                Categories
              </p>
              <p 
                className="text-2xl font-bold"
                style={{
                  fontSize: '1.5rem',
                  fontWeight: 700
                }}
              >
                {new Set(tasks.map(task => task.category)).size}
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
