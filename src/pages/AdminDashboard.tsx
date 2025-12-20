import { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layouts/AppLayout';
import { StatCard } from '@/components/StatCard';
import { Users, Activity, DollarSign, TrendingUp } from 'lucide-react';
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

const AdminDashboard = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    fetchRecentActivities();
  }, []);

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

  const fetchRecentActivities = async () => {
    try {
      // Fetch recent deposits
      const { data: deposits } = await supabase
        .from('deposits')
        .select('id, amount, created_at, user_id')
        .order('created_at', { ascending: false })
        .limit(3);

      // Fetch recent withdrawals
      const { data: withdrawals } = await supabase
        .from('withdrawals')
        .select('id, amount, created_at, user_id')
        .order('created_at', { ascending: false })
        .limit(3);

      // Get user profiles for deposits
      const depositUserIds = deposits?.map(d => d.user_id) || [];
      const withdrawalUserIds = withdrawals?.map(w => w.user_id) || [];
      const allUserIds = [...new Set([...depositUserIds, ...withdrawalUserIds])];

      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, email')
        .in('id', allUserIds);

      const profileMap = new Map(profiles?.map(p => [p.id, p.email]) || []);

      const activities: RecentActivity[] = [];

      deposits?.forEach(d => {
        activities.push({
          id: d.id,
          user_email: profileMap.get(d.user_id) || 'Unknown',
          action: 'Deposit Request',
          amount: `${d.amount} TON`,
          time: getTimeAgo(d.created_at),
        });
      });

      withdrawals?.forEach(w => {
        activities.push({
          id: w.id,
          user_email: profileMap.get(w.user_id) || 'Unknown',
          action: 'Withdraw Request',
          amount: `${w.amount} TON`,
          time: getTimeAgo(w.created_at),
        });
      });

      // Sort by time
      activities.sort((a, b) => {
        return new Date(b.time).getTime() - new Date(a.time).getTime();
      });

      setRecentActivities(activities.slice(0, 5));
    } catch (error) {
      console.error('Error fetching activities:', error);
    }
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} mins ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hours ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} days ago`;
  };

  return (
    <AppLayout>
      <div className="p-4 md:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Admin <span className="neon-text">Dashboard</span>
            </h1>
            <p className="text-muted-foreground">Monitor platform statistics and user activities</p>
          </div>

          {/* Stats Grid */}
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

          {/* Pending Requests */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-card border border-border/50 rounded-2xl p-6">
              <h2 className="text-xl font-semibold text-foreground mb-4">Pending Deposits</h2>
              <div className="text-4xl font-bold text-primary">{stats?.pending_deposits || 0}</div>
              <p className="text-sm text-muted-foreground mt-2">Waiting for approval</p>
            </div>
            <div className="bg-card border border-border/50 rounded-2xl p-6">
              <h2 className="text-xl font-semibold text-foreground mb-4">Pending Withdrawals</h2>
              <div className="text-4xl font-bold text-orange-400">{stats?.pending_withdrawals || 0}</div>
              <p className="text-sm text-muted-foreground mt-2">Waiting for approval</p>
            </div>
          </div>

          {/* Recent Activities */}
          <div className="bg-card border border-border/50 rounded-2xl p-8">
            <h2 className="text-xl font-semibold text-foreground mb-6">Recent User Activities</h2>
            
            {recentActivities.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No recent activities</div>
            ) : (
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg hover:bg-secondary/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                        <Users className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{activity.user_email}</p>
                        <p className="text-xs text-muted-foreground">{activity.action}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-primary">{activity.amount}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* System Status */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-card border border-border/50 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-muted-foreground">Mining Status</h3>
                <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
              </div>
              <p className="text-2xl font-bold text-foreground">Active</p>
            </div>

            <div className="bg-card border border-border/50 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-muted-foreground">System Health</h3>
                <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
              </div>
              <p className="text-2xl font-bold text-foreground">99.9%</p>
            </div>

            <div className="bg-card border border-border/50 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-muted-foreground">Maintenance</h3>
                <div className="w-3 h-3 rounded-full bg-gray-500"></div>
              </div>
              <p className="text-2xl font-bold text-foreground">Off</p>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default AdminDashboard;
