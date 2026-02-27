import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../pages/DashboardLayout.css';
import { useTheme } from '../contexts/ThemeContext';

// --- Icon Definitions (Included so the app doesn't crash) ---
const GridIcon = () => <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>;
const CheckIcon = () => <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>;
const CalendarIcon = () => <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>;
const SettingsIcon = () => <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>;
const MoonIcon = () => <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>;
const LogoutIcon = () => <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>;
const SunIcon = () => <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>;
const BellIcon = () => <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0"/></svg>;


export default function Sidebar({ currentUser, logout }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // theme context
  const { theme, toggleTheme } = useTheme();

  const handleLogout = async () => {
    try {
      if (logout) {
        await logout();
        navigate('/login');
      } else {
        console.error("Logout function is undefined! Check AuthContext.");
      }
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  return (
    <div className="sidebar">
      <div className="brand">
        {/* <div className="brand-logo">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M12 2L2 7l10 5 10-5-10-5zm0 9l2.5-1.25L12 8.5l-2.5 1.25L12 11zm0 2.5l-5-2.5-5 2.5L12 22l10-8.5-5-2.5-5 2.5z"/></svg>
        </div> */}
        <span>Task Management System</span>
      </div>

      <nav className="nav-menu">
        <a 
          className={`nav-item ${location.pathname === '/dashboard' ? 'active' : ''}`}
          onClick={() => navigate('/dashboard')}
          style={{ cursor: 'pointer' }}
        >
          <GridIcon /> Dashboard
        </a>
        <a 
          className={`nav-item ${location.pathname === '/my-tasks' ? 'active' : ''}`}
          onClick={() => navigate('/my-tasks')}
          style={{ cursor: 'pointer' }}
        >
          <CheckIcon /> My Tasks
        </a>
        {/* <a className="nav-item">
          <CalendarIcon /> Calendar
        </a> */}
      </nav>

      <div className="user-profile">
        <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser?.displayName || 'User')}&background=random`} alt={currentUser?.displayName || 'User'} className="avatar" />
        <div className="user-info">
          {/* Optional Chaining (?.) prevents crash if user is loading */}
          <h4>{currentUser?.displayName || 'User'}</h4> 
          <p>{currentUser?.email}</p>
        </div>

        {/* --- Settings Dropdown Area --- */}
        <div className="settings-container">
          <button 
            className="icon-btn" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            style={{ color: '#9ca3af' }}
          >
             <SettingsIcon />
          </button>

          {isMenuOpen && (
            <div className="settings-menu">
              
              {/* Replace the alert button with this toggle button */}
              <button 
                className="menu-item" 
                onClick={() => {
                  toggleTheme();
                  setIsMenuOpen(false); // Close menu after clicking
                }}
              >
                {theme === 'light' ? (
                  <><MoonIcon /> Dark Mode</>
                ) : (
                  <><SunIcon /> Light Mode</>
                )}
              </button>
              
              <div style={{height: '1px', background: 'var(--border-color)', margin: '4px 0'}}></div>
              
              <button className="menu-item danger" onClick={handleLogout}>
                <LogoutIcon /> Log Out
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}