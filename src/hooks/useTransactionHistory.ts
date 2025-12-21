import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface WithdrawHistory {
  id: string;
  amount: number;
  fee: number;
  final_amount: number;
  wallet_address: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

export interface SwapHistory {
  id: string;
  amount: number;
  fee: number;
  from_currency: string;
  to_currency: string;
  created_at: string;
}

export function useWithdrawHistory() {
  const { user } = useAuth();
  const [withdrawals, setWithdrawals] = useState<WithdrawHistory[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWithdrawals = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('withdrawals')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setWithdrawals(data || []);
    } catch (error) {
      console.error('Error fetching withdrawals:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchWithdrawals();
  }, [user]);

  return { withdrawals, loading, refetch: fetchWithdrawals };
}

export function useSwapHistory() {
  const { user } = useAuth();
  const [swaps, setSwaps] = useState<SwapHistory[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSwaps = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('type', 'swap')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setSwaps(data || []);
    } catch (error) {
      console.error('Error fetching swaps:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchSwaps();
  }, [user]);

  return { swaps, loading, refetch: fetchSwaps };
}
