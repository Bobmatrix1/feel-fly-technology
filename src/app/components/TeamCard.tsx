import { useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { FiGithub, FiLinkedin, FiGlobe, FiRotateCw } from 'react-icons/fi';
import { RiTwitterXLine } from 'react-icons/ri';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  avatar: string;
  socials: {
    github?: string;
    linkedin?: string;
    portfolio?: string;
    twitter?: string;
  };
}

export const TeamCard = ({ member }: { member: TeamMember }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const navigate = useNavigate();

  const handleFlip = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFlipped(!isFlipped);
  };

  const handleCardClick = () => {
    if (!isFlipped) {
      navigate(`/member/${member.id}`);
    }
  };

  const handleSocialClick = (e: React.MouseEvent, url: string) => {
    e.stopPropagation();
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <motion.div
      className="team-card-container"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.3 }}
    >
      <div className={`team-card ${isFlipped ? 'flipped' : ''}`}>
        {/* Front of Card */}
        <div className="card-face card-front" onClick={handleCardClick}>
          <button
            className="flip-button"
            onClick={handleFlip}
            aria-label="Flip card"
          >
            <FiRotateCw />
          </button>
          <div className="card-avatar">
            <img src={member.avatar} alt={member.name} />
          </div>
          <h3 className="card-name">{member.name}</h3>
          <p className="card-role gradient-text">{member.role}</p>
        </div>

        {/* Back of Card */}
        <div 
          className="card-face card-back" 
          onClick={handleCardClick}
          style={{ backgroundImage: `url(${member.avatar})` }}
        >
          <button
            className="flip-button"
            onClick={handleFlip}
            aria-label="Flip card back"
          >
            <FiRotateCw />
          </button>
          <div className="card-back-overlay">
            <h3 className="card-back-name">{member.name}</h3>
            <p className="card-back-role gradient-text">{member.role}</p>
            <p className="card-back-bio">{member.bio}</p>
            <div className="card-back-socials">
              {member.socials.github && (
                <button
                  onClick={(e) => handleSocialClick(e, member.socials.github!)}
                  className="social-icon-button"
                  aria-label="GitHub"
                >
                  <FiGithub />
                </button>
              )}
              {member.socials.linkedin && (
                <button
                  onClick={(e) => handleSocialClick(e, member.socials.linkedin!)}
                  className="social-icon-button"
                  aria-label="LinkedIn"
                >
                  <FiLinkedin />
                </button>
              )}
              {member.socials.twitter && (
                <button
                  onClick={(e) => handleSocialClick(e, member.socials.twitter!)}
                  className="social-icon-button"
                  aria-label="X (Twitter)"
                >
                  <RiTwitterXLine />
                </button>
              )}
              {member.socials.portfolio && (
                <button
                  onClick={(e) => handleSocialClick(e, member.socials.portfolio!)}
                  className="social-icon-button"
                  aria-label="Portfolio"
                >
                  <FiGlobe />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
