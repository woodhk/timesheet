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
        className="container mx-auto px-6 py-10"
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '2.5rem 1.5rem'
        }}
      >
        <div className="flex justify-between items-center mb-8"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '2rem'
          }}
        >
          <div>
            <h1 
              className="text-3xl font-bold mb-2 text-gray-900"
              style={{
                fontSize: '1.875rem',
                fontWeight: 700,
                marginBottom: '0.5rem',
                color: '#111827'
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
              Track your progress towards mastering skills (10,000 hours)
            </p>
          </div>
          <AddTaskForm />
        </div>
        
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-700 p-4 rounded-md shadow-sm">
            {error}
          </div>
        ) : (
          <TaskList tasks={tasks} />
        )}
        
        <div 
          className="mt-12 bg-white rounded-lg shadow-sm p-8 border border-gray-100"
          style={{
            marginTop: '3rem',
            backgroundColor: 'white',
            borderRadius: '0.75rem',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
            padding: '2rem',
            border: '1px solid #F3F4F6'
          }}
        >
          <h2 
            className="text-xl font-semibold mb-6 text-gray-900"
            style={{
              fontSize: '1.25rem',
              fontWeight: 600,
              marginBottom: '1.5rem',
              color: '#111827'
            }}
          >
            Quick Stats
          </h2>
          <div 
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '1.5rem'
            }}
          >
            <div 
              className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm"
              style={{
                backgroundColor: 'white',
                padding: '1.5rem',
                borderRadius: '0.75rem',
                border: '1px solid #E5E7EB',
                boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
              }}
            >
              <p 
                className="text-gray-600 text-sm font-medium mb-2"
                style={{
                  color: '#4B5563',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  marginBottom: '0.5rem'
                }}
              >
                Total Tasks
              </p>
              <p 
                className="text-3xl font-bold text-gray-900"
                style={{
                  fontSize: '1.875rem',
                  fontWeight: 700,
                  color: '#111827'
                }}
              >
                {tasks.length}
              </p>
            </div>
            <div 
              className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm"
              style={{
                backgroundColor: 'white',
                padding: '1.5rem',
                borderRadius: '0.75rem',
                border: '1px solid #E5E7EB',
                boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
              }}
            >
              <p 
                className="text-gray-600 text-sm font-medium mb-2"
                style={{
                  color: '#4B5563',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  marginBottom: '0.5rem'
                }}
              >
                Total Hours
              </p>
              <p 
                className="text-3xl font-bold text-gray-900"
                style={{
                  fontSize: '1.875rem',
                  fontWeight: 700,
                  color: '#111827'
                }}
              >
                {tasks.reduce((sum, task) => sum + task.hoursSpent, 0).toFixed(1)}
              </p>
            </div>
            <div 
              className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm"
              style={{
                backgroundColor: 'white',
                padding: '1.5rem',
                borderRadius: '0.75rem',
                border: '1px solid #E5E7EB',
                boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
              }}
            >
              <p 
                className="text-gray-600 text-sm font-medium mb-2"
                style={{
                  color: '#4B5563',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  marginBottom: '0.5rem'
                }}
              >
                Categories
              </p>
              <p 
                className="text-3xl font-bold text-gray-900"
                style={{
                  fontSize: '1.875rem',
                  fontWeight: 700,
                  color: '#111827'
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
