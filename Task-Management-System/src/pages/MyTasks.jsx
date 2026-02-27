import React, { useState, useMemo } from 'react';
import Sidebar from '../components/Sidebar';
import './DashboardLayout.css';
import { useAuth } from '../contexts/AuthContext';
import { useTask } from '../contexts/TaskContext';

// Icons
const SearchIcon = () => <svg className="search-icon" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>;
const BellIcon = () => <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0"/></svg>;
const ClockIcon = () => <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 2m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>;
const CalendarIcon = () => <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>;

export default function MyTasks() {
  const { logout, currentUser, verifyEmail } = useAuth();
  const { data } = useTask();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  // Get overdue tasks
  const overdueTasks = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return Object.values(data.tasks).filter((task) => {
      if (!task.dueDate) return false;
      
      const dueDate = new Date(task.dueDate);
      dueDate.setHours(0, 0, 0, 0);
      
      // Check if task is overdue (dueDate < today) and not in Done column
      const isInDoneColumn = data.columns['col-3']?.taskIds.includes(task.id);
      
      return dueDate < today && !isInDoneColumn;
    });
  }, [data]);

  const refreshUser = async () => {
    await currentUser.reload();
    window.location.reload();
  };

  // Get all tasks from all columns
  const getAllTasks = () => {
    const allTasks = [];
    Object.values(data.tasks).forEach(task => {
      // Find which column this task is in
      for (const [colId, column] of Object.entries(data.columns)) {
        if (column.taskIds.includes(task.id)) {
          allTasks.push({ ...task, columnId: colId, status: column.title });
          break;
        }
      }
    });
    return allTasks;
  };

  let allTasks = getAllTasks();

  // Filter tasks
  const filteredTasks = allTasks.filter(task => {
    const matchesSearch = task.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || 
      (filterStatus === 'todo' && task.status === 'To Do') ||
      (filterStatus === 'in-progress' && task.status === 'In Progress') ||
      (filterStatus === 'completed' && task.status === 'Done');
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Done': return '#10b981';
      case 'In Progress': return '#f59e0b';
      case 'To Do': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical': return '#ef4444';
      case 'high': return '#f97316';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  const formatDate = (isoDate) => {
    if (!isoDate) return 'No date';
    return new Date(isoDate).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <Sidebar currentUser={currentUser} logout={logout} />

      {/* Main Content */}
      <div className="main-content">
        {!currentUser?.emailVerified && (
          <div style={{ background: '#fff3cd', color: '#856404', padding: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>⚠️ Your email is not verified. Please check your inbox.</span>
            <div>
              <button onClick={verifyEmail} style={{ marginRight: '10px', cursor: 'pointer', background: 'none', border: '1px solid #856404', padding: '5px 10px', borderRadius: '4px' }}>
                Resend Link
              </button>
              <button onClick={refreshUser} style={{ cursor: 'pointer', background: '#856404', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px' }}>
                I've Verified It
              </button>
            </div>
          </div>
        )}

        {/* Header */}
        <header className="top-header">
          <div className="search-bar">
            <SearchIcon />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="header-actions">
            <div style={{ position: 'relative' }}>
              <button 
                className="icon-btn"
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                style={{ position: 'relative' }}
              >
                <BellIcon />
                {overdueTasks.length > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: '-4px',
                    right: '-4px',
                    background: '#ef4444',
                    color: 'white',
                    borderRadius: '50%',
                    width: '20px',
                    height: '20px',
                    fontSize: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold'
                  }}>
                    {overdueTasks.length}
                  </span>
                )}
              </button>

              {isNotificationOpen && (
                <div style={{ 
                  position: 'absolute', 
                  top: '40px', 
                  right: '0', 
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                  minWidth: '280px',
                  maxHeight: '350px',
                  overflowY: 'auto',
                  zIndex: 1000
                }}>
                  <div style={{ padding: '8px 12px', fontWeight: 'bold', borderBottom: '1px solid var(--border-color)' }}>
                    Overdue Tasks ({overdueTasks.length})
                  </div>
                  
                  {overdueTasks.length === 0 ? (
                    <div style={{ padding: '12px', color: '#6b7280', fontSize: '14px' }}>
                      No overdue tasks. Great job! 🎉
                    </div>
                  ) : (
                    overdueTasks.map((task) => (
                      <div 
                        key={task.id}
                        style={{ 
                          padding: '8px 12px', 
                          borderBottom: '1px solid var(--border-color)',
                          cursor: 'pointer',
                          whiteSpace: 'normal'
                        }}
                        onClick={() => {
                          setIsNotificationOpen(false);
                        }}
                      >
                        <div style={{ fontWeight: '500', marginBottom: '4px' }}>
                          {task.content}
                        </div>
                        <div style={{ fontSize: '12px', color: '#6b7280' }}>
                          Due: {new Date(task.dueDate).toLocaleDateString()}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
            <button className="btn-help">Help</button>
          </div>
        </header>

        {/* Page Container */}
        <div className="page-container">
          <div className="board-header">
            <h1>My Tasks</h1>

            {/* Filter Section */}
            <div className="board-controls" style={{ gap: '12px' }}>
              <button
                className={`filter-btn ${filterStatus === 'all' ? 'active' : ''}`}
                onClick={() => setFilterStatus('all')}
              >
                All Tasks
              </button>
              <button
                className={`filter-btn ${filterStatus === 'todo' ? 'active' : ''}`}
                onClick={() => setFilterStatus('todo')}
              >
                To Do
              </button>
              <button
                className={`filter-btn ${filterStatus === 'in-progress' ? 'active' : ''}`}
                onClick={() => setFilterStatus('in-progress')}
              >
                In Progress
              </button>
              <button
                className={`filter-btn ${filterStatus === 'completed' ? 'active' : ''}`}
                onClick={() => setFilterStatus('completed')}
              >
                Completed
              </button>
            </div>
          </div>

          {/* Tasks Table */}
          <div className="tasks-table-container">
            {filteredTasks.length === 0 ? (
              <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                <p>No tasks found</p>
              </div>
            ) : (
              <table className="tasks-table">
                <thead>
                  <tr>
                    <th>Task Name</th>
                    <th>Status</th>
                    <th>Priority</th>
                    <th>Date Added</th>
                    <th>Due Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTasks.map((task) => (
                    <tr key={task.id} className="task-row">
                      <td className="task-name">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <input type="checkbox" style={{ cursor: 'pointer' }} />
                          {task.content}
                        </div>
                      </td>
                      <td>
                        <span
                          className="status-badge"
                          style={{
                            backgroundColor: getStatusColor(task.status),
                            color: 'white',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            fontSize: '0.85rem',
                          }}
                        >
                          {task.status}
                        </span>
                      </td>
                      <td>
                        <span
                          style={{
                            color: getPriorityColor(task.priority || 'medium'),
                            fontWeight: '500',
                          }}
                        >
                          {task.priority ? task.priority.charAt(0).toUpperCase() + task.priority.slice(1) : 'Medium'}
                        </span>
                      </td>
                      <td>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)' }}>
                          <CalendarIcon /> {formatDate(task.dateAdded)}
                        </span>
                      </td>
                      <td>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)' }}>
                          <ClockIcon /> {formatDate(task.dueDate)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
