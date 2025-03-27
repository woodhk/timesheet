'use client';

import { useState, useEffect } from 'react';
import { journalQuestions, JournalEntry } from '../data/journalQuestions';
import { useJournalSubmit } from '../hooks/useJournalSubmit';
import { useRouter } from 'next/navigation';

type JournalFormProps = {
  existingEntry?: Partial<JournalEntry> & { id?: string };
  afterSubmit?: () => void;
};

export default function JournalForm({ existingEntry, afterSubmit }: JournalFormProps) {
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [formData, setFormData] = useState<Partial<JournalEntry>>({
    accomplishment: '',
    learning: '',
    hardest_moment: '',
    focus_time: '',
    avoidance: '',
    decision_regret: '',
    energy_sources: '',
    time_intentionality: '',
    goals_reflection: '',
    tomorrow_action: '',
  });
  
  const { submitEntry, loading: isSaving, error } = useJournalSubmit();
  const router = useRouter();

  // Initialize form with existing data if available
  useEffect(() => {
    if (existingEntry) {
      setFormData({
        accomplishment: existingEntry.accomplishment || '',
        learning: existingEntry.learning || '',
        hardest_moment: existingEntry.hardest_moment || '',
        focus_time: existingEntry.focus_time || '',
        avoidance: existingEntry.avoidance || '',
        decision_regret: existingEntry.decision_regret || '',
        energy_sources: existingEntry.energy_sources || '',
        time_intentionality: existingEntry.time_intentionality || '',
        goals_reflection: existingEntry.goals_reflection || '',
        tomorrow_action: existingEntry.tomorrow_action || '',
      });
    }
  }, [existingEntry]);

  const currentQuestion = journalQuestions[activeQuestionIndex];

  const handleInputChange = (field: keyof JournalEntry, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNext = () => {
    if (activeQuestionIndex < journalQuestions.length - 1) {
      setActiveQuestionIndex(activeQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (activeQuestionIndex > 0) {
      setActiveQuestionIndex(activeQuestionIndex - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const success = await submitEntry(formData, existingEntry?.id);
    
    if (success) {
      if (afterSubmit) {
        afterSubmit();
      } else {
        router.push('/journal');
      }
    }
  };

  const getProgress = () => {
    return Math.round(((activeQuestionIndex + 1) / journalQuestions.length) * 100);
  };

  const formatDate = () => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric'
    };
    return new Date().toLocaleDateString('en-US', options);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Daily Journal</h2>
        <p className="text-gray-600">{formatDate()}</p>
      </div>
      
      {error && (
        <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-md">
          <p>{error}</p>
        </div>
      )}
      
      <div className="mb-4 bg-gray-200 rounded-full h-2.5">
        <div 
          className="bg-blue-600 h-2.5 rounded-full" 
          style={{ width: `${getProgress()}%` }}
        ></div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-gray-50 p-6 rounded-lg shadow-sm transition-all duration-300">
          <h3 className="text-xl font-medium text-gray-800 mb-3">
            {currentQuestion.question}
          </h3>
          
          <textarea
            id={currentQuestion.id}
            name={currentQuestion.field}
            value={formData[currentQuestion.field] || ''}
            onChange={(e) => handleInputChange(currentQuestion.field, e.target.value)}
            placeholder={currentQuestion.placeholder}
            rows={5}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div className="flex justify-between items-center">
          <button
            type="button"
            onClick={handlePrevious}
            disabled={activeQuestionIndex === 0}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          <div className="flex space-x-4">
            {activeQuestionIndex < journalQuestions.length - 1 && (
              <button
                type="button"
                onClick={handleNext}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Next
              </button>
            )}
            
            <button
              type="submit"
              disabled={isSaving}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-70"
            >
              {isSaving ? 'Saving...' : 'Save Journal Entry'}
            </button>
          </div>
        </div>
      </form>
      
      {/* Question navigator */}
      <div className="mt-8 grid grid-cols-5 md:grid-cols-10 gap-2">
        {journalQuestions.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveQuestionIndex(index)}
            className={`w-full h-2 rounded-full ${
              index === activeQuestionIndex 
                ? 'bg-blue-600' 
                : index < activeQuestionIndex 
                  ? 'bg-blue-300' 
                  : 'bg-gray-300'
            }`}
            aria-label={`Go to question ${index + 1}`}
            type="button"
          />
        ))}
      </div>
    </div>
  );
} 