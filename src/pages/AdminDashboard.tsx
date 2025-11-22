import { AppLayout } from '@/components/layouts/AppLayout';
import { StatCard } from '@/components/StatCard';
import { Users, Activity, DollarSign, TrendingUp } from 'lucide-react';

const AdminDashboard = () => {
  const recentActivities = [
    { user: 'user@example.com', action: 'Deposit Request', amount: '50 TON', time: '5 mins ago' },
    { user: 'demo@mining.com', action: 'Withdraw Request', amount: '25 TON', time: '12 mins ago' },
    { user: 'newuser@ton.com', action: 'New Registration', amount: '-', time: '30 mins ago' },
    { user: 'investor@ton.com', action: 'Mining Started', amount: '100 TON', time: '1 hour ago' },
    { user: 'trader@ton.com', action: 'Swap Completed', amount: '75 TON', time: '2 hours ago' },
  ];

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
              value="1,234"
              subValue="+45 this week"
              trend="up"
              glowing
            />
            <StatCard
              icon={Activity}
              label="Active Users"
              value="856"
              subValue="69% active rate"
              trend="up"
            />
            <StatCard
              icon={DollarSign}
              label="Total Deposit"
              value="45,678"
              subValue="TON"
              trend="up"
            />
            <StatCard
              icon={TrendingUp}
              label="Platform Fees"
              value="1,234"
              subValue="TON earned"
              trend="up"
            />
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* User Growth */}
            <div className="bg-card border border-border/50 rounded-2xl p-8">
              <h2 className="text-xl font-semibold text-foreground mb-6">User Growth</h2>
              <div className="h-64 flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <Activity className="w-16 h-16 mx-auto mb-4 text-primary opacity-50" />
                  <p>User growth chart</p>
                  <p className="text-sm mt-2">Visualization placeholder</p>
                </div>
              </div>
            </div>

            {/* Revenue Stats */}
            <div className="bg-card border border-border/50 rounded-2xl p-8">
              <h2 className="text-xl font-semibold text-foreground mb-6">Revenue Overview</h2>
              <div className="h-64 flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <TrendingUp className="w-16 h-16 mx-auto mb-4 text-primary opacity-50" />
                  <p>Revenue chart</p>
                  <p className="text-sm mt-2">Visualization placeholder</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activities */}
          <div className="bg-card border border-border/50 rounded-2xl p-8">
            <h2 className="text-xl font-semibold text-foreground mb-6">Recent User Activities</h2>
            
            <div className="space-y-4">
              {recentActivities.map((activity, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg hover:bg-secondary/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <Users className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{activity.user}</p>
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
