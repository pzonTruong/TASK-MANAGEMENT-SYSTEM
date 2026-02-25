import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { v4 as uuidv4 } from 'uuid';
import { useTask } from '../contexts/TaskContext';
import '../pages/DashboardLayout.css'; // Adjust path to your CSS

// --- ICONS ---
const EditIcon = () => <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>;
const TrashIcon = () => <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>;
const PlusIcon = () => <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>;
// const PlusIcon = () => <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>;
const XIcon = () => <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>;

export default function KanbanBoard({ searchQuery }) {
  const { data, setData } = useTask();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null); // If null, adding new task
  
  // Modal State
  const [taskTitle, setTaskTitle] = useState('');
  const [taskPriority, setTaskPriority] = useState('medium');
  const [taskDueDate, setTaskDueDate] = useState('');
  const [subtasks, setSubtasks] = useState([]);

  // --- DRAG AND DROP HANDLER ---
  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const start = data.columns[source.droppableId];
    const finish = data.columns[destination.droppableId];

    // Moving within same column
    if (start === finish) {
      const newTaskIds = Array.from(start.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);
      
      const newColumn = { ...start, taskIds: newTaskIds };
      setData({ ...data, columns: { ...data.columns, [newColumn.id]: newColumn } });
      return;
    }

    // Moving from one column to another
    const startTaskIds = Array.from(start.taskIds);
    startTaskIds.splice(source.index, 1);
    const newStart = { ...start, taskIds: startTaskIds };

    const finishTaskIds = Array.from(finish.taskIds);
    finishTaskIds.splice(destination.index, 0, draggableId);
    const newFinish = { ...finish, taskIds: finishTaskIds };

    setData({
      ...data,
      columns: { ...data.columns, [newStart.id]: newStart, [newFinish.id]: newFinish },
    });
  };

  // --- CRUD ACTIONS ---
  
  const openModal = (task = null) => {
    if (task) {
      setEditingTask(task);
      setTaskTitle(task.content);
      setTaskPriority(task.priority || 'medium');
      setTaskDueDate(task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '');
      setSubtasks(task.subtasks || []);
    } else {
      setEditingTask(null);
      setTaskTitle('');
      setTaskPriority('medium');
      setTaskDueDate('');
      setSubtasks([]);
    }
    setIsModalOpen(true);
  };

  const saveTask = () => {
    if (!taskTitle.trim()) return;

    if (editingTask) {
      // Edit Mode
      const updatedTask = { 
        ...editingTask, 
        content: taskTitle, 
        priority: taskPriority,
        dueDate: taskDueDate ? new Date(taskDueDate).toISOString() : editingTask.dueDate,
        subtasks 
      };
      setData(prev => ({
        ...prev,
        tasks: { ...prev.tasks, [updatedTask.id]: updatedTask }
      }));
    } else {
      // Add Mode
      const newTaskId = uuidv4();
      const newTask = { 
        id: newTaskId, 
        content: taskTitle, 
        priority: taskPriority,
        dateAdded: new Date().toISOString(),
        dueDate: taskDueDate ? new Date(taskDueDate).toISOString() : null,
        subtasks 
      };
      
      const firstColId = data.columnOrder[0];
      const newColumn = {
        ...data.columns[firstColId],
        taskIds: [newTaskId, ...data.columns[firstColId].taskIds] // Add to top
      };

      setData(prev => ({
        ...prev,
        tasks: { ...prev.tasks, [newTaskId]: newTask },
        columns: { ...prev.columns, [firstColId]: newColumn }
      }));
    }
    setIsModalOpen(false);
  };

  const deleteTask = (taskId, columnId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    
    const newColumnTaskIds = data.columns[columnId].taskIds.filter(id => id !== taskId);
    const newTasks = { ...data.tasks };
    delete newTasks[taskId];

    setData(prev => ({
      ...prev,
      tasks: newTasks,
      columns: {
        ...prev.columns,
        [columnId]: { ...prev.columns[columnId], taskIds: newColumnTaskIds }
      }
    }));
  };

  // --- SUBTASK ACTIONS ---
  const addSubtask = () => setSubtasks([...subtasks, { id: uuidv4(), text: '', done: false }]);
  
  const updateSubtask = (id, field, value) => {
    setSubtasks(subtasks.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const deleteSubtask = (id) => {
    setSubtasks(subtasks.filter(s => s.id !== id));
  };

  // --- SEARCH FILTERING ---
  // While searching, we only SHOW matching tasks, but we disable DragDrop to avoid index issues
  const isSearching = !!(searchQuery && searchQuery.length > 0);

  return (
    <>
      <div className="board-toolbar" style={{ marginBottom: '20px', display: 'flex', justifyContent: 'flex-start' }}>
         <button className="btn-create" onClick={() => openModal(null)}>
            <PlusIcon /> Create Task
         </button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="kanban-board">
          {data.columnOrder.map(columnId => {
            const column = data.columns[columnId];
            const tasks = column.taskIds
              .map(taskId => data.tasks[taskId])
              .filter(task => task != null); // Remove undefined tasks
            
            // Filter tasks based on search
            const filteredTasks = isSearching 
                ? tasks.filter(t => t.content.toLowerCase().includes(searchQuery.toLowerCase()))
                : tasks;

            return (
              <Droppable key={column.id} droppableId={column.id} isDropDisabled={isSearching}>
                {(provided) => (
                  <div className="kanban-column" {...provided.droppableProps} ref={provided.innerRef}>
                    <div className="column-header">
                      {column.title}
                      <span className="column-count">{filteredTasks.length}</span>
                    </div>
                    
                    <div className="task-list">
                      {filteredTasks.map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id} index={index} isDragDisabled={isSearching}>
                          {(provided) => (
                            <div 
                              className="task-card"
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              onClick={() => openModal(task)}
                            >
                              <div className="card-header-row">
                                <h4 className="card-title">{task.content}</h4>
                                <div className="card-actions">
                                  <button className="btn-icon-sm delete" onClick={(e) => { e.stopPropagation(); deleteTask(task.id, column.id); }}>
                                    <TrashIcon />
                                  </button>
                                </div>
                              </div>

                              {/* Progress Bar if Subtasks exist */}
                              {task.subtasks.length > 0 && (
                                <div className="subtask-preview">
                                  <div className="progress-bar">
                                    <div 
                                      className="progress-fill" 
                                      style={{ width: `${(task.subtasks.filter(s => s.done).length / task.subtasks.length) * 100}%` }}
                                    ></div>
                                  </div>
                                  <span className="subtask-text">
                                    {task.subtasks.filter(s => s.done).length}/{task.subtasks.length} subtasks
                                  </span>
                                </div>
                              )}
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  </div>
                )}
              </Droppable>
            );
          })}
        </div>
      </DragDropContext>

      {/* --- ADD / EDIT TASK MODAL --- */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingTask ? 'Edit Task' : 'New Task'}</h2>
              <button className="btn-icon-sm" onClick={() => setIsModalOpen(false)}><XIcon/></button>
            </div>

            <div className="form-group">
              <label>Task Title</label>
              <input 
                className="form-input" 
                value={taskTitle} 
                onChange={e => setTaskTitle(e.target.value)} 
                placeholder="What needs to be done?"
                autoFocus
              />
            </div>

            <div className="form-group">
              <label>Priority</label>
              <select 
                className="form-input" 
                value={taskPriority} 
                onChange={e => setTaskPriority(e.target.value)}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>

            <div className="form-group">
              <label>Due Date</label>
              <input 
                type="date"
                className="form-input" 
                value={taskDueDate} 
                onChange={e => setTaskDueDate(e.target.value)} 
              />
            </div>

            <div className="form-group">
              <label>Subtasks</label>
              {subtasks.map((sub, idx) => (
                <div key={sub.id} className="subtask-input-group">
                  <input 
                    type="checkbox" 
                    checked={sub.done} 
                    onChange={e => updateSubtask(sub.id, 'done', e.target.checked)}
                    style={{width: '20px', height: '20px', marginTop: '8px'}}
                  />
                  <input 
                    className="form-input"
                    value={sub.text}
                    onChange={e => updateSubtask(sub.id, 'text', e.target.value)}
                    placeholder="Subtask details..."
                  />
                  <button className="btn-icon-sm delete" onClick={() => deleteSubtask(sub.id)}>
                    <TrashIcon />
                  </button>
                </div>
              ))}
              <button className="btn-add-sub" onClick={addSubtask}>+ Add Subtask</button>
            </div>

            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
              <button className="btn-primary" onClick={saveTask}>
                {editingTask ? 'Save Changes' : 'Create Task'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}