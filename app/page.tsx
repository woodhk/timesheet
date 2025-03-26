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
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-700 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Header />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-7xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-3 text-gray-900 tracking-tight">
              Dashboard
            </h1>
            <p className="text-gray-600 text-lg">
              Track your progress towards mastering skills (10,000 hours)
            </p>
          </div>
          <div className="mt-2 sm:mt-0">
            <AddTaskForm />
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-14 h-14 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-700 p-5 rounded-xl shadow-sm border border-red-200 my-6">
            {error}
          </div>
        ) : (
          <TaskList tasks={tasks} />
        )}
        
        <div className="mt-14 bg-white rounded-xl shadow-md p-8 border border-gray-200">
          <h2 className="text-2xl font-semibold mb-8 text-gray-900 pb-2 border-b border-gray-100">
            Quick Stats
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
              <p className="text-gray-600 text-sm font-medium mb-2 uppercase tracking-wider">
                Total Tasks
              </p>
              <p className="text-3xl font-bold text-gray-900">
                {tasks.length}
              </p>
            </div>
            <div className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
              <p className="text-gray-600 text-sm font-medium mb-2 uppercase tracking-wider">
                Total Hours
              </p>
              <p className="text-3xl font-bold text-gray-900">
                {tasks.reduce((sum, task) => sum + task.hoursSpent, 0).toFixed(1)}
              </p>
            </div>
            <div className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
              <p className="text-gray-600 text-sm font-medium mb-2 uppercase tracking-wider">
                Categories
              </p>
              <p className="text-3xl font-bold text-gray-900">
                {new Set(tasks.map(task => task.category)).size}
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
