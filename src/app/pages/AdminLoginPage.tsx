import { useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiUserPlus, FiLogIn } from 'react-icons/fi';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../lib/firebase';

export const AdminLoginPage = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let user;
      if (isRegistering) {
        // Registration Flow
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        user = userCredential.user;

        // Create user document (Default: NOT admin)
        await setDoc(doc(db, 'users', user.uid), {
          email: user.email,
          isAdmin: false, 
          createdAt: new Date().toISOString()
        });
      } else {
        // Login Flow
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        user = userCredential.user;
      }

      // Check role and redirect
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      
      if (userDoc.exists() && userDoc.data().isAdmin) {
        navigate('/admin/dashboard');
      } else {
        // Normal user redirect
        navigate('/'); 
      }

    } catch (err: any) {
      console.error('Auth error:', err);
      if (err.code === 'auth/email-already-in-use') {
        setError('Email already in use. Please login instead.');
      } else if (err.code === 'auth/wrong-password') {
        setError('Invalid password.');
      } else if (err.code === 'auth/user-not-found') {
        setError('No account found with this email.');
      } else {
        setError(err.message || 'Authentication failed.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container login-page">
      <motion.div
        className="login-container"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="login-card glass-panel">
          <motion.div
            className="login-header"
            key={isRegistering ? 'register' : 'login'}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="gradient-text">{isRegistering ? 'Create Account' : 'Welcome Back'}</h1>
            <p>{isRegistering ? 'Join Feel-Fly Technology' : 'Login to your account'}</p>
          </motion.div>

          <form onSubmit={handleAuth} className="login-form">
            {error && (
              <motion.div
                className="error-message"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {error}
              </motion.div>
            )}

            <div className="form-group">
              <label htmlFor="email">
                <FiMail /> Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="glass-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">
                <FiLock /> Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
                minLength={6}
                className="glass-input"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="submit-button glass-button"
            >
              {loading ? 'Processing...' : (isRegistering ? 'Sign Up' : 'Login')}
            </button>
          </form>

          <div className="login-footer">
            <button 
              onClick={() => {
                setIsRegistering(!isRegistering);
                setError('');
              }} 
              className="auth-toggle"
            >
              {isRegistering 
                ? 'Already have an account? Login' 
                : 'Need an account? Register'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
