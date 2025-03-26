'use client';

import { Task } from '../types';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../lib/supabase';

interface TaskListProps {
  tasks: Task[];
}

export default function TaskList({ tasks }: TaskListProps) {
  const GOAL_HOURS = 10000;
  const [deleteConfirmation, setDeleteConfirmation] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  
  const handleDeleteClick = (taskId: string) => {
    setDeleteConfirmation(taskId);
  };
  
  const cancelDelete = () => {
    setDeleteConfirmation(null);
    setError(null);
  };
  
  const confirmDelete = async (taskId: string) => {
    setIsDeleting(true);
    setError(null);
    
    try {
      const { error: deleteError } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId);
        
      if (deleteError) throw new Error(deleteError.message);
      
      setDeleteConfirmation(null);
      router.refresh();
    } catch (err: Error | unknown) {
      setError(err instanceof Error ? err.message : 'Failed to delete the task');
      console.error('Delete task error:', err);
    } finally {
      setIsDeleting(false);
    }
  };
  
  return (
    <div 
      className="mt-10"
      style={{
        marginTop: '2.5rem'
      }}
    >
      <h2 
        className="text-2xl font-semibold mb-6 text-gray-900"
        style={{
          fontSize: '1.5rem',
          fontWeight: 600,
          marginBottom: '1.5rem',
          color: '#111827'
        }}
      >
        Your Progress
      </h2>
      {error && (
        <div 
          className="bg-red-50 text-red-700 p-4 rounded-md mb-6 shadow-sm border border-red-100"
          style={{
            backgroundColor: '#FEF2F2',
            color: '#B91C1C',
            padding: '1rem',
            borderRadius: '0.5rem',
            marginBottom: '1.5rem',
            border: '1px solid #FEE2E2',
            boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
          }}
        >
          {error}
        </div>
      )}
      <div 
        className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
        style={{
          display: 'grid',
          gap: '2rem',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))'
        }}
      >
        {tasks.map((task) => {
          // Calculate percentage for progress bar
          const percentComplete = (task.hoursSpent / GOAL_HOURS) * 100;
          
          // Determine category color
          const categoryColor = 
            task.category === 'developing' ? '#3B82F6' :
            task.category === 'ui/ux' ? '#8B5CF6' :
            task.category === 'sales' ? '#10B981' : '#6B7280';
            
          const isConfirmingDelete = deleteConfirmation === task.id;
          
          return (
            <div 
              key={task.id} 
              className="bg-white rounded-lg shadow-sm p-6 hover:shadow transition-shadow border border-gray-100"
              style={{
                backgroundColor: 'white',
                borderRadius: '0.75rem',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                padding: '1.5rem',
                transition: 'box-shadow 0.2s ease',
                position: 'relative',
                border: '1px solid #F3F4F6'
              }}
            >
              <div 
                className="flex justify-between items-start mb-4"
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '1rem'
                }}
              >
                <h3 
                  className="text-lg font-medium text-gray-900"
                  style={{
                    fontSize: '1.125rem',
                    fontWeight: 500,
                    color: '#111827'
                  }}
                >
                  {task.name}
                </h3>
                <span 
                  className={`px-2.5 py-1 text-xs rounded-full text-white`}
                  style={{
                    padding: '0.25rem 0.75rem',
                    fontSize: '0.75rem',
                    borderRadius: '9999px',
                    color: 'white',
                    backgroundColor: categoryColor
                  }}
                >
                  {task.category}
                </span>
              </div>
              
              <div 
                className="mb-5"
                style={{
                  marginBottom: '1.25rem'
                }}
              >
                <div 
                  className="flex justify-between text-sm text-gray-600 mb-2"
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '0.875rem',
                    color: '#4B5563',
                    marginBottom: '0.5rem'
                  }}
                >
                  <span>{task.hoursSpent} hours</span>
                  <span>{GOAL_HOURS} hours goal</span>
                </div>
                <div 
                  className="w-full bg-gray-100 rounded-full h-2.5"
                  style={{
                    width: '100%',
                    backgroundColor: '#F3F4F6',
                    borderRadius: '9999px',
                    height: '10px'
                  }}
                >
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full" 
                    style={{ 
                      width: `${percentComplete}%`,
                      backgroundColor: '#2563EB',
                      height: '10px',
                      borderRadius: '9999px'
                    }}
                  ></div>
                </div>
              </div>
              
              <div 
                className="flex justify-between items-center"
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div 
                  className="text-sm font-medium text-gray-700"
                  style={{
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    color: '#374151'
                  }}
                >
                  {Math.round(percentComplete)}% complete
                </div>
                
                {isConfirmingDelete ? (
                  <div
                    className="flex items-center space-x-2"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}
                  >
                    <span className="text-sm text-gray-600">Are you sure?</span>
                    <button
                      onClick={() => confirmDelete(task.id)}
                      disabled={isDeleting}
                      className="text-xs bg-red-600 text-white px-2.5 py-1 rounded hover:bg-red-700"
                      style={{
                        fontSize: '0.75rem',
                        backgroundColor: '#DC2626',
                        color: 'white',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '0.25rem',
                        border: 'none',
                        cursor: isDeleting ? 'not-allowed' : 'pointer'
                      }}
                    >
                      {isDeleting ? 'Deleting...' : 'Yes'}
                    </button>
                    <button
                      onClick={cancelDelete}
                      disabled={isDeleting}
                      className="text-xs bg-gray-200 text-gray-700 px-2.5 py-1 rounded hover:bg-gray-300"
                      style={{
                        fontSize: '0.75rem',
                        backgroundColor: '#E5E7EB',
                        color: '#374151',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '0.25rem',
                        border: 'none',
                        cursor: isDeleting ? 'not-allowed' : 'pointer'
                      }}
                    >
                      No
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleDeleteClick(task.id)}
                    className="text-gray-500 hover:text-red-600 text-sm"
                    style={{
                      color: '#6B7280',
                      background: 'none',
                      border: 'none',
                      fontSize: '0.875rem',
                      cursor: 'pointer',
                      transition: 'color 0.2s ease'
                    }}
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
} 