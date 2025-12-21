import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export interface Profile {
  id: string;
  email: string;
  username: string;
  balance: number;
  tera_balance: number;
  mining_balance: number;
  earning_profit: number;
  earning_referral: number;
  wallet_address: string;
  phone_number: string;
  is_active: boolean;
  mining_active: boolean;
  last_mining_start: string | null;
  referral_code: string;
}

export function useAuthState() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (userId: string) => {
    try {
      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }

      if (profileData) {
        setProfile({
          id: profileData.id,
          email: profileData.email,
          username: profileData.username,
          balance: Number(profileData.balance) || 0,
          tera_balance: Number(profileData.tera_balance) || 0,
          mining_balance: Number(profileData.mining_balance) || 0,
          earning_profit: Number(profileData.earning_profit) || 0,
          earning_referral: Number(profileData.earning_referral) || 0,
          wallet_address: profileData.wallet_address || '',
          phone_number: profileData.phone_number || '',
          is_active: profileData.is_active ?? true,
          mining_active: profileData.mining_active ?? false,
          last_mining_start: profileData.last_mining_start,
          referral_code: profileData.referral_code || '',
        });
      }

      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .maybeSingle();

      setIsAdmin(roleData?.role === 'admin');
    } catch (error) {
      console.error('Error in fetchProfile:', error);
    }
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          setTimeout(() => fetchProfile(session.user.id), 0);
        } else {
          setProfile(null);
          setIsAdmin(false);
        }
        setLoading(false);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id);
    }
  };

  const clearState = () => {
    setUser(null);
    setSession(null);
    setProfile(null);
    setIsAdmin(false);
  };

  return {
    user,
    session,
    profile,
    isAdmin,
    loading,
    refreshProfile,
    clearState,
    fetchProfile,
  };
}
