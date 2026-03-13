import React, { useState, useMemo } from 'react';
import Sidebar from '../components/Sidebar';
import './DashboardLayout.css';
import { useAuth } from '../contexts/AuthContext';
import { useTask } from '../contexts/TaskContext';
import { useNavigate } from 'react-router-dom';

// Icons
const SearchIcon = () => <svg className="search-icon" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>;
const BellIcon = () => <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0"/></svg>;
const CheckCircleIcon = () => <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" style={{fill: '#10b981'}}/></svg>;
const AlertIcon = () => <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" style={{fill: '#ef4444'}}/></svg>;
const ClockIcon = () => <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 2m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>;
const ArrowRightIcon = () => <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path></svg>;

export default function Dashboard() {
  const { logout, currentUser, verifyEmail } = useAuth();
  const { data } = useTask();
  const [searchQuery, setSearchQuery] = useState('');
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const navigate = useNavigate();

  // --- Calculate Statistics ---
  const allTasks = Object.values(data.tasks);
  
  const taskStats = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const toDoCount = data.columns['col-1']?.taskIds.length || 0;
    const inProgressCount = data.columns['col-2']?.taskIds.length || 0;
    const doneCount = data.columns['col-3']?.taskIds.length || 0;
    const totalTasks = allTasks.length;
    const completionRate = totalTasks > 0 ? Math.round((doneCount / totalTasks) * 100) : 0;

    // Overdue tasks
    const overdueTasks = allTasks.filter((task) => {
      if (!task.dueDate) return false;
      const dueDate = new Date(task.dueDate);
      dueDate.setHours(0, 0, 0, 0);
      const isInDoneColumn = data.columns['col-3']?.taskIds.includes(task.id);
      return dueDate < today && !isInDoneColumn;
    });

    // Upcoming tasks (due within 7 days)
    const upcomingTasks = allTasks.filter((task) => {
      if (!task.dueDate) return false;
      const dueDate = new Date(task.dueDate);
      dueDate.setHours(0, 0, 0, 0);
      const daysUntilDue = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
      const isInDoneColumn = data.columns['col-3']?.taskIds.includes(task.id);
      return daysUntilDue > 0 && daysUntilDue <= 7 && !isInDoneColumn;
    });

    // High priority tasks
    const highPriorityTasks = allTasks.filter(task => 
      (task.priority === 'high' || task.priority === 'critical') && 
      !data.columns['col-3']?.taskIds.includes(task.id)
    );

    return {
      toDoCount,
      inProgressCount,
      doneCount,
      totalTasks,
      completionRate,
      overdueTasks,
      upcomingTasks,
      highPriorityTasks,
    };
  }, [data]);

  const refreshUser = async () => {
    await currentUser.reload();
    window.location.reload();
  };

  return (
    <div className="dashboard-container">
      {/* 1. Left Sidebar */}
      <Sidebar currentUser={currentUser} logout={logout} />

      {/* 2. Main Content Area */}
      <div className="main-content">
        {/* --- WARNING BANNER --- */}
        {!currentUser?.emailVerified && (
          <div style={{ background: '#fff3cd', color: '#856404', padding: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>
            Your email is not verified. Please check your inbox.
            </span>
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

        {/* Header Section */}
        <header className="top-header">
          <div className="search-bar">
            <SearchIcon />
            <input type="text"
              placeholder="Find tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)} />
          </div>

          <div className="header-actions">
            <div style={{ position: 'relative' }}>
              <button 
                className="icon-btn"
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                style={{ position: 'relative' }}
              >
                <BellIcon />
                {taskStats.overdueTasks.length > 0 && (
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
                    {taskStats.overdueTasks.length}
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
                  zIndex: 1000,
                  color: 'var(--text-main)'
                }}>
                  <div style={{ padding: '8px 12px', fontWeight: 'bold', borderBottom: '1px solid var(--border-color)' }}>
                    Overdue Tasks ({taskStats.overdueTasks.length})
                  </div>
                  
                  {taskStats.overdueTasks.length === 0 ? (
                    <div style={{ padding: '12px', color: '#6b7280', fontSize: '14px' }}>
                      No overdue tasks. Great job!
                    </div>
                  ) : (
                    taskStats.overdueTasks.map((task) => (
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
            {/* <button className="btn-help">Help</button> */}
          </div>
        </header>

        {/* Main Dashboard Content */}
        <div className="page-container">
          <div className="dashboard-header" style={{ marginBottom: '30px' }}>
            <h1>Dashboard</h1>
            <p style={{ color: '#6b7280', marginTop: '8px' }}>Welcome back! Here's your task overview.</p>
          </div>

          {/* --- TOP STATS CARDS --- */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
            
            {/* Total Tasks Card */}
            <div style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              borderRadius: '12px',
              padding: '20px',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '12px', color: '#6b7280', textTransform: 'uppercase', fontWeight: '600' }}>Total Tasks</div>
                  <div className='task-num' style={{ fontSize: '32px', fontWeight: 'bold', marginTop: '8px'}}><p>{taskStats.totalTasks}</p></div>
                </div>
                {/* <div style={{ fontSize: '40px' }}>📋</div> */}
              </div>
            </div>

            {/* Completion Rate Card */}
            <div style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              borderRadius: '12px',
              padding: '20px',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '12px', color: '#6b7280', textTransform: 'uppercase', fontWeight: '600' }}>Completion Rate</div>
                  <div style={{ fontSize: '32px', fontWeight: 'bold', marginTop: '8px', color: '#10b981' }}>{taskStats.completionRate}%</div>
                </div>
                {/* <CheckCircleIcon /> */}
              </div>
            </div>

            {/* Overdue Tasks Card */}
            <div style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              borderRadius: '12px',
              padding: '20px',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '12px', color: '#6b7280', textTransform: 'uppercase', fontWeight: '600' }}>Overdue Tasks</div>
                  <div style={{ fontSize: '32px', fontWeight: 'bold', marginTop: '8px', color: taskStats.overdueTasks.length > 0 ? '#ef4444' : '#10b981' }}>
                    {taskStats.overdueTasks.length}
                  </div>
                </div>
                {/* <AlertIcon /> */}
              </div>
            </div>

            {/* Upcoming Tasks Card */}
            <div style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              borderRadius: '12px',
              padding: '20px',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '12px', color: '#6b7280', textTransform: 'uppercase', fontWeight: '600' }}>Upcoming (7 Days)</div>
                  <div style={{ fontSize: '32px', fontWeight: 'bold', marginTop: '8px', color: '#3b82f6' }}>
                    {taskStats.upcomingTasks.length}
                  </div>
                </div>
                <ClockIcon style={{ color: '#3b82f6' }} />
              </div>
            </div>
          </div>

          {/* --- STATUS BREAKDOWN --- */}
          <div style={{ marginBottom: '30px' }}>
            <h2 className='status-breakdown-title' style={{ marginBottom: '16px', fontSize: '18px', fontWeight: '600' }}>Task Status Breakdown</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px' }}>
              
              {/* To Do */}
              <div style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                padding: '16px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>To Do</div>
                <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#f59e0b' }}>{taskStats.toDoCount}</div>
                <div style={{ width: '100%', height: '4px', background: '#e5e7eb', borderRadius: '2px', marginTop: '12px' }}>
                  <div style={{ width: `${(taskStats.toDoCount / taskStats.totalTasks) * 100}%`, height: '100%', background: '#f59e0b', borderRadius: '2px' }}></div>
                </div>
              </div>

              {/* In Progress */}
              <div style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                padding: '16px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>In Progress</div>
                <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#3b82f6' }}>{taskStats.inProgressCount}</div>
                <div style={{ width: '100%', height: '4px', background: '#e5e7eb', borderRadius: '2px', marginTop: '12px' }}>
                  <div style={{ width: `${(taskStats.inProgressCount / taskStats.totalTasks) * 100}%`, height: '100%', background: '#3b82f6', borderRadius: '2px' }}></div>
                </div>
              </div>

              {/* Done */}
              <div style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                padding: '16px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>Done</div>
                <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#10b981' }}>{taskStats.doneCount}</div>
                <div style={{ width: '100%', height: '4px', background: '#e5e7eb', borderRadius: '2px', marginTop: '12px' }}>
                  <div style={{ width: `${(taskStats.doneCount / taskStats.totalTasks) * 100}%`, height: '100%', background: '#10b981', borderRadius: '2px' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* --- UPCOMING TASKS SECTION --- */}
          {taskStats.upcomingTasks.length > 0 && (
            <div style={{ marginBottom: '30px' }}>
              <h2 style={{ marginBottom: '16px', fontSize: '18px', fontWeight: '600' }}>Upcoming Tasks (Next 7 Days)</h2>
              <div style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                overflow: 'hidden'
              }}>
                {taskStats.upcomingTasks.map((task) => (
                  <div key={task.id} style={{
                    padding: '16px',
                    borderBottom: '1px solid var(--border-color)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: '500', marginBottom: '4px' }}>{task.content}</div>
                      {task.description && (
                        <div style={{ fontSize: '13px', color: '#6b7280' }}>{task.description}</div>
                      )}
                      <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>
                        Due: {new Date(task.dueDate).toLocaleDateString()}
                      </div>
                    </div>
                    <span style={{
                      fontSize: '12px',
                      fontWeight: '500',
                      padding: '4px 12px',
                      borderRadius: '20px',
                      background: task.priority === 'high' ? '#fee2e2' : task.priority === 'critical' ? '#fecaca' : task.priority === 'medium' ? '#fef3c7' : '#f0fdf4',
                      color: task.priority === 'high' ? '#7f1d1d' : task.priority === 'critical' ? '#991b1b' : task.priority === 'medium' ? '#92400e' : '#166534'
                    }}>
                      {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* --- HIGH PRIORITY TASKS SECTION --- */}
          {taskStats.highPriorityTasks.length > 0 && (
            <div className='high-prior' style={{ marginBottom: '30px' }}>
              <h2 style={{ marginBottom: '16px', fontSize: '18px', fontWeight: '600' }}>High Priority Tasks</h2>
              <div style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                overflow: 'hidden'
              }}>
                {taskStats.highPriorityTasks.map((task) => (
                  <div key={task.id} style={{
                    padding: '16px',
                    borderBottom: '1px solid var(--border-color)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderLeft: '4px solid ' + (task.priority === 'critical' ? '#ef4444' : '#f97316')
                  }}>
                    <div style={{ flex: 1 }}>
                      <div className='high-prior-task-content' style={{ fontWeight: '500', marginBottom: '4px' }}>{task.content}</div>
                      {task.description && (
                        <div style={{ fontSize: '13px', color: '#6b7280' }}>{task.description}</div>
                      )}
                      {task.dueDate && (
                        <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>
                          Due: {new Date(task.dueDate).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                    <button 
                      onClick={() => navigate('/board')}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#3b82f6',
                        padding: '8px'
                      }}
                    >
                      <ArrowRightIcon />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* --- QUICK ACTION BUTTON --- */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '30px' }}>
            <button 
              onClick={() => navigate('/board')}
              style={{
                padding: '12px 24px',
                background: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '600',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Go to Board
            </button>
            <button 
              onClick={() => navigate('/my-tasks')}
              // className='view-task-btn'
              style={{
                padding: '12px 24px',
                background: 'var(--bg-secondary)',
                color: 'var(--text-main)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                fontWeight: '600',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              View My Tasks
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}