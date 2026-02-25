import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import './DashboardLayout.css';
import { useAuth } from '../contexts/AuthContext';

// Icons
const SearchIcon = () => <svg className="search-icon" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>;
const BellIcon = () => <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>;
const CheckIcon = () => <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>;
const ClockIcon = () => <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 2m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>;
const PriorityIcon = () => <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>;

export default function MyTasks() {
  const { logout, currentUser, verifyEmail } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Mock task data - replace with real data from Firebase
  const mockTasks = [
    { id: 1, title: 'Design Landing Page', status: 'in-progress', priority: 'high', dueDate: '2024-03-10', assignee: 'You' },
    { id: 2, title: 'Fix Login Bug', status: 'completed', priority: 'critical', dueDate: '2024-03-05', assignee: 'You' },
    { id: 3, title: 'Write API Documentation', status: 'todo', priority: 'medium', dueDate: '2024-03-15', assignee: 'You' },
    { id: 4, title: 'Database Optimization', status: 'in-progress', priority: 'high', dueDate: '2024-03-12', assignee: 'You' },
    { id: 5, title: 'Implement Dark Mode', status: 'todo', priority: 'low', dueDate: '2024-03-20', assignee: 'You' },
  ];

  const refreshUser = async () => {
    await currentUser.reload();
    window.location.reload();
  };

  const filteredTasks = mockTasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || task.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return '#10b981';
      case 'in-progress': return '#f59e0b';
      case 'todo': return '#6b7280';
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
                    <th>Due Date</th>
                    <th>Assignee</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTasks.map((task) => (
                    <tr key={task.id} className="task-row">
                      <td className="task-name">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <input type="checkbox" style={{ cursor: 'pointer' }} />
                          {task.title}
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
                          {task.status === 'in-progress' ? 'In Progress' : task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                        </span>
                      </td>
                      <td>
                        <span
                          style={{
                            color: getPriorityColor(task.priority),
                            fontWeight: '500',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                        >
                          <PriorityIcon /> {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                        </span>
                      </td>
                      <td>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)' }}>
                          <ClockIcon /> {task.dueDate}
                        </span>
                      </td>
                      <td>{task.assignee}</td>
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
