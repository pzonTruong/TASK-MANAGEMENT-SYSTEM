# Task Management System - Project Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Features](#features)
3. [Tech Stack](#tech-stack)
4. [Project Structure](#project-structure)
5. [Architecture](#architecture)
6. [Context Management](#context-management)
7. [Pages](#pages)
8. [Components](#components)
9. [Getting Started](#getting-started)
10. [Key Features Explained](#key-features-explained)

---

## Project Overview

The **Task Management System** is a modern, full-featured web application built with React and Vite that helps users organize, track, and manage their tasks efficiently. The application features a Kanban-style board for task organization, real-time authentication via Firebase, dark/light theme support, and notifications for overdue tasks.

**Version:** 0.0.0  
**Build Tool:** Vite  
**Styling:** CSS with CSS Variables for theming

---

## Features

### Core Features
- ✅ **User Authentication** - Sign up and login with Firebase
- ✅ **Email Verification** - Secure email verification system
- ✅ **Kanban Board** - Drag-and-drop task organization with three columns:
  - To Do
  - In Progress
  - Done
- ✅ **Task Management** - Create, view, and organize tasks with:
  - Task content
  - Priority levels (high, medium, low)
  - Due dates
  - Subtasks (with completion tracking)
  - Date added tracking
- ✅ **Overdue Task Notifications** - Real-time notification badge and dropdown showing overdue tasks
- ✅ **Dark/Light Theme** - Toggle between dark and light modes with persistent state
- ✅ **Responsive Sidebar** - Quick navigation and user profile display
- ✅ **Dynamic Avatars** - User avatars generated based on username
- ✅ **My Tasks View** - Filtered task list with search and status filtering
- ✅ **Email Resend** - Users can resend verification emails

---

## Tech Stack

### Frontend Framework
- **React** 19.2.0 - UI library
- **React Router DOM** 7.13.0 - Client-side routing
- **Vite** 7.3.1 - Build tool and dev server

### State Management
- React Context API (AuthContext, TaskContext, ThemeContext)

### Backend/Authentication
- **Firebase** 12.9.0 - Authentication and real-time database

### Drag & Drop
- **@hello-pangea/dnd** 18.0.1 - Drag-and-drop functionality

### Animation
- **Framer Motion** 12.34.0 - Smooth animations

### Utilities
- **UUID** 13.0.0 - Unique ID generation

### Development Tools
- **ESLint** - Code quality and style checking
- **TypeScript Types** - Type safety support

---

## Project Structure

```
Task-Management-System/
├── public/                     # Static assets
├── src/
│   ├── App.jsx                # Main application component
│   ├── main.jsx               # Entry point
│   ├── App.css                # Main styles
│   ├── index.css              # Global styles
│   ├── firebase.js            # Firebase configuration
│   ├── assets/                # Images and media
│   ├── components/            # Reusable components
│   │   ├── Sidebar.jsx        # Navigation sidebar
│   │   └── KanbanBoard.jsx    # Kanban board component
│   ├── contexts/              # State management
│   │   ├── AuthContext.jsx    # Authentication state
│   │   ├── TaskContext.jsx    # Task state
│   │   └── ThemeContext.jsx   # Theme state
│   └── pages/                 # Page components
│       ├── AuthPage.jsx       # Login/Signup page
│       ├── Dashboard.jsx      # Kanban board view
│       ├── MyTasks.jsx        # Task list view
│       ├── Auth.css           # Auth page styles
│       └── DashboardLayout.css# Layout styles
├── .env.local                 # Environment variables
├── package.json               # Dependencies
├── vite.config.js             # Vite configuration
└── eslint.config.js           # ESLint configuration
```

---

## Architecture

### Data Flow

```
App.jsx (Root)
    ↓
Providers (AuthProvider → ThemeProvider → TaskProvider)
    ↓
Routes
    ├── /login → AuthPage (Login/Signup)
    ├── /dashboard → Dashboard (Kanban Board)
    └── /my-tasks → MyTasks (Task List)
```

### State Management Architecture

Three Context APIs manage the application state:

1. **AuthContext** - User authentication and profile
2. **TaskContext** - Task data and board structure
3. **ThemeContext** - Light/Dark theme preference

---

## Context Management

### AuthContext
**Location:** `src/contexts/AuthContext.jsx`

**Provides:**
- `currentUser` - Current logged-in user
- `login(email, password)` - Sign in user
- `signup(email, password, displayName)` - Create new account
- `logout()` - Sign out user
- `verifyEmail()` - Send verification email
- `authLoading` - Loading state during auth operations

**Usage:**
```javascript
const { currentUser, login, logout } = useAuth();
```

### TaskContext
**Location:** `src/contexts/TaskContext.jsx`

**Provides:**
- `data` - Current task board state with structure:
  - `tasks` - All tasks with their properties
  - `columns` - Board columns (To Do, In Progress, Done)
  - `columnOrder` - Order of columns

**Initial Data Structure:**
```javascript
{
  tasks: {
    'task-1': {
      id: 'task-1',
      content: 'Task name',
      priority: 'high|medium|low',
      dateAdded: ISO date string,
      dueDate: ISO date string,
      subtasks: [{ id, text, done }]
    }
  },
  columns: {
    'col-1': { id, title, taskIds: [] },
    'col-2': { id, title, taskIds: [] },
    'col-3': { id, title, taskIds: [] }
  },
  columnOrder: ['col-1', 'col-2', 'col-3']
}
```

**Usage:**
```javascript
const { data, setData } = useTask();
```

### ThemeContext
**Location:** `src/contexts/ThemeContext.jsx`

**Provides:**
- `theme` - Current theme ('light' or 'dark')
- `toggleTheme()` - Switch between themes

**Usage:**
```javascript
const { theme, toggleTheme } = useTheme();
```

---

## Pages

### AuthPage
**File:** `src/pages/AuthPage.jsx`

Handles user authentication with two views:
- **Login Mode** - Sign in with email and password
- **Signup Mode** - Create new account with email, password, and display name

**Features:**
- Form validation
- Error message display
- Toggle between login/signup
- Email verification requirement

---

### Dashboard
**File:** `src/pages/Dashboard.jsx`

Main application view with Kanban board interface.

**Features:**
- **Kanban Board** - Drag-and-drop task organization
- **Search Bar** - Find tasks by content
- **Notification Bell** - Shows overdue task count with dropdown
- **Email Verification Banner** - Alerts unverified users
- **Help Button** - Navigation helper
- **Overdue Task Notifications** - Real-time dropdown showing:
  - Count of overdue tasks
  - Task names
  - Due dates
  - Clickable tasks to navigate

---

### MyTasks
**File:** `src/pages/MyTasks.jsx`

Alternative view showing tasks in a filterable list format.

**Features:**
- **Task List** - All tasks displayed in rows
- **Search** - Filter tasks by content
- **Status Filter** - Filter by:
  - All tasks
  - To Do
  - In Progress
  - Completed
- **Task Details** - Shows:
  - Task content
  - Priority
  - Status
  - Due date
  - Subtask count
- **Notification Bell** - Same overdue task notifications as Dashboard

---

## Components

### Sidebar
**File:** `src/components/Sidebar.jsx`

Navigation and user profile component appearing on the left side.

**Features:**
- Brand/App name display
- Navigation links:
  - Dashboard
  - My Tasks
- User profile section:
  - Dynamic avatar (generated from username)
  - Display name
  - Email address
- Settings menu with:
  - Theme toggle (Dark/Light mode)
  - Logout button

**Icons Included:**
- GridIcon - Dashboard
- CheckIcon - My Tasks
- SettingsIcon - Menu toggle
- MoonIcon - Dark mode
- SunIcon - Light mode
- LogoutIcon - Logout button

---

### KanbanBoard
**File:** `src/components/KanbanBoard.jsx`

Interactive drag-and-drop Kanban board for task organization.

**Features:**
- Three columns: To Do, In Progress, Done
- Drag-and-drop task movement
- Real-time board updates
- Task card display with:
  - Task content
  - Priority color coding
  - Due date
  - Subtask progress
  - Subtask toggle functionality

---

## Getting Started

### Installation

1. **Clone the repository**
   ```bash
   cd Task-Management-System
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory with your Firebase configuration:
   ```
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

### Running the Application

**Development Server:**
```bash
npm run dev
```
Starts the Vite development server at `http://localhost:5173`

**Build for Production:**
```bash
npm run build
```
Creates an optimized production build in the `dist/` folder

**Preview Production Build:**
```bash
npm run preview
```
Serves the production build locally

**Lint Code:**
```bash
npm run lint
```
Checks code quality with ESLint

---

## Key Features Explained

### 1. Drag-and-Drop Kanban Board
- Uses `@hello-pangea/dnd` library for smooth drag-and-drop
- Tasks can be moved between three columns (To Do, In Progress, Done)
- State updates automatically in TaskContext
- Fully responsive and accessible

### 2. Overdue Task Notifications
- **Location:** Header top-right corner
- **How it works:**
  - Automatically detects tasks with due dates in the past
  - Excludes tasks in the "Done" column
  - Shows red badge with count
  - Dropdown displays all overdue tasks with due dates
  - Clicking a task navigates to My Tasks page

**Detection Logic:**
```javascript
const today = new Date();
const isOverdue = taskDueDate < today && taskIsNotInDoneColumn;
```

### 3. Dynamic User Avatars
- Uses **UI Avatars API** (`https://ui-avatars.com/`)
- Avatar changes based on user's display name
- Shows initials and background color
- Format: `https://ui-avatars.com/api/?name={username}&background=random`

### 4. Dark/Light Theme
- **Context Provider:** ThemeContext
- **CSS Variables:** Uses CSS custom properties for theming
- **Storage:** Theme preference persists in localStorage
- **Components:** All components use `var(--bg-color)`, `var(--text-color)`, etc.

**Available Theme Variables:**
```css
--bg-primary: Main background
--bg-secondary: Secondary background
--text-color: Primary text
--text-muted: Muted text
--border-color: Border color
--accent-color: Primary accent
```

### 5. Email Verification
- User must verify their email to fully use the app
- Verification banner appears at top of Dashboard and MyTasks
- Features:
  - "Resend Link" button - Send verification email again
  - "I've Verified It" button - Refresh and check verification status
  - Automatic dismissal after verification

### 6. Search and Filter
- **Dashboard:** Real-time task search
- **MyTasks:** 
  - Search by task content
  - Filter by status (All, To Do, In Progress, Done)
  - Combined search + filter functionality

### 7. Task Subtasks
- Each task can have multiple subtasks
- Subtasks have:
  - Unique ID
  - Text content
  - Done status
- Toggle subtasks on/off from task cards
- Subtask progress displayed on task cards

---

## Firebase Integration

The application uses Firebase for:
- **Authentication** - User registration and login
- **Email Verification** - Sending verification emails
- **User Management** - User profile and metadata storage

**Configuration File:** `src/firebase.js`

---

## Styling

### CSS Architecture
- **Global Styles:** `src/index.css` - CSS reset and variables
- **Component Styles:** `src/App.css` - Main component styles
- **Page Styles:**
  - `src/pages/Auth.css` - Authentication page
  - `src/pages/DashboardLayout.css` - Layout and dashboard styles

### Theme Variables
- Light mode and dark mode implemented via CSS variables
- Automatic switching based on ThemeContext
- Smooth transitions for theme changes

---

## Routing

The application uses React Router DOM with the following routes:

| Route | Component | Purpose |
|-------|-----------|---------|
| `/login` | AuthPage | User authentication |
| `/dashboard` | Dashboard | Kanban board view |
| `/my-tasks` | MyTasks | Task list view |
| `*` | Redirect to `/login` | Default redirect |

---

## Browser Compatibility

- Chrome/Edge 88+
- Firefox 85+
- Safari 14+
- Modern browsers with ES6+ support

---

## Performance Optimizations

1. **Vite HMR** - Fast module hot replacement during development
2. **Code Splitting** - Automatic route-based code splitting via React Router
3. **Lazy Loading** - Components load on demand
4. **Memoization** - `useMemo` hooks for expensive calculations (overdue task detection)
5. **CSS Variables** - Efficient theme switching without re-rendering

---

## Development Guidelines

### Code Style
- ESLint configuration provided
- React Hooks preferred over class components
- Functional components throughout
- Context API for state management

### Component Organization
- Separate presentation logic from business logic
- Props for component configuration
- Custom hooks for reusable logic

### File Naming
- PascalCase for component files
- camelCase for utility and context files
- Descriptive, clear names

---

## Troubleshooting

### Common Issues

**Issue: Firebase authentication not working**
- Verify `.env.local` has correct Firebase credentials
- Check Firebase project console for authentication enabled
- Ensure email/password sign-in method is enabled

**Issue: Tasks not persisting**
- Current version stores tasks in context (in-memory)
- Implement Firebase Firestore integration for persistence

**Issue: Theme not applying**
- Clear browser cache
- Check that ThemeProvider wraps all components

---

## Future Enhancements

Potential features for future versions:
- [ ] Firebase Firestore integration for task persistence
- [ ] Team collaboration and shared boards
- [ ] Task labels and tags
- [ ] Calendar view
- [ ] Task attachments
- [ ] Comments on tasks
- [ ] Activity history and audit logs
- [ ] Mobile app (React Native)
- [ ] Dark mode system preference detection
- [ ] Task templates
- [ ] Recurring tasks
- [ ] Time tracking

---

## License

Proprietary - All rights reserved

---

## Support

For issues and questions, please refer to the project documentation or contact the development team.

---

**Last Updated:** February 28, 2026  
**Version:** 1.0.0
