import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { 
  FiLogOut, 
  FiPlus, 
  FiTrash, 
  FiSave, 
  FiImage, 
  FiUpload, 
  FiX, 
  FiLink,
  FiMail,
  FiPhone,
  FiMapPin,
  FiGithub,
  FiLinkedin,
  FiInstagram,
  FiExternalLink,
  FiGlobe,
  FiTwitter
} from 'react-icons/fi';
import { signOut } from 'firebase/auth';
import { auth, db } from '../../lib/firebase';
import { useData } from '../../contexts/DataContext';
import { doc, getDoc } from 'firebase/firestore';
import { CropModal } from '../components/ui/CropModal';

const CLOUDINARY_CLOUD_NAME = 'djllkcgzv';
const CLOUDINARY_UPLOAD_PRESET = 'feel-fly technology';

// Debounce helper
function useDebounce(callback: Function, delay: number) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  return useCallback((...args: any[]) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      callback(...args);
    }, delay);
  }, [callback, delay]);
}

export const AdminDashboardPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'site' | 'team' | 'projects'>('site');
  const [saving, setSaving] = useState(false);
  const [uploadingField, setUploadingField] = useState<string | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  
  // Crop state
  const [cropState, setCropState] = useState<{ src: string, callback: (url: string) => void, id: string } | null>(null);
  
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

  // Local state for all inputs to prevent cursor jumping
  const [localSiteConfig, setLocalSiteConfig] = useState(siteConfig);
  const [localMembers, setLocalMembers] = useState(members);
  const [localProjects, setLocalProjects] = useState(projects);

  // Update local state when context changes (e.g. initial load or sync from other source)
  // But ONLY if we aren't currently editing (to avoid overwriting user input)
  const isEditingRef = useRef(false);

  useEffect(() => {
    if (!isEditingRef.current) {
      setLocalSiteConfig(siteConfig);
    }
  }, [siteConfig]);

  useEffect(() => {
    if (!isEditingRef.current) {
      setLocalMembers(members);
    }
  }, [members]);

  useEffect(() => {
    if (!isEditingRef.current) {
      setLocalProjects(projects);
    }
  }, [projects]);

  // Debounced update functions
  const debouncedUpdateSiteConfig = useDebounce((config: any) => {
    updateSiteConfig(config);
    isEditingRef.current = false;
  }, 1000);

  const debouncedUpdateMember = useDebounce((id: string, updates: any) => {
    contextUpdateMember(id, updates);
    isEditingRef.current = false;
  }, 1000);

  const debouncedUpdateProject = useDebounce((id: string, updates: any) => {
    contextUpdateProject(id, updates);
    isEditingRef.current = false;
  }, 1000);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        navigate('/admin');
      } else {
        // Double check admin status
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (!userDoc.exists() || !userDoc.data().isAdmin) {
            navigate('/');
          }
        } catch (error) {
          console.error("Error checking admin status:", error);
          navigate('/admin');
        }
      }
      setCheckingAuth(false);
    });
    return () => unsubscribe();
  }, [navigate]);

  if (checkingAuth) {
    return (
      <div className="page-container flex items-center justify-center">
        <div className="text-xl gradient-text animate-pulse">Verifying Admin Status...</div>
      </div>
    );
  }

  const handleImageUpload = async (file: File | Blob, callback: (url: string) => void, fieldId: string) => {
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

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, callback: (url: string) => void, id: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setCropState({ src: reader.result as string, callback, id });
    };
    reader.readAsDataURL(file);
    // Reset input
    e.target.value = '';
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
        <label className={`upload-btn glass-button ${uploadingField === id ? 'uploading' : ''}`} title="Upload & Crop">
          {uploadingField === id ? '...' : <FiUpload />}
          <input 
            type="file" 
            accept="image/*" 
            onChange={(e) => handleFileSelect(e, onUpdate, id)} 
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

  // Site Settings change handler
  const handleSiteConfigChange = (updates: any) => {
    isEditingRef.current = true;
    const updatedConfig = { ...localSiteConfig, ...updates };
    setLocalSiteConfig(updatedConfig);
    debouncedUpdateSiteConfig(updatedConfig);
  };

  // Contact/Social Management
  const addContactItem = () => {
    const newContact = [...(localSiteConfig.contact || []), { 
      id: Date.now().toString(), 
      label: 'New Contact', 
      value: '', 
      type: 'url' as const 
    }];
    handleSiteConfigChange({ contact: newContact });
  };

  const removeContactItem = (id: string) => {
    const newContact = localSiteConfig.contact.filter(item => item.id !== id);
    handleSiteConfigChange({ contact: newContact });
  };

  const updateContactItem = (id: string, updates: any) => {
    isEditingRef.current = true;
    const newContact = localSiteConfig.contact.map(item => 
      item.id === id ? { ...item, ...updates } : item
    );
    const updatedConfig = { ...localSiteConfig, contact: newContact };
    setLocalSiteConfig(updatedConfig);
    debouncedUpdateSiteConfig(updatedConfig);
  };

  const addSocialItem = () => {
    const newSocial = [...(localSiteConfig.social || []), { 
      id: Date.now().toString(), 
      label: 'New Social', 
      url: '' 
    }];
    handleSiteConfigChange({ social: newSocial });
  };

  const removeSocialItem = (id: string) => {
    const newSocial = localSiteConfig.social.filter(item => item.id !== id);
    handleSiteConfigChange({ social: newSocial });
  };

  const updateSocialItem = (id: string, updates: any) => {
    isEditingRef.current = true;
    const newSocial = localSiteConfig.social.map(item => 
      item.id === id ? { ...item, ...updates } : item
    );
    const updatedConfig = { ...localSiteConfig, social: newSocial };
    setLocalSiteConfig(updatedConfig);
    debouncedUpdateSiteConfig(updatedConfig);
  };

  const addWhatsApp = () => {
    const hasWhatsApp = localSiteConfig.social?.some(s => s.label.toLowerCase().includes('whatsapp'));
    if (hasWhatsApp) {
      alert('WhatsApp already exists!');
      return;
    }
    const newSocial = [...(localSiteConfig.social || []), { 
      id: Date.now().toString(), 
      label: 'WhatsApp', 
      url: 'https://wa.me/YOUR_NUMBER' 
    }];
    handleSiteConfigChange({ social: newSocial });
  };

  // Team Member Actions
  const addTeamMember = async () => {
    await contextAddMember({
      id: '',
      name: 'New Member',
      role: 'Team Member',
      bio: 'Bio goes here',
      avatar: 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=400&h=400&fit=crop',
      socials: {
        github: '',
        linkedin: '',
        twitter: '',
        portfolio: ''
      },
      projects: [],
      gallery: []
    });
  };

  const removeMember = async (id: string) => {
    if (confirm('Are you sure you want to remove this member?')) {
      await contextRemoveMember(id);
    }
  };

  const updateMember = (id: string, field: string, value: any) => {
    isEditingRef.current = true;
    const updatedMembers = localMembers.map(m => 
      m.id === id ? { ...m, [field]: value } : m
    );
    setLocalMembers(updatedMembers);
    debouncedUpdateMember(id, { [field]: value });
  };

  const updateMemberSocial = (memberId: string, platform: string, value: string) => {
    isEditingRef.current = true;
    const member = localMembers.find(m => m.id === memberId);
    if (!member) return;
    const newSocials = { ...(member.socials || {}), [platform]: value };
    
    const updatedMembers = localMembers.map(m => 
      m.id === memberId ? { ...m, socials: newSocials } : m
    );
    setLocalMembers(updatedMembers);
    debouncedUpdateMember(memberId, { socials: newSocials });
  };

  const updateMemberProjects = (memberId: string, newProjects: any[]) => {
    isEditingRef.current = true;
    const updatedMembers = localMembers.map(m => 
      m.id === memberId ? { ...m, projects: newProjects } : m
    );
    setLocalMembers(updatedMembers);
    debouncedUpdateMember(memberId, { projects: newProjects });
  };

  const updateMemberGallery = (memberId: string, newGallery: string[]) => {
    isEditingRef.current = true;
    const updatedMembers = localMembers.map(m => 
      m.id === memberId ? { ...m, gallery: newGallery } : m
    );
    setLocalMembers(updatedMembers);
    debouncedUpdateMember(memberId, { gallery: newGallery });
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

  const updateProject = (id: string, field: string, value: any) => {
    isEditingRef.current = true;
    const updatedProjects = localProjects.map(p => 
      p.firestoreId === id ? { ...p, [field]: value } : p
    );
    setLocalProjects(updatedProjects);
    debouncedUpdateProject(id, { [field]: value });
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
          <div className="status-badge glass-panel px-4 py-2 text-xs flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            Real-time Sync
          </div>
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
            <h2 className="mb-6">Global Configuration</h2>
            <div className="form-group">
              <label>Site Title</label>
              <input 
                type="text" 
                value={localSiteConfig.title} 
                onChange={(e) => handleSiteConfigChange({ title: e.target.value })} 
                className="glass-input" 
              />
            </div>
            <div className="form-group">
              <label>Mission</label>
              <textarea 
                value={localSiteConfig.mission} 
                onChange={(e) => handleSiteConfigChange({ mission: e.target.value })} 
                className="glass-input" 
                rows={2} 
              />
            </div>
            <ImageUploadInput 
              label="Main Site Logo" 
              value={localSiteConfig.logo} 
              onUpdate={(url) => handleSiteConfigChange({ logo: url })} 
              id="site-logo" 
            />

            <h3 className="subsection-title mt-8">Splash Screen</h3>
            <div className="form-group">
              <label>Splash Title</label>
              <input
                type="text"
                value={localSiteConfig.splash?.title || ''}
                onChange={(e) => handleSiteConfigChange({ splash: { ...localSiteConfig.splash, title: e.target.value } })}
                className="glass-input"
                placeholder="Enter splash title"
              />
            </div>
            <div className="form-group">
              <label>Splash Tagline</label>
              <input
                type="text"
                value={localSiteConfig.splash?.tagline || ''}
                onChange={(e) => handleSiteConfigChange({ splash: { ...localSiteConfig.splash, tagline: e.target.value } })}
                className="glass-input"
                placeholder="Enter splash tagline"
              />
            </div>
            <ImageUploadInput 
              label="Splash Image URL" 
              value={localSiteConfig.splash?.image || ''} 
              onUpdate={(url) => handleSiteConfigChange({ splash: { ...localSiteConfig.splash, image: url } })} 
              id="splash-image" 
            />

            <h3 className="subsection-title mt-8">Contact Information</h3>
            <div className="nested-list mb-4">
              {Array.isArray(localSiteConfig.contact) && localSiteConfig.contact.map((item) => (
                <div key={item.id} className="nested-item glass-panel !grid-cols-1 md:!grid-cols-[1fr_2fr_1fr_auto] gap-4">
                  <input 
                    type="text" 
                    value={item.label} 
                    placeholder="Label (e.g. Email)"
                    onChange={(e) => updateContactItem(item.id, { label: e.target.value })}
                    className="glass-input" 
                  />
                  <input 
                    type="text" 
                    value={item.value} 
                    placeholder="Value (e.g. info@fly.com)"
                    onChange={(e) => updateContactItem(item.id, { value: e.target.value })}
                    className="glass-input" 
                  />
                  <select 
                    value={item.type}
                    onChange={(e) => updateContactItem(item.id, { type: e.target.value })}
                    className="glass-input"
                  >
                    <option value="email">Email</option>
                    <option value="phone">Phone</option>
                    <option value="address">Address</option>
                    <option value="url">URL/Link</option>
                  </select>
                  <button onClick={() => removeContactItem(item.id)} className="delete-button !m-0 flex-shrink-0"><FiTrash /></button>
                </div>
              ))}
              <button onClick={addContactItem} className="glass-button w-full mt-2"><FiPlus /> Add Contact Option</button>
            </div>

            <h3 className="subsection-title mt-8 flex justify-between items-center">
              Social Links
              <button onClick={addWhatsApp} className="text-xs glass-button !py-1 !px-3 flex items-center gap-1 flex-shrink-0">
                <FiPlus /> Add WhatsApp
              </button>
            </h3>
            <div className="nested-list">
              {Array.isArray(localSiteConfig.social) && localSiteConfig.social.map((item) => (
                <div key={item.id} className="nested-item glass-panel !grid-cols-1 md:!grid-cols-[1fr_2fr_auto] gap-4">
                  <input 
                    type="text" 
                    value={item.label} 
                    placeholder="Platform (e.g. GitHub)"
                    onChange={(e) => updateSocialItem(item.id, { label: e.target.value })}
                    className="glass-input" 
                  />
                  <input 
                    type="url" 
                    value={item.url} 
                    placeholder="URL (https://...)"
                    onChange={(e) => updateSocialItem(item.id, { url: e.target.value })}
                    className="glass-input" 
                  />
                  <button onClick={() => removeSocialItem(item.id)} className="delete-button !m-0 flex-shrink-0"><FiTrash /></button>
                </div>
              ))}
              <button onClick={addSocialItem} className="glass-button w-full mt-2"><FiPlus /> Add Social Platform</button>
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
              {localProjects.map((project: any, index) => (
                <div key={project.firestoreId || index} className="member-edit-card glass-panel">
                  <div className="member-edit-header">
                    <label className="cursor-pointer hover:opacity-80 transition-opacity" title="Click to change image">
                      <img src={project.media} className="member-avatar-small" />
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={(e) => handleFileSelect(e, (url) => updateProject(project.firestoreId, 'media', url), `project-media-${index}`)} 
                        hidden 
                      />
                    </label>
                    <h3>{project.title}</h3>
                    <button onClick={() => removeProject(project.firestoreId)} className="delete-button"><FiTrash /></button>
                  </div>
                  <div className="member-edit-content">
                    <div className="form-group">
                      <label>Title</label>
                      <input type="text" value={project.title} onChange={(e) => updateProject(project.firestoreId, 'title', e.target.value)} className="glass-input" />
                    </div>
                    <div className="form-group">
                      <label>Description</label>
                      <textarea 
                        value={project.description} 
                        onChange={(e) => updateProject(project.firestoreId, 'description', e.target.value)} 
                        className="glass-input" 
                        rows={3} 
                        placeholder="Tell us about this project..."
                      />
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
              {localMembers.map((member, index) => (
                <div key={member.id} className="member-edit-card glass-panel">
                  <div className="member-edit-header">
                    <label className="cursor-pointer hover:opacity-80 transition-opacity" title="Click to change avatar">
                      <img src={member.avatar} alt={member.name} className="member-avatar-small" />
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={(e) => handleFileSelect(e, (url) => updateMember(member.id, 'avatar', url), `member-avatar-${index}`)} 
                        hidden 
                      />
                    </label>
                    <h3>{member.name}</h3>
                    <button onClick={() => removeMember(member.id)} className="delete-button"><FiTrash /></button>
                  </div>
                  <div className="member-edit-content">
                    <div className="form-row">
                      <div className="form-group"><label>Name</label><input type="text" value={member.name} onChange={(e) => updateMember(member.id, 'name', e.target.value)} className="glass-input" /></div>
                      <div className="form-group"><label>Role</label><input type="text" value={member.role} onChange={(e) => updateMember(member.id, 'role', e.target.value)} className="glass-input" /></div>
                    </div>
                    <ImageUploadInput 
                      label="Avatar URL (Circle Crop)" 
                      value={member.avatar} 
                      onUpdate={(url) => updateMember(member.id, 'avatar', url)} 
                      id={`member-avatar-${index}`} 
                    />

                    <div className="form-group">
                      <label>Bio (Visible on Card Back)</label>
                      <textarea 
                        value={member.bio} 
                        onChange={(e) => updateMember(member.id, 'bio', e.target.value)} 
                        className="glass-input" 
                        rows={3}
                        placeholder="Write a short bio..."
                      />
                    </div>

                    <div className="form-group">
                      <label>Social Links</label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-2">
                          <FiGithub className="text-white/40" />
                          <input 
                            type="url" 
                            value={member.socials?.github || ''} 
                            placeholder="GitHub URL"
                            onChange={(e) => updateMemberSocial(member.id, 'github', e.target.value)}
                            className="glass-input text-sm" 
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <FiLinkedin className="text-white/40" />
                          <input 
                            type="url" 
                            value={member.socials?.linkedin || ''} 
                            placeholder="LinkedIn URL"
                            onChange={(e) => updateMemberSocial(member.id, 'linkedin', e.target.value)}
                            className="glass-input text-sm" 
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <FiTwitter className="text-white/40" />
                          <input 
                            type="url" 
                            value={member.socials?.twitter || ''} 
                            placeholder="Twitter URL"
                            onChange={(e) => updateMemberSocial(member.id, 'twitter', e.target.value)}
                            className="glass-input text-sm" 
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <FiGlobe className="text-white/40" />
                          <input 
                            type="url" 
                            value={member.socials?.portfolio || ''} 
                            placeholder="Portfolio URL"
                            onChange={(e) => updateMemberSocial(member.id, 'portfolio', e.target.value)}
                            className="glass-input text-sm" 
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="nested-management">
                      <h4 className="mb-4">Member Projects</h4>
                      <div className="nested-list">
                        {member.projects?.map((p, pIdx) => (
                          <div key={pIdx} className="nested-item glass-panel !flex flex-col gap-4">
                            <div className="flex items-center gap-3 w-full">
                              <div className="flex-1">
                                <label className="text-[10px] uppercase tracking-wider text-white/40 mb-1 block">Project Title</label>
                                <input type="text" value={p.title} placeholder="e.g. Mobile App" onChange={(e) => {
                                  const newProjects = [...member.projects];
                                  newProjects[pIdx].title = e.target.value;
                                  updateMemberProjects(member.id, newProjects);
                                }} className="glass-input !py-2" />
                              </div>
                              <button 
                                className="delete-button flex-shrink-0 mt-5" 
                                title="Remove Project"
                                onClick={() => updateMemberProjects(member.id, member.projects.filter((_, i) => i !== pIdx))}
                              >
                                <FiX />
                              </button>
                            </div>
                            
                            <div className="w-full">
                              <label className="text-[10px] uppercase tracking-wider text-white/40 mb-1 block">Project Details</label>
                              <textarea 
                                value={p.description} 
                                placeholder="Describe the role and outcome..." 
                                onChange={(e) => {
                                  const newProjects = [...member.projects];
                                  newProjects[pIdx].description = e.target.value;
                                  updateMemberProjects(member.id, newProjects);
                                }} 
                                className="glass-input"
                                rows={2}
                              />
                            </div>

                            <div className="w-full">
                              <label className="text-[10px] uppercase tracking-wider text-white/40 mb-1 block">Project Image</label>
                              <ImageUploadInput 
                                label="" 
                                value={p.image} 
                                onUpdate={(url) => {
                                  const newProjects = [...member.projects];
                                  newProjects[pIdx].image = url;
                                  updateMemberProjects(member.id, newProjects);
                                }} 
                                id={`member-${index}-project-${pIdx}`} 
                              />
                            </div>
                          </div>
                        ))}
                        <button className="glass-button w-full mt-2" onClick={() => updateMemberProjects(member.id, [...(member.projects || []), { title: 'New Project', description: '', image: '', link: '' }])}><FiPlus /> Add Project</button>
                      </div>

                      <h4>Gallery Images</h4>
                      <div className="gallery-edit-grid">
                        {member.gallery?.map((img, gIdx) => (
                          <div key={gIdx} className="gallery-edit-item">
                            <img src={img} />
                            <button className="remove-gallery-img" onClick={() => updateMemberGallery(member.id, member.gallery.filter((_, i) => i !== gIdx))}><FiX /></button>
                          </div>
                        ))}
                        <label className="gallery-add-btn glass-button">
                          <FiPlus />
                          <input type="file" multiple accept="image/*" onChange={(e) => {
                            if (e.target.files) {
                              Array.from(e.target.files).forEach(file => {
                                const reader = new FileReader();
                                reader.onload = () => {
                                  setCropState({ 
                                    src: reader.result as string, 
                                    callback: (url) => {
                                      updateMemberGallery(member.id, [...(member.gallery || []), url]);
                                    }, 
                                    id: `gallery-${member.id}` 
                                  });
                                };
                                reader.readAsDataURL(file);
                              });
                            }
                            e.target.value = '';
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

      <AnimatePresence>
        {cropState && (
          <CropModal 
            image={cropState.src}
            onCropComplete={(blob) => {
              handleImageUpload(blob, cropState.callback, cropState.id);
              setCropState(null);
            }}
            onCancel={() => setCropState(null)}
            circular={cropState.id.includes('avatar') || cropState.id.includes('gallery')}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
