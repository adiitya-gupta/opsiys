import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { 
  initializeFirestore,
  getFirestore, 
  collection, 
  addDoc, 
  serverTimestamp, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc,
  deleteDoc,
  query, 
  where, 
  orderBy, 
  onSnapshot 
} from "firebase/firestore";
import firebaseConfig from "../../firebase-applet-config.json";

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);

// Use auto-detect long polling to prevent WebChannel 10-second backend connection timeouts in iframe/proxy environments
export const db = initializeFirestore(app, {
  experimentalAutoDetectLongPolling: true,
  ignoreUndefinedProperties: true,
}, firebaseConfig.firestoreDatabaseId);

export const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error("Google Sign-In Error:", error);
    throw error;
  }
};

export const logout = () => signOut(auth);

// --- Profile Service ---

export const updateProfile = async (userId: string, profileData: {
  displayName: string;
  company?: string;
  role?: string;
  industry?: string;
}) => {
  try {
    const profileRef = doc(db, "profiles", userId);
    await setDoc(profileRef, {
      ...profileData,
      updatedAt: serverTimestamp(),
    }, { merge: true });
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
};

export const getUserProfile = async (userId: string) => {
  try {
    const profileRef = doc(db, "profiles", userId);
    const snap = await getDoc(profileRef);
    if (snap.exists()) {
      return snap.data();
    }
    return null;
  } catch (error) {
    console.error("Error fetching profile:", error);
    return null;
  }
};

// --- Leads Service ---

export const submitLead = async (leadData: {
  name: string;
  email: string;
  company: string;
  phone: string;
  budget?: string;
  projectType?: string;
  urgency?: string;
  message?: string;
  userId?: string;
  source?: string;
  status?: string;
}) => {
  try {
    const leadsRef = collection(db, "leads");
    
    // Clean undefined values
    const submissionData = Object.fromEntries(
      Object.entries(leadData).filter(([_, v]) => v !== undefined && v !== "")
    );

    await addDoc(leadsRef, {
      ...submissionData,
      createdAt: serverTimestamp(),
      status: leadData.status || "new",
    });
  } catch (error) {
    console.error("Error submitting lead:", error);
    throw error;
  }
};

export const submitCareerApplication = async (applicationData: {
  fullName: string;
  email: string;
  phone: string;
  city: string;
  position: string;
  employmentType: string;
  experience: string;
  portfolioUrl: string;
  resumeFileName?: string;
  resumeData?: string;
  introduction: string;
  noticePeriod: string;
  expectedSalary?: string;
  preferredWorkMode?: string;
  additionalInfo?: string;
}) => {
  try {
    const appsRef = collection(db, "career_applications");
    
    const cleanedData = Object.fromEntries(
      Object.entries(applicationData).filter(([_, v]) => v !== undefined && v !== "")
    );

    await addDoc(appsRef, {
      ...cleanedData,
      createdAt: serverTimestamp(),
      status: "under_review",
    });
  } catch (error) {
    console.error("Error submitting career application:", error);
    throw error;
  }
};

export const subscribeToUserLeads = (userId: string, callback: (leads: any[]) => void) => {
  try {
    const leadsRef = collection(db, "leads");
    const q = query(
      leadsRef, 
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );

    return onSnapshot(
      q, 
      (snapshot) => {
        const leads = snapshot.docs.map(d => ({
          id: d.id,
          ...d.data()
        }));
        callback(leads);
      },
      (error) => {
        console.warn("User leads listener notice:", error?.message || error);
        callback([]);
      }
    );
  } catch (err) {
    console.warn("Failed to attach leads subscription:", err);
    return () => {};
  }
};

// --- ADMIN API SERVICES ---

export const subscribeToAllLeads = (callback: (leads: any[]) => void) => {
  try {
    const leadsRef = collection(db, "leads");
    const q = query(leadsRef, orderBy("createdAt", "desc"));
    return onSnapshot(
      q,
      (snapshot) => {
        const leads = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        callback(leads);
      },
      (err) => {
        console.warn("Admin leads subscription error:", err);
        // Fallback without ordering if index is building
        onSnapshot(leadsRef, (snap) => {
          callback(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        });
      }
    );
  } catch (err) {
    console.error("Failed to subscribe to all leads:", err);
    return () => {};
  }
};

export const updateLeadStatus = async (leadId: string, status: string) => {
  const leadRef = doc(db, "leads", leadId);
  await updateDoc(leadRef, { status });
};

export const deleteLead = async (leadId: string) => {
  const leadRef = doc(db, "leads", leadId);
  await deleteDoc(leadRef);
};

export const subscribeToCareerApplications = (callback: (apps: any[]) => void) => {
  try {
    const appsRef = collection(db, "career_applications");
    const q = query(appsRef, orderBy("createdAt", "desc"));
    return onSnapshot(
      q,
      (snapshot) => {
        const apps = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        callback(apps);
      },
      (err) => {
        console.warn("Admin career apps subscription error:", err);
        onSnapshot(appsRef, (snap) => {
          callback(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        });
      }
    );
  } catch (err) {
    console.error("Failed to subscribe to career applications:", err);
    return () => {};
  }
};

export const updateCareerApplicationStatus = async (appId: string, status: string) => {
  const appRef = doc(db, "career_applications", appId);
  await updateDoc(appRef, { status });
};

export const deleteCareerApplication = async (appId: string) => {
  const appRef = doc(db, "career_applications", appId);
  await deleteDoc(appRef);
};

export const subscribeToPayments = (callback: (payments: any[]) => void) => {
  try {
    const paymentsRef = collection(db, "payments");
    const q = query(paymentsRef, orderBy("createdAt", "desc"));
    return onSnapshot(
      q,
      (snapshot) => {
        const payments = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        callback(payments);
      },
      (err) => {
        console.warn("Admin payments subscription error:", err);
        onSnapshot(paymentsRef, (snap) => {
          callback(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        });
      }
    );
  } catch (err) {
    console.error("Failed to subscribe to payments:", err);
    return () => {};
  }
};

export const subscribeToProfiles = (callback: (profiles: any[]) => void) => {
  try {
    const profilesRef = collection(db, "profiles");
    return onSnapshot(
      profilesRef,
      (snapshot) => {
        const profiles = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        callback(profiles);
      },
      (err) => {
        console.warn("Admin profiles subscription error:", err);
        callback([]);
      }
    );
  } catch (err) {
    console.error("Failed to subscribe to profiles:", err);
    return () => {};
  }
};

// --- Job Openings Service ---

export const subscribeToJobOpenings = (callback: (jobs: any[]) => void) => {
  try {
    const jobsRef = collection(db, "job_openings");
    return onSnapshot(
      jobsRef,
      (snapshot) => {
        const jobs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        callback(jobs);
      },
      (err) => {
        console.warn("Job openings subscription notice:", err);
        callback([]);
      }
    );
  } catch (err) {
    console.error("Failed to subscribe to job openings:", err);
    return () => {};
  }
};

export const saveJobOpening = async (jobData: {
  id?: string;
  title: string;
  department: string;
  location: string;
  type: string;
  experience: string;
  description: string;
  active: boolean;
}) => {
  const jobsRef = collection(db, "job_openings");
  if (jobData.id) {
    const jobDoc = doc(db, "job_openings", jobData.id);
    await setDoc(jobDoc, { ...jobData, updatedAt: serverTimestamp() }, { merge: true });
  } else {
    await addDoc(jobsRef, { ...jobData, createdAt: serverTimestamp(), active: jobData.active ?? true });
  }
};

export const deleteJobOpening = async (jobId: string) => {
  const jobDoc = doc(db, "job_openings", jobId);
  await deleteDoc(jobDoc);
};

// --- System Maintenance Service ---

export const subscribeToSystemSettings = (callback: (settings: any) => void) => {
  try {
    const settingsDoc = doc(db, "settings", "system");
    return onSnapshot(
      settingsDoc,
      (snapshot) => {
        if (snapshot.exists()) {
          callback(snapshot.data());
        } else {
          // Default maintenance mode setting
          callback({ maintenanceMode: true, message: "OPSIYS Systems undergoing scheduled infrastructure upgrade. Core services temporarily paused for public access." });
        }
      },
      (err) => {
        console.warn("System settings listener fallback notice:", err);
        callback({ maintenanceMode: true });
      }
    );
  } catch (err) {
    console.error("Failed to subscribe to system settings:", err);
    return () => {};
  }
};

export const updateSystemMaintenanceMode = async (maintenanceMode: boolean, message?: string) => {
  const settingsDoc = doc(db, "settings", "system");
  await setDoc(settingsDoc, {
    maintenanceMode,
    message: message || "OPSIYS Systems undergoing scheduled infrastructure upgrade. Core services temporarily paused for public access.",
    updatedAt: serverTimestamp()
  }, { merge: true });
};


