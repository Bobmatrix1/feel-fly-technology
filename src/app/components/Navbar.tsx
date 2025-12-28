import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { FiSun, FiMoon, FiHome, FiUsers, FiInfo, FiBriefcase, FiLogIn, FiLogOut, FiUser } from 'react-icons/fi';
import { useTheme } from '../../contexts/ThemeContext';
import { auth } from '../../lib/firebase';
import { useEffect, useState } from 'react';
import { User } from 'firebase/auth';

export const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const isActive = (path: string) => location.pathname === path;

  const scrollToSection = (sectionId: string) => {
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <motion.nav
      className="navbar glass-panel"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="gradient-text">Feel-Fly</span>
          <span className="ml-2">Technology</span>
        </Link>

        <div className="navbar-links">
          <Link
            to="/"
            className={`nav-link ${isActive('/') ? 'active' : ''}`}
          >
            <FiHome />
            <span className="hidden sm:inline">Home</span>
          </Link>
          
          <button
            onClick={() => scrollToSection('about-section')}
            className="nav-link nav-button"
          >
            <FiInfo />
            <span className="hidden sm:inline">About</span>
          </button>
          
          <button
            onClick={() => scrollToSection('projects-section')}
            className="nav-link nav-button"
          >
            <FiBriefcase />
            <span className="hidden sm:inline">Work</span>
          </button>
          
          <button
            onClick={() => scrollToSection('team-section')}
            className="nav-link nav-button"
          >
            <FiUsers />
            <span className="hidden sm:inline">Team</span>
          </button>

          {user ? (
            <button
              onClick={handleLogout}
              className="nav-link nav-button"
              title="Logout"
            >
              <FiLogOut />
              <span className="hidden sm:inline">Logout</span>
            </button>
          ) : (
            <Link
              to="/admin"
              className={`nav-link ${isActive('/admin') ? 'active' : ''}`}
            >
              <FiLogIn />
              <span className="hidden sm:inline">Login</span>
            </Link>
          )}
          
          <button
            onClick={toggleTheme}
            className="theme-toggle glass-button"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? <FiMoon /> : <FiSun />}
          </button>
        </div>
      </div>
    </motion.nav>
  );
};