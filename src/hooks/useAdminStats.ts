import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface AdminStats {
  total_users: number;
  active_users: number;
  total_deposits: number;
  total_withdrawals: number;
  pending_deposits: number;
  pending_withdrawals: number;
  total_mining_balance: number;
  total_platform_balance: number;
}

interface RecentActivity {
  id: string;
  user_email: string;
  action: string;
  amount: string;
  time: string;
}

const getTimeAgo = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} mins ago`;
  
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours} hours ago`;
  
  return `${Math.floor(diffHours / 24)} days ago`;
};

export function useAdminStats() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [activities, setActivities] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const { data, error } = await supabase.rpc('get_admin_stats');
      if (error) throw error;
      setStats(data as unknown as AdminStats);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchActivities = async () => {
    try {
      const { data: deposits } = await supabase
        .from('deposits')
        .select('id, amount, created_at, user_id')
        .order('created_at', { ascending: false })
        .limit(3);

      const { data: withdrawals } = await supabase
        .from('withdrawals')
        .select('id, amount, created_at, user_id')
        .order('created_at', { ascending: false })
        .limit(3);

      const allUserIds = [...new Set([
        ...(deposits?.map(d => d.user_id) || []),
        ...(withdrawals?.map(w => w.user_id) || [])
      ])];

      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, email')
        .in('id', allUserIds);

      const profileMap = new Map(profiles?.map(p => [p.id, p.email]) || []);
      const result: RecentActivity[] = [];

      deposits?.forEach(d => {
        result.push({
          id: d.id,
          user_email: profileMap.get(d.user_id) || 'Unknown',
          action: 'Deposit Request',
          amount: `${d.amount} TON`,
          time: getTimeAgo(d.created_at),
        });
      });

      withdrawals?.forEach(w => {
        result.push({
          id: w.id,
          user_email: profileMap.get(w.user_id) || 'Unknown',
          action: 'Withdraw Request',
          amount: `${w.amount} TON`,
          time: getTimeAgo(w.created_at),
        });
      });

      setActivities(result.slice(0, 5));
    } catch (error) {
      console.error('Error fetching activities:', error);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchActivities();
  }, []);

  return { stats, activities, loading };
}
