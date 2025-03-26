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
        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        style={{
          backgroundColor: '#2563EB',
          color: 'white',
          padding: '0.5rem 1rem',
          borderRadius: '0.375rem',
          border: 'none',
          cursor: 'pointer'
        }}
      >
        Add New Task
      </button>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6"
      style={{
        backgroundColor: 'white',
        padding: '1.5rem',
        borderRadius: '0.5rem',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        marginBottom: '1.5rem'
      }}
    >
      <div className="flex justify-between items-center mb-4"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1rem'
        }}
      >
        <h2 className="text-lg font-semibold"
          style={{
            fontSize: '1.125rem',
            fontWeight: 600
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
            cursor: 'pointer'
          }}
        >
          Cancel
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded-md mb-4"
          style={{
            backgroundColor: '#FEF2F2',
            color: '#B91C1C',
            padding: '0.75rem',
            borderRadius: '0.375rem',
            marginBottom: '1rem'
          }}
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Task Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            style={{
              width: '100%',
              padding: '0.5rem 0.75rem',
              border: '1px solid #D1D5DB',
              borderRadius: '0.375rem'
            }}
          />
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            style={{
              width: '100%',
              padding: '0.5rem 0.75rem',
              border: '1px solid #D1D5DB',
              borderRadius: '0.375rem'
            }}
          >
            <option value="developing">Development</option>
            <option value="ui/ux">UI/UX Design</option>
            <option value="copywriting">Copywriting</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="flex justify-end"
          style={{
            display: 'flex',
            justifyContent: 'flex-end'
          }}
        >
          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
            style={{
              backgroundColor: '#2563EB',
              color: 'white',
              padding: '0.5rem 1rem',
              borderRadius: '0.375rem',
              border: 'none',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.5 : 1
            }}
          >
            {isLoading ? 'Creating...' : 'Create Task'}
          </button>
        </div>
      </form>
    </div>
  );
} 