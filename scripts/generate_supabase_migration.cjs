const fs = require('fs');
const path = require('path');

const dumpPath = path.join(__dirname, '..', 'firebase_dump.json');
const dump = JSON.parse(fs.readFileSync(dumpPath, 'utf8'));

let sql = `-- ==============================================================================
-- OPSIYS Website — Complete Firebase to Supabase Migration Script (V2 Robust)
-- Project Ref: kcvbsjppdtzsjnmacgpw
-- Generated At: ${new Date().toISOString()}
-- ==============================================================================

-- 1. Enable required PostgreSQL extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create public.profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  display_name TEXT DEFAULT '',
  avatar_url TEXT DEFAULT '',
  phone_country_code TEXT DEFAULT '+91',
  phone TEXT DEFAULT '',
  phone_verified BOOLEAN DEFAULT FALSE,
  company TEXT DEFAULT '',
  role TEXT DEFAULT 'Partner',
  industry TEXT DEFAULT '',
  wacrm_welcome_sent BOOLEAN DEFAULT FALSE,
  legacy_firebase_uid TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure profiles email is unique and indexed
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'profiles_email_key'
  ) THEN
    ALTER TABLE public.profiles ADD CONSTRAINT profiles_email_key UNIQUE (email);
  END IF;
EXCEPTION
  WHEN OTHERS THEN NULL;
END $$;

CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_phone ON public.profiles(phone);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public and authenticated access to profiles" ON public.profiles;
CREATE POLICY "Allow public and authenticated access to profiles" ON public.profiles FOR ALL USING (true) WITH CHECK (true);

-- 3. Create public.leads table
CREATE TABLE IF NOT EXISTS public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT,
  email TEXT,
  phone TEXT,
  company TEXT,
  project_type TEXT,
  budget TEXT,
  urgency TEXT,
  message TEXT,
  status TEXT DEFAULT 'qualified',
  user_id TEXT,
  source TEXT DEFAULT 'website',
  wacrm_welcome_sent BOOLEAN DEFAULT FALSE,
  legacy_firebase_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_leads_email ON public.leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_phone ON public.leads(phone);

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public and authenticated access to leads" ON public.leads;
CREATE POLICY "Allow public and authenticated access to leads" ON public.leads FOR ALL USING (true) WITH CHECK (true);

-- 4. Automatic profile creation trigger when any new user registers via Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (
    id, 
    email, 
    display_name, 
    avatar_url,
    phone,
    phone_country_code,
    phone_verified,
    company,
    created_at,
    updated_at
  )
  SELECT
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'display_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture', ''),
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    COALESCE(NEW.raw_user_meta_data->>'phone_country_code', '+91'),
    FALSE,
    COALESCE(NEW.raw_user_meta_data->>'company', ''),
    NOW(),
    NOW()
  WHERE NOT EXISTS (SELECT 1 FROM public.profiles WHERE email = NEW.email);

  UPDATE public.profiles SET
    display_name = COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'display_name', public.profiles.display_name),
    phone = CASE WHEN COALESCE(NEW.raw_user_meta_data->>'phone', '') <> '' THEN NEW.raw_user_meta_data->>'phone' ELSE public.profiles.phone END,
    company = CASE WHEN COALESCE(NEW.raw_user_meta_data->>'company', '') <> '' THEN NEW.raw_user_meta_data->>'company' ELSE public.profiles.company END,
    updated_at = NOW()
  WHERE email = NEW.email;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==============================================================================
-- 5. MIGRATE FIREBASE LOGIN ACCOUNTS INTO auth.users
-- ==============================================================================
`;

function escapeSql(str) {
  if (str === null || str === undefined) return 'NULL';
  return "'" + String(str).replace(/'/g, "''") + "'";
}

// Collect unique emails across profiles and users
const accountsMap = new Map();
for (const p of dump.profiles) {
  if (p.email && p.email.includes('@')) {
    accountsMap.set(p.email.toLowerCase().trim(), {
      name: p.displayName || '',
      phone: p.phone || '',
      company: p.company || '',
      firebaseUid: p.id || ''
    });
  }
}
for (const u of dump.users) {
  if (u.email && u.email.includes('@')) {
    const existing = accountsMap.get(u.email.toLowerCase().trim()) || {};
    accountsMap.set(u.email.toLowerCase().trim(), {
      name: u.name || existing.name || '',
      phone: existing.phone || '',
      company: existing.company || '',
      firebaseUid: u.uid || u.id || existing.firebaseUid || ''
    });
  }
}

sql += `-- Insert login accounts into auth.users (uses WHERE NOT EXISTS to prevent conflict errors)\n`;
for (const [email, meta] of accountsMap.entries()) {
  sql += `INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  recovery_token
)
SELECT
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  ${escapeSql(email)},
  crypt('OpsiysUser2026!', gen_salt('bf')),
  NOW(),
  '{"provider":"email","providers":["email"]}'::jsonb,
  json_build_object('full_name', ${escapeSql(meta.name)}, 'display_name', ${escapeSql(meta.name)}, 'phone', ${escapeSql(meta.phone)}, 'company', ${escapeSql(meta.company)})::jsonb,
  NOW(),
  NOW(),
  '',
  ''
WHERE NOT EXISTS (
  SELECT 1 FROM auth.users WHERE email = ${escapeSql(email)}
);\n\n`;
}

sql += `-- ==============================================================================
-- 6. MIGRATE FIREBASE PROFILES INTO public.profiles
-- ==============================================================================
`;

for (const p of dump.profiles) {
  if (!p.email) continue;
  const cleanEmail = p.email.toLowerCase().trim();
  const displayName = p.displayName || '';
  const phone = p.phone || '';
  const countryCode = p.phoneCountryCode || '+91';
  const company = p.company || '';
  const wacrmSent = Boolean(p.wacrmWelcomeSent);
  const firebaseUid = p.id || '';

  sql += `INSERT INTO public.profiles (
  email,
  display_name,
  phone,
  phone_country_code,
  phone_verified,
  company,
  wacrm_welcome_sent,
  legacy_firebase_uid,
  created_at,
  updated_at
)
SELECT
  ${escapeSql(cleanEmail)},
  ${escapeSql(displayName)},
  ${escapeSql(phone)},
  ${escapeSql(countryCode)},
  false,
  ${escapeSql(company)},
  ${wacrmSent},
  ${escapeSql(firebaseUid)},
  NOW(),
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM public.profiles WHERE email = ${escapeSql(cleanEmail)}
);

UPDATE public.profiles SET
  display_name = CASE WHEN ${escapeSql(displayName)} <> '' THEN ${escapeSql(displayName)} ELSE public.profiles.display_name END,
  phone = CASE WHEN ${escapeSql(phone)} <> '' THEN ${escapeSql(phone)} ELSE public.profiles.phone END,
  company = CASE WHEN ${escapeSql(company)} <> '' THEN ${escapeSql(company)} ELSE public.profiles.company END,
  wacrm_welcome_sent = ${wacrmSent},
  legacy_firebase_uid = ${escapeSql(firebaseUid)},
  updated_at = NOW()
WHERE email = ${escapeSql(cleanEmail)};\n\n`;
}

sql += `-- ==============================================================================
-- 7. MIGRATE FIREBASE LEADS INTO public.leads
-- ==============================================================================
`;

for (const l of dump.leads) {
  const name = l.name || '';
  const email = l.email || '';
  const phone = l.phone || '';
  const company = l.company || '';
  const projectType = l.projectType || '';
  const budget = l.budget || '';
  const urgency = l.urgency || '';
  const message = l.message || '';
  const status = l.status || 'qualified';
  const userId = l.userId || '';
  const wacrmSent = Boolean(l.wacrmWelcomeSent);
  const legacyId = l.id || '';

  sql += `INSERT INTO public.leads (
  name,
  email,
  phone,
  company,
  project_type,
  budget,
  urgency,
  message,
  status,
  user_id,
  wacrm_welcome_sent,
  legacy_firebase_id,
  created_at,
  updated_at
)
SELECT
  ${escapeSql(name)},
  ${escapeSql(email)},
  ${escapeSql(phone)},
  ${escapeSql(company)},
  ${escapeSql(projectType)},
  ${escapeSql(budget)},
  ${escapeSql(urgency)},
  ${escapeSql(message)},
  ${escapeSql(status)},
  ${escapeSql(userId)},
  ${wacrmSent},
  ${escapeSql(legacyId)},
  NOW(),
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM public.leads WHERE legacy_firebase_id = ${escapeSql(legacyId)}
);\n`;
}

const outDir = path.join(__dirname, '..', 'supabase', 'migrations');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}
const outPath = path.join(outDir, '002_migrate_firebase_to_supabase.sql');
fs.writeFileSync(outPath, sql);
console.log('SUCCESS: Regenerated ' + outPath + ' (' + sql.length + ' chars)');
