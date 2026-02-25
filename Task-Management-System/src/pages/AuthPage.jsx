import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Auth.css';


// SVG Icons
const MailIcon = () => (
    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
);
const LockIcon = () => (
    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
);
const UserIcon = () => (
    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
);
const GoogleIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>
);

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);

    // Form State
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Context - Destructure verifyEmail here
    const { signup, login, currentUser, verifyEmail } = useAuth();
    const navigate = useNavigate();

    // Auto-redirect if already logged in
    useEffect(() => {
        if (currentUser) {
            navigate('/Dashboard');
        }   
    }, [currentUser, navigate]);

    // Toggle Function
    const toggleAuthMode = () => {
        setIsLogin(!isLogin);
        setError(''); 
    };

    async function handleSubmit(e) {
        e.preventDefault();

        // Validation
        if (!email || !password) {
            return setError("Please fill in all fields");
        }
        if (!isLogin && !name) {
            return setError("Please enter your name");
        }

        try {
            setError('');
            setLoading(true);

            if (isLogin) {
                // --- LOGIN FLOW ---
                await login(email, password);
                navigate('/Dashboard');
            } else {
                // --- SIGNUP FLOW ---
                // 1. Create the account
                await signup(email, password);

                // 2. Send Verification Email
                try {
                    await verifyEmail();
                    // Alert user to check their inbox
                    alert("Account created successfully! A verification link has been sent to your email address. Please check your inbox.");
                } catch (emailError) {
                    console.error("Failed to send verification email", emailError);
                    // Don't block the user if email fails, just log it. 
                    // They can resend it from the dashboard later.
                }
                
                // 3. Navigate
                navigate('/Dashboard');
            }

        } catch (err) {
            console.error(err);
            // Error mapping
            if (err.code === 'auth/wrong-password') setError("Incorrect password.");
            else if (err.code === 'auth/user-not-found') setError("No account found with this email.");
            else if (err.code === 'auth/email-already-in-use') setError("Email is already registered.");
            else if (err.code === 'auth/weak-password') setError("Password must be at least 6 characters.");
            else setError("Failed to authenticate. Please check your details.");
        }

        setLoading(false);
    }

    return (
        <div className="auth-container">
            {/* --- Left Side: Form --- */}
            <div className="auth-left">
                <div className="brand-logo">
                    {/* <div className="logo-icon">✓</div> */}
                    <span>Task Management System</span>
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={isLogin ? "login" : "signup"}
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -10, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        style={{ width: '100%' }}
                    >
                        <div className="auth-header">
                            <h1>{isLogin ? 'Welcome back' : 'Create an account'}</h1>
                            <p>
                                {isLogin
                                    ? 'Please enter your details to sign in.'
                                    : 'Enter your details below to create your account.'}
                            </p>
                        </div>

                        {/* Error Message Display */}
                        {error && (
                            <div style={{ 
                                color: '#ef4444', 
                                background: '#fef2f2', 
                                padding: '10px', 
                                borderRadius: '6px', 
                                marginBottom: '16px',
                                fontSize: '0.9rem' 
                            }}>
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            {/* Name Field (Signup only) */}
                            {!isLogin && (
                                <div className="form-group">
                                    <label>Full Name</label>
                                    <div className="input-wrapper">
                                        <input 
                                            type="text" 
                                            placeholder="John Doe" 
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                        />
                                        <div className="input-icon"><UserIcon /></div>
                                    </div>
                                </div>
                            )}

                            <div className="form-group">
                                <label>Email address</label>
                                <div className="input-wrapper">
                                    <input 
                                        type="email" 
                                        placeholder="name@company.com" 
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                    <div className="input-icon"><MailIcon /></div>
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Password</label>
                                <div className="input-wrapper">
                                    <input 
                                        type="password" 
                                        placeholder="••••••••" 
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <div className="input-icon"><LockIcon /></div>
                                </div>
                            </div>

                            <div className="form-actions">
                                <label className="checkbox-container">
                                    <input type="checkbox" />
                                    {isLogin ? 'Remember me' : 'I agree to Terms'}
                                </label>
                                {isLogin && (
                                    <a href="#" className="forgot-password">Forgot password?</a>
                                )}
                            </div>

                            <button type="submit" className="btn-primary" disabled={loading}>
                                {loading ? 'Processing...' : (isLogin ? 'Log In' : 'Sign Up')}
                            </button>
                        </form>
                    </motion.div>
                </AnimatePresence>

                <div className="divider">
                    <span>Or continue with</span>
                </div>

                <div className="social-buttons">
                    <button className="btn-social">
                        <GoogleIcon /> Google
                    </button>
                </div>

                <div className="auth-footer">
                    {isLogin ? (
                        <p>Don't have an account? <a onClick={toggleAuthMode}>Sign up</a></p>
                    ) : (
                        <p>Already have an account? <a onClick={toggleAuthMode}>Log in</a></p>
                    )}
                </div>
            </div>

            {/* --- Right Side: Visuals --- */}
            <div className="auth-right">
                <div className="dashboard-preview">
                    <div className="card-header"></div>
                    <div className="card-body-row">
                        <div className="card-block"></div>
                        <div className="card-block"></div>
                    </div>
                    <div className="card-footer"></div>

                    <div className="floating-icon icon-1">
                        <span style={{ color: '#10b981', fontSize: '24px' }}>✔</span>
                    </div>
                    <div className="floating-icon icon-2">
                        <span style={{ color: '#4f46e5', fontSize: '24px' }}>⚡</span>
                    </div>
                </div>

                <div className="hero-text">
                    <h2>Master your workflow.</h2>
                    <p>Streamline tasks, collaborate with your team, and hit every deadline with ease. The modern way to manage productivity.</p>

                    <div className="social-proof">
                        <div className="avatars">
                            <div className="avatar" style={{ background: '#f87171' }}></div>
                            <div className="avatar" style={{ background: '#60a5fa' }}></div>
                            <div className="avatar" style={{ background: '#fbbf24' }}></div>
                        </div>
                        <div className="rating-info">
                            <div className="stars">★★★★★</div>
                            <div className="rating-text">Loved by 10,000+ teams</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}