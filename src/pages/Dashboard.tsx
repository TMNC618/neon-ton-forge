import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layouts/AppLayout';
import { StatCard } from '@/components/StatCard';
import { MiningCircle } from '@/components/MiningCircle';
import { useAuth } from '@/contexts/AuthContext';
import { Wallet, TrendingUp, Users, Coins, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const Dashboard = () => {
  const { user, profile, loading, refreshProfile } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || !profile) return null;

  const handleStartMining = async () => {
    try {
      const { error } = await supabase.rpc('start_mining');
      if (error) throw error;
      toast.success('Mining started!');
      await refreshProfile();
    } catch (error: any) {
      toast.error(error.message || 'Failed to start mining');
    }
  };

  const handleStopMining = async () => {
    try {
      const { data, error } = await supabase.rpc('stop_mining');
      if (error) throw error;
      toast.success(`Mining stopped! Earned: ${Number(data).toFixed(6)} TON`);
      await refreshProfile();
    } catch (error: any) {
      toast.error(error.message || 'Failed to stop mining');
    }
  };

  return (
    <AppLayout>
      <div className="p-4 md:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Welcome back, <span className="neon-text">{profile.username}</span>
            </h1>
            <p className="text-muted-foreground">Monitor your mining operations and earnings</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              icon={Wallet}
              label="TON Balance"
              value={profile.balance.toFixed(2)}
              subValue="TON"
              glowing
            />
            <StatCard
              icon={Coins}
              label="TERA Balance"
              value={profile.tera_balance.toFixed(2)}
              subValue="TERA"
            />
            <StatCard
              icon={TrendingUp}
              label="Earning Profit"
              value={profile.earning_profit.toFixed(2)}
              subValue="TON"
              trend="up"
            />
            <StatCard
              icon={Users}
              label="Earning Referral"
              value={profile.earning_referral.toFixed(2)}
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
                miningBalance={profile.mining_balance}
                isActive={profile.mining_active}
                lastMiningStart={profile.last_mining_start ? new Date(profile.last_mining_start).getTime() : undefined}
              />

              <div className="mt-8 space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Mining Balance:</span>
                  <span className="font-semibold text-foreground">{profile.mining_balance} TON</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Daily Profit Rate:</span>
                  <span className="font-semibold text-primary">1.00%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Expected Daily Profit:</span>
                  <span className="font-semibold text-foreground">
                    {(profile.mining_balance * 0.01).toFixed(4)} TON
                  </span>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                {!profile.mining_active ? (
                  <Button
                    onClick={handleStartMining}
                    disabled={profile.mining_balance <= 0}
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
                    Stop Mining & Claim
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
                onClick={() => navigate('/deposit')}
                className="h-24 flex flex-col items-center justify-center gap-2 border-primary/30 hover:bg-primary/10"
              >
                <Wallet className="w-6 h-6 text-primary" />
                <span>Deposit TON</span>
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate('/withdraw')}
                className="h-24 flex flex-col items-center justify-center gap-2 border-primary/30 hover:bg-primary/10"
              >
                <TrendingUp className="w-6 h-6 text-primary" />
                <span>Withdraw Profit</span>
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate('/referral')}
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
