import React, { createContext, useContext, useState } from 'react';

const TaskContext = createContext();

export function useTask() {
  return useContext(TaskContext);
}

const initialData = {
  tasks: {
    'task-1': { 
      id: 'task-1', 
      content: 'Design Homepage', 
      priority: 'high',
      dateAdded: new Date('2024-02-20').toISOString(),
      dueDate: new Date('2024-03-10').toISOString(),
      subtasks: [{id: 's1', text: 'Logo', done: true}, {id: 's2', text: 'Hero Section', done: false}] 
    },
  },
  
  columns: {
    'col-1': { id: 'col-1', title: 'To Do', taskIds: ['task-1'] },
    'col-2': { id: 'col-2', title: 'In Progress', taskIds: [] },
    'col-3': { id: 'col-3', title: 'Done', taskIds: [] },
  },
  columnOrder: ['col-1', 'col-2', 'col-3'],
};

export function TaskProvider({ children }) {
  const [data, setData] = useState(initialData);

  const value = {
    data,
    setData,
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
}
