import { Task } from '../types';

export const tasks: Task[] = [
  {
    id: '1',
    name: 'Website Frontend Development',
    category: 'developing',
    hoursSpent: 1245,
    createdAt: new Date(2023, 0, 15).toISOString(),
    updatedAt: new Date(2023, 5, 20).toISOString()
  },
  {
    id: '2',
    name: 'Mobile App UI Design',
    category: 'ui/ux',
    hoursSpent: 876,
    createdAt: new Date(2023, 1, 10).toISOString(),
    updatedAt: new Date(2023, 5, 15).toISOString()
  },
  {
    id: '3',
    name: 'Product Description Writing',
    category: 'copywriting',
    hoursSpent: 432,
    createdAt: new Date(2023, 2, 5).toISOString(),
    updatedAt: new Date(2023, 5, 10).toISOString()
  },
  {
    id: '4',
    name: 'Backend API Development',
    category: 'developing',
    hoursSpent: 2156,
    createdAt: new Date(2023, 3, 20).toISOString(),
    updatedAt: new Date(2023, 6, 5).toISOString()
  },
  {
    id: '5',
    name: 'Marketing Email Campaign',
    category: 'copywriting',
    hoursSpent: 187,
    createdAt: new Date(2023, 4, 15).toISOString(),
    updatedAt: new Date(2023, 6, 10).toISOString()
  }
]; 