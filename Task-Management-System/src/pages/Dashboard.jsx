import React from 'react';
import Sidebar from '../components/Sidebar';
import './DashboardLayout.css';
import { useAuth } from '../contexts/AuthContext'; // Hook into your existing auth
import KanbanBoard from '../components/KanbanBoard';
import { useState } from 'react';

// Icons for the main area
const SearchIcon = () => <svg className="search-icon" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>;
const BellIcon = () => <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>;
const SparklesIcon = () => <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M9.8 17.2l1.4-4.8 4.8-1.4-4.8-1.4-1.4-4.8-1.4 4.8-4.8 1.4 4.8 1.4zM20 7l-3 1 3 1 1 3 1-3 3-1-3-1-1-3zM5 7L4 4 1 3 4 2 5-1 6 2 9 3 6 4 5 7z" /></svg>;
const PlusIcon = () => <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>;

export default function Dashboard() {
  const { logout, currentUser, verifyEmail } = useAuth(); // Use your context
  const [searchQuery, setSearchQuery] = useState('');
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
            <button className="icon-btn">
              <BellIcon />
              <span className="badge-dot"></span>
            </button>
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