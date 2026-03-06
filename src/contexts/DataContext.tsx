import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  doc, 
  getDoc, 
  setDoc, 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  onSnapshot
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { 
  siteConfig as initialSiteConfig, 
  teamMembers as initialTeamMembers, 
  companyProjects as initialCompanyProjects 
} from '../data/mockData';

// Define types
export interface ContactItem {
  id: string;
  label: string;
  value: string;
  type: 'email' | 'phone' | 'address' | 'url';
}

export interface SocialItem {
  id: string;
  label: string;
  url: string;
  icon?: string;
}

export interface SiteConfig {
  title: string;
  mission: string;
  about: string;
  logo: string;
  theme: string;
  contact: ContactItem[];
  social: SocialItem[];
  splash: {
    image: string;
    title: string;
    tagline: string;
  };
}

interface DataContextType {
  siteConfig: SiteConfig;
  teamMembers: TeamMember[];
  companyProjects: Project[];
  loading: boolean;
  updateSiteConfig: (newConfig: SiteConfig) => Promise<void>;
  addTeamMember: (member: TeamMember) => Promise<void>;
  updateTeamMember: (id: string, updatedMember: Partial<TeamMember>) => Promise<void>;
  removeTeamMember: (id: string) => Promise<void>;
  addProject: (project: Project) => Promise<void>;
  updateProject: (id: string, updatedProject: Partial<Project>) => Promise<void>;
  removeProject: (id: string) => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Helper for mapping strings to icons
export const getIcon = (iconName: string = '') => {
  const name = iconName.toLowerCase();
  if (name.includes('mail') || name.includes('email')) return 'FiMail';
  if (name.includes('phone') || name.includes('whatsapp') || name.includes('call')) return 'FiPhone';
  if (name.includes('map') || name.includes('pin') || name.includes('address') || name.includes('location')) return 'FiMapPin';
  if (name.includes('github')) return 'FiGithub';
  if (name.includes('linkedin')) return 'FiLinkedin';
  if (name.includes('twitter') || name.includes(' x')) return 'RiTwitterXLine';
  if (name.includes('instagram')) return 'FiInstagram';
  if (name.includes('facebook')) return 'FiFacebook';
  if (name.includes('youtube')) return 'FiYoutube';
  return 'FiExternalLink';
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [siteConfig, setSiteConfig] = useState<SiteConfig>(initialSiteConfig);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(initialTeamMembers);
  const [companyProjects, setCompanyProjects] = useState<Project[]>(initialCompanyProjects);
  const [loading, setLoading] = useState(true);

  // Initial Data Fetch & Real-time Listeners
  useEffect(() => {
    let unsubscribeConfig: () => void;
    let unsubscribeMembers: () => void;
    let unsubscribeProjects: () => void;

    const fetchData = async () => {
      try {
        // Site Config Listener
        const configRef = doc(db, 'settings', 'siteConfig');
        unsubscribeConfig = onSnapshot(configRef, (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            
            // Handle legacy structure conversion if necessary
            const processedData = { ...data };
            
            if (data.contact && !Array.isArray(data.contact)) {
              processedData.contact = [
                { id: '1', label: 'Email', value: data.contact.email || '', type: 'email' },
                { id: '2', label: 'Phone', value: data.contact.phone || '', type: 'phone' },
                { id: '3', label: 'Address', value: data.contact.address || '', type: 'address' }
              ];
            }
            
            if (data.social && !Array.isArray(data.social)) {
              processedData.social = Object.entries(data.social)
                .filter(([_, value]) => !!value)
                .map(([key, value], index) => ({
                  id: String(index + 1),
                  label: key.charAt(0).toUpperCase() + key.slice(1),
                  url: value as string
                }));
            }

            // Deep merge with initial config to ensure all fields exist
            setSiteConfig(prev => ({ ...prev, ...processedData }));
          } else {
            // Seed initial config if not exists
            setDoc(configRef, initialSiteConfig);
          }
          
          // CRITICAL: Only set loading to false once we have the first snapshot
          setLoading(false);
        });

        // Team Members Listener
        const membersRef = collection(db, 'teamMembers');
        unsubscribeMembers = onSnapshot(membersRef, async (snapshot) => {
          if (!snapshot.empty) {
            const membersList = snapshot.docs.map(doc => ({
              ...(doc.data() as Omit<TeamMember, 'id'>),
              id: doc.id
            }));
            setTeamMembers(membersList as TeamMember[]);
          } else {
            // Only seed if we are sure it's empty AND we are the first to initialize
            const checkMembers = await getDocs(membersRef);
            if (checkMembers.empty) {
              for (const member of initialTeamMembers) {
                const { id, ...data } = member;
                await addDoc(membersRef, data);
              }
            }
          }
        });

        // Projects Listener
        const projectsRef = collection(db, 'projects');
        unsubscribeProjects = onSnapshot(projectsRef, async (snapshot) => {
          if (!snapshot.empty) {
            const projectsList = snapshot.docs.map(doc => ({
              ...(doc.data() as any),
              firestoreId: doc.id
            }));
            setCompanyProjects(projectsList as any[]);
          } else {
            const checkProjects = await getDocs(projectsRef);
            if (checkProjects.empty) {
              for (const project of initialCompanyProjects) {
                await addDoc(projectsRef, project);
              }
            }
          }
        });

      } catch (error) {
        console.error("Error connecting to Firestore:", error);
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      if (unsubscribeConfig) unsubscribeConfig();
      if (unsubscribeMembers) unsubscribeMembers();
      if (unsubscribeProjects) unsubscribeProjects();
    };
  }, []);

  // CRUD Operations

  const updateSiteConfig = async (newConfig: SiteConfig) => {
    // Optimistic update
    setSiteConfig(newConfig);
    try {
      await setDoc(doc(db, 'settings', 'siteConfig'), newConfig);
    } catch (error) {
      console.error("Error updating site config:", error);
      // Revert? (Not implemented for simplicity)
    }
  };

  const addTeamMember = async (member: TeamMember) => {
    // We don't set state manually because onSnapshot will catch it
    try {
      // Remove ID if it exists to let Firestore generate one, or use it?
      // mockData has IDs "1", "2". Firestore uses "AutoID".
      // Let's sanitize:
      const { id, ...data } = member; 
      await addDoc(collection(db, 'teamMembers'), data);
    } catch (error) {
      console.error("Error adding member:", error);
    }
  };

  const updateTeamMember = async (id: string, updatedMember: Partial<TeamMember>) => {
    try {
      const memberRef = doc(db, 'teamMembers', id);
      await updateDoc(memberRef, updatedMember);
    } catch (error) {
      console.error("Error updating member:", error);
    }
  };

  const removeTeamMember = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'teamMembers', id));
    } catch (error) {
      console.error("Error removing member:", error);
    }
  };

  const addProject = async (project: Project) => {
    try {
      await addDoc(collection(db, 'projects'), project);
    } catch (error) {
      console.error("Error adding project:", error);
    }
  };

  const updateProject = async (id: string, updatedProject: Partial<Project>) => {
    try {
      const projectRef = doc(db, 'projects', id);
      await updateDoc(projectRef, updatedProject);
    } catch (error) {
      console.error("Error updating project:", error);
    }
  };

  const removeProject = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'projects', id));
    } catch (error) {
      console.error("Error removing project:", error);
    }
  };

  return (
    <DataContext.Provider value={{
      siteConfig,
      teamMembers,
      companyProjects,
      loading,
      updateSiteConfig,
      addTeamMember,
      updateTeamMember,
      removeTeamMember,
      addProject,
      updateProject,
      removeProject
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
