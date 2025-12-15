-- =============================================
-- ENUM TYPES
-- =============================================
CREATE TYPE public.app_role AS ENUM ('admin', 'user');
CREATE TYPE public.deposit_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE public.withdraw_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE public.transaction_type AS ENUM ('deposit', 'withdrawal', 'mining', 'swap', 'referral', 'profit');

-- =============================================
-- PROFILES TABLE
-- =============================================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT NOT NULL,
  email TEXT NOT NULL,
  phone_number TEXT DEFAULT '',
  wallet_address TEXT DEFAULT '',
  balance DECIMAL(20, 8) DEFAULT 0,
  tera_balance DECIMAL(20, 8) DEFAULT 0,
  mining_balance DECIMAL(20, 8) DEFAULT 0,
  earning_profit DECIMAL(20, 8) DEFAULT 0,
  earning_referral DECIMAL(20, 8) DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  mining_active BOOLEAN DEFAULT false,
  last_mining_start TIMESTAMPTZ,
  referral_code TEXT UNIQUE,
  referred_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- =============================================
-- USER ROLES TABLE (CRITICAL FOR SECURITY)
-- =============================================
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role public.app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- =============================================
-- DEPOSITS TABLE
-- =============================================
CREATE TABLE public.deposits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  amount DECIMAL(20, 8) NOT NULL,
  tx_hash TEXT NOT NULL,
  status public.deposit_status DEFAULT 'pending',
  admin_note TEXT,
  processed_by UUID REFERENCES auth.users(id),
  processed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.deposits ENABLE ROW LEVEL SECURITY;

-- =============================================
-- WITHDRAWALS TABLE
-- =============================================
CREATE TABLE public.withdrawals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  amount DECIMAL(20, 8) NOT NULL,
  fee DECIMAL(20, 8) DEFAULT 0,
  final_amount DECIMAL(20, 8) NOT NULL,
  wallet_address TEXT NOT NULL,
  currency TEXT DEFAULT 'TON',
  withdraw_type TEXT DEFAULT 'balance',
  status public.withdraw_status DEFAULT 'pending',
  admin_note TEXT,
  processed_by UUID REFERENCES auth.users(id),
  processed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.withdrawals ENABLE ROW LEVEL SECURITY;

-- =============================================
-- TRANSACTIONS TABLE
-- =============================================
CREATE TABLE public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type public.transaction_type NOT NULL,
  amount DECIMAL(20, 8) NOT NULL,
  fee DECIMAL(20, 8) DEFAULT 0,
  from_currency TEXT,
  to_currency TEXT,
  description TEXT,
  reference_id UUID,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- =============================================
-- MINING SESSIONS TABLE
-- =============================================
CREATE TABLE public.mining_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  start_time TIMESTAMPTZ NOT NULL DEFAULT now(),
  end_time TIMESTAMPTZ,
  initial_balance DECIMAL(20, 8) NOT NULL,
  earned_amount DECIMAL(20, 8) DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.mining_sessions ENABLE ROW LEVEL SECURITY;

-- =============================================
-- REFERRALS TABLE
-- =============================================
CREATE TABLE public.referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  referred_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  bonus_amount DECIMAL(20, 8) DEFAULT 0,
  is_rewarded BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(referrer_id, referred_id)
);

ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;

-- =============================================
-- SETTINGS TABLE
-- =============================================
CREATE TABLE public.settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  description TEXT,
  updated_by UUID REFERENCES auth.users(id),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- =============================================
-- ADMIN LOGS TABLE
-- =============================================
CREATE TABLE public.admin_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  target_type TEXT,
  target_id UUID,
  details JSONB,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.admin_logs ENABLE ROW LEVEL SECURITY;

-- =============================================
-- HELPER FUNCTIONS
-- =============================================

-- Check if user has specific role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(_user_id, 'admin')
$$;

-- Generate unique referral code
CREATE OR REPLACE FUNCTION public.generate_referral_code()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  code TEXT;
  exists_check BOOLEAN;
BEGIN
  LOOP
    code := upper(substring(md5(random()::text) from 1 for 8));
    SELECT EXISTS(SELECT 1 FROM public.profiles WHERE referral_code = code) INTO exists_check;
    EXIT WHEN NOT exists_check;
  END LOOP;
  RETURN code;
END;
$$;

-- Handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Create profile
  INSERT INTO public.profiles (id, username, email, referral_code)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    NEW.email,
    public.generate_referral_code()
  );
  
  -- Assign default user role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  RETURN NEW;
END;
$$;

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- =============================================
-- TRIGGERS
-- =============================================

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_deposits_updated_at
  BEFORE UPDATE ON public.deposits
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_withdrawals_updated_at
  BEFORE UPDATE ON public.withdrawals
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- =============================================
-- RLS POLICIES
-- =============================================

-- Profiles policies
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Admins can update all profiles"
  ON public.profiles FOR UPDATE
  USING (public.is_admin(auth.uid()));

-- User roles policies
CREATE POLICY "Users can view own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
  ON public.user_roles FOR SELECT
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can manage roles"
  ON public.user_roles FOR ALL
  USING (public.is_admin(auth.uid()));

-- Deposits policies
CREATE POLICY "Users can view own deposits"
  ON public.deposits FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all deposits"
  ON public.deposits FOR SELECT
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Users can create deposits"
  ON public.deposits FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can update deposits"
  ON public.deposits FOR UPDATE
  USING (public.is_admin(auth.uid()));

-- Withdrawals policies
CREATE POLICY "Users can view own withdrawals"
  ON public.withdrawals FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all withdrawals"
  ON public.withdrawals FOR SELECT
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Users can create withdrawals"
  ON public.withdrawals FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can update withdrawals"
  ON public.withdrawals FOR UPDATE
  USING (public.is_admin(auth.uid()));

-- Transactions policies
CREATE POLICY "Users can view own transactions"
  ON public.transactions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all transactions"
  ON public.transactions FOR SELECT
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Users can create transactions"
  ON public.transactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Mining sessions policies
CREATE POLICY "Users can view own mining sessions"
  ON public.mining_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all mining sessions"
  ON public.mining_sessions FOR SELECT
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Users can manage own mining sessions"
  ON public.mining_sessions FOR ALL
  USING (auth.uid() = user_id);

-- Referrals policies
CREATE POLICY "Users can view own referrals"
  ON public.referrals FOR SELECT
  USING (auth.uid() = referrer_id OR auth.uid() = referred_id);

CREATE POLICY "Admins can view all referrals"
  ON public.referrals FOR SELECT
  USING (public.is_admin(auth.uid()));

-- Settings policies
CREATE POLICY "Anyone can view settings"
  ON public.settings FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage settings"
  ON public.settings FOR ALL
  USING (public.is_admin(auth.uid()));

-- Admin logs policies
CREATE POLICY "Admins can view logs"
  ON public.admin_logs FOR SELECT
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can create logs"
  ON public.admin_logs FOR INSERT
  WITH CHECK (public.is_admin(auth.uid()));

-- =============================================
-- DEFAULT SETTINGS DATA
-- =============================================

INSERT INTO public.settings (key, value, description) VALUES
  ('mining_rate', '{"daily_percent": 1}', 'Mining profit rate per day'),
  ('ton_to_tera_rate', '{"rate": 10}', '1 TON = X TERA'),
  ('tera_to_ton_rate', '{"rate": 0.084}', '1 TERA = X TON'),
  ('swap_fee', '{"percent": 0.5}', 'Swap fee percentage'),
  ('referral_bonus', '{"percent": 5}', 'Referral bonus percentage'),
  ('min_deposit', '{"amount": 1}', 'Minimum deposit amount'),
  ('min_withdraw', '{"amount": 5}', 'Minimum withdrawal amount'),
  ('max_withdraw', '{"amount": 1000}', 'Maximum withdrawal amount'),
  ('withdraw_fee', '{"percent": 2}', 'Withdrawal fee percentage'),
  ('site_name', '{"value": "TON Mining"}', 'Website name'),
  ('site_description', '{"value": "Platform mining TON terpercaya"}', 'Website description'),
  ('deposit_wallet', '{"address": "EQD...deposit"}', 'Deposit wallet address'),
  ('maintenance_mode', '{"enabled": false}', 'Maintenance mode status'),
  ('registration_enabled', '{"enabled": true}', 'Registration status');