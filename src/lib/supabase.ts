/// <reference types="vite/client" />
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { db } from './firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

// Helper to sanitize Supabase URL in case dashboard URL was provided
function formatSupabaseUrl(rawUrl?: string): string {
  const fallback = "https://kcvbsjppdtzsjnmacgpw.supabase.co";
  if (!rawUrl) return fallback;
  const trimmed = rawUrl.trim().replace(/\/+$/, "");

  // If user passed dashboard link like https://supabase.com/dashboard/project/kcvbsjppdtzsjnmacgpw
  const dashboardMatch = trimmed.match(/dashboard\/project\/([a-zA-Z0-9_-]+)/);
  if (dashboardMatch) {
    return `https://${dashboardMatch[1]}.supabase.co`;
  }

  // If user passed only the project ref like "kcvbsjppdtzsjnmacgpw"
  if (/^[a-zA-Z0-9_-]{15,30}$/.test(trimmed)) {
    return `https://${trimmed}.supabase.co`;
  }

  // Ensure https:// prefix
  if (!trimmed.startsWith("http://") && !trimmed.startsWith("https://")) {
    return `https://${trimmed}`;
  }

  return trimmed;
}

// Environment variables for Supabase
const supabaseUrl = formatSupabaseUrl(import.meta.env.VITE_SUPABASE_URL);
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "sb_publishable_tSG_0zzcaEtyy8JGBAryEg_ocEnXqou";

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: window.localStorage,
    storageKey: 'opsiys-supabase-auth-token',
  },
});

// Normalized User interface compatible with both Firebase User callers and Supabase
export interface NormalizedUser {
  id: string;             // Supabase UUID
  uid: string;            // Aliased to id for 100% backward compatibility
  email: string;
  displayName: string;
  photoURL: string;
  phone?: string;
  phoneCountryCode?: string;
  phoneVerified?: boolean;
  emailVerified: boolean;
  rawUser?: any;
  getIdToken?: (forceRefresh?: boolean) => Promise<string>;
}

/**
 * Normalizes a Supabase user object into the standard NormalizedUser format
 */
export const normalizeSupabaseUser = (supabaseUser: any): NormalizedUser | null => {
  if (!supabaseUser) return null;
  const metadata = supabaseUser.user_metadata || {};
  const displayName =
    metadata.full_name ||
    metadata.name ||
    metadata.display_name ||
    (supabaseUser.email ? supabaseUser.email.split('@')[0] : "Partner");
  const photoURL = metadata.avatar_url || metadata.picture || "";

  return {
    id: supabaseUser.id,
    uid: supabaseUser.id,
    email: supabaseUser.email || "",
    displayName,
    photoURL,
    phone: supabaseUser.phone || metadata.phone || "",
    phoneCountryCode: metadata.phone_country_code || "+91",
    phoneVerified: Boolean(supabaseUser.phone_confirmed_at || metadata.phone_verified),
    emailVerified: Boolean(supabaseUser.email_confirmed_at),
    rawUser: supabaseUser,
    getIdToken: async () => {
      const { data } = await supabase.auth.getSession();
      return data.session?.access_token || "";
    }
  };
};

/**
 * Google OAuth Sign-In via Supabase Auth
 */
export const signInWithGoogle = async (redirectTo?: string) => {
  try {
    const origin = window.location.origin;
    const defaultDestination = origin.includes("localhost") ? origin : "https://www.opsiys.in";
    const destination = redirectTo || defaultDestination;

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: destination,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });

    if (error) {
      console.error("Supabase Google Sign-In Error:", error.message);
      throw error;
    }
    return data;
  } catch (error) {
    console.error("Google Sign-In Exception:", error);
    throw error;
  }
};

/**
 * Email/Password Sign-In via Supabase Auth
 */
export const signInWithEmail = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return normalizeSupabaseUser(data.user);
};

/**
 * Email/Password Sign-Up via Supabase Auth
 */
export const signUpWithEmail = async (
  email: string, 
  password: string, 
  metadata?: { displayName?: string; phone?: string; phoneCountryCode?: string; company?: string }
) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        display_name: metadata?.displayName,
        full_name: metadata?.displayName,
        phone: metadata?.phone,
        phone_country_code: metadata?.phoneCountryCode || "+91",
        company: metadata?.company,
      }
    }
  });
  if (error) throw error;
  return normalizeSupabaseUser(data.user);
};

/**
 * Sign Out via Supabase Auth
 */
export const logout = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.warn("Supabase SignOut Notice:", error.message);
    }
  } catch (err) {
    console.warn("SignOut Exception:", err);
  }
};

/**
 * Compatibility auth wrapper providing onAuthStateChanged pattern
 */
export const onAuthStateChanged = (
  callback: (user: NormalizedUser | null) => void
) => {
  // 1. Immediately emit current active session if available
  supabase.auth.getSession().then(({ data: { session } }) => {
    callback(normalizeSupabaseUser(session?.user || null));
  }).catch((err) => {
    console.warn("Initial session fetch notice:", err);
    callback(null);
  });

  // 2. Subscribe to auth state updates (sign in, sign out, token refresh)
  const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(normalizeSupabaseUser(session?.user || null));
  });

  return () => {
    subscription.unsubscribe();
  };
};

/**
 * Compatibility auth object for components expecting auth.currentUser
 */
export const auth = {
  get currentUser(): NormalizedUser | null {
    return null;
  },
};

// --- Local Storage Helpers ---
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

// --- User Profile Service with Supabase Database + Firestore Sync ---

export interface UserProfileData {
  displayName?: string;
  company?: string;
  role?: string;
  industry?: string;
  phone?: string;
  phoneCountryCode?: string;
  phoneVerified?: boolean;
  email?: string;
}

/**
 * Fetches user profile from Supabase with email-based legacy migration fallback
 */
export const getUserProfile = async (userId: string, email?: string): Promise<UserProfileData | null> => {
  // 1. Attempt query from Supabase public.profiles
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (!error && data) {
      return {
        displayName: data.display_name,
        company: data.company,
        role: data.role,
        industry: data.industry,
        phone: data.phone,
        phoneCountryCode: data.phone_country_code || "+91",
        phoneVerified: Boolean(data.phone_verified),
        email: data.email,
      };
    }

    // Fallback: If not found by Supabase UUID, lookup by email (for users migrated from Firebase)
    if (email) {
      const { data: emailData, error: emailError } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', email)
        .maybeSingle();

      if (!emailError && emailData) {
        return {
          displayName: emailData.display_name,
          company: emailData.company,
          role: emailData.role,
          industry: emailData.industry,
          phone: emailData.phone,
          phoneCountryCode: emailData.phone_country_code || "+91",
          phoneVerified: Boolean(emailData.phone_verified),
          email: emailData.email,
        };
      }
    }
  } catch (err) {
    console.warn("Supabase profile fetch notice:", err);
  }

  // 2. Fallback to local profiles cache
  const currentProfiles = getStorageItem("opsiys_profiles_cache", []);
  const cached = currentProfiles.find(
    (p: any) => p.id === userId || (email && p.email?.toLowerCase() === email.toLowerCase())
  );
  if (cached) return cached;

  // 3. Fallback to Firestore profiles if previously stored
  try {
    const snap = await getDoc(doc(db, "profiles", userId));
    if (snap.exists()) {
      return snap.data() as UserProfileData;
    }
  } catch {
    // Non-blocking fallback
  }

  return null;
};

/**
 * Updates user profile in Supabase profiles table, local cache, and syncs to Firestore
 */
export const updateProfile = async (
  userId: string,
  profileData: UserProfileData
): Promise<void> => {
  const profileRecord = {
    id: userId,
    ...profileData,
    phoneCountryCode: profileData.phoneCountryCode || "+91",
    phoneVerified: profileData.phoneVerified ?? false,
    updatedAt: new Date().toISOString(),
  };

  // 1. Immediately update local storage cache for instant UI response
  const currentProfiles = getStorageItem("opsiys_profiles_cache", []);
  const existingIdx = currentProfiles.findIndex(
    (p: any) => p.id === userId || (profileData.email && p.email?.toLowerCase() === profileData.email.toLowerCase())
  );
  if (existingIdx >= 0) {
    currentProfiles[existingIdx] = { ...currentProfiles[existingIdx], ...profileRecord };
  } else {
    currentProfiles.push(profileRecord);
  }
  setStorageItem("opsiys_profiles_cache", currentProfiles);

  // 2. Persist to Supabase public.profiles table
  try {
    const payload: any = {
      id: userId,
      updated_at: new Date().toISOString(),
    };
    if (profileData.displayName !== undefined) payload.display_name = profileData.displayName;
    if (profileData.company !== undefined) payload.company = profileData.company;
    if (profileData.role !== undefined) payload.role = profileData.role;
    if (profileData.industry !== undefined) payload.industry = profileData.industry;
    if (profileData.phone !== undefined) payload.phone = profileData.phone;
    if (profileData.phoneCountryCode !== undefined) payload.phone_country_code = profileData.phoneCountryCode;
    if (profileData.phoneVerified !== undefined) payload.phone_verified = profileData.phoneVerified;
    if (profileData.email) payload.email = profileData.email;

    const { error } = await supabase
      .from('profiles')
      .upsert(payload, { onConflict: 'id' });

    if (error) {
      console.warn("Supabase profile upsert notice:", error.message);
    }
  } catch (err) {
    console.warn("Supabase profile update notice:", err);
  }

  // 3. Dual-save to Firestore profiles collection (if Firestore is available)
  // Ensures existing Firestore-based admin dashboards continue to see registered user profiles seamlessly.
  try {
    const profileRef = doc(db, "profiles", userId);
    await setDoc(
      profileRef,
      {
        ...profileData,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  } catch (error) {
    console.warn("Firestore profile sync notice:", error);
  }
};
