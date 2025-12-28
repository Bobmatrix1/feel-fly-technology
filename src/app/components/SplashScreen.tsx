import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { useData } from '../../contexts/DataContext';

export const SplashScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [show, setShow] = useState(true);
  const { siteConfig } = useData();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
      setTimeout(onComplete, 500);
    }, 3000); // Increased slightly for better visual impact

    return () => clearTimeout(timer);
  }, [onComplete]);

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
      <motion.div
        className="splash-content"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* LOGO IMAGE - Uses local image from public folder */}
        <motion.img 
          src={siteConfig.splash?.image || "/splash-image.jpeg"} 
          alt="Logo" 
          className="splash-logo"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        />

        {/* ALTERNATIVE: VIDEO - Uncomment below to use a video instead of image */}
        {/* 
        <video 
          src="YOUR_VIDEO_URL" 
          autoPlay muted loop playsInline 
          className="splash-video"
        /> 
        */}

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
    </motion.div>
  );
};
