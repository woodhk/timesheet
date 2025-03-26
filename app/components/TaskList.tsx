'use client';

import { Task } from '../types';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../lib/supabase';

interface TaskListProps {
  tasks: Task[];
}

interface TimeEntry {
  id: string;
  task_id: string;
  duration_seconds: number;
  started_at: string;
  ended_at: string;
  created_at: string;
  task: {
    name: string;
    category: string;
  };
}

export default function TaskList({ tasks }: TaskListProps) {
  const GOAL_HOURS = 10000;
  const [deleteConfirmation, setDeleteConfirmation] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  
  useEffect(() => {
    // Fetch the latest time entries
    const fetchTimeEntries = async () => {
      try {
        const { data, error } = await supabase
          .from('time_entries')
          .select(`
            id,
            task_id,
            duration_seconds,
            started_at,
            ended_at,
            created_at,
            task:tasks(name, category)
          `)
          .order('created_at', { ascending: false })
          .limit(10);
          
        if (error) throw error;
        setTimeEntries(data || []);
      } catch (err) {
        console.error('Error fetching time entries:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTimeEntries();
  }, []);
  
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
  
  // Helper function to format seconds to hours and minutes
  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours === 0) {
      return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
    }
    
    if (minutes === 0) {
      return `${hours} hour${hours !== 1 ? 's' : ''}`;
    }
    
    return `${hours} hour${hours !== 1 ? 's' : ''} ${minutes} minute${minutes !== 1 ? 's' : ''}`;
  };
  
  // Format date for notifications
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric'
    });
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
      
      {/* Two-column layout for progress cards and notifications */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Progress cards - now takes 2/3 of the space on larger screens */}
        <div 
          className="lg:w-2/3"
          style={{
            flex: '0 0 66.666667%'
          }}
        >
          <div 
            className="grid gap-8 md:grid-cols-2"
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
              
              // Determine milestone
              const milestones = [10, 100, 500, 1000, 2500, 5000, 7500, 10000];
              const currentMilestone = milestones.find(m => task.hoursSpent < m) || 10000;
              const prevMilestone = milestones[milestones.indexOf(currentMilestone) - 1] || 0;
              const milestoneProgress = ((task.hoursSpent - prevMilestone) / (currentMilestone - prevMilestone)) * 100;
              
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
                      <span>{task.hoursSpent.toFixed(1)} hours</span>
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
                  
                  {/* Mini milestone section */}
                  <div 
                    className="mb-5 border-t pt-4 border-gray-100"
                    style={{
                      marginBottom: '1.25rem',
                      borderTop: '1px solid #F3F4F6',
                      paddingTop: '1rem'
                    }}
                  >
                    <div 
                      className="flex justify-between text-sm text-gray-600 mb-1"
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: '0.875rem',
                        color: '#4B5563',
                        marginBottom: '0.25rem'
                      }}
                    >
                      <span>Next milestone: {currentMilestone}h</span>
                      <button 
                        className="text-blue-600 hover:text-blue-800 text-xs"
                        style={{
                          color: '#2563EB',
                          fontSize: '0.75rem',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer'
                        }}
                        onClick={() => {
                          // Toggle dialog for full milestone view
                          alert(`Progress toward 10,000 hours: ${(percentComplete).toFixed(1)}%`);
                        }}
                      >
                        View full progress
                      </button>
                    </div>
                    <div 
                      className="w-full bg-gray-100 rounded-full h-1.5"
                      style={{
                        width: '100%',
                        backgroundColor: '#F3F4F6',
                        borderRadius: '9999px',
                        height: '6px'
                      }}
                    >
                      <div 
                        className="bg-green-500 h-1.5 rounded-full" 
                        style={{ 
                          width: `${milestoneProgress}%`,
                          backgroundColor: '#10B981',
                          height: '6px',
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
                      {milestoneProgress.toFixed(2)}% complete
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
                        className="text-gray-500 hover:text-red-600"
                        style={{
                          color: '#6B7280',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          transition: 'color 0.2s ease'
                        }}
                      >
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          width="16" 
                          height="16" 
                          fill="currentColor" 
                          viewBox="0 0 16 16"
                        >
                          <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                          <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Notifications column - takes 1/3 of the space on larger screens */}
        <div 
          className="lg:w-1/3"
          style={{
            flex: '0 0 33.333333%'
          }}
        >
          <div 
            className="bg-white rounded-lg shadow-sm p-6 border border-gray-100"
            style={{
              backgroundColor: 'white',
              borderRadius: '0.75rem',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
              padding: '1.5rem',
              border: '1px solid #F3F4F6'
            }}
          >
            <h3 
              className="text-lg font-medium text-gray-900 mb-4"
              style={{
                fontSize: '1.125rem',
                fontWeight: 500,
                color: '#111827',
                marginBottom: '1rem'
              }}
            >
              Recently Completed
            </h3>
            
            {loading ? (
              <div className="py-4 text-center text-gray-500">
                Loading entries...
              </div>
            ) : timeEntries.length === 0 ? (
              <div className="py-4 text-center text-gray-500">
                No completed tasks yet
              </div>
            ) : (
              <div className="space-y-4">
                {timeEntries.map(entry => {
                  // Get category color based on task category
                  const categoryColor = 
                    entry.task?.category === 'developing' ? '#3B82F6' :
                    entry.task?.category === 'ui/ux' ? '#8B5CF6' :
                    entry.task?.category === 'sales' ? '#10B981' : '#6B7280';
                  
                  return (
                    <div 
                      key={entry.id}
                      className="border-b border-gray-100 pb-4 last:border-0"
                      style={{
                        borderBottom: '1px solid #F3F4F6',
                        paddingBottom: '1rem'
                      }}
                    >
                      <div 
                        className="flex justify-between items-start mb-1"
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                          marginBottom: '0.25rem'
                        }}
                      >
                        <span 
                          className="text-sm font-medium"
                          style={{
                            fontSize: '0.875rem',
                            fontWeight: 500
                          }}
                        >
                          {entry.task?.name || 'Unknown Task'}
                        </span>
                        <span 
                          className="text-xs text-gray-500"
                          style={{
                            fontSize: '0.75rem',
                            color: '#6B7280'
                          }}
                        >
                          {formatDate(entry.created_at)}
                        </span>
                      </div>
                      
                      <div 
                        className="flex items-center justify-between"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between'
                        }}
                      >
                        <span 
                          className="text-sm text-gray-600"
                          style={{
                            fontSize: '0.875rem',
                            color: '#4B5563'
                          }}
                        >
                          {formatDuration(entry.duration_seconds)}
                        </span>
                        
                        <span 
                          className={`text-xs py-0.5 px-1.5 rounded-full text-white`}
                          style={{
                            fontSize: '0.75rem',
                            padding: '0.125rem 0.375rem',
                            borderRadius: '9999px',
                            color: 'white',
                            backgroundColor: categoryColor
                          }}
                        >
                          {entry.task?.category || 'other'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 