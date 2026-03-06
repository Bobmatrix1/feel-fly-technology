import { motion } from 'motion/react';
import { TeamCard } from '../components/TeamCard';
import { Footer } from '../components/Footer';
import { useData, getIcon } from '../../contexts/DataContext';
import { 
  FiMail, 
  FiMapPin, 
  FiGithub, 
  FiLinkedin, 
  FiInstagram, 
  FiExternalLink, 
  FiPhone, 
  FiFacebook, 
  FiYoutube 
} from 'react-icons/fi';
import { RiTwitterXLine } from 'react-icons/ri';

const IconMap: Record<string, any> = {
  FiMail,
  FiMapPin,
  FiGithub,
  FiLinkedin,
  FiInstagram,
  FiExternalLink,
  FiPhone,
  FiFacebook,
  FiYoutube,
  RiTwitterXLine
};

const DynamicIcon = ({ name, className }: { name: string, className?: string }) => {
  const IconComponent = IconMap[name] || FiExternalLink;
  return <IconComponent className={className} />;
};

export const HomePage = () => {
  const { siteConfig, teamMembers, companyProjects } = useData();

  const renderContactValue = (item: any) => {
    if (item.type === 'email') return <a href={`mailto:${item.value}`}>{item.value}</a>;
    if (item.type === 'phone') return <a href={`tel:${item.value}`}>{item.value}</a>;
    return <span>{item.value}</span>;
  };

  return (
    <div className="page-container">
      {/* Hero Section */}
      <motion.section
        className="hero-section"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="hero-content glass-panel">
          <motion.h1
            className="hero-title gradient-text"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            {siteConfig.title}
          </motion.h1>
          
          <motion.p
            className="hero-subtitle"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            Designing, Developing & Deploying Scalable Technology Solutions
          </motion.p>

          <motion.p
            className="hero-mission"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            {siteConfig.mission}
          </motion.p>

          <motion.div
            className="hero-cta"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <a href="#contact-section" className="cta-button glass-button">
              Get In Touch
            </a>
          </motion.div>
        </div>
      </motion.section>

      {/* About Section */}
      <motion.section
        id="about-section"
        className="about-section"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="section-container glass-panel">
          <h2 className="section-title">About Us</h2>
          <p className="section-text">{siteConfig.about}</p>
          
          <div className="services-grid">
            <div className="service-card glass-panel">
              <h3>Software Development</h3>
              <p>Custom web & mobile applications, API development, and system integrations</p>
            </div>
            <div className="service-card glass-panel">
              <h3>Automation & AI</h3>
              <p>Business process automation, AI-powered tools, and intelligent systems</p>
            </div>
            <div className="service-card glass-panel">
              <h3>Digital Design</h3>
              <p>UI/UX design, brand identity, and product interface prototyping</p>
            </div>
            <div className="service-card glass-panel">
              <h3>Emerging Technologies</h3>
              <p>Web3, blockchain solutions, and secure digital identity systems</p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Projects/Portfolio Section */}
      <motion.section
        id="projects-section"
        className="projects-section"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="section-container">
          <h2 className="section-title">Our Work</h2>
          <p className="section-subtitle">Showcasing innovation through our latest projects</p>
          
          <div className="portfolio-grid">
            {companyProjects.map((project, index) => (
              <motion.div
                key={index}
                className="portfolio-item glass-panel"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="portfolio-media">
                  {project.type === 'video' ? (
                    <video
                      src={project.media}
                      poster={project.thumbnail}
                      controls
                      className="portfolio-video"
                    />
                  ) : (
                    <img src={project.media} alt={project.title} />
                  )}
                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="portfolio-link-button glass-button"
                      onClick={(e) => e.stopPropagation()}
                    >
                      View Project →
                    </a>
                  )}
                </div>
                <div className="portfolio-content">
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                  <div className="portfolio-tags">
                    {project.tags.map((tag, i) => (
                      <span key={i} className="tag">{tag}</span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Team Section */}
      <motion.section
        id="team-section"
        className="team-section"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="section-container">
          <h2 className="section-title">Our Team</h2>
          <p className="section-subtitle">Meet the talented individuals building your digital future</p>
          
          <div className="team-grid">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
              >
                <TeamCard member={member} />
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Contact Section */}
      <motion.section
        id="contact-section"
        className="contact-section"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="section-container glass-panel">
          <h2 className="section-title">Get In Touch</h2>
          <div className="contact-info">
            {Array.isArray(siteConfig.contact) && siteConfig.contact.map((item) => (
              <div key={item.id} className="contact-item">
                <DynamicIcon name={getIcon(item.label)} className="contact-icon" />
                {renderContactValue(item)}
              </div>
            ))}
          </div>

          <div className="social-links">
            {Array.isArray(siteConfig.social) && siteConfig.social.map((item) => (
              <a key={item.id} href={item.url} target="_blank" rel="noopener noreferrer">
                <DynamicIcon name={getIcon(item.label)} /> {item.label}
              </a>
            ))}
          </div>
        </div>
      </motion.section>

      <Footer />
    </div>
  );
};