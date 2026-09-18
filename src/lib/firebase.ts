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

// --- Local Cache Helpers ---
const getStorageItem = (key: string, defaultValue: any) => {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : defaultValue;
  } catch (err) {
    return defaultValue;
  }
};

const setStorageItem = (key: string, value: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn(`Failed to set localStorage key ${key}:`, err);
  }
};

// --- Profile Service ---

export const updateProfile = async (userId: string, profileData: {
  displayName: string;
  company?: string;
  role?: string;
  industry?: string;
}) => {
  const profileRecord = {
    id: userId,
    ...profileData,
    updatedAt: new Date().toISOString(),
  };

  // Update local profiles cache
  const currentProfiles = getStorageItem("opsiys_profiles_cache", []);
  const existingIdx = currentProfiles.findIndex((p: any) => p.id === userId);
  if (existingIdx >= 0) {
    currentProfiles[existingIdx] = { ...currentProfiles[existingIdx], ...profileRecord };
  } else {
    currentProfiles.push(profileRecord);
  }
  setStorageItem("opsiys_profiles_cache", currentProfiles);

  try {
    const profileRef = doc(db, "profiles", userId);
    await setDoc(profileRef, {
      ...profileData,
      updatedAt: serverTimestamp(),
    }, { merge: true });
  } catch (error) {
    console.warn("Firestore profile update fallback notice:", error);
  }
};

export const getUserProfile = async (userId: string) => {
  try {
    const profileRef = doc(db, "profiles", userId);
    const snap = await getDoc(profileRef);
    if (snap.exists()) {
      return snap.data();
    }
  } catch (error) {
    console.warn("Firestore profile fetch notice:", error);
  }
  const currentProfiles = getStorageItem("opsiys_profiles_cache", []);
  return currentProfiles.find((p: any) => p.id === userId) || null;
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
  const leadId = "lead_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7);
  const newLead = {
    id: leadId,
    ...leadData,
    createdAt: new Date().toISOString(),
    status: leadData.status || "new",
  };

  // Update local cache
  const currentLeads = getStorageItem("opsiys_leads_cache", []);
  setStorageItem("opsiys_leads_cache", [newLead, ...currentLeads]);

  try {
    const leadsRef = collection(db, "leads");
    const submissionData = Object.fromEntries(
      Object.entries(leadData).filter(([_, v]) => v !== undefined && v !== "")
    );
    await addDoc(leadsRef, {
      ...submissionData,
      createdAt: serverTimestamp(),
      status: leadData.status || "new",
    });
  } catch (error) {
    console.warn("Lead submitted with local cache backup:", error);
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
  const appId = "app_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7);
  const newApp = {
    id: appId,
    ...applicationData,
    createdAt: new Date().toISOString(),
    status: "under_review",
  };

  // Update local cache
  const currentApps = getStorageItem("opsiys_apps_cache", []);
  setStorageItem("opsiys_apps_cache", [newApp, ...currentApps]);

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
    console.warn("Career application submitted with local cache backup:", error);
  }
};

export const subscribeToUserLeads = (userId: string, callback: (leads: any[]) => void) => {
  const cachedLeads = getStorageItem("opsiys_leads_cache", []).filter((l: any) => l.userId === userId);
  callback(cachedLeads);

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
        callback(cachedLeads);
      }
    );
  } catch (err) {
    console.warn("Failed to attach leads subscription:", err);
    return () => {};
  }
};

// --- ADMIN API SERVICES ---

export const subscribeToAllLeads = (callback: (leads: any[]) => void) => {
  const cached = getStorageItem("opsiys_leads_cache", []);
  callback(cached);

  try {
    const leadsRef = collection(db, "leads");
    const q = query(leadsRef, orderBy("createdAt", "desc"));
    return onSnapshot(
      q,
      (snapshot) => {
        const leads = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        setStorageItem("opsiys_leads_cache", leads);
        callback(leads);
      },
      (err) => {
        console.warn("Admin leads subscription notice:", err?.message || err);
        // Fallback without ordering if index is building
        onSnapshot(
          leadsRef, 
          (snap) => {
            const leads = snap.docs.map(d => ({ id: d.id, ...d.data() }));
            setStorageItem("opsiys_leads_cache", leads);
            callback(leads);
          },
          (err2) => {
            console.warn("Admin leads fallback notice:", err2?.message || err2);
            callback(getStorageItem("opsiys_leads_cache", []));
          }
        );
      }
    );
  } catch (err) {
    console.warn("Failed to subscribe to all leads:", err);
    return () => {};
  }
};

export const updateLeadStatus = async (leadId: string, status: string) => {
  const currentLeads = getStorageItem("opsiys_leads_cache", []);
  const updated = currentLeads.map((l: any) => l.id === leadId ? { ...l, status } : l);
  setStorageItem("opsiys_leads_cache", updated);

  try {
    const leadRef = doc(db, "leads", leadId);
    await updateDoc(leadRef, { status });
  } catch (err) {
    console.warn("Lead status update notice:", err);
  }
};

export const deleteLead = async (leadId: string) => {
  const currentLeads = getStorageItem("opsiys_leads_cache", []);
  setStorageItem("opsiys_leads_cache", currentLeads.filter((l: any) => l.id !== leadId));

  try {
    const leadRef = doc(db, "leads", leadId);
    await deleteDoc(leadRef);
  } catch (err) {
    console.warn("Lead deletion notice:", err);
  }
};

export const subscribeToCareerApplications = (callback: (apps: any[]) => void) => {
  const cached = getStorageItem("opsiys_apps_cache", []);
  callback(cached);

  try {
    const appsRef = collection(db, "career_applications");
    const q = query(appsRef, orderBy("createdAt", "desc"));
    return onSnapshot(
      q,
      (snapshot) => {
        const apps = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        setStorageItem("opsiys_apps_cache", apps);
        callback(apps);
      },
      (err) => {
        console.warn("Admin career apps subscription notice:", err?.message || err);
        onSnapshot(
          appsRef, 
          (snap) => {
            const apps = snap.docs.map(d => ({ id: d.id, ...d.data() }));
            setStorageItem("opsiys_apps_cache", apps);
            callback(apps);
          },
          (err2) => {
            console.warn("Admin career apps fallback notice:", err2?.message || err2);
            callback(getStorageItem("opsiys_apps_cache", []));
          }
        );
      }
    );
  } catch (err) {
    console.warn("Failed to subscribe to career applications:", err);
    return () => {};
  }
};

export const updateCareerApplicationStatus = async (appId: string, status: string) => {
  const currentApps = getStorageItem("opsiys_apps_cache", []);
  const updated = currentApps.map((a: any) => a.id === appId ? { ...a, status } : a);
  setStorageItem("opsiys_apps_cache", updated);

  try {
    const appRef = doc(db, "career_applications", appId);
    await updateDoc(appRef, { status });
  } catch (err) {
    console.warn("Application status update notice:", err);
  }
};

export const deleteCareerApplication = async (appId: string) => {
  const currentApps = getStorageItem("opsiys_apps_cache", []);
  setStorageItem("opsiys_apps_cache", currentApps.filter((a: any) => a.id !== appId));

  try {
    const appRef = doc(db, "career_applications", appId);
    await deleteDoc(appRef);
  } catch (err) {
    console.warn("Application deletion notice:", err);
  }
};

export const subscribeToPayments = (callback: (payments: any[]) => void) => {
  const cached = getStorageItem("opsiys_payments_cache", []);
  callback(cached);

  try {
    const paymentsRef = collection(db, "payments");
    const q = query(paymentsRef, orderBy("createdAt", "desc"));
    return onSnapshot(
      q,
      (snapshot) => {
        const payments = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        setStorageItem("opsiys_payments_cache", payments);
        callback(payments);
      },
      (err) => {
        console.warn("Admin payments subscription notice:", err?.message || err);
        onSnapshot(
          paymentsRef, 
          (snap) => {
            const payments = snap.docs.map(d => ({ id: d.id, ...d.data() }));
            setStorageItem("opsiys_payments_cache", payments);
            callback(payments);
          },
          (err2) => {
            console.warn("Admin payments fallback notice:", err2?.message || err2);
            callback(getStorageItem("opsiys_payments_cache", []));
          }
        );
      }
    );
  } catch (err) {
    console.warn("Failed to subscribe to payments:", err);
    return () => {};
  }
};

export const subscribeToProfiles = (callback: (profiles: any[]) => void) => {
  const cached = getStorageItem("opsiys_profiles_cache", []);
  callback(cached);

  try {
    const profilesRef = collection(db, "profiles");
    return onSnapshot(
      profilesRef,
      (snapshot) => {
        const profiles = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        setStorageItem("opsiys_profiles_cache", profiles);
        callback(profiles);
      },
      (err) => {
        console.warn("Admin profiles subscription notice:", err?.message || err);
        callback(getStorageItem("opsiys_profiles_cache", []));
      }
    );
  } catch (err) {
    console.warn("Failed to subscribe to profiles:", err);
    return () => {};
  }
};

// --- Job Openings Service ---

export const subscribeToJobOpenings = (callback: (jobs: any[]) => void) => {
  const cached = getStorageItem("opsiys_jobs_cache", []);
  callback(cached);

  try {
    const jobsRef = collection(db, "job_openings");
    return onSnapshot(
      jobsRef,
      (snapshot) => {
        const jobs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        setStorageItem("opsiys_jobs_cache", jobs);
        callback(jobs);
      },
      (err) => {
        console.warn("Job openings subscription notice:", err?.message || err);
        callback(getStorageItem("opsiys_jobs_cache", []));
      }
    );
  } catch (err) {
    console.warn("Failed to subscribe to job openings:", err);
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
  const currentJobs = getStorageItem("opsiys_jobs_cache", []);
  let jobId = jobData.id;
  if (!jobId) {
    jobId = "job_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7);
  }
  const jobRecord = { ...jobData, id: jobId, active: jobData.active ?? true };

  const existingIdx = currentJobs.findIndex((j: any) => j.id === jobId);
  if (existingIdx >= 0) {
    currentJobs[existingIdx] = jobRecord;
  } else {
    currentJobs.unshift(jobRecord);
  }
  setStorageItem("opsiys_jobs_cache", currentJobs);

  try {
    const jobsRef = collection(db, "job_openings");
    if (jobData.id) {
      const jobDoc = doc(db, "job_openings", jobData.id);
      await setDoc(jobDoc, { ...jobData, updatedAt: serverTimestamp() }, { merge: true });
    } else {
      await addDoc(jobsRef, { ...jobData, createdAt: serverTimestamp(), active: jobData.active ?? true });
    }
  } catch (err) {
    console.warn("Job opening save fallback notice:", err);
  }
};

export const deleteJobOpening = async (jobId: string) => {
  const currentJobs = getStorageItem("opsiys_jobs_cache", []);
  setStorageItem("opsiys_jobs_cache", currentJobs.filter((j: any) => j.id !== jobId));

  try {
    const jobDoc = doc(db, "job_openings", jobId);
    await deleteDoc(jobDoc);
  } catch (err) {
    console.warn("Job opening deletion notice:", err);
  }
};

// --- System Maintenance Service ---

const DEFAULT_MAINTENANCE_SETTINGS = {
  maintenanceMode: true,
  message: "OPSIYS Systems undergoing scheduled infrastructure upgrade. Core services temporarily paused for public access."
};

export const subscribeToSystemSettings = (callback: (settings: any) => void) => {
  // Read initial from localStorage or default
  const stored = getStorageItem("opsiys_system_settings", DEFAULT_MAINTENANCE_SETTINGS);
  callback(stored);

  // Listen to custom DOM event for instant cross-component updates
  const handleUpdateEvent = (e: CustomEvent) => {
    if (e.detail) {
      callback(e.detail);
    }
  };
  window.addEventListener("opsiys-maintenance-updated" as any, handleUpdateEvent);

  try {
    const settingsDoc = doc(db, "settings", "system");
    const unsubscribeSnapshot = onSnapshot(
      settingsDoc,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          setStorageItem("opsiys_system_settings", data);
          callback(data);
        } else {
          callback(stored);
        }
      },
      (err) => {
        console.warn("System settings listener fallback notice:", err?.message || err);
        callback(getStorageItem("opsiys_system_settings", DEFAULT_MAINTENANCE_SETTINGS));
      }
    );

    return () => {
      window.removeEventListener("opsiys-maintenance-updated" as any, handleUpdateEvent);
      unsubscribeSnapshot();
    };
  } catch (err) {
    console.warn("Failed to subscribe to system settings:", err);
    return () => {
      window.removeEventListener("opsiys-maintenance-updated" as any, handleUpdateEvent);
    };
  }
};

export const updateSystemMaintenanceMode = async (maintenanceMode: boolean, message?: string) => {
  const updatedSettings = {
    maintenanceMode,
    message: message || DEFAULT_MAINTENANCE_SETTINGS.message,
    updatedAt: new Date().toISOString()
  };

  // 1. Immediately store in local storage
  setStorageItem("opsiys_system_settings", updatedSettings);

  // 2. Dispatch event for instant UI reaction across all components
  window.dispatchEvent(new CustomEvent("opsiys-maintenance-updated", { detail: updatedSettings }));

  // 3. Attempt Firestore write asynchronously without throwing uncaught errors
  try {
    const settingsDoc = doc(db, "settings", "system");
    await setDoc(settingsDoc, {
      ...updatedSettings,
      updatedAt: serverTimestamp()
    }, { merge: true });
  } catch (err) {
    console.warn("Firestore maintenance mode update fallback notice (saved locally):", err);
  }

  return updatedSettings;
};
