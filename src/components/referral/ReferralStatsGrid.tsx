import { Users, TrendingUp } from 'lucide-react';

interface ReferralStatsGridProps {
  totalReferrals: number;
  activeReferrals: number;
  totalEarnings: number;
  thisMonthEarnings: number;
}

export function ReferralStatsGrid({ 
  totalReferrals, 
  activeReferrals, 
  totalEarnings, 
  thisMonthEarnings 
}: ReferralStatsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-card border neon-border rounded-2xl p-6">
        <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4">
          <Users className="w-6 h-6 text-primary" />
        </div>
        <p className="text-sm text-muted-foreground mb-1">Total Referrals</p>
        <p className="text-3xl font-bold neon-text">{totalReferrals}</p>
      </div>

      <div className="bg-card border border-border/50 rounded-2xl p-6">
        <div className="w-12 h-12 rounded-lg bg-secondary/50 flex items-center justify-center mb-4">
          <Users className="w-6 h-6 text-muted-foreground" />
        </div>
        <p className="text-sm text-muted-foreground mb-1">Active Referrals</p>
        <p className="text-3xl font-bold text-foreground">{activeReferrals}</p>
      </div>

      <div className="bg-card border border-border/50 rounded-2xl p-6">
        <div className="w-12 h-12 rounded-lg bg-secondary/50 flex items-center justify-center mb-4">
          <TrendingUp className="w-6 h-6 text-muted-foreground" />
        </div>
        <p className="text-sm text-muted-foreground mb-1">Total Earnings</p>
        <p className="text-3xl font-bold text-foreground">{totalEarnings.toFixed(2)} TON</p>
      </div>

      <div className="bg-card border border-border/50 rounded-2xl p-6">
        <div className="w-12 h-12 rounded-lg bg-secondary/50 flex items-center justify-center mb-4">
          <TrendingUp className="w-6 h-6 text-muted-foreground" />
        </div>
        <p className="text-sm text-muted-foreground mb-1">This Month</p>
        <p className="text-3xl font-bold text-foreground">{thisMonthEarnings.toFixed(2)} TON</p>
      </div>
    </div>
  );
}
