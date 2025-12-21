import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface WithdrawRequest {
  id: string;
  user_id: string;
  username: string;
  email: string;
  amount: number;
  fee: number;
  final_amount: number;
  wallet_address: string;
  withdraw_type: string;
  status: 'pending' | 'approved' | 'rejected';
  admin_note: string | null;
  created_at: string;
}

export function useWithdrawRequests() {
  const [withdrawals, setWithdrawals] = useState<WithdrawRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [processing, setProcessing] = useState(false);

  const fetchWithdrawals = async () => {
    try {
      const { data, error } = await supabase.from('withdrawals').select('*').order('created_at', { ascending: false });
      if (error) throw error;

      const userIds = data?.map(w => w.user_id) || [];
      const { data: profiles } = await supabase.from('profiles').select('id, username, email').in('id', userIds);
      const profileMap = new Map(profiles?.map(p => [p.id, { username: p.username, email: p.email }]) || []);

      setWithdrawals(data?.map(w => ({ ...w, username: profileMap.get(w.user_id)?.username || 'Unknown', email: profileMap.get(w.user_id)?.email || 'Unknown' })) || []);
    } catch (error) {
      toast.error('Gagal memuat data withdrawal');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchWithdrawals(); }, []);

  const filteredWithdrawals = withdrawals.filter(w => 
    w.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    w.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    w.wallet_address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const approve = async (id: string, note?: string) => {
    setProcessing(true);
    try {
      const { error } = await supabase.rpc('approve_withdrawal', { _withdrawal_id: id, _note: note || null });
      if (error) throw error;
      toast.success('Withdraw berhasil disetujui!');
      fetchWithdrawals();
      return true;
    } catch (error: any) {
      toast.error(error.message || 'Gagal approve withdrawal');
      return false;
    } finally {
      setProcessing(false);
    }
  };

  const reject = async (id: string, note?: string) => {
    setProcessing(true);
    try {
      const { error } = await supabase.rpc('reject_withdrawal', { _withdrawal_id: id, _note: note || null });
      if (error) throw error;
      toast.error('Withdraw ditolak!');
      fetchWithdrawals();
      return true;
    } catch (error: any) {
      toast.error(error.message || 'Gagal reject withdrawal');
      return false;
    } finally {
      setProcessing(false);
    }
  };

  return { withdrawals: filteredWithdrawals, loading, searchQuery, setSearchQuery, processing, approve, reject };
}
