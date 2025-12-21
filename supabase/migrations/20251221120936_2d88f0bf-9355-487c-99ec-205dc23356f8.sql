
-- 1. Update approve_deposit: deposit goes to TON BALANCE (balance field) instead of mining_balance
CREATE OR REPLACE FUNCTION public.approve_deposit(_deposit_id uuid, _note text DEFAULT NULL::text)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
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

  -- Deposit goes to TON BALANCE (balance field)
  UPDATE public.profiles 
  SET balance = balance + deposit_record.amount
  WHERE id = deposit_record.user_id;

  INSERT INTO public.transactions (user_id, type, amount, description, reference_id)
  VALUES (deposit_record.user_id, 'deposit', deposit_record.amount, 'Deposit approved - added to TON Balance', _deposit_id);

  -- Process referral bonus - goes to referrer's TON BALANCE
  PERFORM public.process_referral_deposit_bonus(deposit_record.user_id, deposit_record.amount);

  INSERT INTO public.admin_logs (admin_id, action, target_type, target_id, details)
  VALUES (auth.uid(), 'approve_deposit', 'deposit', _deposit_id, 
    jsonb_build_object('amount', deposit_record.amount, 'user_id', deposit_record.user_id));

  RETURN true;
END;
$function$;

-- 2. Update start_mining: moves ALL TERA BALANCE to MINING BALANCE
CREATE OR REPLACE FUNCTION public.start_mining()
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  user_tera_balance DECIMAL;
BEGIN
  -- Check TERA balance (not mining_balance anymore)
  SELECT tera_balance INTO user_tera_balance FROM public.profiles WHERE id = auth.uid();
  
  IF user_tera_balance <= 0 THEN
    RAISE EXCEPTION 'No TERA balance available. Please swap TON to TERA first.';
  END IF;

  -- Move ALL TERA balance to mining_balance
  UPDATE public.profiles 
  SET mining_active = true, 
      last_mining_start = now(),
      mining_balance = mining_balance + user_tera_balance,
      tera_balance = 0
  WHERE id = auth.uid();

  INSERT INTO public.mining_sessions (user_id, initial_balance, is_active)
  VALUES (auth.uid(), user_tera_balance, true);

  INSERT INTO public.transactions (user_id, type, amount, description)
  VALUES (auth.uid(), 'mining', user_tera_balance, 'Started mining - TERA moved to Mining Balance');

  RETURN true;
END;
$function$;

-- 3. Update stop_mining: profit goes to TERA BALANCE instead of earning_profit
CREATE OR REPLACE FUNCTION public.stop_mining()
 RETURNS numeric
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  session_record RECORD;
  elapsed_seconds DECIMAL;
  max_session_seconds DECIMAL := 86400; -- 24 hours max
  daily_rate DECIMAL;
  earned DECIMAL;
  referrer_id UUID;
  referral_mining_bonus DECIMAL;
  referral_bonus_percent DECIMAL;
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
  
  -- Cap elapsed time to maximum session duration (24 hours)
  IF elapsed_seconds > max_session_seconds THEN
    elapsed_seconds := max_session_seconds;
  END IF;
  
  -- Ensure elapsed_seconds is not negative
  IF elapsed_seconds < 0 THEN
    elapsed_seconds := 0;
  END IF;

  earned := session_record.initial_balance * (daily_rate / 100) * (elapsed_seconds / 86400);

  UPDATE public.mining_sessions 
  SET is_active = false, end_time = now(), earned_amount = earned
  WHERE id = session_record.id;

  -- Profit goes to TERA BALANCE (not earning_profit anymore)
  -- Also return mining_balance back to tera_balance
  UPDATE public.profiles 
  SET mining_active = false, 
      tera_balance = tera_balance + mining_balance + earned,
      mining_balance = 0,
      last_mining_start = NULL
  WHERE id = auth.uid();

  INSERT INTO public.transactions (user_id, type, amount, description, reference_id)
  VALUES (auth.uid(), 'mining', earned, 'Mining profit - added to TERA Balance', session_record.id);

  -- Process referral mining bonus - goes to referrer's TERA BALANCE
  SELECT referred_by INTO referrer_id FROM public.profiles WHERE id = auth.uid();
  
  IF referrer_id IS NOT NULL THEN
    SELECT (value->>'percent')::DECIMAL INTO referral_bonus_percent FROM public.settings WHERE key = 'referral_mining_bonus';
    referral_bonus_percent := COALESCE(referral_bonus_percent, 5);
    
    referral_mining_bonus := earned * (referral_bonus_percent / 100);
    
    IF referral_mining_bonus > 0 THEN
      -- Referral mining reward goes to TERA BALANCE
      UPDATE public.profiles SET tera_balance = tera_balance + referral_mining_bonus WHERE id = referrer_id;
      
      INSERT INTO public.transactions (user_id, type, amount, description)
      VALUES (referrer_id, 'referral', referral_mining_bonus, 'Referral mining bonus - added to TERA Balance');
    END IF;
  END IF;

  RETURN earned;
END;
$function$;

-- 4. Create new function for referral deposit bonus (goes to TON BALANCE)
CREATE OR REPLACE FUNCTION public.process_referral_deposit_bonus(_user_id uuid, _deposit_amount numeric)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  referrer UUID;
  bonus_percent DECIMAL;
  bonus_amount DECIMAL;
BEGIN
  SELECT referred_by INTO referrer FROM public.profiles WHERE id = _user_id;
  
  IF referrer IS NULL THEN
    RETURN false;
  END IF;

  SELECT (value->>'percent')::DECIMAL INTO bonus_percent FROM public.settings WHERE key = 'referral_bonus';
  bonus_percent := COALESCE(bonus_percent, 5);
  
  bonus_amount := _deposit_amount * (bonus_percent / 100);

  -- Referral deposit bonus goes to TON BALANCE (balance field)
  UPDATE public.profiles SET balance = balance + bonus_amount WHERE id = referrer;

  UPDATE public.referrals 
  SET bonus_amount = COALESCE(referrals.bonus_amount, 0) + bonus_amount, is_rewarded = true
  WHERE referrer_id = referrer AND referred_id = _user_id;

  INSERT INTO public.transactions (user_id, type, amount, description)
  VALUES (referrer, 'referral', bonus_amount, 'Referral deposit bonus - added to TON Balance');

  RETURN true;
END;
$function$;

-- 5. Update create_withdrawal: only allow from TON BALANCE (balance field)
CREATE OR REPLACE FUNCTION public.create_withdrawal(_amount numeric, _wallet_address text, _currency text DEFAULT 'TON'::text, _withdraw_type text DEFAULT 'balance'::text)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
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
  -- Withdraw only works from TON BALANCE
  IF _withdraw_type != 'balance' THEN
    RAISE EXCEPTION 'Withdrawal only available from TON Balance. Please swap TERA to TON first.';
  END IF;

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

  -- Only check TON BALANCE
  SELECT balance INTO user_balance FROM public.profiles WHERE id = auth.uid();

  IF user_balance < _amount THEN
    RAISE EXCEPTION 'Insufficient TON balance. Please swap TERA to TON first if needed.';
  END IF;

  withdraw_fee := _amount * (fee_percent / 100);
  final_amount := _amount - withdraw_fee;

  -- Deduct from TON BALANCE only
  UPDATE public.profiles SET balance = balance - _amount WHERE id = auth.uid();

  INSERT INTO public.withdrawals (user_id, amount, fee, final_amount, wallet_address, currency, withdraw_type)
  VALUES (auth.uid(), _amount, withdraw_fee, final_amount, cleaned_wallet, _currency, 'balance')
  RETURNING id INTO new_id;

  RETURN new_id;
END;
$function$;

-- 6. Add setting for referral mining bonus if not exists
INSERT INTO public.settings (key, value, description)
VALUES ('referral_mining_bonus', '{"percent": 5}'::jsonb, 'Referral mining bonus percentage')
ON CONFLICT (key) DO NOTHING;
