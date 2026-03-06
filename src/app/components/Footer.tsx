import { motion } from 'motion/react';
import { 
  FiMail, 
  FiMapPin, 
  FiGithub, 
  FiLinkedin, 
  FiInstagram, 
  FiPhone, 
  FiFacebook, 
  FiYoutube,
  FiExternalLink
} from 'react-icons/fi';
import { RiTwitterXLine } from 'react-icons/ri';
import { useData, getIcon } from '../../contexts/DataContext';

const IconMap: Record<string, any> = {
  FiMail,
  FiMapPin,
  FiGithub,
  FiLinkedin,
  FiInstagram,
  FiPhone,
  FiFacebook,
  FiYoutube,
  RiTwitterXLine,
  FiExternalLink
};

const DynamicIcon = ({ name }: { name: string }) => {
  const IconComponent = IconMap[name] || FiExternalLink;
  return <IconComponent />;
};

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
              {Array.isArray(siteConfig.contact) && siteConfig.contact.map((item) => (
                <div key={item.id} className="footer-contact-item">
                  <DynamicIcon name={getIcon(item.label)} />
                  {item.type === 'email' ? (
                    <a href={`mailto:${item.value}`}>{item.value}</a>
                  ) : item.type === 'phone' ? (
                    <a href={`tel:${item.value}`}>{item.value}</a>
                  ) : (
                    <span>{item.value}</span>
                  )}
                </div>
              ))}
            </div>
            
            <div className="footer-socials">
              {Array.isArray(siteConfig.social) && siteConfig.social.map((item) => (
                <a key={item.id} href={item.url} target="_blank" rel="noopener noreferrer" aria-label={item.label}>
                  <DynamicIcon name={getIcon(item.label)} />
                </a>
              ))}
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