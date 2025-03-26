'use client';

import { useState, useEffect } from 'react';
import { Task } from '../types';
import { useSupabase } from '../hooks/useSupabase';
import { supabase } from '../lib/supabase';

interface StopwatchProps {
  task: Task;
}

export default function Stopwatch({ task }: StopwatchProps) {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useSupabase();
  
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isRunning) {
      interval = setInterval(() => {
        setTime(prevTime => prevTime + 1);
      }, 1000);
    } else if (interval) {
      clearInterval(interval);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning]);
  
  const formatTime = (timeInSeconds: number) => {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = timeInSeconds % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  
  const handleStartStop = () => {
    if (!isRunning) {
      // Starting the timer
      setStartTime(new Date());
    }
    setIsRunning(!isRunning);
  };
  
  const handleReset = () => {
    setTime(0);
    setIsRunning(false);
    setStartTime(null);
    setError(null);
  };
  
  const handleSave = async () => {
    if (!user || !startTime) {
      setError('You must be logged in to save time entries');
      return;
    }
    
    setIsSaving(true);
    setError(null);
    
    try {
      const endTime = new Date();
      
      // Step 1: Insert time entry using Supabase client directly
      const { data: timeEntry, error: timeError } = await supabase
        .from('time_entries')
        .insert([
          {
            task_id: task.id,
            user_id: user.id,
            duration_seconds: time,
            started_at: startTime.toISOString(),
            ended_at: endTime.toISOString(),
            created_at: new Date().toISOString(),
          },
        ])
        .select()
        .single();
      
      if (timeError) throw new Error(timeError.message);
      
      // Step 2: Get current task to get current hours_spent
      const { data: currentTask, error: taskFetchError } = await supabase
        .from('tasks')
        .select('hours_spent')
        .eq('id', task.id)
        .single();
      
      if (taskFetchError) throw new Error(taskFetchError.message);
      
      // Step 3: Update task hours_spent
      const hoursToAdd = time / 3600; // Convert seconds to hours
      
      const { error: updateError } = await supabase
        .from('tasks')
        .update({
          hours_spent: currentTask.hours_spent + hoursToAdd,
          updated_at: new Date().toISOString(),
        })
        .eq('id', task.id);
      
      if (updateError) throw new Error(updateError.message);
      
      // Success, reset the timer
      handleReset();
      
    } catch (err: any) {
      setError(err.message || 'An error occurred while saving your time');
      console.error('Error saving time entry:', err);
    } finally {
      setIsSaving(false);
    }
  };

  // Determine category-based colors
  const categoryColor = 
    task.category === 'developing' ? '#3B82F6' :
    task.category === 'ui/ux' ? '#8B5CF6' :
    task.category === 'sales' ? '#10B981' : '#6B7280';
  
  // Button colors based on state
  const startStopBackgroundColor = isRunning ? '#EF4444' : '#10B981';
  
  return (
    <div 
      className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto mt-8"
      style={{
        backgroundColor: 'white',
        borderRadius: '0.5rem',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        padding: '2rem',
        maxWidth: '28rem',
        margin: '2rem auto 0'
      }}
    >
      <h2 
        className="text-2xl font-bold text-center mb-2"
        style={{
          fontSize: '1.5rem',
          fontWeight: 700,
          textAlign: 'center',
          marginBottom: '0.5rem'
        }}
      >
        {task.name}
      </h2>
      <div 
        className={`text-sm inline-block px-2 py-1 rounded-full text-white mb-6`}
        style={{
          fontSize: '0.875rem',
          display: 'inline-block',
          padding: '0.25rem 0.5rem',
          borderRadius: '9999px',
          color: 'white',
          marginBottom: '1.5rem',
          backgroundColor: categoryColor
        }}
      >
        {task.category}
      </div>
      
      <div 
        className="text-6xl font-mono text-center py-6 mb-8"
        style={{
          fontSize: '3.75rem',
          fontFamily: 'monospace',
          textAlign: 'center',
          padding: '1.5rem 0',
          marginBottom: '2rem'
        }}
      >
        {formatTime(time)}
      </div>
      
      {error && (
        <div 
          className="bg-red-50 text-red-700 p-3 rounded-md mb-4"
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
      
      <div 
        className="flex space-x-4 justify-center"
        style={{
          display: 'flex',
          gap: '1rem',
          justifyContent: 'center'
        }}
      >
        <button
          onClick={handleStartStop}
          className={`px-6 py-3 rounded-lg text-white font-medium ${
            isRunning ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
          }`}
          style={{
            padding: '0.75rem 1.5rem',
            borderRadius: '0.5rem',
            color: 'white',
            fontWeight: 500,
            cursor: 'pointer',
            backgroundColor: startStopBackgroundColor,
            border: 'none'
          }}
        >
          {isRunning ? 'Stop' : 'Start'}
        </button>
        
        <button
          onClick={handleReset}
          className="px-6 py-3 rounded-lg bg-gray-300 hover:bg-gray-400 font-medium"
          style={{
            padding: '0.75rem 1.5rem',
            borderRadius: '0.5rem',
            backgroundColor: '#D1D5DB',
            fontWeight: 500,
            cursor: isRunning ? 'not-allowed' : 'pointer',
            opacity: isRunning ? 0.5 : 1,
            border: 'none'
          }}
          disabled={isRunning}
        >
          Reset
        </button>
        
        {time > 0 && !isRunning && (
          <button
            onClick={handleSave}
            className="px-6 py-3 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-medium"
            style={{
              padding: '0.75rem 1.5rem',
              borderRadius: '0.5rem',
              backgroundColor: '#3B82F6',
              color: 'white',
              fontWeight: 500,
              cursor: 'pointer',
              border: 'none'
            }}
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save'}
          </button>
        )}
      </div>
    </div>
  );
} 