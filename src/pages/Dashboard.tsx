import { AppLayout } from '@/components/layouts/AppLayout';
import { StatCard } from '@/components/StatCard';
import { MiningCircle } from '@/components/MiningCircle';
import { useAuth } from '@/contexts/AuthContext';
import { Wallet, TrendingUp, Users, Coins } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Dashboard = () => {
  const { user, updateUser } = useAuth();

  if (!user) return null;

  const handleStartMining = () => {
    if (!user.miningActive) {
      updateUser({
        miningActive: true,
        lastMiningStart: Date.now(),
      });
    }
  };

  const handleStopMining = () => {
    if (user.miningActive) {
      updateUser({
        miningActive: false,
      });
    }
  };

  return (
    <AppLayout>
      <div className="p-4 md:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Welcome back, <span className="neon-text">{user.username}</span>
            </h1>
            <p className="text-muted-foreground">Monitor your mining operations and earnings</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              icon={Wallet}
              label="TON Balance"
              value={user.balance.toFixed(2)}
              subValue="TON"
              glowing
            />
            <StatCard
              icon={Coins}
              label="TERA Balance"
              value={user.teraBalance.toFixed(2)}
              subValue="TERA"
            />
            <StatCard
              icon={TrendingUp}
              label="Earning Profit"
              value={user.earningProfit.toFixed(2)}
              subValue="TON"
              trend="up"
            />
            <StatCard
              icon={Users}
              label="Earning Referral"
              value={user.earningReferral.toFixed(2)}
              subValue="TON"
              trend="up"
            />
          </div>

          {/* Mining Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Mining Circle */}
            <div className="bg-card border border-border/50 rounded-2xl p-8">
              <h2 className="text-xl font-semibold text-foreground mb-6">Mining Status</h2>
              
              <MiningCircle
                miningBalance={user.miningBalance}
                isActive={user.miningActive}
                lastMiningStart={user.lastMiningStart}
              />

              <div className="mt-8 space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Mining Balance:</span>
                  <span className="font-semibold text-foreground">{user.miningBalance} TON</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Daily Profit Rate:</span>
                  <span className="font-semibold text-primary">1.00%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Expected Daily Profit:</span>
                  <span className="font-semibold text-foreground">
                    {(user.miningBalance * 0.01).toFixed(4)} TON
                  </span>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                {!user.miningActive ? (
                  <Button
                    onClick={handleStartMining}
                    className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    Start Mining
                  </Button>
                ) : (
                  <Button
                    onClick={handleStopMining}
                    variant="destructive"
                    className="flex-1"
                  >
                    Stop Mining
                  </Button>
                )}
              </div>
            </div>

            {/* Mining History */}
            <div className="bg-card border border-border/50 rounded-2xl p-8">
              <h2 className="text-xl font-semibold text-foreground mb-6">Mining History</h2>
              
              <div className="space-y-4">
                {[
                  { date: '2024-01-20', profit: 1.05, status: 'completed' },
                  { date: '2024-01-19', profit: 1.02, status: 'completed' },
                  { date: '2024-01-18', profit: 0.98, status: 'completed' },
                  { date: '2024-01-17', profit: 1.01, status: 'completed' },
                  { date: '2024-01-16', profit: 0.99, status: 'completed' },
                ].map((record, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg hover:bg-secondary/50 transition-colors"
                  >
                    <div>
                      <p className="text-sm font-medium text-foreground">{record.date}</p>
                      <p className="text-xs text-muted-foreground">24 hours mining</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-primary">
                        +{record.profit.toFixed(4)} TON
                      </p>
                      <p className="text-xs text-green-500">Completed</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-card border border-border/50 rounded-2xl p-8">
            <h2 className="text-xl font-semibold text-foreground mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                variant="outline"
                className="h-24 flex flex-col items-center justify-center gap-2 border-primary/30 hover:bg-primary/10"
              >
                <Wallet className="w-6 h-6 text-primary" />
                <span>Deposit TON</span>
              </Button>
              <Button
                variant="outline"
                className="h-24 flex flex-col items-center justify-center gap-2 border-primary/30 hover:bg-primary/10"
              >
                <TrendingUp className="w-6 h-6 text-primary" />
                <span>Withdraw Profit</span>
              </Button>
              <Button
                variant="outline"
                className="h-24 flex flex-col items-center justify-center gap-2 border-primary/30 hover:bg-primary/10"
              >
                <Users className="w-6 h-6 text-primary" />
                <span>Invite Friends</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
