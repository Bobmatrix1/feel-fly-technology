import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { FiLogOut, FiPlus, FiTrash, FiSave, FiImage, FiUpload, FiX, FiLink } from 'react-icons/fi';
import { signOut } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { useData } from '../../contexts/DataContext';

const CLOUDINARY_CLOUD_NAME = 'djllkcgzv';
const CLOUDINARY_UPLOAD_PRESET = 'feel-fly technology';

export const AdminDashboardPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'site' | 'team' | 'projects'>('site');
  const [saving, setSaving] = useState(false);
  const [uploadingField, setUploadingField] = useState<string | null>(null);
  
  const { 
    siteConfig, 
    teamMembers: members, 
    companyProjects: projects,
    updateSiteConfig,
    addTeamMember: contextAddMember,
    updateTeamMember: contextUpdateMember,
    removeTeamMember: contextRemoveMember,
    addProject: contextAddProject,
    updateProject: contextUpdateProject,
    removeProject: contextRemoveProject
  } = useData();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        navigate('/admin');
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleImageUpload = async (file: File, callback: (url: string) => void, fieldId: string) => {
    setUploadingField(fieldId);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

    try {
      const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (data.secure_url) {
        callback(data.secure_url);
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('Cloudinary error:', error);
      alert('Failed to upload image');
    } finally {
      setUploadingField(null);
    }
  };

  const ImageUploadInput = ({ label, value, onUpdate, id }: { label: string, value: string, onUpdate: (val: string) => void, id: string }) => (
    <div className="form-group">
      <label>{label}</label>
      <div className="upload-input-group">
        <input
          type="url"
          value={value}
          onChange={(e) => onUpdate(e.target.value)}
          className="glass-input"
          placeholder="https://..."
        />
        <label className={`upload-btn glass-button ${uploadingField === id ? 'uploading' : ''}`} title="Upload Image">
          {uploadingField === id ? '...' : <FiUpload />}
          <input 
            type="file" 
            accept="image/*" 
            onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], onUpdate, id)} 
            hidden 
          />
        </label>
        {value && (
          <button 
            type="button" 
            className="remove-img-btn glass-button" 
            onClick={() => onUpdate('')}
            title="Remove Image"
          >
            <FiTrash />
          </button>
        )}
      </div>
    </div>
  );

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      alert('All changes are synced to Firebase!');
    }, 500);
  };

  // Team Member Actions
  const addTeamMember = async () => {
    await contextAddMember({
      id: '',
      name: 'New Member',
      role: 'Team Member',
      bio: 'Bio goes here',
      avatar: 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=400&h=400&fit=crop',
      socials: {},
      projects: [],
      gallery: []
    });
  };

  const removeMember = async (id: string) => {
    if (confirm('Are you sure you want to remove this member?')) {
      await contextRemoveMember(id);
    }
  };

  const updateMember = async (id: string, field: string, value: any) => {
    await contextUpdateMember(id, { [field]: value });
  };

  // Company Project Actions
  const addProject = async () => {
    await contextAddProject({
      title: 'New Project',
      description: 'Project description',
      media: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop',
      type: 'image',
      tags: ['Tag1', 'Tag2'],
      link: ''
    });
  };

  const removeProject = async (id: string) => {
    if (confirm('Are you sure you want to remove this project?')) {
      await contextRemoveProject(id);
    }
  };

  const updateProject = async (id: string, field: string, value: any) => {
    await contextUpdateProject(id, { [field]: value });
  };

  return (
    <div className="page-container admin-dashboard">
      <motion.div
        className="dashboard-header glass-panel"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <h1>Admin Dashboard</h1>
        <div className="header-actions">
          <button onClick={handleSave} disabled={saving} className="save-button glass-button">
            <FiSave /> {saving ? 'Saving...' : 'Synced'}
          </button>
          <button onClick={handleLogout} className="logout-button glass-button">
            <FiLogOut /> Logout
          </button>
        </div>
      </motion.div>

      <div className="dashboard-content">
        <div className="dashboard-tabs">
          <button className={`tab ${activeTab === 'site' ? 'active' : ''} glass-button`} onClick={() => setActiveTab('site')}>Site Settings</button>
          <button className={`tab ${activeTab === 'team' ? 'active' : ''} glass-button`} onClick={() => setActiveTab('team')}>Team</button>
          <button className={`tab ${activeTab === 'projects' ? 'active' : ''} glass-button`} onClick={() => setActiveTab('projects')}>Projects</button>
        </div>

        {/* Site Settings */}
        {activeTab === 'site' && (
          <motion.div className="config-section glass-panel" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h2>Global Configuration</h2>
            <div className="form-group">
              <label>Site Title</label>
              <input type="text" value={siteConfig.title} onChange={(e) => updateSiteConfig({ ...siteConfig, title: e.target.value })} className="glass-input" />
            </div>
            <div className="form-group">
              <label>Mission</label>
              <textarea value={siteConfig.mission} onChange={(e) => updateSiteConfig({ ...siteConfig, mission: e.target.value })} className="glass-input" rows={2} />
            </div>
            <ImageUploadInput 
              label="Main Site Logo" 
              value={siteConfig.logo} 
              onUpdate={(url) => updateSiteConfig({ ...siteConfig, logo: url })} 
              id="site-logo" 
            />

            <h3 className="subsection-title">Splash Screen</h3>
            <div className="form-group">
              <label>Splash Title</label>
              <input
                type="text"
                value={siteConfig.splash?.title || ''}
                onChange={(e) => updateSiteConfig({ ...siteConfig, splash: { ...siteConfig.splash, title: e.target.value } })}
                className="glass-input"
                placeholder="Enter splash title"
              />
            </div>
            <div className="form-group">
              <label>Splash Tagline</label>
              <input
                type="text"
                value={siteConfig.splash?.tagline || ''}
                onChange={(e) => updateSiteConfig({ ...siteConfig, splash: { ...siteConfig.splash, tagline: e.target.value } })}
                className="glass-input"
                placeholder="Enter splash tagline"
              />
            </div>
            <ImageUploadInput 
              label="Splash Image URL" 
              value={siteConfig.splash?.image || ''} 
              onUpdate={(url) => updateSiteConfig({ ...siteConfig, splash: { ...siteConfig.splash, image: url } })} 
              id="splash-image" 
            />

            <h3 className="subsection-title">Contact & Social</h3>
            <div className="form-row">
              <div className="form-group"><label>Email</label><input type="email" value={siteConfig.contact.email} onChange={(e) => updateSiteConfig({ ...siteConfig, contact: { ...siteConfig.contact, email: e.target.value } })} className="glass-input" /></div>
              <div className="form-group"><label>Phone</label><input type="text" value={siteConfig.contact.phone} onChange={(e) => updateSiteConfig({ ...siteConfig, contact: { ...siteConfig.contact, phone: e.target.value } })} className="glass-input" /></div>
            </div>
            <div className="form-row">
              <div className="form-group"><label>GitHub</label><input type="url" value={siteConfig.social.github} onChange={(e) => updateSiteConfig({ ...siteConfig, social: { ...siteConfig.social, github: e.target.value } })} className="glass-input" /></div>
              <div className="form-group"><label>LinkedIn</label><input type="url" value={siteConfig.social.linkedin} onChange={(e) => updateSiteConfig({ ...siteConfig, social: { ...siteConfig.social, linkedin: e.target.value } })} className="glass-input" /></div>
            </div>
          </motion.div>
        )}

        {/* Company Projects */}
        {activeTab === 'projects' && (
          <div className="team-section">
            <div className="section-header">
              <h2>Portfolio Projects</h2>
              <button onClick={addProject} className="add-button glass-button"><FiPlus /> New Project</button>
            </div>
            <div className="members-list">
              {projects.map((project: any, index) => (
                <div key={project.firestoreId || index} className="member-edit-card glass-panel">
                  <div className="member-edit-header">
                    <img src={project.media} className="member-avatar-small" />
                    <h3>{project.title}</h3>
                    <button onClick={() => removeProject(project.firestoreId)} className="delete-button"><FiTrash /></button>
                  </div>
                  <div className="member-edit-content">
                    <div className="form-group">
                      <label>Title</label>
                      <input type="text" value={project.title} onChange={(e) => updateProject(project.firestoreId, 'title', e.target.value)} className="glass-input" />
                    </div>
                    <ImageUploadInput 
                      label="Media URL" 
                      value={project.media} 
                      onUpdate={(url) => updateProject(project.firestoreId, 'media', url)} 
                      id={`project-media-${index}`} 
                    />
                    <div className="form-group">
                      <label>Project Link</label>
                      <input type="url" value={project.link} onChange={(e) => updateProject(project.firestoreId, 'link', e.target.value)} className="glass-input" />
                    </div>
                    <div className="form-group">
                      <label>Tags (comma separated)</label>
                      <input type="text" value={project.tags?.join(', ')} onChange={(e) => updateProject(project.firestoreId, 'tags', e.target.value.split(',').map(t => t.trim()))} className="glass-input" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Team Members */}
        {activeTab === 'team' && (
          <div className="team-section">
            <div className="section-header">
              <h2>Team Management</h2>
              <button onClick={addTeamMember} className="add-button glass-button"><FiPlus /> Add Member</button>
            </div>
            <div className="members-list">
              {members.map((member, index) => (
                <div key={member.id} className="member-edit-card glass-panel">
                  <div className="member-edit-header">
                    <img src={member.avatar} alt={member.name} className="member-avatar-small" />
                    <h3>{member.name}</h3>
                    <button onClick={() => removeMember(member.id)} className="delete-button"><FiTrash /></button>
                  </div>
                  <div className="member-edit-content">
                    <div className="form-row">
                      <div className="form-group"><label>Name</label><input type="text" value={member.name} onChange={(e) => updateMember(member.id, 'name', e.target.value)} className="glass-input" /></div>
                      <div className="form-group"><label>Role</label><input type="text" value={member.role} onChange={(e) => updateMember(member.id, 'role', e.target.value)} className="glass-input" /></div>
                    </div>
                    <ImageUploadInput 
                      label="Avatar URL" 
                      value={member.avatar} 
                      onUpdate={(url) => updateMember(member.id, 'avatar', url)} 
                      id={`member-avatar-${index}`} 
                    />
                    
                    {/* Nested Management for Projects and Gallery */}
                    <div className="nested-management">
                      <h4>Member Projects</h4>
                      <div className="nested-list">
                        {member.projects?.map((p, pIdx) => (
                          <div key={pIdx} className="nested-item glass-panel">
                            <input type="text" value={p.title} placeholder="Project Title" onChange={(e) => {
                              const newProjects = [...member.projects];
                              newProjects[pIdx].title = e.target.value;
                              updateMember(member.id, 'projects', newProjects);
                            }} className="glass-input" />
                            <ImageUploadInput 
                              label="" 
                              value={p.image} 
                              onUpdate={(url) => {
                                const newProjects = [...member.projects];
                                newProjects[pIdx].image = url;
                                updateMember(member.id, 'projects', newProjects);
                              }} 
                              id={`member-${index}-project-${pIdx}`} 
                            />
                            <button className="delete-button" onClick={() => updateMember(member.id, 'projects', member.projects.filter((_, i) => i !== pIdx))}><FiX /></button>
                          </div>
                        ))}
                        <button className="glass-button add-nested" onClick={() => updateMember(member.id, 'projects', [...(member.projects || []), { title: 'New Project', description: '', image: '', link: '' }])}><FiPlus /> Add Project</button>
                      </div>

                      <h4>Gallery Images</h4>
                      <div className="gallery-edit-grid">
                        {member.gallery?.map((img, gIdx) => (
                          <div key={gIdx} className="gallery-edit-item">
                            <img src={img} />
                            <button className="remove-gallery-img" onClick={() => updateMember(member.id, 'gallery', member.gallery.filter((_, i) => i !== gIdx))}><FiX /></button>
                          </div>
                        ))}
                        <label className="gallery-add-btn glass-button">
                          <FiPlus />
                          <input type="file" multiple accept="image/*" onChange={(e) => {
                            if (e.target.files) {
                              Array.from(e.target.files).forEach(file => {
                                handleImageUpload(file, (url) => {
                                  updateMember(member.id, 'gallery', [...(member.gallery || []), url]);
                                }, `gallery-${member.id}`);
                              });
                            }
                          }} hidden />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};