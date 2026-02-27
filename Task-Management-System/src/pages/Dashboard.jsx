import React from 'react';
import Sidebar from '../components/Sidebar';
import './DashboardLayout.css';
import { useAuth } from '../contexts/AuthContext'; // Hook into your existing auth
import KanbanBoard from '../components/KanbanBoard';
import { useState, useMemo } from 'react';
import { useTask } from '../contexts/TaskContext';

// Icons for the main area
const SearchIcon = () => <svg className="search-icon" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>;
const BellIcon = () => <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0"/></svg>;
const SparklesIcon = () => <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M9.8 17.2l1.4-4.8 4.8-1.4-4.8-1.4-1.4-4.8-1.4 4.8-4.8 1.4 4.8 1.4zM20 7l-3 1 3 1 1 3 1-3 3-1-3-1-1-3zM5 7L4 4 1 3 4 2 5-1 6 2 9 3 6 4 5 7z" /></svg>;
const PlusIcon = () => <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>;

export default function Dashboard() {
  const { logout, currentUser, verifyEmail } = useAuth(); // Use your context
  const [searchQuery, setSearchQuery] = useState('');
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const { data } = useTask();
  
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
  return (
    <div className="dashboard-container">
      {/* 1. Left Sidebar */}
      <Sidebar currentUser={currentUser} logout={logout} />

      {/* 2. Main Content Area */}
      <div className="main-content">
        {/* --- ADD THIS WARNING BANNER --- */}
        {!currentUser?.emailVerified && (
          <div style={{ background: '#fff3cd', color: '#856404', padding: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>
              ⚠️ Your email is not verified. Please check your inbox.
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

        {/* Board Content */}
        <div className="page-container">
          <div className="board-header">
            <h1>Board</h1>

            <div className="board-controls">
              {/* Member Avatars */}
              {/* <div className="member-stack">
                <img className="member-avatar" src="https://ui-avatars.com/api/?name=Alex&background=random" />
                <img className="member-avatar" src="https://ui-avatars.com/api/?name=Ben&background=random" />
                <img className="member-avatar" src="https://ui-avatars.com/api/?name=Cat&background=random" />
                <div className="member-avatar" style={{ background: '#f3f4f6', color: '#6b7280', fontSize: '0.7rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+4</div>
              </div> */}

              {/* Action Buttons */}
              {/* <button className="btn-magic">
                <SparklesIcon /> AI Magic
              </button> */}

              {/* <button className="btn-create">
                <PlusIcon /> Create Task
              </button> */}

              {/* View Toggle (Grid/List) */}
              {/* <div className="view-toggle">
                <button className="toggle-btn active">
                  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M4 4h4v4H4V4zm6 0h4v4h-4V4zm6 0h4v4h-4V4zM4 10h4v4H4v-4zm6 0h4v4h-4v-4zm6 0h4v4h-4v-4zM4 16h4v4H4v-4zm6 0h4v4h-4v-4zm6 0h4v4h-4v-4z" /></svg>
                </button>
                <button className="toggle-btn">
                  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M4 6h16v2H4V6zm0 5h16v2H4v-2zm0 5h16v2H4v-2z" /></svg>
                </button>
              </div> */}
            </div>
          </div>
          
          {/* This is where your Drag & Drop Kanban Board will go later */}
          <div className="board-canvas">
            <KanbanBoard searchQuery={searchQuery} />
          </div>
        </div>

      </div>
    </div>
  );
}