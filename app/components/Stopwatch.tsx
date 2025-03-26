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
  // Add states for manual time entry
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [manualHours, setManualHours] = useState(0);
  const [manualMinutes, setManualMinutes] = useState(0);
  
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

  // Add handler for manual time entry
  const handleManualSave = async () => {
    if (!user) {
      setError('You must be logged in to save time entries');
      return;
    }
    
    if (manualHours === 0 && manualMinutes === 0) {
      setError('Please enter a valid time');
      return;
    }
    
    setIsSaving(true);
    setError(null);
    
    try {
      const manualTimeInSeconds = (manualHours * 3600) + (manualMinutes * 60);
      const now = new Date();
      // Calculate start time by subtracting the manual time from now
      const calculatedStartTime = new Date(now.getTime() - (manualTimeInSeconds * 1000));
      
      // Insert time entry
      const { error: timeError } = await supabase
        .from('time_entries')
        .insert([
          {
            task_id: task.id,
            user_id: user.id,
            duration_seconds: manualTimeInSeconds,
            started_at: calculatedStartTime.toISOString(),
            ended_at: now.toISOString(),
            created_at: now.toISOString(),
          },
        ])
        .select()
        .single();
      
      if (timeError) throw new Error(timeError.message);
      
      // Get current task hours
      const { data: currentTask, error: taskFetchError } = await supabase
        .from('tasks')
        .select('hours_spent')
        .eq('id', task.id)
        .single();
      
      if (taskFetchError) throw new Error(taskFetchError.message);
      
      // Update task hours_spent
      const hoursToAdd = manualTimeInSeconds / 3600; // Convert seconds to hours
      
      const { error: updateError } = await supabase
        .from('tasks')
        .update({
          hours_spent: currentTask.hours_spent + hoursToAdd,
          updated_at: now.toISOString(),
        })
        .eq('id', task.id);
      
      if (updateError) throw new Error(updateError.message);
      
      // Reset manual time inputs
      setManualHours(0);
      setManualMinutes(0);
      setShowManualEntry(false);
      
      // Refresh the page to show updated hours
      window.location.reload();
    } catch (err: Error | unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred while saving your time');
      console.error('Error saving manual time entry:', err);
    } finally {
      setIsSaving(false);
    }
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
      const { error: timeError } = await supabase
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
      
      // Refresh the page to show updated hours
      window.location.reload();
    } catch (err: Error | unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred while saving your time');
      console.error('Error saving time entry:', err);
    } finally {
      setIsSaving(false);
    }
  };

  // Determine category-based colors
  const categoryColors = {
    developing: '#4F46E5', // Indigo 600
    'ui/ux': '#8B5CF6',    // Violet 500
    sales: '#10B981',      // Emerald 500
    default: '#6B7280'     // Gray 500
  };
  
  const categoryColor = categoryColors[task.category as keyof typeof categoryColors] || categoryColors.default;
  
  // Button colors based on state
  const startStopBackgroundColor = isRunning ? '#EF4444' : '#10B981';
  
  return (
    <div className="bg-white rounded-2xl shadow-md p-8 max-w-md mx-auto mt-8 border border-slate-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-800">
          {task.name}
        </h2>
        <div className="text-sm px-3 py-1.5 rounded-full text-white" style={{ backgroundColor: categoryColor }}>
          {task.category}
        </div>
      </div>
      
      {!showManualEntry && (
        <div className="bg-slate-50 rounded-xl py-10 mb-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 h-1 w-full" style={{ backgroundColor: categoryColor }}></div>
          <div className="text-center">
            <div className="text-6xl font-mono font-bold text-slate-700">
              {formatTime(time)}
            </div>
            <div className="mt-2 text-sm text-slate-500">
              {isRunning ? 'Running...' : 'Ready'}
            </div>
          </div>
        </div>
      )}
      
      {showManualEntry && (
        <div className="bg-slate-50 rounded-xl p-6 mb-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 h-1 w-full" style={{ backgroundColor: categoryColor }}></div>
          <div className="text-center mb-4 text-slate-600 font-medium">Enter time manually:</div>
          <div className="flex items-center justify-center gap-4">
            <div>
              <label htmlFor="hours" className="block text-sm font-medium text-slate-600 mb-1">Hours</label>
              <input 
                type="number" 
                id="hours"
                min="0"
                value={manualHours}
                onChange={(e) => setManualHours(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-24 px-3 py-2.5 border border-slate-200 rounded-lg text-slate-800 focus:ring-2 focus:ring-violet-500 focus:border-transparent focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="minutes" className="block text-sm font-medium text-slate-600 mb-1">Minutes</label>
              <input 
                type="number" 
                id="minutes"
                min="0"
                max="59"
                value={manualMinutes}
                onChange={(e) => setManualMinutes(Math.min(59, Math.max(0, parseInt(e.target.value) || 0)))}
                className="w-24 px-3 py-2.5 border border-slate-200 rounded-lg text-slate-800 focus:ring-2 focus:ring-violet-500 focus:border-transparent focus:outline-none"
              />
            </div>
          </div>
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6 border border-red-100">
          {error}
        </div>
      )}
      
      {/* Conditional rendering for Stopwatch or Manual Entry buttons */}
      {!showManualEntry ? (
        <div className="flex space-x-4 justify-center">
          <button
            onClick={handleStartStop}
            className="flex-1 py-3.5 rounded-xl text-white font-medium transition-all duration-200"
            style={{
              backgroundColor: startStopBackgroundColor,
              boxShadow: isRunning ? '0 0 0 2px rgba(239, 68, 68, 0.2)' : '0 0 0 2px rgba(16, 185, 129, 0.2)'
            }}
          >
            {isRunning ? 'Stop' : 'Start'}
          </button>
          
          <button
            onClick={handleReset}
            className="flex-1 py-3.5 rounded-xl bg-slate-200 text-slate-700 font-medium transition-all duration-200 disabled:opacity-50"
            disabled={isRunning}
          >
            Reset
          </button>
          
          {time > 0 && !isRunning && (
            <button
              onClick={handleSave}
              className="flex-1 py-3.5 rounded-xl text-white font-medium transition-all duration-200"
              style={{ backgroundColor: '#4F46E5', boxShadow: '0 0 0 2px rgba(79, 70, 229, 0.2)' }}
            >
              Save Time
            </button>
          )}
        </div>
      ) : (
        <div className="flex space-x-4 justify-center">
          <button
            onClick={handleManualSave}
            disabled={isSaving}
            className="flex-1 py-3.5 rounded-xl text-white font-medium transition-all duration-200"
            style={{ backgroundColor: '#4F46E5', boxShadow: '0 0 0 2px rgba(79, 70, 229, 0.2)', opacity: isSaving ? 0.7 : 1 }}
          >
            {isSaving ? 'Saving...' : 'Save Entry'}
          </button>
          
          <button
            onClick={() => setShowManualEntry(false)}
            className="flex-1 py-3.5 rounded-xl bg-slate-200 text-slate-700 font-medium transition-all duration-200"
          >
            Cancel
          </button>
        </div>
      )}
      
      {/* Toggle between stopwatch and manual entry */}
      <div className="mt-8 text-center">
        <button
          onClick={() => {
            if (isRunning) return; // Don't allow switching if timer is running
            setShowManualEntry(!showManualEntry);
            if (showManualEntry) {
              setManualHours(0);
              setManualMinutes(0);
            }
          }}
          className="text-indigo-600 hover:text-indigo-800 text-sm font-medium disabled:opacity-50"
          disabled={isRunning}
        >
          {showManualEntry ? 'Use Stopwatch Instead' : 'Enter Time Manually'}
        </button>
      </div>
    </div>
  );
} 