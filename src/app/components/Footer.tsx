import { motion } from 'motion/react';
import { FiMail, FiMapPin, FiGithub, FiLinkedin, FiInstagram } from 'react-icons/fi';
import { RiTwitterXLine } from 'react-icons/ri';
import { useData } from '../../contexts/DataContext';

export const Footer = () => {
  const { siteConfig } = useData();
  const currentYear = new Date().getFullYear();

  const handleSecretAdmin = () => {
    // Secret admin access - triple click on logo
    let clickCount = 0;
    return () => {
      clickCount++;
      if (clickCount === 3) {
        window.location.href = '/admin';
        clickCount = 0;
      }
      setTimeout(() => { clickCount = 0; }, 1000);
    };
  };

  const secretClick = handleSecretAdmin();

  return (
    <motion.footer
      className="footer glass-panel"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <div className="footer-container">
        <div className="footer-grid">
          {/* About Column */}
          <div className="footer-column">
            <h3 
              className="footer-title gradient-text" 
              onClick={secretClick}
              style={{ cursor: 'pointer' }}
            >
              Feel-Fly Technology
            </h3>
            <p className="footer-description">
              Designing, developing, and deploying scalable technology solutions that drive digital growth.
            </p>
          </div>

          {/* Quick Links Column */}
          <div className="footer-column">
            <h4 className="footer-subtitle">Quick Links</h4>
            <ul className="footer-links">
              <li><a href="/#about-section">About Us</a></li>
              <li><a href="/#team-section">Our Team</a></li>
              <li><a href="/#projects-section">Projects</a></li>
              <li><a href="/#contact-section">Contact</a></li>
            </ul>
          </div>

          {/* Services Column */}
          <div className="footer-column">
            <h4 className="footer-subtitle">Services</h4>
            <ul className="footer-links">
              <li>Software Development</li>
              <li>Automation & AI</li>
              <li>Digital Design</li>
              <li>Emerging Technologies</li>
            </ul>
          </div>

          {/* Contact Column */}
          <div className="footer-column">
            <h4 className="footer-subtitle">Contact</h4>
            <div className="footer-contact">
              <div className="footer-contact-item">
                <FiMail />
                <a href={`mailto:${siteConfig.contact.email}`}>
                  {siteConfig.contact.email}
                </a>
              </div>
              <div className="footer-contact-item">
                <FiMapPin />
                <span>{siteConfig.contact.address}</span>
              </div>
            </div>
            
            <div className="footer-socials">
              {siteConfig.social.github && (
                <a href={siteConfig.social.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                  <FiGithub />
                </a>
              )}
              {siteConfig.social.linkedin && (
                <a href={siteConfig.social.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                  <FiLinkedin />
                </a>
              )}
              {siteConfig.social.twitter && (
                <a href={siteConfig.social.twitter} target="_blank" rel="noopener noreferrer" aria-label="X">
                  <RiTwitterXLine />
                </a>
              )}
              {siteConfig.social.instagram && (
                <a href={siteConfig.social.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                  <FiInstagram />
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {currentYear} Feel-Fly Technology. All rights reserved.</p>
          <p className="footer-credits">Built with passion and innovation</p>
        </div>
      </div>
    </motion.footer>
  );
};
