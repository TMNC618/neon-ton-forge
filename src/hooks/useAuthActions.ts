import { supabase } from '@/integrations/supabase/client';

export function useAuthActions(
  fetchProfile: (userId: string) => Promise<void>,
  clearState: () => void
) {
  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user) {
        await fetchProfile(data.user.id);
      }

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message || 'Login error' };
    }
  };

  const register = async (email: string, password: string, username: string) => {
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: { username },
        },
      });

      if (error) {
        if (error.message.includes('already registered')) {
          return { success: false, error: 'Email sudah terdaftar.' };
        }
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message || 'Registration error' };
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    clearState();
    window.location.href = '/login';
  };

  return { login, register, logout };
}
