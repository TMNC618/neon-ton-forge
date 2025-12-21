-- Add unique constraint on tx_hash to prevent duplicate submissions
ALTER TABLE public.deposits ADD CONSTRAINT deposits_tx_hash_unique UNIQUE (tx_hash);

-- Create a secure deposit creation function with validation
CREATE OR REPLACE FUNCTION public.create_deposit(
  _amount numeric,
  _tx_hash text
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _user_id uuid;
  _deposit_id uuid;
  _cleaned_hash text;
BEGIN
  -- Get current user
  _user_id := auth.uid();
  IF _user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Validate amount (min 10, max 10000)
  IF _amount < 10 THEN
    RAISE EXCEPTION 'Minimum deposit is 10 TON';
  END IF;
  
  IF _amount > 10000 THEN
    RAISE EXCEPTION 'Maximum deposit is 10,000 TON';
  END IF;

  -- Clean and validate transaction hash
  _cleaned_hash := TRIM(_tx_hash);
  
  -- Check hash is not empty
  IF _cleaned_hash IS NULL OR _cleaned_hash = '' THEN
    RAISE EXCEPTION 'Transaction hash is required';
  END IF;
  
  -- Validate hash length (TON transaction hashes are typically 64 characters hex or base64 encoded)
  IF LENGTH(_cleaned_hash) < 32 OR LENGTH(_cleaned_hash) > 128 THEN
    RAISE EXCEPTION 'Invalid transaction hash format';
  END IF;
  
  -- Check for valid characters (alphanumeric, +, /, =, - for base64 and hex)
  IF _cleaned_hash !~ '^[a-zA-Z0-9+/=_-]+$' THEN
    RAISE EXCEPTION 'Transaction hash contains invalid characters';
  END IF;

  -- Check for duplicate transaction hash (unique constraint will also catch this, but provide better error message)
  IF EXISTS (SELECT 1 FROM deposits WHERE tx_hash = _cleaned_hash) THEN
    RAISE EXCEPTION 'This transaction hash has already been submitted';
  END IF;

  -- Create deposit
  INSERT INTO deposits (user_id, amount, tx_hash, status)
  VALUES (_user_id, _amount, _cleaned_hash, 'pending')
  RETURNING id INTO _deposit_id;

  RETURN _deposit_id;
END;
$$;