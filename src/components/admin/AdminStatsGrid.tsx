import { StatCard } from '@/components/StatCard';
import { Users, Activity, DollarSign, TrendingUp } from 'lucide-react';

interface AdminStats {
  total_users: number;
  active_users: number;
  total_deposits: number;
  total_mining_balance: number;
}

interface AdminStatsGridProps {
  stats: AdminStats | null;
  loading: boolean;
}

export function AdminStatsGrid({ stats, loading }: AdminStatsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        icon={Users}
        label="Total Users"
        value={loading ? '...' : stats?.total_users?.toString() || '0'}
        subValue={`${stats?.active_users || 0} active`}
        trend="up"
        glowing
      />
      <StatCard
        icon={Activity}
        label="Active Mining"
        value={loading ? '...' : stats?.active_users?.toString() || '0'}
        subValue="users mining"
        trend="up"
      />
      <StatCard
        icon={DollarSign}
        label="Total Deposits"
        value={loading ? '...' : stats?.total_deposits?.toFixed(2) || '0'}
        subValue="TON"
        trend="up"
      />
      <StatCard
        icon={TrendingUp}
        label="Total Mining Balance"
        value={loading ? '...' : stats?.total_mining_balance?.toFixed(2) || '0'}
        subValue="TON"
        trend="up"
      />
    </div>
  );
}
