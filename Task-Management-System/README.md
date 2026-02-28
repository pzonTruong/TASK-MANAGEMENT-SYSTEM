# Task Management System

A modern, feature-rich web application for organizing and managing tasks with a Kanban-style board interface, user authentication, and real-time notifications.

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn
- Firebase account

### Installation

1. **Clone and setup**
   ```bash
   cd Task-Management-System
   npm install
   ```

2. **Configure Firebase**
   Create `.env.local` with your Firebase credentials:
   ```
   VITE_FIREBASE_API_KEY=your_key
   VITE_FIREBASE_AUTH_DOMAIN=your_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

3. **Run development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173)

## ✨ Features

- 🔐 **User Authentication** - Firebase sign up/login with email verification
- 📊 **Kanban Board** - Drag-and-drop task management (To Do → In Progress → Done)
- 🔔 **Smart Notifications** - Real-time overdue task alerts with badge and dropdown
- 🎨 **Dark/Light Theme** - Toggle between themes with persistent preferences
- 👤 **Dynamic Avatars** - User avatars auto-generated from display names
- 📝 **Task Management** - Full task lifecycle with priorities, due dates, and subtasks
- 🔍 **Search & Filter** - Find and filter tasks by content and status
- 📱 **Responsive Design** - Works seamlessly on all devices

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Sidebar.jsx     # Navigation sidebar
│   └── KanbanBoard.jsx # Drag-and-drop board
├── pages/              # Page components
│   ├── AuthPage.jsx    # Login/Signup
│   ├── Dashboard.jsx   # Kanban view
│   └── MyTasks.jsx     # Task list view
├── contexts/           # State management
│   ├── AuthContext.jsx
│   ├── TaskContext.jsx
│   └── ThemeContext.jsx
└── firebase.js         # Firebase config
```

## 🏗️ Architecture

**State Management:** React Context API
- `AuthContext` - User authentication state
- `TaskContext` - Task board and data state
- `ThemeContext` - Light/dark theme preference

**Routing:** React Router DOM
- `/login` - Authentication page
- `/dashboard` - Kanban board view
- `/my-tasks` - Task list view

## 📚 Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Check code quality
```

## 🛠️ Tech Stack

- **Frontend:** React 19.2, Vite 7.3
- **Routing:** React Router DOM 7.13
- **State:** Context API
- **Auth:** Firebase 12.9
- **Drag-Drop:** @hello-pangea/dnd 18.0
- **Animation:** Framer Motion 12.34
- **Styling:** CSS with CSS Variables

## 🎯 Key Features Explained

### Overdue Task Notifications
- Automatic detection of overdue tasks (past due date, not completed)
- Red badge showing count of overdue tasks
- Expandable dropdown with task details
- One-click navigation to task details

### Dynamic User Avatars
- Avatars auto-generated from user's display name
- Uses UI Avatars API with random background colors
- Updates whenever user profile changes

### Task Subtasks
- Break down tasks into smaller subtasks
- Track completion progress
- Toggle individual subtask status

### Theme System
- CSS Variables for efficient theme switching
- Light and dark mode support
- Persistent theme preference

## 📖 Full Documentation

See [DOCUMENTATION.md](./DOCUMENTATION.md) for comprehensive project documentation including:
- Detailed architecture overview
- Complete API reference
- Context management guide
- Component documentation
- Development guidelines
- Troubleshooting guide

## 🚧 In-Memory Data Storage

Currently, tasks are stored in React Context (in-memory). For production use with data persistence, integrate Firebase Firestore.

## 🔮 Future Enhancements

- Firestore integration for data persistence
- Team collaboration features
- Task labels and tags
- Calendar view
- Task attachments
- Activity history
- Mobile app (React Native)

## 📝 License

Proprietary - All rights reserved

## 👨‍💻 Development

Built with ❤️ using React, Vite, and Firebase

---

**Last Updated:** February 28, 2026
