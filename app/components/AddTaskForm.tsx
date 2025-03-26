'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSupabase } from '../hooks/useSupabase';
import { supabase } from '../lib/supabase';

export default function AddTaskForm() {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('developing');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const router = useRouter();
  const { user } = useSupabase();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (!user) {
      setError('You must be logged in to create a task');
      setIsLoading(false);
      return;
    }

    try {
      // Use Supabase client directly instead of going through the API
      const { data, error: dbError } = await supabase
        .from('tasks')
        .insert([
          {
            user_id: user.id,
            name,
            category,
            hours_spent: 0,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ])
        .select()
        .single();
      
      if (dbError) throw new Error(dbError.message);

      // Reset form
      setName('');
      setCategory('developing');
      setIsFormOpen(false);
      
      // Refresh the page to show the new task
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'An error occurred while creating the task');
      console.error('Error creating task:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isFormOpen) {
    return (
      <button
        onClick={() => setIsFormOpen(true)}
        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors shadow-sm"
        style={{
          backgroundColor: '#2563EB',
          color: 'white',
          padding: '0.625rem 1.25rem',
          borderRadius: '0.375rem',
          border: 'none',
          cursor: 'pointer',
          boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
          transition: 'background-color 0.2s ease'
        }}
      >
        Add New Task
      </button>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm mb-6 border border-gray-100"
      style={{
        backgroundColor: 'white',
        padding: '1.5rem',
        borderRadius: '0.75rem',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        marginBottom: '1.5rem',
        border: '1px solid #F3F4F6'
      }}
    >
      <div className="flex justify-between items-center mb-5"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.25rem'
        }}
      >
        <h2 className="text-lg font-semibold text-gray-900"
          style={{
            fontSize: '1.125rem',
            fontWeight: 600,
            color: '#111827'
          }}
        >
          Add a New Task
        </h2>
        <button
          onClick={() => setIsFormOpen(false)}
          className="text-gray-500 hover:text-gray-700"
          style={{
            color: '#6B7280',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            transition: 'color 0.2s ease'
          }}
        >
          Cancel
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-md mb-5 border border-red-100"
          style={{
            backgroundColor: '#FEF2F2',
            color: '#B91C1C',
            padding: '1rem',
            borderRadius: '0.5rem',
            marginBottom: '1.25rem',
            border: '1px solid #FEE2E2'
          }}
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Task Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            style={{
              width: '100%',
              padding: '0.625rem 0.75rem',
              border: '1px solid #D1D5DB',
              borderRadius: '0.375rem',
              transition: 'all 0.2s ease'
            }}
          />
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            style={{
              width: '100%',
              padding: '0.625rem 0.75rem',
              border: '1px solid #D1D5DB',
              borderRadius: '0.375rem',
              transition: 'all 0.2s ease'
            }}
          >
            <option value="developing">Development</option>
            <option value="ui/ux">UI/UX Design</option>
            <option value="sales">Sales</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="flex justify-end pt-2"
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            paddingTop: '0.5rem'
          }}
        >
          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 shadow-sm"
            style={{
              backgroundColor: '#2563EB',
              color: 'white',
              padding: '0.625rem 1.25rem',
              borderRadius: '0.375rem',
              border: 'none',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.5 : 1,
              boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
              transition: 'background-color 0.2s ease'
            }}
          >
            {isLoading ? 'Creating...' : 'Create Task'}
          </button>
        </div>
      </form>
    </div>
  );
} 