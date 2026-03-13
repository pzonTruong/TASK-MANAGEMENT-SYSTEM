# TODO.md - Fix Initial Dashboard Load for Unauthenticated Users

## Plan Breakdown & Progress Tracking

### 1. ✅ Create this TODO.md file

### 2. ✅ Edit AuthContext.jsx
   - Add `loading` to context `value`
   - Update Provider to expose it via `useAuth()`

### 3. ✅ Edit App.jsx
   - Import `useAuth` 
   - Add `ProtectedRoute` component
   - Wrap protected routes with `<ProtectedRoute>`
   - Change catch-all redirect to `/login`
   - Use `useAuth()` for loading check at app level
   - Remove redundant `AuthProvider` wrapper

### 4. ✅ Test changes
   - Ran `npm run dev` (server at http://localhost:5173/)
   - Initial load shows loading spinner, then redirects unauth users to /login
   - Protected routes (/dashboard, /board, /my-tasks) now redirect unauth users to /login
   - Catch-all redirects to /login instead of dashboard
   - Auth flow intact: login → dashboard

### 5. ✅ Complete task
