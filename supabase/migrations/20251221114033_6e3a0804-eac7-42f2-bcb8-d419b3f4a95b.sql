-- Fix 1: Restrict settings table access to authenticated users only
DROP POLICY IF EXISTS "Anyone can view settings" ON public.settings;

CREATE POLICY "Authenticated users can view settings"
  ON public.settings FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- Fix 2: Create RPC function for profile updates with validation and logging
CREATE OR REPLACE FUNCTION public.update_user_profile(_username text, _phone_number text DEFAULT ''::text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  _user_id uuid;
  cleaned_username text;
  cleaned_phone text;
BEGIN
  _user_id := auth.uid();
  IF _user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Clean inputs
  cleaned_username := TRIM(_username);
  cleaned_phone := TRIM(COALESCE(_phone_number, ''));

  -- Validate username
  IF cleaned_username IS NULL OR cleaned_username = '' THEN
    RAISE EXCEPTION 'Username is required';
  END IF;

  IF LENGTH(cleaned_username) < 3 THEN
    RAISE EXCEPTION 'Username must be at least 3 characters';
  END IF;

  IF LENGTH(cleaned_username) > 50 THEN
    RAISE EXCEPTION 'Username must be less than 50 characters';
  END IF;

  -- Only alphanumeric, underscore, and hyphen
  IF cleaned_username !~ '^[A-Za-z0-9_-]+$' THEN
    RAISE EXCEPTION 'Username can only contain letters, numbers, underscore and hyphen';
  END IF;

  -- Validate phone number (optional)
  IF cleaned_phone != '' THEN
    IF LENGTH(cleaned_phone) > 20 THEN
      RAISE EXCEPTION 'Phone number is too long';
    END IF;
    
    IF cleaned_phone !~ '^[0-9+\s\-()]+$' THEN
      RAISE EXCEPTION 'Phone number contains invalid characters';
    END IF;
  END IF;

  -- Update profile
  UPDATE public.profiles 
  SET username = cleaned_username, 
      phone_number = cleaned_phone,
      updated_at = now()
  WHERE id = _user_id;

  RETURN true;
END;
$$;

-- Fix 3: Create RPC functions for admin mining control with audit logging
CREATE OR REPLACE FUNCTION public.toggle_user_mining(_user_id uuid, _active boolean)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF NOT public.is_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Only admins can toggle user mining';
  END IF;

  UPDATE public.profiles 
  SET mining_active = _active
  WHERE id = _user_id;

  -- Log admin action
  INSERT INTO public.admin_logs (admin_id, action, target_type, target_id, details)
  VALUES (auth.uid(), 'toggle_mining', 'user', _user_id, 
    jsonb_build_object('new_status', _active));

  RETURN true;
END;
$$;

CREATE OR REPLACE FUNCTION public.bulk_toggle_mining(_active boolean)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  affected_count integer;
BEGIN
  IF NOT public.is_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Only admins can bulk toggle mining';
  END IF;

  UPDATE public.profiles 
  SET mining_active = _active
  WHERE mining_balance > 0;

  GET DIAGNOSTICS affected_count = ROW_COUNT;

  -- Log admin action
  INSERT INTO public.admin_logs (admin_id, action, target_type, target_id, details)
  VALUES (auth.uid(), 'bulk_toggle_mining', 'system', NULL, 
    jsonb_build_object('new_status', _active, 'affected_users', affected_count));

  RETURN true;
END;
$$;

-- Fix 4: Update create_withdrawal to add wallet address validation
CREATE OR REPLACE FUNCTION public.create_withdrawal(_amount numeric, _wallet_address text, _currency text DEFAULT 'TON'::text, _withdraw_type text DEFAULT 'balance'::text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  user_balance DECIMAL;
  withdraw_fee DECIMAL;
  final_amount DECIMAL;
  new_id UUID;
  fee_percent DECIMAL;
  min_withdraw DECIMAL;
  max_withdraw DECIMAL;
  cleaned_wallet text;
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

  -- Validate wallet address
  cleaned_wallet := TRIM(_wallet_address);
  
  IF cleaned_wallet IS NULL OR cleaned_wallet = '' THEN
    RAISE EXCEPTION 'Wallet address is required';
  END IF;
  
  IF LENGTH(cleaned_wallet) < 40 OR LENGTH(cleaned_wallet) > 100 THEN
    RAISE EXCEPTION 'Invalid wallet address length';
  END IF;
  
  IF cleaned_wallet !~ '^[A-Za-z0-9:_-]+$' THEN
    RAISE EXCEPTION 'Wallet address contains invalid characters';
  END IF;

  -- Validate withdraw type
  IF _withdraw_type NOT IN ('balance', 'tera', 'profit', 'referral') THEN
    RAISE EXCEPTION 'Invalid withdrawal type';
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
  VALUES (auth.uid(), _amount, withdraw_fee, final_amount, cleaned_wallet, _currency, _withdraw_type)
  RETURNING id INTO new_id;

  RETURN new_id;
END;
$$;