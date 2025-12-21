// Validation utilities for user inputs

// TON wallet address regex patterns
// User-friendly format: EQ... (48 chars base64) or UQ... 
// Raw format: 0:hex... (66 chars)
const TON_ADDRESS_REGEX = /^(EQ[A-Za-z0-9_-]{46}|UQ[A-Za-z0-9_-]{46}|0:[a-fA-F0-9]{64})$/;

export const validateTonWalletAddress = (address: string): { valid: boolean; error?: string } => {
  const trimmed = address.trim();
  
  if (!trimmed) {
    return { valid: false, error: 'Wallet address is required' };
  }
  
  if (trimmed.length < 40 || trimmed.length > 100) {
    return { valid: false, error: 'Invalid wallet address length' };
  }
  
  // Check for valid characters only
  if (!/^[A-Za-z0-9:_-]+$/.test(trimmed)) {
    return { valid: false, error: 'Wallet address contains invalid characters' };
  }
  
  // Check against TON address format
  if (!TON_ADDRESS_REGEX.test(trimmed)) {
    return { valid: false, error: 'Invalid TON wallet address format. Use EQ..., UQ..., or 0:...' };
  }
  
  return { valid: true };
};

// Username validation
export const validateUsername = (username: string): { valid: boolean; error?: string } => {
  const trimmed = username.trim();
  
  if (!trimmed) {
    return { valid: false, error: 'Username is required' };
  }
  
  if (trimmed.length < 3) {
    return { valid: false, error: 'Username must be at least 3 characters' };
  }
  
  if (trimmed.length > 50) {
    return { valid: false, error: 'Username must be less than 50 characters' };
  }
  
  // Only alphanumeric, underscore, and hyphen
  if (!/^[A-Za-z0-9_-]+$/.test(trimmed)) {
    return { valid: false, error: 'Username can only contain letters, numbers, underscore and hyphen' };
  }
  
  return { valid: true };
};

// Phone number validation
export const validatePhoneNumber = (phone: string): { valid: boolean; error?: string } => {
  const trimmed = phone.trim();
  
  if (!trimmed) {
    return { valid: true }; // Phone is optional
  }
  
  if (trimmed.length > 20) {
    return { valid: false, error: 'Phone number is too long' };
  }
  
  // Allow digits, plus, spaces, dashes, parentheses
  if (!/^[0-9+\s\-()]+$/.test(trimmed)) {
    return { valid: false, error: 'Phone number contains invalid characters' };
  }
  
  return { valid: true };
};
