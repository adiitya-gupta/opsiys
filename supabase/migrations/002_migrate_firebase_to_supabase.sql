-- ==============================================================================
-- OPSIYS Website — Complete Firebase to Supabase Migration Script (V2 Robust)
-- Project Ref: kcvbsjppdtzsjnmacgpw
-- Generated At: 2026-10-18T11:25:35.381Z
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
-- Insert login accounts into auth.users (uses WHERE NOT EXISTS to prevent conflict errors)
INSERT INTO auth.users (
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
  'adityaofficial9918@gmail.com',
  crypt('OpsiysUser2026!', gen_salt('bf')),
  NOW(),
  '{"provider":"email","providers":["email"]}'::jsonb,
  json_build_object('full_name', 'Aditya Gupta', 'display_name', 'Aditya Gupta', 'phone', '7355583185', 'company', '')::jsonb,
  NOW(),
  NOW(),
  '',
  ''
WHERE NOT EXISTS (
  SELECT 1 FROM auth.users WHERE email = 'adityaofficial9918@gmail.com'
);

INSERT INTO auth.users (
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
  'kushwahakunal645@gmail.com',
  crypt('OpsiysUser2026!', gen_salt('bf')),
  NOW(),
  '{"provider":"email","providers":["email"]}'::jsonb,
  json_build_object('full_name', 'Kunal Kushwaha', 'display_name', 'Kunal Kushwaha', 'phone', '8429446870', 'company', '')::jsonb,
  NOW(),
  NOW(),
  '',
  ''
WHERE NOT EXISTS (
  SELECT 1 FROM auth.users WHERE email = 'kushwahakunal645@gmail.com'
);

INSERT INTO auth.users (
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
  'kushwahakunal644@gmail.com',
  crypt('OpsiysUser2026!', gen_salt('bf')),
  NOW(),
  '{"provider":"email","providers":["email"]}'::jsonb,
  json_build_object('full_name', 'Kunal Kushwaha', 'display_name', 'Kunal Kushwaha', 'phone', '8429446870', 'company', 'DriveX')::jsonb,
  NOW(),
  NOW(),
  '',
  ''
WHERE NOT EXISTS (
  SELECT 1 FROM auth.users WHERE email = 'kushwahakunal644@gmail.com'
);

INSERT INTO auth.users (
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
  'opsiyss@gmail.com',
  crypt('OpsiysUser2026!', gen_salt('bf')),
  NOW(),
  '{"provider":"email","providers":["email"]}'::jsonb,
  json_build_object('full_name', '', 'display_name', '', 'phone', '8808705136', 'company', '')::jsonb,
  NOW(),
  NOW(),
  '',
  ''
WHERE NOT EXISTS (
  SELECT 1 FROM auth.users WHERE email = 'opsiyss@gmail.com'
);

INSERT INTO auth.users (
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
  'hellodavid@gmail.com',
  crypt('OpsiysUser2026!', gen_salt('bf')),
  NOW(),
  '{"provider":"email","providers":["email"]}'::jsonb,
  json_build_object('full_name', 'Aditya Gupta', 'display_name', 'Aditya Gupta', 'phone', '8808705136', 'company', '')::jsonb,
  NOW(),
  NOW(),
  '',
  ''
WHERE NOT EXISTS (
  SELECT 1 FROM auth.users WHERE email = 'hellodavid@gmail.com'
);

INSERT INTO auth.users (
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
  'testuser_1742350000@opsiys.com',
  crypt('OpsiysUser2026!', gen_salt('bf')),
  NOW(),
  '{"provider":"email","providers":["email"]}'::jsonb,
  json_build_object('full_name', 'Aditya Verification', 'display_name', 'Aditya Verification', 'phone', '9876543210', 'company', '')::jsonb,
  NOW(),
  NOW(),
  '',
  ''
WHERE NOT EXISTS (
  SELECT 1 FROM auth.users WHERE email = 'testuser_1742350000@opsiys.com'
);

INSERT INTO auth.users (
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
  'kushwahakunal1970@gmail.com',
  crypt('OpsiysUser2026!', gen_salt('bf')),
  NOW(),
  '{"provider":"email","providers":["email"]}'::jsonb,
  json_build_object('full_name', 'Kunal', 'display_name', 'Kunal', 'phone', '8429446870', 'company', '')::jsonb,
  NOW(),
  NOW(),
  '',
  ''
WHERE NOT EXISTS (
  SELECT 1 FROM auth.users WHERE email = 'kushwahakunal1970@gmail.com'
);

INSERT INTO auth.users (
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
  'test_runner@opsiys.com',
  crypt('OpsiysUser2026!', gen_salt('bf')),
  NOW(),
  '{"provider":"email","providers":["email"]}'::jsonb,
  json_build_object('full_name', 'Test Runner User', 'display_name', 'Test Runner User', 'phone', '', 'company', '')::jsonb,
  NOW(),
  NOW(),
  '',
  ''
WHERE NOT EXISTS (
  SELECT 1 FROM auth.users WHERE email = 'test_runner@opsiys.com'
);

INSERT INTO auth.users (
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
  'aditya@opsiys.com',
  crypt('OpsiysUser2026!', gen_salt('bf')),
  NOW(),
  '{"provider":"email","providers":["email"]}'::jsonb,
  json_build_object('full_name', 'aditya', 'display_name', 'aditya', 'phone', '', 'company', '')::jsonb,
  NOW(),
  NOW(),
  '',
  ''
WHERE NOT EXISTS (
  SELECT 1 FROM auth.users WHERE email = 'aditya@opsiys.com'
);

INSERT INTO auth.users (
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
  'frontiernitesh@gmail.com',
  crypt('OpsiysUser2026!', gen_salt('bf')),
  NOW(),
  '{"provider":"email","providers":["email"]}'::jsonb,
  json_build_object('full_name', 'Frontier Nitesh', 'display_name', 'Frontier Nitesh', 'phone', '', 'company', '')::jsonb,
  NOW(),
  NOW(),
  '',
  ''
WHERE NOT EXISTS (
  SELECT 1 FROM auth.users WHERE email = 'frontiernitesh@gmail.com'
);

INSERT INTO auth.users (
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
  'admin@opsiys.com',
  crypt('OpsiysUser2026!', gen_salt('bf')),
  NOW(),
  '{"provider":"email","providers":["email"]}'::jsonb,
  json_build_object('full_name', 'admin', 'display_name', 'admin', 'phone', '', 'company', '')::jsonb,
  NOW(),
  NOW(),
  '',
  ''
WHERE NOT EXISTS (
  SELECT 1 FROM auth.users WHERE email = 'admin@opsiys.com'
);

INSERT INTO auth.users (
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
  'krishnatktr@gmail.com',
  crypt('OpsiysUser2026!', gen_salt('bf')),
  NOW(),
  '{"provider":"email","providers":["email"]}'::jsonb,
  json_build_object('full_name', 'krishna kumar', 'display_name', 'krishna kumar', 'phone', '', 'company', '')::jsonb,
  NOW(),
  NOW(),
  '',
  ''
WHERE NOT EXISTS (
  SELECT 1 FROM auth.users WHERE email = 'krishnatktr@gmail.com'
);

INSERT INTO auth.users (
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
  'member@opsiys.com',
  crypt('OpsiysUser2026!', gen_salt('bf')),
  NOW(),
  '{"provider":"email","providers":["email"]}'::jsonb,
  json_build_object('full_name', 'member', 'display_name', 'member', 'phone', '', 'company', '')::jsonb,
  NOW(),
  NOW(),
  '',
  ''
WHERE NOT EXISTS (
  SELECT 1 FROM auth.users WHERE email = 'member@opsiys.com'
);

-- ==============================================================================
-- 6. MIGRATE FIREBASE PROFILES INTO public.profiles
-- ==============================================================================
INSERT INTO public.profiles (
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
  'adityaofficial9918@gmail.com',
  'Aditya Gupta',
  '7355583185',
  '+91',
  false,
  '',
  false,
  '3a8206b6-733f-48c9-b221-a0ba76469e34',
  NOW(),
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM public.profiles WHERE email = 'adityaofficial9918@gmail.com'
);

UPDATE public.profiles SET
  display_name = CASE WHEN 'Aditya Gupta' <> '' THEN 'Aditya Gupta' ELSE public.profiles.display_name END,
  phone = CASE WHEN '7355583185' <> '' THEN '7355583185' ELSE public.profiles.phone END,
  company = CASE WHEN '' <> '' THEN '' ELSE public.profiles.company END,
  wacrm_welcome_sent = false,
  legacy_firebase_uid = '3a8206b6-733f-48c9-b221-a0ba76469e34',
  updated_at = NOW()
WHERE email = 'adityaofficial9918@gmail.com';

INSERT INTO public.profiles (
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
  'kushwahakunal645@gmail.com',
  'Kunal Kushwaha',
  '8429446870',
  '+91',
  false,
  '',
  false,
  'BU56kJs5pyfJPm7492hb3yj3mcw2',
  NOW(),
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM public.profiles WHERE email = 'kushwahakunal645@gmail.com'
);

UPDATE public.profiles SET
  display_name = CASE WHEN 'Kunal Kushwaha' <> '' THEN 'Kunal Kushwaha' ELSE public.profiles.display_name END,
  phone = CASE WHEN '8429446870' <> '' THEN '8429446870' ELSE public.profiles.phone END,
  company = CASE WHEN '' <> '' THEN '' ELSE public.profiles.company END,
  wacrm_welcome_sent = false,
  legacy_firebase_uid = 'BU56kJs5pyfJPm7492hb3yj3mcw2',
  updated_at = NOW()
WHERE email = 'kushwahakunal645@gmail.com';

INSERT INTO public.profiles (
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
  'kushwahakunal644@gmail.com',
  'Kunal Kushwaha',
  '8429446870',
  '+91',
  false,
  'DriveX',
  true,
  'WJhMuEpsnbMDD47NjfyYo7UQL5F3',
  NOW(),
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM public.profiles WHERE email = 'kushwahakunal644@gmail.com'
);

UPDATE public.profiles SET
  display_name = CASE WHEN 'Kunal Kushwaha' <> '' THEN 'Kunal Kushwaha' ELSE public.profiles.display_name END,
  phone = CASE WHEN '8429446870' <> '' THEN '8429446870' ELSE public.profiles.phone END,
  company = CASE WHEN 'DriveX' <> '' THEN 'DriveX' ELSE public.profiles.company END,
  wacrm_welcome_sent = true,
  legacy_firebase_uid = 'WJhMuEpsnbMDD47NjfyYo7UQL5F3',
  updated_at = NOW()
WHERE email = 'kushwahakunal644@gmail.com';

INSERT INTO public.profiles (
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
  'opsiyss@gmail.com',
  '',
  '8808705136',
  '+91',
  false,
  '',
  false,
  'b99be81c-8770-4f1d-ae9b-4c8690591d65',
  NOW(),
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM public.profiles WHERE email = 'opsiyss@gmail.com'
);

UPDATE public.profiles SET
  display_name = CASE WHEN '' <> '' THEN '' ELSE public.profiles.display_name END,
  phone = CASE WHEN '8808705136' <> '' THEN '8808705136' ELSE public.profiles.phone END,
  company = CASE WHEN '' <> '' THEN '' ELSE public.profiles.company END,
  wacrm_welcome_sent = false,
  legacy_firebase_uid = 'b99be81c-8770-4f1d-ae9b-4c8690591d65',
  updated_at = NOW()
WHERE email = 'opsiyss@gmail.com';

INSERT INTO public.profiles (
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
  'hellodavid@gmail.com',
  'Aditya Gupta',
  '8808705136',
  '+91',
  false,
  '',
  true,
  'dPTEvw4rqvPfmDLqH5ZIEMdf7Ua2',
  NOW(),
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM public.profiles WHERE email = 'hellodavid@gmail.com'
);

UPDATE public.profiles SET
  display_name = CASE WHEN 'Aditya Gupta' <> '' THEN 'Aditya Gupta' ELSE public.profiles.display_name END,
  phone = CASE WHEN '8808705136' <> '' THEN '8808705136' ELSE public.profiles.phone END,
  company = CASE WHEN '' <> '' THEN '' ELSE public.profiles.company END,
  wacrm_welcome_sent = true,
  legacy_firebase_uid = 'dPTEvw4rqvPfmDLqH5ZIEMdf7Ua2',
  updated_at = NOW()
WHERE email = 'hellodavid@gmail.com';

INSERT INTO public.profiles (
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
  'testuser_1742350000@opsiys.com',
  'Aditya Verification',
  '9876543210',
  '+91',
  false,
  '',
  true,
  'fQL2h9VLllRo50rmyA7Nye4hclc2',
  NOW(),
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM public.profiles WHERE email = 'testuser_1742350000@opsiys.com'
);

UPDATE public.profiles SET
  display_name = CASE WHEN 'Aditya Verification' <> '' THEN 'Aditya Verification' ELSE public.profiles.display_name END,
  phone = CASE WHEN '9876543210' <> '' THEN '9876543210' ELSE public.profiles.phone END,
  company = CASE WHEN '' <> '' THEN '' ELSE public.profiles.company END,
  wacrm_welcome_sent = true,
  legacy_firebase_uid = 'fQL2h9VLllRo50rmyA7Nye4hclc2',
  updated_at = NOW()
WHERE email = 'testuser_1742350000@opsiys.com';

INSERT INTO public.profiles (
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
  'kushwahakunal1970@gmail.com',
  'Kunal',
  '8429446870',
  '+91',
  false,
  '',
  true,
  'qtPM0fKxIqZaKUDiOUauiLfDmnP2',
  NOW(),
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM public.profiles WHERE email = 'kushwahakunal1970@gmail.com'
);

UPDATE public.profiles SET
  display_name = CASE WHEN 'Kunal' <> '' THEN 'Kunal' ELSE public.profiles.display_name END,
  phone = CASE WHEN '8429446870' <> '' THEN '8429446870' ELSE public.profiles.phone END,
  company = CASE WHEN '' <> '' THEN '' ELSE public.profiles.company END,
  wacrm_welcome_sent = true,
  legacy_firebase_uid = 'qtPM0fKxIqZaKUDiOUauiLfDmnP2',
  updated_at = NOW()
WHERE email = 'kushwahakunal1970@gmail.com';

-- ==============================================================================
-- 7. MIGRATE FIREBASE LEADS INTO public.leads
-- ==============================================================================
INSERT INTO public.leads (
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
  'Kunal',
  'kushwahakunal1970@gmail.com',
  '+91 8429446870',
  'Direct Sign Up',
  'Website Partner Registration',
  '',
  '',
  '',
  'qualified',
  'qtPM0fKxIqZaKUDiOUauiLfDmnP2',
  true,
  '28M3fhB7YJu4gyujfLdP',
  NOW(),
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM public.leads WHERE legacy_firebase_id = '28M3fhB7YJu4gyujfLdP'
);
INSERT INTO public.leads (
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
  'Aditya Gupta',
  'adityaofficial9918@gmail.com',
  '+91 7355583185',
  'Direct Sign Up',
  'Website Partner Registration',
  '',
  '',
  '',
  'qualified',
  'faaeebec-41dc-4adb-aaa7-8d40454f9a4e',
  false,
  '3x2EYrmhi5nGTi11klOj',
  NOW(),
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM public.leads WHERE legacy_firebase_id = '3x2EYrmhi5nGTi11klOj'
);
INSERT INTO public.leads (
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
  'Aditya Gupta',
  'adityaofficial9918@gmail.com',
  '+91 7355583185',
  'Direct Sign Up',
  'Website Partner Registration',
  '',
  '',
  '',
  'qualified',
  '955d4a86-2415-4df3-9baa-016cfe70cbb3',
  false,
  '5oNj3vNP5TvCDtGr8rh2',
  NOW(),
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM public.leads WHERE legacy_firebase_id = '5oNj3vNP5TvCDtGr8rh2'
);
INSERT INTO public.leads (
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
  'Aditya Gupta',
  'adityaofficial9918@gmail.com',
  '+91 7355583185',
  'Direct Sign Up',
  'Website Partner Registration',
  '',
  '',
  '',
  'qualified',
  '6adfdf73-4b7c-43cf-bf55-3b49eaf7c79a',
  false,
  '6jiT5Sq7p3mOn6G9rLIA',
  NOW(),
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM public.leads WHERE legacy_firebase_id = '6jiT5Sq7p3mOn6G9rLIA'
);
INSERT INTO public.leads (
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
  'satya',
  'aaaltoofaltoo@gmail.com',
  '+91 8808705136',
  'Direct Sign Up',
  'Website Partner Registration',
  '',
  '',
  '',
  'qualified',
  'c1cd82b9-df95-435f-8ab4-fd50983dc2e8',
  false,
  'B3g66PPR5MU1dQAfOZQT',
  NOW(),
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM public.leads WHERE legacy_firebase_id = 'B3g66PPR5MU1dQAfOZQT'
);
INSERT INTO public.leads (
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
  'Aditya Gupta',
  'hellodavid@gmail.com',
  '+91 8808705136',
  'Partner Portal',
  'Partner Onboarding',
  '',
  '',
  '',
  'qualified',
  'dPTEvw4rqvPfmDLqH5ZIEMdf7Ua2',
  false,
  'DMkTbZv2DUORFRZ5apF4',
  NOW(),
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM public.leads WHERE legacy_firebase_id = 'DMkTbZv2DUORFRZ5apF4'
);
INSERT INTO public.leads (
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
  'Demon Desire',
  'esconder.estricto@gmail.com',
  '+917355583185',
  'college',
  'AI Automation',
  'fghjk',
  'Medium (1-4 weeks)',
  'sdfghuio',
  'new',
  '1JnK5ONaaBYB3vAJW2Y7Pr2ZHKr2',
  false,
  'F3r4xTep9VL0BbNaculv',
  NOW(),
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM public.leads WHERE legacy_firebase_id = 'F3r4xTep9VL0BbNaculv'
);
INSERT INTO public.leads (
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
  'Aditya Gupta',
  'adityaofficial9918@gmail.com',
  '+91 7355583185',
  'Partner Portal',
  'Partner Onboarding',
  '',
  '',
  '',
  'qualified',
  '3a8206b6-733f-48c9-b221-a0ba76469e34',
  false,
  'FbtRVc3vvbbLUr2h0E5A',
  NOW(),
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM public.leads WHERE legacy_firebase_id = 'FbtRVc3vvbbLUr2h0E5A'
);
INSERT INTO public.leads (
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
  'Aditya Gupta',
  'aidrew4u@gmail.com',
  '+91 7355583185',
  'Direct Sign Up',
  'Website Partner Registration',
  '',
  '',
  '',
  'qualified',
  'c8e2d294-e938-4081-a297-a66ada5df274',
  false,
  'KRWPx8PFvvKpm1uD7jK8',
  NOW(),
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM public.leads WHERE legacy_firebase_id = 'KRWPx8PFvvKpm1uD7jK8'
);
INSERT INTO public.leads (
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
  'Aditya Gupta',
  'adityaofficial9918@gmail.com',
  '+91 7355583185',
  'Partner Portal',
  'Partner Onboarding',
  '',
  '',
  '',
  'qualified',
  '3a8206b6-733f-48c9-b221-a0ba76469e34',
  false,
  'LqF81UPEdmsL3xa8f8BZ',
  NOW(),
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM public.leads WHERE legacy_firebase_id = 'LqF81UPEdmsL3xa8f8BZ'
);
INSERT INTO public.leads (
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
  'Aditya Gupta',
  'adityaofficial9918@gmail.com',
  '+917355583185',
  'college',
  'AI Automation',
  'ghjkl',
  'Medium (1-4 weeks)',
  'cfvgbhjkl',
  'new',
  'Y5vSyPoAcPTaZROD9hQO4upgIQX2',
  false,
  'Sg45YsQ3dDjzBSsXJ8fX',
  NOW(),
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM public.leads WHERE legacy_firebase_id = 'Sg45YsQ3dDjzBSsXJ8fX'
);
INSERT INTO public.leads (
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
  'Aditya Verification',
  'testuser_1742350000@opsiys.com',
  '+91 9876543210',
  'Direct Sign Up',
  'Website Partner Registration',
  '',
  '',
  '',
  'qualified',
  'fQL2h9VLllRo50rmyA7Nye4hclc2',
  true,
  'SswyN2Lz61iidgoGugQe',
  NOW(),
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM public.leads WHERE legacy_firebase_id = 'SswyN2Lz61iidgoGugQe'
);
INSERT INTO public.leads (
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
  'Aditya Gupta',
  'adityaofficial9918@gmail.com',
  '+91 7355583185',
  'Partner Portal',
  'Partner Onboarding',
  '',
  '',
  '',
  'qualified',
  '3a8206b6-733f-48c9-b221-a0ba76469e34',
  false,
  'ZkdGh7h52j71tkdJYxpP',
  NOW(),
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM public.leads WHERE legacy_firebase_id = 'ZkdGh7h52j71tkdJYxpP'
);
INSERT INTO public.leads (
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
  'krishna kumar',
  'krishnatktr@gmail.com',
  '+919369170812',
  'Opsiys',
  'AI Automation',
  '500000',
  'High (Immediate)',
  '..',
  'new',
  'iRcR2NbpEIOerMjazhU25jFHdny2',
  false,
  'ZpQIFRYHyPlE5oxAIwyR',
  NOW(),
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM public.leads WHERE legacy_firebase_id = 'ZpQIFRYHyPlE5oxAIwyR'
);
INSERT INTO public.leads (
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
  'Aditya Gupta',
  'adityaofficial9918@gmail.com',
  '7355583185',
  'Jedhjehdhdhdhe',
  'AI Automation',
  'Didjjdud',
  'Medium (1-4 weeks)',
  'Djdjjdjdjd',
  'new',
  '',
  false,
  'a2Vn8IVfq9a2Of7rsaem',
  NOW(),
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM public.leads WHERE legacy_firebase_id = 'a2Vn8IVfq9a2Of7rsaem'
);
INSERT INTO public.leads (
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
  'Kunal Kushwaha',
  'kushwahakunal645@gmail.com',
  '+91 8429446870',
  'Direct Sign Up',
  'Website Partner Registration',
  '',
  '',
  '',
  'qualified',
  'BU56kJs5pyfJPm7492hb3yj3mcw2',
  true,
  'arBeooXqsPZNV1A2L6Ao',
  NOW(),
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM public.leads WHERE legacy_firebase_id = 'arBeooXqsPZNV1A2L6Ao'
);
INSERT INTO public.leads (
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
  'Kunal',
  'kushwahakunal1970@gmail.com',
  '+91 8429446870',
  'Partner Portal',
  'Partner Onboarding',
  '',
  '',
  '',
  'qualified',
  'qtPM0fKxIqZaKUDiOUauiLfDmnP2',
  false,
  'ctcM8hqfhYj5RbcgIwx3',
  NOW(),
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM public.leads WHERE legacy_firebase_id = 'ctcM8hqfhYj5RbcgIwx3'
);
INSERT INTO public.leads (
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
  'Aditya Gupta',
  'adityaofficial9918@gmail.com',
  '+91 7355583185',
  'Partner Portal',
  'Partner Onboarding',
  '',
  '',
  '',
  'qualified',
  '3a8206b6-733f-48c9-b221-a0ba76469e34',
  false,
  'deacC35ODxfukmgT1IvN',
  NOW(),
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM public.leads WHERE legacy_firebase_id = 'deacC35ODxfukmgT1IvN'
);
INSERT INTO public.leads (
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
  'Aditya Gupta',
  'adityaofficial9918@gmail.com',
  '+91 7355583185',
  'Partner Portal',
  'Partner Onboarding',
  '',
  '',
  '',
  'qualified',
  '3a8206b6-733f-48c9-b221-a0ba76469e34',
  false,
  'fvcNf1gXwZwlLxe53oq2',
  NOW(),
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM public.leads WHERE legacy_firebase_id = 'fvcNf1gXwZwlLxe53oq2'
);
INSERT INTO public.leads (
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
  'Aditya Verification',
  'testuser_1742350000@opsiys.com',
  '+91 9876543210',
  'Partner Portal',
  'Partner Onboarding',
  '',
  '',
  '',
  'qualified',
  'fQL2h9VLllRo50rmyA7Nye4hclc2',
  false,
  'n0JRuYKhN5CO7zmtHQHj',
  NOW(),
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM public.leads WHERE legacy_firebase_id = 'n0JRuYKhN5CO7zmtHQHj'
);
INSERT INTO public.leads (
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
  'Kunal Kushwaha',
  'kushwahakunal644@gmail.com',
  '+918429446870',
  'Google Partner Sign Up',
  'Website Partner Registration',
  '5000',
  'Low (Planning)',
  'na ',
  'qualified',
  'WJhMuEpsnbMDD47NjfyYo7UQL5F3',
  true,
  'tqnHzIdx1uchZU2d9ktO',
  NOW(),
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM public.leads WHERE legacy_firebase_id = 'tqnHzIdx1uchZU2d9ktO'
);
INSERT INTO public.leads (
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
  'satyaa',
  'opsiyss@gmail.com',
  '+91 8808705136',
  'Direct Sign Up',
  'Website Partner Registration',
  '',
  '',
  '',
  'qualified',
  'b99be81c-8770-4f1d-ae9b-4c8690591d65',
  false,
  'u0vDvDlrKsuIg6YvaHsr',
  NOW(),
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM public.leads WHERE legacy_firebase_id = 'u0vDvDlrKsuIg6YvaHsr'
);
INSERT INTO public.leads (
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
  'Aditya Gupta',
  'hellodavid@gmail.com',
  '+91 8808705136',
  'Direct Sign Up',
  'Website Partner Registration',
  '',
  '',
  '',
  'qualified',
  'dPTEvw4rqvPfmDLqH5ZIEMdf7Ua2',
  true,
  'uX4uWrVU6VZnJHMMZ388',
  NOW(),
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM public.leads WHERE legacy_firebase_id = 'uX4uWrVU6VZnJHMMZ388'
);
INSERT INTO public.leads (
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
  'Aditya Gupta',
  'adityaofficial9918@gmail.com',
  '+91 7355583185',
  'Partner Portal',
  'Partner Onboarding',
  '',
  '',
  '',
  'qualified',
  '3a8206b6-733f-48c9-b221-a0ba76469e34',
  false,
  'vXkxoHHv0plt0Y5kiw4b',
  NOW(),
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM public.leads WHERE legacy_firebase_id = 'vXkxoHHv0plt0Y5kiw4b'
);
INSERT INTO public.leads (
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
  'Adii',
  'aaaltoofaltoo@gmail.com',
  '+91 8808705136',
  'Direct Sign Up',
  'Website Partner Registration',
  '',
  '',
  '',
  'qualified',
  'b12fa135-a872-453e-b26a-dd3d3f03105e',
  false,
  'w37GtKiW9lALJljVbWdV',
  NOW(),
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM public.leads WHERE legacy_firebase_id = 'w37GtKiW9lALJljVbWdV'
);
INSERT INTO public.leads (
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
  'Aditya Gupta',
  'adityaofficial9918@gmail.com',
  '+917355583185',
  'college',
  'AI Automation',
  '56789',
  'Medium (1-4 weeks)',
  'mkmdkmkdldm',
  'new',
  '1JnK5ONaaBYB3vAJW2Y7Pr2ZHKr2',
  false,
  'xZnNLXwabsOO1PGOwziT',
  NOW(),
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM public.leads WHERE legacy_firebase_id = 'xZnNLXwabsOO1PGOwziT'
);
INSERT INTO public.leads (
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
  'Kunal Kushwaha',
  'kushwahakunal645@gmail.com',
  '+91 8429446870',
  'Partner Portal',
  'Partner Onboarding',
  '',
  '',
  '',
  'qualified',
  'BU56kJs5pyfJPm7492hb3yj3mcw2',
  false,
  'zEKbZocTuoJSGt8Yqaep',
  NOW(),
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM public.leads WHERE legacy_firebase_id = 'zEKbZocTuoJSGt8Yqaep'
);
