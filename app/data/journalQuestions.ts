export type JournalQuestion = {
  id: string;
  question: string;
  field: keyof JournalEntry;
  placeholder: string;
};

export type JournalEntry = {
  accomplishment: string;
  learning: string;
  hardest_moment: string;
  focus_time: string;
  avoidance: string;
  decision_regret: string;
  energy_sources: string;
  time_intentionality: string;
  goals_reflection: string;
  tomorrow_action: string;
};

export const journalQuestions: JournalQuestion[] = [
  {
    id: 'accomplishment',
    question: "What's one thing I accomplished today that I'm genuinely proud of?",
    field: 'accomplishment',
    placeholder: 'Share an achievement, no matter how small...'
  },
  {
    id: 'learning',
    question: "What did I learn today — about myself, others, or the task I worked on?",
    field: 'learning',
    placeholder: 'Reflect on a new insight or lesson...'
  },
  {
    id: 'hardest_moment',
    question: "What was the hardest moment of today, and how did I handle it?",
    field: 'hardest_moment',
    placeholder: 'Describe a challenge and your response...'
  },
  {
    id: 'focus_time',
    question: "When did I feel most focused or in flow? What was I doing at that time?",
    field: 'focus_time',
    placeholder: 'What activity engaged you completely?'
  },
  {
    id: 'avoidance',
    question: "What did I avoid today, and why do I think I avoided it?",
    field: 'avoidance',
    placeholder: 'Be honest about procrastination or resistance...'
  },
  {
    id: 'decision_regret',
    question: "What's one decision or habit from today I wish I handled differently?",
    field: 'decision_regret',
    placeholder: 'Reflect on a potential improvement...'
  },
  {
    id: 'energy_sources',
    question: "What gave me energy today? What drained it?",
    field: 'energy_sources',
    placeholder: 'Identify your energizers and energy vampires...'
  },
  {
    id: 'time_intentionality',
    question: "Was I intentional with how I spent my time, or did I drift?",
    field: 'time_intentionality',
    placeholder: 'Evaluate your time management honestly...'
  },
  {
    id: 'goals_reflection',
    question: "What did today teach me about my long-term goals or values?",
    field: 'goals_reflection',
    placeholder: 'Connect today with your bigger picture...'
  },
  {
    id: 'tomorrow_action',
    question: "What's one small, specific thing I want to do differently tomorrow?",
    field: 'tomorrow_action',
    placeholder: 'Commit to one actionable change...'
  }
]; 