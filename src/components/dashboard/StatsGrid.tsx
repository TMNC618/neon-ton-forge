import { StatCard } from '@/components/StatCard';
import { Wallet, TrendingUp, Users, Coins } from 'lucide-react';
import { Profile } from '@/hooks/useAuthState';

interface StatsGridProps {
  profile: Profile;
}

export function StatsGrid({ profile }: StatsGridProps) {
  return (
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
  );
}
