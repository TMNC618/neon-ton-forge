import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface User {
  id: string;
  username: string;
  email: string;
  phone_number: string;
  balance: number;
  tera_balance: number;
  mining_balance: number;
  earning_profit: number;
  earning_referral: number;
  wallet_address: string;
  is_active: boolean;
  created_at: string;
}

export function useUserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      toast.error('Gagal memuat data user');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleUserStatus = async (userId: string) => {
    try {
      const { error } = await supabase.rpc('toggle_user_status', { _user_id: userId });
      if (error) throw error;
      const user = users.find(u => u.id === userId);
      toast.success(`User ${user?.username} berhasil ${user?.is_active ? 'diblokir' : 'diaktifkan'}!`);
      fetchUsers();
    } catch (error: any) {
      toast.error(error.message || 'Gagal mengubah status');
    }
  };

  const updateBalance = async (userId: string, action: 'add' | 'reduce', amount: number, balanceType: string) => {
    try {
      const rpcName = action === 'add' ? 'add_user_balance' : 'reduce_user_balance';
      const { error } = await supabase.rpc(rpcName, {
        _user_id: userId,
        _amount: amount,
        _balance_type: balanceType
      });
      if (error) throw error;
      toast.success(`Berhasil ${action === 'add' ? 'menambah' : 'mengurangi'} saldo!`);
      fetchUsers();
      return true;
    } catch (error: any) {
      toast.error(error.message || 'Gagal mengubah saldo');
      return false;
    }
  };

  return {
    users: filteredUsers,
    loading,
    searchQuery,
    setSearchQuery,
    toggleUserStatus,
    updateBalance,
  };
}
