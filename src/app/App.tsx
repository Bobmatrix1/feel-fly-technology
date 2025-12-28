import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from '../contexts/ThemeContext';
import { DataProvider } from '../contexts/DataContext';
import { ParticleBackground } from './components/ParticleBackground';
import { SplashScreen } from './components/SplashScreen';
import { Navbar } from './components/Navbar';
import { HomePage } from './pages/HomePage';
import { MemberProfilePage } from './pages/MemberProfilePage';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import '../styles/glassmorphism.css';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  return (
    <ThemeProvider>
      <DataProvider>
        {showSplash ? (
          <SplashScreen onComplete={handleSplashComplete} />
        ) : (
          <BrowserRouter>
            <ScrollToTop />
            <ParticleBackground />
            <Navbar />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/member/:id" element={<MemberProfilePage />} />
              <Route path="/admin" element={<AdminLoginPage />} />
              <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
            </Routes>
          </BrowserRouter>
        )}
      </DataProvider>
    </ThemeProvider>
  );
}
