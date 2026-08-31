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
  budget: string;
  projectType: string;
  urgency: string;
  message: string;
  userId?: string;
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
      status: "new",
    });
  } catch (error) {
    console.error("Error submitting lead:", error);
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
