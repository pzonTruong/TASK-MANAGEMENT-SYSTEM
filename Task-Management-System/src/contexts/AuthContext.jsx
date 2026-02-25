import React, { useContext, useState, useEffect } from "react";
import { auth } from "../firebase";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  sendEmailVerification
} from "firebase/auth";

const AuthContext = React.createContext();

// Custom hook to use the auth context
export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Signup function
  function signup(email, password) {
    return createUserWithEmailAndPassword(auth, email, password); // fire base auth
  }

  // Login function
  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  // Logout function
  function logout() {
    return signOut(auth);
  }

  function verifyEmail(user) { // <--- Accept 'user' as an argument
  // If a user is passed, use it. Otherwise, try the current state.
  const targetUser = user || currentUser || auth.currentUser;
  
  if (targetUser) {
    return sendEmailVerification(targetUser);
  } else {
    console.error("No user found to send verification email to.");
    return Promise.reject("No user found");
  }
}

  // Subscribe to user state changes (Observer Pattern)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false); // Done loading
    });

    return unsubscribe; // Cleanup subscription on unmount
  }, []);

  const value = {
    currentUser,
    signup,
    login,
    logout,
    verifyEmail
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}