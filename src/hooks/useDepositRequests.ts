import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface DepositRequest {
  id: string;
  user_id: string;
  username: string;
  email: string;
  amount: number;
  tx_hash: string;
  status: 'pending' | 'approved' | 'rejected';
  admin_note: string | null;
  created_at: string;
}

export function useDepositRequests() {
  const [deposits, setDeposits] = useState<DepositRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [processing, setProcessing] = useState(false);

  const fetchDeposits = async () => {
    try {
      const { data, error } = await supabase.from('deposits').select('*').order('created_at', { ascending: false });
      if (error) throw error;

      const userIds = data?.map(d => d.user_id) || [];
      const { data: profiles } = await supabase.from('profiles').select('id, username, email').in('id', userIds);
      const profileMap = new Map(profiles?.map(p => [p.id, { username: p.username, email: p.email }]) || []);

      setDeposits(data?.map(d => ({ ...d, username: profileMap.get(d.user_id)?.username || 'Unknown', email: profileMap.get(d.user_id)?.email || 'Unknown' })) || []);
    } catch (error) {
      toast.error('Gagal memuat data deposit');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDeposits(); }, []);

  const filteredDeposits = deposits.filter(d => 
    d.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.tx_hash.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const approve = async (id: string, note?: string) => {
    setProcessing(true);
    try {
      const { error } = await supabase.rpc('approve_deposit', { _deposit_id: id, _note: note || null });
      if (error) throw error;
      toast.success('Deposit berhasil disetujui!');
      fetchDeposits();
      return true;
    } catch (error: any) {
      toast.error(error.message || 'Gagal approve deposit');
      return false;
    } finally {
      setProcessing(false);
    }
  };

  const reject = async (id: string, note?: string) => {
    setProcessing(true);
    try {
      const { error } = await supabase.rpc('reject_deposit', { _deposit_id: id, _note: note || null });
      if (error) throw error;
      toast.error('Deposit ditolak!');
      fetchDeposits();
      return true;
    } catch (error: any) {
      toast.error(error.message || 'Gagal reject deposit');
      return false;
    } finally {
      setProcessing(false);
    }
  };

  return { deposits: filteredDeposits, loading, searchQuery, setSearchQuery, processing, approve, reject };
}
