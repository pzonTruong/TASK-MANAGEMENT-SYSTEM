# Task Management System - Features & Tech Stack

## 🎯 **Key Features**
- **🔐 Secure Authentication**
  - Firebase email/password login & signup
  - Email verification with resend option
  - Dynamic user avatars from display names
- **📊 Kanban Board**
  - Drag-and-drop across 3 columns (To Do → In Progress → Done)
  - Real-time task movement & state updates
  - Priority badges (High/Medium/Low colors)
- **🔔 Smart Notifications**
  - Overdue task detection & red badge counter
  - Dropdown list with task names & due dates
  - Click-to-navigate to My Tasks
- **📝 Advanced Task Management**
  - Rich tasks with content, due dates, subtasks
  - Subtask toggles & progress tracking
  - Search & filter (content, status: All/To Do/In Progress/Done)
- **🎨 Theme System**
  - Dark/Light mode toggle with persistence
  - Smooth CSS variable transitions
  - Responsive sidebar with user profile
- **🤖 AI Assistant (Gemini Integration)**
  - Daily productivity tips from current tasks
  - Task priority analysis (High/Medium/Low)
  - Auto-generate 4-5 smart subtasks
  - Rate-limited (20 req/day) with 1hr caching
- **📱 Responsive Design**
  - Mobile-first layouts
  - Works on all devices
  - Fast Vite HMR development

## 🛠️ **Technology Stack**
- **Frontend Core**
  - **React 19.2** - Modern UI components & hooks
  - **React Router DOM 7.13** - SPA routing (/login, /dashboard, /my-tasks)
- **Build & Dev Tools**
  - **Vite 7.3** - Lightning-fast bundling & HMR
  - **ESLint 9** - Code quality & React hooks rules
- **State Management**
  - **React Context API** - 3 providers (Auth, Task, Theme)
- **Backend & Data**
  - **Firebase 12.9** - Auth, email verification (Firestore-ready)
  - **Google Gemini AI** - Task analysis & productivity tips
- **UI/UX Libraries**
  - **@hello-pangea/dnd 18** - Smooth drag-and-drop Kanban
  - **Framer Motion 12** - Micro-animations & transitions
  - **UUID 13** - Unique task IDs
- **Styling**
  - **CSS3 + Variables** - Themeable, performant styles
  - Custom properties for light/dark modes

## 🏗️ **Architecture Highlights**
```
App (Router + Providers)
├── AuthContext → Firebase Auth
├── TaskContext → Kanban state
├── ThemeContext → UI Theme
└── Pages: Auth | Dashboard | MyTasks
```

**Ready for production** with in-memory tasks (Firestore integration next)
