import { Task } from '../types';

interface TaskListProps {
  tasks: Task[];
}

export default function TaskList({ tasks }: TaskListProps) {
  const GOAL_HOURS = 10000;
  
  return (
    <div 
      className="mt-8"
      style={{
        marginTop: '2rem'
      }}
    >
      <h2 
        className="text-2xl font-semibold mb-4"
        style={{
          fontSize: '1.5rem',
          fontWeight: 600,
          marginBottom: '1rem'
        }}
      >
        Your Progress
      </h2>
      <div 
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        style={{
          display: 'grid',
          gap: '1.5rem',
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
            task.category === 'copywriting' ? '#10B981' : '#6B7280';
          
          return (
            <div 
              key={task.id} 
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              style={{
                backgroundColor: 'white',
                borderRadius: '0.5rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                padding: '1.5rem',
                transition: 'box-shadow 0.2s ease'
              }}
            >
              <div 
                className="flex justify-between items-start mb-3"
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '0.75rem'
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
                  className={`px-2 py-1 text-xs rounded-full text-white`}
                  style={{
                    padding: '0.25rem 0.5rem',
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
                className="mb-4"
                style={{
                  marginBottom: '1rem'
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
                  <span>{task.hoursSpent} hours</span>
                  <span>{GOAL_HOURS} hours goal</span>
                </div>
                <div 
                  className="w-full bg-gray-200 rounded-full h-2.5"
                  style={{
                    width: '100%',
                    backgroundColor: '#E5E7EB',
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
                className="text-sm text-gray-500"
                style={{
                  fontSize: '0.875rem',
                  color: '#6B7280'
                }}
              >
                {Math.round(percentComplete)}% complete
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
} 