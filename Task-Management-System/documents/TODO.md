# TODO.md - Fix Initial Dashboard + Refresh Error

## Previous Fixes ✅
1. Exposed `loading` from AuthContext
2. Added ProtectedRoute, changed redirects in App.jsx

## New Issue Fix (Refresh Error)
### 6. [⬜] Restructure App.jsx
   - Move useAuth() calls inside provider tree
   - Create AppContent component with Router/ProtectedRoutes
   - App(): Just providers (no useAuth at top-level)

### 7. [⬜] Test refresh
   - Refresh /dashboard, /login → no errors, proper redirects

### 8. [⬜] Complete
