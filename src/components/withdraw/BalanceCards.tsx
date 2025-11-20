import { TrendingUp, Users } from 'lucide-react';

interface BalanceCardsProps {
  profitBalance: number;
  referralBalance: number;
}

export const BalanceCards = ({ profitBalance, referralBalance }: BalanceCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-card border border-primary/30 rounded-2xl p-6 neon-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Available Profit</p>
              <p className="text-2xl font-bold neon-text">{profitBalance.toFixed(2)} TON</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-card border border-border/50 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-secondary/50 flex items-center justify-center">
              <Users className="w-6 h-6 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Available Referral</p>
              <p className="text-2xl font-bold text-foreground">{referralBalance.toFixed(2)} TON</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
