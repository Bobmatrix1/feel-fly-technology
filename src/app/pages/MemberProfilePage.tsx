import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { FiArrowLeft, FiGithub, FiLinkedin, FiGlobe, FiExternalLink } from 'react-icons/fi';
import { RiTwitterXLine } from 'react-icons/ri';
import { useData } from '../../contexts/DataContext';
import { useState, useEffect } from 'react';

export const MemberProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const { teamMembers } = useData();
  
  const member = teamMembers.find(m => m.id === id);

  if (!member) {
    return (
      <div className="page-container">
        <div className="error-container glass-panel">
          <h2>Member not found</h2>
          <button onClick={() => navigate('/')} className="glass-button">
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <motion.div
        className="member-profile"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* Back Button */}
        <motion.button
          className="back-button glass-button"
          onClick={() => navigate('/')}
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          whileHover={{ x: -5 }}
        >
          <FiArrowLeft /> Back to Team
        </motion.button>

        {/* Profile Header */}
        <motion.div
          className="profile-header glass-panel"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="profile-avatar-large">
            <img src={member.avatar} alt={member.name} />
          </div>
          <div className="profile-info">
            <h1 className="profile-name">{member.name}</h1>
            <p className="profile-role gradient-text">{member.role}</p>
            <p className="profile-bio">{member.bio}</p>
            
            <div className="profile-socials">
              {member.socials.github && (
                <a href={member.socials.github} target="_blank" rel="noopener noreferrer" className="social-link glass-button">
                  <FiGithub /> GitHub
                </a>
              )}
              {member.socials.linkedin && (
                <a href={member.socials.linkedin} target="_blank" rel="noopener noreferrer" className="social-link glass-button">
                  <FiLinkedin /> LinkedIn
                </a>
              )}
              {member.socials.portfolio && (
                <a href={member.socials.portfolio} target="_blank" rel="noopener noreferrer" className="social-link glass-button">
                  <FiGlobe /> Portfolio
                </a>
              )}
              {member.socials.twitter && (
                <a href={member.socials.twitter} target="_blank" rel="noopener noreferrer" className="social-link glass-button">
                  <RiTwitterXLine /> Twitter
                </a>
              )}
            </div>
          </div>
        </motion.div>

        {/* Projects Section */}
        {member.projects && member.projects.length > 0 && (
          <motion.div
            className="profile-section"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="section-title">Projects</h2>
            <div className="projects-grid">
              {member.projects.map((project, index) => (
                <motion.div
                  key={index}
                  className="project-card glass-panel"
                  whileHover={{ scale: 1.02 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                >
                  <div className="project-image">
                    <img src={project.image} alt={project.title} />
                  </div>
                  <div className="project-content">
                    <h3>{project.title}</h3>
                    <p>{project.description}</p>
                    {project.link && (
                      <a 
                        href={project.link} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="project-link glass-button"
                      >
                        View Work <FiExternalLink />
                      </a>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Gallery Section */}
        {member.gallery && member.gallery.length > 0 && (
          <motion.div
            className="profile-section"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <h2 className="section-title">Gallery</h2>
            <div className="gallery-grid">
              {member.gallery.map((image, index) => (
                <motion.div
                  key={index}
                  className="gallery-item"
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setSelectedImage(image)}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                >
                  <img src={image} alt={`Gallery ${index + 1}`} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Lightbox */}
        {selectedImage && (
          <motion.div
            className="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              className="lightbox-content"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              onClick={(e) => e.stopPropagation()}
            >
              <img src={selectedImage} alt="Enlarged view" />
              <button className="lightbox-close glass-button" onClick={() => setSelectedImage(null)}>
                ✕
              </button>
            </motion.div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};