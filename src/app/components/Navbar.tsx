import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { FiSun, FiMoon, FiHome, FiUsers, FiInfo, FiBriefcase, FiLogIn, FiLogOut, FiMenu, FiX } from 'react-icons/fi';
import { useTheme } from '../../contexts/ThemeContext';
import { auth } from '../../lib/firebase';
import { useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { useIsMobile } from './ui/use-mobile';

export const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const isActive = (path: string) => location.pathname === path;

  const scrollToSection = (sectionId: string) => {
    setIsMenuOpen(false); // Close menu on click
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
      setIsMenuOpen(false);
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const NavLinks = () => (
    <>
      <Link
        to="/"
        className={`nav-link ${isActive('/') ? 'active' : ''}`}
        onClick={() => setIsMenuOpen(false)}
      >
        <FiHome />
        <span>Home</span>
      </Link>
      
      <button
        onClick={() => scrollToSection('about-section')}
        className="nav-link nav-button"
      >
        <FiInfo />
        <span>About</span>
      </button>
      
      <button
        onClick={() => scrollToSection('projects-section')}
        className="nav-link nav-button"
      >
        <FiBriefcase />
        <span>Work</span>
      </button>
      
      <button
        onClick={() => scrollToSection('team-section')}
        className="nav-link nav-button"
      >
        <FiUsers />
        <span>Team</span>
      </button>

      {user ? (
        <button
          onClick={handleLogout}
          className="nav-link nav-button"
          title="Logout"
        >
          <FiLogOut />
          <span>Logout</span>
        </button>
      ) : (
        <Link
          to="/admin"
          className={`nav-link ${isActive('/admin') ? 'active' : ''}`}
          onClick={() => setIsMenuOpen(false)}
        >
          <FiLogIn />
          <span>Login</span>
        </Link>
      )}
    </>
  );

  return (
    <motion.nav
      className="navbar glass-panel"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" onClick={() => setIsMenuOpen(false)}>
          <span className="gradient-text">Feel-Fly</span>
          <span className="ml-2">Technology</span>
        </Link>

        {/* Desktop Navigation */}
        {!isMobile && (
          <div className="navbar-links">
            <NavLinks />
            <button
              onClick={toggleTheme}
              className="theme-toggle glass-button"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <FiMoon /> : <FiSun />}
            </button>
          </div>
        )}

        {/* Mobile Navigation Controls */}
        {isMobile && (
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <button
              onClick={toggleTheme}
              className="theme-toggle glass-button"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <FiMoon /> : <FiSun />}
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="mobile-menu-toggle"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <FiX /> : <FiMenu />}
            </button>
          </div>
        )}

        {/* Mobile Menu Dropdown */}
        <AnimatePresence>
          {isMobile && isMenuOpen && (
            <motion.div
              className="mobile-menu-content glass-panel"
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <NavLinks />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};