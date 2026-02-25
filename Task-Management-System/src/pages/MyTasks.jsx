import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import './DashboardLayout.css';
import { useAuth } from '../contexts/AuthContext';
import { useTask } from '../contexts/TaskContext';

// Icons
const SearchIcon = () => <svg className="search-icon" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>;
const BellIcon = () => <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>;
const ClockIcon = () => <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 2m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>;
const CalendarIcon = () => <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>;

export default function MyTasks() {
  const { logout, currentUser, verifyEmail } = useAuth();
  const { data } = useTask();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

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
            <button className="icon-btn">
              <BellIcon />
              <span className="badge-dot"></span>
            </button>
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
