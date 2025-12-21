-- Add server-side amount validation to swap functions

-- Update swap_ton_to_tera with amount validation
CREATE OR REPLACE FUNCTION public.swap_ton_to_tera(_amount numeric)
 RETURNS numeric
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  user_balance DECIMAL;
  rate DECIMAL;
  fee_percent DECIMAL;
  fee DECIMAL;
  net_amount DECIMAL;
  tera_amount DECIMAL;
  min_swap DECIMAL := 0.1;
  max_swap DECIMAL := 10000;
BEGIN
  -- Validate amount is positive
  IF _amount <= 0 THEN
    RAISE EXCEPTION 'Amount must be positive';
  END IF;

  -- Validate minimum swap amount
  IF _amount < min_swap THEN
    RAISE EXCEPTION 'Minimum swap amount is % TON', min_swap;
  END IF;

  -- Validate maximum swap amount
  IF _amount > max_swap THEN
    RAISE EXCEPTION 'Maximum swap amount is % TON', max_swap;
  END IF;

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
$function$;

-- Update swap_tera_to_ton with amount validation
CREATE OR REPLACE FUNCTION public.swap_tera_to_ton(_amount numeric)
 RETURNS numeric
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  user_balance DECIMAL;
  rate DECIMAL;
  fee_percent DECIMAL;
  fee DECIMAL;
  net_amount DECIMAL;
  ton_amount DECIMAL;
  min_swap DECIMAL := 1;
  max_swap DECIMAL := 100000;
BEGIN
  -- Validate amount is positive
  IF _amount <= 0 THEN
    RAISE EXCEPTION 'Amount must be positive';
  END IF;

  -- Validate minimum swap amount
  IF _amount < min_swap THEN
    RAISE EXCEPTION 'Minimum swap amount is % TERA', min_swap;
  END IF;

  -- Validate maximum swap amount
  IF _amount > max_swap THEN
    RAISE EXCEPTION 'Maximum swap amount is % TERA', max_swap;
  END IF;

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
$function$;

-- Update stop_mining with maximum session duration check (24 hours max)
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
  
  -- Ensure elapsed_seconds is not negative (shouldn't happen, but safety check)
  IF elapsed_seconds < 0 THEN
    elapsed_seconds := 0;
  END IF;

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
$function$;

-- Update add_user_balance with amount validation
CREATE OR REPLACE FUNCTION public.add_user_balance(_user_id uuid, _amount numeric, _balance_type text DEFAULT 'balance'::text)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  IF NOT public.is_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Only admins can add balance';
  END IF;

  -- Validate amount is positive
  IF _amount <= 0 THEN
    RAISE EXCEPTION 'Amount must be positive';
  END IF;

  -- Validate maximum amount per operation
  IF _amount > 1000000 THEN
    RAISE EXCEPTION 'Maximum amount per operation is 1,000,000';
  END IF;

  -- Validate balance type
  IF _balance_type NOT IN ('balance', 'tera', 'mining') THEN
    RAISE EXCEPTION 'Invalid balance type';
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
$function$;

-- Update reduce_user_balance with amount validation
CREATE OR REPLACE FUNCTION public.reduce_user_balance(_user_id uuid, _amount numeric, _balance_type text DEFAULT 'balance'::text)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  current_balance DECIMAL;
BEGIN
  IF NOT public.is_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Only admins can reduce balance';
  END IF;

  -- Validate amount is positive
  IF _amount <= 0 THEN
    RAISE EXCEPTION 'Amount must be positive';
  END IF;

  -- Validate maximum amount per operation
  IF _amount > 1000000 THEN
    RAISE EXCEPTION 'Maximum amount per operation is 1,000,000';
  END IF;

  -- Validate balance type
  IF _balance_type NOT IN ('balance', 'tera', 'mining') THEN
    RAISE EXCEPTION 'Invalid balance type';
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
$function$;