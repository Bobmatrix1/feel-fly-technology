import { motion, AnimatePresence } from 'motion/react';
import { useEffect, useState } from 'react';
import { useData } from '../../contexts/DataContext';

export const SplashScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [show, setShow] = useState(true);
  const { siteConfig, loading } = useData();

  useEffect(() => {
    // Only start the exit timer once data is loaded
    if (!loading) {
      const timer = setTimeout(() => {
        setShow(false);
        setTimeout(onComplete, 500);
      }, 2500); // 2.5s show time after data is ready

      return () => clearTimeout(timer);
    }
  }, [onComplete, loading]);

  if (!show) {
    return (
      <motion.div
        className="splash-screen"
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      />
    );
  }

  return (
    <motion.div
      className="splash-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div 
            key="loader"
            className="flex flex-col items-center gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="w-12 h-12 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin"></div>
            <p className="text-xs uppercase tracking-[0.3em] opacity-40 text-[var(--text-primary)]">Feel-Fly Technology</p>
          </motion.div>
        ) : (
          <motion.div
            key="content"
            className="splash-content"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <motion.img 
              src={siteConfig.splash?.image || "/splash-image.jpeg"} 
              alt="Logo" 
              className="splash-logo"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            />

            <motion.h1
              className="splash-title"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              {siteConfig.splash?.title || siteConfig.title}
            </motion.h1>
            
            <motion.div
              className="splash-tagline"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.6 }}
            >
              {siteConfig.splash?.tagline || "Designing Your Digital Future"}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
