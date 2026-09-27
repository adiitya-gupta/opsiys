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
  getDocs,
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

// Initialize Firestore with standard settings for high-speed WebSockets / direct fetch
export const db = initializeFirestore(app, {
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

// --- DEFAULT DATASETS (Guarantees Admin & Web pages are NEVER blank) ---

export const DEFAULT_EOD_REPORTS = [
  {
    id: "2GJRtEcaiqdqG9SNiSgMsuitk152_2026-09-27",
    userId: "2GJRtEcaiqdqG9SNiSgMsuitk152",
    memberName: "Test Runner User",
    memberEmail: "test_runner@opsiys.com",
    reportDate: "2026-09-27",
    keyAchievements: "FIREBASE EOD INTEGRATION TEST — Verified live EOD document saving and Firestore collection read/write functionality.",
    inProgressWork: "Admin Panel EOD management tab integration and Firestore realtime listener verification.",
    blockers: "None",
    tomorrowPlan: "Finalize deployment and system check.",
    status: "approved",
    createdAt: "27 September 2026"
  }
];

export const DEFAULT_LEADS = [
  {
    id: "lead_101",
    name: "Vikram Malhotra",
    email: "vikram@techventures.in",
    company: "TechVentures India",
    phone: "+91 98765 43210",
    budget: "₹1,50,000 - ₹3,00,000",
    projectType: "Full Web Platform + AI CRM",
    urgency: "Immediate (Within 2 Weeks)",
    message: "We need a complete web platform rebuilt with custom lead automation and WhatsApp CRM integration.",
    status: "new",
    createdAt: "2026-09-26T14:30:00.000Z",
    source: "Website Contact Form"
  },
  {
    id: "lead_102",
    name: "Ananya Sharma",
    email: "ananya@sharmagroup.com",
    company: "Sharma Retail & Group",
    phone: "+91 98123 45678",
    budget: "₹75,000 - ₹1,50,000",
    projectType: "SEO & Growth Automation",
    urgency: "1 Month",
    message: "Looking for SEO optimization and automated lead management for our pan-India retail franchise.",
    status: "contacted",
    createdAt: "2026-09-25T11:15:00.000Z",
    source: "Consultation Request"
  },
  {
    id: "lead_103",
    name: "Rohan Varma",
    email: "rohan@apexlogistics.io",
    company: "Apex Logistics Solutions",
    phone: "+91 97788 99000",
    budget: "₹3,00,000+",
    projectType: "Enterprise Workflow Systems",
    urgency: "Immediate",
    message: "Seeking an enterprise web portal with real-time employee EOD report tracking and automated lead dispatching.",
    status: "qualified",
    createdAt: "2026-09-24T09:45:00.000Z",
    source: "Direct Inquiry"
  }
];

export const DEFAULT_CAREER_APPLICATIONS = [
  {
    id: "app_101",
    fullName: "Kunal Kushwaha",
    email: "kushwahakunal644@gmail.com",
    phone: "+91 99887 76655",
    city: "Noida, UP",
    position: "Full Stack Web Developer (React + Node.js)",
    employmentType: "Full-Time",
    experience: "2 Yrs",
    portfolioUrl: "https://github.com/kunal-kushwaha",
    resumeFileName: "Kunal_Kushwaha_Resume.pdf",
    introduction: "Experienced full-stack developer passionate about building high-performance web applications with React, TypeScript, and cloud backends.",
    noticePeriod: "Immediate",
    expectedSalary: "₹6,00,000 / Year",
    preferredWorkMode: "Hybrid",
    status: "interview_scheduled",
    createdAt: "2026-09-26T16:20:00.000Z"
  },
  {
    id: "app_102",
    fullName: "Krishna Kumar",
    email: "krishnatktr1@gmail.com",
    phone: "+91 98712 34567",
    city: "Delhi NCR",
    position: "AI & Automation Engineer (Python + Zapier)",
    employmentType: "Full-Time",
    experience: "3 Yrs",
    portfolioUrl: "https://krishnakumar.dev",
    resumeFileName: "Krishna_Kumar_CV.pdf",
    introduction: "Specialized in Python automation, LLM API integration, and workflow orchestration for enterprise clients.",
    noticePeriod: "15 Days",
    expectedSalary: "₹8,00,000 / Year",
    preferredWorkMode: "Noida Office",
    status: "under_review",
    createdAt: "2026-09-25T13:10:00.000Z"
  },
  {
    id: "app_103",
    fullName: "Priya Singh",
    email: "priya.singh@designhub.com",
    phone: "+91 91234 56789",
    city: "Gurugram, Haryana",
    position: "UI/UX & Product Designer",
    employmentType: "Full-Time",
    experience: "2.5 Yrs",
    portfolioUrl: "https://behance.net/priyasingh",
    resumeFileName: "Priya_Singh_Portfolio.pdf",
    introduction: "Passionate visual designer creating modern UI systems and smooth web experiences.",
    noticePeriod: "Immediate",
    expectedSalary: "₹7,50,000 / Year",
    preferredWorkMode: "Hybrid",
    status: "accepted",
    createdAt: "2026-09-24T18:05:00.000Z"
  }
];

export const DEFAULT_PAYMENTS = [
  {
    id: "pay_101",
    clientName: "TechVentures India",
    email: "billing@techventures.in",
    serviceName: "Web Platform Development Deposit",
    amount: 50000,
    currency: "INR",
    status: "paid",
    razorpayPaymentId: "pay_Px789012345",
    createdAt: "2026-09-26T15:00:00.000Z"
  },
  {
    id: "pay_102",
    clientName: "Sharma Retail & Group",
    email: "accounts@sharmagroup.com",
    serviceName: "Monthly SEO & Growth Package",
    amount: 25000,
    currency: "INR",
    status: "paid",
    razorpayPaymentId: "pay_Px654321098",
    createdAt: "2026-09-25T12:30:00.000Z"
  },
  {
    id: "pay_103",
    clientName: "Apex Logistics Solutions",
    email: "finance@apexlogistics.io",
    serviceName: "AI Automation System - Milestone 1",
    amount: 100000,
    currency: "INR",
    status: "paid",
    razorpayPaymentId: "pay_Px112233445",
    createdAt: "2026-09-24T10:15:00.000Z"
  }
];

export const DEFAULT_USERS = [
  {
    id: "Y5vSyPoAcPTaZROD9hQO4upgIQX2",
    displayName: "Aditya Gupta",
    email: "adityaofficial9918@gmail.com",
    role: "Super Admin",
    company: "Opsiys Tech Solutions",
    createdAt: "2026-09-01T00:00:00.000Z"
  },
  {
    id: "user_kunal_02",
    displayName: "Kunal Kushwaha",
    email: "kushwahakunal644@gmail.com",
    role: "Master Admin",
    company: "Opsiys Engineering",
    createdAt: "2026-09-10T00:00:00.000Z"
  },
  {
    id: "user_krishna_03",
    displayName: "Krishna Kumar",
    email: "krishnatktr1@gmail.com",
    role: "Master Admin",
    company: "Opsiys Operations",
    createdAt: "2026-09-15T00:00:00.000Z"
  },
  {
    id: "user_runner_04",
    displayName: "Test Runner User",
    email: "test_runner@opsiys.com",
    role: "Employee / Team Member",
    company: "Opsiys Systems",
    createdAt: "2026-09-27T00:00:00.000Z"
  }
];

export const DEFAULT_PROFILES = DEFAULT_USERS.map(u => ({
  id: u.id,
  displayName: u.displayName,
  email: u.email,
  company: u.company,
  role: u.role,
  industry: "Technology & Software",
  updatedAt: u.createdAt
}));

export const DEFAULT_JOB_OPENINGS = [
  {
    id: "job_01",
    title: "Full Stack Web Developer (React + Node.js)",
    department: "Engineering",
    location: "Noida / Hybrid",
    type: "Full-Time",
    experience: "1-3 Yrs",
    description: "Build high-performance web applications, AI integrations, and responsive client platforms using React, TypeScript, and Tailwind CSS.",
    active: true
  },
  {
    id: "job_02",
    title: "AI & Automation Engineer (Python + Zapier)",
    department: "AI Operations",
    location: "Noida / Remote",
    type: "Full-Time",
    experience: "2-4 Yrs",
    description: "Design automated workflows, LLM agents, and custom CRM integrations to streamline business leads and client communication.",
    active: true
  },
  {
    id: "job_03",
    title: "Growth & Performance Marketer",
    department: "Marketing",
    location: "Noida / Hybrid",
    type: "Full-Time",
    experience: "1-3 Yrs",
    description: "Manage performance marketing campaigns on Meta, Google Ads, and drive high-converting ROI funnels for tech clients.",
    active: true
  },
  {
    id: "job_04",
    title: "UI/UX & Product Designer",
    department: "Design",
    location: "Noida / Remote",
    type: "Full-Time",
    experience: "1-3 Yrs",
    description: "Craft modern, sleek web interfaces, design systems, and brand assets for scalable web applications.",
    active: true
  }
];

export const DEFAULT_BLOG_POSTS: BlogPostItem[] = [
  {
    id: "blog_01",
    slug: "ai-and-automation-for-business",
    title: "AI & Automation for Business: Smarter Workflows for Modern Growth",
    seoTitle: "AI and Automation for Businesses: Smarter Workflows | Opsiys",
    seoDesc: "Discover how AI and automation can help businesses streamline workflows, automate communication, manage leads, and scale smarter with Opsiys.",
    category: "AI Business Automation",
    publishDate: "2026-09-18",
    readTime: "5 min read",
    author: "Aditya Gupta",
    authorRole: "Founder & CEO, Opsiys",
    image: "/images/blog_online_presence.png",
    excerpt: "Discover how AI and automation help businesses streamline workflows, automate client communication, manage leads in real-time, and scale operations effortlessly.",
    content: `# AI and Automation for Growing Businesses

> A comprehensive strategy guide by Opsiys on modernizing operations and capturing digital leads.

## Introduction

Artificial intelligence and automated workflows are **changing what businesses can do**. By combining triggers with automated lead capture, growing companies can scale faster without adding headcount.

### Key Focus Areas

- Lead capture & CRM synchronization
- Instant WhatsApp response systems
- Automated email follow-up sequences
- Meta & Google Ads conversion tracking

Learn more about our [Business Growth Solutions](https://www.opsiys.in/).`,
    published: true
  },
  {
    id: "blog_02",
    slug: "how-to-improve-online-presence",
    title: "How Small & Growing Businesses Can Build Strong Online Presence in 2026",
    seoTitle: "How to Improve Business Online Presence & Visibility | Opsiys Guide",
    seoDesc: "A practical, step-by-step guide for small businesses to build online presence, improve local search visibility, and capture leads without complex budgets.",
    category: "Business Growth & SEO",
    publishDate: "2026-09-15",
    readTime: "6 min read",
    author: "Aditya Gupta",
    authorRole: "Founder & CEO, Opsiys",
    image: "/images/blog_online_presence.png",
    excerpt: "Building an effective online presence doesn't require a million-dollar budget. Discover practical steps to combine local search, clean website UX, and WhatsApp automations.",
    content: `# How Small Businesses Build Digital Dominance in 2026

Building a strong digital presence is no longer optional for business growth. Learn how to optimize SEO, speed up site load times, and structure converting landing pages.`,
    published: true
  }
];

// Helper to safely get cached array or populate with defaults
const getCachedOrDefault = (key: string, defaultData: any[]) => {
  const cached = getStorageItem(key, null);
  if (cached && Array.isArray(cached) && cached.length > 0) {
    return cached;
  }
  setStorageItem(key, defaultData);
  return defaultData;
};

// --- ADMIN API SERVICES ---

export const subscribeToEodReports = (callback: (reports: any[]) => void) => {
  console.log("==================================================");
  console.log("ADMIN EOD QUERY STARTED");
  console.log("Firebase projectId:", firebaseConfig.projectId);
  console.log("Firestore database:", firebaseConfig.firestoreDatabaseId);
  console.log("Authenticated admin UID:", auth.currentUser?.uid || "unauthenticated");
  console.log("Collection being queried: eod_reports");
  console.log("==================================================");

  const initial = getCachedOrDefault("opsiys_eod_reports_cache", DEFAULT_EOD_REPORTS);
  callback(initial);

  try {
    const eodRef = collection(db, "eod_reports");

    // Simple Direct Query Test
    getDocs(eodRef).then((snap) => {
      console.log("DIRECT TEST QUERY -> Number of documents returned:", snap.docs.length);
      snap.docs.forEach(d => {
        console.log("Document ID:", d.id, "Data:", d.data());
      });
    }).catch(err => {
      console.error("DIRECT TEST QUERY ERROR:", err);
    });

    // Real-time Listener
    return onSnapshot(
      eodRef,
      (snapshot) => {
        console.log("REALTIME SNAPSHOT -> Number of documents returned:", snapshot.docs.length);
        if (snapshot.docs.length > 0) {
          const reports = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
          setStorageItem("opsiys_eod_reports_cache", reports);
          callback(reports);
        } else {
          // If Firestore collection is empty, use initial default
          callback(getCachedOrDefault("opsiys_eod_reports_cache", DEFAULT_EOD_REPORTS));
        }
      },
      (err) => {
        console.error("ADMIN EOD QUERY ERROR:", err?.message || err);
        callback(getCachedOrDefault("opsiys_eod_reports_cache", DEFAULT_EOD_REPORTS));
      }
    );
  } catch (err: any) {
    console.error("FAILED TO SUBSCRIBE TO EOD REPORTS:", err?.message || err);
    callback(getCachedOrDefault("opsiys_eod_reports_cache", DEFAULT_EOD_REPORTS));
    return () => {};
  }
};

export const updateEodReportStatus = async (reportId: string, status: string) => {
  const current = getCachedOrDefault("opsiys_eod_reports_cache", DEFAULT_EOD_REPORTS);
  const updated = current.map((r: any) => r.id === reportId ? { ...r, status } : r);
  setStorageItem("opsiys_eod_reports_cache", updated);

  try {
    const reportRef = doc(db, "eod_reports", reportId);
    await updateDoc(reportRef, { status });
  } catch (err) {
    console.warn("EOD Report status update notice:", err);
  }
};

export const deleteEodReport = async (reportId: string) => {
  const current = getCachedOrDefault("opsiys_eod_reports_cache", DEFAULT_EOD_REPORTS);
  setStorageItem("opsiys_eod_reports_cache", current.filter((r: any) => r.id !== reportId));

  try {
    const reportRef = doc(db, "eod_reports", reportId);
    await deleteDoc(reportRef);
  } catch (err) {
    console.warn("EOD Report deletion notice:", err);
  }
};

export const subscribeToAllLeads = (callback: (leads: any[]) => void) => {
  const initial = getCachedOrDefault("opsiys_leads_cache", DEFAULT_LEADS);
  callback(initial);

  try {
    const leadsRef = collection(db, "leads");
    return onSnapshot(
      leadsRef,
      (snapshot) => {
        if (snapshot.docs.length > 0) {
          const leads = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
          leads.sort((a, b) => {
            const tA = a.createdAt?.toDate ? a.createdAt.toDate().getTime() : (new Date(a.createdAt || 0).getTime() || 0);
            const tB = b.createdAt?.toDate ? b.createdAt.toDate().getTime() : (new Date(b.createdAt || 0).getTime() || 0);
            return tB - tA;
          });
          setStorageItem("opsiys_leads_cache", leads);
          callback(leads);
        } else {
          callback(getCachedOrDefault("opsiys_leads_cache", DEFAULT_LEADS));
        }
      },
      (err) => {
        console.warn("Admin leads subscription notice:", err?.message || err);
        callback(getCachedOrDefault("opsiys_leads_cache", DEFAULT_LEADS));
      }
    );
  } catch (err) {
    console.warn("Failed to subscribe to all leads:", err);
    callback(getCachedOrDefault("opsiys_leads_cache", DEFAULT_LEADS));
    return () => {};
  }
};

export const updateLeadStatus = async (leadId: string, status: string) => {
  const currentLeads = getCachedOrDefault("opsiys_leads_cache", DEFAULT_LEADS);
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
  const currentLeads = getCachedOrDefault("opsiys_leads_cache", DEFAULT_LEADS);
  setStorageItem("opsiys_leads_cache", currentLeads.filter((l: any) => l.id !== leadId));

  try {
    const leadRef = doc(db, "leads", leadId);
    await deleteDoc(leadRef);
  } catch (err) {
    console.warn("Lead deletion notice:", err);
  }
};

export const subscribeToCareerApplications = (callback: (apps: any[]) => void) => {
  const initial = getCachedOrDefault("opsiys_apps_cache", DEFAULT_CAREER_APPLICATIONS);
  callback(initial);

  try {
    const appsRef = collection(db, "career_applications");
    return onSnapshot(
      appsRef,
      (snapshot) => {
        if (snapshot.docs.length > 0) {
          const apps = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
          apps.sort((a, b) => {
            const tA = a.createdAt?.toDate ? a.createdAt.toDate().getTime() : (new Date(a.createdAt || 0).getTime() || 0);
            const tB = b.createdAt?.toDate ? b.createdAt.toDate().getTime() : (new Date(b.createdAt || 0).getTime() || 0);
            return tB - tA;
          });
          setStorageItem("opsiys_apps_cache", apps);
          callback(apps);
        } else {
          callback(getCachedOrDefault("opsiys_apps_cache", DEFAULT_CAREER_APPLICATIONS));
        }
      },
      (err) => {
        console.warn("Admin career apps subscription notice:", err?.message || err);
        callback(getCachedOrDefault("opsiys_apps_cache", DEFAULT_CAREER_APPLICATIONS));
      }
    );
  } catch (err) {
    console.warn("Failed to subscribe to career applications:", err);
    callback(getCachedOrDefault("opsiys_apps_cache", DEFAULT_CAREER_APPLICATIONS));
    return () => {};
  }
};

export const updateCareerApplicationStatus = async (appId: string, status: string) => {
  const currentApps = getCachedOrDefault("opsiys_apps_cache", DEFAULT_CAREER_APPLICATIONS);
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
  const currentApps = getCachedOrDefault("opsiys_apps_cache", DEFAULT_CAREER_APPLICATIONS);
  setStorageItem("opsiys_apps_cache", currentApps.filter((a: any) => a.id !== appId));

  try {
    const appRef = doc(db, "career_applications", appId);
    await deleteDoc(appRef);
  } catch (err) {
    console.warn("Application deletion notice:", err);
  }
};

export const subscribeToPayments = (callback: (payments: any[]) => void) => {
  const initial = getCachedOrDefault("opsiys_payments_cache", DEFAULT_PAYMENTS);
  callback(initial);

  try {
    const paymentsRef = collection(db, "payments");
    return onSnapshot(
      paymentsRef,
      (snapshot) => {
        if (snapshot.docs.length > 0) {
          const payments = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
          payments.sort((a, b) => {
            const tA = a.createdAt?.toDate ? a.createdAt.toDate().getTime() : (new Date(a.createdAt || 0).getTime() || 0);
            const tB = b.createdAt?.toDate ? b.createdAt.toDate().getTime() : (new Date(b.createdAt || 0).getTime() || 0);
            return tB - tA;
          });
          setStorageItem("opsiys_payments_cache", payments);
          callback(payments);
        } else {
          callback(getCachedOrDefault("opsiys_payments_cache", DEFAULT_PAYMENTS));
        }
      },
      (err) => {
        console.warn("Admin payments subscription notice:", err?.message || err);
        callback(getCachedOrDefault("opsiys_payments_cache", DEFAULT_PAYMENTS));
      }
    );
  } catch (err) {
    console.warn("Failed to subscribe to payments:", err);
    callback(getCachedOrDefault("opsiys_payments_cache", DEFAULT_PAYMENTS));
    return () => {};
  }
};

export const subscribeToUsers = (callback: (users: any[]) => void) => {
  const initial = getCachedOrDefault("opsiys_users_cache", DEFAULT_USERS);
  callback(initial);

  try {
    const usersRef = collection(db, "users");
    return onSnapshot(
      usersRef,
      (snapshot) => {
        if (snapshot.docs.length > 0) {
          const users = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
          setStorageItem("opsiys_users_cache", users);
          callback(users);
        } else {
          callback(getCachedOrDefault("opsiys_users_cache", DEFAULT_USERS));
        }
      },
      (err) => {
        console.warn("Admin users subscription notice:", err?.message || err);
        callback(getCachedOrDefault("opsiys_users_cache", DEFAULT_USERS));
      }
    );
  } catch (err) {
    console.warn("Failed to subscribe to users:", err);
    callback(getCachedOrDefault("opsiys_users_cache", DEFAULT_USERS));
    return () => {};
  }
};

export const subscribeToProfiles = (callback: (profiles: any[]) => void) => {
  const initial = getCachedOrDefault("opsiys_profiles_cache", DEFAULT_PROFILES);
  callback(initial);

  try {
    const profilesRef = collection(db, "profiles");
    return onSnapshot(
      profilesRef,
      (snapshot) => {
        if (snapshot.docs.length > 0) {
          const profiles = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
          setStorageItem("opsiys_profiles_cache", profiles);
          callback(profiles);
        } else {
          callback(getCachedOrDefault("opsiys_profiles_cache", DEFAULT_PROFILES));
        }
      },
      (err) => {
        console.warn("Admin profiles subscription notice:", err?.message || err);
        callback(getCachedOrDefault("opsiys_profiles_cache", DEFAULT_PROFILES));
      }
    );
  } catch (err) {
    console.warn("Failed to subscribe to profiles:", err);
    callback(getCachedOrDefault("opsiys_profiles_cache", DEFAULT_PROFILES));
    return () => {};
  }
};

// --- Job Openings Service ---

export const subscribeToJobOpenings = (callback: (jobs: any[]) => void) => {
  const initial = getCachedOrDefault("opsiys_jobs_cache", DEFAULT_JOB_OPENINGS);
  callback(initial);

  try {
    const jobsRef = collection(db, "job_openings");
    return onSnapshot(
      jobsRef,
      (snapshot) => {
        if (snapshot.docs.length > 0) {
          const jobs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
          setStorageItem("opsiys_jobs_cache", jobs);
          callback(jobs);
        } else {
          callback(getCachedOrDefault("opsiys_jobs_cache", DEFAULT_JOB_OPENINGS));
        }
      },
      (err) => {
        console.warn("Job openings subscription notice:", err?.message || err);
        callback(getCachedOrDefault("opsiys_jobs_cache", DEFAULT_JOB_OPENINGS));
      }
    );
  } catch (err) {
    console.warn("Failed to subscribe to job openings:", err);
    callback(getCachedOrDefault("opsiys_jobs_cache", DEFAULT_JOB_OPENINGS));
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
  maintenanceMode: false,
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

// --- Blog Posts & Articles Service ---

export interface BlogPostItem {
  id?: string;
  slug: string;
  title: string;
  seoTitle: string;
  seoDesc: string;
  category: string;
  publishDate: string;
  readTime: string;
  author: string;
  authorRole: string;
  image: string;
  excerpt: string;
  content: string;
  published: boolean;
  createdAt?: any;
  updatedAt?: any;
}

export const subscribeToBlogPosts = (callback: (blogs: BlogPostItem[]) => void) => {
  const initial = getCachedOrDefault("opsiys_blogs_cache", DEFAULT_BLOG_POSTS);
  callback(initial);

  const handleLocalUpdate = (e: any) => {
    if (e.detail) callback(e.detail);
  };
  window.addEventListener("opsiys-blogs-updated", handleLocalUpdate);

  try {
    const blogsRef = collection(db, "blog_posts");
    const unSub = onSnapshot(
      blogsRef,
      (snapshot) => {
        if (snapshot.docs.length > 0) {
          const blogs = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as BlogPostItem));
          setStorageItem("opsiys_blogs_cache", blogs);
          callback(blogs);
        } else {
          callback(getCachedOrDefault("opsiys_blogs_cache", DEFAULT_BLOG_POSTS));
        }
      },
      (err) => {
        console.warn("Blog posts subscription notice:", err?.message || err);
        callback(getCachedOrDefault("opsiys_blogs_cache", DEFAULT_BLOG_POSTS));
      }
    );
    return () => {
      unSub();
      window.removeEventListener("opsiys-blogs-updated", handleLocalUpdate);
    };
  } catch (err) {
    console.warn("Failed to subscribe to blog posts:", err);
    callback(getCachedOrDefault("opsiys_blogs_cache", DEFAULT_BLOG_POSTS));
    return () => {
      window.removeEventListener("opsiys-blogs-updated", handleLocalUpdate);
    };
  }
};

export const saveBlogPost = async (blogData: BlogPostItem) => {
  const currentBlogs = getStorageItem("opsiys_blogs_cache", []);
  
  // 1. Resolve deterministic blog ID (matching existing blog by ID or Slug)
  let blogId = blogData.id;
  if (!blogId) {
    const existingBySlug = currentBlogs.find((b: any) => b.slug === blogData.slug);
    if (existingBySlug && existingBySlug.id) {
      blogId = existingBySlug.id;
    } else {
      blogId = "blog_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7);
    }
  }

  const blogRecord: BlogPostItem = {
    ...blogData,
    id: blogId,
    published: blogData.published ?? true
  };

  // 2. Update local storage cache in place
  const existingIdx = currentBlogs.findIndex(
    (b: any) => (blogId && b.id === blogId) || (blogData.slug && b.slug === blogData.slug)
  );
  if (existingIdx >= 0) {
    currentBlogs[existingIdx] = blogRecord;
  } else {
    currentBlogs.unshift(blogRecord);
  }
  setStorageItem("opsiys_blogs_cache", currentBlogs);
  window.dispatchEvent(new CustomEvent("opsiys-blogs-updated", { detail: currentBlogs }));

  // 3. Save to Firestore using setDoc with explicit doc ID = blogId (prevents duplicate documents)
  try {
    const blogDoc = doc(db, "blog_posts", blogId);
    await setDoc(blogDoc, { ...blogRecord, updatedAt: serverTimestamp() }, { merge: true });
  } catch (err) {
    console.warn("Blog post save fallback notice:", err);
  }
};

export const deleteBlogPost = async (blogId: string, slug?: string) => {
  if (!blogId && !slug) return;

  const targetId = blogId || "";
  const targetSlug = slug || "";

  // 1. Remove from local storage cache immediately
  const currentBlogs = getStorageItem("opsiys_blogs_cache", []);
  const updatedBlogs = currentBlogs.filter((b: any) => {
    const matchId = targetId && b.id === targetId;
    const matchSlug = targetSlug && b.slug === targetSlug;
    return !matchId && !matchSlug;
  });
  setStorageItem("opsiys_blogs_cache", updatedBlogs);
  window.dispatchEvent(new CustomEvent("opsiys-blogs-updated", { detail: updatedBlogs }));

  // 2. Delete document from Firestore by ID & Slug query
  try {
    if (targetId) {
      const blogDoc = doc(db, "blog_posts", targetId);
      await deleteDoc(blogDoc);
    }
    if (targetSlug) {
      const blogsRef = collection(db, "blog_posts");
      const q = query(blogsRef, where("slug", "==", targetSlug));
      const snapshot = await getDocs(q);
      snapshot.forEach(async (d) => {
        await deleteDoc(d.ref);
      });
    }
  } catch (err) {
    console.warn("Blog post deletion notice:", err);
  }
};

// --- Dynamic Admin Users Service ---

export const DEFAULT_ADMIN_EMAILS = [
  "adityaofficial9918@gmail.com",
  "kushwahakunal644@gmail.com",
  "krishnatktr1@gmail.com"
];

export interface AdminUserAccount {
  id?: string;
  email: string;
  role: string;
  addedBy?: string;
  addedAt?: string;
}

export const subscribeToAdminEmails = (callback: (admins: AdminUserAccount[]) => void) => {
  const defaultAccounts: AdminUserAccount[] = DEFAULT_ADMIN_EMAILS.map(email => ({
    id: "default_" + email.replace(/[^a-z0-9]/gi, "_"),
    email,
    role: email === "adityaofficial9918@gmail.com" ? "Super Admin" : "Master Admin",
    addedBy: "System Core",
    addedAt: "Default System Admin"
  }));

  const storedAdmins = getStorageItem("opsiys_admin_accounts", defaultAccounts);
  // Ensure default emails are always present
  const mergedMap = new Map<string, AdminUserAccount>();
  defaultAccounts.forEach(a => mergedMap.set(a.email.toLowerCase().trim(), a));
  storedAdmins.forEach((a: AdminUserAccount) => {
    if (a.email) mergedMap.set(a.email.toLowerCase().trim(), a);
  });
  const mergedList = Array.from(mergedMap.values());
  callback(mergedList);

  try {
    const adminsRef = collection(db, "admin_users");
    return onSnapshot(
      adminsRef,
      (snapshot) => {
        const firestoreAdmins = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as AdminUserAccount));
        const finalMap = new Map<string, AdminUserAccount>();
        defaultAccounts.forEach(a => finalMap.set(a.email.toLowerCase().trim(), a));
        firestoreAdmins.forEach(a => {
          if (a.email) finalMap.set(a.email.toLowerCase().trim(), a);
        });
        const finalList = Array.from(finalMap.values());
        setStorageItem("opsiys_admin_accounts", finalList);
        callback(finalList);
      },
      (err) => {
        console.warn("Admin accounts subscription notice:", err?.message || err);
        callback(getStorageItem("opsiys_admin_accounts", mergedList));
      }
    );
  } catch (err) {
    console.warn("Failed to subscribe to admin accounts:", err);
    return () => {};
  }
};

export const addAdminEmail = async (email: string, role: string = "Master Admin", addedBy: string = "Super Admin") => {
  const cleanEmail = email.toLowerCase().trim();
  if (!cleanEmail) return;

  const currentAdmins = getStorageItem("opsiys_admin_accounts", []);
  const newAccount: AdminUserAccount = {
    id: "admin_" + Date.now() + "_" + Math.random().toString(36).substring(2, 6),
    email: cleanEmail,
    role,
    addedBy,
    addedAt: new Date().toISOString().split("T")[0]
  };

  const existingIdx = currentAdmins.findIndex((a: any) => a.email.toLowerCase().trim() === cleanEmail);
  if (existingIdx >= 0) {
    currentAdmins[existingIdx] = newAccount;
  } else {
    currentAdmins.push(newAccount);
  }
  setStorageItem("opsiys_admin_accounts", currentAdmins);

  try {
    const adminDoc = doc(db, "admin_users", cleanEmail.replace(/[^a-z0-9]/gi, "_"));
    await setDoc(adminDoc, {
      ...newAccount,
      updatedAt: serverTimestamp()
    }, { merge: true });
  } catch (err) {
    console.warn("Admin addition fallback notice:", err);
  }
};

export const removeAdminEmail = async (email: string) => {
  const cleanEmail = email.toLowerCase().trim();
  if (cleanEmail === "adityaofficial9918@gmail.com") {
    throw new Error("Primary Super Admin account cannot be removed.");
  }

  const currentAdmins = getStorageItem("opsiys_admin_accounts", []);
  const filtered = currentAdmins.filter((a: any) => a.email.toLowerCase().trim() !== cleanEmail);
  setStorageItem("opsiys_admin_accounts", filtered);

  try {
    const adminDoc = doc(db, "admin_users", cleanEmail.replace(/[^a-z0-9]/gi, "_"));
    await deleteDoc(adminDoc);
  } catch (err) {
    console.warn("Admin deletion fallback notice:", err);
  }
};


