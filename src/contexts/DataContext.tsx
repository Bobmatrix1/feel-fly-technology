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
export type SiteConfig = typeof initialSiteConfig;
export type TeamMember = typeof initialTeamMembers[0];
export type Project = typeof initialCompanyProjects[0];

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
            setSiteConfig(docSnap.data() as SiteConfig);
          } else {
            // Seed initial config if not exists
            setDoc(configRef, initialSiteConfig);
          }
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
          } else if (!loading) {
            // Auto-seed if empty
            for (const member of initialTeamMembers) {
              const { id, ...data } = member;
              await addDoc(membersRef, data);
            }
          }
        });

        // Projects Listener
        const projectsRef = collection(db, 'projects');
        unsubscribeProjects = onSnapshot(projectsRef, async (snapshot) => {
          if (!snapshot.empty) {
            const projectsList = snapshot.docs.map(doc => ({
              ...doc.data(),
              firestoreId: doc.id
            }));
            setCompanyProjects(projectsList as any[]);
          } else if (!loading) {
            // Auto-seed if empty
            for (const project of initialCompanyProjects) {
              await addDoc(projectsRef, project);
            }
          }
        });
        
        setLoading(false);

      } catch (error) {
        console.error("Error connecting to Firestore:", error);
        // Fallback to mock data is automatic since we initialized state with it
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
