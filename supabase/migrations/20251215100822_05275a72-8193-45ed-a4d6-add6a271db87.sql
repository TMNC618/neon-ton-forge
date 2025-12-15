-- Fix security warnings - add search_path to functions
CREATE OR REPLACE FUNCTION public.generate_referral_code()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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

CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- =============================================
-- BALANCE MANAGEMENT FUNCTIONS
-- =============================================

-- Add balance to user
CREATE OR REPLACE FUNCTION public.add_user_balance(
  _user_id UUID,
  _amount DECIMAL,
  _balance_type TEXT DEFAULT 'balance'
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.is_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Only admins can add balance';
  END IF;

  IF _balance_type = 'balance' THEN
    UPDATE public.profiles SET balance = balance + _amount WHERE id = _user_id;
  ELSIF _balance_type = 'tera' THEN
    UPDATE public.profiles SET tera_balance = tera_balance + _amount WHERE id = _user_id;
  ELSIF _balance_type = 'mining' THEN
    UPDATE public.profiles SET mining_balance = mining_balance + _amount WHERE id = _user_id;
  END IF;

  INSERT INTO public.admin_logs (admin_id, action, target_type, target_id, details)
  VALUES (auth.uid(), 'add_balance', 'user', _user_id, 
    jsonb_build_object('amount', _amount, 'type', _balance_type));

  RETURN true;
END;
$$;

-- Reduce balance from user
CREATE OR REPLACE FUNCTION public.reduce_user_balance(
  _user_id UUID,
  _amount DECIMAL,
  _balance_type TEXT DEFAULT 'balance'
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_balance DECIMAL;
BEGIN
  IF NOT public.is_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Only admins can reduce balance';
  END IF;

  IF _balance_type = 'balance' THEN
    SELECT balance INTO current_balance FROM public.profiles WHERE id = _user_id;
  ELSIF _balance_type = 'tera' THEN
    SELECT tera_balance INTO current_balance FROM public.profiles WHERE id = _user_id;
  ELSIF _balance_type = 'mining' THEN
    SELECT mining_balance INTO current_balance FROM public.profiles WHERE id = _user_id;
  END IF;

  IF current_balance < _amount THEN
    RAISE EXCEPTION 'Insufficient balance';
  END IF;

  IF _balance_type = 'balance' THEN
    UPDATE public.profiles SET balance = balance - _amount WHERE id = _user_id;
  ELSIF _balance_type = 'tera' THEN
    UPDATE public.profiles SET tera_balance = tera_balance - _amount WHERE id = _user_id;
  ELSIF _balance_type = 'mining' THEN
    UPDATE public.profiles SET mining_balance = mining_balance - _amount WHERE id = _user_id;
  END IF;

  INSERT INTO public.admin_logs (admin_id, action, target_type, target_id, details)
  VALUES (auth.uid(), 'reduce_balance', 'user', _user_id, 
    jsonb_build_object('amount', _amount, 'type', _balance_type));

  RETURN true;
END;
$$;

-- =============================================
-- DEPOSIT FUNCTIONS
-- =============================================

-- Approve deposit
CREATE OR REPLACE FUNCTION public.approve_deposit(_deposit_id UUID, _note TEXT DEFAULT NULL)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  deposit_record RECORD;
BEGIN
  IF NOT public.is_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Only admins can approve deposits';
  END IF;

  SELECT * INTO deposit_record FROM public.deposits WHERE id = _deposit_id AND status = 'pending';
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Deposit not found or already processed';
  END IF;

  UPDATE public.deposits 
  SET status = 'approved', 
      admin_note = _note,
      processed_by = auth.uid(),
      processed_at = now()
  WHERE id = _deposit_id;

  UPDATE public.profiles 
  SET mining_balance = mining_balance + deposit_record.amount
  WHERE id = deposit_record.user_id;

  INSERT INTO public.transactions (user_id, type, amount, description, reference_id)
  VALUES (deposit_record.user_id, 'deposit', deposit_record.amount, 'Deposit approved', _deposit_id);

  INSERT INTO public.admin_logs (admin_id, action, target_type, target_id, details)
  VALUES (auth.uid(), 'approve_deposit', 'deposit', _deposit_id, 
    jsonb_build_object('amount', deposit_record.amount, 'user_id', deposit_record.user_id));

  RETURN true;
END;
$$;

-- Reject deposit
CREATE OR REPLACE FUNCTION public.reject_deposit(_deposit_id UUID, _note TEXT DEFAULT NULL)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.is_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Only admins can reject deposits';
  END IF;

  UPDATE public.deposits 
  SET status = 'rejected', 
      admin_note = _note,
      processed_by = auth.uid(),
      processed_at = now()
  WHERE id = _deposit_id AND status = 'pending';

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Deposit not found or already processed';
  END IF;

  INSERT INTO public.admin_logs (admin_id, action, target_type, target_id, details)
  VALUES (auth.uid(), 'reject_deposit', 'deposit', _deposit_id, 
    jsonb_build_object('note', _note));

  RETURN true;
END;
$$;

-- =============================================
-- WITHDRAWAL FUNCTIONS
-- =============================================

-- Create withdrawal request
CREATE OR REPLACE FUNCTION public.create_withdrawal(
  _amount DECIMAL,
  _wallet_address TEXT,
  _currency TEXT DEFAULT 'TON',
  _withdraw_type TEXT DEFAULT 'balance'
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_balance DECIMAL;
  withdraw_fee DECIMAL;
  final_amount DECIMAL;
  new_id UUID;
  fee_percent DECIMAL;
  min_withdraw DECIMAL;
  max_withdraw DECIMAL;
BEGIN
  SELECT (value->>'percent')::DECIMAL INTO fee_percent FROM public.settings WHERE key = 'withdraw_fee';
  SELECT (value->>'amount')::DECIMAL INTO min_withdraw FROM public.settings WHERE key = 'min_withdraw';
  SELECT (value->>'amount')::DECIMAL INTO max_withdraw FROM public.settings WHERE key = 'max_withdraw';
  
  fee_percent := COALESCE(fee_percent, 2);
  min_withdraw := COALESCE(min_withdraw, 5);
  max_withdraw := COALESCE(max_withdraw, 1000);

  IF _amount < min_withdraw THEN
    RAISE EXCEPTION 'Minimum withdrawal is %', min_withdraw;
  END IF;

  IF _amount > max_withdraw THEN
    RAISE EXCEPTION 'Maximum withdrawal is %', max_withdraw;
  END IF;

  IF _withdraw_type = 'balance' THEN
    SELECT balance INTO user_balance FROM public.profiles WHERE id = auth.uid();
  ELSIF _withdraw_type = 'tera' THEN
    SELECT tera_balance INTO user_balance FROM public.profiles WHERE id = auth.uid();
  ELSIF _withdraw_type = 'profit' THEN
    SELECT earning_profit INTO user_balance FROM public.profiles WHERE id = auth.uid();
  ELSIF _withdraw_type = 'referral' THEN
    SELECT earning_referral INTO user_balance FROM public.profiles WHERE id = auth.uid();
  END IF;

  IF user_balance < _amount THEN
    RAISE EXCEPTION 'Insufficient balance';
  END IF;

  withdraw_fee := _amount * (fee_percent / 100);
  final_amount := _amount - withdraw_fee;

  IF _withdraw_type = 'balance' THEN
    UPDATE public.profiles SET balance = balance - _amount WHERE id = auth.uid();
  ELSIF _withdraw_type = 'tera' THEN
    UPDATE public.profiles SET tera_balance = tera_balance - _amount WHERE id = auth.uid();
  ELSIF _withdraw_type = 'profit' THEN
    UPDATE public.profiles SET earning_profit = earning_profit - _amount WHERE id = auth.uid();
  ELSIF _withdraw_type = 'referral' THEN
    UPDATE public.profiles SET earning_referral = earning_referral - _amount WHERE id = auth.uid();
  END IF;

  INSERT INTO public.withdrawals (user_id, amount, fee, final_amount, wallet_address, currency, withdraw_type)
  VALUES (auth.uid(), _amount, withdraw_fee, final_amount, _wallet_address, _currency, _withdraw_type)
  RETURNING id INTO new_id;

  RETURN new_id;
END;
$$;

-- Approve withdrawal
CREATE OR REPLACE FUNCTION public.approve_withdrawal(_withdrawal_id UUID, _note TEXT DEFAULT NULL)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  withdrawal_record RECORD;
BEGIN
  IF NOT public.is_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Only admins can approve withdrawals';
  END IF;

  SELECT * INTO withdrawal_record FROM public.withdrawals WHERE id = _withdrawal_id AND status = 'pending';
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Withdrawal not found or already processed';
  END IF;

  UPDATE public.withdrawals 
  SET status = 'approved', 
      admin_note = _note,
      processed_by = auth.uid(),
      processed_at = now()
  WHERE id = _withdrawal_id;

  INSERT INTO public.transactions (user_id, type, amount, fee, description, reference_id)
  VALUES (withdrawal_record.user_id, 'withdrawal', withdrawal_record.amount, withdrawal_record.fee, 
    'Withdrawal approved', _withdrawal_id);

  INSERT INTO public.admin_logs (admin_id, action, target_type, target_id, details)
  VALUES (auth.uid(), 'approve_withdrawal', 'withdrawal', _withdrawal_id, 
    jsonb_build_object('amount', withdrawal_record.final_amount));

  RETURN true;
END;
$$;

-- Reject withdrawal
CREATE OR REPLACE FUNCTION public.reject_withdrawal(_withdrawal_id UUID, _note TEXT DEFAULT NULL)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  withdrawal_record RECORD;
BEGIN
  IF NOT public.is_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Only admins can reject withdrawals';
  END IF;

  SELECT * INTO withdrawal_record FROM public.withdrawals WHERE id = _withdrawal_id AND status = 'pending';
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Withdrawal not found or already processed';
  END IF;

  IF withdrawal_record.withdraw_type = 'balance' THEN
    UPDATE public.profiles SET balance = balance + withdrawal_record.amount WHERE id = withdrawal_record.user_id;
  ELSIF withdrawal_record.withdraw_type = 'tera' THEN
    UPDATE public.profiles SET tera_balance = tera_balance + withdrawal_record.amount WHERE id = withdrawal_record.user_id;
  ELSIF withdrawal_record.withdraw_type = 'profit' THEN
    UPDATE public.profiles SET earning_profit = earning_profit + withdrawal_record.amount WHERE id = withdrawal_record.user_id;
  ELSIF withdrawal_record.withdraw_type = 'referral' THEN
    UPDATE public.profiles SET earning_referral = earning_referral + withdrawal_record.amount WHERE id = withdrawal_record.user_id;
  END IF;

  UPDATE public.withdrawals 
  SET status = 'rejected', 
      admin_note = _note,
      processed_by = auth.uid(),
      processed_at = now()
  WHERE id = _withdrawal_id;

  INSERT INTO public.admin_logs (admin_id, action, target_type, target_id, details)
  VALUES (auth.uid(), 'reject_withdrawal', 'withdrawal', _withdrawal_id, 
    jsonb_build_object('note', _note));

  RETURN true;
END;
$$;

-- =============================================
-- MINING FUNCTIONS
-- =============================================

-- Start mining
CREATE OR REPLACE FUNCTION public.start_mining()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_mining_balance DECIMAL;
BEGIN
  SELECT mining_balance INTO user_mining_balance FROM public.profiles WHERE id = auth.uid();
  
  IF user_mining_balance <= 0 THEN
    RAISE EXCEPTION 'No mining balance available';
  END IF;

  UPDATE public.profiles 
  SET mining_active = true, last_mining_start = now()
  WHERE id = auth.uid();

  INSERT INTO public.mining_sessions (user_id, initial_balance, is_active)
  VALUES (auth.uid(), user_mining_balance, true);

  RETURN true;
END;
$$;

-- Stop mining and claim earnings
CREATE OR REPLACE FUNCTION public.stop_mining()
RETURNS DECIMAL
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  session_record RECORD;
  elapsed_seconds DECIMAL;
  daily_rate DECIMAL;
  earned DECIMAL;
BEGIN
  SELECT * INTO session_record 
  FROM public.mining_sessions 
  WHERE user_id = auth.uid() AND is_active = true
  ORDER BY start_time DESC LIMIT 1;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'No active mining session';
  END IF;

  SELECT (value->>'daily_percent')::DECIMAL INTO daily_rate FROM public.settings WHERE key = 'mining_rate';
  daily_rate := COALESCE(daily_rate, 1);

  elapsed_seconds := EXTRACT(EPOCH FROM (now() - session_record.start_time));
  earned := session_record.initial_balance * (daily_rate / 100) * (elapsed_seconds / 86400);

  UPDATE public.mining_sessions 
  SET is_active = false, end_time = now(), earned_amount = earned
  WHERE id = session_record.id;

  UPDATE public.profiles 
  SET mining_active = false, 
      earning_profit = earning_profit + earned,
      last_mining_start = NULL
  WHERE id = auth.uid();

  INSERT INTO public.transactions (user_id, type, amount, description, reference_id)
  VALUES (auth.uid(), 'mining', earned, 'Mining profit', session_record.id);

  RETURN earned;
END;
$$;

-- =============================================
-- SWAP FUNCTIONS
-- =============================================

-- Swap TON to TERA
CREATE OR REPLACE FUNCTION public.swap_ton_to_tera(_amount DECIMAL)
RETURNS DECIMAL
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_balance DECIMAL;
  rate DECIMAL;
  fee_percent DECIMAL;
  fee DECIMAL;
  net_amount DECIMAL;
  tera_amount DECIMAL;
BEGIN
  SELECT balance INTO user_balance FROM public.profiles WHERE id = auth.uid();
  
  IF user_balance < _amount THEN
    RAISE EXCEPTION 'Insufficient TON balance';
  END IF;

  SELECT (value->>'rate')::DECIMAL INTO rate FROM public.settings WHERE key = 'ton_to_tera_rate';
  SELECT (value->>'percent')::DECIMAL INTO fee_percent FROM public.settings WHERE key = 'swap_fee';
  
  rate := COALESCE(rate, 10);
  fee_percent := COALESCE(fee_percent, 0.5);

  fee := _amount * (fee_percent / 100);
  net_amount := _amount - fee;
  tera_amount := net_amount * rate;

  UPDATE public.profiles 
  SET balance = balance - _amount, tera_balance = tera_balance + tera_amount
  WHERE id = auth.uid();

  INSERT INTO public.transactions (user_id, type, amount, fee, from_currency, to_currency, description)
  VALUES (auth.uid(), 'swap', _amount, fee, 'TON', 'TERA', 'Swap TON to TERA');

  RETURN tera_amount;
END;
$$;

-- Swap TERA to TON
CREATE OR REPLACE FUNCTION public.swap_tera_to_ton(_amount DECIMAL)
RETURNS DECIMAL
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_balance DECIMAL;
  rate DECIMAL;
  fee_percent DECIMAL;
  fee DECIMAL;
  net_amount DECIMAL;
  ton_amount DECIMAL;
BEGIN
  SELECT tera_balance INTO user_balance FROM public.profiles WHERE id = auth.uid();
  
  IF user_balance < _amount THEN
    RAISE EXCEPTION 'Insufficient TERA balance';
  END IF;

  SELECT (value->>'rate')::DECIMAL INTO rate FROM public.settings WHERE key = 'tera_to_ton_rate';
  SELECT (value->>'percent')::DECIMAL INTO fee_percent FROM public.settings WHERE key = 'swap_fee';
  
  rate := COALESCE(rate, 0.084);
  fee_percent := COALESCE(fee_percent, 0.5);

  fee := _amount * (fee_percent / 100);
  net_amount := _amount - fee;
  ton_amount := net_amount * rate;

  UPDATE public.profiles 
  SET tera_balance = tera_balance - _amount, balance = balance + ton_amount
  WHERE id = auth.uid();

  INSERT INTO public.transactions (user_id, type, amount, fee, from_currency, to_currency, description)
  VALUES (auth.uid(), 'swap', _amount, fee, 'TERA', 'TON', 'Swap TERA to TON');

  RETURN ton_amount;
END;
$$;

-- =============================================
-- REFERRAL FUNCTIONS
-- =============================================

-- Apply referral code during registration
CREATE OR REPLACE FUNCTION public.apply_referral_code(_referral_code TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  referrer_id UUID;
BEGIN
  SELECT id INTO referrer_id FROM public.profiles WHERE referral_code = _referral_code;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Invalid referral code';
  END IF;

  IF referrer_id = auth.uid() THEN
    RAISE EXCEPTION 'Cannot use own referral code';
  END IF;

  UPDATE public.profiles SET referred_by = referrer_id WHERE id = auth.uid();

  INSERT INTO public.referrals (referrer_id, referred_id)
  VALUES (referrer_id, auth.uid());

  RETURN true;
END;
$$;

-- Process referral bonus when referred user makes deposit
CREATE OR REPLACE FUNCTION public.process_referral_bonus(_deposit_amount DECIMAL)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  referrer UUID;
  bonus_percent DECIMAL;
  bonus_amount DECIMAL;
BEGIN
  SELECT referred_by INTO referrer FROM public.profiles WHERE id = auth.uid();
  
  IF referrer IS NULL THEN
    RETURN false;
  END IF;

  SELECT (value->>'percent')::DECIMAL INTO bonus_percent FROM public.settings WHERE key = 'referral_bonus';
  bonus_percent := COALESCE(bonus_percent, 5);
  
  bonus_amount := _deposit_amount * (bonus_percent / 100);

  UPDATE public.profiles SET earning_referral = earning_referral + bonus_amount WHERE id = referrer;

  UPDATE public.referrals 
  SET bonus_amount = bonus_amount + bonus_amount, is_rewarded = true
  WHERE referrer_id = referrer AND referred_id = auth.uid();

  INSERT INTO public.transactions (user_id, type, amount, description)
  VALUES (referrer, 'referral', bonus_amount, 'Referral bonus from deposit');

  RETURN true;
END;
$$;

-- =============================================
-- ADMIN FUNCTIONS
-- =============================================

-- Toggle user status
CREATE OR REPLACE FUNCTION public.toggle_user_status(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_status BOOLEAN;
BEGIN
  IF NOT public.is_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Only admins can toggle user status';
  END IF;

  SELECT is_active INTO current_status FROM public.profiles WHERE id = _user_id;
  
  UPDATE public.profiles SET is_active = NOT current_status WHERE id = _user_id;

  INSERT INTO public.admin_logs (admin_id, action, target_type, target_id, details)
  VALUES (auth.uid(), 'toggle_status', 'user', _user_id, 
    jsonb_build_object('new_status', NOT current_status));

  RETURN NOT current_status;
END;
$$;

-- Update setting
CREATE OR REPLACE FUNCTION public.update_setting(_key TEXT, _value JSONB)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.is_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Only admins can update settings';
  END IF;

  UPDATE public.settings 
  SET value = _value, updated_by = auth.uid(), updated_at = now()
  WHERE key = _key;

  INSERT INTO public.admin_logs (admin_id, action, target_type, target_id, details)
  VALUES (auth.uid(), 'update_setting', 'setting', NULL, 
    jsonb_build_object('key', _key, 'value', _value));

  RETURN true;
END;
$$;

-- Get admin statistics
CREATE OR REPLACE FUNCTION public.get_admin_stats()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result JSONB;
BEGIN
  IF NOT public.is_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Only admins can view stats';
  END IF;

  SELECT jsonb_build_object(
    'total_users', (SELECT COUNT(*) FROM public.profiles),
    'active_users', (SELECT COUNT(*) FROM public.profiles WHERE is_active = true),
    'mining_users', (SELECT COUNT(*) FROM public.profiles WHERE mining_active = true),
    'pending_deposits', (SELECT COUNT(*) FROM public.deposits WHERE status = 'pending'),
    'pending_withdrawals', (SELECT COUNT(*) FROM public.withdrawals WHERE status = 'pending'),
    'total_deposits', (SELECT COALESCE(SUM(amount), 0) FROM public.deposits WHERE status = 'approved'),
    'total_withdrawals', (SELECT COALESCE(SUM(final_amount), 0) FROM public.withdrawals WHERE status = 'approved')
  ) INTO result;

  RETURN result;
END;
$$;