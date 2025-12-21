import { AppLayout } from '@/components/layouts/AppLayout';
import { AdminStatsGrid } from '@/components/admin/AdminStatsGrid';
import { PendingCards } from '@/components/admin/PendingCards';
import { RecentActivities } from '@/components/admin/RecentActivities';
import { SystemStatus } from '@/components/admin/SystemStatus';
import { useAdminStats } from '@/hooks/useAdminStats';

const AdminDashboard = () => {
  const { stats, activities, loading } = useAdminStats();

  return (
    <AppLayout>
      <div className="p-4 md:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Admin <span className="neon-text">Dashboard</span>
            </h1>
            <p className="text-muted-foreground">Monitor platform statistics</p>
          </div>

          <AdminStatsGrid stats={stats} loading={loading} />
          <PendingCards 
            pendingDeposits={stats?.pending_deposits || 0} 
            pendingWithdrawals={stats?.pending_withdrawals || 0} 
          />
          <RecentActivities activities={activities} />
          <SystemStatus />
        </div>
      </div>
    </AppLayout>
  );
};

export default AdminDashboard;
