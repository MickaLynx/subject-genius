-- Email Subject AI — Supabase Schema
-- Generated: 2026-04-16 | Apply: Supabase SQL Editor

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  email text UNIQUE NOT NULL,
  plan text DEFAULT 'free' CHECK (plan IN ('free', 'pro')),
  credits_used int DEFAULT 0,
  stripe_customer_id text,
  created_at timestamptz DEFAULT now()
);

-- Generation history
CREATE TABLE IF NOT EXISTS generations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  topic text NOT NULL,
  audience text,
  purpose text,
  tone text DEFAULT 'professional',
  count int DEFAULT 5,
  subjects jsonb NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
  stripe_subscription_id text,
  plan text DEFAULT 'free',
  status text DEFAULT 'active',
  current_period_end timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE generations ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_own" ON profiles FOR ALL USING (auth.uid() = id);
CREATE POLICY "generations_own" ON generations FOR ALL USING (user_id = auth.uid());
CREATE POLICY "subscriptions_own" ON subscriptions FOR SELECT USING (user_id = auth.uid());

CREATE INDEX IF NOT EXISTS idx_generations_user ON generations(user_id);
CREATE INDEX IF NOT EXISTS idx_generations_date ON generations(created_at DESC);
